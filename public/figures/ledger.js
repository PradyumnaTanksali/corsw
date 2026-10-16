(window.isoFigures ||= {})["ledger"] = function mount(root) {
const requestAnimationFrame = (f) => (root.isConnected ? window.requestAnimationFrame(f) : 0);
const AZIMUTH = 45;
const ELEVATION = 30;
const SHADES = 4;
const RADIANS = Math.PI / 180;
const UNIT = Math.sqrt(1.6);
function cameraOf({ scale, azimuth = AZIMUTH, elevation = ELEVATION }) {
    const a = azimuth * RADIANS;
    const e = elevation * RADIANS;
    return { sinA: Math.sin(a), cosA: Math.cos(a), sinE: Math.sin(e), cosE: Math.cos(e), k: scale * UNIT };
}
function iso([x, y, z], projection) {
    const { origin } = projection;
    const { sinA, cosA, sinE, cosE, k } = cameraOf(projection);
    return [origin[0] + (x * sinA - y * cosA) * k, origin[1] + ((x * cosA + y * sinA) * sinE - z * cosE) * k];
}
function towardViewer(projection) {
    const { sinA, cosA } = cameraOf(projection);
    return [cosA, sinA];
}
function depthOf([x, y, z], projection) {
    const { sinA, cosA, sinE, cosE } = cameraOf(projection);
    return (x * cosA + y * sinA) * cosE + z * sinE;
}
const tenth = (value) => {
    const text = (Math.round(value * 10) / 10).toFixed(1).replace(/\.0$/, "");
    return text === "-0" ? "0" : text;
};
function pathOf(points, closed = false) {
    if (!points.length)
        return "";
    return points.map(([x, y], at) => `${at ? "L" : "M"}${tenth(x)} ${tenth(y)}`).join("") + (closed ? "Z" : "");
}
const joinPaths = (paths) => paths.filter(Boolean).join("");
function roundedPlan({ x, y, w, d, r }, steps = 8) {
    const radius = Math.max(0, Math.min(r, w / 2, d / 2));
    const corners = [
        [x + w - radius, y + radius, -90],
        [x + w - radius, y + d - radius, 0],
        [x + radius, y + d - radius, 90],
        [x + radius, y + radius, 180],
    ];
    const out = [];
    for (const [cx, cy, start] of corners) {
        const count = radius > 0 ? steps : 0;
        for (let step = 0; step <= count; step++) {
            const angle = (start + (count ? (90 * step) / count : 45)) * RADIANS;
            out.push([cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)]);
        }
    }
    return out;
}
function signedArea(points) {
    let area = 0;
    for (let index = 0; index < points.length; index++) {
        const [ax, ay] = points[index];
        const [bx, by] = points[(index + 1) % points.length];
        area += ax * by - bx * ay;
    }
    return area / 2;
}
const oriented = (points) => (signedArea(points) < 0 ? [...points].reverse() : points);
function convexHull(points) {
    const sorted = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    if (sorted.length < 3)
        return sorted;
    const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lower = [];
    for (const point of sorted) {
        while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], point) <= 0)
            lower.pop();
        lower.push(point);
    }
    const upper = [];
    for (let index = sorted.length - 1; index >= 0; index--) {
        const point = sorted[index];
        while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], point) <= 0)
            upper.pop();
        upper.push(point);
    }
    return [...lower.slice(0, -1), ...upper.slice(0, -1)];
}
function runsOf(flags, want) {
    const count = flags.length;
    const runs = [];
    const start = flags.findIndex((flag, index) => flag !== flags[(index + count - 1) % count]);
    if (start < 0)
        return flags[0] === want ? [Array.from({ length: count + 1 }, (_, index) => index % count)] : [];
    let run = null;
    for (let step = 0; step < count; step++) {
        const index = (start + step) % count;
        if (flags[index] === want) {
            if (!run)
                run = [index];
            run.push((index + 1) % count);
        }
        else if (run) {
            runs.push(run);
            run = null;
        }
    }
    if (run)
        runs.push(run);
    return runs;
}
function extrude(ring, z, height, projection, options = {}) {
    const convex = options.convex ?? true;
    const count = ring.length;
    const counter = signedArea(ring) > 0;
    const [vx, vy] = towardViewer(projection);
    const { sinA, cosA } = cameraOf(projection);
    const normals = ring.map(([ax, ay], index) => {
        const [bx, by] = ring[(index + 1) % count];
        const dx = bx - ax;
        const dy = by - ay;
        const length = Math.hypot(dx, dy) || 1;
        return (counter ? [dy / length, -dx / length] : [-dy / length, dx / length]);
    });
    const facing = normals.map(([nx, ny]) => nx * vx + ny * vy > 1e-9);
    const top = ring.map(([x, y]) => iso([x, y, z + height], projection));
    const bottom = ring.map(([x, y]) => iso([x, y, z], projection));
    const outline = [];
    const crease = [];
    for (const run of runsOf(facing, false))
        outline.push(pathOf(run.map((index) => top[index])));
    for (const run of runsOf(facing, true)) {
        crease.push(pathOf(run.map((index) => top[index])));
        if (height > 0)
            outline.push(pathOf(run.map((index) => bottom[index])));
    }
    if (height > 0) {
        for (let index = 0; index < count; index++) {
            if (facing[(index + count - 1) % count] !== facing[index])
                outline.push(pathOf([top[index], bottom[index]]));
        }
    }
    let fill;
    if (convex) {
        fill = pathOf(convexHull([...top, ...bottom]), true);
    }
    else {
        const parts = [pathOf(oriented(top), true), pathOf(oriented(bottom), true)];
        for (let index = 0; index < count; index++) {
            if (!facing[index])
                continue;
            const next = (index + 1) % count;
            parts.push(pathOf(oriented([top[index], top[next], bottom[next], bottom[index]]), true));
        }
        fill = parts.join("");
    }
    const buckets = Array.from({ length: SHADES }, () => []);
    if (height > 0) {
        const [lx, ly] = [-sinA, cosA];
        for (let index = 0; index < count; index++) {
            if (!facing[index])
                continue;
            const [nx, ny] = normals[index];
            const lit = (nx * lx + ny * ly + 1) / 2;
            const shade = Math.min(SHADES - 1, Math.max(0, Math.floor(lit * SHADES)));
            const next = (index + 1) % count;
            buckets[shade].push(pathOf(oriented([top[index], top[next], bottom[next], bottom[index]]), true));
        }
    }
    let bevel;
    if (options.bevel && options.bevel > 0) {
        const by = options.bevel;
        const inset = ring.map(([x, y], index) => {
            const [ax, ay] = normals[(index + count - 1) % count];
            const [bx, by2] = normals[index];
            const mx = ax + bx;
            const my = ay + by2;
            const length = Math.hypot(mx, my) || 1;
            return [x - (mx / length) * by, y - (my / length) * by];
        });
        const insetTop = inset.map(([x, y]) => iso([x, y, z + height], projection));
        bevel = runsOf(facing, true)
            .map((run) => pathOf([top[run[0]], ...run.slice(1, -1).map((index) => insetTop[index]), top[run[run.length - 1]]]))
            .join("");
    }
    return {
        fill,
        outline: outline.join(""),
        crease: crease.join(""),
        top: pathOf(oriented(top), true),
        shades: buckets.map((paths) => paths.join("")),
        bevel,
    };
}
const ringOf = (plan, steps = 8) => roundedPlan(plan, steps);
function slabOf(plan, z, height, projection, steps = 8, bevel = 0) {
    return extrude(ringOf(plan, steps), z, height, projection, { convex: true, bevel });
}
function circleRing(cx, cy, radius, steps = 40) {
    return Array.from({ length: steps }, (_, step) => {
        const angle = (step / steps) * Math.PI * 2;
        return [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)];
    });
}
function cylinder(cx, cy, radius, z, height, projection, steps = 32, bevel = 0) {
    return extrude(circleRing(cx, cy, radius, steps), z, height, projection, { convex: true, bevel });
}
const insetPlan = ({ x, y, w, d, r }, by) => ({ x: x + by, y: y + by, w: w - by * 2, d: d - by * 2, r: Math.max(0, r - by) });
function onTop(points, z, projection, closed = false) {
    return pathOf(points.map(([x, y]) => iso([x, y, z], projection)), closed);
}
const planOutline = (plan, z, projection, steps = 8) => onTop(ringOf(plan, steps), z, projection, true);
const lineOnTop = (from, to, z, projection) => onTop([from, to], z, projection);
const segment = (from, to, projection) => pathOf([iso(from, projection), iso(to, projection)]);
const rise = (at, from, to, projection) => segment([at[0], at[1], from], [at[0], at[1], to], projection);
const ring = (cx, cy, radius, z, projection, steps = 40) => onTop(circleRing(cx, cy, radius, steps), z, projection, true);
const pointsAt = (points, projection) => points.map((point) => iso(point, projection));
function dotGrid(x, y, columns, rows, gap, z, projection) {
    const dots = [];
    for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++)
            dots.push(iso([x + column * gap, y + row * gap, z], projection));
    }
    return dots;
}
function corners({ x, y, w, d }, inset = 0) {
    return [
        [x + inset, y + inset],
        [x + w - inset, y + inset],
        [x + inset, y + d - inset],
        [x + w - inset, y + d - inset],
    ];
}
function boxCorners({ x, y, w, d }, z0, z1) {
    const out = [];
    for (const px of [x, x + w])
        for (const py of [y, y + d])
            for (const z of [z0, z1])
                out.push([px, py, z]);
    return out;
}
function knurl(cx, cy, radius, z0, z1, count, projection, inset = 0.4) {
    const [vx, vy] = towardViewer(projection);
    const lines = [];
    for (let index = 0; index < count; index++) {
        const angle = (index / count) * Math.PI * 2;
        const nx = Math.cos(angle);
        const ny = Math.sin(angle);
        if (nx * vx + ny * vy < 0.15)
            continue;
        lines.push(segment([cx + radius * nx, cy + radius * ny, z0 + inset], [cx + radius * nx, cy + radius * ny, z1 - inset], projection));
    }
    return lines.join("");
}
function sideArc(cx, cy, radius, z, projection, steps = 24) {
    const [vx, vy] = towardViewer(projection);
    const facing = Math.atan2(vy, vx);
    const points = [];
    for (let step = 0; step <= steps; step++) {
        const angle = facing - Math.PI / 2 + (step / steps) * Math.PI;
        points.push(iso([cx + radius * Math.cos(angle), cy + radius * Math.sin(angle), z], projection));
    }
    return pathOf(points);
}
function ringSeam(ring, z, projection) {
    const count = ring.length;
    const counter = signedArea(ring) > 0;
    const [vx, vy] = towardViewer(projection);
    const facing = ring.map(([ax, ay], index) => {
        const [bx, by] = ring[(index + 1) % count];
        const dx = bx - ax;
        const dy = by - ay;
        const [nx, ny] = counter ? [dy, -dx] : [-dy, dx];
        return nx * vx + ny * vy > 1e-9;
    });
    return runsOf(facing, true).map((run) => pathOf(run.map((index) => iso([ring[index][0], ring[index][1], z], projection)))).join("");
}
const sideSeam = (plan, z, projection, steps = 8) => ringSeam(ringOf(plan, steps), z, projection);
function sideRing(center, radius, axis, projection, steps = 20) {
    const [px, py, pz] = center;
    const points = [];
    for (let step = 0; step < steps; step++) {
        const angle = (step / steps) * Math.PI * 2;
        const u = radius * Math.cos(angle);
        const v = radius * Math.sin(angle);
        points.push(iso(axis === "x" ? [px, py + u, pz + v] : [px + u, py, pz + v], projection));
    }
    return pathOf(points, true);
}
function coil(from, to, center, radius, turns, axis, projection, perTurn = 16) {
    const count = Math.max(1, Math.round(turns * perTurn));
    const back = [];
    const front = [];
    let run = [];
    let near = null;
    for (let index = 0; index <= count; index++) {
        const share = index / count;
        const angle = share * turns * Math.PI * 2;
        const u = radius * Math.cos(angle);
        const v = radius * Math.sin(angle);
        const along = from + (to - from) * share;
        const point = axis === "x" ? [along, center[0] + u, center[1] + v] : [center[0] + u, along, center[1] + v];
        const normal = axis === "x" ? [0, Math.cos(angle), Math.sin(angle)] : [Math.cos(angle), 0, Math.sin(angle)];
        const facing = depthOf(normal, projection) > 0;
        const flat = iso(point, projection);
        if (near === null)
            near = facing;
        if (facing !== near) {
            run.push(flat);
            (near ? front : back).push(pathOf(run));
            run = [flat];
            near = facing;
            continue;
        }
        run.push(flat);
    }
    if (run.length > 1)
        (near ? front : back).push(pathOf(run));
    return { back: back.join(""), front: front.join("") };
}
function topTicks(from, to, step, every, edge, z, lengths, projection, axis = "x") {
    const minor = [];
    const major = [];
    const first = Math.ceil(from / step) * step;
    for (let at = first, index = Math.round(first / step); at <= to + 1e-9; at += step, index++) {
        const big = index % every === 0;
        const length = big ? lengths[1] : lengths[0];
        const a = axis === "x" ? [at, edge] : [edge, at];
        const b = axis === "x" ? [at, edge + length] : [edge + length, at];
        (big ? major : minor).push(lineOnTop(a, b, z, projection));
    }
    return { minor: minor.join(""), major: major.join("") };
}
function sideTicks(from, to, step, every, face, top, lengths, projection, axis = "x") {
    const minor = [];
    const major = [];
    const first = Math.ceil(from / step) * step;
    for (let at = first, index = Math.round(first / step); at <= to + 1e-9; at += step, index++) {
        const big = index % every === 0;
        const length = big ? lengths[1] : lengths[0];
        const a = axis === "x" ? [at, face, top] : [face, at, top];
        const b = axis === "x" ? [at, face, top - length] : [face, at, top - length];
        (big ? major : minor).push(segment(a, b, projection));
    }
    return { minor: minor.join(""), major: major.join("") };
}
function radialTicks(cx, cy, radius, count, every, z, lengths, projection, from = 0, span = Math.PI * 2) {
    const minor = [];
    const major = [];
    const closed = Math.abs(span - Math.PI * 2) < 1e-9;
    const steps = closed ? count : count + 1;
    for (let index = 0; index < steps; index++) {
        const angle = from + (index / count) * span;
        const big = index % every === 0;
        const inner = radius - (big ? lengths[1] : lengths[0]);
        const sx = Math.sin(angle);
        const sy = -Math.cos(angle);
        (big ? major : minor).push(lineOnTop([cx + sx * inner, cy + sy * inner], [cx + sx * radius, cy + sy * radius], z, projection));
    }
    return { minor: minor.join(""), major: major.join("") };
}
const haloOf = (plan, z, height, projection) => slabOf(plan, z, height, projection).fill;
function axisVector(projection, [dx, dy, dz]) {
    const origin = iso([0, 0, 0], projection);
    const moved = iso([dx, dy, dz], projection);
    return [moved[0] - origin[0], moved[1] - origin[1]];
}
const fine = (value) => Math.round(value * 100) / 100;
function translateAlong(projection, by) {
    const [x, y] = axisVector(projection, by);
    return `translate(${fine(x)} ${fine(y)})`;
}
const thousandth = (value) => Math.round(value * 1000) / 1000;
function axesAt(at, z, projection) {
    const origin = iso([at[0], at[1], z], projection);
    const along = (point) => {
        const [px, py] = iso(point, projection);
        return [px - origin[0], py - origin[1]];
    };
    return { origin, x: along([at[0] + 1, at[1], z]), y: along([at[0], at[1] + 1, z]), z: along([at[0], at[1], z + 1]) };
}
const matrixOf = (u, v, origin) => `matrix(${thousandth(u[0])} ${thousandth(u[1])} ${thousandth(v[0])} ${thousandth(v[1])} ${thousandth(origin[0])} ${thousandth(origin[1])})`;
function holdStill(element, [dx, dy]) {
    const text = dx || dy ? `translate(${-dx} ${-dy})` : "";
    element.querySelectorAll("[data-hold]").forEach((node) => (text ? node.setAttribute("transform", text) : node.removeAttribute("transform")));
}
function topMatrix(at, z, projection, along = "x") {
    const { origin, x, y } = axesAt(at, z, projection);
    return along === "x" ? matrixOf(x, y, origin) : matrixOf([-y[0], -y[1]], x, origin);
}
function sideMatrix(at, z, projection, face) {
    const { origin, x, y, z: up } = axesAt(at, z, projection);
    const down = [-up[0], -up[1]];
    return face === "left" ? matrixOf(x, down, origin) : matrixOf([-y[0], -y[1]], down, origin);
}
function screenRise(height, projection) {
    const { cosE, k } = cameraOf(projection);
    return height * cosE * k;
}
function fitProjection(points, width, height, { pad = 24, headroom = 0, azimuth = AZIMUTH, elevation = ELEVATION } = {}) {
    const unit = { origin: [0, 0], scale: 1, azimuth, elevation };
    const flat = points.map((point) => iso(point, unit));
    const xs = flat.map(([x]) => x);
    const ys = flat.map(([, y]) => y);
    const left = Math.min(...xs);
    const right = Math.max(...xs);
    const up = Math.min(...ys);
    const down = Math.max(...ys);
    const scale = Math.min((width - pad * 2) / (right - left), (height - pad * 2 - headroom) / (down - up));
    return {
        origin: [width / 2 - ((left + right) / 2) * scale, headroom + (height - headroom) / 2 - ((up + down) / 2) * scale],
        scale,
        azimuth,
        elevation,
    };
}
const escape = (text) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const attrs = (pairs) => Object.entries(pairs)
    .filter(([, value]) => value !== undefined && value !== false)
    .map(([key, value]) => ` ${key}="${escape(String(value))}"`)
    .join("");
function solidSvg(paths, { tone = "hi", crease = "faint", halo = false, lit = false, flat = false, className, inner = "" } = {}) {
    const parts = [];
    if (halo)
        parts.push(`<path class="iso-halo" d="${paths.fill}"/>`);
    parts.push(`<path class="iso-fill" d="${paths.fill}"/>`);
    if (!flat) {
        paths.shades.forEach((d, shade) => {
            if (d)
                parts.push(`<path class="iso-shade" data-shade="${shade}" d="${d}"/>`);
        });
        parts.push(`<path class="iso-top" d="${paths.top}"/>`);
    }
    if (crease !== "none" && paths.crease)
        parts.push(`<path class="iso-line iso-crease" data-tone="${crease}" d="${paths.crease}"/>`);
    if (crease !== "none" && paths.bevel)
        parts.push(`<path class="iso-line iso-bevel" data-tone="${crease}" d="${paths.bevel}"/>`);
    if (inner)
        parts.push(inner);
    parts.push(`<path class="iso-line iso-edge" data-tone="${tone}" d="${paths.outline}"/>`);
    return `<g${attrs({ class: className ? `iso-solid ${className}` : "iso-solid", "data-lit": lit ? "" : undefined, "data-seamless": paths.seamless ? "" : undefined })}>${parts.join("")}</g>`;
}
function lineSvg(d, { tone = "lo", dotted = false, dashed = false, flow = false, className, free } = {}) {
    if (!d)
        return "";
    return `<path${attrs({
        class: className ? `iso-line ${className}` : "iso-line",
        "data-tone": tone,
        "data-free": free === true ? "" : free || undefined,
        "data-dotted": dotted ? "" : undefined,
        "data-dashed": dashed ? "" : undefined,
        "data-flow": flow ? "" : undefined,
        d,
    })}/>`;
}
function dotsSvg(points, { size = 0.5, tone = "mid", pulse = false } = {}) {
    const dots = points
        .map(([x, y, alpha], index) => `<circle cx="${tenth(x)}" cy="${tenth(y)}" r="${size}"${alpha !== undefined && alpha < 1 ? ` fill-opacity="${Math.max(0, alpha).toFixed(2)}"` : ""}${pulse ? ` data-pulse="" style="--pulse-at:${(index * 137) % 1600}ms"` : ""}/>`)
        .join("");
    return `<g class="iso-dots" data-tone="${tone}">${dots}</g>`;
}
function fadedSvg(list, style = {}) {
    const groups = new Map();
    for (const entry of list) {
        const [d, alpha] = Array.isArray(entry) ? entry : [entry.d, entry.alpha];
        if (!d || !(alpha > 0.02))
            continue;
        const level = Math.min(1, Math.round(alpha * 20) / 20);
        groups.set(level, (groups.get(level) ?? "") + d);
    }
    return [...groups].map(([alpha, d]) => (alpha >= 1 ? lineSvg(d, style) : `<g opacity="${alpha.toFixed(2)}">${lineSvg(d, style)}</g>`)).join("");
}
function fadeLineSvg(points, { fade = [0, 0], tone = "lo", className, stops = 6 } = {}) {
    if (points.length < 2)
        return "";
    const ease = (t) => t * t * (3 - 2 * t);
    const hashOf = (text) => {
        let hash = 2166136261;
        for (let index = 0; index < text.length; index++)
            hash = Math.imul(hash ^ text.charCodeAt(index), 16777619);
        return (hash >>> 0).toString(36);
    };
    const lengths = [0];
    for (let index = 1; index < points.length; index++)
        lengths.push(lengths[index - 1] + Math.hypot(points[index][0] - points[index - 1][0], points[index][1] - points[index - 1][1]));
    const at = (length) => {
        let index = 1;
        while (index < points.length - 1 && lengths[index] < length)
            index++;
        const span = lengths[index] - lengths[index - 1] || 1;
        const t = Math.max(0, Math.min(1, (length - lengths[index - 1]) / span));
        return [points[index - 1][0] + (points[index][0] - points[index - 1][0]) * t, points[index - 1][1] + (points[index][1] - points[index - 1][1]) * t];
    };
    const pieceOf = (from, to) => [at(from), ...points.filter((_, index) => lengths[index] > from + 1e-6 && lengths[index] < to - 1e-6), at(to)];
    const total = lengths[lengths.length - 1];
    if (total < 1e-6)
        return "";
    let [start, end] = Array.isArray(fade) ? fade : [fade, fade];
    if (start + end > total) {
        const share = total / (start + end);
        start *= share;
        end *= share;
    }
    const paint = `var(--anatomy-${tone})`;
    const ramp = (piece, rising) => {
        const d = pathOf(piece);
        const [x1, y1] = piece[0];
        const [x2, y2] = piece[piece.length - 1];
        const id = `iso-fade-${hashOf(`${d}|${tone}|${rising}`)}`;
        const marks = Array.from({ length: stops + 1 }, (_, index) => {
            const t = index / stops;
            const alpha = ease(rising ? t : 1 - t);
            return `<stop offset="${t.toFixed(3)}" stop-opacity="${alpha.toFixed(3)}" style="stop-color:${paint}"/>`;
        }).join("");
        const gradient = `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${tenth(x1)}" y1="${tenth(y1)}" x2="${tenth(x2)}" y2="${tenth(y2)}">${marks}</linearGradient>`;
        return `<defs>${gradient}</defs><path${attrs({ class: className ? `iso-line ${className}` : "iso-line", "data-tone": tone, "data-free": rising ? "start" : "end", d, style: `stroke:url(#${id})` })}/>`;
    };
    const parts = [];
    if (start > 0.05)
        parts.push(ramp(pieceOf(0, start), true));
    if (total - end - start > 0.05)
        parts.push(lineSvg(pathOf(pieceOf(start, total - end)), { tone, className }));
    if (end > 0.05)
        parts.push(ramp(pieceOf(total - end, total), false));
    return `<g class="iso-fade">${parts.join("")}</g>`;
}
function wireSvg(from, to, { via = [], tone = "lo", dotted = false, dashed = false, flow = false, ends = "both", size = 1.2 } = {}) {
    const d = pathOf([from, ...via, to]);
    const end = ([x, y]) => `<circle class="iso-wire-end" cx="${tenth(x)}" cy="${tenth(y)}" r="${size}"/>`;
    return `<g class="iso-wire" data-tone="${tone}">${lineSvg(d, { tone, dotted, dashed, flow })}${ends === "both" || ends === "from" ? end(from) : ""}${ends === "both" || ends === "to" ? end(to) : ""}</g>`;
}
function faceTextSvg(transform, text, { size = 3, tone = "mid", anchor = "start" } = {}) {
    return `<text class="iso-face-text" data-tone="${tone}" transform="${transform}" font-size="${size}" text-anchor="${anchor}">${escape(text)}</text>`;
}
function groupSvg(children, extra = {}) {
    return `<g${attrs(extra)}>${Array.isArray(children) ? children.join("") : children}</g>`;
}
function figureSvg({ width, height, label, body, standalone = false, className }) {
    const style = standalone ? `<style>${ISO_CSS}</style>` : "";
    return `<svg${attrs({
        xmlns: "http://www.w3.org/2000/svg",
        class: `iso-svg${standalone ? " iso" : ""}${className ? ` ${className}` : ""}`,
        "data-theme": standalone || undefined,
        viewBox: `0 0 ${width} ${height}`,
        role: "img",
        "aria-label": label,
    })}>${style}${Array.isArray(body) ? body.join("") : body}</svg>`;
}
function swatchSvg(mark) {
    if (mark === "raised" || mark === "flat" || mark === "lit") {
        const body = mark === "flat" ? "M2 6.5 8 3.5 14 6.5 8 9.5Z" : "M2 4.5 8 1.5 14 4.5 14 6 8 9 2 6Z";
        const crease = mark === "flat" ? "" : `<path class="iso-swatch-crease" d="M2 4.5 8 7.5 14 4.5"/>`;
        return `<svg class="iso-swatch" data-mark="${mark}" viewBox="0 0 16 10" aria-hidden="true"><path d="${body}"/>${crease}</svg>`;
    }
    return `<svg class="iso-swatch" data-mark="${mark}" viewBox="0 0 16 10" aria-hidden="true"><path d="M1.5 5h13"/></svg>`;
}
function plateHtml({ fig, title, hint, readout = "", keys = [], caption, body }) {
    const corner = (name, text, extra = "") => `<span class="iso-plate-corner" data-corner="${name}"${extra}>${escape(text)}</span>`;
    const legend = keys.length || caption
        ? `<figcaption class="iso-legend">${keys.length ? `<span class="iso-keys">${keys.map((key) => `<span class="iso-key">${swatchSvg(key.mark)}${escape(key.label)}</span>`).join("")}</span>` : ""}${caption ? `<span class="iso-caption">${escape(caption)}</span>` : ""}</figcaption>`
        : "";
    return `<figure class="iso-figure"><div class="iso-plate"><div class="iso-plate-corners" aria-hidden="true">${corner("fig", fig)}${title ? corner("title", title) : ""}${hint ? corner("hint", hint) : ""}${corner("readout", readout, " data-readout")}</div>${body}</div>${legend}</figure>`;
}
function pageHtml({ title, theme = "dark", body, script = "", width = 650 }) {
    return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escape(title)}</title><style>${ISO_CSS}${PAGE_CSS.replace("__WIDTH__", String(width))}</style></head><body class="iso" data-theme="${theme}"><main class="iso-page">${body}</main>${script ? `<script type="module">${script.replace(/<\/(script)/gi, "<\\/$1")}</script>` : ""}</body></html>`;
}
const PAGE_CSS = `
*{box-sizing:border-box}
html{color-scheme:dark}
body[data-theme="light"]{color-scheme:light}
body{margin:0;background:var(--anatomy-page);color:var(--anatomy-text);font:14px/1.6 ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;-webkit-font-smoothing:antialiased}
.iso-page{width:min(__WIDTH__px,100% - 32px);margin:64px auto 96px}
`;
const ISO_CSS = `
.iso{
  --anatomy-page:#0b0b0b;--anatomy-card:#131313;--anatomy-text:#a3a3a3;--anatomy-strong:#e6e6e6;--anatomy-muted:#6e6e6e;
  --anatomy-paper:#131313;--anatomy-face:#1b1b1b;--anatomy-top:#1c1c1c;
  --anatomy-shade-0:#0f0f0f;--anatomy-shade-1:#121212;--anatomy-shade-2:#151515;--anatomy-shade-3:#181818;
  --anatomy-lit-top:#262626;--anatomy-lit-shade:#1d1d1d;
  --anatomy-hi:#d4d4d4;--anatomy-mid:#6a6a6a;--anatomy-lo:#3e3e3e;--anatomy-faint:#2a2a2a;--anatomy-lit:#ffffff;
  --anatomy-halo:#050505;--anatomy-halo-opacity:.9;--anatomy-dot:#e6e6e6;
  --anatomy-red:#ff6b6b;--anatomy-green:#6be0a0;--anatomy-blue:#6b9bff;
  --anatomy-weight:.6px;--anatomy-ease:cubic-bezier(.32,.72,0,1);
  --anatomy-mono:ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  --anatomy-lift:inset 0 1px 0 0 #ffffff0a,inset 0 0 0 1px #ffffff06,0 0 0 1px #00000026,0 1px 1px -.5px #00000014,0 3px 3px -1.5px #00000014,0 6px 6px -3px #00000014,0 12px 12px -6px #00000014;
}
.iso[data-theme="light"]{
  --anatomy-page:#f2f2ef;--anatomy-card:#fbfbfa;--anatomy-text:#57575a;--anatomy-strong:#18181a;--anatomy-muted:#8c8c90;
  --anatomy-paper:#fbfbfa;--anatomy-face:#ffffff;--anatomy-top:#ffffff;
  --anatomy-shade-0:#dcdcd9;--anatomy-shade-1:#e5e5e2;--anatomy-shade-2:#ededea;--anatomy-shade-3:#f4f4f1;
  --anatomy-lit-top:#ffffff;--anatomy-lit-shade:#eeeeeb;
  --anatomy-hi:#26262a;--anatomy-mid:#8a8a8f;--anatomy-lo:#b4b4b8;--anatomy-faint:#d4d4d6;--anatomy-lit:#000000;
  --anatomy-halo:#8a8a80;--anatomy-halo-opacity:.32;--anatomy-dot:#3a3a3e;
  --anatomy-red:#e5484d;--anatomy-green:#30a46c;--anatomy-blue:#3e63dd;
  --anatomy-lift:inset 0 1px 0 0 #ffffff,0 0 0 1px #0000000f,0 1px 1px -.5px #0000000a,0 3px 3px -1.5px #0000000a,0 6px 6px -3px #0000000a,0 12px 12px -6px #0000000a;
}
.iso-svg{display:block;width:100%;height:auto;overflow:visible}
.iso-svg path,.iso-svg circle{vector-effect:non-scaling-stroke}
.iso-fill{fill:var(--anatomy-paper);stroke:none}
.iso-solid[data-lit]>.iso-fill{fill:var(--anatomy-face)}
.iso-shade,.iso-top{stroke:none}
.iso-shade[data-shade="0"]{fill:var(--anatomy-shade-0)}
.iso-shade[data-shade="1"]{fill:var(--anatomy-shade-1)}
.iso-shade[data-shade="2"]{fill:var(--anatomy-shade-2)}
.iso-shade[data-shade="3"]{fill:var(--anatomy-shade-3)}
.iso-top{fill:var(--anatomy-top)}
.iso-solid[data-lit]>.iso-top{fill:var(--anatomy-lit-top)}
.iso-solid[data-lit]>.iso-shade{fill:var(--anatomy-lit-shade)}
.iso-solid[data-seamless]>.iso-shade,.iso-solid[data-seamless]>.iso-top{stroke-width:.4;stroke-linejoin:round}
.iso-solid[data-seamless]>.iso-shade[data-shade="0"]{stroke:var(--anatomy-shade-0)}
.iso-solid[data-seamless]>.iso-shade[data-shade="1"]{stroke:var(--anatomy-shade-1)}
.iso-solid[data-seamless]>.iso-shade[data-shade="2"]{stroke:var(--anatomy-shade-2)}
.iso-solid[data-seamless]>.iso-shade[data-shade="3"]{stroke:var(--anatomy-shade-3)}
.iso-solid[data-seamless]>.iso-top{stroke:var(--anatomy-top)}
.iso-solid[data-seamless][data-lit]>.iso-top{stroke:var(--anatomy-lit-top)}
.iso-solid[data-seamless][data-lit]>.iso-shade{stroke:var(--anatomy-lit-shade)}
.iso-solid[data-lit]>.iso-edge{stroke:var(--anatomy-lit)}
.iso-halo{fill:var(--anatomy-halo);stroke:none;filter:blur(9px);opacity:var(--anatomy-halo-opacity);transform:translateY(3px)}
.iso-line{fill:none;stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight);stroke-linecap:round;stroke-linejoin:round}
.iso-line[data-tone="hi"]{stroke:var(--anatomy-hi)}
.iso-line[data-tone="mid"]{stroke:var(--anatomy-mid)}
.iso-line[data-tone="lo"]{stroke:var(--anatomy-lo)}
.iso-line[data-tone="faint"]{stroke:var(--anatomy-faint)}
.iso-line[data-tone="lit"]{stroke:var(--anatomy-lit)}
.iso-line[data-tone="red"]{stroke:var(--anatomy-red)}
.iso-line[data-tone="green"]{stroke:var(--anatomy-green)}
.iso-line[data-tone="blue"]{stroke:var(--anatomy-blue)}
.iso-line[data-dotted]{stroke-dasharray:.01 3.5;stroke-width:1}
.iso-line[data-dashed]{stroke-dasharray:3 3}
.iso-line[data-flow]{stroke-dasharray:2 6}
.iso-wire-end{fill:var(--anatomy-paper);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight)}
.iso-wire[data-tone="hi"] .iso-wire-end{stroke:var(--anatomy-hi)}
.iso-wire[data-tone="mid"] .iso-wire-end{stroke:var(--anatomy-mid)}
.iso-wire[data-tone="faint"] .iso-wire-end{stroke:var(--anatomy-faint)}
.iso-wire[data-tone="lit"] .iso-wire-end{stroke:var(--anatomy-lit)}
.iso-dots circle{fill:var(--anatomy-dot);stroke:none;opacity:.32}
.iso-dots[data-tone="hi"] circle{opacity:.85}
.iso-dots[data-tone="mid"] circle{opacity:.45}
.iso-dots[data-tone="lo"] circle{opacity:.22}
.iso-dots[data-tone="faint"] circle{opacity:.12}
.iso-face-text{fill:var(--anatomy-mid);font-family:var(--anatomy-mono);letter-spacing:.04em}
.iso-face-text[data-tone="hi"]{fill:var(--anatomy-hi)}
.iso-face-text[data-tone="lo"]{fill:var(--anatomy-lo)}
.iso-face-text[data-tone="faint"]{fill:var(--anatomy-faint)}
.tb-body{fill:var(--anatomy-shade-2);stroke:none}
.tb-shine{fill:var(--anatomy-top);stroke:none}
.tb-shade{fill:var(--anatomy-shade-0);stroke:none}
.tb-ring{fill:none;stroke:var(--anatomy-lo);stroke-width:.45;stroke-linecap:butt;stroke-linejoin:round}
.tb-ring[data-tone="mid"]{stroke:var(--anatomy-mid)}
.tb-ring[data-tone="faint"]{stroke:var(--anatomy-faint)}
.tb-ring[data-tone="hi"]{stroke:var(--anatomy-hi)}
@keyframes iso-flow{to{stroke-dashoffset:-32}}
@keyframes iso-pulse{0%,100%{opacity:.18}12%{opacity:1}40%{opacity:.18}}
.iso-line[data-flow]{animation:iso-flow 1600ms linear infinite}
.iso-dots circle[data-pulse]{animation:iso-pulse 1600ms steps(1,end) infinite;animation-delay:var(--pulse-at,0ms)}
.iso-figure{margin:32px 0 36px}
.iso-plate{position:relative;padding:52px 24px;border-radius:0;background:var(--anatomy-card);box-shadow:0 0 0 1px var(--anatomy-mid);--anatomy-paper:var(--anatomy-card)}
.iso-plate-corners{position:absolute;inset:18px 20px;pointer-events:none}
.iso-plate-corner{position:absolute;color:var(--anatomy-muted);font-family:var(--anatomy-mono);font-size:10.5px;line-height:1;letter-spacing:.04em;white-space:nowrap}
.iso-plate-corner[data-corner="fig"]{top:0;left:0;color:var(--anatomy-text)}
.iso-plate-corner[data-corner="title"]{top:0;right:0;text-transform:uppercase;letter-spacing:.1em}
.iso-plate-corner[data-corner="hint"]{bottom:0;left:0;text-transform:uppercase;letter-spacing:.1em}
.iso-plate-corner[data-corner="readout"]{right:0;bottom:0;color:var(--anatomy-text);font-variant-numeric:tabular-nums}
.iso-plate .iso-svg{margin:0 auto}
.iso-legend{display:grid;gap:8px;margin-top:12px;color:var(--anatomy-muted);font-size:13px;line-height:1.55}
.iso-keys{display:flex;flex-wrap:wrap;gap:6px 18px}
.iso-key{display:inline-flex;align-items:center;gap:7px}
.iso-swatch{width:16px;height:10px;flex:none;overflow:visible}
.iso-swatch path{fill:none;stroke:var(--anatomy-hi);stroke-width:1;vector-effect:non-scaling-stroke;stroke-linejoin:round;stroke-linecap:round}
.iso-swatch[data-mark="raised"] path,.iso-swatch[data-mark="flat"] path{stroke:var(--anatomy-mid)}
.iso-swatch[data-mark="lit"] path{stroke:var(--anatomy-lit)}
.iso-swatch[data-mark="dim"] path{stroke:var(--anatomy-lo)}
.iso-swatch[data-mark="dotted"] path{stroke-dasharray:.01 3;stroke-width:1.4}
.iso-swatch[data-mark="dashed"] path{stroke-dasharray:3 2.5}
.iso-swatch[data-mark="red"] path{stroke:var(--anatomy-red)}
.iso-swatch[data-mark="green"] path{stroke:var(--anatomy-green)}
.iso-swatch[data-mark="blue"] path{stroke:var(--anatomy-blue)}
.iso-swatch-crease{stroke:var(--anatomy-lo)!important}
@media (max-width:560px){.iso-plate{padding:48px 12px 70px}.iso-plate-corner[data-corner="hint"]{bottom:18px}}
@media (prefers-reduced-motion:reduce){.iso-line[data-flow],.iso-dots circle[data-pulse]{animation:none}}
`;

// Shapes that turn, built the same way at build time and every frame in the page (the page inlines this
// file next to the kit, whose `iso` and `pathOf` it passes in). Same shading rule as lathe.mjs (toneOf).

function viewLight(P) {
  const a = ((P.azimuth ?? 45) * Math.PI) / 180;
  const e = ((P.elevation ?? 30) * Math.PI) / 180;
  const l = [-Math.sin(a), Math.cos(a), 1.2];
  const n = Math.hypot(...l);
  return { V: [Math.cos(a) * Math.cos(e), Math.sin(a) * Math.cos(e), Math.sin(e)], L: l.map((x) => x / n) };
}

const lgDot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const lgArea = (poly) => poly.reduce((s, [x, y], i) => { const [x2, y2] = poly[(i + 1) % poly.length]; return s + x * y2 - x2 * y; }, 0);
const lgOriented = (pts) => (lgArea(pts) < 0 ? [...pts].reverse() : pts);
function lgRuns(flags, want) {
  const n = flags.length;
  const start = flags.findIndex((f, i) => f !== flags[(i + n - 1) % n]);
  if (start < 0) return flags[0] === want ? [Array.from({ length: n + 1 }, (_, i) => i % n)] : [];
  const out = [];
  let run = null;
  for (let step = 0; step < n; step++) {
    const i = (start + step) % n;
    if (flags[i] === want) { if (!run) run = [i]; run.push((i + 1) % n); }
    else if (run) { out.push(run); run = null; }
  }
  if (run) out.push(run);
  return out;
}

/** A prism of any polygon (concave too) in the frame's u, v plane, extruded along F.a from s0 to s1. */
function prismPaths(F, poly, s0, s1, P, iso, pathOf) {
  const { V, L } = viewLight(P);
  const ring = lgArea(poly) > 0 ? poly : [...poly].reverse();
  const n = ring.length;
  const W = (s, [x, y]) => [0, 1, 2].map((i) => F.o[i] + F.a[i] * s + F.u[i] * x + F.v[i] * y);
  const capNear = lgDot(F.a, V) > 0;
  const [nearS, farS] = capNear ? [s1, s0] : [s0, s1];
  const near = ring.map((p) => iso(W(nearS, p), P));
  const far = ring.map((p) => iso(W(farS, p), P));
  const normals = ring.map(([x0, y0], i) => {
    const [x1, y1] = ring[(i + 1) % n];
    const m = [0, 1, 2].map((k) => F.u[k] * (y1 - y0) - F.v[k] * (x1 - x0));
    const len = Math.hypot(...m) || 1;
    return m.map((v) => v / len);
  });
  const tone = (m) => { const s = lgDot(m, L); return s >= 0.62 ? 4 : s >= 0.42 ? 3 : s >= 0.2 ? 2 : s >= 0 ? 1 : 0; };
  const facing = normals.map((m) => lgDot(m, V) > 1e-9);
  const outline = [];
  const crease = [];
  for (const run of lgRuns(facing, false)) outline.push(pathOf(run.map((i) => near[i])));
  for (const run of lgRuns(facing, true)) { crease.push(pathOf(run.map((i) => near[i]))); outline.push(pathOf(run.map((i) => far[i]))); }
  for (let i = 0; i < n; i++) if (facing[(i + n - 1) % n] !== facing[i]) outline.push(pathOf([near[i], far[i]]));
  const parts = [pathOf(lgOriented(near), true), pathOf(lgOriented(far), true)];
  const buckets = [[], [], [], [], []];
  for (let i = 0; i < n; i++) {
    if (!facing[i]) continue;
    const quad = pathOf(lgOriented([near[i], near[(i + 1) % n], far[(i + 1) % n], far[i]]), true);
    parts.push(quad);
    buckets[tone(normals[i])].push(quad);
  }
  buckets[tone(capNear ? F.a : F.a.map((v) => -v))].push(pathOf(lgOriented(near), true));
  return { fill: parts.join(""), outline: outline.join(""), crease: crease.join(""), top: buckets[4].join(""), shades: buckets.slice(0, 4).map((b) => b.join("")) };
}

/** A coil spring between two world points: back and front halves, for back, rod, front painting. */
function helixPaths(a, b, r, turns, P, iso, pathOf) {
  const { V } = viewLight(P);
  const d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
  const len = Math.hypot(...d) || 1;
  const t = d.map((v) => v / len);
  const helper = Math.abs(t[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1];
  const cross = (p, q) => [p[1] * q[2] - p[2] * q[1], p[2] * q[0] - p[0] * q[2], p[0] * q[1] - p[1] * q[0]];
  let u = cross(helper, t);
  const ul = Math.hypot(...u);
  u = u.map((v) => v / ul);
  const v = cross(t, u);
  const count = Math.max(24, Math.round(turns * 28));
  const back = [];
  const front = [];
  let run = null;
  let side = null;
  for (let i = 0; i <= count; i++) {
    const s = i / count;
    const w = s * turns * Math.PI * 2;
    const radial = [0, 1, 2].map((k) => u[k] * Math.cos(w) + v[k] * Math.sin(w));
    const p = iso([0, 1, 2].map((k) => a[k] + d[k] * s + radial[k] * r), P);
    const here = lgDot(radial, V) >= 0;
    if (here !== side) {
      if (run) { run.push(p); (side ? front : back).push(pathOf(run)); }
      run = [p];
      side = here;
    } else run.push(p);
  }
  if (run && run.length > 1) (side ? front : back).push(pathOf(run));
  return { back: back.join(""), front: front.join("") };
}

const rotateXZ = (points, [cx, cz], angle) => {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return points.map(([x, z]) => [cx + (x - cx) * c - (z - cz) * s, cz + (x - cx) * s + (z - cz) * c]);
};

// StreamLine stock ledger, as the product implements it (read from streamline main):
//   src/db/schema/products.ts:15-20  stock_reason enum: purchase_receipt, dispatch, adjustment, initial
//   src/db/schema/products.ts:61     qty is signed: + in, - out
//   src/db/schema/products.ts:74-84  view product_stock: on_hand = coalesce(sum(qty), 0). Never stored.
//   src/modules/products/queries.ts:10  low = threshold > 0 and on_hand <= threshold
// Pure: no DOM. The page inlines this file, so the figure and its readout share one ledger.

const REASONS = {
  initial: { code: "INI", word: "initial", sign: 1 }, // products/core.ts:40-48, opening qty > 0
  purchase_receipt: { code: "REC", word: "receipt", sign: 1 }, // purchase-orders/core.ts:223-227
  dispatch: { code: "DSP", word: "dispatch", sign: -1 }, // work-orders/core.ts:150-154, qty `-${qty}`
  adjustment: { code: "ADJ", word: "adjustment", sign: 0 }, // products/core.ts:159-166, qty != 0, note required
};

// Illustrative movements for one item, built from the real reasons. Threshold is the item's own setting.
const THRESHOLD = 10;
const SEQUENCE = [
  { reason: "initial", qty: 40 },
  { reason: "dispatch", qty: -12 },
  { reason: "dispatch", qty: -8 },
  { reason: "purchase_receipt", qty: 20 },
  { reason: "dispatch", qty: -30 },
  { reason: "adjustment", qty: -2, note: "count correction" },
  { reason: "purchase_receipt", qty: 30 },
];

function createLedger(threshold = THRESHOLD) {
  const lines = []; // append-only: there is no update or delete
  const post = (movement) => {
    const rule = REASONS[movement.reason];
    if (!rule) throw new Error(`unknown reason ${movement.reason}`);
    const qty = Number(movement.qty);
    if (!Number.isFinite(qty) || qty === 0) throw new Error("quantity cannot be zero");
    if (rule.sign && Math.sign(qty) !== rule.sign) throw new Error(`${movement.reason} must be ${rule.sign > 0 ? "+" : "-"}`);
    if (movement.reason === "adjustment" && !(movement.note && movement.note.trim().length >= 3)) throw new Error("a note is required for adjustments");
    lines.push(Object.freeze({ ...movement, qty, line: lines.length + 1 }));
    return lines[lines.length - 1];
  };
  const onHand = () => lines.reduce((sum, movement) => sum + movement.qty, 0);
  const isLow = () => threshold > 0 && onHand() <= threshold;
  return { post, onHand, isLow, threshold, get count() { return lines.length; }, lines: () => lines.slice() };
}

const lgSigned = (qty) => `${qty > 0 ? "+" : "−"}${Math.abs(qty)}`;
const tapeText = (movement) => `${String(movement.line).padStart(2, "0")}  ${lgSigned(movement.qty).padStart(4, " ")}  ${REASONS[movement.reason].code}`;
const readoutOf = (ledger, movement) =>
  `line ${movement.line} · ${REASONS[movement.reason].word} ${lgSigned(movement.qty)} · on hand ${ledger.onHand()}${ledger.isLow() ? " · low" : ""}`;

// node model.mjs: the one check. Fails if the ledger stops deriving on-hand or the boundary moves.
if (typeof process !== "undefined" && process.argv[1] && import.meta.url.endsWith(process.argv[1].split("/").pop())) {
  const assert = (ok, text) => { if (!ok) throw new Error(text); };
  const book = createLedger();
  const seen = SEQUENCE.map((movement) => { const m = book.post(movement); return [m.line, book.onHand(), book.isLow()]; });
  assert(JSON.stringify(seen) === JSON.stringify([[1, 40, false], [2, 28, false], [3, 20, false], [4, 40, false], [5, 10, true], [6, 8, true], [7, 38, false]]), `sequence ${JSON.stringify(seen)}`);
  assert(book.onHand() === book.lines().reduce((s, m) => s + m.qty, 0), "on hand is the sum");
  assert(createLedger(0).isLow() === false, "threshold 0 is never low");
  let threw = 0;
  for (const bad of [{ reason: "dispatch", qty: 5 }, { reason: "purchase_receipt", qty: -5 }, { reason: "adjustment", qty: 0, note: "x x" }, { reason: "adjustment", qty: 2 }]) try { book.post(bad); } catch { threw++; }
  assert(threw === 4 && book.count === 7, "invalid movements rejected, nothing appended");
  console.log(seen.map(([l, h, low]) => `${l}:${h}${low ? " low" : ""}`).join("  "), "· model ok");
}

const D = {"P":{"origin":[304.851132739765,265.73625051337643],"scale":1.6311897744157877,"azimuth":36,"elevation":30},"TEETH":10,"PITCH":4.39822971502571,"THETA0":1.9896753472735358,"PAWL_PHI":1.9547687622336491,"PAWL_GAP":0.03490658503988659,"ratchetPoly":[[6.4,0],[8.999122716083738,0.12565962305230743],[7.955600485968286,1.6910150853177757],[6.638430325536234,2.955619606350815],[5.177708763999664,3.761825614671828],[7.206582338538602,5.391212386640273],[5.4422622650520465,6.0442445805494724],[3.6333333333333346,6.293117934166921],[1.9777087639996638,6.086761704288983],[2.6613724503964202,8.597505259101093],[0.8501648345769147,8.088778082328622],[-0.7595734997449476,7.226859106342787],[-1.977708763999663,6.086761704288984],[-2.9003912570745993,8.519843341041268],[-4.066666666666665,7.043673284113434],[-4.862349072874371,5.400185731802399],[-5.1777087639996635,3.761825614671829],[-7.354304085016157,5.187890845528139],[-7.430169722159819,3.30812469701651],[-7.107872565332322,1.5108249532757179],[-6.4,7.837739514543061e-16],[-8.999122716083738,-0.12565962305230652],[-7.955600485968286,-1.6910150853177737],[-6.638430325536234,-2.9556196063508153],[-5.177708763999664,-3.7618256146718276],[-7.2065823385386025,-5.391212386640271],[-5.442262265052048,-6.044244580549471],[-3.633333333333337,-6.29311793416692],[-1.9777087639996644,-6.086761704288983],[-2.6613724503964216,-8.597505259101093],[-0.8501648345769139,-8.088778082328623],[0.7595734997449451,-7.226859106342787],[1.9777087639996624,-6.086761704288984],[2.900391257074598,-8.519843341041268],[4.066666666666667,-7.043673284113433],[4.862349072874367,-5.400185731802401],[5.1777087639996635,-3.76182561467183],[7.354304085016155,-5.18789084552814],[7.430169722159821,-3.308124697016508],[7.107872565332321,-1.5108249532757219]],"PLATEN":{"x":-38,"z":68,"r":7},"RATCHET":{"y0":41.4,"y1":43.8,"root":6.4,"tip":9},"TIP":[-40.45367318687423,74.07305424741246],"PAWL_DIR":[0.309,0.951],"PAWL_PIVOT":[-37.67267318687423,82.63205424741246],"PAWL_ARM":[-37.37267318687423,78.43205424741245],"PAWL_PIN":[-31.6,78.43205424741245],"PAWL_Y":[41.6,43.4],"PIVOT":[-6,28],"LEVER_Y":[55.6,58],"REST":1.117010721276371,"PULL":0.8726646259971648,"LEVER_LEN":44,"STUD":[6,13],"FLAG":{"x0":55.4,"x1":56.2,"y0":-47,"y1":-39,"z0":20.6,"z1":28.6,"lift":9.4},"WIN":{"y0":-36,"y1":-14,"z0":13.4,"z1":22.4,"depth":1.6},"PRINT_Z":65.4,"TAPE_Y":23,"tapeM":"matrix(1.669 -0.606 0 1.787 229.468 137.365)"};
// Live code for the ledger figure. Inlined after the kit, prism.mjs, model.mjs and `const D`.
const YF = { o: [0, 0, 0], a: [0, 1, 0], u: [1, 0, 0], v: [0, 0, 1] };
const STEP = (2 * Math.PI) / D.TEETH;
const STEEP = (0.8 * Math.PI) / 180;
const P = D.P;
const lgStage = root.querySelector(".iso-stage");
const lgSvg = lgStage.querySelector("svg");
const lgReadout = root.querySelector("[data-readout]");
const lgLive = root.querySelector(".lg-live");
const lgPart = (name) => lgSvg.querySelector(`[data-part="${name}"]`);
const els = {
  ratchet: lgPart("ratchet"), lever: lgPart("lever"), blade: lgPart("pawl-blade"), arm: lgPart("pawl-arm"),
  knob: lgPart("knob"), tailpin: lgPart("tailpin"), crankSpring: lgPart("crank-spring"), pawlSpring: lgPart("pawl-spring"),
  index: lgPart("knob-index"), flag: lgPart("flag"), lines: lgPart("lines"),
  wheels: [0, 1, 2, 3].map((i) => lgSvg.querySelector(`[data-wheel="${i}"]`)),
};
const still = matchMedia("(prefers-reduced-motion: reduce)");
const TALL = D.WIN.z1 - D.WIN.z0;

function setSolid(el, paths) {
  el.querySelector(".iso-fill").setAttribute("d", paths.fill);
  el.querySelectorAll(".iso-shade").forEach((node, i) => node.setAttribute("d", paths.shades[i]));
  el.querySelector(".iso-top").setAttribute("d", paths.top);
  el.querySelector(".iso-crease").setAttribute("d", paths.crease);
  el.querySelector(".iso-edge").setAttribute("d", paths.outline);
}
const setCoil = (el, coil) => { const [b, f] = el.querySelectorAll("path"); b.setAttribute("d", coil.back); f.setAttribute("d", coil.front); };

// ---- geometry, mirroring build.mjs ----
const leverAt = (angle) => {
  const d = [Math.cos(angle), Math.sin(angle)];
  const n = [-d[1], d[0]];
  const p = (s, w) => [D.PIVOT[0] + d[0] * s + n[0] * w, D.PIVOT[1] + d[1] * s + n[1] * w];
  return [p(-11, 2.2), p(-11, -2.2), p(D.LEVER_LEN, -1.6), p(D.LEVER_LEN, 1.6)];
};
const along = (angle, s) => [D.PIVOT[0] + Math.cos(angle) * s, D.PIVOT[1] + Math.sin(angle) * s];
const tailAt = (angle) => along(angle + Math.PI, 9.5);
const ratchetAt = (theta) => rotateXZ(D.ratchetPoly.map(([x, z]) => [D.PLATEN.x + x, D.PLATEN.z + z]), [D.PLATEN.x, D.PLATEN.z], theta);
const bladeAt = (delta) => {
  const n = [D.PAWL_DIR[1], -D.PAWL_DIR[0]];
  const pv = D.PAWL_PIVOT;
  const T = D.TIP;
  const dir = D.PAWL_DIR;
  const poly = [[T[0] + 0.15 * n[0], T[1] + 0.15 * n[1]], [T[0] - 0.45 * n[0], T[1] - 0.45 * n[1]], [pv[0] - 1.5 * n[0] + 0.9 * dir[0], pv[1] - 1.5 * n[1] + 0.9 * dir[1]], [pv[0] + 1.5 * n[0] + 0.9 * dir[0], pv[1] + 1.5 * n[1] + 0.9 * dir[1]]];
  return rotateXZ(poly, pv, delta);
};
const armAt = (delta) => rotateXZ([[D.PAWL_PIVOT[0] - 0.7, D.PAWL_PIVOT[1]], [D.PAWL_PIVOT[0] + 0.7, D.PAWL_PIVOT[1]], [D.PAWL_ARM[0] + 0.6, D.PAWL_ARM[1] - 0.6], [D.PAWL_ARM[0] - 0.6, D.PAWL_ARM[1] - 0.6]], D.PAWL_PIVOT, delta);

// Pawl: its tip rides the tooth under it. Radius of the wheel at angle b past a steep face.
const toothR = (b) => {
  const { root, tip } = D.RATCHET;
  return b < STEEP ? root + (tip - root) * (b / STEEP) : root + (tip - root) * (1 - b / STEP);
};
const tipRadius = (delta) => { const [x, z] = rotateXZ([D.TIP], D.PAWL_PIVOT, delta)[0]; return Math.hypot(x - D.PLATEN.x, z - D.PLATEN.z); };
const LIFT = tipRadius(0.05) > tipRadius(-0.05) ? 1 : -1;
function pawlDelta(theta) {
  const b = (((D.PAWL_PHI - theta) % STEP) + STEP) % STEP;
  const want = Math.max(tipRadius(0), toothR(b) + 0.15);
  let lo = 0;
  let hi = 0.8;
  for (let i = 0; i < 24; i++) { const mid = (lo + hi) / 2; if (tipRadius(LIFT * mid) < want) lo = mid; else hi = mid; }
  return LIFT * hi;
}

// ---- state ----
const ledger = createLedger();
SEQUENCE.slice(0, 4).forEach((m) => ledger.post(m));
let fed = ledger.count; // feeds done: line i sits PITCH * (fed - i) above the print line
let crank = D.REST;
let shown = ledger.onHand();
let flagUp = ledger.isLow() ? 1 : 0;
let nudge = 0; // a blocked reverse: the wheel moves back to the pawl and stops
let job = null; // { t, from, to, line } for one post
let block = null;
let clock = 0;
let tourAt = 2.2;
let touring = !still.matches;
let cycle = 0;
let lastLine = ledger.lines()[ledger.count - 1];
let message = "";
let messageUntil = 0;

const nextMovement = () => {
  const n = ledger.count;
  if (n < SEQUENCE.length) return SEQUENCE[n];
  // After the opening sequence the tour keeps posting the same kinds of line; adjustments alternate sign so stock stays bounded.
  const loop = SEQUENCE.slice(1);
  const at = (n - SEQUENCE.length) % loop.length;
  if (at === 0) cycle++;
  const m = loop[at];
  return m.reason === "adjustment" ? { ...m, qty: cycle % 2 ? -m.qty : m.qty } : m;
};

// ---- drawing ----
function drawTape() {
  const lines = ledger.lines();
  const keep = lines.slice(-9);
  const printed = job && job.t < 0.38 ? keep.slice(0, -1) : keep;
  let html = "";
  for (const m of printed) {
    const y = -D.PITCH * (fed - (m.line - 1));
    const tone = m.line === lines.length ? ' data-tone="lit"' : "";
    html += `<text class="lg-line"${tone} x="4" y="${y.toFixed(2)}" font-size="3" style="white-space:pre">${tapeText(m)}</text>`;
  }
  if (els.lines.innerHTML !== html) els.lines.innerHTML = html;
}
function drawCounter() {
  const value = Math.max(0, shown);
  for (let k = 0; k < 4; k++) {
    const unit = 10 ** (3 - k);
    const base = Math.floor(value / unit);
    const rest = value - base * unit;
    const carry = unit > 1 && rest > unit - 1 ? rest - (unit - 1) : unit === 1 ? rest : 0;
    const p = (base % 10) + carry;
    els.wheels[k].setAttribute("transform", `translate(0 ${(-p * TALL).toFixed(3)})`);
  }
}
function draw() {
  const theta = D.THETA0 + fed * STEP - nudge;
  setSolid(els.ratchet, prismPaths(YF, ratchetAt(theta), D.RATCHET.y0, D.RATCHET.y1, P, iso, pathOf));
  const delta = pawlDelta(theta);
  setSolid(els.blade, prismPaths(YF, bladeAt(delta), D.PAWL_Y[0], D.PAWL_Y[1], P, iso, pathOf));
  setSolid(els.arm, prismPaths(YF, armAt(delta), D.PAWL_Y[0], D.PAWL_Y[1], P, iso, pathOf));
  const armEnd = rotateXZ([D.PAWL_ARM], D.PAWL_PIVOT, delta)[0];
  setCoil(els.pawlSpring, helixPaths([armEnd[0], 42.5, armEnd[1] + 0.1], [D.PAWL_PIN[0], 42.5, D.PAWL_PIN[1]], 0.75, 7, P, iso, pathOf));
  els.index.setAttribute("d", pathOf([iso([D.PLATEN.x, 49, D.PLATEN.z], P), iso([D.PLATEN.x + 3.2 * Math.cos(theta), 49, D.PLATEN.z + 3.2 * Math.sin(theta)], P)]));

  setSolid(els.lever, prismPaths(YF, leverAt(crank), D.LEVER_Y[0], D.LEVER_Y[1], P, iso, pathOf));
  const end = along(crank, D.LEVER_LEN + 0.4);
  const end0 = along(D.REST, D.LEVER_LEN + 0.4);
  els.knob.setAttribute("transform", translateAlong(P, [end[0] - end0[0], 0, end[1] - end0[1]]));
  const tail = tailAt(crank);
  const tail0 = tailAt(D.REST);
  els.tailpin.setAttribute("transform", translateAlong(P, [tail[0] - tail0[0], 0, tail[1] - tail0[1]]));
  setCoil(els.crankSpring, helixPaths([tail[0], 54.2, tail[1]], [D.STUD[0], 54.2, D.STUD[1]], 1, 9, P, iso, pathOf));

  els.flag.setAttribute("transform", translateAlong(P, [0, 0, D.FLAG.lift * flagUp]));
  drawCounter();
  drawTape();

  // the ledger already holds a line the crank has not printed yet: read the book as of the printed line
  const upTo = ledger.lines().slice(0, lastLine.line).reduce((sum, m) => sum + m.qty, 0);
  const asPrinted = { onHand: () => upTo, isLow: () => ledger.threshold > 0 && upTo <= ledger.threshold };
  const text = message && clock < messageUntil ? message : readoutOf(asPrinted, lastLine);
  if (lgReadout.textContent !== text) lgReadout.textContent = text;
  lgStage.setAttribute("aria-valuenow", String(ledger.count));
  lgStage.setAttribute("aria-valuetext", readoutOf(asPrinted, lastLine));
}

// ---- motion ----
const smooth = (t) => t * t * (3 - 2 * t);
const span = (t, a, b) => Math.min(1, Math.max(0, (t - a) / (b - a)));
const JOB = 1.1; // seconds per post: pull 0–0.38, strike, return and feed 0.38–1.1

function post(announce) {
  if (job) finishJob();
  const from = ledger.onHand();
  const m = ledger.post(nextMovement());
  job = { t: 0, from, to: ledger.onHand(), fed0: fed, line: m };
  if (still.matches) finishJob();
  if (announce && lgLive) lgLive.textContent = readoutOf(ledger, m);
  run();
}
function finishJob() {
  if (!job) return;
  fed = job.fed0 + 1;
  crank = D.REST;
  shown = job.to;
  lastLine = job.line;
  job = null;
}
function tryReverse() {
  message = "the ledger only appends · the pawl holds";
  messageUntil = clock + 2.4;
  block = { t: 0 };
  run();
}

let frame = 0;
let last = 0;
let visible = false;
let idleTimer = 0;
function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
  last = now;
  clock += dt;
  if (touring && !job && clock >= tourAt) { post(false); tourAt = clock + 2.8; }
  if (job) {
    job.t += dt;
    const t = job.t;
    crank = t < 0.38 ? D.REST - D.PULL * smooth(span(t, 0, 0.38)) : D.REST - D.PULL * (1 - smooth(span(t, 0.38, 0.95)));
    if (t >= 0.38) lastLine = job.line;
    fed = job.fed0 + smooth(span(t, 0.45, 1.0));
    shown = job.from + (job.to - job.from) * smooth(span(t, 0.4, 1.0));
    if (t >= JOB) finishJob();
  }
  if (block) {
    block.t += dt;
    nudge = (D.PAWL_GAP * 0.9) * Math.sin(Math.PI * span(block.t, 0, 0.36));
    if (block.t >= 0.36) { nudge = 0; block = null; }
  }
  const wantFlag = ledger.isLow() && (!job || job.t >= 0.6) ? 1 : 0;
  flagUp = still.matches ? wantFlag : flagUp + (wantFlag - flagUp) * (1 - Math.exp(-dt / 0.12));
  if (Math.abs(wantFlag - flagUp) < 0.002) flagUp = wantFlag;
  draw();
  const busy = touring || job || block || flagUp !== wantFlag || (message && clock < messageUntil + 0.1);
  frame = visible && busy ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible) { last = 0; frame = requestAnimationFrame(tick); } };
const hold = () => {
  touring = false;
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => { if (!still.matches) { touring = true; tourAt = clock + 0.6; run(); } }, 3600);
};

new IntersectionObserver((entries) => { visible = entries[entries.length - 1].isIntersecting; if (visible) run(); }, { rootMargin: "120px 0px" }).observe(lgStage);
lgStage.addEventListener("click", () => { hold(); post(true); });
lgStage.addEventListener("keydown", (event) => {
  if (event.key === " " || event.key === "Enter" || event.key === "ArrowRight") { event.preventDefault(); hold(); post(true); }
  else if (event.key === "ArrowLeft" || event.key === "Backspace") { event.preventDefault(); hold(); tryReverse(); if (lgLive) lgLive.textContent = "The ledger only appends. Earlier lines stay as printed."; }
});
draw();

};
