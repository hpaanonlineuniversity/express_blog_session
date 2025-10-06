#!/bin/bash
# logout.sh
curl -X POST http://localhost:3000/auth/logout \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -b cookies.txt

# Remove cookie file
rm -f cookies.txt
echo "Logged out successfully"