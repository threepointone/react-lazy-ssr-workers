rm -rf out && mkdir -p out
rm -rf static && mkdir -p static &&cp public/* static  
STATIC_ROOT=https://react-lazy.coolcomputerclub.com
npx concurrently "NODE_PATH=vendor esbuild worker/server.js --bundle --loader:.js=jsx --outfile=out/worker.mjs --format=esm --inject:./src/react-shim.js --minify --define:STATIC_ROOT=\\\"${STATIC_ROOT}\\\"" "NODE_PATH=vendor esbuild src/index.js --bundle --loader:.js=jsx --outdir=static --format=esm --inject:./src/react-shim.js --splitting --public-path=${STATIC_ROOT} --minify --define:STATIC_ROOT=\\\"${STATIC_ROOT}\\\""