use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize)]
pub struct ScraperRequest {
    pub product_type: String,
    pub vehicle_plate: Option<String>,
    pub tckn: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub extras: Option<serde_json::Value>,
}

#[derive(Debug, Deserialize)]
pub struct ScraperResponse {
    pub success: bool,
    pub company: Option<String>,
    pub premium: Option<PremiumInfo>,
    pub message: Option<String>,
    pub error: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct PremiumInfo {
    pub net: f64,
    pub gross: f64,
    pub currency: String,
}

