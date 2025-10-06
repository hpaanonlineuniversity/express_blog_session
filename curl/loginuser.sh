#!/bin/bash
# loginuser.sh
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "user01",
    "password": "password"
  }' \
  -c cookies.txt \
  -b cookies.txt