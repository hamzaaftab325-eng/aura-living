#!/bin/bash
cd /home/z/my-project
while true; do
  NODE_ENV=production node .next/standalone/server.js >> /home/z/my-project/prod.log 2>&1
  echo "[$(date)] Exited, restarting in 2s..." >> /home/z/my-project/prod.log
  sleep 2
done
