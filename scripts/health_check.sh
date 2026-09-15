#!/bin/bash
# Daily health check: SSL cert expiry + site availability.
# Emails hello@qani.io via SendGrid if either check fails.

SENDGRID_KEY=$(grep '^SENDGRID_API_KEY=' /home/qani/backend/.env | cut -d= -f2-)
ALERT_TO="hello@qani.io"
DOMAIN="qani.io"
EXPIRY_WARN_DAYS=14

send_alert() {
  local subject="$1"
  local body="$2"
  curl -s -X POST "https://api.sendgrid.com/v3/mail/send" \
    -H "Authorization: Bearer ${SENDGRID_KEY}" \
    -H "Content-Type: application/json" \
    -d "{\"personalizations\":[{\"to\":[{\"email\":\"${ALERT_TO}\"}]}],\"from\":{\"email\":\"alerts@qani.io\"},\"subject\":\"${subject}\",\"content\":[{\"type\":\"text/plain\",\"value\":\"${body}\"}]}" \
    > /dev/null 2>&1
}

# Check 1: certificate expiry
EXPIRY_DATE=$(echo | openssl s_client -connect ${DOMAIN}:443 -servername ${DOMAIN} 2>/dev/null | openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2)
if [ -z "$EXPIRY_DATE" ]; then
  send_alert "QANI ALERT: Could not check SSL certificate" "openssl could not retrieve a certificate for ${DOMAIN} at all. The site may be down or the cert may be broken."
else
  EXPIRY_EPOCH=$(date -d "$EXPIRY_DATE" +%s)
  NOW_EPOCH=$(date +%s)
  DAYS_LEFT=$(( (EXPIRY_EPOCH - NOW_EPOCH) / 86400 ))
  if [ "$DAYS_LEFT" -lt "$EXPIRY_WARN_DAYS" ]; then
    send_alert "QANI ALERT: SSL certificate expires in ${DAYS_LEFT} days" "The certificate for ${DOMAIN} expires on ${EXPIRY_DATE} (${DAYS_LEFT} days left). Check certbot renewal — run 'certbot renew --dry-run' on the server to diagnose."
  fi
fi

# Check 2: site availability
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 https://${DOMAIN})
if [ "$HTTP_CODE" != "200" ]; then
  send_alert "QANI ALERT: Site returned ${HTTP_CODE}" "https://${DOMAIN} returned HTTP ${HTTP_CODE} instead of 200 at $(date -u)."
fi
