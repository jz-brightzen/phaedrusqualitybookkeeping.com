---
title: "Lights"
layout: "zcompound-lights"
url: "/zcompound/lights/"
date: 2026-10-26
draft: false
robotsNoIndex: true
sitemap:
  disable: true
summary: "Which home Kasa lights were on or off at the last poll, on an approximate floor plan. Noindex."
eyebrow: "zCompound · Home"
heroTitle: "Lights"
# On/off toggles via same-origin /api/lights/* (Mac mini polls the queue). false = no toggles, no passcode box, no script.
lightsControls: false
---

Which of the home Kasa lights were on and which were off, room by room. Data comes from `data/kasa/history.json`, rebuilt from the light polls.
