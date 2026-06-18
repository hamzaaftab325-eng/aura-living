#!/bin/bash
# Persistent server runner — auto-restarts if Next 16 server exits
cd /home/z/my-project
while true; do
  NODE_ENV=production node .next/standalone/server.js >> /home/z/my-project/prod.log 2>&1
  EXIT_CODE=$?
  echo "[$(date '+%H:%M:%S')] Server exited with code $EXIT_CODE, restarting in 2s..." >> /home/z/my-project/prod.log
  sleep 2
done
