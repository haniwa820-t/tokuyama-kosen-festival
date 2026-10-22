"""Subset officially downloaded fonts for the local design comparison only."""
from pathlib import Path
from fontTools import subset

root = Path(__file__).resolve().parent.parent
work = root / 'tmp/design-review'
out = work / 'site/fonts'
out.mkdir(parents=True, exist_ok=True)
characters = (work / 'font-characters.txt').read_text()
for name in ['zen-400', 'zen-500', 'zen-700', 'zen-900', 'noto-variable']:
    options = subset.Options()
    options.flavor = 'woff2'
    font = subset.load_font(str(work / 'references' / (name + '.ttf')), options)
    selected = subset.Subsetter(options=options)
    selected.populate(text=characters)
    selected.subset(font)
    target = out / (name + '.woff2')
    subset.save_font(font, str(target), options)
    print(f'{name}: {target.stat().st_size:,} bytes')
for source in ['zen-ofl.txt', 'noto-ofl.txt']:
    (out / source).write_bytes((work / 'references' / source).read_bytes())
