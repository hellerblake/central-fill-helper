build-svelte:
 pnpm -C ./svelte-app/ run build && rm -rf ./pb_public/* && cp -r ./svelte-app/build/* ./pb_public
