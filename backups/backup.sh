#!/bin/bash
# QANI PostgreSQL Backup Script
# Runs daily via cron — keeps last 7 days

BACKUP_DIR="/home/qani/backups"
DB_NAME="qani_prod"
DB_USER="qani_user"
DATE=$(date +%Y-%m-%d_%H-%M)
BACKUP_FILE="$BACKUP_DIR/qani_backup_$DATE.sql"

PGPASSWORD='Qani@Secure2026!' pg_dump -U $DB_USER -h localhost $DB_NAME > $BACKUP_FILE

if [ $? -eq 0 ]; then
  echo "Backup successful: $BACKUP_FILE"
  gzip $BACKUP_FILE
  # Keep only last 7 backups
  ls -t $BACKUP_DIR/qani_backup_*.sql.gz | tail -n +8 | xargs -r rm
  echo "Old backups cleaned. Current backups:"
  ls -lh $BACKUP_DIR/
else
  echo "Backup FAILED"
  exit 1
fi
