/* Phaser view. Rules live in sim.js. DOM holds the HUD, d-pad, fail bar, and receipt. */
(function () {
  const S = window.CatFishSim;
  const TILE = S.TILE;
  const lang = window.CF_LANG || "fr";
  const I18N = {
    fr: {
      level: "Niveau", fish: "Poissons", hidden: "Caché dans le buisson",
      hintSafe: "Le 1er poisson est juste à côté. Aucun risque.",
      hintCone: "Le cône orange, c'est le regard du Shiba. Passe quand il tourne le dos.",
      hintBush: "Entre dans un buisson : le Shiba ne te voit plus.",
      hintKing: "Le roi doré est sur l'îlot. Trois Shiba rapides.",
      home: "Tous les poissons ! File à la maison rouge.",
      spotted: "Repéré par le Shiba ! Touche pour réessayer",
      banner: "Niveau {n}",
      ticketK: "TICKET · CHAT VOLEUR", ticketT: "Île aux Shiba",
      timeL: "Temps", caughtL: "Attrapé", beat: "Tu bats {n}% des joueurs",
      copy: "Copier mon ticket", copied: "Copié · colle-le en commentaire", again: "Rejouer",
      share: function (sec, caught, pct) { return "🐱 Voleur de poisson\n" + sec + "s · attrapé " + caught + "× · je bats " + pct + "% des joueurs\nFaufile le chat sans que le Shiba te voie.\n" + location.href; },
      cards: [
        ["🧸", "Pince 3D pastel", "Attrape la capsule", "/lucky-claw/fr/"],
        ["🔮", "Gashapon japonais", "Tourne la manivelle", "/gashapon/fr/"],
        ["👟", "Vrai ou faux 250€", "Test d'œil baskets", "/spot-diff/fr/"]
      ]
    },
    es: {
      level: "Nivel", fish: "Peces", hidden: "Oculto en el arbusto",
      hintSafe: "El primer pez está al lado. Cero riesgo.",
      hintCone: "El cono naranja es la mirada del Shiba. Cruza cuando mire al otro lado.",
      hintBush: "Métete en un arbusto: el Shiba no te ve.",
      hintKing: "El rey dorado está en el islote. Tres Shiba rápidos.",
      home: "¡Todos los peces! Corre a la casa roja.",
      spotted: "¡El Shiba te vio! Toca para reintentar",
      banner: "Nivel {n}",
      ticketK: "TICKET · GATO LADRÓN", ticketT: "Isla de los Shiba",
      timeL: "Tiempo", caughtL: "Atrapado", beat: "Superaste al {n}% de jugadores",
      copy: "Copiar mi ticket", copied: "Copiado", again: "Jugar otra vez",
      share: function (sec, caught, pct) { return "🐱 Gato ladrón de peces\n" + sec + "s · atrapado " + caught + "× · superé al " + pct + "%\nEsquiva al Shiba y lleva los peces a casa.\n" + location.href; },
      cards: [
        ["🧸", "Garra 3D pastel", "Atrapa la cápsula", "/lucky-claw/es/"],
        ["🔮", "Gashapon japonés", "Gira la manivela", "/gashapon/es/"],
        ["👟", "Real o fake 250€", "Test de zapatillas", "/spot-diff/es/"]
      ]
    },
    de: {
      level: "Level", fish: "Fische", hidden: "Im Busch versteckt",
      hintSafe: "Der erste Fisch liegt direkt neben dir. Kein Risiko.",
      hintCone: "Der orange Kegel ist der Blick vom Shiba. Lauf, wenn er wegschaut.",
      hintBush: "Ab in den Busch: der Shiba sieht dich nicht.",
      hintKing: "Der Goldfischkönig sitzt auf der Insel. Drei schnelle Shibas.",
      home: "Alle Fische! Renn ins rote Haus.",
      spotted: "Vom Shiba entdeckt! Tippen zum Neustart",
      banner: "Level {n}",
      ticketK: "BON · FISCHDIEB", ticketT: "Shiba-Insel",
      timeL: "Zeit", caughtL: "Erwischt", beat: "Du schlägst {n}% der Spieler",
      copy: "Ticket kopieren", copied: "Kopiert", again: "Nochmal",
      share: function (sec, caught, pct) { return "🐱 Katzen-Fischdieb\n" + sec + "s · erwischt " + caught + "× · ich schlage " + pct + "%\nSchleich am Shiba vorbei und bring die Fische heim.\n" + location.href; },
      cards: [
        ["🧸", "3D-Greifautomat", "Schnapp die Kapsel", "/lucky-claw/de/"],
        ["🔮", "Japan-Kapselautomat", "Dreh die Kurbel", "/gashapon/de/"],
        ["👟", "Echt oder Fake 250€", "Sneaker-Augentest", "/spot-diff/de/"]
      ]
    },
    en: {
      level: "Level", fish: "Fish", hidden: "Hidden in the bush",
      hintSafe: "The first fish is right beside you. Zero risk.",
      hintCone: "The orange cone is the Shiba's gaze. Slip past when it turns away.",
      hintKing: "The golden king sits on the islet. Three fast Shibas.",
      hintBush: "Step into a bush. The Shiba can't see you there.",
      home: "All fish! Run to the red-roof house.",
      spotted: "Spotted by Guard Shiba! Tap to Instant Retry",
      banner: "Level {n}",
      ticketK: "RECEIPT · FISH HEIST", ticketT: "Cow cat of the island",
      timeL: "Time", caughtL: "Caught", beat: "You beat {n}% of players",
      copy: "Copy my receipt", copied: "Copied", again: "Play again",
      share: function (sec, caught, pct) { return "🐱 Cat Fish Heist\n" + sec + "s · caught " + caught + "× · I beat " + pct + "% of players\nSneak past the Shiba and bring the fish home.\n" + location.href; },
      cards: [
        ["🧸", "Pastel 3D Claw", "Grab the capsule", "/lucky-claw/en/"],
        ["🔮", "Japanese Gashapon", "Turn the crank", "/gashapon/en/"],
        ["👟", "Real or fake 250€", "Sneaker eye test", "/spot-diff/en/"]
      ]
    }
  };
  const T = I18N[lang] || I18N.fr;

  const DOT_URL = "https://dot.hacoo.app/api/v2/dotRecords";
  const GAME = "cat_fish";
  const pageT0 = Date.now();
  const pageId = (Math.random().toString(16).slice(2) + pageT0.toString(16)).slice(0, 24);
  let started = false, rounds = 0, completed = false, shared = false, summarized = false;
  function sid() {
    try {
      let id = localStorage.getItem("pc_sid");
      if (!id) { id = (crypto.randomUUID && crypto.randomUUID()) || String(Math.random()).slice(2); localStorage.setItem("pc_sid", id); }
      return id;
    } catch (e) { return "anon"; }
  }
  function report(aid, extra) {
    const ts = Date.now();
    const apar = Object.assign({ game: GAME, lang: lang, page: location.pathname }, extra || {});
    const payload = JSON.stringify({ data: [{
      what: "user_trace", who: "client", when: ts, platform: "h5", app: "saramart",
      context: { app: "saramart", platform: "h5", game: GAME, lang: lang, uuid: sid(), page: location.pathname },
      data: { type: "event", aid: aid, event_ts: ts, page_create_ts: pageT0, page_id: pageId, page_url: location.href, apar: JSON.stringify(apar) }
    }] });
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon(DOT_URL, new Blob([payload], { type: "text/plain;charset=UTF-8" }));
        return;
      }
    } catch (e) {}
    fetch(DOT_URL, { method: "POST", headers: { "Content-Type": "text/plain;charset=UTF-8" }, body: payload, keepalive: true, mode: "no-cors" }).catch(function () {});
  }
  function reportPageView() { report("h5_page_view", { title: document.title }); }
  function reportGameStart() { if (started) return; started = true; report("h5_game_start", { level: 1 }); }
  function reportRound(extra) { rounds += 1; report("h5_round_complete", Object.assign({ round: rounds }, extra || {})); }
  function reportComplete(extra) { if (completed) return; completed = true; report("h5_game_complete", extra || {}); }
  function reportShare(extra) { shared = true; report("h5_share_click", extra || {}); }
  function reportSummary() {
    if (summarized) return;
    summarized = true;
    report("h5_session_summary", {
      dwell_ms: Date.now() - pageT0, rounds: rounds, completed: completed, shared: shared, started: started,
      level: sim.level, caught: sim.caught, time_ms: sim.timeMs
    });
  }
  addEventListener("pagehide", reportSummary);
  reportPageView();

  const sim = new S.HeistSim();
  const pad = { x: 0, y: 0, held: false };
  let keys = null;
  let actx = null;
  let failTimer = 0;
  let levelTimer = 0;
  let drag = null;

  function audio() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!actx && AC) actx = new AC();
    if (actx && actx.state === "suspended") actx.resume();
    return actx;
  }
  function blip(freq, dur, type, gain, delay) {
    const ac = audio(); if (!ac) return;
    const o = ac.createOscillator(), g = ac.createGain();
    const t0 = ac.currentTime + (delay || 0);
    o.type = type || "square";
    o.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain || 0.04, t0 + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(ac.destination);
    o.start(t0); o.stop(t0 + dur + 0.02);
  }
  function pickupSound(king) {
    blip(king ? 880 : 740, 0.07, "square", 0.035);
    blip(king ? 1320 : 1180, 0.1, "square", 0.03, 0.06);
    if (king) blip(1760, 0.14, "square", 0.025, 0.12);
  }
  function bark() {
    blip(180, 0.09, "sawtooth", 0.05);
    blip(110, 0.16, "square", 0.045, 0.08);
    blip(160, 0.1, "sawtooth", 0.04, 0.18);
  }
  function chime(big) {
    const notes = big ? [523, 659, 784, 1046] : [659, 880];
    notes.forEach(function (f, i) { blip(f, big ? 0.28 : 0.16, "square", 0.035, i * 0.07); });
  }
  function arm() { sim.armed = true; reportGameStart(); audio(); }

  function fmt(ms) {
    const s = ms / 1000;
    if (s < 60) return s.toFixed(1) + "s";
    const m = Math.floor(s / 60), r = Math.floor(s % 60);
    return m + ":" + String(r).padStart(2, "0");
  }
  function hintText() {
    if (sim.fishLeft() === 0 && sim.mode === "play") return T.home;
    if (sim.player.hidden) return T.hidden;
    if (sim.level === 1 && !sim.fish[0].got) return T.hintSafe;
    if (sim.level === 1) return T.hintCone;
    if (sim.level === 2) return T.hintBush;
    return T.hintKing;
  }
  const el = function (id) { return document.getElementById(id); };
  function paintHud() {
    const got = sim.fish.length - sim.fishLeft();
    el("hudLevel").textContent = T.level + " " + sim.level + "/3";
    el("hudFish").textContent = "🐟 " + got + "/" + sim.fish.length;
    el("hudTime").textContent = fmt(sim.timeMs);
    el("hint").textContent = hintText();
    el("hideChip").classList.toggle("on", !!sim.player.hidden);
    el("hideChip").textContent = T.hidden;
  }

  function showFail() {
    const bar = el("fail");
    bar.textContent = T.spotted;
    bar.classList.add("on");
    clearTimeout(failTimer);
    failTimer = setTimeout(retryNow, 500);
  }
  function hideFail() { el("fail").classList.remove("on"); clearTimeout(failTimer); }
  function retryNow() {
    if (sim.mode !== "spotted") return;
    hideFail();
    sim.retry();
    if (window.__cfScene) window.__cfScene.afterReset();
  }
  function showBanner(n) {
    const b = el("banner");
    b.textContent = T.banner.replace("{n}", n);
    b.classList.add("on");
  }
  function hideBanner() { el("banner").classList.remove("on"); }

  function showReceipt() {
    const sec = Math.round(sim.timeMs / 1000);
    const pct = S.beatPct(sim.timeMs, sim.caught);
    el("tkK").textContent = T.ticketK;
    el("tkT").textContent = T.ticketT;
    el("tkTimeL").textContent = T.timeL;
    el("tkTime").textContent = fmt(sim.timeMs);
    el("tkCaughtL").textContent = T.caughtL;
    el("tkCaught").textContent = String(sim.caught);
    el("tkBeat").textContent = T.beat.replace("{n}", pct);
    el("copyBtn").textContent = T.copy;
    el("againBtn").textContent = T.again;
    const box = el("cards");
    box.innerHTML = "";
    T.cards.forEach(function (c) {
      const a = document.createElement("a");
      a.className = "xcard";
      a.href = c[3];
      a.innerHTML = "<b>" + c[0] + " " + c[1] + "</b><span>" + c[2] + "</span>";
      box.appendChild(a);
    });
    el("receipt").classList.add("on");
    el("receipt").dataset.pct = String(pct);
    el("receipt").dataset.sec = String(sec);
  }
  function hideReceipt() { el("receipt").classList.remove("on"); }

  el("fail").addEventListener("pointerdown", function (e) { e.preventDefault(); retryNow(); });
  el("copyBtn").addEventListener("click", function () {
    const pct = el("receipt").dataset.pct || "0";
    const sec = el("receipt").dataset.sec || "0";
    const text = T.share(sec, sim.caught, pct);
    reportShare({ pct: Number(pct), sec: Number(sec), caught: sim.caught });
    const done = function () { el("copyBtn").textContent = T.copied; };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done).catch(done);
    else done();
  });
  el("againBtn").addEventListener("click", function () {
    hideReceipt();
    sim.resetAll();
    if (window.__cfScene) window.__cfScene.afterReset();
  });

  document.querySelectorAll("[data-dir]").forEach(function (btn) {
    const x = Number(btn.getAttribute("data-x")), y = Number(btn.getAttribute("data-y"));
    const down = function (e) {
      e.preventDefault();
      pad.x = x; pad.y = y; pad.held = true;
      btn.classList.add("on");
      arm();
    };
    const up = function () {
      if (pad.x === x && pad.y === y) { pad.x = 0; pad.y = 0; pad.held = false; }
      btn.classList.remove("on");
    };
    btn.addEventListener("pointerdown", down);
    btn.addEventListener("pointerup", up);
    btn.addEventListener("pointercancel", up);
    btn.addEventListener("pointerleave", up);
  });

  function sheet(scene, key, w, h, draw) {
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    const g = c.getContext("2d");
    g.imageSmoothingEnabled = false;
    draw(g, w, h);
    if (scene.textures.exists(key)) scene.textures.remove(key);
    scene.textures.addCanvas(key, c);
  }
  function pix(scene, key, lines, pal) {
    const rows = lines;
    const h = rows.length, w = rows[0].length;
    rows.forEach(function (r, i) { if (r.length !== w) throw new Error(key + " row " + i + " len " + r.length); });
    sheet(scene, key, w, h, function (g) {
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        const col = pal[rows[y][x]];
        if (!col) continue;
        g.fillStyle = col;
        g.fillRect(x, y, 1, 1);
      }
    });
  }
  function disc(g, cx, cy, r, color) {
    g.fillStyle = color;
    for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) {
      if (x * x + y * y <= r * r + r * 0.2) g.fillRect(cx + x, cy + y, 1, 1);
    }
  }

  function makeTextures(scene) {
    function water(frame) {
      return function (g) {
        g.fillStyle = "#1d6aa8"; g.fillRect(0, 0, 16, 16);
        g.fillStyle = "#2f86c4";
        for (let i = 0; i < 4; i++) g.fillRect((i * 5 + frame * 3) % 16, 3 + i * 3, 3, 1);
        g.fillStyle = "#b9e6fb";
        g.fillRect((2 + frame * 5) % 16, 11, 2, 1);
        g.fillStyle = "#174e7a";
        g.fillRect(0, 15, 16, 1);
      };
    }
    sheet(scene, "water0", 16, 16, water(0));
    sheet(scene, "water1", 16, 16, water(1));
    [0, 1, 2].forEach(function (v) {
      sheet(scene, "grass" + v, 16, 16, function (g) {
        g.fillStyle = v === 1 ? "#3f9d46" : "#4caf50";
        g.fillRect(0, 0, 16, 16);
        g.fillStyle = "#2f7d38";
        g.fillRect(2, 4, 1, 1); g.fillRect(11, 9, 1, 2); g.fillRect(7, 13, 1, 1);
        g.fillStyle = "#7dce6a";
        g.fillRect(5, 2, 1, 1); g.fillRect(13, 6, 1, 1); g.fillRect(8, 8, 1, 1);
        if (v === 2) { g.fillStyle = "#f9a8d4"; g.fillRect(4, 10, 2, 1); g.fillRect(5, 9, 1, 1); }
      });
    });
    sheet(scene, "path", 16, 16, function (g) {
      g.fillStyle = "#6d675f"; g.fillRect(0, 0, 16, 16);
      g.fillStyle = "#d9d3cb";
      g.fillRect(1, 1, 6, 5); g.fillRect(9, 2, 5, 4); g.fillRect(2, 9, 5, 5); g.fillRect(9, 8, 5, 6);
      g.fillStyle = "#b7b1a8";
      g.fillRect(2, 2, 4, 3); g.fillRect(10, 3, 3, 2); g.fillRect(3, 10, 3, 3);
      g.fillStyle = "#8a847c"; g.fillRect(0, 0, 16, 1);
    });
    sheet(scene, "bridge", 16, 16, function (g) {
      g.fillStyle = "#8a5324"; g.fillRect(0, 0, 16, 16);
      g.fillStyle = "#e2b56a";
      g.fillRect(1, 1, 14, 3); g.fillRect(1, 6, 14, 3); g.fillRect(1, 11, 14, 3);
      g.fillStyle = "#6b3e16";
      g.fillRect(0, 0, 2, 16); g.fillRect(14, 0, 2, 16);
      g.fillStyle = "#f3d7a1"; g.fillRect(3, 2, 2, 1); g.fillRect(8, 7, 2, 1); g.fillRect(5, 12, 2, 1);
    });
    sheet(scene, "mat", 16, 16, function (g) {
      g.fillStyle = "#4caf50"; g.fillRect(0, 0, 16, 16);
      g.fillStyle = "#f3e2c8"; g.fillRect(3, 4, 10, 8);
      g.fillStyle = "#e7c9a4"; g.fillRect(3, 4, 10, 2);
      g.fillStyle = "#6b3e16"; g.fillRect(6, 6, 4, 5);
    });
    sheet(scene, "tree", 16, 16, function (g) {
      disc(g, 8, 6, 5, "#14632d");
      disc(g, 6, 7, 3, "#1f8a3b");
      disc(g, 10, 6, 2, "#0f4d22");
      g.fillStyle = "#6b3f24"; g.fillRect(7, 11, 3, 5);
      g.fillStyle = "#8a5a32"; g.fillRect(8, 12, 1, 3);
    });
    sheet(scene, "rock", 16, 16, function (g) {
      disc(g, 8, 10, 5, "#6d7680");
      disc(g, 7, 9, 3, "#9aa3ad");
      g.fillStyle = "#e7edf2"; g.fillRect(6, 7, 2, 1);
    });
    sheet(scene, "bush", 16, 16, function (g) {
      disc(g, 8, 9, 6, "#14532d");
      disc(g, 5, 9, 3, "#166534");
      disc(g, 11, 8, 3, "#052e16");
      g.fillStyle = "#4ade80"; g.fillRect(4, 7, 1, 1); g.fillRect(9, 6, 1, 1); g.fillRect(7, 10, 1, 1);
    });
    sheet(scene, "house", 48, 48, function (g) {
      g.fillStyle = "#7f1d1d"; g.fillRect(30, 2, 6, 8);
      g.fillStyle = "#450a0a"; g.fillRect(30, 2, 6, 2);
      for (let y = 0; y < 16; y++) {
        const inset = (15 - y) >> 1;
        g.fillStyle = y % 2 ? "#dc2626" : "#ef4444";
        g.fillRect(4 + inset, 8 + y, 40 - inset * 2, 1);
      }
      g.fillStyle = "#f8e7c9"; g.fillRect(8, 24, 32, 20);
      g.fillStyle = "#e7d3b0"; g.fillRect(8, 24, 32, 3);
      g.fillStyle = "#7dd3fc"; g.fillRect(12, 29, 7, 6); g.fillRect(29, 29, 7, 6);
      g.fillStyle = "#bae6fd"; g.fillRect(12, 29, 7, 2); g.fillRect(29, 29, 7, 2);
      g.fillStyle = "#6b3e16"; g.fillRect(20, 30, 8, 14);
      g.fillStyle = "#fbbf24"; g.fillRect(25, 36, 2, 2);
      g.fillStyle = "#fecaca"; g.fillRect(16, 22, 3, 2);
    });
    const catPal = { k: "#1c1410", w: "#fffdf8", b: "#1c1917", p: "#ffb4c8", e: "#111111", n: "#e11d48" };
    pix(scene, "catR", [
      "................",
      ".....kkkk.......",
      "....kwwwk.......",
      "....kwbwk.k.....",
      ".....kwwk.kk....",
      "...kkkwwwkkk....",
      "..kwwbbbbwwk....",
      "..kwwwwwwwwwk...",
      "..kwbbwwwwwwk...",
      "...kkkkkkkkk....",
      "....ww...ww.....",
      "....kk...kk.....",
      "....kk...kk.....",
      ".....k...k......",
      "................",
      "................"
    ], catPal);
    pix(scene, "catR2", [
      "................",
      ".....kkkk.......",
      "....kwwwk.......",
      "....kwbwk.k.....",
      ".....kwwk.kk....",
      "...kkkwwwkkk....",
      "..kwwbbbbwwk....",
      "..kwwwwwwwwwk...",
      "..kwbbwwwwwwk...",
      "...kkkkkkkkk....",
      "...ww.....ww....",
      "...kk.....kk....",
      "...kk.....kk....",
      "....k.....k.....",
      "................",
      "................"
    ], catPal);
    pix(scene, "catD", [
      "................",
      "...kk......kk...",
      "..kwwk....kwwk..",
      "..kbbk....kbbk..",
      "...kk..kk..kk...",
      "....kwwwwwk.....",
      "....kwbebwk.....",
      "....kwwwwwk.....",
      "...kkwnnnwkk....",
      "..kwwwwwwwwwk...",
      "..kwbbbbbbwwk...",
      "..kwwwwwwwwwk...",
      "...kkkkkkkkk....",
      "....k......k....",
      "....k......k....",
      "................"
    ], catPal);
    pix(scene, "catU", [
      "................",
      "...kk......kk...",
      "..kbbk....kbbk..",
      "..kbbk....kbbk..",
      "...kk..kk..kk...",
      "....kbbbbbk.....",
      "...kkbbbbbkk....",
      "..kbbbbbbbbbk...",
      "..kbbwwwwwbbk...",
      "..kbbbbbbbbbk...",
      "...kkkkkkkkk....",
      "....k......k....",
      "....k......k....",
      "................",
      "................",
      "................"
    ], catPal);
    const dogPal = { k: "#3a2415", o: "#f6a04a", y: "#ffe7c2", e: "#1a120c", n: "#1a120c", t: "#fb7185" };
    pix(scene, "dogR", [
      "................",
      "......oooo......",
      ".....oyyyo......",
      ".....oyeyo.o....",
      "......oooo.oo...",
      "....oooooooo....",
      "...oyyyyyyoo....",
      "...oyyoyyyyo....",
      "...oyyyyyyyo....",
      "....oooooooo....",
      ".....oo..oo.....",
      ".....oo..oo.....",
      "......o..o......",
      "................",
      "................",
      "................"
    ], dogPal);
    pix(scene, "dogD", [
      "................",
      "...oo......oo...",
      "..oooo....oooo..",
      "..oyyo....oyyo..",
      "...oo..oo..oo...",
      "....oyyyyyo.....",
      "....oyeeeyo.....",
      "....oyyyyyo.....",
      "...ooyntnyoo....",
      "..oyyyyyyyyyo...",
      "..ooooooooooo...",
      "..oyyyyyyyyyo...",
      "...oooooooo.....",
      "....o......o....",
      "....o......o....",
      "................"
    ], dogPal);
    pix(scene, "dogU", [
      "................",
      "...oo......oo...",
      "..oooo....oooo..",
      "..oooo....oooo..",
      "...oo..oo..oo...",
      "....ooooooo.....",
      "...ooooooooo....",
      "..ooooooooooo...",
      "..oooyyyyyooo...",
      "..ooooooooooo...",
      "...oooooooo.....",
      "....o......o....",
      "....o......o....",
      "................",
      "................",
      "................"
    ], dogPal);
    const fishPal = { k: "#b45309", g: "#fbbf24", w: "#fff7c2", e: "#7c2d12", n: "#fff" };
    pix(scene, "fish", [
      "................",
      "................",
      "......gg........",
      ".....ggggg......",
      "....ggwgggg.....",
      "....ggggggg.....",
      ".....gggggk.....",
      "......gg..k.....",
      "................",
      "................",
      "................",
      "................",
      "................",
      "................",
      "................",
      "................"
    ], fishPal);
    const kingPal = { k: "#b45309", g: "#fde047", w: "#fff", e: "#7c2d12", r: "#ef4444", n: "#fff7c2" };
    pix(scene, "king", [
      "......r.r.......",
      ".....rrrrr......",
      "......ggg.......",
      ".....ggggg......",
      "....ggwgggg.....",
      "...ggggggggg....",
      "....gggggggk....",
      ".....ggg..kk....",
      "......g.........",
      "................",
      "................",
      "................",
      "................",
      "................",
      "................",
      "................"
    ], kingPal);
    sheet(scene, "glow", 16, 16, function (g) {
      g.fillStyle = "#fde047";
      for (let i = 0; i < 8; i++) {
        const a = i / 8 * Math.PI * 2;
        g.fillRect(8 + Math.round(Math.cos(a) * 6), 8 + Math.round(Math.sin(a) * 5), 2, 2);
      }
    });
    pix(scene, "arrow", [
      "..kk..",
      ".kwwk.",
      "kwwwk.",
      "..kk..",
      "..kk..",
      "..kk.."
    ], { k: "#7c2d12", w: "#fde047" });
    pix(scene, "bang", [
      ".kk.",
      ".ww.",
      ".ww.",
      ".ww.",
      ".kk.",
      "....",
      ".kk.",
      ".ww.",
      ".kk."
    ], { k: "#7c2d12", w: "#fde047" });
    pix(scene, "ears", [
      "kk..kk",
      "kwwkww",
      "kbbkbb",
      ".k..k."
    ], { k: "#1c1410", w: "#fffdf8", b: "#1c1917" });
    sheet(scene, "shadow", 10, 4, function (g) {
      g.fillStyle = "rgba(20,16,8,0.35)";
      g.fillRect(1, 1, 8, 2); g.fillRect(2, 0, 6, 4);
    });
  }

  function dirOf(dx, dy) {
    if (Math.abs(dx) < 0.2 && Math.abs(dy) < 0.2) return null;
    if (Math.abs(dx) > Math.abs(dy)) return dx > 0 ? "right" : "left";
    return dy > 0 ? "down" : "up";
  }
  function faceKey(kind, dir, step) {
    if (dir === "up") return kind + "U";
    if (dir === "down") return kind + "D";
    return kind + "R" + (kind === "cat" && step ? "2" : "");
  }

  class Boot extends Phaser.Scene {
    constructor() { super("boot"); }
    create() { makeTextures(this); this.scene.start("play"); }
  }

  class Play extends Phaser.Scene {
    constructor() { super("play"); }
    create() {
      window.__cfScene = this;
      this.waterSprites = [];
      this.dyn = [];
      this.cones = this.add.graphics().setDepth(8);
      this.paths = this.add.graphics().setDepth(9);
      this.catDir = "right";
      this.dogDir = [];
      this.stepT = 0;
      this.waterT = 0;
      this.waterFrame = 0;
      this.camShake = 0;
      this.buildWorld();
      this.input.addPointer(2);
      keys = this.input.keyboard.addKeys({
        W: Phaser.Input.Keyboard.KeyCodes.W,
        A: Phaser.Input.Keyboard.KeyCodes.A,
        S: Phaser.Input.Keyboard.KeyCodes.S,
        D: Phaser.Input.Keyboard.KeyCodes.D,
        up: Phaser.Input.Keyboard.KeyCodes.UP,
        down: Phaser.Input.Keyboard.KeyCodes.DOWN,
        left: Phaser.Input.Keyboard.KeyCodes.LEFT,
        right: Phaser.Input.Keyboard.KeyCodes.RIGHT
      });
      this.input.keyboard.on("keydown", function (e) {
        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) >= 0) e.preventDefault();
      });
      const self = this;
      this.input.on("pointerdown", function (p) {
        if (sim.mode === "spotted") { retryNow(); return; }
        if (sim.mode !== "play") return;
        arm();
        drag = { x: p.x, y: p.y, moved: false };
      });
      this.input.on("pointermove", function (p) {
        if (!drag || !p.isDown || sim.mode !== "play") return;
        const dx = p.x - drag.x, dy = p.y - drag.y;
        if (dx * dx + dy * dy > 100) {
          drag.moved = true;
          const l = Math.hypot(dx, dy) || 1;
          sim.inputDir = { x: dx / l, y: dy / l };
        }
      });
      this.input.on("pointerup", function (p) {
        if (!drag) return;
        if (!drag.moved && sim.mode === "play") {
          const w = self.cameras.main.getWorldPoint(p.x, p.y);
          sim.setGoal(w.x, w.y);
        }
        if (drag.moved) sim.inputDir = null;
        drag = null;
      });
      paintHud();
    }
    buildWorld() {
      const self = this;
      this.dyn.forEach(function (o) { o.destroy(); });
      this.dyn = [];
      this.waterSprites = [];
      const add = function (obj) { self.dyn.push(obj); return obj; };
      let hx0 = 99, hy0 = 99, hx1 = 0, hy1 = 0, house = false;
      for (let ty = 0; ty < 16; ty++) {
        for (let tx = 0; tx < 16; tx++) {
          const ch = sim.map[ty][tx];
          let key = "grass" + ((tx * 3 + ty * 5) % 3);
          if (ch === "~") key = "water0";
          else if (ch === "#") key = "path";
          else if (ch === "=") key = "bridge";
          else if (ch === "D") key = "mat";
          const img = add(this.add.image(tx * TILE, ty * TILE, key).setOrigin(0, 0).setDepth(0));
          if (ch === "~") this.waterSprites.push(img);
          if (ch === "T") add(this.add.image(tx * TILE + 8, ty * TILE + 12, "tree").setOrigin(0.5, 0.85).setDepth((ty + 1) * TILE));
          if (ch === "o") add(this.add.image(tx * TILE + 8, ty * TILE + 12, "rock").setOrigin(0.5, 0.75).setDepth((ty + 1) * TILE));
          if (ch === "*") add(this.add.image(tx * TILE + 8, ty * TILE + 10, "bush").setOrigin(0.5, 0.7).setDepth((ty + 1) * TILE + 2));
          if (ch === "H") {
            house = true;
            hx0 = Math.min(hx0, tx); hy0 = Math.min(hy0, ty);
            hx1 = Math.max(hx1, tx); hy1 = Math.max(hy1, ty);
          }
        }
      }
      if (house) {
        this.house = add(this.add.image(hx0 * TILE, hy0 * TILE - 6, "house").setOrigin(0, 0).setDepth(40));
      }
      this.fishSprites = sim.fish.map(function (f) {
        const glow = f.king ? add(self.add.image(f.x, f.y, "glow").setDepth(80).setAlpha(0.9).setScale(2)) : null;
        const spr = add(self.add.image(f.x, f.y, f.king ? "king" : "fish").setDepth(90).setScale(2));
        return { spr: spr, glow: glow, fish: f };
      });
      this.arrow = add(this.add.image(0, 0, "arrow").setDepth(120).setVisible(false).setScale(2));
      this.dogSprites = sim.dogs.map(function () {
        return {
          shadow: add(self.add.image(0, 0, "shadow").setDepth(40)),
          spr: add(self.add.image(0, 0, "dogR").setDepth(100).setScale(2))
        };
      });
      this.catShadow = add(this.add.image(0, 0, "shadow").setDepth(40));
      this.cat = add(this.add.image(sim.player.x, sim.player.y, "catR").setDepth(110).setScale(2));
      this.ears = add(this.add.image(0, 0, "ears").setDepth(130).setVisible(false).setScale(2));
      this.bang = add(this.add.image(0, 0, "bang").setDepth(600).setVisible(false).setScale(3));
      this.syncActors(0);
    }
    afterReset() {
      this.bang.setVisible(false);
      if (this.fishSprites.length !== sim.fish.length || this.dogSprites.length !== sim.dogs.length) this.buildWorld();
      else this.syncActors(0);
      paintHud();
    }
    readDir() {
      let x = 0, y = 0;
      if (keys) {
        if (keys.left.isDown || keys.A.isDown) x -= 1;
        if (keys.right.isDown || keys.D.isDown) x += 1;
        if (keys.up.isDown || keys.W.isDown) y -= 1;
        if (keys.down.isDown || keys.S.isDown) y += 1;
      }
      if (!x && !y && pad.held) { x = pad.x; y = pad.y; }
      if (x || y) { arm(); return { x: x, y: y }; }
      return null;
    }
    syncActors(time) {
      const bob = Math.round(Math.sin(time / 180) * 1);
      const step = Math.floor(time / 160) % 2 === 0;
      const cdir = this.catDir;
      const ckey = faceKey("cat", cdir, step && (sim.inputDir || sim.path));
      if (this.cat.texture.key !== ckey) this.cat.setTexture(ckey);
      this.cat.setFlipX(cdir === "left");
      this.cat.setPosition(Math.round(sim.player.x), Math.round(sim.player.y) + bob);
      this.cat.setVisible(!sim.player.hidden);
      this.cat.setDepth(200 + sim.player.y);
      this.catShadow.setPosition(Math.round(sim.player.x), Math.round(sim.player.y) + 6);
      this.catShadow.setVisible(!sim.player.hidden);
      this.catShadow.setDepth(199 + sim.player.y);
      this.ears.setPosition(Math.round(sim.player.x), Math.round(sim.player.y) - 10);
      this.ears.setVisible(!!sim.player.hidden);
      this.ears.setDepth(220 + sim.player.y);
      const self = this;
      sim.dogs.forEach(function (dog, i) {
        const view = self.dogSprites[i];
        const d = dirOf(Math.cos(dog.facing), Math.sin(dog.facing)) || "right";
        const key = faceKey("dog", d, false);
        if (view.spr.texture.key !== key) view.spr.setTexture(key);
        view.spr.setFlipX(d === "left");
        view.spr.setPosition(Math.round(dog.x), Math.round(dog.y) + bob);
        view.spr.setDepth(200 + dog.y);
        view.shadow.setPosition(Math.round(dog.x), Math.round(dog.y) + 6);
        view.shadow.setDepth(199 + dog.y);
      });
      this.fishSprites.forEach(function (slot, i) {
        const hop = Math.round(Math.sin(time / 140 + i) * (slot.fish.king ? 3 : 2));
        slot.spr.setVisible(!slot.fish.got);
        slot.spr.setPosition(Math.round(slot.fish.x), Math.round(slot.fish.y) + hop);
        slot.spr.setDepth(180 + slot.fish.y);
        if (slot.glow) {
          slot.glow.setVisible(!slot.fish.got);
          slot.glow.setPosition(slot.spr.x, slot.spr.y);
          slot.glow.setAlpha(0.45 + 0.45 * Math.abs(Math.sin(time / 180)));
          slot.glow.setDepth(170);
        }
      });
      const showArrow = sim.level === 1 && sim.fish[0] && !sim.fish[0].got && sim.mode === "play";
      this.arrow.setVisible(showArrow);
      if (showArrow) {
        this.arrow.setPosition(Math.round(sim.fish[0].x), Math.round(sim.fish[0].y) - 14 - Math.abs(Math.round(Math.sin(time / 200) * 3)));
      }
      if (sim.mode === "spotted") {
        this.bang.setVisible(true);
        this.bang.setPosition(Math.round(sim.player.x), Math.round(sim.player.y) - 18);
      }
    }
    drawCones(time) {
      const g = this.cones;
      g.clear();
      const pulse = 0.45 + 0.55 * Math.abs(Math.sin(time / 70));
      for (let i = 0; i < sim.dogs.length; i++) {
        const dog = sim.dogs[i];
        const warn = dog.alert === "warn";
        const see = dog.alert === "see";
        const fill = see ? 0xff2d2d : warn ? 0xff5a3c : 0xff8a00;
        const alpha = see ? 0.5 : warn ? 0.34 + 0.2 * pulse : 0.42;
        g.fillStyle(fill, alpha);
        g.slice(dog.x, dog.y, dog.range, dog.facing - dog.half, dog.facing + dog.half, false);
        g.fillPath();
        const edge = warn || see ? 0xffe14a : 0xfff3c4;
        g.lineStyle(warn || see ? 2 : 1, edge, warn ? pulse : 0.85);
        const a0 = dog.facing - dog.half, a1 = dog.facing + dog.half;
        g.beginPath();
        g.moveTo(dog.x, dog.y);
        g.arc(dog.x, dog.y, dog.range, a0, a1, false);
        g.closePath();
        g.strokePath();
      }
    }
    drawPath() {
      const g = this.paths;
      g.clear();
      if (!sim.path || sim.mode !== "play") return;
      g.fillStyle(0xfff7d6, 0.95);
      for (let i = 0; i < sim.path.length; i += 1) {
        const p = sim.path[i];
        g.fillRect(Math.round(p.x) - 1, Math.round(p.y) - 1, 2, 2);
      }
    }
    floatFish(ev) {
      const spr = this.add.image(ev.x, ev.y, ev.king ? "king" : "fish").setDepth(520);
      const label = this.add.text(ev.x + 8, ev.y - 8, "+1", {
        fontFamily: "monospace", fontSize: "8px", color: "#fff7d6", stroke: "#7c2d12", strokeThickness: 2
      }).setOrigin(0, 0.5).setDepth(521);
      this.tweens.add({
        targets: [spr, label], y: "-=16", alpha: 0, duration: 680,
        onComplete: function () { spr.destroy(); label.destroy(); }
      });
    }
    onEvents() {
      const evs = sim.events || [];
      for (let i = 0; i < evs.length; i++) {
        const ev = evs[i];
        if (ev.type === "pickup") { pickupSound(ev.king); this.floatFish(ev); }
        if (ev.type === "spotted") {
          bark();
          this.cameras.main.shake(90, 0.012);
          showFail();
        }
        if (ev.type === "clear") {
          const sec = sim.timeMs;
          reportRound({ level: ev.level || sim.level, ms: sec, caught: sim.caught, fish: sim.fish.length });
          chime(sim.mode === "done");
          if (sim.mode === "done") {
            const pct = S.beatPct(sim.timeMs, sim.caught);
            reportComplete({ ms: sim.timeMs, caught: sim.caught, pct: pct, levels: 3 });
            showReceipt();
          } else {
            const next = sim.level + 1;
            showBanner(next);
            clearTimeout(levelTimer);
            levelTimer = setTimeout(function () {
              hideBanner();
              sim.load(next);
              if (window.__cfScene) window.__cfScene.buildWorld();
            }, 560);
          }
        }
      }
    }
    update(time, delta) {
      const dt = Math.min(40, delta || 16);
      if (sim.mode === "play") {
        const dir = this.readDir();
        if (dir) sim.inputDir = dir;
        else if (!(drag && drag.moved)) sim.inputDir = null;
        const before = { x: sim.player.x, y: sim.player.y };
        sim.step(dt);
        const dx = sim.player.x - before.x, dy = sim.player.y - before.y;
        const d = dirOf(dx, dy);
        if (d) this.catDir = d;
        this.onEvents();
      }
      this.waterT += dt;
      if (this.waterT > 320) {
        this.waterT = 0;
        this.waterFrame = 1 - this.waterFrame;
        const key = this.waterFrame ? "water1" : "water0";
        this.waterSprites.forEach(function (s) { s.setTexture(key); });
      }
      this.syncActors(time);
      this.drawCones(time);
      this.drawPath();
      paintHud();
    }
  }

  const game = new Phaser.Game({
    type: Phaser.CANVAS,
    parent: "stage",
    width: 256,
    height: 256,
    backgroundColor: "#1d6aa8",
    pixelArt: true,
    roundPixels: true,
    antialias: false,
    banner: false,
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    scene: [Boot, Play],
    audio: { noAudio: true },
    input: { activePointers: 3 }
  });
  window.__cfGame = game;
})();
