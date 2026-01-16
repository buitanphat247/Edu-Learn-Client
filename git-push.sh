#!/bin/bash

# Script để tự động add, commit và push lên git
# Usage: ./git-push.sh "commit message"

# Lấy commit message từ tham số hoặc dùng message mặc định
COMMIT_MSG=${1:-"chore: update code"}

# Màu sắc cho output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Đang add tất cả thay đổi...${NC}"
git add -A

if [ $? -ne 0 ]; then
    echo -e "${RED}Lỗi khi add files!${NC}"
    exit 1
fi

echo -e "${YELLOW}Đang commit với message: ${COMMIT_MSG}${NC}"
git commit -m "$COMMIT_MSG"

if [ $? -ne 0 ]; then
    echo -e "${RED}Lỗi khi commit!${NC}"
    exit 1
fi

echo -e "${YELLOW}Đang push lên origin main...${NC}"
git push origin main

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Đã push thành công!${NC}"
else
    echo -e "${RED}✗ Lỗi khi push!${NC}"
    exit 1
fi
