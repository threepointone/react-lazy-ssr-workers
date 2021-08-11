# build a worker 
# build client assets 
rm -rf out && mkdir -p out
rm -rf static && mkdir -p static &&cp public/* static  
npx concurrently "esbuild worker/server.js --bundle --loader:.js=jsx --outfile=out/worker.mjs --format=esm --watch --inject:./src/react-shim.js" "npx esbuild src/index.js --bundle --loader:.js=jsx --outdir=static --format=esm --watch --inject:./src/react-shim.js --splitting --public-path=https://react-lazy-ssr-workers.pages.dev" "serve static -C" -k