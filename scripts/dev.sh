rm -rf out && mkdir -p out
rm -rf static && mkdir -p static &&cp public/* static  
STATIC_ROOT=http://localhost:5000
npx concurrently "NODE_PATH=vendor esbuild worker/server.js --bundle --loader:.js=jsx --outfile=out/worker.mjs --format=esm --watch --inject:./src/react-shim.js --minify --define:STATIC_ROOT=\\\"${STATIC_ROOT}\\\"" "NODE_PATH=vendor esbuild src/index.js --bundle --loader:.js=jsx --outdir=static --format=esm --watch --inject:./src/react-shim.js --splitting --public-path=${STATIC_ROOT} --minify --define:STATIC_ROOT=\\\"${STATIC_ROOT}\\\"" "serve static -C" "wrangler dev" -k