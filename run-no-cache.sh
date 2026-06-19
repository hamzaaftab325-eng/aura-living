#!/bin/bash
cd /home/z/my-project
pkill -f "server.js" 2>/dev/null
sleep 1

# Create a wrapper Node script that patches the HTTP response
cat > /tmp/no-cache-server.js << 'SCRIPT'
const http = require('http');
const nextServer = require('/home/z/my-project/.next/standalone/server.js');
SCRIPT

# Actually, let's just use a simpler approach:
# Start Next.js server normally, but use a proxy on a different port that strips cache headers
# The simplest fix: tell the user to hard-refresh with cache bypass

# Actually, the SIMPLEST fix: just restart the server and the new build's chunks will match
# The issue is the BROWSER caching old HTML, not the server
nohup setsid env NODE_ENV=production node .next/standalone/server.js </dev/null >/home/z/my-project/prod.log 2>&1 &
echo $! > /home/z/my-project/server.pid
sleep 3
if ss -ltn 2>/dev/null | grep -q ":3000"; then
  echo "SERVER_ALIVE"
else
  echo "SERVER_DEAD"
fi
