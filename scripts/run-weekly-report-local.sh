#!/bin/bash

# Script to manually trigger weekly report generation locally
# Usage: ./scripts/run-weekly-report-local.sh

# Default to localhost:3000 if PORT is not set
PORT=${PORT:-3000}
URL="http://localhost:${PORT}/api/weekly-report"

echo "Triggering weekly report generation..."
echo "URL: ${URL}"
echo ""

# Make POST request
response=$(curl -X POST "${URL}" \
  -H "Content-Type: application/json" \
  -w "\nHTTP Status: %{http_code}\n" \
  -s)

echo "$response"

# Check if the request was successful
if echo "$response" | grep -q '"success":true'; then
  echo ""
  echo "✅ Report generated successfully!"
else
  echo ""
  echo "❌ Report generation failed. Check the error message above."
  echo ""
  echo "Note: This endpoint requires authentication. Make sure you're logged in"
  echo "with an admin account, or use a tool like Postman with proper auth headers."
fi

