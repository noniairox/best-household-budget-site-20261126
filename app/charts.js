// Pembuat grafik SVG tanpa pustaka: batang horizontal, donat, dan tren bulanan.
// Semua grafik digambar dari angka yang diberikan, tanpa data palsu.
export function hbars(rows, maxValue) {
  // rows: [{ label, value, color, note }]
  const max = maxValue || Math.max(...rows.map((r) => r.value), 1);
  return rows
    .map((r) => {
      const pct = Math.min(100, (r.value / max) * 100);
      const over = r.value > max ? ' over' : '';
      return `<div class="hbar-row">
        <div class="hbar-label">${r.label}</div>
        <div class="hbar-track"><div class="hbar-fill${over}" style="width:${pct}%;background:${r.color}"></div></div>
        <div class="hbar-value">${r.note ?? ''}</div>
      </div>`;
    })
    .join('');
}

export function donut(parts, size = 220) {
  // parts: [{ label, value, color }]; mengembalikan SVG donat + legenda.
  const total = parts.reduce((s, p) => s + p.value, 0) || 1;
  const r = 80;
  const cx = size / 2;
  const cy = size / 2;
  const stroke = 34;
  let offset = 0;
  const C = 2 * Math.PI * r;
  const arcs = parts
    .map((p) => {
      const frac = p.value / total;
      const len = frac * C;
      const dash = `${Math.max(0, len - 2)} ${C - Math.max(0, len - 2)}`;
      const el = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${p.color}" stroke-width="${stroke}" stroke-dasharray="${dash}" stroke-dashoffset="${-offset}" />`;
      offset += len;
      return el;
    })
    .join('');
  const legend = parts
    .map((p) => {
      const pct = ((p.value / total) * 100).toFixed(1);
      return `<li><span class="dot" style="background:${p.color}"></span>${p.label} — ${pct}%</li>`;
    })
    .join('');
  return `<div class="donut-wrap">
    <svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="Donat pembagian pengeluaran">
      <title>Pembagian pengeluaran per kategori</title>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#eee" stroke-width="${stroke}" />
      ${arcs}
      <text x="${cx}" y="${cy - 4}" text-anchor="middle" class="donut-center">Total</text>
      <text x="${cx}" y="${cy + 18}" text-anchor="middle" class="donut-center-num">${(total / 1000000).toFixed(2)} jt</text>
    </svg>
    <ul class="legend">${legend}</ul>
  </div>`;
}

export function trendChart(months, width = 640, height = 260) {
  // months: [{ month, income, spent }]; batang pemasukan (hijau) vs pengeluaran (biru).
  const max = Math.max(...months.map((m) => Math.max(m.income, m.spent))) * 1.1;
  const padL = 52;
  const padB = 28;
  const padT = 12;
  const plotW = width - padL - 16;
  const plotH = height - padT - padB;
  const slot = plotW / months.length;
  const barW = Math.min(34, slot / 3);
  const y = (v) => padT + plotH - (v / max) * plotH;
  const grid = [0.25, 0.5, 0.75, 1].map((f) => {
    const gy = padT + plotH * (1 - f);
    const label = 'Rp ' + ((max * f) / 1000000).toFixed(0) + ' jt';
    return `<line x1="${padL}" y1="${gy}" x2="${width - 16}" y2="${gy}" class="grid" /><text x="${padL - 6}" y="${gy + 4}" text-anchor="end" class="axis">${label}</text>`;
  }).join('');
  const bars = months
    .map((m, i) => {
      const x = padL + i * slot + slot / 2;
      return `<rect x="${x - barW - 3}" y="${y(m.income)}" width="${barW}" height="${plotH - (y(m.income) - padT)}" fill="#2e7d32" rx="3" />
      <rect x="${x + 3}" y="${y(m.spent)}" width="${barW}" height="${plotH - (y(m.spent) - padT)}" fill="#1565c0" rx="3" />
      <text x="${x}" y="${height - 8}" text-anchor="middle" class="axis">${m.month}</text>`;
    })
    .join('');
  return `<svg viewBox="0 0 ${width} ${height}" width="100%" role="img" aria-label="Grafik tren pemasukan dan pengeluaran enam bulan">
    <title>Tren pemasukan dan pengeluaran Juni–November 2026</title>
    ${grid}${bars}
  </svg>
  <div class="chart-key"><span><i style="background:#2e7d32"></i>Pemasukan</span><span><i style="background:#1565c0"></i>Pengeluaran</span></div>`;
}
