/* ========================================
   GREEN CAFÉ – SCRIPT.JS
   ======================================== */

// --- Navbar scroll effect ---
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// --- Mobile hamburger menu ---
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  }
});

// --- Scroll fade-in animation (IntersectionObserver) ---
const fadeEls = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger siblings in the same parent
      const siblings = Array.from(entry.target.parentElement.querySelectorAll('.fade-in'));
      const index = siblings.indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, index * 100);
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

fadeEls.forEach(el => observer.observe(el));

// --- Active nav link highlight on scroll ---
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navAnchors.forEach(a => {
        a.style.color = '';
        if (a.getAttribute('href') === `#${id}`) {
          a.style.color = 'var(--gold)';
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// --- Gallery lightbox (simple) ---
const galleryItems = document.querySelectorAll('.gallery-item');

// Create lightbox elements
const lightbox = document.createElement('div');
lightbox.id = 'lightbox';
lightbox.innerHTML = `
  <div class="lb-backdrop"></div>
  <button class="lb-close" aria-label="Bezárás">&times;</button>
  <button class="lb-prev" aria-label="Előző">&#8592;</button>
  <button class="lb-next" aria-label="Következő">&#8594;</button>
  <div class="lb-img-wrap">
    <img src="" alt="" id="lb-img" />
  </div>
`;

const lbStyles = document.createElement('style');
lbStyles.textContent = `
  #lightbox {
    position: fixed; inset: 0; z-index: 999;
    display: flex; align-items: center; justify-content: center;
    opacity: 0; pointer-events: none;
    transition: opacity 0.3s ease;
  }
  #lightbox.active { opacity: 1; pointer-events: all; }
  .lb-backdrop {
    position: absolute; inset: 0;
    background: rgba(0,0,0,0.88);
    backdrop-filter: blur(6px);
  }
  .lb-img-wrap {
    position: relative; z-index: 2;
    max-width: 90vw; max-height: 88vh;
    border-radius: 12px; overflow: hidden;
    box-shadow: 0 24px 80px rgba(0,0,0,0.5);
    transform: scale(0.92);
    transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
  }
  #lightbox.active .lb-img-wrap { transform: scale(1); }
  #lb-img { max-width: 90vw; max-height: 88vh; object-fit: contain; display: block; }
  .lb-close, .lb-prev, .lb-next {
    position: absolute; z-index: 3;
    background: rgba(255,255,255,0.12);
    border: 1px solid rgba(255,255,255,0.2);
    color: #fff; cursor: pointer;
    border-radius: 50%;
    transition: background 0.2s;
    display: flex; align-items: center; justify-content: center;
  }
  .lb-close { top: 20px; right: 24px; width: 44px; height: 44px; font-size: 1.6rem; line-height: 1; }
  .lb-prev { left: 20px; top: 50%; transform: translateY(-50%); width: 48px; height: 48px; font-size: 1.3rem; }
  .lb-next { right: 20px; top: 50%; transform: translateY(-50%); width: 48px; height: 48px; font-size: 1.3rem; }
  .lb-close:hover, .lb-prev:hover, .lb-next:hover { background: rgba(200,146,58,0.7); }
`;

document.head.appendChild(lbStyles);
document.body.appendChild(lightbox);

const lbImg = document.getElementById('lb-img');
const lbClose = lightbox.querySelector('.lb-close');
const lbPrev = lightbox.querySelector('.lb-prev');
const lbNext = lightbox.querySelector('.lb-next');
const lbBackdrop = lightbox.querySelector('.lb-backdrop');

let currentIndex = 0;
const galleryImages = Array.from(galleryItems).map(item => ({
  src: item.querySelector('img').src,
  alt: item.querySelector('img').alt
}));

function openLightbox(index) {
  currentIndex = index;
  lbImg.src = galleryImages[index].src;
  lbImg.alt = galleryImages[index].alt;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

function showPrev() {
  currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
  lbImg.style.opacity = '0';
  setTimeout(() => {
    lbImg.src = galleryImages[currentIndex].src;
    lbImg.style.opacity = '1';
  }, 150);
}

function showNext() {
  currentIndex = (currentIndex + 1) % galleryImages.length;
  lbImg.style.opacity = '0';
  setTimeout(() => {
    lbImg.src = galleryImages[currentIndex].src;
    lbImg.style.opacity = '1';
  }, 150);
}

lbImg.style.transition = 'opacity 0.15s ease';

galleryItems.forEach((item, i) => {
  item.addEventListener('click', () => openLightbox(i));
});
lbClose.addEventListener('click', closeLightbox);
lbBackdrop.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click', showPrev);
lbNext.addEventListener('click', showNext);

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') showPrev();
  if (e.key === 'ArrowRight') showNext();
});

// --- Smooth scroll for anchor links ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 72;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
