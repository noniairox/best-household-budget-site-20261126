// Data benih DompetKeluarga: anggaran rumah tangga Keluarga Santoso, November 2026.
// Semua angka dalam rupiah. Satu sumber kebenaran: semua halaman membaca dari objek ini.
export const HOUSEHOLD = {
  name: 'Keluarga Santoso',
  members: 'Budi, Sari, dan dua anak (Raka 12 th, Nia 8 th)',
  city: 'Bandung',
  month: 'November 2026',
};

export const INCOME = [
  { source: 'Gaji Budi (karyawan swasta)', amount: 10000000 },
  { source: 'Usaha sampingan Sari (katering)', amount: 2500000 },
];

export const CATEGORIES = [
  { id: 'harian', name: 'Belanja harian', budget: 2600000, color: '#2e7d32' },
  { id: 'transport', name: 'Transport & bensin', budget: 1100000, color: '#1565c0' },
  { id: 'tagihan', name: 'Listrik, air & internet', budget: 1300000, color: '#f9a825' },
  { id: 'pendidikan', name: 'Pendidikan anak', budget: 1500000, color: '#6a1b9a' },
  { id: 'kesehatan', name: 'Kesehatan', budget: 600000, color: '#c62828' },
  { id: 'cicilan', name: 'Cicilan rumah', budget: 2500000, color: '#4e342e' },
  { id: 'hiburan', name: 'Hiburan & makan luar', budget: 800000, color: '#ef6c00' },
];

// Alokasi yang disisihkan tiap bulan (bukan belanja): total 1.950.000.
export const SAVINGS = [
  { id: 'tabungan', name: 'Tabungan wajib', amount: 1500000 },
  { id: 'darurat', name: 'Dana darurat', amount: 450000 },
];

// Transaksi November 2026 (tanggal, keterangan, kategori, jumlah). Jumlah = pengeluaran.
export const TRANSACTIONS = [
  { date: '2026-11-01', desc: 'Belanja mingguan Pasar Ciroyom', cat: 'harian', amount: 486000 },
  { date: '2026-11-03', desc: 'Bensin Pertalite 30 liter', cat: 'transport', amount: 300000 },
  { date: '2026-11-05', desc: 'Cicilan KPR bulan November', cat: 'cicilan', amount: 2500000 },
  { date: '2026-11-07', desc: 'Belanja mingguan + susu anak', cat: 'harian', amount: 512000 },
  { date: '2026-11-09', desc: 'Token listrik 500 kWh', cat: 'tagihan', amount: 685000 },
  { date: '2026-11-10', desc: 'Beli obat & vitamin keluarga', cat: 'kesehatan', amount: 185000 },
  { date: '2026-11-12', desc: 'Makan malam keluarga di luar', cat: 'hiburan', amount: 320000 },
  { date: '2026-11-14', desc: 'Belanja mingguan Pasar Ciroyom', cat: 'harian', amount: 498000 },
  { date: '2026-11-15', desc: 'Tagihan air PDAM', cat: 'tagihan', amount: 227000 },
  { date: '2026-11-17', desc: 'Bensin Pertalite 25 liter', cat: 'transport', amount: 250000 },
  { date: '2026-11-18', desc: 'Les matematika Raka', cat: 'pendidikan', amount: 450000 },
  { date: '2026-11-20', desc: 'Internet rumah bulan November', cat: 'tagihan', amount: 350000 },
  { date: '2026-11-21', desc: 'Belanja mingguan + buah', cat: 'harian', amount: 649000 },
  { date: '2026-11-22', desc: 'Nonton bioskop berempat', cat: 'hiburan', amount: 320000 },
  { date: '2026-11-24', desc: 'SPP Nia bulan November', cat: 'pendidikan', amount: 1050000 },
  { date: '2026-11-25', desc: 'Ongkos ojek online seminggu', cat: 'transport', amount: 435000 },
];

export const GOALS = [
  { id: 'g1', name: 'Dana pendidikan anak', target: 50000000, saved: 32500000, note: 'Untuk kuliah Raka dan Nia' },
  { id: 'g2', name: 'Liburan keluarga ke Yogyakarta', target: 15000000, saved: 9200000, note: 'Berangkat Juni 2027' },
  { id: 'g3', name: 'Dana darurat 6 bulan', target: 20000000, saved: 12750000, note: 'Cadangan bila penghasilan berhenti' },
  { id: 'g4', name: 'Motor baru', target: 18000000, saved: 6400000, note: 'Ganti motor lama tahun 2016' },
];

export const BILLS = [
  { id: 'b1', name: 'Cicilan KPR', due: 5, amount: 2500000, paid: true },
  { id: 'b2', name: 'Token listrik PLN', due: 10, amount: 685000, paid: true },
  { id: 'b3', name: 'Air PDAM', due: 15, amount: 227000, paid: true },
  { id: 'b4', name: 'Internet rumah', due: 20, amount: 350000, paid: true },
  { id: 'b5', name: 'BPJS Kesehatan', due: 25, amount: 150000, paid: false },
  { id: 'b6', name: 'SPP sekolah Nia', due: 28, amount: 1050000, paid: false },
  { id: 'b7', name: 'Iuran RT', due: 30, amount: 50000, paid: false },
];

// Tren 6 bulan terakhir: pemasukan dan pengeluaran (rupiah).
export const TREND = [
  { month: 'Jun 26', income: 12500000, spent: 10120000 },
  { month: 'Jul 26', income: 12500000, spent: 10840000 },
  { month: 'Agu 26', income: 13200000, spent: 11230000 },
  { month: 'Sep 26', income: 12500000, spent: 10670000 },
  { month: 'Okt 26', income: 12500000, spent: 10980000 },
  { month: 'Nov 26', income: 12500000, spent: 9217000 },
];

// ---- State (di memori; berubah saat pengguna menambah/menghapus/menandai) ----
export const state = {
  transactions: TRANSACTIONS.map((t) => ({ ...t })),
  goals: GOALS.map((g) => ({ ...g })),
  bills: BILLS.map((b) => ({ ...b })),
};

export function totalIncome() {
  return INCOME.reduce((s, i) => s + i.amount, 0);
}

export function totalBudget() {
  return CATEGORIES.reduce((s, c) => s + c.budget, 0);
}

export function spentByCategory(catId) {
  return state.transactions.filter((t) => t.cat === catId).reduce((s, t) => s + t.amount, 0);
}

export function totalSpent() {
  return state.transactions.reduce((s, t) => s + t.amount, 0);
}

export function categoryOf(catId) {
  return CATEGORIES.find((c) => c.id === catId);
}

export function unpaidBillsTotal() {
  return state.bills.filter((b) => !b.paid).reduce((s, b) => s + b.amount, 0);
}

export function formatRp(n) {
  return 'Rp ' + n.toLocaleString('id-ID');
}

export function formatDate(iso) {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}
