build-svelte:
 pnpm -C ./svelte-app/ run build && rm -rf ./pb_public/* && cp -r ./svelte-app/build/* ./pb_public
 
dev-frontend:
 pnpm -C ./svelte-app/ run dev &
 go run main.go serve

dev-frontend-public:
  pnpm -C ./svelte-app/ run dev --host &
  go run main.go serve
