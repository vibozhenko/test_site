/* =========================================================
   Кофейный котик — основной скрипт
   ========================================================= */

// Убираем класс no-js, добавляемый в <html> для корректного
// отображения reveal-блоков до инициализации наблюдателя.
document.documentElement.classList.remove('no-js');

(function () {
  'use strict';

  /* ---------- Навбар: тень при скролле ---------- */
  const navbar = document.getElementById('navbar');
  let ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      navbar.classList.toggle('scrolled', window.scrollY > 24);
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Бургер-меню ---------- */
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('navLinks');

  function toggleMenu(force) {
    // Если force не передан — инвертируем текущее состояние,
    // иначе применяем явное значение (закрыть по клику/событию).
    const isOpen =
      force !== undefined ? force : burger.getAttribute('aria-expanded') !== 'true';
    burger.classList.toggle('active', isOpen);
    navLinks.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
    // Сообщаем скринридерам о состоянии меню
    navLinks.setAttribute('aria-hidden', String(!isOpen));
  }

  burger.addEventListener('click', () => {
    toggleMenu();
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // Закрытие по Escape и клику вне меню (только на мобильных)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      toggleMenu(false);
      burger.focus();
    }
  });

  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('open') &&
        !navLinks.contains(e.target) &&
        !burger.contains(e.target)) {
      toggleMenu(false);
    }
  });

  /* ---------- Переключение темы ---------- */
  const themeToggle = document.getElementById('themeToggle');

  // Читаем сохранённое значение или полагаемся на prefers-color-scheme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark' || savedTheme === 'light') {
    document.documentElement.setAttribute('data-theme', savedTheme);
  }

  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    themeToggle.setAttribute('aria-label', next === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему');
  });

  /* ---------- Анимация появления при скролле ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    // Fallback: если нет поддержки — показываем всё сразу
    revealEls.forEach((el) => el.classList.add('visible'));
  }

  /* ---------- Активные ссылки навигации ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = navLinks.querySelectorAll('a[href^="#"]');

  if ('IntersectionObserver' in window && sections.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navAnchors.forEach((a) => {
              a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`);
            });
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    sections.forEach((s) => spy.observe(s));
  }
})();