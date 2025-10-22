#!/usr/bin/env python3
"""
Sompo Scraper - Stdin/Stdout Wrapper
Rust backend ile JSON üzerinden iletişim kurar
"""
import sys
import json
import asyncio
import os
from dotenv import load_dotenv

# .env dosyasını yükle
env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(env_path)

# Parent dizini path'e ekle
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from app.connectors.sompo import SompoConnector


async def fetch_quote(request: dict) -> dict:
    """
    Sompo'dan teklif al - Acente için
    
    Request format:
    {
        "product_type": "trafik",
        "vehicle_plate": "34ABC123",
        "tckn": "12345678901"
    }
    
    Response format:
    {
        "success": true,
        "company": "Sompo Sigorta",
        "premium": {"net": 3500.00, "gross": 4130.00, "currency": "TRY"},
        "message": "..."
    }
    """
    try:
        connector = SompoConnector()
        
        # Sompo connector'a uygun formatta payload hazırla
        payload = {
            "product_type": request.get("product_type", "trafik"),
            "plate": request.get("vehicle_plate", ""),
            "tckn": request.get("tckn", ""),
        }
        
        result = await connector.fetch_quote(payload)
        
        # Connector'dan gelen sonucu standart formata çevir
        if result.get("success"):
            # Sompo'nun döndürdüğü formattan standart formata
            premium_data = result.get("data", {})
            
            return {
                "success": True,
                "company": "Sompo Sigorta",
                "premium": {
                    "net": float(premium_data.get("net_premium", 0)),
                    "gross": float(premium_data.get("gross_premium", 0)),
                    "currency": "TRY"
                },
                "message": result.get("message", "Teklif başarıyla alındı"),
                "details": premium_data  # Ek detaylar
            }
        else:
            return {
                "success": False,
                "error": result.get("error", "Teklif alınamadı")
            }
            
    except Exception as e:
        import traceback
        return {
            "success": False,
            "error": f"Sompo scraper hatası: {str(e)}",
            "traceback": traceback.format_exc()
        }


async def main():
    """Ana fonksiyon: stdin'den oku, işle, stdout'a yaz"""
    try:
        # Stdin'den JSON oku
        input_data = sys.stdin.read()
        request = json.loads(input_data)
        
        # Teklif al
        result = await fetch_quote(request)
        
        # Stdout'a JSON yaz
        print(json.dumps(result, ensure_ascii=False))
        
    except json.JSONDecodeError as e:
        error_response = {
            "success": False,
            "error": f"Invalid JSON input: {str(e)}"
        }
        print(json.dumps(error_response, ensure_ascii=False))
        sys.exit(1)
        
    except Exception as e:
        error_response = {
            "success": False,
            "error": f"Scraper error: {str(e)}"
        }
        print(json.dumps(error_response, ensure_ascii=False))
        sys.stderr.write(f"ERROR: {str(e)}\n")
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())

