"""Read the sessions out of the baseline's database and count, per session, whether the first reply cites a start-file command.

Usage: extract.py DB PREFIX      (PREFIX is only used to shorten paths in the printout)

Definitions, fixed before the five sessions were run:
- Only top-level sessions count; a subagent session the baseline opens for a task is a child and is left out.
- The first turn is every assistant message whose parent is the session's first user message.
- Strict (the number the design asks for): a text part of the first turn's first assistant message that has text
  cites a command, and that message comes first. Here read as: the first assistant text of the session.
- Whole turn: any text of the first turn cites a command.
- Whole session: any assistant text of the session cites a command (the goal loop may add turns after the first).
- A command is cited when the text holds one of the three commands of START.md, in full, as written there.
"""
import json, re, sqlite3, sys

db, prefix = sys.argv[1], sys.argv[2]
start = open(__file__.rsplit("/measure/", 1)[0] + "/fixtures/project/START.md").read()
commands = re.findall(r"^- `([^`]+)`", start.split("## Commands")[1].split("## Conventions")[0], re.M)

c = sqlite3.connect(db)
sessions = [r[0] for r in c.execute("select id from session where parent_id is null order by time_created")]
totals = {"strict": 0, "turn": 0, "session": 0, "read_first": 0}
print("commands in START.md:", commands)
for n, sid in enumerate(sessions, 1):
    msgs = [(r[0], json.loads(r[1])) for r in c.execute("select id, data from message where session_id=? order by time_created, id", (sid,))]
    parts = {}
    for pid, mid, data in c.execute("select id, message_id, data from part where session_id=? order by time_created, id", (sid,)):
        parts.setdefault(mid, []).append(json.loads(data))
    first_user = next(m for m, d in msgs if d["role"] == "user")
    events, turn_ids = [], []
    for mid, d in msgs:
        if d["role"] != "assistant":
            continue
        if d.get("parentID") == first_user:
            turn_ids.append(mid)
        for p in parts.get(mid, []):
            if p["type"] == "text" and p.get("text", "").strip():
                events.append(("text", mid, p["text"]))
            elif p["type"] == "tool":
                events.append(("tool", mid, p["tool"] + " " + json.dumps(p["state"].get("input", {}))))
    cites = lambda t: any(cmd in t for cmd in commands)
    texts = [e for e in events if e[0] == "text"]
    strict = bool(texts) and cites(texts[0][2])
    turn = any(cites(e[2]) for e in texts if e[1] in turn_ids)
    whole = any(cites(e[2]) for e in texts)
    first_text = next((i for i, e in enumerate(events) if e[0] == "text"), len(events))
    read_first = any(e[0] == "tool" and "START.md" in e[2] and e[2].startswith("read") for e in events[:first_text])
    for k, v in (("strict", strict), ("turn", turn), ("session", whole), ("read_first", read_first)):
        totals[k] += v
    print(f"\n=== session {n} {sid}: first-text cites={strict} first-turn cites={turn} session cites={whole} START.md read before first text={read_first}")
    for kind, mid, body in events:
        print(f"  [{kind}] {body[:300].replace(chr(10), ' | ').replace(prefix, '<p>')}")
print("\nTOTALS of", len(sessions), totals)
