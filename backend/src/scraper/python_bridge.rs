use anyhow::{Context, Result};
use tokio::io::AsyncWriteExt;
use tokio::process::Command;
use std::time::Duration;

use super::models::{ScraperRequest, ScraperResponse};

pub async fn call_python_scraper(
    provider: &str,
    request: ScraperRequest,
) -> Result<ScraperResponse> {
    // Python scraper script yolu (backend dizininden relative)
    let script_path = format!("../scrapers/{}/main.py", provider);
    
    tracing::info!("🔍 Calling Python scraper: {}", provider);
    tracing::info!("📄 Script path: {}", script_path);
    tracing::info!("📦 Request: {:?}", request);

    // Python process'i başlat
    let mut child = Command::new("python3")
        .arg(&script_path)
        .stdin(std::process::Stdio::piped())
        .stdout(std::process::Stdio::piped())
        .stderr(std::process::Stdio::piped())
        .spawn()
        .context(format!("Failed to spawn Python scraper for {}", provider))?;

    // JSON request'i stdin'e yaz
    if let Some(mut stdin) = child.stdin.take() {
        let json_data = serde_json::to_string(&request)?;
        tracing::info!("📤 Sending to scraper: {}", json_data);
        stdin.write_all(json_data.as_bytes()).await?;
        stdin.flush().await?;
        drop(stdin); // stdin'i kapat
    }

    // Timeout ile process'i bekle (2 dakika)
    tracing::info!("⏳ Waiting for scraper response (max 120s)...");
    let output = tokio::time::timeout(
        Duration::from_secs(120),
        child.wait_with_output()
    )
    .await
    .context("Python scraper timeout (2 minutes)")?
    .context("Failed to wait for Python scraper")?;

    // stderr'i log et
    if !output.stderr.is_empty() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        tracing::error!("❌ Python scraper stderr: {}", stderr);
    }

    // stdout'u log et
    if !output.stdout.is_empty() {
        let stdout = String::from_utf8_lossy(&output.stdout);
        tracing::info!("📥 Python scraper stdout: {}", stdout);
    }

    // stdout'dan response'u parse et
    if output.status.success() {
        let response: ScraperResponse = serde_json::from_slice(&output.stdout)
            .context("Failed to parse Python scraper response")?;
        
        tracing::info!("✅ Scraper response parsed successfully: {:?}", response);
        Ok(response)
    } else {
        let stderr = String::from_utf8_lossy(&output.stderr);
        let stdout = String::from_utf8_lossy(&output.stdout);
        tracing::error!("❌ Python scraper failed!");
        tracing::error!("Exit code: {:?}", output.status.code());
        tracing::error!("stderr: {}", stderr);
        tracing::error!("stdout: {}", stdout);
        anyhow::bail!("Python scraper failed: {}", stderr)
    }
}

