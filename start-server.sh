#!/bin/bash
cd /home/z/my-project
# Kill any existing
pkill -f "server.js" 2>/dev/null
sleep 1
# Start with full detachment — no controlling terminal, no pipe inheritance
nohup setsid env NODE_ENV=production node .next/standalone/server.js </dev/null >/home/z/my-project/prod.log 2>&1 &
echo $! > /home/z/my-project/server.pid
sleep 3
# Verify it's running
if ss -ltn 2>/dev/null | grep -q ":3000"; then
  echo "SERVER_ALIVE"
else
  echo "SERVER_DEAD"
fi
