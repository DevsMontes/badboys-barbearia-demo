"""Recria os assets a partir dos originais preservados. Requer Pillow."""
from pathlib import Path
from PIL import Image, ImageEnhance, ImageFilter

root = Path(__file__).resolve().parents[1]
originals = root / 'references' / 'originals'
brand = root / 'public' / 'assets' / 'brand'
editorial = root / 'public' / 'assets' / 'editorial'
brand.mkdir(parents=True, exist_ok=True)
editorial.mkdir(parents=True, exist_ok=True)
logo = Image.open(originals / 'codex-clipboard-bf0d53f2-3734-4703-9b12-f15875d7573c.jpg')
logo.save(brand / 'logo.webp', quality=95, method=6)
logo.resize((64, 65), Image.Resampling.LANCZOS).save(brand / 'favicon.png')
photo = Image.open(originals / 'codex-clipboard-66de824f-1866-405f-83d8-2b04209ca6e4.jpg')
photo = ImageEnhance.Contrast(photo).enhance(1.04)
photo = photo.filter(ImageFilter.UnsharpMask(radius=.6, percent=65, threshold=3))
photo.save(editorial / 'fachada.webp', quality=87, method=6)
