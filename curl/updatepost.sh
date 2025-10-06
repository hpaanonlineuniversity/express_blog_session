#!/bin/bash

# Update a post by ID
POST_ID="68e1e12194cec779bde7e22c"
TITLE="My third Post"
CONTENT="This is the updated content"

curl -v -X PUT http://localhost:3000/posts/$POST_ID \
  -H "Content-Type: application/json" \
  -d "{\"title\": \"$TITLE\", \"content\": \"$CONTENT\"}"
