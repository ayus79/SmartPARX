#!/bin/sh
# Exports SmartPARX-Company-Profile.pptx to PDF using Keynote (macOS). Run after `npm run build`.
set -e
DIR="$(cd "$(dirname "$0")" && pwd)"
IN="$DIR/SmartPARX-Company-Profile.pptx"
OUT="$DIR/SmartPARX-Company-Profile.pdf"
rm -f "$OUT"
osascript <<APPLESCRIPT
set inFile to POSIX file "$IN"
set outFile to POSIX file "$OUT"
tell application "Keynote"
  set theDoc to open inFile
  delay 2
  export theDoc to outFile as PDF with properties {PDF image quality:Best}
  close theDoc saving no
end tell
APPLESCRIPT
echo "wrote $OUT"
