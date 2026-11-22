# Cover of "The Leucadia Club: Building a [Quality Space]"

`covers3.tsx` draws the cover in code (React SVG → sharp) and writes 1200 × 1800 JPGs.
The one on the site is `static/lc/quality-space-cover.jpg` (the "Tiki lounge" version);
`cover-tiki-torches.jpg` here is the alternate.

Fonts: Zenzero Grotesk Sans (the caps, as on the first book's cover) and Montserrat Thin
(the bracketed words, matched by eye to "[nothing]" on the first cover). Both must be
findable by the renderer: Zenzero is installed on John's Mac; Montserrat Thin is the free
font from the google/fonts repository (`ofl/montserrat`), pointed to with `FONTCONFIG_FILE`.

To render: copy the script into a project that has `react`, `react-dom`, `sharp` and `tsx`
(the club portal does), then `node_modules/.bin/tsx <script> <output folder>`.
