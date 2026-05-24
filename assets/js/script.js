/* ========================================================
   1. SPACE CANVAS — STARS + VARIED SHOOTING STARS
======================================================== */
(function () {
  const canvas = document.getElementById('space-canvas');
  if (!canvas) return;
  const ctx    = canvas.getContext('2d');
  let stars         = [];
  let shootingStars = [];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Static twinkling stars
  for (let i = 0; i < 260; i++) {
    stars.push({
      x:      Math.random() * canvas.width,
      y:      Math.random() * canvas.height,
      radius: Math.random() * 1.5,
      alpha:  Math.random(),
      speed:  (Math.random() * 0.015) + 0.005
    });
  }

  function spawnShootingStar() {
    const dirOptions = ['ltr', 'rtl', 'ltr2', 'rtl2'];
    const dir = dirOptions[Math.floor(Math.random() * dirOptions.length)];

    let x, y, angle;
    const speed  = 4 + Math.random() * 4;
    const length = 150 + Math.random() * 150;

    if (dir === 'ltr') {
      angle = Math.PI / 4 + (Math.random() * 0.15 - 0.075);
      x = Math.random() * canvas.width * 0.5;
      y = -30 - Math.random() * 80;
    } else if (dir === 'rtl') {
      angle = (3 * Math.PI / 4) + (Math.random() * 0.15 - 0.075);
      x = canvas.width * 0.5 + Math.random() * canvas.width * 0.5;
      y = -30 - Math.random() * 80;
    } else if (dir === 'ltr2') {
      angle = Math.PI / 6 + (Math.random() * 0.1 - 0.05);
      x = -50 - Math.random() * 100;
      y = Math.random() * canvas.height * 0.5;
    } else {
      angle = (5 * Math.PI / 6) + (Math.random() * 0.1 - 0.05);
      x = canvas.width + 50 + Math.random() * 100;
      y = Math.random() * canvas.height * 0.5;
    }

    const tints = [
      [255, 120, 60],
      [255, 80, 40],
      [255, 150, 70],
      [255, 190, 100]
    ];
    const tint = tints[Math.floor(Math.random() * tints.length)];

    shootingStars.push({ x, y, angle, speed, length, opacity: 1,
      thickness: 1.2 + Math.random() * 1.5, tint });
  }

  function drawSpace() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stars.forEach(star => {
      star.alpha += star.speed;
      if (star.alpha > 1 || star.alpha < 0.1) star.speed *= -1;
      ctx.globalAlpha = Math.abs(star.alpha);
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    if (Math.random() < 0.015 && shootingStars.length < 3) {
      spawnShootingStar();
    }

    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const s = shootingStars[i];
      const [r, g, b] = s.tint;

      const tailX = s.x - Math.cos(s.angle) * s.length;
      const tailY = s.y - Math.sin(s.angle) * s.length;

      const grad = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
      grad.addColorStop(0,   `rgba(255, 240, 220, ${s.opacity})`);
      grad.addColorStop(0.1, `rgba(${r},${g},${b},${s.opacity * 0.8})`);
      grad.addColorStop(0.4, `rgba(${r},${g},${b},${s.opacity * 0.2})`);
      grad.addColorStop(1,   `rgba(${r},${g},${b},0)`);

      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(tailX, tailY);
      ctx.strokeStyle = grad;
      ctx.lineWidth   = s.thickness;
      ctx.lineCap     = 'round';
      ctx.shadowBlur  = 8;
      ctx.shadowColor = `rgb(${r},${g},${b})`;
      ctx.stroke();
      ctx.shadowBlur  = 0;

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.thickness * 1.2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 240, 220, ${s.opacity})`;
      ctx.shadowBlur  = 10;
      ctx.shadowColor = `rgb(${r},${g},${b})`;
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.thickness * 2.0, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${s.opacity * 0.5})`;
      ctx.shadowBlur  = 0;
      ctx.fill();

      s.x      += Math.cos(s.angle) * s.speed;
      s.y      += Math.sin(s.angle) * s.speed;
      s.opacity -= 0.012;

      const oob = s.x < -300 || s.x > canvas.width + 300 || s.y > canvas.height + 200;
      if (s.opacity <= 0 || oob) shootingStars.splice(i, 1);
    }

    requestAnimationFrame(drawSpace);
  }
  drawSpace();
})();

/* ========================================================
   2. SCROLL REVEAL
======================================================== */
window.initScrollReveal = function () {
  const revealEls = document.querySelectorAll('.reveal');
  const observer  = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  revealEls.forEach(el => observer.observe(el));
};
initScrollReveal();

/* ========================================================
   3. LIGHTBOX
======================================================== */
(function () {
  const lightbox        = document.getElementById('lightbox');
  const lightboxImg     = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose   = document.getElementById('lightboxClose');
  const triggers        = document.querySelectorAll('.lightbox-trigger');

  window.openLightbox = function (src, caption) {
    if (!lightboxImg || !lightbox) return;
    lightboxImg.src = src;
    lightboxCaption.textContent = caption || '';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.closeLightbox = function () {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => { if (lightboxImg) lightboxImg.src = ''; }, 300);
  };

  triggers.forEach(t => {
    t.addEventListener('click', () => {
      openLightbox(t.getAttribute('data-src') || t.querySelector('img').src, t.getAttribute('data-caption'));
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  }
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
})();

/* ========================================================
   4. CAROUSEL
======================================================== */
(function () {
  const track    = document.getElementById('carousel2');
  const prevBtn  = document.getElementById('prevBtn');
  const nextBtn  = document.getElementById('nextBtn');
  if (!track || !prevBtn || !nextBtn) return;
  const scrollAmount = 260;
  nextBtn.addEventListener('click', () => track.scrollBy({ left:  scrollAmount, behavior: 'smooth' }));
  prevBtn.addEventListener('click', () => track.scrollBy({ left: -scrollAmount, behavior: 'smooth' }));
})();

/* ========================================================
   5. MUSIC PLAYER
======================================================== */
(function () {
  const bgMusic = document.getElementById('bg-music');
  const musicToggle = document.getElementById('musicToggle');
  if (!bgMusic || !musicToggle) return;
  let isMusicPlaying = false;

  function toggleMusic() {
    if (isMusicPlaying) {
      bgMusic.pause();
      musicToggle.classList.remove('playing');
    } else {
      bgMusic.play().catch(e => console.log('Autoplay blocked', e));
      musicToggle.classList.add('playing');
    }
    isMusicPlaying = !isMusicPlaying;
  }

  window.playMusic = function() {
    if (!isMusicPlaying) toggleMusic();
  };

  musicToggle.addEventListener('click', toggleMusic);
})();

/* ========================================================
   6. WELCOME SCREEN + STAR CANVAS
======================================================== */
(function () {
  const welcomeScreen = document.getElementById('welcome-screen');
  const openGiftBtn = document.getElementById('open-gift-btn');
  const starCanvas = document.getElementById('welcome-stars');
  if (!welcomeScreen || !openGiftBtn) return;

  // Disable scrolling while welcome screen is active
  document.body.style.overflow = 'hidden';

  // Mini star field for welcome screen
  let animating = true;
  if (starCanvas) {
    const ctx = starCanvas.getContext('2d');
    const stars = [];

    function resizeStarCanvas() {
      starCanvas.width = window.innerWidth;
      starCanvas.height = window.innerHeight;
    }
    resizeStarCanvas();
    window.addEventListener('resize', resizeStarCanvas);

    for (let i = 0; i < 150; i++) {
      stars.push({
        x: Math.random() * starCanvas.width,
        y: Math.random() * starCanvas.height,
        radius: Math.random() * 1.3,
        alpha: Math.random(),
        speed: (Math.random() * 0.01) + 0.003
      });
    }

    function drawStars() {
      if (!animating) return;
      ctx.clearRect(0, 0, starCanvas.width, starCanvas.height);
      stars.forEach(star => {
        star.alpha += star.speed;
        if (star.alpha > 1 || star.alpha < 0.1) star.speed *= -1;
        ctx.globalAlpha = Math.abs(star.alpha);
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      requestAnimationFrame(drawStars);
    }
    drawStars();
  }

  openGiftBtn.addEventListener('click', () => {
    // Start music
    if (typeof window.playMusic === 'function') {
      window.playMusic();
    }
    // Hide overlay and restore scrolling
    welcomeScreen.classList.add('hidden');
    document.body.style.overflow = '';
    // Stop welcome star animation after transition
    setTimeout(() => { animating = false; }, 1500);
  });
})();
