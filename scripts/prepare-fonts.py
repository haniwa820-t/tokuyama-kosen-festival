"""Create a locally served headline subset; see public/fonts/README.md."""

import hashlib
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont

root = Path(__file__).resolve().parent.parent
source = root / "tmp/fonts/ShipporiMincho-Bold.ttf"
expected_hash = "63bc4eddc74793f671c3ab827c5175e773ffbe569d0bf50ee65375ea9e3bc286"
if hashlib.sha256(source.read_bytes()).hexdigest() != expected_hash:
    raise ValueError("The source font has changed; verify its version and license first.")
font = TTFont(source, recalcTimestamp=False)
text = "".join(
    path.read_text(encoding="utf-8")
    for path in sorted((root / "src").rglob("*"))
    if path.suffix in {".tsx", ".json"} and ".test." not in path.name
)
# Include printable ASCII so dates, Latin headings and punctuation also work.
characters = set(text) | {chr(code) for code in range(32, 127)}
options = subset.Options()
options.name_IDs = [0, 1, 2, 3, 4, 5, 6, 13, 14, 16, 17]
options.name_languages = [0x409]
options.recalc_timestamp = False
subsetter = subset.Subsetter(options=options)
subsetter.populate(text="".join(sorted(characters)))
subsetter.subset(font)
# Identify the modified subset distinctly while keeping copyright/license names.
names = {
    1: "Festival Mincho", 2: "Bold", 3: "FestivalMincho-Bold-Subset",
    4: "Festival Mincho Bold", 6: "FestivalMincho-Bold",
    16: "Festival Mincho", 17: "Bold",
}
for record in font["name"].names:
    if record.nameID in names:
        record.string = names[record.nameID].encode(record.getEncoding())
font.flavor = "woff2"
destination = root / "public/fonts/festival-mincho-bold.woff2"
font.save(destination)
print(f"Created {destination.name}: {destination.stat().st_size:,} bytes")
print(f"Source SHA-256: {hashlib.sha256(source.read_bytes()).hexdigest()}")
