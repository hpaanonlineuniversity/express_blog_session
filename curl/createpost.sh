#!/bin/bash
TITLE="My fifth Post"
CONTENT="This is the post content"

curl -v -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d "{\"title\": \"$TITLE\", \"content\": \"$CONTENT\"}" \
  -b cookies.txt \
  -c cookies.txt 
  
