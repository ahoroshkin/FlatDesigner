from pathlib import Path
import json
import re

src = Path("obmerka-v222.html")
s = src.read_text()
data_path = Path("data/project_kv109_v223.json")
data = json.loads(data_path.read_text())

s, n = re.subn(r'const APP_VER="v222", APP_DATE="[^"]+";',
               'const APP_VER="v223", APP_DATE="20.11.2026";', s, count=1)
assert n == 1

# The "Sockets and outputs" view previously filtered out every cable-output item.
old = 'f==="sock"?/^(socket|weak)$/.test(it.type)'
new = 'f==="sock"?/^(socket|weak|cable)$/.test(it.type)'
assert old in s
s = s.replace(old, new, 1)

lit = json.dumps(json.dumps(data, ensure_ascii=False, separators=(",", ":")),
                 ensure_ascii=False).replace("</", "<\\/")
for key in ("PRELOAD_JSON", "SAVED_JSON"):
    s, n = re.subn(r"^const " + key + r"=.*$",
                   lambda _m: "const " + key + "=" + lit + ";",
                   s, count=1, flags=re.M)
    assert n == 1, key

Path("Дизайн-проект кв. 109 — Шаумяна 14 (v223).html").write_text(s)
Path("obmerka-v223.html").write_text(s)
Path("index.html").write_text(s)
Path("/private/tmp/v223-check.js").write_text(
    re.findall(r"<script[^>]*>([\s\S]*?)</script>", s)[-1])

sw = Path("sw.js")
sw_text = sw.read_text()
if "obmerka-v222-task-editors" in sw_text:
    sw.write_text(sw_text.replace("obmerka-v222-task-editors",
                                  "obmerka-v223-cable-outputs", 1))
else:
    assert "obmerka-v223-cable-outputs" in sw_text

print("Built v223; embedded project updated:", data.get("updated"))
