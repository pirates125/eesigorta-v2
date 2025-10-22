use anyhow::{Context, Result};
use sqlx::SqlitePool;
use uuid::Uuid;

use crate::auth;
use super::models::{User, CreateUserRequest, UpdateUserRequest};

pub async fn create_user(
    pool: &SqlitePool,
    request: CreateUserRequest,
) -> Result<User> {
    let id = Uuid::new_v4().to_string();
    let password_hash = auth::hash_password(&request.password)?;
    let now = chrono::Utc::now().to_rfc3339();

    let user = sqlx::query_as::<_, User>(
        r#"
        INSERT INTO users (id, email, password_hash, full_name, phone, role, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, 'user', ?, ?)
        RETURNING *
        "#,
    )
    .bind(&id)
    .bind(&request.email)
    .bind(&password_hash)
    .bind(&request.full_name)
    .bind(&request.phone)
    .bind(&now)
    .bind(&now)
    .fetch_one(pool)
    .await
    .context("Failed to create user")?;

    Ok(user)
}

pub async fn get_user_by_email(pool: &SqlitePool, email: &str) -> Result<Option<User>> {
    let user = sqlx::query_as::<_, User>("SELECT * FROM users WHERE email = ?")
        .bind(email)
        .fetch_optional(pool)
        .await
        .context("Failed to fetch user by email")?;

    Ok(user)
}

pub async fn get_user_by_id(pool: &SqlitePool, user_id: &str) -> Result<Option<User>> {
    let user = sqlx::query_as::<_, User>("SELECT * FROM users WHERE id = ?")
        .bind(user_id)
        .fetch_optional(pool)
        .await
        .context("Failed to fetch user by id")?;

    Ok(user)
}

pub async fn update_user_profile(
    pool: &SqlitePool,
    user_id: &str,
    request: UpdateUserRequest,
) -> Result<User> {
    let now = chrono::Utc::now().to_rfc3339();

    let user = sqlx::query_as::<_, User>(
        r#"
        UPDATE users 
        SET full_name = COALESCE(?, full_name),
            phone = COALESCE(?, phone),
            updated_at = ?
        WHERE id = ?
        RETURNING *
        "#,
    )
    .bind(&request.full_name)
    .bind(&request.phone)
    .bind(&now)
    .bind(user_id)
    .fetch_one(pool)
    .await
    .context("Failed to update user profile")?;

    Ok(user)
}

pub async fn change_password(
    pool: &SqlitePool,
    user_id: &str,
    old_password: &str,
    new_password: &str,
) -> Result<()> {
    let user = get_user_by_id(pool, user_id)
        .await?
        .context("User not found")?;

    if !auth::verify_password(old_password, &user.password_hash)? {
        anyhow::bail!("Invalid old password");
    }

    let new_hash = auth::hash_password(new_password)?;
    let now = chrono::Utc::now().to_rfc3339();

    sqlx::query("UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?")
        .bind(&new_hash)
        .bind(&now)
        .bind(user_id)
        .execute(pool)
        .await
        .context("Failed to update password")?;

    Ok(())
}

pub async fn list_all_users(pool: &SqlitePool) -> Result<Vec<User>> {
    let users = sqlx::query_as::<_, User>("SELECT * FROM users ORDER BY created_at DESC")
        .fetch_all(pool)
        .await
        .context("Failed to list users")?;

    Ok(users)
}

