// Lima halaman DompetKeluarga. Setiap view mengembalikan HTML dan memasang
// pendengarnya sendiri lewat wire(); main.js memanggil ulang render sesudah
// setiap perubahan agar angka di semua halaman selalu cocok.
import {
  CATEGORIES, SAVINGS, HOUSEHOLD, INCOME, TREND, state,
  totalIncome, totalSpent, totalBudget, spentByCategory, categoryOf, unpaidBillsTotal,
  formatRp, formatDate,
} from './data.js';
import { hbars, donut, trendChart } from './charts.js';

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function progressBar(pct, color) {
  const p = Math.min(100, Math.max(0, pct));
  return `<div class="pbar"><div class="pfill" style="width:${p}%;background:${color || '#2e7d32'}"></div></div>`;
}

function summaryCards() {
  const income = totalIncome();
  const spent = totalSpent();
  const saved = SAVINGS.reduce((s, x) => s + x.amount, 0);
  const rest = income - spent - saved;
  return `<section class="cards">
    <div class="card"><div class="card-label">Pemasukan ${HOUSEHOLD.month}</div><div class="card-num green">${formatRp(income)}</div><div class="card-sub">${INCOME.map((i) => esc(i.source) + ' ' + formatRp(i.amount)).join(' · ')}</div></div>
    <div class="card"><div class="card-label">Pengeluaran</div><div class="card-num blue">${formatRp(spent)}</div><div class="card-sub">${state.transactions.length} transaksi tercatat</div></div>
    <div class="card"><div class="card-label">Disisihkan (tabungan + darurat)</div><div class="card-num teal">${formatRp(saved)}</div><div class="card-sub">Tabungan wajib ${formatRp(1500000)} · Dana darurat ${formatRp(450000)}</div></div>
    <div class="card"><div class="card-label">Sisa bulan ini</div><div class="card-num ${rest >= 0 ? 'green' : 'red'}">${formatRp(rest)}</div><div class="card-sub">${rest >= 0 ? 'Masih dalam anggaran' : 'Melebihi anggaran'}</div></div>
  </section>`;
}

export function viewDashboard() {
  const spent = totalSpent();
  const catRows = CATEGORIES.map((c) => ({
    label: c.name,
    value: spentByCategory(c.id),
    color: c.color,
    note: formatRp(spentByCategory(c.id)) + ' dari ' + formatRp(c.budget),
  }));
  const upcoming = state.bills.filter((b) => !b.paid).slice(0, 3);
  const recent = [...state.transactions].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 5);
  const goalsTop = [...state.goals].sort((a, b) => b.saved / b.target - a.saved / a.target).slice(0, 2);
  return `<h1>Dasbor — ${HOUSEHOLD.month}</h1>
  <p class="lede">${esc(HOUSEHOLD.name)} · ${esc(HOUSEHOLD.city)} · ${esc(HOUSEHOLD.members)}. Semua angka di halaman ini dihitung dari transaksi yang tercatat.</p>
  ${summaryCards()}
  <div class="grid2">
    <section class="panel"><h2>Pengeluaran per kategori</h2>
      ${hbars(catRows, Math.max(...CATEGORIES.map((c) => c.budget)))}
      <p class="note">Total pengeluaran ${formatRp(spent)} dari anggaran belanja ${formatRp(totalBudget())}.</p>
      <p><a class="btn" href="#/anggaran">Atur anggaran →</a></p>
    </section>
    <section class="panel"><h2>Tabungan terdekat</h2>
      ${goalsTop.map((g) => `<div class="goal-mini"><div class="goal-head"><strong>${esc(g.name)}</strong><span>${formatRp(g.saved)} / ${formatRp(g.target)}</span></div>${progressBar((g.saved / g.target) * 100, '#00838f')}<div class="goal-pct">${Math.round((g.saved / g.target) * 100)}% tercapai</div></div>`).join('')}
      <p><a class="btn" href="#/tabungan">Lihat semua tujuan →</a></p>
      <h2>Tagihan belum lunas</h2>
      ${upcoming.length ? `<ul class="bill-list">${upcoming.map((b) => `<li><strong>${esc(b.name)}</strong> — jatuh tempo ${b.due} Nov · <b>${formatRp(b.amount)}</b></li>`).join('')}</ul>` : '<p>Semua tagihan bulan ini sudah lunas.</p>'}
      <p>Total belum lunas: <b>${formatRp(unpaidBillsTotal())}</b> · <a class="btn" href="#/tagihan">Lihat kalender tagihan →</a></p>
    </section>
  </div>
  <section class="panel"><h2>Transaksi terakhir</h2>
    <div class="table-scroll"><table class="tx"><thead><tr><th>Tanggal</th><th>Keterangan</th><th>Kategori</th><th class="r">Jumlah</th></tr></thead>
    <tbody>${recent.map((t) => `<tr><td>${formatDate(t.date)}</td><td>${esc(t.desc)}</td><td>${esc(categoryOf(t.cat)?.name ?? t.cat)}</td><td class="r">${formatRp(t.amount)}</td></tr>`).join('')}</tbody></table></div>
  </section>`;
}

export function viewBudget() {
  const budgetTotal = totalBudget();
  const spentTotal = totalSpent();
  const rows = CATEGORIES.map((c) => {
    const spent = spentByCategory(c.id);
    const pct = (spent / c.budget) * 100;
    return `<tr><td><span class="dot" style="background:${c.color}"></span> ${esc(c.name)}</td><td class="r">${formatRp(c.budget)}</td><td class="r">${formatRp(spent)}</td><td class="r">${formatRp(c.budget - spent)}</td><td>${progressBar(pct, pct > 100 ? '#c62828' : c.color)}<span class="pct">${Math.round(pct)}%</span></td></tr>`;
  }).join('');
  return `<h1>Perencana anggaran — ${HOUSEHOLD.month}</h1>
  <p class="lede">Anggaran belanja ${formatRp(budgetTotal)}, terpakai ${formatRp(spentTotal)}, sisa ${formatRp(budgetTotal - spentTotal)}. Tambah transaksi di bawah dan tabel langsung berubah.</p>
  <section class="panel"><h2>Anggaran per kategori</h2>
    <div class="table-scroll"><table class="tx"><thead><tr><th>Kategori</th><th class="r">Anggaran</th><th class="r">Terpakai</th><th class="r">Sisa</th><th>Kemajuan</th></tr></thead><tbody>${rows}</tbody></table></div>
  </section>
  <div class="grid2">
    <section class="panel"><h2>Tambah transaksi</h2>
      <form id="tx-form" class="form">
        <label>Keterangan <input id="tx-desc" type="text" required maxlength="80" placeholder="cth. Belanja mingguan pasar"></label>
        <label>Kategori <select id="tx-cat">${CATEGORIES.map((c) => `<option value="${c.id}">${esc(c.name)}</option>`).join('')}</select></label>
        <label>Jumlah (Rp) <input id="tx-amount" type="number" min="1000" step="1000" required placeholder="500000"></label>
        <label>Tanggal <input id="tx-date" type="date" value="2026-11-26" min="2026-11-01" max="2026-11-30" required></label>
        <button class="btn primary" type="submit" data-testid="tx-add">Simpan transaksi</button>
        <p class="form-msg" id="tx-msg" role="status"></p>
      </form>
    </section>
    <section class="panel"><h2>Daftar transaksi</h2>
      <label class="filter">Tampilkan <select id="tx-filter" data-testid="tx-filter"><option value="all">Semua kategori</option>${CATEGORIES.map((c) => `<option value="${c.id}">${esc(c.name)}</option>`).join('')}</select></label>
      <ul class="tx-list" id="tx-list"></ul>
    </section>
  </div>`;
}

export function viewGoals() {
  return `<h1>Tujuan tabungan</h1>
  <p class="lede">Empat tujuan keluarga. Tambah dana ke tujuan mana pun dan batang kemajuannya langsung bergerak.</p>
  <div class="grid2">
  ${state.goals.map((g) => {
    const pct = (g.saved / g.target) * 100;
    return `<section class="panel"><h2>${esc(g.name)}</h2>
      <p class="note">${esc(g.note)}</p>
      <div class="goal-big"><span class="goal-num">${formatRp(g.saved)}</span><span> dari ${formatRp(g.target)}</span></div>
      ${progressBar(pct, '#00838f')}
      <div class="goal-pct">${Math.round(pct)}% tercapai · kurang ${formatRp(Math.max(0, g.target - g.saved))}</div>
      <form class="goal-add" data-goal="${g.id}">
        <label>Tambah dana (Rp) <input class="goal-add-amount" type="number" min="1000" step="1000" required placeholder="500000"></label>
        <button class="btn primary" type="submit">Tambah</button>
      </form>
    </section>`;
  }).join('')}
  </div>
  <section class="panel"><h2>Buat tujuan baru</h2>
    <form id="goal-form" class="form inline">
      <label>Nama tujuan <input id="goal-name" type="text" required maxlength="60" placeholder="cth. Renovasi dapur"></label>
      <label>Target (Rp) <input id="goal-target" type="number" min="100000" step="100000" required placeholder="10000000"></label>
      <label>Sudah terkumpul (Rp) <input id="goal-saved" type="number" min="0" step="100000" value="0" required></label>
      <button class="btn primary" type="submit">Buat tujuan</button>
      <p class="form-msg" id="goal-msg" role="status"></p>
    </form>
  </section>`;
}

export function viewBills() {
  const year = 2026;
  const month = 10; // November (0-based)
  const firstDay = new Date(year, month, 1).getDay(); // 0 = Minggu
  const days = 30;
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push('<td class="empty"></td>');
  for (let d = 1; d <= days; d++) {
    const due = state.bills.filter((b) => b.due === d);
    cells.push(`<td class="${due.length ? 'has-bill' : ''}"><div class="cal-day">${d}</div>${due.map((b) => `<div class="cal-bill ${b.paid ? 'paid' : 'unpaid'}">${esc(b.name)}</div>`).join('')}</td>`);
  }
  while (cells.length % 7 !== 0) cells.push('<td class="empty"></td>');
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(`<tr>${cells.slice(i, i + 7).join('')}</tr>`);
  return `<h1>Kalender tagihan — November 2026</h1>
  <p class="lede">Total tagihan belum lunas: <b>${formatRp(unpaidBillsTotal())}</b>. Tandai lunas setelah membayar; kalender dan total langsung berubah.</p>
  <section class="panel"><h2>November 2026</h2>
    <table class="cal"><thead><tr><th>Min</th><th>Sen</th><th>Sel</th><th>Rab</th><th>Kam</th><th>Jum</th><th>Sab</th></tr></thead><tbody>${weeks.join('')}</tbody></table>
    <p class="note"><span class="cal-bill unpaid">Belum lunas</span> <span class="cal-bill paid">Lunas</span></p>
  </section>
  <section class="panel"><h2>Daftar tagihan</h2>
    <div class="table-scroll"><table class="tx"><thead><tr><th>Tagihan</th><th>Jatuh tempo</th><th class="r">Jumlah</th><th>Status</th><th></th></tr></thead>
    <tbody>${state.bills.map((b) => `<tr><td>${esc(b.name)}</td><td>${b.due} November 2026</td><td class="r">${formatRp(b.amount)}</td><td>${b.paid ? '<span class="tag ok">Lunas</span>' : '<span class="tag warn">Belum lunas</span>'}</td><td><button class="btn small bill-toggle" data-bill="${b.id}" data-testid="bill-toggle">${b.paid ? 'Batalkan lunas' : 'Tandai lunas'}</button></td></tr>`).join('')}</tbody></table></div>
  </section>`;
}

export function viewReport() {
  const spent = totalSpent();
  const income = totalIncome();
  const saved = SAVINGS.reduce((s, x) => s + x.amount, 0);
  const rate = Math.round(((income - spent) / income) * 100);
  const top = [...CATEGORIES].sort((a, b) => spentByCategory(b.id) - spentByCategory(a.id))[0];
  const over = CATEGORIES.filter((c) => spentByCategory(c.id) > c.budget);
  return `<h1>Laporan — enam bulan terakhir</h1>
  <p class="lede">Pemasukan keluarga stabil di ${formatRp(12500000)} per bulan; pengeluaran November ${formatRp(spent)}.</p>
  <section class="panel"><h2>Pemasukan vs pengeluaran (Jun–Nov 2026)</h2>
    ${trendChart(TREND)}
  </section>
  <div class="grid2">
    <section class="panel"><h2>Pembagian pengeluaran November</h2>
      ${donut(CATEGORIES.map((c) => ({ label: c.name, value: spentByCategory(c.id), color: c.color })))}
    </section>
    <section class="panel"><h2>Yang bisa dibaca dari angka</h2>
      <ul class="insights">
        <li><b>Tingkat menabung ${rate}%</b> — dari pemasukan ${formatRp(income)}, ${formatRp(income - spent)} tidak dibelanjakan bulan ini.</li>
        <li><b>Kategori terbesar: ${esc(top.name)}</b> — ${formatRp(spentByCategory(top.id))}, ${Math.round((spentByCategory(top.id) / spent) * 100)}% dari semua pengeluaran.</li>
        <li><b>Cicilan rumah</b> ${formatRp(2500000)} adalah pengeluaran tetap terbesar; lunas tepat waktu setiap bulan.</li>
        <li><b>Tabungan wajib + dana darurat</b> ${formatRp(saved)} disisihkan sebelum belanja, bukan dari sisa.</li>
        <li>${over.length ? '<b>Perhatian:</b> ' + over.map((c) => esc(c.name)).join(', ') + ' melewati anggaran bulan ini.' : '<b>Tidak ada kategori yang melewati anggaran</b> bulan ini — semua masih dalam batas.'}</li>
        <li><b>Tren:</b> pengeluaran enam bulan terakhir bergerak di ${formatRp(9217000)}–${formatRp(11230000)}; November termasuk bulan paling hemat.</li>
      </ul>
    </section>
  </div>`;
}

// ---- Wiring: dipanggil main.js sesudah HTML halaman dipasang ----
export function wire(route, rerender) {
  if (route === 'anggaran') {
    const form = document.getElementById('tx-form');
    const list = document.getElementById('tx-list');
    const filter = document.getElementById('tx-filter');
    const msg = document.getElementById('tx-msg');
    const drawList = () => {
      const f = filter.value;
      const items = [...state.transactions]
        .filter((t) => f === 'all' || t.cat === f)
        .sort((a, b) => (a.date < b.date ? 1 : -1));
      list.innerHTML = items.length
        ? items.map((t, i) => `<li><span>${formatDate(t.date)} — ${esc(t.desc)} (${esc(categoryOf(t.cat)?.name ?? t.cat)})</span><span><b>${formatRp(t.amount)}</b> <button class="btn small danger tx-del" data-idx="${state.transactions.indexOf(t)}">Hapus</button></span></li>`).join('')
        : '<li>Tidak ada transaksi untuk filter ini.</li>';
      list.querySelectorAll('.tx-del').forEach((btn) => {
        btn.addEventListener('click', () => {
          state.transactions.splice(Number(btn.dataset.idx), 1);
          rerender();
        });
      });
    };
    filter.addEventListener('change', drawList);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const desc = document.getElementById('tx-desc').value.trim();
      const cat = document.getElementById('tx-cat').value;
      const amount = Number(document.getElementById('tx-amount').value);
      const date = document.getElementById('tx-date').value;
      if (!desc || !amount || amount < 1000 || !date) {
        msg.textContent = 'Isi keterangan, jumlah minimal Rp 1.000, dan tanggal.';
        return;
      }
      state.transactions.push({ date, desc, cat, amount });
      msg.textContent = 'Transaksi ' + formatRp(amount) + ' tersimpan.';
      form.reset();
      document.getElementById('tx-date').value = '2026-11-26';
      rerender();
    });
    drawList();
  }
  if (route === 'tabungan') {
    document.querySelectorAll('.goal-add').forEach((form) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const g = state.goals.find((x) => x.id === form.dataset.goal);
        const input = form.querySelector('.goal-add-amount');
        const amount = Number(input.value);
        if (!g || !amount || amount < 1000) return;
        g.saved = Math.min(g.target, g.saved + amount);
        rerender();
      });
    });
    const gform = document.getElementById('goal-form');
    gform.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('goal-name').value.trim();
      const target = Number(document.getElementById('goal-target').value);
      const saved = Number(document.getElementById('goal-saved').value) || 0;
      const msg = document.getElementById('goal-msg');
      if (!name || !target || target < 100000 || saved > target) {
        msg.textContent = 'Isi nama dan target minimal Rp 100.000; dana awal tidak boleh melebihi target.';
        return;
      }
      state.goals.push({ id: 'g' + Date.now(), name, target, saved, note: 'Tujuan baru keluarga' });
      msg.textContent = 'Tujuan "' + name + '" dibuat.';
      gform.reset();
      document.getElementById('goal-saved').value = '0';
      rerender();
    });
  }
  if (route === 'tagihan') {
    document.querySelectorAll('.bill-toggle').forEach((btn) => {
      btn.addEventListener('click', () => {
        const b = state.bills.find((x) => x.id === btn.dataset.bill);
        if (b) b.paid = !b.paid;
        rerender();
      });
    });
  }
}
