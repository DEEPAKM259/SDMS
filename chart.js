'use strict';

// Chart color palette
const COLORS = {
  primary: '#1a56db', secondary: '#0ea5e9', accent: '#06b6d4',
  success: '#10b981', warning: '#f59e0b', danger: '#ef4444', purple: '#8b5cf6',
  grid: 'rgba(100,116,139,0.15)', text: '#64748b',
};
const PALETTE = [COLORS.primary, COLORS.secondary, COLORS.accent, COLORS.success, COLORS.warning, COLORS.danger, COLORS.purple];

// Demo data for all charts
const DEMO = {
  stageDropout: {
    labels: ['Primary', 'Secondary', 'Higher Sec.', 'Higher Edu.'],
    rates: [8.2, 16.7, 22.4, 14.1],
    colors: [COLORS.success, COLORS.warning, COLORS.danger, COLORS.purple],
  },
  yearlyTrend: {
    labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
    primary: [12.1, 11.4, 10.8, 9.6, 8.9, 8.2],
    secondary: [22.3, 21.1, 20.4, 18.9, 17.5, 16.7],
    higherSec: [28.7, 27.2, 25.8, 24.6, 23.5, 22.4],
    higherEdu: [18.2, 17.5, 16.8, 15.9, 14.8, 14.1],
  },
  causes: {
    labels: ['Financial', 'Family', 'Academic', 'Social', 'Health', 'Other'],
    data: [34, 22, 18, 12, 8, 6],
  },
  interventionSuccess: {
    labels: ['Q1 2023', 'Q2 2023', 'Q3 2023', 'Q4 2023', 'Q1 2024', 'Q2 2024'],
    retention: [62, 67, 71, 74, 78, 82],
    counseling: [30, 38, 44, 51, 58, 65],
  },
  studentProgress: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    score: [72, 75, 68, 80, 83, 88],
    attendance: [85, 88, 80, 92, 90, 94],
  },
  adminOverview: {
    labels: ['Primary', 'Secondary', 'Higher Sec.', 'Higher Edu.'],
    total: [4200, 3800, 2600, 1900],
    atRisk: [420, 630, 580, 270],
    dropout: [340, 635, 582, 267],
  },
};

// Helpers
function getCtx(id) {
  const c = document.getElementById(id);
  return c ? c.getContext('2d') : null;
}
function gradient(ctx, canvas, color) {
  const g = ctx.createLinearGradient(0, 0, 0, canvas.height);
  g.addColorStop(0, color + 'aa'); g.addColorStop(1, color + '00');
  return g;
}

// Set Chart.js defaults
function setDefaults() {
  if (!window.Chart) return;
  Chart.defaults.font.family = "'Inter', sans-serif";
  Chart.defaults.font.size = 12;
  Chart.defaults.color = COLORS.text;
  Chart.defaults.plugins.legend.labels.usePointStyle = true;
}

// 1. Stage dropout bar chart (homepage)
function renderStageDropoutChart() {
  const ctx = getCtx('chart-stage-dropout');
  if (!ctx || !window.Chart) return;
  new Chart(ctx, {
    type: 'bar',
    data: { labels: DEMO.stageDropout.labels, datasets: [{ label: 'Dropout Rate (%)', data: DEMO.stageDropout.rates, backgroundColor: DEMO.stageDropout.colors, borderRadius: 10, borderSkipped: false }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { beginAtZero: true, max: 30, grid: { color: COLORS.grid }, ticks: { callback: v => v + '%' } } } }
  });
}

// 2. Yearly trend multi-line (homepage + admin)
function renderYearlyTrendChart(canvasId) {
  canvasId = canvasId || 'chart-yearly-trend';
  const ctx = getCtx(canvasId);
  const canvas = document.getElementById(canvasId);
  if (!ctx || !window.Chart) return;
  const mkDs = (label, data, color) => ({ label, data, borderColor: color, backgroundColor: gradient(ctx, canvas, color), fill: true, tension: 0.4, borderWidth: 2.5, pointRadius: 4, pointBackgroundColor: color });
  new Chart(ctx, {
    type: 'line',
    data: { labels: DEMO.yearlyTrend.labels, datasets: [
      mkDs('Primary', DEMO.yearlyTrend.primary, COLORS.success),
      mkDs('Secondary', DEMO.yearlyTrend.secondary, COLORS.warning),
      mkDs('Higher Sec.', DEMO.yearlyTrend.higherSec, COLORS.danger),
      mkDs('Higher Edu.', DEMO.yearlyTrend.higherEdu, COLORS.purple),
    ] },
    options: { responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false }, plugins: { legend: { position: 'bottom' } }, scales: { x: { grid: { display: false } }, y: { min: 5, max: 35, grid: { color: COLORS.grid }, ticks: { callback: v => v + '%' } } } }
  });
}

// 3. Causes doughnut
function renderCausesChart(canvasId) {
  canvasId = canvasId || 'chart-causes';
  const ctx = getCtx(canvasId);
  if (!ctx || !window.Chart) return;
  new Chart(ctx, {
    type: 'doughnut',
    data: { labels: DEMO.causes.labels, datasets: [{ data: DEMO.causes.data, backgroundColor: PALETTE, borderWidth: 3, borderColor: '#fff', hoverOffset: 8 }] },
    options: { responsive: true, maintainAspectRatio: false, cutout: '65%', plugins: { legend: { position: 'right' } } }
  });
}

// 4. Intervention success
function renderInterventionChart() {
  const ctx = getCtx('chart-intervention');
  const canvas = document.getElementById('chart-intervention');
  if (!ctx || !window.Chart) return;
  new Chart(ctx, {
    type: 'line',
    data: { labels: DEMO.interventionSuccess.labels, datasets: [
      { label: 'Retention Rate (%)', data: DEMO.interventionSuccess.retention, borderColor: COLORS.primary, backgroundColor: gradient(ctx, canvas, COLORS.primary), fill: true, tension: 0.4, borderWidth: 2.5, pointRadius: 5, pointBackgroundColor: COLORS.primary },
      { label: 'Counseling Reach (%)', data: DEMO.interventionSuccess.counseling, borderColor: COLORS.accent, backgroundColor: gradient(ctx, canvas, COLORS.accent), fill: true, tension: 0.4, borderWidth: 2.5, pointRadius: 5, pointBackgroundColor: COLORS.accent },
    ] },
    options: { responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false }, plugins: { legend: { position: 'bottom' } }, scales: { x: { grid: { display: false } }, y: { beginAtZero: true, max: 100, grid: { color: COLORS.grid }, ticks: { callback: v => v + '%' } } } }
  });
}

// 5. Student progress
function renderStudentProgressChart(canvasId) {
  canvasId = canvasId || 'chart-student-progress';
  const ctx = getCtx(canvasId);
  const canvas = document.getElementById(canvasId);
  if (!ctx || !window.Chart) return;
  new Chart(ctx, {
    type: 'line',
    data: { labels: DEMO.studentProgress.labels, datasets: [
      { label: 'Grade Score', data: DEMO.studentProgress.score, borderColor: COLORS.primary, backgroundColor: gradient(ctx, canvas, COLORS.primary), fill: true, tension: 0.4, borderWidth: 2.5, pointRadius: 5, pointBackgroundColor: COLORS.primary },
      { label: 'Attendance %', data: DEMO.studentProgress.attendance, borderColor: COLORS.success, backgroundColor: gradient(ctx, canvas, COLORS.success), fill: true, tension: 0.4, borderWidth: 2.5, pointRadius: 5, pointBackgroundColor: COLORS.success },
    ] },
    options: { responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false }, plugins: { legend: { position: 'bottom' } }, scales: { x: { grid: { display: false } }, y: { min: 50, max: 100, grid: { color: COLORS.grid } } } }
  });
}

// 6. Admin overview grouped bar
function renderAdminOverviewChart() {
  const ctx = getCtx('chart-admin-overview');
  if (!ctx || !window.Chart) return;
  new Chart(ctx, {
    type: 'bar',
    data: { labels: DEMO.adminOverview.labels, datasets: [
      { label: 'Total Students', data: DEMO.adminOverview.total, backgroundColor: COLORS.primary + 'cc', borderRadius: 6 },
      { label: 'At Risk', data: DEMO.adminOverview.atRisk, backgroundColor: COLORS.warning + 'cc', borderRadius: 6 },
      { label: 'Dropout', data: DEMO.adminOverview.dropout, backgroundColor: COLORS.danger + 'cc', borderRadius: 6 },
    ] },
    options: { responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false }, plugins: { legend: { position: 'bottom' } }, scales: { x: { grid: { display: false } }, y: { beginAtZero: true, grid: { color: COLORS.grid }, ticks: { callback: v => v >= 1000 ? (v/1000).toFixed(1) + 'k' : v } } } }
  });
}

// 7. Reusable stage panel chart
function renderStagePanelChart(canvasId, labels, data, color) {
  const ctx = getCtx(canvasId);
  if (!ctx || !window.Chart) return;
  new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets: [{ label: 'Dropout Trend', data, backgroundColor: color + 'cc', borderRadius: 8 }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { beginAtZero: true, grid: { color: COLORS.grid }, ticks: { callback: v => v + '%' } } } }
  });
}

// Initialize all charts on page load
function initAllCharts() {
  if (!window.Chart) { console.warn('Chart.js not loaded'); return; }
  setDefaults();
  renderStageDropoutChart();
  renderYearlyTrendChart();
  renderCausesChart();
  renderInterventionChart();
  renderStudentProgressChart();
  renderAdminOverviewChart();
  // Stage panel charts
  const years = ['2019','2020','2021','2022','2023','2024'];
  renderStagePanelChart('chart-primary', years, DEMO.yearlyTrend.primary, COLORS.success);
  renderStagePanelChart('chart-secondary', years, DEMO.yearlyTrend.secondary, COLORS.warning);
  renderStagePanelChart('chart-higher-sec', years, DEMO.yearlyTrend.higherSec, COLORS.danger);
  renderStagePanelChart('chart-higher-edu', years, DEMO.yearlyTrend.higherEdu, COLORS.purple);
}

document.addEventListener('DOMContentLoaded', initAllCharts);

window.SDMS_CHARTS = { initAllCharts, renderStudentProgressChart, renderAdminOverviewChart, renderYearlyTrendChart, renderCausesChart };
