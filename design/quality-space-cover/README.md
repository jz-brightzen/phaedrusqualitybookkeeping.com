# The covers of "Building a [Quality Space]: Stories from The Leucadia Club"

The two covers on `/phaedrus/quality-space/` are drawn by code, not by hand. Change the code,
run one command, and the pictures on the site are replaced.

| File on the site | Cover |
|---|---|
| `static/lc/quality-space-cover.jpg` | Tiki lounge (teal night, thatched bar, string lights) |
| `static/lc/quality-space-cover-torches.jpg` | Tiki torches (purple sunset, two torches, a surfboard) |
| `static/lc/quality-space-share.jpg` | The purple cover drawn wide (1200 × 630): the picture apps show when the link is shared |

## Make the pictures again

Needs Node.js. In this folder:

```bash
npm install
```

```bash
npm run covers
```

`npm install` is only needed the first time. `npm run covers` writes all three JPGs
straight into `static/lc/`. To look before replacing them, give it another folder:
`npm run covers -- /some/folder`. Then commit and push as usual.

## Change a cover

Everything is in `covers.tsx`. The top of that file says where each thing lives. In short:

- **Words:** `Title()` (the two title lines and the bottom line with the ∞ marks).
  `Quote()` can draw a line of words in the sky above the friends; it is not used right now.
- **Colours:** `LAGOON` (Tiki lounge) and `AFTERGLOW` (Tiki torches).
- **The scene:** `Scene()` places the palm, the friends, the sun and the extras. Each piece
  (`ArchPalm`, `Sitter`, `Torch`, `Tiki`, `Hut`, `StringLights`, `PlantedBoard`) is a small
  function that takes a position, so moving something is changing its `x` and `y`.
- **The wide share picture:** `Share()`. It reuses the same pieces at a smaller size.
- **Which pictures get made, and their file names:** `main()` at the bottom.

The canvas is 1200 wide and 1800 tall; `x` runs left to right, `y` top to bottom.

## Fonts

- **Zenzero Grotesk Sans** for the capitals, the font of the first book's cover. It must be
  installed on the computer (it is on John's Mac, in `~/Library/Fonts`). Without it the
  capitals fall back to Avenir Next Condensed and the cover looks different.
- **Montserrat Thin** for the bracketed words, matched by eye to "[nothing]" on the first
  cover. It is free (SIL Open Font License) and kept here in `fonts/`, so nothing needs
  installing. `render.sh` points the renderer at that folder.

## How it works

`covers.tsx` builds each cover as an SVG with React, and `sharp` turns the SVG into a JPG.
`render.sh` writes a small font list (`.fonts.conf`, not committed) and runs the script.
