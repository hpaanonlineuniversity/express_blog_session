#!/bin/bash

echo "Getting all posts..."
curl -s -X GET http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -b cookies.txt \
  -c cookies.txt

echo ""  # Add a newline for better formatting