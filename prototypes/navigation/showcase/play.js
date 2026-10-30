// Ten seconds of the navigation model being used, by a drawn cursor, through the page's own
// pointer and buttons. Shared by the showcase page, which runs it over the live page in a frame for
// screen recording, and record.js, which runs it inside the page itself to render the video.
//   NavShowcase.start({ doc, host, loop })   doc is the model's document, host where the cursor is drawn
(function () {
  "use strict";
  var LENGTH = 10;
  function ease(t) { t = Math.max(0, Math.min(1, t)); return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function lerp(a, b, t) { return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }; }
  function centre(el) { var r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }

  function start(o) {
    var doc = o.doc, win = doc.defaultView, host = o.host || doc, hw = host.defaultView;
    var stage = doc.getElementById("stage");
    // synthetic pointers can't be captured; the page doesn't need it for these
    stage.setPointerCapture = function () {};

    // the cursor, and a dotted ring that opens where it presses, the way the model marks where an experiment has been
    var NS = "http://www.w3.org/2000/svg";
    var layer = host.createElement("div");
    layer.setAttribute("aria-hidden", "true");
    layer.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:2147483647;";
    layer.innerHTML = '<svg width="100%" height="100%" style="position:absolute;inset:0;overflow:visible">' +
      '<circle id="sc-ring" r="0" fill="none" stroke="#d63c23" stroke-width="1" stroke-dasharray="1.5 3" stroke-linecap="round" opacity="0"/>' +
      '<g id="sc-cursor" opacity="0"><path d="M0 0 L0 19 L4.8 14.7 L8 22.1 L11.4 20.6 L8.3 13.4 L14.6 13.4 Z" fill="#1d1d1b" stroke="#fff" stroke-width="1.4" stroke-linejoin="round"/></g></svg>';
    host.body.appendChild(layer);
    var cur = layer.querySelector("#sc-cursor"), ring = layer.querySelector("#sc-ring");

    // where things are, read live from the page each frame, since the model moves under the cursor
    function W() { return hw.innerWidth; }
    function H() { return hw.innerHeight; }
    var at = {
      rest: function () { return { x: W() * .78, y: H() * .86 }; },
      grab: function () { var c = centre(stage); return { x: c.x - W() * .02, y: c.y - H() * .2 }; },
      layer: function () { var b = doc.querySelectorAll(".layer-btn")[2]; return centre(b.querySelector("span") || b); },
      end: function () { return centre(doc.querySelector('[data-view="end"]')); },
      side: function () { return centre(doc.querySelector('[data-view="side"]')); },
      away: function () { return { x: W() * .8, y: H() * .9 }; }
    };
    function place(n) { return typeof n === "function" ? n() : at[n](); }
    function pointer(type, p) {
      var E = win.PointerEvent || win.MouseEvent;
      stage.dispatchEvent(new E(type, { clientX: p.x, clientY: p.y, button: 0, buttons: type === "pointerup" ? 0 : 1, pointerId: 1, pointerType: "mouse", isPrimary: true, bubbles: true }));
    }
    var pressAt = null, dragFrom = null, dragTo = null, dragging = false, pos = null;
    function press(p, now) { pressAt = { x: p.x, y: p.y, t: now }; }

    var STEPS = [
      // left alone, it drifts. The cursor arrives.
      { from: 1.0, to: 2.0, move: ["rest", "grab"] },
      // a slow drag that eases to a stop, so the model settles on a face rather than tumbling
      { at: 2.05, run: function (now) { dragFrom = at.grab(); dragTo = { x: dragFrom.x, y: dragFrom.y + H() * .34 }; dragging = true; pointer("pointerdown", dragFrom); press(dragFrom, now); } },
      { from: 2.05, to: 4.0, drag: true },
      { at: 4.0, run: function () { dragging = false; pointer("pointerup", dragTo); } },
      // choose a layer
      { from: 4.6, to: 5.5, move: [function () { return dragTo; }, "layer"] },
      { at: 5.6, run: function (now) { press(pos, now); doc.querySelectorAll(".layer-btn")[2].click(); } },
      // end on, the three questions
      { from: 6.0, to: 6.8, move: ["layer", "end"] },
      { at: 6.9, run: function (now) { press(pos, now); doc.querySelector('[data-view="end"]').click(); } },
      // and back to the side, as it started
      { from: 8.0, to: 8.7, move: ["end", "side"] },
      { at: 8.8, run: function (now) { press(pos, now); doc.querySelector('[data-view="side"]').click(); } },
      { from: 9.2, to: 10, move: ["side", "away"] }
    ];

    var t0 = null, done = {};
    function tick(now) {
      if (t0 === null) t0 = now;
      var t = (now - t0) / 1000;
      if (t >= LENGTH) {
        if (!o.loop) { cur.setAttribute("opacity", 0); if (o.onDone) o.onDone(); return; }
        t0 = now; t = 0; done = {};
      }
      STEPS.forEach(function (s, i) {
        if (s.at != null && t >= s.at && !done[i]) { done[i] = true; s.run(now); }
        if (s.move && t >= s.from && t <= s.to + .05) pos = lerp(place(s.move[0]), place(s.move[1]), ease((t - s.from) / (s.to - s.from)));
        if (s.drag && dragging && t >= s.from && t <= s.to) { pos = lerp(dragFrom, dragTo, ease((t - s.from) / (s.to - s.from))); pointer("pointermove", pos); }
      });
      if (!pos) pos = at.rest();
      // the cursor fades in as it arrives and out as it leaves, and dips a little when it presses
      var op = t < 1 ? 0 : t < 1.4 ? (t - 1) / .4 : t > 9.6 ? Math.max(0, (10 - t) / .4) : 1;
      var k = pressAt && now - pressAt.t < 160 ? .86 : 1;
      cur.setAttribute("opacity", op.toFixed(3));
      cur.setAttribute("transform", "translate(" + pos.x.toFixed(1) + " " + pos.y.toFixed(1) + ") scale(" + k + ")");
      if (pressAt && now - pressAt.t < 700) {
        var f = (now - pressAt.t) / 700;
        ring.setAttribute("cx", pressAt.x); ring.setAttribute("cy", pressAt.y);
        ring.setAttribute("r", (6 + 16 * ease(f)).toFixed(1)); ring.setAttribute("opacity", (1 - f).toFixed(3));
      } else ring.setAttribute("opacity", 0);
      hw.requestAnimationFrame(tick);
    }
    hw.requestAnimationFrame(tick);
  }
  window.NavShowcase = { start: start, length: LENGTH };
})();
