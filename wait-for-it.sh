#!/bin/sh
# wait-for-it.sh
# https://github.com/vishnubob/wait-for-it

set -e

host="$(echo "$1" | cut -d: -f1)"
port="$(echo "$1" | cut -d: -f2)"
shift
shift
cmd="$@"

until nc -z "$host" "$port"; do
  >&2 echo "Waiting for $host:$port..."
  sleep 1
done

>&2 echo "$host:$port is available - executing command"
exec $cmd
