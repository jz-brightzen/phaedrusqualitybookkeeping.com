/* The book on its cover page (layout lc-studio, styles in book.css).

   1. The covers lie in a fanned stack. A tap or a click sends the front one to the back
      and brings the next one forward, round and round.
   2. Running text (a note; later, a chapter) arrives as one long page. It is poured into
      as many book pages as it needs, each the same size as the others.
   3. The Contents page gets the page number of everything it lists.

   Without this script the page still reads: both covers show, the long text stays on one
   long page, and the Contents page has no numbers. */
(function () {
  "use strict";

  // ---------- 1. The covers ----------

  function coverStack(stack) {
    var cards = Array.prototype.slice.call(stack.querySelectorAll(".bk-stack-card"));
    if (cards.length < 2) return;
    var wrap = stack.parentNode;
    var caption = wrap.querySelector("[data-stack-caption]");
    var hint = wrap.querySelector("[data-stack-hint]");
    var front = 0;
    cards.forEach(function (card, i) {
      if (card.classList.contains("is-front")) front = i;
    });
    var count = wrap.querySelector("[data-stack-count]");
    // Each cover is told how far it now is from the front (0 = front); the styles place it.
    function show() {
      cards.forEach(function (card, i) {
        var back = (i - front + cards.length) % cards.length;
        card.style.setProperty("--i", String(back));
        card.classList.toggle("is-front", back === 0);
      });
      if (caption) caption.textContent = cards[front].getAttribute("data-caption") || "";
      if (count) {
        count.textContent = " · " + (front + 1) + " of " + cards.length;
        count.hidden = false;
      }
    }
    cards.forEach(function (card) {
      card.addEventListener("click", function () {
        front = (front + 1) % cards.length;
        show();
      });
    });
    if (hint) hint.hidden = false;
    show();
  }

  // ---------- 2. Running text into pages ----------

  // The part of a page the text may fill is a box of fixed height; text fits while the box
  // does not have to scroll.
  function fits(body) {
    return body.scrollHeight <= body.clientHeight + 1;
  }

  function newPage(book, before) {
    var sheet = document.createElement("section");
    sheet.className = "bk-sheet bk-flow-page";
    var inner = document.createElement("div");
    inner.className = "bk-sheet-in bk-sheet-flow";
    var body = document.createElement("div");
    body.className = "bk-flow-body";
    inner.appendChild(body);
    sheet.appendChild(inner);
    book.insertBefore(sheet, before);
    return { sheet: sheet, body: body };
  }

  // A quotation of several paragraphs becomes one block per paragraph, so it can run on
  // from one page to the next.
  function blocksOf(source) {
    var blocks = [];
    Array.prototype.slice.call(source.children).forEach(function (el) {
      var paragraphs = el.tagName === "BLOCKQUOTE" ? Array.prototype.slice.call(el.children) : [];
      if (paragraphs.length > 1) {
        paragraphs.forEach(function (p) {
          var quote = el.cloneNode(false);
          quote.appendChild(p);
          blocks.push(quote);
        });
      } else {
        blocks.push(el);
      }
    });
    return blocks;
  }

  // `block` is the last thing on the page and runs past the bottom. Keep the lines that
  // fit and return the rest as a new block for the next page. Returns the block itself
  // (taken off the page) when not even one line fits or it cannot be split.
  function splitToFit(body, block) {
    var text = block.tagName === "BLOCKQUOTE" ? block.firstElementChild : block;
    if (!text || text.tagName !== "P") {
      body.removeChild(block);
      return block;
    }
    var limit = body.getBoundingClientRect().bottom + 0.5;
    var points = [];
    var walker = document.createTreeWalker(text, NodeFilter.SHOW_TEXT);
    var node;
    while ((node = walker.nextNode())) {
      var gap = /\s+/g;
      var m;
      while ((m = gap.exec(node.data))) points.push([node, m.index + m[0].length]);
    }
    var range = document.createRange();
    function bottomUpTo(i) {
      range.setStart(text, 0);
      range.setEnd(points[i][0], points[i][1]);
      var rects = range.getClientRects();
      var bottom = -Infinity;
      for (var r = 0; r < rects.length; r++) if (rects[r].bottom > bottom) bottom = rects[r].bottom;
      return bottom;
    }
    var lo = 0;
    var hi = points.length - 1;
    var best = -1;
    while (lo <= hi) {
      var mid = (lo + hi) >> 1;
      if (bottomUpTo(mid) <= limit) {
        best = mid;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
    if (best < 0) {
      body.removeChild(block);
      return block;
    }
    range.setStart(points[best][0], points[best][1]);
    range.setEndAfter(text.lastChild);
    var remainder = range.extractContents();
    if (!remainder.textContent.replace(/\s+/g, "")) return null;
    var rest = block.cloneNode(false);
    var restText = rest;
    if (text !== block) {
      restText = text.cloneNode(false);
      rest.appendChild(restText);
    }
    restText.appendChild(remainder);
    rest.classList.add("bk-cont");
    block.classList.add("bk-split");
    return rest;
  }

  // Pour one long text into pages, placed where `marker` is. Returns the pages made.
  function pour(book, marker, source, key, label) {
    var queue = blocksOf(source.cloneNode(true));
    var pages = [];
    var page = newPage(book, marker);
    pages.push(page.sheet);
    var turns = 0;
    function turn() {
      page = newPage(book, marker);
      pages.push(page.sheet);
    }
    while (queue.length && turns++ < 4000) {
      var block = queue.shift();
      if (block.tagName === "HR" && !page.body.children.length) continue;
      page.body.appendChild(block);
      if (fits(page.body)) continue;
      var rest = splitToFit(page.body, block);
      if (rest !== block) {
        // Part of it stayed; the remainder (if any) opens the next page.
        turn();
        if (rest) queue.unshift(rest);
        continue;
      }
      if (!page.body.children.length) {
        // Too tall even for an empty page and it cannot be split: it gets a page to itself.
        page.body.appendChild(block);
        turn();
        continue;
      }
      // Nothing of it fits here. A heading or a rule left at the foot of the page goes with it.
      var carried = [];
      var last = page.body.lastElementChild;
      while (last && /^(H[1-6]|HR)$/.test(last.tagName) && page.body.children.length > 1) {
        page.body.removeChild(last);
        carried.unshift(last);
        last = page.body.lastElementChild;
      }
      turn();
      queue.unshift(block);
      for (var c = carried.length - 1; c >= 0; c--) queue.unshift(carried[c]);
    }
    // A last page left empty is dropped.
    var lastPage = pages[pages.length - 1];
    if (pages.length > 1 && !lastPage.querySelector(".bk-flow-body").children.length) {
      book.removeChild(lastPage);
      pages.pop();
    }
    if (key) pages[0].setAttribute("data-key", key);
    pages.forEach(function (sheet, i) {
      if (label) sheet.setAttribute("aria-label", pages.length > 1 ? label + ", page " + (i + 1) + " of " + pages.length : label);
    });
    return pages;
  }

  // ---------- 3. The numbers on the Contents page ----------

  function numberContents(book) {
    var first = {};
    var sheets = book.querySelectorAll(".bk-sheet");
    Array.prototype.forEach.call(sheets, function (sheet, i) {
      if (sheet.parentNode !== book) return;
      var key = sheet.getAttribute("data-key");
      if (key && !(key in first)) first[key] = i + 1;
    });
    Array.prototype.forEach.call(book.querySelectorAll("[data-page-for]"), function (el) {
      var page = first[el.getAttribute("data-page-for")];
      el.textContent = page ? String(page) : "";
    });
  }

  function layOut(book) {
    // Each long text is kept as it arrived, so the pages can be made again if the page
    // size changes.
    var flows = [];
    Array.prototype.forEach.call(book.querySelectorAll(".bk-sheet.bk-flow"), function (sheet) {
      if (sheet.parentNode !== book) return;
      var source = sheet.querySelector(".bk-flow-src");
      if (!source) return;
      var marker = document.createComment("flow");
      book.insertBefore(marker, sheet);
      book.removeChild(sheet);
      flows.push({ marker: marker, source: source, key: sheet.getAttribute("data-key"), label: sheet.getAttribute("aria-label"), pages: [] });
    });
    function make() {
      flows.forEach(function (flow) {
        flow.pages.forEach(function (sheet) {
          if (sheet.parentNode === book) book.removeChild(sheet);
        });
        flow.pages = pour(book, flow.marker, flow.source, flow.key, flow.label);
      });
      numberContents(book);
    }
    make();
    book.setAttribute("data-book", "ready");

    // The type scales with the page, so the breaks normally hold at any size. If a page
    // ever ends up too full after the window changes, make the pages again.
    var waiting = null;
    window.addEventListener("resize", function () {
      clearTimeout(waiting);
      waiting = setTimeout(function () {
        var tooFull = Array.prototype.some.call(book.querySelectorAll(".bk-flow-body"), function (body) {
          return !fits(body);
        });
        if (tooFull) make();
      }, 250);
    });
  }

  function start() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-stack]"), coverStack);
    Array.prototype.forEach.call(document.querySelectorAll("[data-book]"), layOut);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
