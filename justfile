set dotenv-filename := ".just.env"
set dotenv-load

build-svelte:
 pnpm -C ./svelte-app/ run build && rm -rf ./pb_public/* && cp -r ./svelte-app/build/* ./pb_public

dev-frontend:
 pnpm -C ./svelte-app/ run dev &
 go run main.go serve

dev-frontend-public:
  pnpm -C ./svelte-app/ run dev --host &
  go run main.go serve

deploy: build-svelte
  ssh pcrserver "echo $DEPLOY_PASS | sudo -S systemctl stop cfh.service"
  rsync --delete -a ./pb_public ./migrations pcrserver:~/cfh
  ssh pcrserver "echo $DEPLOY_PASS | sudo -S systemctl start cfh.service"
