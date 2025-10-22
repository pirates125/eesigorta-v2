use anyhow::{Context, Result};
use sqlx::SqlitePool;
use uuid::Uuid;

use super::models::Policy;

pub async fn create_policy(
    pool: &SqlitePool,
    quote_id: &str,
    user_id: &str,
    provider: &str,
) -> Result<Policy> {
    let id = Uuid::new_v4().to_string();
    let now = chrono::Utc::now().to_rfc3339();

    let policy = sqlx::query_as::<_, Policy>(
        r#"
        INSERT INTO policies 
        (id, quote_id, user_id, provider, status, created_at)
        VALUES (?, ?, ?, ?, 'pending', ?)
        RETURNING *
        "#,
    )
    .bind(&id)
    .bind(quote_id)
    .bind(user_id)
    .bind(provider)
    .bind(&now)
    .fetch_one(pool)
    .await
    .context("Failed to create policy")?;

    Ok(policy)
}

pub async fn list_user_policies(pool: &SqlitePool, user_id: &str) -> Result<Vec<Policy>> {
    let policies = sqlx::query_as::<_, Policy>(
        "SELECT * FROM policies WHERE user_id = ? ORDER BY created_at DESC"
    )
    .bind(user_id)
    .fetch_all(pool)
    .await
    .context("Failed to list user policies")?;

    Ok(policies)
}

pub async fn get_policy_by_id(pool: &SqlitePool, policy_id: &str) -> Result<Option<Policy>> {
    let policy = sqlx::query_as::<_, Policy>("SELECT * FROM policies WHERE id = ?")
        .bind(policy_id)
        .fetch_optional(pool)
        .await
        .context("Failed to fetch policy")?;

    Ok(policy)
}

pub async fn list_all_policies(pool: &SqlitePool) -> Result<Vec<Policy>> {
    let policies = sqlx::query_as::<_, Policy>("SELECT * FROM policies ORDER BY created_at DESC")
        .fetch_all(pool)
        .await
        .context("Failed to list all policies")?;

    Ok(policies)
}

