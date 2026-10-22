"""Create the local Noto Sans JP subset from the official variable font.

Usage: python scripts/prepare-site-font.py path/to/NotoSansJP[wght].ttf
Requires fonttools[woff]. Never edits the downloaded original.
"""
import hashlib
import json
from pathlib import Path
import sys
from fontTools import subset
from fontTools.ttLib import TTFont

root = Path(__file__).resolve().parent.parent
source = Path(sys.argv[1])
expected = 'c2f3b4d463500a2ddcd3849cded1fceeb9fd6d1c32e6cbecd568453ba50fc68f'
if hashlib.sha256(source.read_bytes()).hexdigest() != expected:
    raise ValueError('The official font source checksum differs; review before updating.')
files = sorted(p for p in (root / 'src').rglob('*') if p.suffix in {'.tsx', '.ts', '.json'})
characters = ''.join(chr(c) for c in range(32, 127)) + '\n' + ''.join(p.read_text() for p in files)
options = subset.Options()
options.flavor = 'woff2'
font = subset.load_font(str(source), options)
source_cmap = font.getBestCmap()
selected = subset.Subsetter(options=options)
selected.populate(text=characters)
selected.subset(font)
output = root / 'src/assets/fonts/noto-sans-jp.woff2'
output.parent.mkdir(parents=True, exist_ok=True)
subset.save_font(font, str(output), options)
result = TTFont(output).getBestCmap()
missing = set(map(ord, characters)) & set(source_cmap) - set(result)
assert not missing, f'Missing source glyphs: {missing}'
manifest = {
    'family': 'Noto Sans JP', 'weight': '100–900', 'license': 'SIL Open Font License 1.1',
    'sourceUrl': 'https://raw.githubusercontent.com/google/fonts/main/ofl/notosansjp/NotoSansJP%5Bwght%5D.ttf',
    'sourceSha256': expected,
    'outputSha256': hashlib.sha256(output.read_bytes()).hexdigest(),
    'glyphCoverage': 'All characters supported by the original font in src TS, TSX and JSON, including dynamic UI and booth data, plus printable ASCII.',
    'codepoints': sorted(result),
    'unsupportedCodepoints': sorted(set(map(ord, characters)) - set(source_cmap)),
}
(output.parent / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
print(f'{output.stat().st_size:,} bytes; {len(result)} codepoints; all supported site characters covered.')
