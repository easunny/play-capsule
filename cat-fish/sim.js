/* Cat Fish Heist rules — outside the Phaser scene.
   Loop (game-design, sickn33/antigravity-awesome-skills): move → warning → fish → home.
   Level 1 early win, cone telegraphs danger, fail retries in the same beat. */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.CatFishSim = api;
})(typeof self !== "undefined" ? self : this, function () {
  const TILE = 16;
  const COLS = 16;
  const ROWS = 16;
  const SPEED = 78;
  const PICKUP = 15;
  const WALK = { ".": 1, "#": 1, "=": 1, "*": 1, D: 1 };
  const LOS_BLOCK = { T: 1, o: 1, H: 1 };

  const W = "~", G = ".", P = "#", B = "=", U = "*", T = "T", R = "o", H = "H", D = "D";
  function row() {
    const c = Array.prototype.slice.call(arguments);
    if (c.length !== COLS) throw new Error("row " + c.length + " " + c.join(""));
    return c;
  }

  const L1 = [
    row(W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W),
    row(W, G, G, G, G, G, G, G, G, G, G, G, G, G, G, W),
    row(W, G, T, T, T, T, T, T, T, T, H, H, H, G, G, W),
    row(W, T, T, T, T, T, T, T, T, T, H, H, H, T, T, W),
    row(W, T, T, T, P, P, P, P, P, P, D, T, T, T, T, W),
    row(W, T, T, T, P, P, P, P, P, T, T, T, T, T, T, W),
    row(W, G, G, G, G, P, P, G, G, G, G, G, G, G, G, W),
    row(W, W, W, W, B, B, B, B, W, W, W, W, W, W, W, W),
    row(W, G, G, G, G, P, P, G, G, G, G, G, G, G, G, W),
    row(W, G, G, G, G, P, P, G, G, G, G, G, G, G, G, W),
    row(W, G, G, T, G, P, P, G, G, G, G, G, G, G, G, W),
    row(W, G, G, G, G, P, P, G, G, G, G, G, G, G, G, W),
    row(W, G, G, R, G, P, P, G, G, G, G, G, G, G, G, W),
    row(W, G, G, G, G, P, P, G, G, G, G, G, G, G, G, W),
    row(W, G, G, G, G, G, G, G, G, G, G, G, G, G, G, W),
    row(W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W)
  ];

  const L2 = L1.map(function (r) { return r.slice(); });
  L2[4] = row(W, T, T, T, P, P, U, P, P, P, D, T, T, T, T, W);
  L2[8] = row(W, G, G, G, G, P, U, G, G, G, G, G, G, G, G, W);

  const L3 = [
    row(W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W),
    row(W, G, G, G, G, G, G, G, G, G, G, G, G, G, G, W),
    row(W, G, G, T, G, G, G, G, G, G, H, H, H, G, G, W),
    row(W, G, G, G, G, G, G, G, G, G, H, H, H, G, G, W),
    row(W, P, P, P, P, P, P, P, P, P, P, D, G, G, G, W),
    row(W, G, W, W, W, W, W, W, W, W, W, W, G, G, G, W),
    row(W, G, W, W, G, G, G, G, G, W, W, W, G, G, G, W),
    row(W, G, W, W, G, G, G, G, G, W, W, W, G, G, G, W),
    row(W, G, W, W, W, B, B, B, W, W, W, W, G, G, G, W),
    row(W, G, P, P, P, P, P, P, P, P, P, P, G, G, G, W),
    row(W, G, G, G, G, G, G, G, G, G, G, G, G, G, G, W),
    row(W, G, G, T, G, G, G, G, G, G, G, G, G, G, G, W),
    row(W, G, G, G, G, G, G, G, G, G, G, G, G, G, G, W),
    row(W, G, G, G, G, P, P, G, G, G, G, G, G, G, G, W),
    row(W, G, G, G, G, G, G, G, G, G, G, G, G, G, G, W),
    row(W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W)
  ];

  function cell(tx, ty) { return { tx: tx, ty: ty }; }
  function center(tx, ty, ox, oy) {
    return { x: (tx + 0.5) * TILE + (ox || 0), y: (ty + 0.5) * TILE + (oy || 0) };
  }

  const LEVELS = {
    1: {
      map: L1,
      px: 5, py: 13,
      fish: [
        { tx: 6, ty: 13, ox: 2, oy: 0, king: false },
        { tx: 4, ty: 4, king: false },
        { tx: 9, ty: 4, king: false }
      ],
      dogs: [
        { tx: 7, ty: 4, mode: "turn", facing: 0, turnEvery: 2600, range: 66, half: 0.60, speed: 0, waypoints: [], pause: 0 }
      ]
    },
    2: {
      map: L2,
      px: 5, py: 13,
      fish: [
        { tx: 6, ty: 13, ox: 2, oy: 0, king: false },
        { tx: 4, ty: 4, king: false },
        { tx: 9, ty: 4, king: false }
      ],
      dogs: [
        { tx: 4, ty: 4, mode: "patrol", facing: 0, range: 50, half: 0.58, speed: 34, pause: 480, waypoints: [[4, 4], [9, 4]] },
        { tx: 3, ty: 9, mode: "patrol", facing: 0, range: 78, half: 0.62, speed: 36, pause: 420, waypoints: [[3, 9], [12, 9]] }
      ]
    },
    3: {
      map: L3,
      px: 5, py: 13,
      fish: [
        { tx: 6, ty: 13, ox: 2, oy: 0, king: false },
        { tx: 4, ty: 11, king: false },
        { tx: 13, ty: 8, king: false },
        { tx: 6, ty: 6, king: true }
      ],
      dogs: [
        { tx: 2, ty: 4, mode: "patrol", facing: 0, range: 50, half: 0.55, speed: 52, pause: 320, waypoints: [[2, 4], [10, 4]] },
        { tx: 2, ty: 9, mode: "patrol", facing: 0, range: 50, half: 0.55, speed: 52, pause: 320, waypoints: [[2, 9], [10, 9]] },
        { tx: 13, ty: 5, mode: "patrol", facing: Math.PI / 2, range: 46, half: 0.52, speed: 46, pause: 280, waypoints: [[13, 5], [13, 12]] }
      ]
    }
  };

  function wrap(a) {
    while (a > Math.PI) a -= Math.PI * 2;
    while (a < -Math.PI) a += Math.PI * 2;
    return a;
  }

  function beatPct(ms, caught) {
    const sec = ms / 1000;
    const raw = 97 - Math.max(0, sec - 42) * 0.62 - caught * 6.5;
    return Math.max(7, Math.min(99, Math.round(raw)));
  }

  function HeistSim() {
    this.timeMs = 0;
    this.caught = 0;
    this.armed = false;
    this.level = 1;
    this.mode = "play";
    this.path = null;
    this.inputDir = null;
    this.events = [];
    this.player = { x: 0, y: 0, hidden: false };
    this.fish = [];
    this.dogs = [];
    this.map = [];
    this.door = { x: 0, y: 0 };
    this.load(1);
  }

  HeistSim.prototype.charAt = function (x, y) {
    const tx = Math.floor(x / TILE), ty = Math.floor(y / TILE);
    if (tx < 0 || ty < 0 || tx >= COLS || ty >= ROWS) return W;
    return this.map[ty][tx];
  };

  HeistSim.prototype.walkable = function (tx, ty, extra) {
    if (tx < 0 || ty < 0 || tx >= COLS || ty >= ROWS) return false;
    if (!WALK[this.map[ty][tx]]) return false;
    if (extra && extra(tx, ty)) return false;
    return true;
  };

  HeistSim.prototype.blockedPoint = function (x, y) {
    return !this.walkable(Math.floor(x / TILE), Math.floor(y / TILE));
  };

  HeistSim.prototype.tryMove = function (dx, dy) {
    const r = 5;
    const p = this.player;
    if (dx) {
      const nx = p.x + dx;
      if (!this.blockedPoint(nx, p.y - r) && !this.blockedPoint(nx, p.y) && !this.blockedPoint(nx, p.y + r)) p.x = nx;
    }
    if (dy) {
      const ny = p.y + dy;
      if (!this.blockedPoint(p.x - r, ny) && !this.blockedPoint(p.x, ny) && !this.blockedPoint(p.x + r, ny)) p.y = ny;
    }
  };

  HeistSim.prototype.hasLOS = function (x0, y0, x1, y1) {
    const dist = Math.hypot(x1 - x0, y1 - y0);
    const steps = Math.max(1, Math.floor(dist / 4));
    for (let i = 1; i < steps; i++) {
      const t = i / steps;
      const along = t * dist;
      if (along < 10 || dist - along < 8) continue;
      const x = x0 + (x1 - x0) * t;
      const y = y0 + (y1 - y0) * t;
      if (LOS_BLOCK[this.charAt(x, y)]) return false;
    }
    return true;
  };

  HeistSim.prototype.inCone = function (dog, x, y) {
    const dx = x - dog.x, dy = y - dog.y;
    const dist = Math.hypot(dx, dy);
    if (dist <= 9) return true;
    if (dist > dog.range) return false;
    return Math.abs(wrap(Math.atan2(dy, dx) - dog.facing)) < dog.half;
  };

  HeistSim.prototype.alertAt = function (x, y, hidden) {
    let worst = "none";
    for (let i = 0; i < this.dogs.length; i++) {
      const dog = this.dogs[i];
      const dx = x - dog.x, dy = y - dog.y;
      const dist = Math.hypot(dx, dy);
      const ang = Math.abs(wrap(Math.atan2(dy, dx) - dog.facing));
      const los = this.hasLOS(dog.x, dog.y, x, y);
      let a = "none";
      if (hidden) a = "none";
      else if (dist <= 9 || (los && dist <= dog.range && ang < dog.half)) a = "see";
      else if (los && dist <= dog.range + 14 && ang < dog.half + 0.30) a = "warn";
      if (dog.alert !== "see") dog.alert = a;
      if (a === "see") worst = "see";
      else if (a === "warn" && worst !== "see") worst = "warn";
    }
    return worst;
  };

  HeistSim.prototype.isHidden = function (x, y) {
    if (this.charAt(x, y) === "*") return true;
    const tx = Math.floor(x / TILE), ty = Math.floor(y / TILE);
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const cx = tx + dx, cy = ty + dy;
        if (cx < 0 || cy < 0 || cx >= COLS || cy >= ROWS) continue;
        if (this.map[cy][cx] !== "*") continue;
        if (Math.hypot((cx + 0.5) * TILE - x, (cy + 0.5) * TILE - y) <= 12) return true;
      }
    }
    return false;
  };

  HeistSim.prototype.scan = function () {
    for (let i = 0; i < this.dogs.length; i++) this.dogs[i].alert = "none";
    const hidden = this.isHidden(this.player.x, this.player.y);
    this.player.hidden = hidden;
    return this.alertAt(this.player.x, this.player.y, hidden);
  };

  HeistSim.prototype.findDoor = function () {
    for (let ty = 0; ty < ROWS; ty++) {
      for (let tx = 0; tx < COLS; tx++) {
        if (this.map[ty][tx] === "D") return center(tx, ty);
      }
    }
    return center(1, 1);
  };

  HeistSim.prototype.load = function (level) {
    const spec = LEVELS[level];
    if (!spec) return;
    this.level = level;
    this.map = spec.map.map(function (r) { return r.slice(); });
    const p = center(spec.px, spec.py);
    this.player.x = p.x;
    this.player.y = p.y;
    this.player.hidden = false;
    this.fish = spec.fish.map(function (f) {
      const c = center(f.tx, f.ty, f.ox, f.oy);
      return { x: c.x, y: c.y, tx: f.tx, ty: f.ty, king: !!f.king, got: false };
    });
    this.dogs = spec.dogs.map(function (d) {
      const c = center(d.tx, d.ty);
      return {
        x: c.x, y: c.y, tx: d.tx, ty: d.ty,
        mode: d.mode, facing: d.facing || 0, turnEvery: d.turnEvery || 2000,
        range: d.range, half: d.half, speed: d.speed || 0,
        pause: d.pause || 0, pauseLeft: 0, faceMs: 0, wi: 0, alert: "none",
        waypoints: d.waypoints.map(function (w) { return w.slice(); }),
        faceEast: (d.facing || 0) === 0
      };
    });
    this.door = this.findDoor();
    this.path = null;
    this.inputDir = null;
    this.mode = "play";
    this.events = [];
  };

  HeistSim.prototype.resetAll = function () {
    this.timeMs = 0;
    this.caught = 0;
    this.armed = false;
    this.load(1);
  };

  HeistSim.prototype.retry = function () {
    const timeMs = this.timeMs, caught = this.caught, armed = this.armed;
    this.load(this.level);
    this.timeMs = timeMs;
    this.caught = caught;
    this.armed = armed;
  };

  HeistSim.prototype.nearestWalk = function (x, y, extra) {
    const tx0 = Math.floor(x / TILE), ty0 = Math.floor(y / TILE);
    if (this.walkable(tx0, ty0, extra)) return { tx: tx0, ty: ty0 };
    for (let rad = 1; rad <= 5; rad++) {
      for (let ty = ty0 - rad; ty <= ty0 + rad; ty++) {
        for (let tx = tx0 - rad; tx <= tx0 + rad; tx++) {
          if (this.walkable(tx, ty, extra)) return { tx: tx, ty: ty };
        }
      }
    }
    return null;
  };

  HeistSim.prototype.tileCost = function (tx, ty, extra) {
    if (!this.walkable(tx, ty, extra)) return 0;
    if (this.map[ty][tx] === "*") return 1;
    const x = (tx + 0.5) * TILE, y = (ty + 0.5) * TILE;
    for (let i = 0; i < this.dogs.length; i++) {
      const dog = this.dogs[i];
      const dist = Math.hypot(dog.x - x, dog.y - y);
      const ang = Math.abs(wrap(Math.atan2(y - dog.y, x - dog.x) - dog.facing));
      const los = dist <= 9 || this.hasLOS(dog.x, dog.y, x, y);
      if (los && (dist <= 9 || (ang < dog.half && dist <= dog.range))) return 14;
      if (this.level >= 3 && dog.speed > 0 && this.nearPatrol(dog, tx, ty)) return 5;
    }
    return 1;
  };

  HeistSim.prototype.nearPatrol = function (dog, tx, ty) {
    const wps = dog.waypoints;
    if (!wps || wps.length < 2) return false;
    for (let i = 0; i < wps.length - 1; i++) {
      const ax = wps[i][0], ay = wps[i][1], bx = wps[i + 1][0], by = wps[i + 1][1];
      const minx = Math.min(ax, bx) - 1, maxx = Math.max(ax, bx) + 1;
      const miny = Math.min(ay, by) - 1, maxy = Math.max(ay, by) + 1;
      if (tx < minx || tx > maxx || ty < miny || ty > maxy) continue;
      if (ay === by && Math.abs(ty - ay) <= 1) return true;
      if (ax === bx && Math.abs(tx - ax) <= 1) return true;
    }
    return false;
  };

  HeistSim.prototype.findPath = function (sx, sy, gx, gy, extra) {
    const start = this.nearestWalk(sx, sy, extra);
    const gtx = Math.floor(gx / TILE), gty = Math.floor(gy / TILE);
    let goal = null;
    if (this.walkable(gtx, gty, extra)) goal = { tx: gtx, ty: gty };
    else goal = this.nearestWalk(gx, gy, extra);
    if (!start || !goal) return null;
    const key = function (tx, ty) { return tx + "," + ty; };
    const prev = {};
    const cost = {};
    cost[key(start.tx, start.ty)] = 0;
    const q = [start];
    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    let found = null;
    while (q.length) {
      q.sort(function (a, b) { return cost[key(a.tx, a.ty)] - cost[key(b.tx, b.ty)]; });
      const cur = q.shift();
      if (cur.tx === goal.tx && cur.ty === goal.ty) { found = cur; break; }
      const base = cost[key(cur.tx, cur.ty)];
      for (let i = 0; i < dirs.length; i++) {
        const tx = cur.tx + dirs[i][0], ty = cur.ty + dirs[i][1];
        const step = this.tileCost(tx, ty, extra);
        if (!step) continue;
        const k = key(tx, ty);
        const next = base + step;
        if (cost[k] != null && cost[k] <= next) continue;
        cost[k] = next;
        prev[k] = cur;
        q.push({ tx: tx, ty: ty });
      }
    }
    if (!found) return null;
    const tiles = [];
    let cur = found;
    while (cur) {
      tiles.push(cur);
      cur = prev[key(cur.tx, cur.ty)];
    }
    tiles.reverse();
    const pts = [];
    for (let i = 1; i < tiles.length; i++) pts.push(center(tiles[i].tx, tiles[i].ty));
    if (gtx === goal.tx && gty === goal.ty && !this.blockedPoint(gx, gy)) {
      if (!pts.length) pts.push({ x: gx, y: gy });
      else pts[pts.length - 1] = { x: gx, y: gy };
    } else if (!pts.length) {
      const c = center(goal.tx, goal.ty);
      if (Math.hypot(c.x - sx, c.y - sy) > 1) pts.push(c);
    }
    return pts;
  };

  HeistSim.prototype.setGoal = function (x, y) {
    if (this.mode !== "play") return;
    const path = this.findPath(this.player.x, this.player.y, x, y);
    this.path = path && path.length ? path : null;
  };

  HeistSim.prototype.moveDogs = function (dt) {
    for (let i = 0; i < this.dogs.length; i++) {
      const dog = this.dogs[i];
      if (dog.mode === "turn") {
        dog.faceMs += dt;
        if (dog.faceMs >= dog.turnEvery) {
          dog.faceMs = 0;
          dog.faceEast = !dog.faceEast;
          dog.facing = dog.faceEast ? 0 : Math.PI;
        }
        continue;
      }
      if (!dog.waypoints.length) continue;
      if (dog.pauseLeft > 0) {
        dog.pauseLeft -= dt;
        const nxt = dog.waypoints[(dog.wi + 1) % dog.waypoints.length];
        const c = center(nxt[0], nxt[1]);
        dog.facing = Math.atan2(c.y - dog.y, c.x - dog.x);
        continue;
      }
      const wp = dog.waypoints[dog.wi];
      const c = center(wp[0], wp[1]);
      const dx = c.x - dog.x, dy = c.y - dog.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 1.6) {
        dog.x = c.x;
        dog.y = c.y;
        dog.wi = (dog.wi + 1) % dog.waypoints.length;
        dog.pauseLeft = dog.pause;
      } else {
        const step = Math.min(dist, dog.speed * dt / 1000);
        dog.x += dx / dist * step;
        dog.y += dy / dist * step;
        dog.facing = Math.atan2(dy, dx);
      }
    }
  };

  HeistSim.prototype.fishLeft = function () {
    let n = 0;
    for (let i = 0; i < this.fish.length; i++) if (!this.fish[i].got) n++;
    return n;
  };

  HeistSim.prototype.step = function (dt) {
    this.events = [];
    if (dt > 50) dt = 50;
    if (this.mode !== "play") return;
    this.moveDogs(dt);
    if (this.armed) this.timeMs += dt;
    const dir = this.inputDir;
    if (dir && (dir.x || dir.y)) {
      this.path = null;
      const len = Math.hypot(dir.x, dir.y) || 1;
      const step = SPEED * dt / 1000;
      this.tryMove(dir.x / len * step, dir.y / len * step);
    } else if (this.path && this.path.length) {
      let budget = SPEED * dt / 1000;
      let guard = 0;
      while (this.path.length && budget > 0.01 && guard++ < 6) {
        const p = this.path[0];
        const dx = p.x - this.player.x, dy = p.y - this.player.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 1.25) { this.path.shift(); continue; }
        if (dist <= budget) {
          this.tryMove(dx, dy);
          budget -= dist;
          this.path.shift();
        } else {
          this.tryMove(dx / dist * budget, dy / dist * budget);
          budget = 0;
        }
      }
      if (this.path && !this.path.length) this.path = null;
    }
    for (let i = 0; i < this.fish.length; i++) {
      const f = this.fish[i];
      if (f.got) continue;
      if (Math.hypot(f.x - this.player.x, f.y - this.player.y) <= PICKUP) {
        f.got = true;
        this.events.push({ type: "pickup", king: f.king, x: f.x, y: f.y });
      }
    }
    if (this.fishLeft() === 0 && Math.hypot(this.player.x - this.door.x, this.player.y - this.door.y) < 12) {
      this.events.push({ type: "clear", level: this.level });
      this.mode = this.level >= 3 ? "done" : "banner";
      return;
    }
    if (this.scan() === "see") {
      this.mode = "spotted";
      this.caught += 1;
      this.events.push({ type: "spotted", x: this.player.x, y: this.player.y });
    }
  };

  return {
    HeistSim: HeistSim,
    TILE: TILE,
    COLS: COLS,
    ROWS: ROWS,
    SPEED: SPEED,
    PICKUP: PICKUP,
    beatPct: beatPct,
    LEVELS: LEVELS,
    center: center,
    cell: cell
  };
});
