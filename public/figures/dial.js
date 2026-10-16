(window.isoFigures ||= {})["dial"] = function mount(root) {
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


const P = {"origin":[300,188.18552001252854],"scale":1.137234533117533,"azimuth":40,"elevation":38};
const C = [-18,-18];
const N = 48;
const SLOT = 30;
const STEP = 0.1308996938995747;
const INDEX = 2.2689280275926285;
const TAB_IN = 57;
const TAB_OUT = 79;
const TAB_HALF = 0.04799655442984406;
const TAB_DOWN = 0.6;
const TAB_UP = 6.5;
const PIN_R = 72;
const PLATE_TOP = 15;
const R_TICK = 54;
const R_LOCK = 81;
const R_PLATE = 75;
const LOCK_LOW = 7;
const LOCK_REST = 11;
const LOCK_LIFT = 3.4;
const KNOB_TOP = 21;
const PAWL_W = 1.5;
const PAWL_T = 1.6;
const BLOCK = [82,98,8.5];
const PIN_H = 3.2;
const R_NUM = 43.4;
const THRESH = -8.748224407573586;
const PIVOT = [62,80];
const LEVER = 34;
const THROW = -0.7853981633974483;
const KEY_Z = 1.6;
const KEY_UP = 6;
const KEY_DOWN = 3.4;
const KEY_D = 12;
const KEY_GAP = 2.4;
const KEY_Y0 = -16.2;
const RULES = [{"weekday":1,"startMinute":540,"endMinute":1080,"slotMinutes":30},{"weekday":2,"startMinute":540,"endMinute":1080,"slotMinutes":30},{"weekday":3,"startMinute":540,"endMinute":1080,"slotMinutes":30},{"weekday":4,"startMinute":540,"endMinute":1080,"slotMinutes":30},{"weekday":5,"startMinute":540,"endMinute":1080,"slotMinutes":30},{"weekday":6,"startMinute":540,"endMinute":780,"slotMinutes":30}];
const WEEK = ["2024-01-08","2024-01-09","2024-01-10","2024-01-11","2024-01-12","2024-01-13","2024-01-14"];
const BLACKOUTS = ["2024-01-11"];
const BOOKED = [{"day":"2024-01-08","start":570,"durationMin":30},{"day":"2024-01-08","start":690,"durationMin":30},{"day":"2024-01-08","start":840,"durationMin":60},{"day":"2024-01-08","start":990,"durationMin":30},{"day":"2024-01-09","start":630,"durationMin":30},{"day":"2024-01-09","start":720,"durationMin":30},{"day":"2024-01-09","start":900,"durationMin":30},{"day":"2024-01-10","start":540,"durationMin":30},{"day":"2024-01-10","start":570,"durationMin":30},{"day":"2024-01-10","start":780,"durationMin":30},{"day":"2024-01-10","start":1020,"durationMin":30},{"day":"2024-01-12","start":660,"durationMin":30},{"day":"2024-01-12","start":690,"durationMin":30},{"day":"2024-01-12","start":720,"durationMin":30},{"day":"2024-01-12","start":960,"durationMin":30},{"day":"2024-01-13","start":600,"durationMin":30},{"day":"2024-01-13","start":630,"durationMin":30}];
const START = {"day":0,"tod":645};
function weekdayOf(day) {
  return new Date(`${day}T12:00:00Z`).getUTCDay();
}
function slotsFor(day, rules, blackouts, booked, now = -Infinity, duration = 30) {
  if (blackouts.includes(day)) return [];
  const busy = booked.filter((b) => b.day === day).map((b) => ({ start: b.start, end: b.start + b.durationMin }));
  const slots = [];
  for (const rule of rules) {
    if (rule.weekday !== weekdayOf(day)) continue;
    const step = Math.max(5, rule.slotMinutes);
    for (let m = rule.startMinute; m + duration <= rule.endMinute; m += step) {
      if (m < now) continue; // no past slots
      const clash = busy.some((b) => m < b.end && b.start < m + duration);
      if (!clash && !slots.includes(m)) slots.push(m);
    }
  }
  return slots.sort((a, b) => a - b);
}
const polar = (r, a) => [C[0] + r * Math.cos(a), C[1] + r * Math.sin(a)];
function radialRing(a, r0, r1, half, round) {
  const c = Math.cos(a), s = Math.sin(a);
  return roundedPlan({ x: r0, y: -half, w: r1 - r0, d: half * 2, r: round }, 3).map(([u, v]) => [C[0] + u * c - v * s, C[1] + u * s + v * c]);
}
function tabRing(a) {
  return [[TAB_IN, -1], [TAB_OUT - 1.4, -1], [TAB_OUT, -0.6], [TAB_OUT, 0.6], [TAB_OUT - 1.4, 1], [TAB_IN, 1]].map(([r, side]) => polar(r, a + side * TAB_HALF));
}
const tabAngle = (i, t) => INDEX + (i + 0.5 - t / SLOT) * STEP;
const tabSolid = (a, h) => extrude(tabRing(a), PLATE_TOP, h, P, { bevel: 0.35 });
function pinSolid(a, from, to) {
  const [x, y] = polar(PIN_R, a);
  return cylinder(x, y, 1.35, from, to - from, P, 16);
}
function ticksAt(t) {
  const out = ["", "", ""];
  for (let j = 0; j < N; j++) {
    const a = INDEX + (j - t / SLOT) * STEP;
    const tone = j % 6 === 0 ? 2 : j % 2 === 0 ? 1 : 0;
    out[tone] += lineOnTop(polar(R_TICK, a), polar(R_TICK - [2, 3.4, 4.6][tone], a), PLATE_TOP, P);
  }
  return out;
}
const knobLine = (t) => lineOnTop(polar(0.3, INDEX - (t / SLOT) * STEP), polar(7.4, INDEX - (t / SLOT) * STEP), KNOB_TOP, P);
function lockSolids(lift) {
  const top = LOCK_REST + LOCK_LIFT * lift;
  return {
    ring: cylinder(C[0], C[1], R_LOCK, LOCK_LOW, top - LOCK_LOW, P, 96, 0.5),
    plate: cylinder(C[0], C[1], R_PLATE, top, PLATE_TOP - top, P, 96, 0.6),
    grip: knurl(C[0], C[1], R_PLATE, top, PLATE_TOP, 120, P, 0.35),
  };
}
const pawlSolid = (z) => extrude(radialRing(INDEX, 72, 92, PAWL_W, 0.7), z, PAWL_T, P, { bevel: 0.3 });
function numeralAt(j, t) {
  const a = INDEX + (j * 6 - t / SLOT) * STEP;
  const [x, y] = polar(R_NUM, a);
  const o = iso([x, y, PLATE_TOP], P), u = iso([x - Math.cos(a), y - Math.sin(a), PLATE_TOP], P), v = iso([x + Math.sin(a), y - Math.cos(a), PLATE_TOP], P);
  const f = (n) => Math.round(n * 1000) / 1000;
  return `matrix(${f(u[0] - o[0])} ${f(u[1] - o[1])} ${f(v[0] - o[0])} ${f(v[1] - o[1])} ${f(o[0])} ${f(o[1])})`;
}
function followerPin(z) {
  const c = Math.cos(INDEX), s = Math.sin(INDEX), v = -BLOCK[2] - 0.05, u0 = 89.5;
  const pts = [];
  for (let n = 0; n < 20; n++) {
    const t = (n / 20) * Math.PI * 2, u = u0 + 1.25 * Math.cos(t);
    pts.push(iso([C[0] + u * c - v * s, C[1] + u * s + v * c, z + PAWL_T / 2 + 1.25 * Math.sin(t)], P));
  }
  return pathOf(pts, true);
}
const keyPlan = (d) => ({ x: 85.6, y: KEY_Y0 - KEY_D - d * (KEY_D + KEY_GAP), w: 19.4, d: KEY_D, r: 1.6 });
function keySolids(d, press) {
  const top = KEY_UP - (KEY_UP - KEY_DOWN) * press;
  const plan = keyPlan(d);
  return { key: slabOf(plan, KEY_Z, top - KEY_Z, P, 3, 0.4), pad: onTop(roundedPlan({ x: plan.x + 6, y: plan.y + 2.6, w: plan.w - 8.6, d: plan.d - 5.2, r: 2.4 }, 3), top, P, true) };
}
function leverSolids(phi) {
  const a = phi;
  const c = Math.cos(a), s = Math.sin(a);
  const place = ([u, v]) => [PIVOT[0] + u * c - v * s, PIVOT[1] + u * s + v * c];
  const arm = roundedPlan({ x: -7, y: -3.4, w: LEVER + 7 + 3.4, d: 6.8, r: 3.4 }, 5).map(place);
  const [kx, ky] = place([LEVER, 0]);
  return {
    arm: extrude(arm, 3.6, 2.8, P, { bevel: 0.4 }),
    cap: cylinder(PIVOT[0], PIVOT[1], 3, 6.4, 1.6, P, 20, 0.3),
    knob: cylinder(kx, ky, 4.2, 6.4, 7.4, P, 28, 0.4),
    grip: knurl(kx, ky, 4.2, 6.4, 13.8, 22, P, 0.5),
    top: [kx, ky],
  };
}
function pattern(day) {
  const open = new Set(slotsFor(WEEK[day], RULES, [], []));
  const free = new Set(slotsFor(WEEK[day], RULES, [], BOOKED));
  return Array.from({ length: N }, (_, i) => ({ up: open.has(i * SLOT) ? 0 : 1, pin: open.has(i * SLOT) && !free.has(i * SLOT) ? 1 : 0 }));
}
const tabTop = (h) => TAB_DOWN + (TAB_UP - TAB_DOWN) * h;
const EMPTY = {"fill":"","shades":["","","",""],"top":"","crease":"","bevel":"","outline":""};

const stage = root.querySelector(".iso-stage");
const svg = stage.querySelector("svg");
const readout = root.querySelector("[data-readout]");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const $ = (sel) => svg.querySelector(sel);
const lockEl = $('[data-part="lock"]'), plateEl = $('[data-part="plate"]'), leverEl = $('[data-part="lever"]');
const backEl = $('[data-part="tabs-back"]'), frontEl = $('[data-part="tabs-front"]');
const followerEls = [$('[data-part="follower"]'), $('[data-part="follower-edge"]')];
const numEls = [...svg.querySelectorAll("[data-num]")];
const tickEls = ["minor", "major", "six"].map((name) => $('[data-part="' + name + '"]'));
const handEl = $('[data-part="hand"]');
const keyEls = [...svg.querySelectorAll("[data-key]")];
const NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
function put(g, s) {
  const c = g.children;
  c[0].setAttribute("d", s.fill);
  for (let n = 0; n < 4; n++) c[1 + n].setAttribute("d", s.shades[n] || "");
  c[5].setAttribute("d", s.top);
  c[6].setAttribute("d", s.crease);
  c[7].setAttribute("d", s.bevel || "");
  c[8].setAttribute("d", s.outline);
}
const mod = (a, n) => ((a % n) + n) % n;
const ease = (x, to, dt, tau, calm) => (calm || Math.abs(to - x) < 1e-3 ? to : x + (to - x) * (1 - Math.exp(-dt / tau)));
const smoothstep = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
// Tour pace: clinic hours turn slowly past the index, the night runs fast.
const rateAt = (t) => { const m = mod(t, 1440); return 110 + 520 * Math.max(smoothstep(1140, 1230, m), 1 - smoothstep(390, 480, m)); };

const blackouts = [...BLACKOUTS];
let day = START.day, tod = START.tod, goal = tod;
let pat = pattern(day);
const tabs = pat.map((p) => ({ h: p.up, hGoal: p.up, pin: p.pin, pinGoal: p.pin, next: null }));
const latchGoal = () => (blackouts.includes(WEEK[day]) ? 1 : 0);
const latch = { x: latchGoal() }, lock = { x: latch.x };
const keys = Array.from({ length: 7 }, (_, d) => ({ x: d === day ? 1 : 0 }));
let pawl = PLATE_TOP + tabTop(Math.max(pat[mod(Math.floor(tod / SLOT), N)].up, lock.x));
let clock = 0, frame = 0, last = 0, visible = false, touring = !still.matches, idle = 0;
const seen = { lock: -1, latch: -1, keys: [], pawl: -1 };

function setDay(d) {
  day = mod(d, 7);
  pat = pattern(day);
  const cur = mod(Math.floor(tod / SLOT), N);
  pat.forEach((p, i) => { tabs[i].next = { up: p.up, pin: p.pin, at: clock + 0.012 * mod(i - cur, N) }; });
}
function textAt(t) {
  const date = WEEK[day];
  const name = NAMES[weekdayOf(date)];
  if (blackouts.includes(date)) return name + " · blackout · 0 slots";
  if (!RULES.some((r) => r.weekday === weekdayOf(date))) return name + " · closed · 0 slots";
  const cur = mod(Math.floor(t / SLOT), N), now = cur * SLOT;
  const hhmm = String(Math.floor(now / 60)).padStart(2, "0") + ":" + String(now % 60).padStart(2, "0");
  const state = pat[cur].up ? "closed" : pat[cur].pin ? "booked" : "open";
  const left = slotsFor(date, RULES, blackouts, BOOKED, now).length;
  return name + " · " + hhmm + " · " + state + " · " + left + (left === 1 ? " slot" : " slots") + " left";
}
function draw() {
  const cur = mod(Math.floor(tod / SLOT), N);
  const angles = tabs.map((_, i) => tabAngle(i, tod));
  const order = angles.map((a, i) => [depthOf([...polar(68, a), PLATE_TOP], P), i]).sort((a, b) => a[0] - b[0]);
  const behind = order.filter(([d]) => d <= THRESH).length;
  while (backEl.children.length < behind) backEl.appendChild(frontEl.firstElementChild);
  while (backEl.children.length > behind) frontEl.insertBefore(backEl.lastElementChild, frontEl.firstElementChild);
  const slots = [...backEl.children, ...frontEl.children];
  order.forEach(([, i], j) => {
    const g = slots[j], t = tabs[i], h = tabTop(Math.max(t.h, lock.x));
    put(g.children[0], tabSolid(angles[i], h));
    g.children[0].lastElementChild.dataset.tone = Math.max(t.h, lock.x) > 0.5 ? "mid" : "hi";
    if (i === cur) g.children[0].setAttribute("data-lit", ""); else g.children[0].removeAttribute("data-lit");
    put(g.children[1], t.pin * PIN_H > 0.3 ? pinSolid(angles[i], PLATE_TOP + h, PLATE_TOP + h + PIN_H * t.pin) : EMPTY);
    put(g.children[2], i === cur ? pawlSolid(pawl) : EMPTY);
  });
  numEls.forEach((el, j) => el.setAttribute("transform", numeralAt(j, tod)));
  const pin = followerPin(pawl);
  followerEls.forEach((el) => el.setAttribute("d", pin));
  ticksAt(tod).forEach((d, n) => tickEls[n].setAttribute("d", d));
  handEl.setAttribute("d", knobLine(tod));
  if (seen.lock !== lock.x) {
    seen.lock = lock.x;
    const s = lockSolids(lock.x);
    put(lockEl, s.ring);
    put(plateEl.children[0], s.plate);
    plateEl.children[1].setAttribute("d", s.grip);
  }
  if (seen.latch !== latch.x) {
    seen.latch = latch.x;
    const s = leverSolids(THROW * latch.x), c = leverEl.children;
    put(c[0], s.arm); put(c[1], s.cap); put(c[2], s.knob);
    c[3].setAttribute("d", s.grip);
  }
  keys.forEach((kk, d) => {
    if (seen.keys[d] === kk.x) return;
    seen.keys[d] = kk.x;
    const s = keySolids(d, kk.x), el = keyEls.find((e) => e.dataset.key === String(d));
    put(el.children[0], s.key);
    el.children[0].lastElementChild.dataset.tone = d === day ? "hi" : "mid";
    el.children[1].setAttribute("d", s.pad);
  });
  const text = textAt(tod);
  if (readout.textContent !== text) readout.textContent = text;
}
function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
  last = now;
  const calm = still.matches;
  clock += dt;
  if (touring) { goal += rateAt(goal) * dt; tod = goal; }
  else tod = ease(tod, goal, dt, 0.22, calm);
  if (tod >= 1440) { tod -= 1440; goal -= 1440; setDay(day + 1); }
  if (tod < 0) { tod += 1440; goal += 1440; setDay(day - 1); }
  let moving = false;
  for (const t of tabs) {
    if (t.next && (calm || clock >= t.next.at)) { t.hGoal = t.next.up; t.pinGoal = t.next.pin; t.next = null; }
    t.h = ease(t.h, t.hGoal, dt, 0.07, calm);
    t.pin = ease(t.pin, t.pinGoal, dt, 0.09, calm);
    if (t.next || t.h !== t.hGoal || t.pin !== t.pinGoal) moving = true;
  }
  latch.x = ease(latch.x, latchGoal(), dt, 0.16, calm);
  lock.x = ease(lock.x, latch.x, dt, 0.1, calm);
  keys.forEach((kk, d) => { kk.x = ease(kk.x, d === day ? 1 : 0, dt, 0.09, calm); if (kk.x !== (d === day ? 1 : 0)) moving = true; });
  const cur = mod(Math.floor(tod / SLOT), N);
  const rest = PLATE_TOP + tabTop(Math.max(tabs[cur].h, lock.x));
  pawl = ease(pawl, rest, dt, 0.045, calm);
  draw();
  const settled = !touring && tod === goal && !moving && latch.x === latchGoal() && lock.x === latch.x && pawl === rest;
  frame = visible && !settled ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible) { last = 0; frame = requestAnimationFrame(tick); } };
const describe = () => stage.setAttribute("aria-valuetext", textAt(goal));
function takeOver() {
  touring = false;
  clearTimeout(idle);
  idle = setTimeout(() => { goal = tod; touring = !still.matches; run(); }, 3600);
}
new IntersectionObserver((entries) => { visible = entries[entries.length - 1].isIntersecting; if (visible) run(); }, { rootMargin: "120px 0px" }).observe(stage);
stage.addEventListener("pointermove", (event) => {
  const box = svg.getBoundingClientRect();
  const share = Math.min(1, Math.max(0, ((event.clientX - box.left) / box.width - 0.1) / 0.8));
  takeOver();
  goal = 7 * 60 + share * 14 * 60;
  run();
});
stage.addEventListener("click", () => { takeOver(); goal = tod; setDay(day + 1); describe(); run(); });
stage.addEventListener("keydown", (event) => {
  const from = touring ? tod : goal;
  const cur = Math.floor(from / SLOT);
  if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
    takeOver();
    goal = (cur + (event.key === "ArrowRight" ? 1 : -1) * (event.shiftKey ? 4 : 1)) * SLOT + SLOT / 2;
  } else if (event.key === "ArrowUp" || event.key === "ArrowDown" || event.key === "Enter") {
    takeOver();
    goal = from;
    setDay(day + (event.key === "ArrowDown" ? -1 : 1));
  } else if (event.key === "b" || event.key === "B") {
    takeOver();
    goal = from;
    const date = WEEK[day], at = blackouts.indexOf(date);
    if (at < 0) blackouts.push(date); else blackouts.splice(at, 1);
  } else return;
  event.preventDefault();
  describe();
  run();
});
describe();
draw();

};
