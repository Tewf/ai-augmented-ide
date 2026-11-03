#!/bin/bash
# Measure 5: five new sessions of the baseline, each handed the hand-over note, on a local model.
# Usage: run.sh WORKDIR [N]   (WORKDIR is scratch; the baseline's own config and data go under it)
# Needs: the baseline's `kilo` binary, and a local OpenAI-compatible model server on 127.0.0.1:11435 started with
#   a 32768-token context (the default 4096 truncates the baseline's prompt of about 28000 tokens; set the server's
#   context-length option, flash attention and an 8-bit KV cache, as the measure's notes record)
# The baseline's own prompt is about 28000 tokens, so the server's default of 4096 would cut the system prompt away.
set -u
HERE=$(cd "$(dirname "$0")" && pwd)
W=$(realpath -m "$1"); N=${2:-5}
KILO=${KILO:-$HOME/.vscode/extensions/kilocode.kilo-code-7.8.18-linux-x64/bin/kilo}
MODEL=${MODEL:-local-server/qwen2.5:7b-instruct}
mkdir -p "$W/xdg/config/kilo" "$W/xdg/data" "$W/xdg/state" "$W/xdg/cache"
cp "$HERE/${CONFIG:-kilo.jsonc}" "$W/xdg/config/kilo/kilo.jsonc"
[ -d "$HOME/.cache/kilo" ] && cp -r "$HOME/.cache/kilo" "$W/xdg/cache/"   # the model list, so no fetch is needed
export XDG_CONFIG_HOME=$W/xdg/config XDG_DATA_HOME=$W/xdg/data XDG_STATE_HOME=$W/xdg/state XDG_CACHE_HOME=$W/xdg/cache
# Anything that is not local fails at once: the proxy address is a closed port.
# CLOUD=host lets that one host through (the key itself comes from ANTHROPIC_API_KEY in the environment, never a file).
export HTTP_PROXY=http://127.0.0.1:9 HTTPS_PROXY=http://127.0.0.1:9 http_proxy=http://127.0.0.1:9 https_proxy=http://127.0.0.1:9
export NO_PROXY=127.0.0.1,localhost${CLOUD:+,$CLOUD} no_proxy=127.0.0.1,localhost${CLOUD:+,$CLOUD} KILO_TELEMETRY_LEVEL=off
for i in $(seq 1 "$N"); do
  rm -rf "$W/p$i"; cp -r "$HERE/../../fixtures/project" "$W/p$i"
  ( cd "$W/p$i" && timeout 1500 "$KILO" run -m "$MODEL" -f .handover/note.md --format json \
      "Start from the attached hand-over note." > "$W/run$i.json" 2> "$W/run$i.err" )
  echo "session $i exit $?"
done
python3 "$HERE/extract.py" "$W/xdg/data/kilo/kilo.db" "$W/p" > "$W/sessions.txt"
