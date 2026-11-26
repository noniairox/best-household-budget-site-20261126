// Router hash DompetKeluarga: lima halaman, masing-masing bisa dibuka lewat tautan.
// render() memasang HTML halaman lalu memanggil wire() halaman itu.
import { viewDashboard, viewBudget, viewGoals, viewBills, viewReport, wire } from './views.js';

const ROUTES = {
  '': { title: 'Dasbor', render: viewDashboard },
  anggaran: { title: 'Perencana anggaran', render: viewBudget },
  tabungan: { title: 'Tujuan tabungan', render: viewGoals },
  tagihan: { title: 'Kalender tagihan', render: viewBills },
  laporan: { title: 'Laporan', render: viewReport },
};

const app = document.getElementById('app');

function render() {
  const raw = location.hash.replace(/^#\/?/, '').split('/')[0];
  const route = ROUTES[raw] ? raw : '';
  const page = ROUTES[route];
  document.title = page.title + ' — DompetKeluarga';
  app.innerHTML = page.render();
  document.querySelectorAll('nav a').forEach((a) => {
    a.classList.toggle('active', a.dataset.route === route);
  });
  wire(route, render);
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', render);
render();
