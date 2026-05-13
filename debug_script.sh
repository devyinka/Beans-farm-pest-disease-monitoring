ls -la | grep env
echo "NODE_ENV: $NODE_ENV"
NODE_DEBUG=* npm run dev 2>&1 | head -n 100
