// The part of checks/config.toml the extension reads: the [topic] table's `files` and `root`.
// Only the subset the topic check's own config uses: string keys, strings and one-line or multi-line string arrays.

export interface TopicConfig {
  files: string[] | null;
  root: string | null;
}

function strings(value: string): string[] {
  return [...value.matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((m) => m[1].replace(/\\(["\\])/g, "$1"));
}

/** Drops a comment that follows a value, leaving "#" inside a string alone. */
function stripComment(line: string): string {
  let inString = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === "\\" && inString) { i++; continue; }
    if (c === '"') inString = !inString;
    else if (c === "#" && !inString) return line.slice(0, i);
  }
  return line;
}

export function readTopicConfig(text: string): TopicConfig {
  const out: TopicConfig = { files: null, root: null };
  let inTopic = false;
  let key = "";
  let pending = "";
  for (const raw of text.split(/\r?\n/)) {
    const line = stripComment(raw).trim();
    if (key) {
      pending += " " + line;
      if (line.includes("]")) { assign(out, key, pending); key = ""; pending = ""; }
      continue;
    }
    const table = /^\[([^\]]+)\]$/.exec(line);
    if (table) { inTopic = table[1].trim() === "topic"; continue; }
    if (!inTopic) continue;
    const kv = /^(files|root)\s*=\s*(.*)$/.exec(line);
    if (!kv) continue;
    if (kv[2].startsWith("[") && !kv[2].includes("]")) { key = kv[1]; pending = kv[2]; continue; }
    assign(out, kv[1], kv[2]);
  }
  return out;
}

function assign(out: TopicConfig, key: string, value: string): void {
  if (key === "files") out.files = strings(value);
  else out.root = strings(value)[0] ?? null;
}
