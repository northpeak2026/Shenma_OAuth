#!/bin/sh
set -eu
cd "$(dirname "$0")"
if command -v node >/dev/null 2>&1; then
  DEMO_NODE="$(command -v node)"
elif [ -x "$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node" ]; then
  DEMO_NODE="$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"
else
  echo '请先安装 Node.js 20.19+，然后运行 npm install 和 npm run dev。'
  exit 1
fi
if [ ! -f node_modules/vite/bin/vite.js ]; then
  echo '请先运行 npm install 安装项目依赖。'
  exit 1
fi
exec "$DEMO_NODE" node_modules/vite/bin/vite.js --host 127.0.0.1 "$@"
