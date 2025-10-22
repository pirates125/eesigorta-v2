use anyhow::{Context, Result};
use sqlx::SqlitePool;
use uuid::Uuid;

use super::models::{Quote, CreateQuoteRequest};

pub async fn create_quote(
    pool: &SqlitePool,
    user_id: &str,
    request: CreateQuoteRequest,
    premium_net: f64,
    premium_gross: f64,
) -> Result<Quote> {
    let id = Uuid::new_v4().to_string();
    let now = chrono::Utc::now().to_rfc3339();
    
    // Get first provider from the list (or empty string if empty)
    let provider = request.providers.first().map(|s| s.as_str()).unwrap_or("");

    let quote = sqlx::query_as::<_, Quote>(
        r#"
        INSERT INTO quotes 
        (id, user_id, provider, product_type, premium_net, premium_gross, vehicle_plate, tckn, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active', ?)
        RETURNING *
        "#,
    )
    .bind(&id)
    .bind(user_id)
    .bind(provider)
    .bind(&request.product_type)
    .bind(premium_net)
    .bind(premium_gross)
    .bind(&request.vehicle_plate)
    .bind(&request.tckn)
    .bind(&now)
    .fetch_one(pool)
    .await
    .context("Failed to create quote")?;

    Ok(quote)
}

pub async fn list_user_quotes(pool: &SqlitePool, user_id: &str) -> Result<Vec<Quote>> {
    let quotes = sqlx::query_as::<_, Quote>(
        "SELECT * FROM quotes WHERE user_id = ? ORDER BY created_at DESC"
    )
    .bind(user_id)
    .fetch_all(pool)
    .await
    .context("Failed to list user quotes")?;

    Ok(quotes)
}

pub async fn get_quote_by_id(pool: &SqlitePool, quote_id: &str) -> Result<Option<Quote>> {
    let quote = sqlx::query_as::<_, Quote>("SELECT * FROM quotes WHERE id = ?")
        .bind(quote_id)
        .fetch_optional(pool)
        .await
        .context("Failed to fetch quote")?;

    Ok(quote)
}

pub async fn list_all_quotes(pool: &SqlitePool) -> Result<Vec<Quote>> {
    let quotes = sqlx::query_as::<_, Quote>("SELECT * FROM quotes ORDER BY created_at DESC")
        .fetch_all(pool)
        .await
        .context("Failed to list all quotes")?;

    Ok(quotes)
}

