#!/bin/bash
# Test script for scrapers

echo "🧪 Testing Sompo Scraper..."
echo '{"product_type":"trafik","vehicle_plate":"34ABC123","tckn":"12345678901"}' | \
  python3 scrapers/sompo/main.py

echo ""
echo "✅ Test completed!"

