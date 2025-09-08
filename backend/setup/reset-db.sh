#!/bin/bash
set -e

# === DIR CONFIG ===
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
DB_DIR="$SCRIPT_DIR/../../db"
DB_BACKUP_DIR="$SCRIPT_DIR/../../backups/db"

# === TIMESTAMP ===
TIMESTAMP=$(date +"%y%m%d_%H%M")

# === FILE CONFIG ===
DB_FILE="$DB_DIR/trades.db"
DB_BACKUP_FILE="$DB_BACKUP_DIR/trades_$TIMESTAMP.db"
SCHEMA_FILE="$SCRIPT_DIR/schema.sql"
SEED_FILE="$SCRIPT_DIR/seed.sql"

# === COLORS ===
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# === START ===
echo -e "${CYAN}🔄 Resetting SQLite DB...${NC}"

# Ensure backup dir exists
mkdir -p "$DB_BACKUP_DIR"

# Backup if DB exists
if [ -f "$DB_FILE" ]; then
  cp "$DB_FILE" "$DB_BACKUP_FILE"
  echo -e "${GREEN}✅ Backed up to $DB_BACKUP_FILE${NC}"
  rm "$DB_FILE"
  echo -e "${YELLOW}🗑️ Removed old DB file${NC}"
else
  echo -e "${YELLOW}⚠️ No existing DB file found, skipping backup${NC}"
fi

# Create fresh DB with schema
if sqlite3 "$DB_FILE" < "$SCHEMA_FILE"; then
  echo -e "${GREEN}✅ Schema applied${NC}"
else
  echo -e "${RED}❌ Failed to apply schema${NC}"
  exit 1
fi

# Seed DB
if sqlite3 "$DB_FILE" < "$SEED_FILE"; then
  echo -e "${GREEN}✅ Seed data inserted${NC}"
else
  echo -e "${RED}❌ Failed to insert seed data${NC}"
  exit 1
fi

echo -e "${CYAN}🎉 DB reset complete!${NC}"
