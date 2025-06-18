# nitro-example-caster-api

## Notes

### Run Localstack

```sh
cp .envrc.example .envrc

pnpm docker up -d

pnpm tf init

pnpm tf apply --auto-approve

pnpm dev
```
