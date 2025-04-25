// ==== Initialize Splitting for Text Animation ====
document.addEventListener('DOMContentLoaded', function() {
  Splitting();
  // Initialize animations when DOM is loaded
  initScrollAnimations();
  
  // Initialize skill tabs and make them clickable
  initSkillTabs();
  
  // Tambahkan style untuk preloader yang lebih keren
  addPreloaderStyles();
  
  // Tambahkan style untuk highlight nama di halaman
  const highlightStyle = document.createElement('style');
  highlightStyle.textContent = `
    /* Style untuk nama di halaman utama */
    .accent-text {
      background: var(--gradient-primary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      position: relative;
      display: inline-block;
      padding: 0 5px;
      font-weight: 800;
    }
    
    .accent-text::after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 0;
      width: 100%;
      height: 3px;
      background: var(--gradient-primary);
      border-radius: 2px;
      transform: scaleX(0);
      transform-origin: right;
      transition: transform 0.8s cubic-bezier(0.19, 1, 0.22, 1);
    }
    
    /* Animasi untuk hero section */
    .hero-section .accent-text {
      animation: pulse-light 2s infinite;
    }
    
    @keyframes pulse-light {
      0%, 100% {
        text-shadow: 0 0 15px rgba(108, 99, 255, 0.4);
      }
      50% {
        text-shadow: 0 0 25px rgba(108, 99, 255, 0.7);
      }
    }
    
    /* Efek hover untuk konten Hero */
    .hero-title:hover .accent-text::after {
      transform: scaleX(1);
      transform-origin: left;
    }
    
    /* Animasi tambahan untuk hero title */
    .hero-title {
      position: relative;
      display: inline-block;
    }
    
    .hero-content {
      position: relative;
    }
    
    .hero-content::before {
      content: '';
      position: absolute;
      top: -50px;
      left: -50px;
      width: 100px;
      height: 100px;
      background: radial-gradient(circle, rgba(108, 99, 255, 0.2), transparent 70%);
      border-radius: 50%;
      filter: blur(15px);
      opacity: 0;
      animation: float-in 1.5s forwards 1s;
      z-index: -1;
    }
    
    @keyframes float-in {
      0% {
        opacity: 0;
        transform: translateY(30px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  
  document.head.appendChild(highlightStyle);
  
  // Tambahkan style untuk perbaikan spacing
  const spacingStyle = document.createElement('style');
  spacingStyle.textContent = `
    /* Perbaikan spacing untuk hero section */
    .hero-section {
      padding-top: 3rem; /* Tambahkan padding top */
    }
    
    /* Spacing khusus untuk desktop */
    @media (min-width: 992px) {
      .portfolio-heading {
        margin-bottom: 2rem;
      }
      
      /* Tambahkan styling untuk heading Portfolio */
      .portfolio-heading h2 {
        font-size: 6rem;
        letter-spacing: 0.5rem;
        text-transform: uppercase;
        opacity: 0.9;
        padding-top: 2rem;
      }
      
      /* Pastikan konten hero tidak menabrak */
      .hero-content {
        margin-top: 8rem;
        padding-top: 2rem;
      }
      
      /* Gradient background untuk memperjelas perbedaan area */
      .hero-title {
        margin-top: 3rem;
        position: relative;
        z-index: 2;
      }
      
      /* Buat jarak yang lebih baik untuk teks utama */
      .hero-section h1 {
        margin-bottom: 2rem;
        font-size: calc(3rem + 2vw);
      }
      
      /* Pastikan scroll indicator tetap terlihat */
      .scroll-indicator {
        bottom: 4rem;
      }
    }
    
    /* Spacing untuk mobile */
    @media (max-width: 991px) {
      .hero-section {
        padding-top: 6rem;
      }
      
      .portfolio-heading h2 {
        font-size: 3.5rem;
        letter-spacing: 0.3rem;
      }
      
      .hero-content {
        margin-top: 3rem;
      }
      
      .hero-section h1 {
        margin-top: 2rem;
      }
    }
    
    /* Penyesuaian khusus untuk tampilan pada screenshot */
    .portfolio-heading h2 {
      background: var(--gradient-primary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-weight: 900;
      letter-spacing: 0.5rem;
      text-transform: uppercase;
    }
    
    /* Tambahan efek visual untuk mencegah text bertabrakan */
    .hero-section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(108, 99, 255, 0.3), transparent);
      z-index: 1;
      opacity: 0.5;
    }
  `;
  
  document.head.appendChild(spacingStyle);
});

// ==== Loader & Preloader Animation ====
const loaderContainer = document.querySelector('.loader-container');
const preloader = document.querySelector('.preloader');
const progressBar = document.querySelector('.loading-progress') || document.querySelector('.progress-bar');
const progressText = document.querySelector('.progress-text');
const counterElement = document.querySelector('.counter');

let progress = 0;
let resources = 0;
const totalResources = 10; // Jumlah resource yang perlu dimuat

// Setup Lottie animation if available
let logoAnimation;
try {
  logoAnimation = lottie.loadAnimation({
    container: document.getElementById('logo-animation'),
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: 'https://assets9.lottiefiles.com/packages/lf20_rlz4g1pd.json' // Animasi developer coding
  });
} catch (error) {
  console.log('Lottie animation not available');
}

// Tambah elemen introduksi tentang diri
function createIntroduction() {
  const introContainer = document.createElement('div');
  introContainer.className = 'intro-container';
  
  const introText = document.createElement('div');
  introText.className = 'intro-text';
  introText.innerHTML = `
    <h2 class="intro-greeting">Sedang Memuat...</h2>
    <p class="intro-summary">Mohon tunggu sebentar, website sedang dipersiapkan untuk Anda.</p>
  `;
  
  introContainer.appendChild(introText);
  
  // Tambahkan ke preloader
  const preloaderContent = document.querySelector('.preloader-content');
  if (preloaderContent) {
    preloaderContent.appendChild(introContainer);
  }
  
  return introText;
}

function simulateLoading() {
  // Buat elemen introduksi
  const introText = createIntroduction();
  
  // Tambah efek typing untuk introduksi
  const introTextElements = introText.querySelectorAll('h2, h3, p');
  let introDelay = 0;
  
  introTextElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    
    // Tampilkan teks loading langsung tanpa delay
    setTimeout(() => {
      element.style.transition = 'all 0.5s ease';
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }, 100);
  });
  
  // Percepat loading agar tidak terlalu lama tapi tetap bisa lihat animasi
  const interval = setInterval(() => {
    if (progress >= 100) {
      clearInterval(interval);
      
      // Transisi langsung ke website tanpa menunggu perkenalan
      setTimeout(() => {
        if (loaderContainer) {
          loaderContainer.style.opacity = '0';
          loaderContainer.style.visibility = 'hidden';
        }
        if (preloader) {
          if (logoAnimation) logoAnimation.pause();
          
          // Transisi yang lebih menarik dengan efek slide
          gsap.to(preloader, {
            opacity: 0,
            y: -100, // Slide ke atas
            duration: 0.7,
            ease: 'power2.out',
            onComplete: () => {
              preloader.style.display = 'none';
            }
          });
        }
        
        // Start initial animations dengan delay agar terasa bertahap
        setTimeout(() => animateHomeElements(), 200);
        setTimeout(() => initHeaderAnimation(), 400);
        setTimeout(() => initSplittingAnimation(), 600);
      }, 500); // Waktu ditunggu diperpendek dari 2500ms menjadi 500ms
      
      return;
    }
    
    // Percepat increment progress dan buat lebih smooth
    const increment = Math.floor(Math.random() * 12) + 5; // Lebih cepat
    progress += increment;
    if (progress > 100) progress = 100;
    
    // Update UI dengan animasi
    if (progressText) {
      progressText.textContent = `${progress}%`;
      // Tambahkan animasi pulse setiap kenaikan signifikan
      if (increment > 7) {
        progressText.classList.add('pulse');
        setTimeout(() => progressText.classList.remove('pulse'), 300);
      }
    }
    
    if (counterElement) counterElement.textContent = `${progress}%`;
    
    if (progressBar) {
      // Tambahkan transisi mulus untuk progress bar
      progressBar.style.transition = 'width 0.2s ease-out';
      
      if (progressBar.style.setProperty) {
        progressBar.style.setProperty('--progress', `${progress}%`);
      } else if (progressBar.style.width !== undefined) {
        progressBar.style.width = `${progress}%`;
      }
      
      // Ubah warna progress bar berdasarkan progress
      if (progress > 75) {
        progressBar.style.background = 'linear-gradient(90deg, #6c63ff, #00ffa3)';
      } else if (progress > 45) {
        progressBar.style.background = 'linear-gradient(90deg, #6c63ff, #ff3c78)';
      }
    }
  }, 70); // Interval lebih cepat
}

// Tambahkan style untuk introduksi dan animasi baru
const introStyle = document.createElement('style');
introStyle.textContent = `
  .intro-container {
    margin-top: 3rem;
    text-align: center;
    max-width: 60rem;
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInUp 0.8s forwards;
    animation-delay: 0.5s;
  }
  
  .intro-greeting {
    font-size: 3.2rem;
    font-weight: 700;
    margin-bottom: 1rem;
  }
  
  .intro-role {
    font-size: 2rem;
    font-weight: 500;
    color: var(--text-color-light);
    margin-bottom: 1.5rem;
  }
  
  .intro-summary {
    font-size: 1.6rem;
    line-height: 1.6;
    color: var(--text-color-light);
  }
  
  .accent-text {
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  .pulse {
    animation: pulse 0.4s cubic-bezier(0.5, 0, 0.5, 1);
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }
  
  /* Tambahan animasi untuk loading bar */
  .loading-progress {
    position: relative;
    overflow: hidden;
  }
  
  .loading-progress::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 100px;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    animation: shimmerEffect 1.5s infinite;
  }
  
  @keyframes shimmerEffect {
    0% {
      transform: translateX(-150%);
    }
    100% {
      transform: translateX(150%);
    }
  }
`;

document.head.appendChild(introStyle);

// Simulasi proses loading
window.addEventListener('load', () => {
  simulateLoading();
});

// ==== Background Animation with Three.js ====
function createBackground() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 30;

  // Particle material
  const particleGeometry = new THREE.BufferGeometry();
  const particleCount = 1500;
  
  const posArray = new Float32Array(particleCount * 3);
  const scaleArray = new Float32Array(particleCount);
  
  // Isi array posisi dengan nilai acak
  for (let i = 0; i < particleCount * 3; i += 3) {
    posArray[i] = (Math.random() - 0.5) * 100;
    posArray[i + 1] = (Math.random() - 0.5) * 100;
    posArray[i + 2] = (Math.random() - 0.5) * 100;
    scaleArray[i / 3] = Math.random();
  }
  
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  particleGeometry.setAttribute('scale', new THREE.BufferAttribute(scaleArray, 1));
  
  // Shader material untuk partikel
  const particleMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor1: { value: new THREE.Color(0x5d3bff) },
      uColor2: { value: new THREE.Color(0xff3c78) },
      uPixelRatio: { value: window.devicePixelRatio }
    },
    vertexShader: `
      uniform float uTime;
      attribute float scale;
      varying vec3 vPosition;
      
      void main() {
        vPosition = position;
        
        vec3 pos = position;
        float sinTime = sin(uTime * 0.2 + position.x * 0.05 + position.y * 0.05 + position.z * 0.05) * 0.5;
        pos.x += sinTime;
        pos.y += sinTime;
        
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = scale * 4.0 * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      varying vec3 vPosition;
      
      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;
        
        vec3 finalColor = mix(uColor1, uColor2, vPosition.z * 0.01 + 0.5);
        gl_FragColor = vec4(finalColor, 1.0 - dist * 2.0);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  
  const particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);
  
  // Light point untuk efek cahaya
  const light = new THREE.PointLight(0x5d3bff, 1, 100);
  light.position.set(10, 10, 10);
  scene.add(light);
  
  // Handle resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
  
  // Animation loop
  function animate(time) {
    requestAnimationFrame(animate);
    
    time *= 0.001; // Konversi ke detik
    
    particles.rotation.x = time * 0.05;
    particles.rotation.y = time * 0.075;
    
    particleMaterial.uniforms.uTime.value = time;
    
    renderer.render(scene, camera);
  }
  
  animate(0);
}

try {
  createBackground();
} catch (error) {
  console.log('Three.js background could not be initialized:', error);
}

// ==== Navbar and Navigation ====
const navbar = document.querySelector('.navbar');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const navOverlay = document.querySelector('.nav-overlay');

// Navbar scroll effect
function updateNavbar() {
  if (window.scrollY > 100) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', updateNavbar);
updateNavbar(); // Initial call

// Menu toggle handlers
if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    
    if (navLinks) navLinks.classList.toggle('active');
    if (navOverlay) {
      navOverlay.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    }
  });

  // Close mobile menu on link click
  document.querySelectorAll('.nav-links a, .overlay-menu a').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      if (navLinks) navLinks.classList.remove('active');
      if (navOverlay) {
        navOverlay.classList.remove('active');
        document.body.classList.remove('menu-open');
      }
    });
  });
}

// ==== Animate Home Elements ====
function animateHomeElements() {
  // Tambahkan animasi untuk teks hero yang lebih dinamis
  const heroTitle = document.querySelector('#home h1');
  const heroSubtitle = document.querySelector('#home .subtitle');
  const heroText = document.querySelector('#home .hero-description');
  const heroCta = document.querySelector('#home .hero-cta');
  
  // Hanya animasikan konten yang sudah ada, TIDAK mengganti konten HTML
  // Kita hanya menganimasikan elemen yang sudah ada di HTML
  
  // Tambahkan efek untuk accent-text yang sudah ada di HTML
  if (heroTitle) {
    // Temukan nama yang sudah ada di HTML, jika ada
    const accentText = heroTitle.querySelector('.accent-text');
    if (accentText) {
      // Tambahkan kelas untuk efek spotlight
      accentText.classList.add('spotlight-effect');
    }
  }
  
  // Reset posisi awal untuk animasi
  if (heroTitle) {
    heroTitle.style.opacity = '0';
    heroTitle.style.transform = 'translateY(30px)';
  }
  
  if (heroSubtitle) {
    heroSubtitle.style.opacity = '0';
    heroSubtitle.style.transform = 'translateY(30px)';
  }
  
  if (heroText) {
    heroText.style.opacity = '0';
    heroText.style.transform = 'translateY(30px)';
  }
  
  if (heroCta) {
    heroCta.style.opacity = '0';
    heroCta.style.transform = 'translateY(30px)';
  }
  
  // Animasi sequence dengan delai bertahap
  setTimeout(() => {
    gsap.to(heroTitle, {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: 'power3.out',
      onComplete: () => {
        // Tambahkan efek khusus untuk highlight nama jika ada
        const accentText = heroTitle.querySelector('.accent-text');
        if (accentText) {
          accentText.classList.add('highlighted');
          
          // Tambahkan efek partikel di sekitar nama
          createNameParticles(accentText);
        }
      }
    });
  }, 100);
  
  setTimeout(() => {
    gsap.to(heroSubtitle, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out'
    });
  }, 400);
  
  setTimeout(() => {
    gsap.to(heroText, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out'
    });
  }, 700);
  
  setTimeout(() => {
    gsap.to(heroCta, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out'
    });
  }, 1000);
  
  // Tambahkan animasi untuk scroll indicator
  gsap.fromTo('.scroll-indicator', 
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.8, delay: 1.5, ease: 'power3.out' }
  );
}

// Fungsi untuk menambahkan efek partikel di sekitar nama
function createNameParticles(element) {
  if (!element) return;
  
  // Buat container untuk partikel
  const particlesContainer = document.createElement('div');
  particlesContainer.className = 'name-particles';
  particlesContainer.style.cssText = `
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
    pointer-events: none;
    overflow: hidden;
    z-index: -1;
  `;
  
  element.style.position = 'relative';
  element.appendChild(particlesContainer);
  
  // Buat partikel
  const particleCount = 10;
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'name-particle';
    particle.style.cssText = `
      position: absolute;
      width: 5px;
      height: 5px;
      background: var(--primary-color);
      border-radius: 50%;
      opacity: 0;
      pointer-events: none;
      top: ${Math.random() * 100}%;
      left: ${Math.random() * 100}%;
      animation: particle-float 3s infinite ${Math.random() * 2}s;
    `;
    particlesContainer.appendChild(particle);
  }
  
  // Tambahkan style untuk animasi partikel
  const particleStyle = document.createElement('style');
  particleStyle.textContent = `
    @keyframes particle-float {
      0% {
        opacity: 0;
        transform: translateY(0) scale(0);
      }
      50% {
        opacity: 0.5;
        transform: translateY(-20px) scale(1);
      }
      100% {
        opacity: 0;
        transform: translateY(-40px) scale(0);
      }
    }
    
    .highlighted {
      position: relative;
      z-index: 2;
      text-shadow: 0 0 15px rgba(108, 99, 255, 0.6);
      transition: all 0.5s ease;
    }
    
    .spotlight-effect {
      position: relative;
    }
    
    .spotlight-effect::before {
      content: '';
      position: absolute;
      top: -20px;
      left: 50%;
      transform: translateX(-50%);
      width: 100px;
      height: 50px;
      background: radial-gradient(ellipse, rgba(108, 99, 255, 0.3), transparent 70%);
      filter: blur(10px);
      opacity: 0;
      z-index: -1;
      animation: spotlight 1.5s forwards 1.5s;
    }
    
    @keyframes spotlight {
      0% {
        opacity: 0;
        transform: translateX(-50%) scale(0.5);
      }
      100% {
        opacity: 1;
        transform: translateX(-50%) scale(1);
      }
    }
  `;
  
  document.head.appendChild(particleStyle);
}

// ==== Scroll Animations ====
function initScrollAnimations() {
  // Reveal text animation
  const revealElements = document.querySelectorAll('.reveal-text');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.2
  });
  
  revealElements.forEach(element => {
    revealObserver.observe(element);
  });
  
  // Project Card Animation - Tambahkan animasi khusus untuk project card
  enhanceProjectCards();
  
  // About section animations (tambahan baru)
  const aboutSection = document.querySelector('#about');
  
  if (aboutSection) {
    try {
      // Membuat efek menarik untuk about section dengan stagger
      gsap.registerPlugin(ScrollTrigger);
      
      // Tambahkan konten tentang diri di bagian about jika belum ada
      const aboutTextContent = aboutSection.querySelector('.about-text');
      if (aboutTextContent) {
        const firstParagraph = aboutTextContent.querySelector('p:first-child');
        if (firstParagraph) {
          // Pastikan ada highlight nama di about section juga
          firstParagraph.innerHTML = `
            <strong>Saya Moch Yunus,</strong>Saya adalah seorang Full-Stack Developer dengan 
            pengalaman kurang lebih 1 tahun, saya saat ini mahasiswa di sebuah univ negeri yang berada di jawa timur dari
            tahun 2022
          `;
        }
      }
      
      // Animasi untuk shape/gambar about
      const aboutShape = aboutSection.querySelector('.about-shape');
      if (aboutShape) {
        gsap.fromTo(aboutShape, 
          { opacity: 0, scale: 0.8 },
          { 
            opacity: 1, 
            scale: 1, 
            duration: 1.2, 
            ease: 'elastic.out(1, 0.5)',
            scrollTrigger: {
              trigger: aboutShape,
              start: 'top 80%',
              toggleActions: 'play none none none'
            }
          }
        );
      }
      
      // Animasi untuk judul about
      const aboutTitle = aboutSection.querySelector('.section-title');
      if (aboutTitle) {
        gsap.fromTo(aboutTitle,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            scrollTrigger: {
              trigger: aboutTitle,
              start: 'top 85%',
              toggleActions: 'play none none none'
            }
          }
        );
      }
      
      // Animasi untuk paragraph about dengan stagger
      const aboutParagraphs = aboutSection.querySelectorAll('.about-text p');
      if (aboutParagraphs.length) {
        gsap.fromTo(aboutParagraphs,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.2,
            duration: 0.7,
            scrollTrigger: {
              trigger: aboutSection.querySelector('.about-text'),
              start: 'top 80%',
              toggleActions: 'play none none none'
            }
          }
        );
        
        // Tambahkan highlight untuk nama dalam paragraf about
        setTimeout(() => {
          const nameHighlight = aboutSection.querySelector('.about-text strong');
          if (nameHighlight) {
            nameHighlight.classList.add('accent-text');
            nameHighlight.style.fontWeight = '700';
          }
        }, 1500);
      }
      
      // Animasi highlight items dengan stagger
      const highlightItems = aboutSection.querySelectorAll('.highlight-item');
      if (highlightItems.length) {
        gsap.fromTo(highlightItems,
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            stagger: 0.2,
            duration: 0.7,
            scrollTrigger: {
              trigger: aboutSection.querySelector('.about-highlights'),
              start: 'top 85%',
              toggleActions: 'play none none none'
            }
          }
        );
      }
    } catch (error) {
      console.log('About animations could not be initialized:', error);
    }
  }
  
  // Skill bars animation
  const skillItems = document.querySelectorAll('.skill-item');
  
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const level = entry.target.getAttribute('data-level');
        const progressBar = entry.target.querySelector('.skill-progress');
        progressBar.style.width = `${level}%`;
      }
    });
  }, {
    threshold: 0.5
  });
  
  skillItems.forEach(item => {
    skillObserver.observe(item);
  });
  
  // Initialize GSAP ScrollTrigger if available
  try {
    gsap.registerPlugin(ScrollTrigger);
    
    // Project cards animation
    gsap.utils.toArray('.project-card').forEach((card, i) => {
      gsap.from(card, {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });
    });
    
    // Section titles animation
    gsap.utils.toArray('.section-title').forEach((title) => {
      gsap.from(title, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: title,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });
    });
  } catch (error) {
    console.log('GSAP ScrollTrigger not available');
  }
}

// ==== Initialize Skill Tabs & Make Frameworks & Tools Clickable ====
function initSkillTabs() {
  const categories = document.querySelectorAll('.skill-category');
  const skillLists = document.querySelectorAll('.skills-list');
  
  if (categories.length && skillLists.length) {
    // Make skill categories clickable
    categories.forEach(category => {
      category.style.cursor = 'pointer';
      category.addEventListener('click', () => {
        // Remove active class from all categories and lists
        categories.forEach(cat => cat.classList.remove('active'));
        skillLists.forEach(list => list.classList.remove('active'));
        
        // Add active class to current category and corresponding list
        category.classList.add('active');
        const targetCategory = category.getAttribute('data-category');
        const targetList = document.querySelector(`.skills-list[data-skills="${targetCategory}"]`);
        if (targetList) {
          targetList.classList.add('active');
        }
      });
    });
  }
  
  // Make tech tags clickable
  const techTags = document.querySelectorAll('.tech-tag');
  if (techTags.length) {
    techTags.forEach(tag => {
      tag.style.cursor = 'pointer';
      tag.addEventListener('click', () => {
        // Add visual feedback when clicked
        const originalBackground = tag.style.backgroundColor;
        tag.style.backgroundColor = 'rgba(108, 99, 255, 0.3)';
        setTimeout(() => {
          tag.style.backgroundColor = originalBackground;
        }, 300);
      });
    });
  }
  
  // Make project-links clickable
  const projectLinks = document.querySelectorAll('.project-link a');
  if (projectLinks.length) {
    projectLinks.forEach(link => {
      link.style.pointerEvents = 'auto';
      // Ensure link doesn't just scroll
      link.addEventListener('click', (e) => {
        if (link.getAttribute('href') === '#') {
          e.preventDefault();
          // Add visual feedback
          const linkText = link.querySelector('span');
          if (linkText) {
            const originalColor = linkText.style.color;
            linkText.style.color = 'var(--accent-color)';
            setTimeout(() => {
              linkText.style.color = originalColor;
            }, 300);
          }
        }
      });
    });
  }
}

// ==== Form Validation ====
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Simulasi pengiriman data form
    const formElements = contactForm.elements;
    let isValid = true;
    
    for (let i = 0; i < formElements.length; i++) {
      if (formElements[i].tagName.toLowerCase() !== 'button' && !formElements[i].value.trim()) {
        isValid = false;
        break;
      }
    }
    
    if (isValid) {
      const submitBtn = contactForm.querySelector('.btn-submit');
      submitBtn.textContent = 'Sending...';
      
      // Simulasi pengiriman
      setTimeout(() => {
        submitBtn.textContent = 'Message Sent!';
        contactForm.reset();
        
        setTimeout(() => {
          submitBtn.textContent = 'Send Message';
        }, 3000);
      }, 2000);
    }
  });
}

// ==== Smooth Scrolling untuk Link Navigasi ====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    
    const target = document.querySelector(this.getAttribute('href'));
    
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  });
});

// ==== Custom Cursor (Efek tambahan) ====
function createCustomCursor() {
  const cursor = document.createElement('div');
  cursor.classList.add('custom-cursor');
  document.body.appendChild(cursor);
  
  const cursorDot = document.createElement('div');
  cursorDot.classList.add('cursor-dot');
  document.body.appendChild(cursorDot);
  
  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;
  let cursorDotX = 0;
  let cursorDotY = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  
  // Hover effect pada elemen yang bisa diklik
  const hoverElements = document.querySelectorAll('a, button, .project-card, .menu-toggle, .skill-category, .tech-tag');
  
  hoverElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
      cursor.classList.add('cursor-hover');
    });
    
    element.addEventListener('mouseleave', () => {
      cursor.classList.remove('cursor-hover');
    });
  });
  
  function updateCursor() {
    // Smooth cursor follow
    cursorX += (mouseX - cursorX) * 0.1;
    cursorY += (mouseY - cursorY) * 0.1;
    
    // Faster dot follow
    cursorDotX += (mouseX - cursorDotX) * 0.3;
    cursorDotY += (mouseY - cursorDotY) * 0.3;
    
    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
    cursorDot.style.transform = `translate(${cursorDotX}px, ${cursorDotY}px)`;
    
    requestAnimationFrame(updateCursor);
  }
  
  updateCursor();
}

// Tambahkan style untuk custom cursor
function addCursorStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .custom-cursor {
      position: fixed;
      width: 30px;
      height: 30px;
      border: 2px solid rgba(93, 59, 255, 0.5);
      border-radius: 50%;
      pointer-events: none;
      transform: translate(-50%, -50%);
      z-index: 9999;
      transition: width 0.3s, height 0.3s, border-color 0.3s;
    }
    
    .cursor-dot {
      position: fixed;
      width: 8px;
      height: 8px;
      background-color: var(--primary-color);
      border-radius: 50%;
      pointer-events: none;
      transform: translate(-50%, -50%);
      z-index: 10000;
    }
    
    .cursor-hover {
      width: 50px;
      height: 50px;
      border-color: var(--primary-color);
      background-color: rgba(93, 59, 255, 0.1);
    }
    
    @media (max-width: 768px) {
      .custom-cursor, .cursor-dot {
        display: none;
      }
    }
    
    /* Fix untuk skill category dan tech-tag agar bisa diklik */
    .skill-category, .tech-tag {
      position: relative;
      z-index: 5;
      cursor: pointer !important;
      pointer-events: auto !important;
    }
    
    /* Memberikan efek active state pada skill-category dan tech-tag */
    .skill-category:active, .tech-tag:active {
      transform: scale(0.95);
    }
    
    /* Memberikan efek hover pada skill-category */
    .skill-category:hover {
      background-color: rgba(255, 255, 255, 0.15);
    }
  `;
  
  document.head.appendChild(style);
}

// Inisialisasi custom cursor jika bukan perangkat mobile
if (window.innerWidth > 768) {
  addCursorStyles();
  createCustomCursor();
}

// Tambahan untuk progress bar di loader
document.head.insertAdjacentHTML('beforeend', `
  <style>
    .progress-bar {
      position: relative;
    }
    .progress-bar::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: var(--progress, 0%);
      background-color: var(--primary-color);
      transition: width 0.5s ease;
    }
    
    /* Fix untuk animasi loading */
    .loading-progress {
      transition: width 0.3s ease-out !important;
    }
    
    /* Perbaikan pointer events */
    .skill-category, 
    .tech-tag,
    .project-link a {
      pointer-events: auto !important;
    }
    
    /* Tambahkan efek ketika tech-tag dihover */
    .tech-tag:hover {
      background-color: rgba(108, 99, 255, 0.3) !important;
      transform: translateY(-2px);
      transition: all 0.3s ease;
    }
  </style>
`);

// Fungsi pendukung untuk animasi dan efek
function initHeaderAnimation() {
  const heroElements = [
    '.hero-content',
    '.hero-cta',
    '.scroll-indicator'
  ];
  
  try {
    gsap.fromTo(heroElements[0], 
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
    );
    
    gsap.fromTo(heroElements[1], 
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 0.8, ease: 'power3.out' }
    );
    
    gsap.fromTo(heroElements[2], 
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 1.2, ease: 'power3.out' }
    );
  } catch (error) {
    console.log('GSAP animations not available');
  }
}

function initSplittingAnimation() {
  try {
    // Initialize Splitting
    const splitElements = Splitting();
    
    // Animate hero title chars on load
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
      const chars = heroTitle.querySelectorAll('.char');
      gsap.to(chars, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.04,
        ease: 'power3.out',
        delay: 0.2
      });
    }
    
    // Animate hero subtitle chars on load
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
      const chars = heroSubtitle.querySelectorAll('.char');
      gsap.to(chars, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.02,
        ease: 'power3.out',
        delay: 0.8
      });
    }
    
    // Create scroll-triggered animations for other splitting texts
    document.querySelectorAll('.section-title[data-splitting]').forEach(title => {
      const chars = title.querySelectorAll('.char');
      
      ScrollTrigger.create({
        trigger: title,
        start: 'top 80%',
        onEnter: () => {
          gsap.to(chars, {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.02,
            ease: 'power3.out'
          });
        },
        once: true
      });
    });
  } catch (error) {
    console.log('Splitting animation not available');
  }
}

/* ===== Helper functions for dynamic effects ===== */
function debounce(func, wait, immediate) {
  let timeout;
  return function() {
    const context = this, args = arguments;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// Resize handler with debounce
window.addEventListener('resize', debounce(() => {
  try {
    // Refresh ScrollTrigger
    ScrollTrigger.refresh();
  } catch (error) {
    // ScrollTrigger might not be available
  }
}, 250));

// Error handler to prevent page breaking
window.addEventListener('error', (e) => {
  console.warn('An error occurred in the script:', e.message);
  
  // Ensure the loader disappears even if there's an error
  setTimeout(() => {
    if (document.querySelector('.preloader')) {
      document.querySelector('.preloader').style.display = 'none';
    }
    if (document.querySelector('.loader-container')) {
      document.querySelector('.loader-container').style.display = 'none';
    }
  }, 3000);
});

// Tambahkan style untuk preloader yang lebih keren
function addPreloaderStyles() {
  const preloaderStyle = document.createElement('style');
  preloaderStyle.textContent = `
    /* Modernisasi preloader */
    .preloader {
      background-color: var(--bg-color-dark);
      background-image: 
        radial-gradient(circle at 25% 25%, rgba(108, 99, 255, 0.1) 0%, transparent 40%),
        radial-gradient(circle at 75% 75%, rgba(255, 45, 117, 0.1) 0%, transparent 40%);
    }
    
    .preloader-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      z-index: 2;
    }
    
    .logo-animation {
      width: 20rem;
      height: 20rem;
      filter: drop-shadow(0 0 10px rgba(108, 99, 255, 0.5));
      margin-bottom: 4rem;
    }
    
    .counter-container {
      position: relative;
      margin-bottom: 2.5rem;
    }
    
    .counter {
      font-family: var(--font-primary);
      font-size: 3.6rem;
      font-weight: 800;
      color: var(--text-color);
      text-shadow: 0 0 10px rgba(108, 99, 255, 0.5);
      letter-spacing: 0.2rem;
      position: relative;
    }
    
    .counter::before {
      content: '';
      position: absolute;
      top: -0.5rem;
      left: -1rem;
      right: -1rem;
      bottom: -0.5rem;
      background: linear-gradient(90deg, transparent, rgba(108, 99, 255, 0.15), transparent);
      filter: blur(5px);
      border-radius: 5px;
      z-index: -1;
      opacity: 0.7;
      animation: pulseBg 2s infinite;
    }
    
    .loading-bar {
      width: 30rem;
      height: 4px;
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      overflow: hidden;
      position: relative;
      box-shadow: 0 0 20px rgba(108, 99, 255, 0.2);
    }
    
    .loading-progress {
      height: 100%;
      border-radius: 4px;
      background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
      position: relative;
      box-shadow: 0 0 10px var(--primary-color);
    }
    
    @keyframes pulseBg {
      0%, 100% {
        opacity: 0.5;
      }
      50% {
        opacity: 0.8;
      }
    }
    
    /* Particles efek */
    .preloader::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: radial-gradient(circle, rgba(255, 255, 255, 0.2) 1px, transparent 1px);
      background-size: 30px 30px;
      opacity: 0.2;
      z-index: 1;
      animation: floatingParticles 20s infinite linear;
    }
    
    @keyframes floatingParticles {
      0% {
        background-position: 0 0;
      }
      100% {
        background-position: 30px 30px;
      }
    }
    
    /* Glow effect disekitar loading bar */
    .loading-bar::after {
      content: '';
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      background: transparent;
      border-radius: 6px;
      box-shadow: 0 0 15px var(--primary-color);
      opacity: 0.5;
      z-index: -1;
    }
  `;
  
  document.head.appendChild(preloaderStyle);
}

// Fungsi untuk meningkatkan tampilan dan animasi project card
function enhanceProjectCards() {
  // Cari semua project card di halaman
  const projectCards = document.querySelectorAll('.project-card');
  
  if (projectCards.length) {
    // Styling dan animasi untuk project cards
    const projectStyle = document.createElement('style');
    projectStyle.textContent = `
      /* Style untuk project card yang lebih menarik */
      .project-card {
        position: relative;
        transition: transform 0.5s ease, box-shadow 0.5s ease;
        overflow: hidden;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        background: linear-gradient(145deg, rgba(18, 18, 30, 0.4), rgba(28, 28, 45, 0.8));
        backdrop-filter: blur(5px);
      }
      
      /* Efek hover pada project card */
      .project-card:hover {
        transform: translateY(-10px);
        box-shadow: 0 15px 40px rgba(108, 99, 255, 0.2);
      }
      
      /* Gradien overlay pada gambar project */
      .project-visual::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(10, 10, 20, 0.7));
        z-index: 1;
        opacity: 0.7;
        transition: opacity 0.5s ease;
      }
      
      .project-card:hover .project-visual::before {
        opacity: 0.4;
      }
      
      /* Tambahkan glowing efek pada tag teknologi */
      .tech-tag {
        position: relative;
        overflow: hidden;
      }
      
      .tech-tag::after {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: linear-gradient(
          45deg,
          transparent 0%,
          rgba(108, 99, 255, 0.1) 50%,
          transparent 100%
        );
        transform: rotate(45deg);
        animation: shimmer 3s infinite;
      }
      
      @keyframes shimmer {
        0% {
          transform: translateX(-100%) rotate(45deg);
        }
        100% {
          transform: translateX(100%) rotate(45deg);
        }
      }
      
      /* Animasi untuk project number */
      .project-number {
        position: relative;
        display: inline-block;
        overflow: hidden;
        padding-right: 10px;
      }
      
      .project-number::before {
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        width: 30px;
        height: 2px;
        background: var(--gradient-primary);
        animation: widthPulse 3s infinite;
      }
      
      @keyframes widthPulse {
        0%, 100% {
          width: 20px;
        }
        50% {
          width: 40px;
        }
      }
      
      /* Visual indicator untuk project image */
      .project-visual {
        position: relative;
        overflow: hidden;
      }
      
      .project-visual::after {
        content: 'Lihat Detail';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0.8);
        background: rgba(108, 99, 255, 0.8);
        color: white;
        padding: 10px 20px;
        border-radius: 30px;
        font-weight: 600;
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 2;
      }
      
      .project-card:hover .project-visual::after {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
      }
      
      /* === HOLOGRAM FUTURISTIK UNTUK PROYEK KOSONG === */
      
      .project-card.empty {
        min-height: 350px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        overflow: hidden;
        background: rgba(15, 15, 25, 0.3);
        backdrop-filter: blur(10px);
        transform-style: preserve-3d;
      }

      /* Container efek hologram */
      .hologram-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
        transform-style: preserve-3d;
      }

      /* Grid background dengan efek 3D */
      .hologram-grid {
        position: absolute;
        top: -20%;
        left: -20%;
        width: 140%;
        height: 140%;
        background: 
          linear-gradient(90deg, rgba(93, 59, 255, 0.07) 1px, transparent 1px),
          linear-gradient(rgba(93, 59, 255, 0.07) 1px, transparent 1px);
        background-size: 20px 20px;
        transform: perspective(800px) rotateX(60deg);
        transform-origin: center bottom;
        animation: grid-move 15s linear infinite;
      }

      @keyframes grid-move {
        0% {
          background-position: 0 0;
          opacity: 0.4;
        }
        50% {
          opacity: 0.8;
        }
        100% {
          background-position: 40px 40px;
          opacity: 0.4;
        }
      }

      /* Gelombang interaktif */
      .hologram-waves {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0.5;
        transform-style: preserve-3d;
      }

      .hologram-wave {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 250%;
        height: 250%;
        margin-left: -125%;
        margin-top: -125%;
        background: 
          radial-gradient(
            circle, 
            transparent 30%, 
            rgba(93, 59, 255, 0.05) 70%, 
            rgba(93, 59, 255, 0.1) 90%,
            transparent 100%
          );
        border-radius: 45%;
        animation: wave-rotate 20s linear infinite;
      }

      .hologram-wave:nth-child(2) {
        animation-duration: 15s;
        animation-direction: reverse;
        opacity: 0.3;
      }

      .hologram-wave:nth-child(3) {
        animation-duration: 25s;
        opacity: 0.2;
        width: 300%;
        height: 300%;
        margin-left: -150%;
        margin-top: -150%;
      }

      .hologram-wave:nth-child(4) {
        animation-duration: 35s;
        animation-direction: reverse;
        opacity: 0.1;
        width: 350%;
        height: 350%;
        margin-left: -175%;
        margin-top: -175%;
      }

      @keyframes wave-rotate {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      /* Scan line effect */
      .hologram-scanline {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 5px;
        background: linear-gradient(to right, 
          rgba(255, 255, 255, 0), 
          rgba(93, 59, 255, 0.5),
          rgba(255, 60, 120, 0.5),
          rgba(255, 255, 255, 0)
        );
        opacity: 0.7;
        filter: blur(1px);
        box-shadow: 0 0 15px rgba(93, 59, 255, 0.7);
        animation: scanline 3s linear infinite;
      }

      @keyframes scanline {
        0% {
          transform: translateY(-100%);
        }
        100% {
          transform: translateY(2000%);
        }
      }

      /* Efek ambiance glow */
      .hologram-glow {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        box-shadow: 
          inset 0 0 60px rgba(93, 59, 255, 0.3),
          inset 0 0 100px rgba(93, 59, 255, 0.2),
          0 0 30px rgba(93, 59, 255, 0.5);
        animation: glow-breathe 6s infinite alternate;
        opacity: 0.7;
        z-index: 1;
      }

      @keyframes glow-breathe {
        0% {
          opacity: 0.5;
          box-shadow: 
            inset 0 0 60px rgba(93, 59, 255, 0.3),
            inset 0 0 100px rgba(93, 59, 255, 0.2),
            0 0 30px rgba(93, 59, 255, 0.5);
        }
        100% {
          opacity: 0.8;
          box-shadow: 
            inset 0 0 80px rgba(93, 59, 255, 0.4),
            inset 0 0 150px rgba(93, 59, 255, 0.3),
            0 0 50px rgba(93, 59, 255, 0.7);
        }
      }

      /* Overlay efek rusak (glitch) */
      .hologram-glitch {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: 
          repeating-linear-gradient(
            to bottom,
            transparent, 
            transparent 2px, 
            rgba(93, 59, 255, 0.03) 3px, 
            transparent 3px
          );
        opacity: 0.3;
        mix-blend-mode: screen;
        pointer-events: none;
      }

      /* === TEKS DAN TOMBOL FUTURISTIK === */
      
      /* Container untuk teks dan tombol */
      .hologram-content {
        position: relative;
        z-index: 5;
        text-align: center;
        transform-style: preserve-3d;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 20px;
      }

      /* Gaya teks proyek */
      .hologram-title {
        font-family: 'Orbitron', sans-serif;
        font-size: 2.8rem;
        letter-spacing: 3px;
        background: linear-gradient(to right, #fff, #aa99ff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        opacity: 0.9;
        margin-bottom: 0.5rem;
        text-transform: uppercase;
        position: relative;
        display: inline-block;
      }

      /* Teks coming soon dengan efek flicker */
      .hologram-subtitle {
        font-family: 'Orbitron', sans-serif;
        font-size: 1.4rem;
        letter-spacing: 2px;
        color: rgba(255, 255, 255, 0.9);
        margin: 1rem 0;
        text-shadow: 
          0 0 5px rgba(93, 59, 255, 0.7),
          0 0 10px rgba(93, 59, 255, 0.5);
        animation: neon-flicker 5s infinite alternate;
        text-transform: uppercase;
        font-weight: 500;
      }

      @keyframes neon-flicker {
        0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
          text-shadow: 
            0 0 5px rgba(93, 59, 255, 0.7),
            0 0 10px rgba(93, 59, 255, 0.5),
            0 0 20px rgba(93, 59, 255, 0.4);
          opacity: 0.9;
        }
        20%, 24%, 55% {
          text-shadow: none;
          opacity: 0.8;
        }
      }

      /* Tombol holografis */
      .hologram-button {
        position: relative;
        padding: 12px 30px;
        margin-top: 30px;
        background: rgba(93, 59, 255, 0.1);
        border: 1px solid rgba(93, 59, 255, 0.3);
        border-radius: 30px;
        color: #fff;
        font-family: 'Orbitron', sans-serif;
        font-weight: 500;
        letter-spacing: 2px;
        text-transform: uppercase;
        font-size: 0.9rem;
        display: inline-block;
        cursor: pointer;
        overflow: hidden;
        transition: all 0.3s ease;
        backdrop-filter: blur(5px);
      }

      /* Gradient border effect */
      .hologram-button::before {
        content: '';
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        background: linear-gradient(45deg, 
          rgba(93, 59, 255, 0.5), 
          rgba(255, 60, 120, 0.5), 
          rgba(93, 59, 255, 0.5),
          rgba(255, 60, 120, 0.5)
        );
        border-radius: 30px;
        z-index: -1;
        background-size: 300%;
        animation: border-rotate 8s linear infinite;
        opacity: 0;
        transition: opacity 0.5s ease;
      }

      .hologram-button:hover::before {
        opacity: 1;
      }

      @keyframes border-rotate {
        0% {
          background-position: 0% 50%;
        }
        100% {
          background-position: 300% 50%;
        }
      }

      /* Hover effect */
      .hologram-button:hover {
        transform: translateY(-5px);
        box-shadow: 
          0 10px 20px -10px rgba(93, 59, 255, 0.6),
          0 0 15px rgba(93, 59, 255, 0.5);
        background: rgba(93, 59, 255, 0.2);
      }

      /* Active effect */
      .hologram-button:active {
        transform: translateY(-2px);
      }

      /* Ripple effect on click */
      .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        transform: scale(0);
        animation: ripple-anim 0.6s linear;
        pointer-events: none;
      }

      @keyframes ripple-anim {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
    `;
    
    document.head.appendChild(projectStyle);
    
    // Animasi untuk project card yang kosong
    projectCards.forEach((card, index) => {
      // Cek apakah card kosong (tidak memiliki konten)
      const isEmpty = !card.querySelector('.project-content') || 
                     !card.querySelector('.project-title') ||
                     card.classList.contains('empty');
      
      if (isEmpty) {
        // Hapus konten sebelumnya jika ada
        card.innerHTML = '';
        
        // Tambahkan kelas untuk identifikasi
        card.classList.add('empty');
        
        // Buat container untuk efek hologram
        const hologramContainer = document.createElement('div');
        hologramContainer.className = 'hologram-container';
        
        // Tambahkan grid holografis
        const hologramGrid = document.createElement('div');
        hologramGrid.className = 'hologram-grid';
        hologramContainer.appendChild(hologramGrid);
        
        // Tambahkan scan line
        const hologramScanline = document.createElement('div');
        hologramScanline.className = 'hologram-scanline';
        hologramContainer.appendChild(hologramScanline);
        
        // Tambahkan glow efek
        const hologramGlow = document.createElement('div');
        hologramGlow.className = 'hologram-glow';
        hologramContainer.appendChild(hologramGlow);
        
        // Tambahkan efek glitch
        const hologramGlitch = document.createElement('div');
        hologramGlitch.className = 'hologram-glitch';
        hologramContainer.appendChild(hologramGlitch);
        
        // Tambahkan gelombang hologram
        const hologramWaves = document.createElement('div');
        hologramWaves.className = 'hologram-waves';
        
        // Buat beberapa gelombang
        for (let i = 0; i < 4; i++) {
          const wave = document.createElement('div');
          wave.className = 'hologram-wave';
          hologramWaves.appendChild(wave);
        }
        
        hologramContainer.appendChild(hologramWaves);
        
        // Tambahkan konten hologram (teks dan tombol)
        const hologramContent = document.createElement('div');
        hologramContent.className = 'hologram-content';
        
        hologramContent.innerHTML = `
          <h3 class="hologram-title">Proyek ${index + 1}</h3>
          <p class="hologram-subtitle">Coming Soon</p>
          <button class="hologram-button">Explore</button>
        `;
        
        // Tambahkan elemen ke card
        card.appendChild(hologramContainer);
        card.appendChild(hologramContent);
        
        // Animasi GSAP untuk card
        gsap.set(card, { opacity: 0, rotationX: 15, rotationY: -15 });
        
        gsap.to(card, {
          opacity: 1,
          rotationX: 0,
          rotationY: 0,
          duration: 1.5,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        });

        // Tambahkan interaksi mouse untuk efek hologram 3D
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left; // x position within the element
          const y = e.clientY - rect.top;  // y position within the element
          
          // Calculate rotation values based on mouse position
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const rotateY = (x - centerX) / 20;
          const rotateX = (centerY - y) / 20;
          
          // Apply 3D rotation to card
          gsap.to(card, {
            rotationY: rotateY,
            rotationX: rotateX,
            duration: 0.5,
            ease: 'power2.out',
            transformPerspective: 1000,
            transformOrigin: 'center center'
          });
          
          // Interaktif pergerakan konten berdasarkan mouse
          gsap.to(hologramContent, {
            x: (x - centerX) / 25,
            y: (y - centerY) / 25,
            z: 30,
            duration: 0.5
          });
          
          // Move waves based on mouse position
          gsap.to(hologramWaves, {
            x: (x - centerX) / -15,
            y: (y - centerY) / -15,
            duration: 0.5
          });
          
          // Move grid based on mouse position with parallax effect
          gsap.to(hologramGrid, {
            x: (x - centerX) / -25,
            y: (y - centerY) / -25,
            duration: 0.5
          });
          
          // Intensify glow where mouse is pointing
          const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
          const maxDistance = Math.sqrt(Math.pow(rect.width / 2, 2) + Math.pow(rect.height / 2, 2));
          const intensity = 1 - (distance / maxDistance);
          
          gsap.to(hologramGlow, {
            opacity: 0.5 + (intensity * 0.5),
            duration: 0.5
          });
        });
        
        // Reset card on mouse leave
        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            rotationY: 0,
            rotationX: 0,
            duration: 0.7,
            ease: 'power3.out'
          });
          
          gsap.to(hologramContent, {
            x: 0,
            y: 0,
            z: 0,
            duration: 0.7
          });
          
          gsap.to(hologramWaves, {
            x: 0,
            y: 0,
            duration: 0.7
          });
          
          gsap.to(hologramGrid, {
            x: 0,
            y: 0,
            duration: 0.7
          });
          
          gsap.to(hologramGlow, {
            opacity: 0.7,
            duration: 0.7
          });
        });

        // Tambahkan efek klik ripple pada tombol
        const hologramButton = hologramContent.querySelector('.hologram-button');
        hologramButton.addEventListener('click', function(e) {
          const rect = this.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          
          const ripple = document.createElement('span');
          ripple.className = 'ripple';
          ripple.style.left = `${x}px`;
          ripple.style.top = `${y}px`;
          
          this.appendChild(ripple);
          
          // Hapus ripple setelah animasi selesai
          setTimeout(() => {
            ripple.remove();
          }, 600);
          
          // Tambahkan efek flash pada seluruh card
          gsap.to(hologramGlow, {
            opacity: 1,
            duration: 0.3,
            yoyo: true,
            repeat: 1
          });
        });
      }
    });
  }
}