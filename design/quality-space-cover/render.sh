#!/bin/sh
# Draws the covers and writes them where the site serves them (static/lc/).
# Run from anywhere:  npm run covers   (after "npm install", once, in this folder)
set -e
cd "$(dirname "$0")"
OUT="${1:-../../static/lc}"

# Tell the renderer where the fonts are: the Mac's own fonts (Zenzero Grotesk Sans must be
# installed for the caps) plus the Montserrat Thin kept in ./fonts.
cat > .fonts.conf <<CONF
<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "fonts.dtd">
<fontconfig>
  <dir>/System/Library/Fonts</dir>
  <dir>/System/Library/Fonts/Supplemental</dir>
  <dir>/Library/Fonts</dir>
  <dir>$HOME/Library/Fonts</dir>
  <dir>$PWD/fonts</dir>
  <cachedir>$PWD/.fontcache</cachedir>
</fontconfig>
CONF

FONTCONFIG_FILE="$PWD/.fonts.conf" node_modules/.bin/tsx covers.tsx "$OUT"
