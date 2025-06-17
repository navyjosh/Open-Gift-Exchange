#!/bin/sh

set -e

echo "🏁 Waiting for Postgres..."

# Set defaults if not already set
PGHOST="${PGHOST:-db}"
PGPORT="${PGPORT:-5432}"
PGUSER="${PGUSER:-wishlist_user}"

# Wait for Postgres to be ready
until pg_isready -h "$PGHOST" -p "$PGPORT" -U "$PGUSER"; do
  echo "⏳ Waiting for Postgres at $PGHOST:$PGPORT as $PGUSER..."
  sleep 1
done

echo "✅ Postgres is ready. Running Prisma..."

npx prisma db push

echo "🚀 Starting the Next.js app..."
exec "$@"
