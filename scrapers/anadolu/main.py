#!/usr/bin/env python3
"""
Anadolu Sigorta Scraper - Stdin/Stdout Wrapper
"""
import sys
import json
import asyncio
import os

# Parent dizini path'e ekle
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))


async def fetch_quote(request: dict) -> dict:
    """
    Anadolu Sigorta'dan teklif al
    TODO: Gerçek scraper implementasyonu eklenecek
    """
    try:
        # Mock response - gerçek implementasyon eklenecek
        return {
            "success": True,
            "company": "Anadolu Sigorta",
            "premium": {
                "net": 0,
                "gross": 0,
                "currency": "TRY"
            },
            "message": "Anadolu Sigorta - Coming soon..."
        }
            
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
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

