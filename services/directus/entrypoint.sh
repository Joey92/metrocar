set -e

npx directus database install || true
npx directus database migrate:latest
npx directus schema apply --yes ./snapshot.yaml
npx directus start