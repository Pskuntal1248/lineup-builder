#!/bin/bash

# Uses macOS built-in `sips` to create crisp resized icons from your HD source.
# Place your highest-res logo as /public/logo-source.png (at least 512x512)
# Then run: bash scripts/generate-icons.sh

SRC="public/logo-source.png"
OUT="public"

# Favicon sizes
sips -z 16 16   "$SRC" --out "$OUT/favicon-16x16.png"
sips -z 32 32   "$SRC" --out "$OUT/favicon-32x32.png"
sips -z 48 48   "$SRC" --out "$OUT/favicon.png"
sips -z 180 180 "$SRC" --out "$OUT/apple-touch-icon.png"
sips -z 192 192 "$SRC" --out "$OUT/icon-192.png"
sips -z 512 512 "$SRC" --out "$OUT/icon-512.png"

echo "✅ All icons generated from $SRC"
echo ""
echo "⚠️  If icons still look blurry, your source image may not be square."
echo "   Crop/pad logo-source.png to a perfect square (e.g. 1024x1024) with"
echo "   transparent background, then re-run this script."
