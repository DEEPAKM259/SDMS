'use strict';

// API config - points to Flask backend
const API_BASE = 'http://localhost:5000/api';
const STUDENT_STORAGE_KEY = 'sdms_students';
const DEFAULT_STUDENTS = [
  {id:'SDMS-001',name:'Rohit Verma',stage:'Secondary',cls:'10-B',att:'72%',grade:'C',status:'at-risk',email:'rohit@school.edu',marks:{math:58,science:62,english:54,social:60,hindi:57}},
  {id:'SDMS-002',name:'Priya Nair',stage:'Higher Sec.',cls:'12-A',att:'81%',grade:'B',status:'at-risk',email:'priya@school.edu',marks:{math:76,science:80,english:74,social:78,hindi:72}},
  {id:'SDMS-003',name:'Aman Gupta',stage:'Primary',cls:'8-C',att:'70%',grade:'D',status:'at-risk',email:'aman@school.edu',marks:{math:48,science:52,english:50,social:46,hindi:45}},
  {id:'SDMS-004',name:'Kavya Iyer',stage:'Higher Edu.',cls:'B.Sc 3rd',att:'93%',grade:'A',status:'active',email:'kavya@school.edu',marks:{math:90,science:92,english:88,social:87,hindi:85}},
  {id:'SDMS-005',name:'Dev Patel',stage:'Secondary',cls:'9-A',att:'85%',grade:'B+',status:'active',email:'dev@school.edu',marks:{math:82,science:84,english:80,social:79,hindi:78}},
  {id:'SDMS-006',name:'Sneha Das',stage:'Higher Sec.',cls:'11-B',att:'78%',grade:'C+',status:'at-risk',email:'sneha@school.edu',marks:{math:66,science:65,english:68,social:70,hindi:64}},
  {id:'SDMS-007',name:'Mohan Lal',stage:'Primary',cls:'7-A',att:'65%',grade:'D',status:'dropout',email:'mohan@school.edu',marks:{math:35,science:40,english:38,social:36,hindi:34}},
  {id:'SDMS-008',name:'Anjali Singh',stage:'Higher Edu.',cls:'M.Tech 1st',att:'96%',grade:'A+',status:'active',email:'anjali@school.edu',marks:{math:95,science:94,english:93,social:96,hindi:92}}
];

function getStudents() {
  try {
    const stored = localStorage.getItem(STUDENT_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length) return parsed;
    }
  } catch (err) {
    console.warn('Unable to read stored students:', err);
  }
  saveStudents(DEFAULT_STUDENTS.map(student => ({ ...student })));
  return DEFAULT_STUDENTS.map(student => ({ ...student }));
}

function saveStudents(students) {
  localStorage.setItem(STUDENT_STORAGE_KEY, JSON.stringify(students));
}

function getStudentByUser(user) {
  const students = getStudents();
  const email = (user?.email || '').toLowerCase();
  const name = (user?.name || '').toLowerCase();
  return students.find(student => (student.email && student.email.toLowerCase() === email) || student.name.toLowerCase() === name || student.id === user?.studentId) || null;
}

function ensureStudentProfile(user) {
  const existing = getStudentByUser(user);
  if (existing) return existing;
  const students = getStudents();
  const newStudent = {
    id: 'SDMS-' + String(students.length + 1).padStart(3, '0'),
    name: user?.name || 'Student',
    stage: 'Higher Secondary',
    cls: '11-A',
    att: '85%',
    grade: 'B',
    status: 'active',
    email: user?.email || '',
    marks: { math: 80, english: 82, physics: 78 }
  };
  students.push(newStudent);
  saveStudents(students);
  return newStudent;
}

function getSubjectOptions(stage = '') {
  const normalized = (stage || '').toLowerCase();
  if (normalized.includes('higher education') || normalized.includes('higher edu')) return [
    { key: 'math', label: 'Mathematics' },
    { key: 'english', label: 'English' },
    { key: 'physics', label: 'Physics' }
  ];
  if (normalized.includes('higher secondary') || normalized.includes('higher sec')) return [
    { key: 'math', label: 'Mathematics' },
    { key: 'english', label: 'English' },
    { key: 'physics', label: 'Physics' },
    { key: 'cs', label: 'Computer Science' },
    { key: 'bio', label: 'Biology' },
    { key: 'tamil', label: 'Tamil' }
  ];
  return [
    { key: 'math', label: 'Mathematics' },
    { key: 'science', label: 'Science' },
    { key: 'english', label: 'English' },
    { key: 'social', label: 'Social Studies' },
    { key: 'hindi', label: 'Hindi' }
  ];
}

// Simple fetch wrapper that adds JWT token from localStorage
const api = {
  async request(method, endpoint, body = null) {
    const token = localStorage.getItem('sdms_token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = 'Bearer ' + token;
    try {
      const res = await fetch(API_BASE + endpoint, { method, headers, body: body ? JSON.stringify(body) : null });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'HTTP ' + res.status);
      return data;
    } catch (err) {
      console.warn('API unavailable, using demo mode:', err.message);
      return null;
    }
  },
  get:    (ep)       => api.request('GET', ep),
  post:   (ep, body) => api.request('POST', ep, body),
  put:    (ep, body) => api.request('PUT', ep, body),
  delete: (ep)       => api.request('DELETE', ep),
};

// Auth helper - manages login state in localStorage
const Auth = {
  save(token, role, user) {
    localStorage.setItem('sdms_token', token);
    localStorage.setItem('sdms_role', role);
    localStorage.setItem('sdms_user', JSON.stringify(user));
  },
  clear() {
    localStorage.removeItem('sdms_token');
    localStorage.removeItem('sdms_role');
    localStorage.removeItem('sdms_user');
  },
  getRole()  { return localStorage.getItem('sdms_role'); },
  getUser()  { return JSON.parse(localStorage.getItem('sdms_user') || 'null'); },
  isLogged() { return !!localStorage.getItem('sdms_token'); },
  redirect() {
    const role = Auth.getRole();
    if (role === 'admin' || role === 'mentor') window.location.href = 'admin_dashboard.html';
    else if (role === 'student') window.location.href = 'student_dashboard.html';
  },
};

// Toast notifications
function showToast(message, type = 'info', duration = 3500) {
  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = 'toast ' + type;
  toast.innerHTML = '<span>' + (icons[type] || icons.info) + '</span><span>' + message + '</span>';
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(40px)';
    toast.style.transition = 'all .3s';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// Modal helpers
function openModal(id) { document.getElementById(id)?.classList.add('open'); }
function closeModal(id) { document.getElementById(id)?.classList.remove('open'); }

// Close modal on overlay click or close button
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) e.target.classList.remove('open');
  if (e.target.classList.contains('modal-close')) e.target.closest('.modal-overlay')?.classList.remove('open');
});

// Navbar scroll effect + hamburger
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });
  // trigger on load
  navbar.classList.toggle('scrolled', window.scrollY > 30);

  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileClose = document.getElementById('mobile-nav-close');
  hamburger?.addEventListener('click', () => mobileNav?.classList.toggle('open'));
  mobileClose?.addEventListener('click', () => mobileNav?.classList.remove('open'));

  // Active nav link based on scroll position
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + id));
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => obs.observe(s));
}

// Stage tab switching
function initStageTabs() {
  const tabs = document.querySelectorAll('.stage-tab');
  const panels = document.querySelectorAll('.stage-panel');
  if (!tabs.length) return;
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('panel-' + tab.dataset.tab)?.classList.add('active');
    });
  });
}

// Scroll-triggered animations
function initScrollAnimations() {
  const els = document.querySelectorAll('.fade-up, .fade-in');
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => obs.observe(el));
}

// Animated number counters
function animateCounter(el) {
  const target = parseFloat(el.dataset.target || el.textContent);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
  const duration = 2000;
  const start = performance.now();
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 4);
    el.textContent = prefix + (target * ease).toFixed(decimals) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function initCounters() {
  const els = document.querySelectorAll('.count-up');
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { animateCounter(e.target); obs.unobserve(e.target); }
    });
  }, { threshold: 0.5 });
  els.forEach(el => obs.observe(el));
}

// Sidebar navigation for dashboard pages
function initSidebar() {
  const links = document.querySelectorAll('.sidebar-link[data-page]');
  const pages = document.querySelectorAll('.dash-page');
  const topbarTitle = document.getElementById('page-title');
  const toggleBtn = document.getElementById('sidebar-toggle');
  const sidebar = document.querySelector('.sidebar');
  if (!links.length) return;

  function activatePage(pageId) {
    pages.forEach(p => p.classList.remove('active'));
    links.forEach(l => l.classList.remove('active'));
    document.getElementById('page-' + pageId)?.classList.add('active');
    const link = document.querySelector('.sidebar-link[data-page="' + pageId + '"]');
    if (link) {
      link.classList.add('active');
      if (topbarTitle) topbarTitle.textContent = link.querySelector('.link-label')?.textContent || '';
    }
  }

  links.forEach(link => {
    link.addEventListener('click', () => {
      activatePage(link.dataset.page);
      sidebar?.classList.remove('open');
    });
  });

  toggleBtn?.addEventListener('click', () => sidebar?.classList.toggle('open'));

  // Activate first page by default
  if (links[0]) activatePage(links[0].dataset.page);

  // Fill in user info
  const user = Auth.getUser();
  if (user) {
    document.querySelectorAll('.user-name').forEach(el => el.textContent = user.name || 'User');
    document.querySelectorAll('.user-role').forEach(el => el.textContent = user.role || '');
    document.querySelectorAll('.user-avatar').forEach(el => el.textContent = (user.name || 'U')[0].toUpperCase());
  }
}

// Logout
function initLogout() {
  document.querySelectorAll('[data-logout]').forEach(btn => {
    btn.addEventListener('click', () => {
      Auth.clear();
      window.location.href = 'index.html';
    });
  });
}

// Hero dashboard preview bars
function initHeroBars() {
  const bars = document.querySelectorAll('.dp-bar');
  const heights = [35, 60, 45, 80, 55, 70, 90, 65, 50, 75];
  bars.forEach((bar, i) => { bar.style.height = heights[i % heights.length] + '%'; });
}

// File upload drag & drop
function initUploadZones() {
  document.querySelectorAll('.upload-zone').forEach(zone => {
    zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('dragover'); });
    zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
    zone.addEventListener('drop', e => {
      e.preventDefault(); zone.classList.remove('dragover');
      if (e.dataTransfer?.files?.length) handleUpload(e.dataTransfer.files, zone);
    });
    zone.addEventListener('click', () => {
      const input = document.createElement('input');
      input.type = 'file'; input.accept = '.pdf,.doc,.docx,.xls,.xlsx,.csv'; input.multiple = true;
      input.onchange = () => handleUpload(input.files, zone);
      input.click();
    });
  });
}

async function handleUpload(files, zone) {
  for (const file of files) {
    showToast('Uploading "' + file.name + '"...', 'info', 2000);
    await new Promise(r => setTimeout(r, 1000));
    showToast('"' + file.name + '" uploaded (demo mode)', 'success');
  }
}

// Login form handler
function initLoginForm() {
  const form = document.getElementById('login-form');
  if (!form) return;
  const role = form.dataset.role || 'student';

  // Password visibility toggle
  document.querySelectorAll('.toggle-password').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.closest('.input-group')?.querySelector('input');
      if (!input) return;
      input.type = input.type === 'password' ? 'text' : 'password';
      btn.textContent = input.type === 'password' ? '👁️' : '🙈';
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    const email = form.querySelector('#email')?.value.trim();
    const password = form.querySelector('#password')?.value;
    if (!email || !password) { showToast('Please fill in all fields.', 'error'); return; }

    btn.innerHTML = '<span class="spinner"></span> Signing in...';
    btn.disabled = true;

    // Try real backend first
    const res = await api.post('/auth/login', { email, password, role: form.dataset.role || role });
    if (res && res.token) {
      const loginName = (res.user?.name || form.querySelector('#name')?.value || email.split('@')[0]).trim();
      const loginUser = { ...res.user, name: loginName, email, role: res.role || (form.dataset.role || role) };
      if ((form.dataset.role || role) === 'student') {
        const student = ensureStudentProfile(loginUser);
        loginUser.studentId = student.id;
        loginUser.stage = student.stage;
        loginUser.cls = student.cls;
      }
      Auth.save(res.token, res.role || (form.dataset.role || role), loginUser);
      showToast('Welcome back, ' + loginName + '!', 'success');
      setTimeout(() => Auth.redirect(), 800);
    } else {
      // Demo mode - accept any credentials
      const nameInput = form.querySelector('#name')?.value.trim();
      const name = (nameInput || email.split('@')[0]).replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      const demoRole = form.dataset.role || role;
      const demoUser = { name, email, role: demoRole };
      if (demoRole === 'student') {
        const student = ensureStudentProfile(demoUser);
        demoUser.studentId = student.id;
        demoUser.stage = student.stage;
        demoUser.cls = student.cls;
      }
      Auth.save('demo_' + Date.now(), demoRole, demoUser);
      showToast('Demo login! Welcome, ' + name + '.', 'success');
      setTimeout(() => Auth.redirect(), 800);
    }

    btn.textContent = 'Sign In';
    btn.disabled = false;
  });
}

// Smooth scroll for anchor links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const el = document.getElementById(a.getAttribute('href').slice(1));
      if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });
}

// Run everything on page load
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initStageTabs();
  initScrollAnimations();
  initCounters();
  initSidebar();
  initLogout();
  initHeroBars();
  initUploadZones();
  initLoginForm();
  initSmoothScroll();
});

// Export for use in other scripts
window.SDMS = { api, Auth, showToast, openModal, closeModal, getStudents, saveStudents, getStudentByUser, ensureStudentProfile, getSubjectOptions };
