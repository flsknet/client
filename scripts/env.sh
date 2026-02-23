#!/usr/bin/env sh

env | grep "^VITE_" | while IFS='=' read -r key value; do
    find "/usr/share/nginx/html" -type f \
        -exec sed -i "s|_${key}|${value}|g" {} +
done