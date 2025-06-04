document.addEventListener('DOMContentLoaded', function () {
  // Elementos del DOM
  const header = document.querySelector('.pwb8-header');
  const nav = document.querySelector('.pwb8-nav');
  const navMenu = document.querySelector('.pwb8-menu');
  const navLinks = document.querySelectorAll('.pwb8-menu .pwb8-link');
  const contactBtn = document.querySelector('.pwb8-cta');

  // Crear botón hamburguesa
  const menuToggle = document.createElement('div');
  menuToggle.className = 'pwb8-toggle';
  menuToggle.innerHTML = '<span></span><span></span><span></span>';
  contactBtn.parentNode.insertBefore(menuToggle, contactBtn);

  // Toggle del menú
  menuToggle.addEventListener('click', function () {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
  });

  // Cerrar menú al hacer clic en enlace
  navLinks.forEach(link => {
    link.addEventListener('click', function () {
      menuToggle.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Efecto scroll en header
  window.addEventListener('scroll', function () {
    if (window.scrollY > 0) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Agregar botón de contacto al menú móvil (si aún no está)
  if (window.innerWidth <= 768 && !navMenu.querySelector('.pwb8-menu-cta')) {
    const contactLi = document.createElement('li');
    contactLi.className = 'pwb8-item pwb8-menu-cta';

    const contactLink = document.createElement('a');
    contactLink.className = 'pwb8-link';
    contactLink.href = '#contacto';
    contactLink.textContent = 'Contáctanos';
    contactLink.style.fontWeight = '500';

    contactLi.appendChild(contactLink);
    navMenu.appendChild(contactLi);
  }

  // Scroll suave con compensación por altura del header
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = header.offsetHeight;
        const top = target.offsetTop - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // Reset al redimensionar pantalla
  let resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (window.innerWidth > 768) {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    }, 250);
  });
});












// Hero Section JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Hero Section
  const hero = document.getElementById('hero');
  if (!hero) return;

  // Elementos del hero
  const elements = {
    title: hero.querySelectorAll('.title-line'),
    description: hero.querySelector('.hero-description'),
    buttons: hero.querySelectorAll('.btn-primary, .btn-secondary'),
    features: hero.querySelectorAll('.feature'),
    orbs: hero.querySelectorAll('.gradient-orb'),
    scrollIndicator: hero.querySelector('.scroll-indicator'),
    mouse: hero.querySelector('.mouse')
  };

  // Animación de entrada staggered
  function initAnimations() {
    // Observador para iniciar animaciones cuando sean visibles
    const animationObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
          animationObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    // Pausar animaciones inicialmente
    const animatedElements = hero.querySelectorAll('[style*="animation"]');
    animatedElements.forEach(el => {
      if (window.getComputedStyle(el).animationName !== 'none') {
        el.style.animationPlayState = 'paused';
        animationObserver.observe(el);
      }
    });
  }

  // Efecto parallax sutil para los orbs
  function initParallax() {
    let ticking = false;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = 0;
    let currentY = 0;

    // Mouse tracking
    hero.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function updateParallax() {
      // Lerp para movimiento suave
      currentX += (mouseX - currentX) * 0.05;
      currentY += (mouseY - currentY) * 0.05;

      // Aplicar transformaciones a los orbs
      elements.orbs.forEach((orb, index) => {
        const depth = index === 0 ? 40 : 60;
        const x = (currentX - window.innerWidth / 2) / depth;
        const y = (currentY - window.innerHeight / 2) / depth;
        
        orb.style.transform = `translate(${x}px, ${y}px)`;
      });

      ticking = false;
    }

    function requestTick() {
      if (!ticking && window.innerWidth > 768) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }

    // Iniciar loop de animación
    hero.addEventListener('mousemove', requestTick);
  }

  // Efecto hover magnético en botones
  function initMagneticButtons() {
    const buttons = [...elements.buttons];
    
    buttons.forEach(button => {
      let boundingRect;
      
      button.addEventListener('mouseenter', function() {
        boundingRect = this.getBoundingClientRect();
      });
      
      button.addEventListener('mousemove', function(e) {
        if (!boundingRect) return;
        
        const x = e.clientX - boundingRect.left - boundingRect.width / 2;
        const y = e.clientY - boundingRect.top - boundingRect.height / 2;
        
        // Movimiento sutil
        this.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) scale(1.05)`;
      });
      
      button.addEventListener('mouseleave', function() {
        this.style.transform = '';
        boundingRect = null;
      });
    });
  }

  // Animación de texto palabra por palabra
  function animateText() {
    elements.title.forEach((line, lineIndex) => {
      const text = line.textContent;
      const words = text.split(' ');
      line.textContent = '';
      line.style.opacity = '1';
      
      words.forEach((word, wordIndex) => {
        const span = document.createElement('span');
        span.textContent = word + ' ';
        span.style.display = 'inline-block';
        span.style.opacity = '0';
        span.style.transform = 'translateY(20px)';
        span.style.transition = `all 0.6s cubic-bezier(0.65, 0, 0.35, 1) ${lineIndex * 0.2 + wordIndex * 0.1}s`;
        line.appendChild(span);
        
        // Trigger animation
        setTimeout(() => {
          span.style.opacity = '1';
          span.style.transform = 'translateY(0)';
        }, 50);
      });
    });
  }

  // Hover effect en features
  function initFeatureHovers() {
    elements.features.forEach((feature, index) => {
      feature.style.transitionDelay = `${index * 0.05}s`;
      
      feature.addEventListener('mouseenter', function() {
        // Reducir opacidad de otros features
        elements.features.forEach((otherFeature, otherIndex) => {
          if (otherIndex !== index) {
            otherFeature.style.opacity = '0.6';
            otherFeature.style.transform = 'scale(0.98)';
          }
        });
      });
      
      feature.addEventListener('mouseleave', function() {
        // Restaurar todos los features
        elements.features.forEach(f => {
          f.style.opacity = '';
          f.style.transform = '';
        });
      });
    });
  }

  // Scroll indicator interaction
  function initScrollIndicator() {
    if (!elements.scrollIndicator) return;
    
    elements.scrollIndicator.addEventListener('click', () => {
      const nextSection = hero.nextElementSibling;
      if (nextSection) {
        const headerHeight = 60; // Altura del header
        const targetPosition = nextSection.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });

    // Ocultar indicator al hacer scroll
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 100) {
        elements.scrollIndicator.style.opacity = '0';
        elements.scrollIndicator.style.pointerEvents = 'none';
      } else {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          elements.scrollIndicator.style.opacity = '';
          elements.scrollIndicator.style.pointerEvents = '';
        }, 300);
      }
    });
  }

  // Optimización de rendimiento
  function initPerformanceOptimizations() {
    // Intersection Observer para pausar animaciones fuera de vista
    const performanceObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.willChange = 'transform';
        } else {
          entry.target.style.willChange = 'auto';
        }
      });
    }, { rootMargin: '50px' });

    elements.orbs.forEach(orb => performanceObserver.observe(orb));
  }

  // Responsive handlers
  function handleResize() {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
      // Desactivar efectos pesados en móvil
      elements.orbs.forEach(orb => {
        orb.style.transform = 'none';
      });
    }
  }

  // Inicialización con delay para smooth loading
  setTimeout(() => {
    initAnimations();
    animateText();
  }, 100);

  // Inicializar componentes
  initParallax();
  initMagneticButtons();
  initFeatureHovers();
  initScrollIndicator();
  initPerformanceOptimizations();

  // Event listeners
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(handleResize, 250);
  });

  // Accesibilidad - Reducir movimiento si el usuario lo prefiere
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Desactivar animaciones complejas
    elements.orbs.forEach(orb => {
      orb.style.animation = 'none';
    });
    
    // Simplificar transiciones
    hero.querySelectorAll('*').forEach(el => {
      if (el.style.transition) {
        el.style.transition = 'opacity 0.3s ease';
      }
    });
  }

  // Easter egg - Konami code
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let konamiIndex = 0;

  document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === konamiCode.length) {
        // Activar modo especial
        hero.style.background = 'linear-gradient(45deg, #f5f5f7 25%, #ffffff 25%, #ffffff 50%, #f5f5f7 50%, #f5f5f7 75%, #ffffff 75%, #ffffff)';
        hero.style.backgroundSize = '20px 20px';
        hero.style.animation = 'konami 20s linear infinite';
        
        setTimeout(() => {
          hero.style.background = '';
          hero.style.animation = '';
        }, 5000);
        
        konamiIndex = 0;
      }
    } else {
      konamiIndex = 0;
    }
  });
});

// Estilos adicionales dinámicos
const heroStyles = document.createElement('style');
heroStyles.textContent = `
  @keyframes konami {
    to { background-position: 20px 20px; }
  }
  
  .feature, .btn-primary, .btn-secondary {
    will-change: transform;
  }
  
  .gradient-orb {
    will-change: transform;
    pointer-events: none;
  }
`;
document.head.appendChild(heroStyles);
















// Añadir al archivo JS existente
document.addEventListener('DOMContentLoaded', function() {
  // Sección Sobre
  const sobreSection = document.getElementById('sobre');
  if (!sobreSection) return;

  // Elementos de la sección
  const elements = {
    title: sobreSection.querySelector('#titulo-sobre'),
    intro: sobreSection.querySelector('.contenedor-sobre > p'),
    blocks: sobreSection.querySelectorAll('.bloques-sobre article'),
    origin: sobreSection.querySelector('.origen'),
    team: sobreSection.querySelector('.equipo'),
    teamMembers: sobreSection.querySelectorAll('.miembros figure'),
    cta: sobreSection.querySelector('.cta-final')
  };

  // Intersection Observer para animaciones al scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Iniciar animación
        entry.target.style.animationPlayState = 'running';
        
        // Para elementos con animación de texto palabra por palabra
        if (entry.target.hasAttribute('data-split-text')) {
          splitTextAnimation(entry.target);
        }
        
        animationObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Pausar animaciones inicialmente
  const animatedElements = sobreSection.querySelectorAll('[style*="animation"]');
  animatedElements.forEach(el => {
    const computedStyle = window.getComputedStyle(el);
    if (computedStyle.animationName !== 'none') {
      el.style.animationPlayState = 'paused';
      animationObserver.observe(el);
    }
  });

  // Animación de texto palabra por palabra para el título
  function splitTextAnimation(element) {
    const text = element.textContent;
    const words = text.split(' ');
    element.textContent = '';
    element.style.opacity = '1';
    
    words.forEach((word, index) => {
      const span = document.createElement('span');
      span.textContent = word + ' ';
      span.style.display = 'inline-block';
      span.style.opacity = '0';
      span.style.transform = 'translateY(20px)';
      span.style.transition = `all 0.6s cubic-bezier(0.65, 0, 0.35, 1) ${index * 0.08}s`;
      element.appendChild(span);
      
      // Trigger animation
      setTimeout(() => {
        span.style.opacity = '1';
        span.style.transform = 'translateY(0)';
      }, 50);
    });
  }

  // Añadir atributo para split text al título
  if (elements.title) {
    elements.title.setAttribute('data-split-text', 'true');
  }

  // Efecto hover magnético en los bloques
  elements.blocks.forEach(block => {
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;
    let isHovering = false;

    block.addEventListener('mouseenter', function() {
      isHovering = true;
    });

    block.addEventListener('mouseleave', function() {
      isHovering = false;
      this.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
    });

    block.addEventListener('mousemove', function(e) {
      if (!isHovering) return;
      
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;
      
      targetX = rotateX;
      targetY = rotateY;
    });

    // Animación suave
    function animate() {
      if (isHovering) {
        currentX += (targetX - currentX) * 0.1;
        currentY += (targetY - currentY) * 0.1;
        
        block.style.transform = `translateY(-4px) rotateX(${currentX}deg) rotateY(${currentY}deg)`;
      }
      requestAnimationFrame(animate);
    }
    
    animate();
  });

  // Contador animado para estadísticas (opcional)
  function animateValue(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
      current += increment;
      if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
        current = end;
        clearInterval(timer);
      }
      element.textContent = Math.round(current);
    }, 16);
  }

  // Efecto parallax sutil en scroll
  let ticking = false;
  function updateParallax() {
    const scrolled = window.pageYOffset;
    const sectionTop = sobreSection.offsetTop;
    const sectionHeight = sobreSection.offsetHeight;
    
    // Solo aplicar parallax cuando la sección está visible
    if (scrolled + window.innerHeight > sectionTop && scrolled < sectionTop + sectionHeight) {
      const parallaxSpeed = 0.5;
      const yPos = -(scrolled - sectionTop) * parallaxSpeed;
      
      // Aplicar a elementos específicos
      if (elements.origin && window.innerWidth > 768) {
        elements.origin.style.transform = `translateY(${yPos * 0.3}px)`;
      }
    }
    
    ticking = false;
  }

  function requestTick() {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  // Solo activar parallax en desktop
  if (window.innerWidth > 768) {
    window.addEventListener('scroll', requestTick);
  }

  // Efecto hover en las imágenes del equipo
  elements.teamMembers.forEach((member, index) => {
    const img = member.querySelector('img');
    if (!img) return;

    member.addEventListener('mouseenter', function() {
      // Animar esta imagen
      this.style.transform = 'translateY(-8px)';
      
      // Efecto sutil en las otras imágenes
      elements.teamMembers.forEach((otherMember, otherIndex) => {
        if (otherIndex !== index) {
          otherMember.style.opacity = '0.7';
          otherMember.style.transform = 'scale(0.95)';
        }
      });
    });

    member.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
      
      // Restaurar otras imágenes
      elements.teamMembers.forEach(otherMember => {
        otherMember.style.opacity = '1';
        otherMember.style.transform = 'scale(1)';
      });
    });
  });

  // Lazy loading para imágenes
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        
        // Si la imagen tiene data-src, cargarla
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          
          // Añadir clase cuando cargue
          img.addEventListener('load', function() {
            this.classList.add('loaded');
          });
        }
        
        imageObserver.unobserve(img);
      }
    });
  }, { rootMargin: '50px' });

  // Observar todas las imágenes
  const images = sobreSection.querySelectorAll('img');
  images.forEach(img => {
    img.classList.add('lazy-image');
    imageObserver.observe(img);
  });

  // Smooth hover effect para el CTA
  const ctaButton = sobreSection.querySelector('.cta-final .btn');
  if (ctaButton) {
    ctaButton.addEventListener('mouseenter', function() {
      this.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    });
  }

  // Cleanup en resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // Desactivar parallax en móvil
      if (window.innerWidth <= 768) {
        window.removeEventListener('scroll', requestTick);
        
        // Reset transforms
        if (elements.origin) {
          elements.origin.style.transform = '';
        }
        
        elements.blocks.forEach(block => {
          block.style.transform = '';
        });
      } else {
        window.addEventListener('scroll', requestTick);
      }
    }, 250);
  });

  // Añadir clases para transiciones suaves
  sobreSection.querySelectorAll('a, button').forEach(el => {
    el.style.transition = 'all 0.3s ease';
  });

  // Performance: Reducir animaciones si el usuario prefiere
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Desactivar animaciones complejas
    animatedElements.forEach(el => {
      el.style.animation = 'none';
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }
});

// Estilos adicionales para lazy loading
const style = document.createElement('style');
style.textContent = `
  .lazy-image {
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .lazy-image.loaded {
    opacity: 1;
  }
  
  .miembros figure {
    transition: all 0.3s ease;
  }
`;
document.head.appendChild(style);













// Proceso Section JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Sección Proceso
  const proceso = document.getElementById('proceso');
  if (!proceso) return;

  // Elementos de la sección
  const elements = {
    title: proceso.querySelector('#proceso-titulo'),
    intro: proceso.querySelector('.container-proceso > p'),
    steps: proceso.querySelectorAll('.paso-item'),
    stepArticles: proceso.querySelectorAll('.paso-item article'),
    cta: proceso.querySelector('.cta-proceso'),
    ctaButton: proceso.querySelector('.cta-proceso a')
  };

  // Reemplazar emojis con iconos SVG elegantes
  const iconMap = {
    '📞': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>`,
    '📄': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>`,
    '👨‍💻': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M21 8v6M12 11a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>`,
    '🚀': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>`,
    '🔁': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>`
  };

  // Función para reemplazar emojis
  function replaceEmojis() {
    elements.steps.forEach(step => {
      const h3 = step.querySelector('h3');
      if (!h3) return;
      
      const text = h3.textContent;
      const emoji = text.match(/[📞📄👨‍💻🚀🔁]/);
      
      if (emoji && iconMap[emoji[0]]) {
        const cleanText = text.replace(emoji[0], '').trim();
        h3.innerHTML = `<span class="step-icon">${iconMap[emoji[0]]}</span>${cleanText}`;
      }
    });
  }

  // Animación de entrada con Intersection Observer
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        
        // Si es un paso, animar también el número
        if (entry.target.classList.contains('paso-item')) {
          animateStepNumber(entry.target);
        }
        
        animationObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Pausar animaciones inicialmente
  const animatedElements = proceso.querySelectorAll('[style*="animation"]');
  animatedElements.forEach(el => {
    if (window.getComputedStyle(el).animationName !== 'none') {
      el.style.animationPlayState = 'paused';
      animationObserver.observe(el);
    }
  });

  // Animación del número del paso
  function animateStepNumber(stepElement) {
    const stepNumber = Array.from(elements.steps).indexOf(stepElement) + 1;
    const numberElement = stepElement.querySelector('::before');
    
    // Crear span temporal para animar el número
    const tempSpan = document.createElement('span');
    tempSpan.className = 'step-number-animate';
    tempSpan.textContent = stepNumber;
    tempSpan.style.cssText = `
      position: absolute;
      left: 20px;
      top: 20px;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 18px;
      color: #86868b;
      transform: scale(0);
      transition: transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    `;
    
    stepElement.appendChild(tempSpan);
    
    setTimeout(() => {
      tempSpan.style.transform = 'scale(1)';
    }, 100);
  }

  // Efecto hover avanzado en los pasos
  elements.steps.forEach((step, index) => {
    const article = step.querySelector('article');
    if (!article) return;

    let isHovering = false;
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    step.addEventListener('mouseenter', function() {
      isHovering = true;
      
      // Highlight del paso actual
      elements.steps.forEach((otherStep, otherIndex) => {
        if (otherIndex !== index) {
          otherStep.style.opacity = '0.6';
        }
      });
    });

    step.addEventListener('mouseleave', function() {
      isHovering = false;
      article.style.transform = '';
      
      // Restaurar opacidad
      elements.steps.forEach(s => {
        s.style.opacity = '1';
      });
    });

    step.addEventListener('mousemove', function(e) {
      if (!isHovering) return;
      
      const rect = article.getBoundingClientRect();
      mouseX = e.clientX - rect.left - rect.width / 2;
      mouseY = e.clientY - rect.top - rect.height / 2;
    });

    // Animación suave del hover
    function animateHover() {
      if (isHovering) {
        currentX += (mouseX * 0.01 - currentX) * 0.1;
        currentY += (mouseY * 0.01 - currentY) * 0.1;
        
        article.style.transform = `translateX(${8 + currentX}px) translateY(${currentY}px)`;
      }
      
      requestAnimationFrame(animateHover);
    }
    
    animateHover();
  });

  // Animación de la línea de progreso

  // Click en pasos para expandir información (opcional)
  elements.steps.forEach(step => {
    step.style.cursor = 'pointer';
    
    step.addEventListener('click', function() {
      const article = this.querySelector('article');
      const paragraph = article.querySelector('p');
      
      // Toggle clase activa
      this.classList.toggle('active');
      
      if (this.classList.contains('active')) {
        // Expandir
        paragraph.style.maxHeight = paragraph.scrollHeight + 'px';
        article.style.background = '#000000';
        article.style.color = '#ffffff';
        
        // Cambiar color del texto
        const h3 = article.querySelector('h3');
        if (h3) h3.style.color = '#ffffff';
        paragraph.style.color = '#a1a1a6';
      } else {
        // Contraer
        paragraph.style.maxHeight = '';
        article.style.background = '';
        article.style.color = '';
        
        // Restaurar colores
        const h3 = article.querySelector('h3');
        if (h3) h3.style.color = '';
        paragraph.style.color = '';
      }
    });
  });

  // Smooth scroll para el CTA
  if (elements.ctaButton) {
    elements.ctaButton.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const headerHeight = 60;
          const targetPosition = target.offsetTop - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });

    // Efecto magnético en el botón CTA
    elements.ctaButton.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      this.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) scale(1.05)`;
    });

    elements.ctaButton.addEventListener('mouseleave', function() {
      this.style.transform = '';
    });
  }

  // Contador de pasos completados
  let completedSteps = 0;
  function updateStepCounter() {
    const counterElement = document.createElement('div');
    counterElement.className = 'step-counter';
    counterElement.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background:rgb(68, 15, 15);
      color: #ffffff;
      padding: 12px 20px;
      border-radius: 50px;
      font-size: 14px;
      font-weight: 500;
      opacity: 0;
      transform: translateY(20px);
            transition: all 0.3s ease;
      z-index: 1000;
    `;
    counterElement.textContent = `Paso ${completedSteps} de ${elements.steps.length}`;
    document.body.appendChild(counterElement);
    
    // Mostrar contador cuando se scrollea por los pasos
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          completedSteps++;
          counterElement.textContent = `Paso ${completedSteps} de ${elements.steps.length}`;
          counterElement.style.opacity = '1';
          counterElement.style.transform = 'translateY(0)';
          
          // Ocultar después de 3 segundos
          setTimeout(() => {
            counterElement.style.opacity = '0';
            counterElement.style.transform = 'translateY(20px)';
          }, 3000);
        }
      });
    }, { threshold: 0.5 });
    
    elements.steps.forEach(step => counterObserver.observe(step));
  }

  // Parallax sutil en el título
  if (window.innerWidth > 768) {
    let ticking = false;
    
        function updateParallax() {
      const scrolled = window.pageYOffset;
      const sectionTop = proceso.offsetTop;
      const sectionHeight = proceso.offsetHeight;
      
      if (scrolled + window.innerHeight > sectionTop && scrolled < sectionTop + sectionHeight) {
        const parallaxSpeed = 0.3;
        const yPos = -(scrolled - sectionTop) * parallaxSpeed;
        
        if (elements.title) {
          elements.title.style.transform = `translateY(${yPos * 0.5}px)`;
        }
      }
      
      ticking = false;
    }
    
    function requestTick() {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }
    
    window.addEventListener('scroll', requestTick);
  }

  // Inicialización
  replaceEmojis();
  createProgressLine();
  updateStepCounter();

  // Cleanup en resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth <= 768) {
        // Desactivar efectos en móvil
        elements.steps.forEach(step => {
          step.style.transform = '';
          const article = step.querySelector('article');
          if (article) article.style.transform = '';
        });
      }
    }, 250);
  });

  // Accesibilidad
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Simplificar animaciones
    proceso.querySelectorAll('*').forEach(el => {
      if (el.style.animation) {
        el.style.animation = 'none';
      }
      if (el.style.transition) {
        el.style.transition = 'opacity 0.3s ease';
      }
    });
  }
});

// Estilos adicionales dinámicos
const procesoStyles = document.createElement('style');
procesoStyles.textContent = `
  .step-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: #000000;
    border-radius: 8px;
    color: #ffffff;
    flex-shrink: 0;
  }
  
  .paso-item {
    transition: opacity 0.3s ease;
  }
  
  .paso-item article {
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  
  .paso-item p {
    overflow: hidden;
    transition: max-height 0.3s ease, color 0.3s ease;
  }
  
  .paso-item:not(.active) p {
    max-height: 3em;
  }
  
  .step-counter {
    user-select: none;
    pointer-events: none;
  }
  
  @media (prefers-color-scheme: dark) {
    .step-icon {
      background: #f5f5f7;
      color: #000000;
    }
    
    .paso-item.active article {
      background: #f5f5f7 !important;
      color: #000000 !important;
    }
    
    .paso-item.active h3,
    .paso-item.active p {
      color: #000000 !important;
    }
  }
`;
document.head.appendChild(procesoStyles);











// Portafolio Section JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Sección Portafolio
  const portafolio = document.getElementById('portafolio');
  if (!portafolio) return;

  // Elementos de la sección
  const elements = {
    title: portafolio.querySelector('#portafolio-titulo'),
    filterButtons: portafolio.querySelectorAll('.filtros-portafolio button'),
    projects: portafolio.querySelectorAll('.proyecto-item'),
    projectImages: portafolio.querySelectorAll('.proyecto-figura img'),
    ctaButton: portafolio.querySelector('.ver-mas-proyectos'),
    grid: portafolio.querySelector('.grid-proyectos')
  };

  // Estado actual
  let currentFilter = 'todos';
  let isAnimating = false;

  // Inicializar filtros
  function initFilters() {
    // Marcar el primer botón como activo
    if (elements.filterButtons.length > 0) {
      elements.filterButtons[0].classList.add('active');
    }

    // Event listeners para los filtros
    elements.filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        if (isAnimating) return;
        
        const filter = this.dataset.filtro;
        if (filter === currentFilter) return;

        // Actualizar botón activo
        elements.filterButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');

        // Aplicar filtro
        filterProjects(filter);
        currentFilter = filter;
      });
    });
  }

  // Función de filtrado con animación
  function filterProjects(filter) {
    isAnimating = true;
    
    // Obtener proyectos visibles e invisibles
    const visibleProjects = [];
    const hiddenProjects = [];
    
    elements.projects.forEach(project => {
      const category = project.dataset.categoria;
      const shouldShow = filter === 'todos' || category === filter;
      
      if (shouldShow && project.classList.contains('hidden')) {
        hiddenProjects.push(project);
      } else if (!shouldShow && !project.classList.contains('hidden')) {
        visibleProjects.push(project);
      }
    });

    // Animar salida de proyectos que se ocultan
    let hideDelay = 0;
    visibleProjects.forEach(project => {
      project.style.animation = 'fadeOutDown 0.5s cubic-bezier(0.65, 0, 0.35, 1) forwards';
      project.style.animationDelay = `${hideDelay}s`;
      hideDelay += 0.05;
      
      setTimeout(() => {
        project.classList.add('hidden');
      }, 500 + hideDelay * 1000);
    });

    // Animar entrada de nuevos proyectos
    setTimeout(() => {
      let showDelay = 0;
      hiddenProjects.forEach(project => {
        project.classList.remove('hidden');
        project.style.animation = 'fadeInUp 0.8s cubic-bezier(0.65, 0, 0.35, 1) forwards';
        project.style.animationDelay = `${showDelay}s`;
        showDelay += 0.1;
      });
      
      // Actualizar estado de animación
      setTimeout(() => {
        isAnimating = false;
        reorganizeGrid();
      }, 800 + showDelay * 1000);
    }, visibleProjects.length > 0 ? 600 : 0);
  }

  // Reorganizar grid después del filtrado
  function reorganizeGrid() {
    const visibleProjects = Array.from(elements.projects).filter(p => !p.classList.contains('hidden'));
    
    // Aplicar efecto de reorganización suave
    visibleProjects.forEach((project, index) => {
      project.style.order = index;
    });
  }

  // Lazy loading para imágenes
  function initLazyLoading() {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          
          // Cargar imagen si tiene data-src
          if (img.dataset.src) {
            // Crear nueva imagen para precargar
            const tempImg = new Image();
            tempImg.onload = function() {
              img.src = this.src;
              img.classList.add('loaded');
              
              // Efecto de fade in
              img.style.opacity = '0';
              img.style.transition = 'opacity 0.5s ease';
              setTimeout(() => {
                img.style.opacity = '1';
              }, 50);
            };
            tempImg.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          
          imageObserver.unobserve(img);
        }
      });
    }, { rootMargin: '50px' });

    elements.projectImages.forEach(img => {
      imageObserver.observe(img);
    });
  }

  // Efecto parallax en las imágenes al hover
  function initImageParallax() {
    elements.projects.forEach(project => {
      const figure = project.querySelector('.proyecto-figura');
      const img = figure.querySelector('img');
      if (!img) return;

      let isHovering = false;
      let animationFrame;

      figure.addEventListener('mouseenter', function() {
        isHovering = true;
      });

      figure.addEventListener('mouseleave', function() {
        isHovering = false;
        img.style.transform = 'scale(1) translate(0, 0)';
      });

      figure.addEventListener('mousemove', function(e) {
        if (!isHovering) return;

        const rect = figure.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const moveX = ((x - centerX) / centerX) * 10;
        const moveY = ((y - centerY) / centerY) * 10;
        
        cancelAnimationFrame(animationFrame);
        animationFrame = requestAnimationFrame(() => {
          img.style.transform = `scale(1.08) translate(${moveX}px, ${moveY}px)`;
        });
      });
    });
  }

  // Animación de entrada con Intersection Observer
  function initScrollAnimations() {
    const animationObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Delay escalonado para elementos
          setTimeout(() => {
            entry.target.style.animationPlayState = 'running';
          }, index * 50);
          
          animationObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    // Pausar animaciones inicialmente
    const animatedElements = portafolio.querySelectorAll('[style*="animation"]');
    animatedElements.forEach(el => {
      if (window.getComputedStyle(el).animationName !== 'none') {
        el.style.animationPlayState = 'paused';
        animationObserver.observe(el);
      }
    });
  }

  // Efecto de ripple en los botones de filtro
  function addRippleEffect() {
    elements.filterButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.1);
          left: ${x}px;
          top: ${y}px;
          pointer-events: none;
          transform: scale(0);
          animation: rippleEffect 0.6s ease-out;
        `;
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
      });
    });
  }

  // Contador de proyectos visibles
  function updateProjectCount() {
    const visibleCount = Array.from(elements.projects).filter(p => !p.classList.contains('hidden')).length;
    const totalCount = elements.projects.length;
    
    // Crear o actualizar contador
    let counter = portafolio.querySelector('.project-counter');
    if (!counter) {
      counter = document.createElement('div');
      counter.className = 'project-counter';
      counter.style.cssText = `
        text-align: center;
        margin-top: 20px;
        font-size: 14px;
        color: #86868b;
        opacity: 0;
        transform: translateY(10px);
        transition: all 0.3s ease;
      `;
      elements.grid.parentNode.insertBefore(counter, elements.grid.nextSibling);
    }
    
    counter.textContent = `Mostrando ${visibleCount} de ${totalCount} proyectos`;
    
    // Animar entrada
    setTimeout(() => {
      counter.style.opacity = '1';
      counter.style.transform = 'translateY(0)';
    }, 100);
  }

  // Smooth scroll para enlaces de casos de éxito
  function initSmoothScroll() {
    const caseLinks = portafolio.querySelectorAll('.enlace-caso');
    
    caseLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          
          // Efecto de carga antes de navegar
          this.style.opacity = '0.5';
          setTimeout(() => {
            this.style.opacity = '';
          }, 300);
          
          // Scroll suave (si existe el elemento)
          const target = document.querySelector(href);
          if (target) {
            const headerHeight = 60;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          }
        }
      });
    });
  }

  // Efecto magnético en el botón CTA
  if (elements.ctaButton) {
    let boundingRect;
    
    elements.ctaButton.addEventListener('mouseenter', function() {
      boundingRect = this.getBoundingClientRect();
    });
    
    elements.ctaButton.addEventListener('mousemove', function(e) {
      if (!boundingRect) return;
      
      const x = e.clientX - boundingRect.left - boundingRect.width / 2;
      const y = e.clientY - boundingRect.top - boundingRect.height / 2;
      
      this.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) scale(1.05)`;
    });
    
    elements.ctaButton.addEventListener('mouseleave', function() {
      this.style.transform = '';
      boundingRect = null;
    });
  }

  // Atajos de teclado para filtros
  function initKeyboardShortcuts() {
    const filterKeys = {
      '1': 'todos',
      '2': 'web',
      '3': 'pagos',
      '4': 'ia',
      '5': 'asesoria'
    };
    
    document.addEventListener('keydown', (e) => {
      if (filterKeys[e.key] && !e.ctrlKey && !e.metaKey) {
        const targetButton = portafolio.querySelector(`[data-filtro="${filterKeys[e.key]}"]`);
        if (targetButton) {
          targetButton.click();
          
          // Indicador visual
          targetButton.style.transform = 'scale(0.95)';
          setTimeout(() => {
            targetButton.style.transform = '';
          }, 150);
        }
      }
    });
  }

  // Inicialización
  initFilters();
  initLazyLoading();
  initImageParallax();
  initScrollAnimations();
  addRippleEffect();
    updateProjectCount();
  initSmoothScroll();
  initKeyboardShortcuts();

  // Actualizar contador cuando se filtran proyectos
  elements.filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      setTimeout(updateProjectCount, 800);
    });
  });

  // Cleanup y optimizaciones
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // Reorganizar grid en resize
      reorganizeGrid();
      
      // Desactivar efectos pesados en móvil
      if (window.innerWidth <= 768) {
        elements.projects.forEach(project => {
          const img = project.querySelector('.proyecto-figura img');
          if (img) {
            img.style.transform = '';
          }
        });
      }
    }, 250);
  });

  // Precargar imágenes de los primeros proyectos
  function preloadFirstImages() {
    const firstProjects = Array.from(elements.projects).slice(0, 3);
    firstProjects.forEach(project => {
      const img = project.querySelector('.proyecto-figura img');
      if (img && img.dataset.src) {
        const preloadImg = new Image();
        preloadImg.src = img.dataset.src;
      }
    });
  }
  
  preloadFirstImages();

  // Accesibilidad
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Simplificar animaciones
    portafolio.querySelectorAll('*').forEach(el => {
      if (el.style.animation) {
        el.style.animation = 'none';
        el.style.opacity = '1';
        el.style.transform = 'none';
      }
    });
  }
});

// Estilos adicionales dinámicos
const portafolioStyles = document.createElement('style');
portafolioStyles.textContent = `
  @keyframes fadeOutDown {
    to {
      opacity: 0;
      transform: translateY(20px);
    }
  }
  
  @keyframes rippleEffect {
    to {
      transform: scale(2);
      opacity: 0;
    }
  }
  
  .proyecto-item {
    will-change: transform, opacity;
  }
  
  .proyecto-item.hidden {
    position: absolute;
    visibility: hidden;
    pointer-events: none;
  }
  
  .proyecto-figura img {
    will-change: transform;
  }
  
   .proyecto-figura img.loaded {
    animation: fadeIn 0.5s ease;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  .filtros-portafolio button {
    position: relative;
    overflow: hidden;
  }
  
  .project-counter {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  
  /* Tooltip para atajos de teclado */
  .filtros-portafolio button::after {
    content: attr(data-key);
    position: absolute;
    top: -25px;
    left: 50%;
    transform: translateX(-50%);
    background: #1d1d1f;
    color: #ffffff;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 11px;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
  }
  
  .filtros-portafolio button:hover::after {
    opacity: 0.8;
  }
  
  @media (max-width: 768px) {
    .filtros-portafolio button::after {
      display: none;
    }
  }
  
  @media (prefers-color-scheme: dark) {
    .filtros-portafolio button::after {
      background: #f5f5f7;
      color: #1d1d1f;
    }
    
    .project-counter {
      color: #86868b;
    }
  }
`;
document.head.appendChild(portafolioStyles);

// Añadir indicadores de teclas a los botones
document.addEventListener('DOMContentLoaded', function() {
  const filterButtons = document.querySelectorAll('.filtros-portafolio button');
  const keys = ['1', '2', '3', '4', '5'];
  
  filterButtons.forEach((button, index) => {
    if (keys[index]) {
      button.setAttribute('data-key', keys[index]);
    }
  });
});

// Función para debug (opcional)
function debugPortfolio() {
  console.log('Portfolio Debug Info:');
  console.log('Total projects:', document.querySelectorAll('.proyecto-item').length);
  console.log('Visible projects:', document.querySelectorAll('.proyecto-item:not(.hidden)').length);
  console.log('Current filter:', document.querySelector('.filtros-portafolio button.active')?.dataset.filtro);
}

// Exportar funciones útiles (opcional)
window.portfolioUtils = {
  filterProjects: (filter) => {
    const button = document.querySelector(`[data-filtro="${filter}"]`);
    if (button) button.click();
  },
  getVisibleProjects: () => {
    return Array.from(document.querySelectorAll('.proyecto-item:not(.hidden)'));
  },
  debug: debugPortfolio
};












// Precios Section JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Sección Precios
  const precios = document.getElementById('precios');
  if (!precios) return;

  // Elementos de la sección
  const elements = {
    title: precios.querySelector('#precios-titulo'),
    description: precios.querySelector('.container-precios > p'),
    plans: precios.querySelectorAll('.plan-item'),
    prices: precios.querySelectorAll('.plan-precio strong'),
    ctaButtons: precios.querySelectorAll('.plan-cta'),
    features: precios.querySelectorAll('.plan-caracteristicas'),
    nota: precios.querySelector('.nota-precios')
  };

  // Animación de entrada con Intersection Observer
  function initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const animationObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
          
          // Animar precios cuando son visibles
          if (entry.target.classList.contains('plan-item')) {
            const priceElement = entry.target.querySelector('.plan-precio strong');
            if (priceElement) {
              animatePrice(priceElement);
            }
            
            // Animar características una por una
            const features = entry.target.querySelectorAll('.plan-caracteristicas li');
            animateFeatures(features);
          }
          
          animationObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Pausar animaciones inicialmente
    const animatedElements = precios.querySelectorAll('[style*="animation"]');
    animatedElements.forEach(el => {
      if (window.getComputedStyle(el).animationName !== 'none') {
        el.style.animationPlayState = 'paused';
        animationObserver.observe(el);
      }
    });
  }

  // Animación de contador para precios
  function animatePrice(priceElement) {
    const finalPrice = parseInt(priceElement.textContent.replace(/[^\d]/g, ''));
    const duration = 1200;
    const steps = 40;
    const increment = finalPrice / steps;
    let currentPrice = 0;
    let step = 0;

    // Formatear número con comas
    function formatNumber(num) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    const priceAnimation = setInterval(() => {
      currentPrice += increment;
      step++;
      
      if (step >= steps) {
        currentPrice = finalPrice;
        clearInterval(priceAnimation);
        
        // Efecto de pulse al completar
        priceElement.style.transform = 'scale(1.05)';
        setTimeout(() => {
          priceElement.style.transform = 'scale(1)';
        }, 200);
      }
      
      priceElement.textContent = `USD ${formatNumber(Math.round(currentPrice))}`;
    }, duration / steps);
  }

  // Animar características con delay escalonado
  function animateFeatures(features) {
    features.forEach((feature, index) => {
      feature.style.opacity = '0';
      feature.style.transform = 'translateX(-20px)';
      feature.style.transition = 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      
      setTimeout(() => {
        feature.style.opacity = '1';
        feature.style.transform = 'translateX(0)';
      }, 100 + (index * 50));
    });
  }

  // Efecto hover 3D sutil en las tarjetas
  function init3DHover() {
    elements.plans.forEach((plan, index) => {
      let isHovering = false;
      const isRecommended = index === 1; // Plan del medio

      plan.addEventListener('mouseenter', function() {
        isHovering = true;
        
        // Reducir opacidad de otros planes
        elements.plans.forEach((otherPlan, otherIndex) => {
          if (otherIndex !== index) {
            otherPlan.style.opacity = '0.7';
            otherPlan.style.transform = 'scale(0.98)';
          }
        });
      });

      plan.addEventListener('mouseleave', function() {
        isHovering = false;
        this.style.transform = '';
        
        // Restaurar otros planes
        elements.plans.forEach(p => {
          p.style.opacity = '1';
          p.style.transform = '';
        });
      });

      plan.addEventListener('mousemove', function(e) {
        if (!isHovering) return;

        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateY = ((x - centerX) / centerX) * 5;
        const rotateX = ((centerY - y) / centerY) * 5;
        
        this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      });
    });
  }

  // Highlight del plan recomendado
  function highlightRecommended() {
    const recommendedPlan = elements.plans[1]; // Plan del medio
    if (!recommendedPlan) return;

    // Añadir efecto de brillo sutil
    const shimmer = document.createElement('div');
    shimmer.className = 'plan-shimmer';
    shimmer.style.cssText = `
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      background: linear-gradient(45deg, transparent 30%, rgba(0, 113, 227, 0.1) 50%, transparent 70%);
      border-radius: 18px;
      z-index: -1;
      opacity: 0;
      animation: shimmer 3s ease-in-out infinite;
    `;
    
    recommendedPlan.style.position = 'relative';
    recommendedPlan.appendChild(shimmer);
  }

  // Smooth scroll para CTAs
  elements.ctaButtons.forEach((button, index) => {
    button.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        
        // Guardar plan seleccionado
        const planName = this.closest('.plan-item').querySelector('h3').textContent;
        sessionStorage.setItem('selectedPlan', planName);
        
        // Efecto de selección
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
          this.style.transform = '';
        }, 200);
        
        // Scroll suave
        const target = document.querySelector(href);
        if (target) {
          const headerHeight = 60;
          const targetPosition = target.offsetTop - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });

    // Efecto magnético en botones
    let boundingRect;
    
    button.addEventListener('mouseenter', function() {
      boundingRect = this.getBoundingClientRect();
    });
    
    button.addEventListener('mousemove', function(e) {
      if (!boundingRect) return;
      
      const x = e.clientX - boundingRect.left - boundingRect.width / 2;
      const y = e.clientY - boundingRect.top - boundingRect.height / 2;
      
      this.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) scale(1.02)`;
    });
    
    button.addEventListener('mouseleave', function() {
      this.style.transform = '';
      boundingRect = null;
    });
  });

  // Tooltip informativo al hover en características
  function initFeatureTooltips() {
    const tooltips = {
      'Diseño responsivo': 'Se adapta perfectamente a todos los dispositivos',
      'SEO': 'Optimización para aparecer en Google',
      'Integración de pagos': 'Acepta pagos con tarjeta y más',
      'Automatización': 'Procesos que funcionan solos 24/7',
      'Dashboard': 'Panel de control para gestionar todo'
    };

    elements.features.forEach(list => {
      const items = list.querySelectorAll('li');
      
      items.forEach(item => {
        item.style.cursor = 'help';
        
        item.addEventListener('mouseenter', function(e) {
          const text = this.textContent.toLowerCase();
          let tooltipText = '';
          
          // Buscar coincidencias en el texto
          Object.keys(tooltips).forEach(key => {
            if (text.includes(key.toLowerCase())) {
              tooltipText = tooltips[key];
            }
          });
          
          if (tooltipText) {
            showTooltip(e, tooltipText);
          }
        });
        
        item.addEventListener('mouseleave', hideTooltip);
      });
    });
  }

  // Mostrar tooltip
  function showTooltip(event, text) {
    const tooltip = document.createElement('div');
    tooltip.className = 'feature-tooltip';
    tooltip.textContent = text;
    tooltip.style.cssText = `
      position: absolute;
      background: #1d1d1f;
      color: #ffffff;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 13px;
      white-space: nowrap;
      z-index: 1000;
      pointer-events: none;
      opacity: 0;
      transform: translateY(5px);
      transition: all 0.2s ease;
    `;
    
    document.body.appendChild(tooltip);
    
    const rect = event.target.getBoundingClientRect();
    tooltip.style.left = rect.left + 'px';
    tooltip.style.top = (rect.top - 35) + 'px';
    
    setTimeout(() => {
      tooltip.style.opacity = '1';
      tooltip.style.transform = 'translateY(0)';
    }, 10);
  }

  // Ocultar tooltip
  function hideTooltip() {
    const tooltip = document.querySelector('.feature-tooltip');
    if (tooltip) {
      tooltip.style.opacity = '0';
      setTimeout(() => tooltip.remove(), 200);
    }
  }

  // Comparador de planes simplificado
  function initPlanComparison() {
    const compareBtn = document.createElement('button');
        compareBtn.className = 'compare-toggle';
    compareBtn.innerHTML = 'Comparar planes';
    compareBtn.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #000000;
      color: #ffffff;
      padding: 12px 24px;
      border-radius: 50px;
      border: none;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      z-index: 100;
      transition: all 0.3s ease;
      opacity: 0;
      transform: translateY(20px);
    `;
    
    document.body.appendChild(compareBtn);
    
    // Mostrar botón cuando los planes sean visibles
    const planObserver = new IntersectionObserver((entries) => {
      const isVisible = entries.some(entry => entry.isIntersecting);
      compareBtn.style.opacity = isVisible ? '1' : '0';
      compareBtn.style.transform = isVisible ? 'translateY(0)' : 'translateY(20px)';
    }, { threshold: 0.2 });
    
    elements.plans.forEach(plan => planObserver.observe(plan));
    
    // Toggle comparación
    compareBtn.addEventListener('click', () => {
      const isComparing = document.body.classList.contains('comparing-plans');
      
      if (isComparing) {
        document.body.classList.remove('comparing-plans');
        compareBtn.innerHTML = 'Comparar planes';
        removeComparisonHighlights();
      } else {
        document.body.classList.add('comparing-plans');
        compareBtn.innerHTML = 'Cerrar comparación';
        addComparisonHighlights();
      }
    });
  }

  // Añadir highlights de comparación
  function addComparisonHighlights() {
    elements.plans.forEach(plan => {
      plan.style.outline = '2px dashed #0071e3';
      plan.style.outlineOffset = '4px';
    });
  }

  // Remover highlights de comparación
  function removeComparisonHighlights() {
    elements.plans.forEach(plan => {
      plan.style.outline = '';
      plan.style.outlineOffset = '';
    });
  }

  // Indicador de precio más popular
  function showPopularIndicator() {
    const popularPlan = elements.plans[1]; // Plan del medio
    if (!popularPlan) return;
    
    const indicator = document.createElement('div');
    indicator.className = 'popular-indicator';
    indicator.innerHTML = '⭐ Más elegido';
    indicator.style.cssText = `
      position: absolute;
      top: -40px;
      right: 20px;
      background: #ffcc00;
      color: #1d1d1f;
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
      animation: bounce 2s ease-in-out infinite;
      z-index: 10;
    `;
    
    popularPlan.style.position = 'relative';
    popularPlan.appendChild(indicator);
  }

  // Calculadora de ROI simple
  function initROICalculator() {
    const calculator = document.createElement('div');
    calculator.className = 'roi-calculator';
    calculator.innerHTML = `
      <p>💡 Un sitio web profesional puede aumentar tus ventas hasta un 40%</p>
    `;
    calculator.style.cssText = `
      text-align: center;
      padding: 16px;
      background: #f5f5f7;
      border-radius: 12px;
      margin: 40px auto;
      max-width: 600px;
      font-size: 14px;
      color: #6e6e73;
      opacity: 0;
      transform: translateY(20px);
      animation: fadeInUp 0.8s ease 0.8s forwards;
    `;
    
    const container = precios.querySelector('.container-precios');
    container.insertBefore(calculator, container.querySelector('.nota-precios'));
  }

  // Inicialización
  initScrollAnimations();
  init3DHover();
  highlightRecommended();
  initFeatureTooltips();
  initPlanComparison();
  showPopularIndicator();
  initROICalculator();

  // Accesibilidad - Navegación con teclado
  elements.plans.forEach((plan, index) => {
    plan.setAttribute('tabindex', '0');
    
    plan.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const cta = plan.querySelector('.plan-cta');
        if (cta) cta.click();
      }
      
      // Navegación con flechas
      if (e.key === 'ArrowRight' && elements.plans[index + 1]) {
        elements.plans[index + 1].focus();
      }
      if (e.key === 'ArrowLeft' && elements.plans[index - 1]) {
        elements.plans[index - 1].focus();
      }
    });
  });

  // Performance - Limpiar eventos en resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // Reinicializar efectos si es necesario
      if (window.innerWidth <= 768) {
        // Desactivar efectos 3D en móvil
        elements.plans.forEach(plan => {
          plan.style.transform = '';
        });
      }
    }, 250);
  });

  // Respeta prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Desactivar animaciones complejas
    precios.querySelectorAll('*').forEach(el => {
      if (el.style.animation) {
        el.style.animation = 'none';
        el.style.opacity = '1';
        el.style.transform = 'none';
      }
    });
  }
});

// Estilos adicionales dinámicos
const preciosStyles = document.createElement('style');
preciosStyles.textContent = `
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }
  
  .plan-item {
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  
  .plan-item:focus {
    outline: 2px solid #0071e3;
    outline-offset: 4px;
  }
  
  .comparing-plans .plan-item {
    cursor: pointer;
  }
  
  .feature-tooltip::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: #1d1d1f;
  }
  
  @media (prefers-color-scheme: dark) {
    .roi-calculator {
      background: #1d1d1f;
      color: #a1a1a6;
    }
    
    .compare-toggle {
      background: #f5f5f7;
      color: #000000;
    }
    
    .popular-indicator {
      background: #ffd60a;
      color: #000000;
    }
  }
`;
document.head.appendChild(preciosStyles);





















// FAQ Section JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Sección FAQ
  const faq = document.getElementById('faq');
  if (!faq) return;

  // Elementos de la sección
  const elements = {
    title: faq.querySelector('#faq-titulo'),
    description: faq.querySelector('.container-faq > p'),
    items: faq.querySelectorAll('.faq-item'),
    summaries: faq.querySelectorAll('.faq-item summary'),
    container: faq.querySelector('.container-faq')
  };

  // Control de acordeón - Solo uno abierto a la vez
  function initAccordion() {
    elements.items.forEach((item, index) => {
      const summary = item.querySelector('summary');
      
      summary.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Si está abierto, cerrarlo
        if (item.hasAttribute('open')) {
          closeItem(item);
        } else {
          // Cerrar todos los demás
          elements.items.forEach(otherItem => {
            if (otherItem !== item && otherItem.hasAttribute('open')) {
              closeItem(otherItem);
            }
          });
          
          // Abrir el actual
          openItem(item);
        }
        
        // Guardar estado en sessionStorage
        sessionStorage.setItem('faq-active', item.hasAttribute('open') ? index : -1);
      });
    });
  }

  // Abrir item con animación
  function openItem(item) {
    item.setAttribute('open', '');
    
    // Animar contenido
    const content = item.querySelector('p, ul, ol');
    if (content) {
      content.style.opacity = '0';
      content.style.transform = 'translateY(-10px)';
      
      setTimeout(() => {
        content.style.transition = 'all 0.3s ease';
        content.style.opacity = '1';
        content.style.transform = 'translateY(0)';
      }, 10);
    }
    
    // Scroll suave al item si está fuera de vista
    setTimeout(() => {
      const rect = item.getBoundingClientRect();
      const headerHeight = 60;
      
      if (rect.top < headerHeight) {
        window.scrollTo({
          top: window.pageYOffset + rect.top - headerHeight - 20,
          behavior: 'smooth'
        });
      }
    }, 100);
  }

  // Cerrar item con animación
  function closeItem(item) {
    const content = item.querySelector('p, ul, ol');
    if (content) {
      content.style.transition = 'all 0.2s ease';
      content.style.opacity = '0';
      content.style.transform = 'translateY(-10px)';
      
      setTimeout(() => {
        item.removeAttribute('open');
      }, 200);
    } else {
      item.removeAttribute('open');
    }
  }

  // Buscador de FAQs
  function initSearch() {
    const searchContainer = document.createElement('div');
    searchContainer.className = 'faq-search';
    searchContainer.innerHTML = `
      <input type="search" placeholder="Buscar en preguntas frecuentes..." aria-label="Buscar FAQ">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16z" stroke="currentColor" stroke-width="2"/>
        <path d="M15 15L19 19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `;
    
    searchContainer.style.cssText = `
      position: relative;
      max-width: 600px;
      margin: 0 auto 40px;
      opacity: 0;
      transform: translateY(20px);
      animation: fadeInUp 0.8s ease 0.3s forwards;
    `;
    
    const searchInput = searchContainer.querySelector('input');
    searchInput.style.cssText = `
      width: 100%;
      padding: 16px 48px 16px 20px;
      border: 1px solid #d2d2d7;
      border-radius: 12px;
      font-size: 16px;
      background: #f5f5f7;
      transition: all 0.3s ease;
      font-family: inherit;
    `;
    
    const searchIcon = searchContainer.querySelector('svg');
    searchIcon.style.cssText = `
      position: absolute;
      right: 16px;
      top: 50%;
      transform: translateY(-50%);
      color: #86868b;
      pointer-events: none;
    `;
    
    // Insertar después de la descripción
    elements.container.insertBefore(searchContainer, elements.items[0]);
    
    // Funcionalidad de búsqueda
    searchInput.addEventListener('input', debounce(function(e) {
      const query = e.target.value.toLowerCase();
      filterFAQs(query);
    }, 300));
    
    // Limpiar búsqueda con ESC
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        e.target.value = '';
        filterFAQs('');
        e.target.blur();
      }
    });
  }

  // Filtrar FAQs
  function filterFAQs(query) {
    let visibleCount = 0;
    
    elements.items.forEach((item, index) => {
      const summary = item.querySelector('summary').textContent.toLowerCase();
      const content = item.textContent.toLowerCase();
      
      if (query === '' || summary.includes(query) || content.includes(query)) {
        item.style.display = '';
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
        visibleCount++;
        
        // Highlight match
        if (query) {
          highlightText(item, query);
        } else {
          removeHighlight(item);
        }
           } else {
        item.style.opacity = '0.3';
        item.style.transform = 'scale(0.98)';
        setTimeout(() => {
          item.style.display = 'none';
        }, 300);
      }
    });
    
    // Mostrar mensaje si no hay resultados
    showNoResultsMessage(visibleCount === 0 && query !== '');
  }

  // Resaltar texto encontrado
  function highlightText(item, query) {
    const summary = item.querySelector('summary');
    const originalText = summary.textContent;
    const regex = new RegExp(`(${query})`, 'gi');
    
    // Solo resaltar en el summary para no romper el HTML interno
    if (originalText.toLowerCase().includes(query)) {
      summary.innerHTML = originalText.replace(regex, '<mark style="background: #ffeb3b; padding: 2px 4px; border-radius: 4px;">$1</mark>');
    }
  }

  // Remover resaltado
  function removeHighlight(item) {
    const summary = item.querySelector('summary');
    const marks = summary.querySelectorAll('mark');
    marks.forEach(mark => {
      const text = mark.textContent;
      mark.replaceWith(text);
    });
  }

  // Mensaje cuando no hay resultados
  function showNoResultsMessage(show) {
    let message = faq.querySelector('.no-results');
    
    if (show && !message) {
      message = document.createElement('div');
      message.className = 'no-results';
      message.innerHTML = `
        <p>No se encontraron preguntas que coincidan con tu búsqueda.</p>
        <p>Prueba con otros términos o <a href="#contacto">contáctanos directamente</a>.</p>
      `;
      message.style.cssText = `
        text-align: center;
        padding: 60px 20px;
        color: #86868b;
        font-size: 16px;
        opacity: 0;
        animation: fadeIn 0.3s ease forwards;
      `;
      elements.container.appendChild(message);
    } else if (!show && message) {
      message.style.opacity = '0';
      setTimeout(() => message.remove(), 300);
    }
  }

  // Categorías de FAQs
  function initCategories() {
    const categories = [
      { name: 'General', icon: '🌐', items: [0, 1] },
      { name: 'Técnico', icon: '⚙️', items: [2, 3] },
      { name: 'Proceso', icon: '📋', items: [4, 5, 6] },
      { name: 'Seguridad', icon: '🔒', items: [7] }
    ];
    
    const categoryNav = document.createElement('nav');
    categoryNav.className = 'faq-categories';
    categoryNav.style.cssText = `
      display: flex;
      gap: 12px;
      justify-content: center;
      margin-bottom: 40px;
      flex-wrap: wrap;
      opacity: 0;
      transform: translateY(20px);
      animation: fadeInUp 0.8s ease 0.4s forwards;
    `;
    
    // Botón "Todas"
    const allBtn = createCategoryButton('Todas', '📚', true);
    allBtn.addEventListener('click', () => showAllCategories());
    categoryNav.appendChild(allBtn);
    
    // Crear botones de categoría
    categories.forEach(cat => {
      const btn = createCategoryButton(cat.name, cat.icon);
      btn.addEventListener('click', () => filterByCategory(cat.items));
      categoryNav.appendChild(btn);
    });
    
    // Insertar después del buscador
    const searchBox = faq.querySelector('.faq-search');
    searchBox.after(categoryNav);
  }

  // Crear botón de categoría
  function createCategoryButton(name, icon, active = false) {
    const button = document.createElement('button');
    button.className = `category-btn ${active ? 'active' : ''}`;
    button.innerHTML = `<span>${icon}</span> ${name}`;
    button.style.cssText = `
      padding: 8px 20px;
      border: 1px solid ${active ? '#000000' : '#d2d2d7'};
      background: ${active ? '#000000' : 'transparent'};
      color: ${active ? '#ffffff' : '#1d1d1f'};
      border-radius: 50px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      font-family: inherit;
    `;
    return button;
  }

  // Filtrar por categoría
  function filterByCategory(itemIndices) {
    elements.items.forEach((item, index) => {
      if (itemIndices.includes(index)) {
        item.style.display = '';
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      } else {
        item.style.opacity = '0';
        item.style.transform = 'translateY(10px)';
        setTimeout(() => {
          item.style.display = 'none';
        }, 300);
      }
    });
    
    // Actualizar botones activos
    updateCategoryButtons();
  }

  // Mostrar todas las categorías
  function showAllCategories() {
    elements.items.forEach(item => {
      item.style.display = '';
      item.style.opacity = '1';
      item.style.transform = 'translateY(0)';
    });
    updateCategoryButtons();
  }

  // Actualizar estado de botones
  function updateCategoryButtons() {
    const buttons = faq.querySelectorAll('.category-btn');
    buttons.forEach((btn, index) => {
      if (index === 0) { // Botón "Todas"
        btn.classList.add('active');
        btn.style.background = '#000000';
        btn.style.color = '#ffffff';
        btn.style.borderColor = '#000000';
      } else {
        btn.classList.remove('active');
        btn.style.background = 'transparent';
        btn.style.color = '#1d1d1f';
        btn.style.borderColor = '#d2d2d7';
      }
    });
  }

  // Copiar pregunta al portapapeles
  function initCopyFeature() {
    elements.summaries.forEach(summary => {
      const copyBtn = document.createElement('button');
      copyBtn.className = 'copy-btn';
      copyBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="5" y="5" width="9" height="9" rx="1" stroke="currentColor" stroke-width="1.5"/>
          <path d="M11 5V3C11 2.44772 10.5523 2 10 2H3C2.44772 2 2 2.44772 2 3V10C2 10.5523 2.44772 11 3 11H5" stroke="currentColor" stroke-width="1.5"/>
        </svg>
      `;
      copyBtn.style.cssText = `
        position: absolute;
        right: 60px;
        top: 50%;
        transform: translateY(-50%);
        background: transparent;
        border: none;
        color: #86868b;
        cursor: pointer;
        padding: 4px;
        opacity: 0;
        transition: all 0.3s ease;
      `;
      
      copyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        copyToClipboard(summary.textContent);
      });
      
      summary.style.position = 'relative';
      summary.appendChild(copyBtn);
      
      // Mostrar botón al hover
      summary.addEventListener('mouseenter', () => {
        copyBtn.style.opacity = '1';
      });
      
      summary.addEventListener('mouseleave', () => {
        copyBtn.style.opacity = '0';
      });
    });
  }

  // Copiar al portapapeles
  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      showToast('Pregunta copiada al portapapeles');
    });
  }

  // Toast notification
  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%) translateY(100px);
      background: #000000;
      color: #ffffff;
      padding: 12px 24px;
      border-radius: 50px;
      font-size: 14px;
      z-index: 1000;
      transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.transform = 'translateX(-50%) translateY(0)';
    }, 10);
    
    setTimeout(() => {
      toast.style.transform = 'translateX(-50%) translateY(100px)';
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  }

  // Animación de entrada
  function initScrollAnimation() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    const animatedElements = faq.querySelectorAll('[style*="animation"]');
    animatedElements.forEach(el => {
      if (window.getComputedStyle(el).animationName !== 'none') {
        el.style.animationPlayState = 'paused';
        observer.observe(el);
      }
    });
  }

  // Debounce utility
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Restaurar estado guardado
  function restoreState() {
    const activeIndex = sessionStorage.getItem('faq-active');
    if (activeIndex && activeIndex !== '-1') {
      const item = elements.items[activeIndex];
      if (item) {
        openItem(item);
      }
    }
  }

  // Inicialización
  initAccordion();
  initSearch();
  initCategories();
  initCopyFeature();
  initScrollAnimation();
  restoreState();

  // Analytics - Track FAQ interactions
  elements.items.forEach((item, index) => {
    item.addEventListener('toggle', () => {
      if (item.hasAttribute('open')) {
        console.log(`FAQ opened: ${item.querySelector('summary').textContent}`);
      }
    });
  });

  // Accesibilidad - Navegación con teclado
  elements.summaries.forEach((summary, index) => {
    summary.addEventListener('keydown', (e) => {
      switch(e.key) {
        case 'ArrowDown':
          e.preventDefault();
          const next = elements.summaries[index + 1];
          if (next) next.focus();
          break;
        case 'ArrowUp':
          e.preventDefault();
          const prev = elements.summaries[index - 1];
          if (prev) prev.focus();
          break;
        case 'Home':
          e.preventDefault();
          elements.summaries[0].focus();
          break;
        case 'End':
          e.preventDefault();
          elements.summaries[elements.summaries.length - 1].focus();
          break;
      }
    });
  });
});

// Estilos adicionales
const faqStyles = document.createElement('style');
faqStyles.textContent = `
  .faq-search input:focus {
    outline: none;
    border-color: #0071e3;
    background: #ffffff;
  }
  
  .category-btn:hover:not(.active) {
    background: #f5f5f7;
  }
  
  .copy-btn:hover {
    color: #0071e3;
  }
  
  @media (prefers-color-scheme: dark) {
    .faq-search input {
      background: #1d1d1f;
      border-color: #38383a;
      color: #f5f5f7;
    }
    
    .faq-search input::placeholder {
      color: #6e6e73;
    }
    
    .faq-search svg {
      color: #6e6e73;
    }
    
    .category-btn:not(.active) {
      border-color: #38383a;
      color: #f5f5f7;
    }
    
    .category-btn:hover:not(.active) {
      background: #2d2d2d;
    }
    
    .category-btn.active {
      background: #f5f5f7;
      color: #000000;
      border-color: #f5f5f7;
    }
    
    mark {
      background: #ffd60a !important;
      color: #000000 !important;
    }
    
    .toast {
      background: #f5f5f7;
      color: #000000;
    }
  }
`;
document.head.appendChild(faqStyles);



















// CTA Section JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Sección CTA
  const cta = document.getElementById('cta');
  if (!cta) return;

  // Elementos de la sección
  const elements = {
    title: cta.querySelector('#cta-titulo'),
    description: cta.querySelector('.container-cta > p'),
    button: cta.querySelector('.cta-boton'),
    figure: cta.querySelector('.cta-figura'),
    image: cta.querySelector('.cta-figura img'),
    container: cta.querySelector('.container-cta')
  };

  // Animación de entrada con Intersection Observer
  function initScrollAnimations() {
    const observerOptions = {
      threshold: 0.2,
      rootMargin: '0px 0px -50px 0px'
    };

    const animationObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
          
          // Efecto especial para el título
          if (entry.target.id === 'cta-titulo') {
            animateTitle();
          }
          
          animationObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Pausar animaciones inicialmente
    const animatedElements = cta.querySelectorAll('[style*="animation"]');
    animatedElements.forEach(el => {
      if (window.getComputedStyle(el).animationName !== 'none') {
        el.style.animationPlayState = 'paused';
        animationObserver.observe(el);
      }
    });
  }

  // Animación especial del título
  function animateTitle() {
    const text = elements.title.textContent;
    const words = text.split(' ');
    elements.title.textContent = '';
    elements.title.style.opacity = '1';
    
    words.forEach((word, index) => {
      const span = document.createElement('span');
      span.textContent = word + ' ';
      span.style.cssText = `
        display: inline-block;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.6s cubic-bezier(0.65, 0, 0.35, 1) ${index * 0.1}s;
      `;
      elements.title.appendChild(span);
      
      setTimeout(() => {
        span.style.opacity = '1';
        span.style.transform = 'translateY(0)';
      }, 50);
    });
  }

  // Efecto magnético avanzado en el botón
  function initMagneticButton() {
    if (!elements.button) return;

    let boundingRect;
    let isHovering = false;
    let mouseX = 0;
    let mouseY = 0;
    let buttonX = 0;
    let buttonY = 0;

    elements.button.addEventListener('mouseenter', function() {
      isHovering = true;
      boundingRect = this.getBoundingClientRect();
      this.style.willChange = 'transform';
    });

    elements.button.addEventListener('mouseleave', function() {
      isHovering = false;
      this.style.transform = '';
      this.style.willChange = 'auto';
      buttonX = 0;
      buttonY = 0;
    });

    elements.button.addEventListener('mousemove', function(e) {
      if (!isHovering || !boundingRect) return;
      
      mouseX = e.clientX - boundingRect.left - boundingRect.width / 2;
      mouseY = e.clientY - boundingRect.top - boundingRect.height / 2;
    });

    // Animación suave del efecto magnético
    function animateMagneticEffect() {
      if (isHovering) {
        buttonX += (mouseX * 0.2 - buttonX) * 0.1;
        buttonY += (mouseY * 0.2 - buttonY) * 0.1;
        
        elements.button.style.transform = `translate(${buttonX}px, ${buttonY}px) scale(1.05)`;
      }
      
      requestAnimationFrame(animateMagneticEffect);
    }
    
    animateMagneticEffect();
  }

  // Efecto parallax en la imagen
  function initImageParallax() {
    if (!elements.image) return;

    let ticking = false;
    
    function updateParallax() {
      const scrolled = window.pageYOffset;
      const rect = elements.figure.getBoundingClientRect();
      const speed = 0.5;
      
      // Solo aplicar cuando la imagen está en viewport
      if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
        const yPos = -(scrolled - cta.offsetTop) * speed;
        elements.image.style.transform = `translateY(${yPos * 0.2}px) scale(1.05)`;
      }
      
      ticking = false;
    }

    function requestTick() {
      if (!ticking && window.innerWidth > 768) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }

    window.addEventListener('scroll', requestTick);
  }

  // Lazy loading para la imagen
  function initLazyLoading() {
    if (!elements.image || !elements.image.dataset.src) return;

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const tempImg = new Image();
          
          tempImg.onload = function() {
            img.src = this.src;
            img.classList.add('loaded');
            img.style.opacity = '0';
            
            setTimeout(() => {
              img.style.transition = 'opacity 0.5s ease';
              img.style.opacity = '1';
            }, 50);
          };
          
          tempImg.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    }, { rootMargin: '50px' });

    imageObserver.observe(elements.image);
  }

  // Partículas interactivas
  function initParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles-container';
    particlesContainer.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      overflow: hidden;
    `;
    
    elements.container.appendChild(particlesContainer);

    // Crear partículas al hacer click en el botón
    elements.button.addEventListener('click', (e) => {
      createParticleBurst(e.clientX, e.clientY, particlesContainer);
    });
  }

  // Crear explosión de partículas
  function createParticleBurst(x, y, container) {
    const colors = ['#007aff', '#5856d6', '#ff3b30', '#ff9500', '#34c759'];
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      const size = Math.random() * 8 + 4;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const angle = (Math.PI * 2 * i) / particleCount;
      const velocity = Math.random() * 200 + 100;
      
      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: 50%;
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
        transform: translate(-50%, -50%);
      `;
      
      container.appendChild(particle);
      
      // Animar partícula
      const animation = particle.animate([
        {
          transform: 'translate(-50%, -50%) scale(1)',
          opacity: 1
        },
        {
          transform: `translate(calc(-50% + ${Math.cos(angle) * velocity}px), calc(-50% + ${Math.sin(angle) * velocity}px)) scale(0)`,
          opacity: 0
        }
      ], {
        duration: 1000,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      });
      
      animation.onfinish = () => particle.remove();
    }
  }

  // Smooth scroll y tracking
  elements.button.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    
    if (href && href.startsWith('#')) {
      e.preventDefault();
      
      // Guardar intención
      sessionStorage.setItem('cta-clicked', 'true');
      sessionStorage.setItem('cta-timestamp', Date.now());
      
      // Efecto visual de confirmación
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = '';
      }, 200);
      
      // Vibración sutil en móvil
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
      
      // Scroll suave
      const target = document.querySelector(href);
      if (target) {
        const headerHeight = 60;
        const targetPosition = target.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Focus en el target después del scroll
        setTimeout(() => {
          target.setAttribute('tabindex', '-1');
          target.focus();
        }, 1000);
      }
    }
  });

  // Contador de tiempo en página
  function initEngagementTracking() {
    let timeOnSection = 0;
    let isVisible = false;
    
    const visibilityObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isVisible = entry.isIntersecting;
      });
    }, { threshold: 0.5 });
    
    visibilityObserver.observe(cta);
    
    // Actualizar tiempo cada segundo
    setInterval(() => {
      if (isVisible) {
        timeOnSection++;
        
        // Mostrar tooltip después de 5 segundos
        if (timeOnSection === 5) {
          showTooltip();
        }
      }
    }, 1000);
  }

  // Mostrar tooltip motivacional
  function showTooltip() {
    const tooltip = document.createElement('div');
    tooltip.className = 'cta-tooltip';
    tooltip.textContent = '💡 ¿Sabías que el 73% de nuestros clientes ven resultados en las primeras 2 semanas?';
    tooltip.style.cssText = `
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%) translateY(20px);
      background: #000000;
      color: #ffffff;
      padding: 12px 20px;
      border-radius: 12px;
      font-size: 14px;
      white-space: nowrap;
      opacity: 0;
      transition: all 0.3s ease;
      pointer-events: none;
      z-index: 10;
    `;
    
    elements.button.style.position = 'relative';
    elements.button.appendChild(tooltip);
    
    setTimeout(() => {
      tooltip.style.opacity = '1';
      tooltip.style.transform = 'translateX(-50%) translateY(0)';
    }, 100);
    
    setTimeout(() => {
      tooltip.style.opacity = '0';
      setTimeout(() => tooltip.remove(), 300);
    }, 5000);
  }

  // Efecto de respiración en el botón
  function initBreathingEffect() {
    let breathingAnimation;
    
    const startBreathing = () => {
      breathingAnimation = elements.button.animate([
        { transform: 'scale(1)', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' },
        { transform: 'scale(1.02)', boxShadow: '0 6px 25px rgba(0, 0, 0, 0.12)' },
        { transform: 'scale(1)', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' }
            ], {
        duration: 3000,
        iterations: Infinity,
        easing: 'ease-in-out'
      });
    };
    
    // Iniciar después de 3 segundos de inactividad
    let inactivityTimer;
    
    const resetInactivity = () => {
      if (breathingAnimation) {
        breathingAnimation.cancel();
      }
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(startBreathing, 3000);
    };
    
    // Detectar actividad
    ['mousemove', 'scroll', 'keydown', 'touchstart'].forEach(event => {
      window.addEventListener(event, resetInactivity, { passive: true });
    });
    
    resetInactivity();
  }

  // Cambio dinámico de texto según hora del día
  function initDynamicGreeting() {
    const hour = new Date().getHours();
    let greeting;
    
    if (hour >= 5 && hour < 12) {
      greeting = '¡Buenos días! ¿Listo para empezar?';
    } else if (hour >= 12 && hour < 18) {
      greeting = '¡Buenas tardes! ¿Listo para empezar?';
    } else if (hour >= 18 && hour < 22) {
      greeting = '¡Buenas noches! ¿Listo para empezar?';
    } else {
      greeting = '¿Trabajando tarde? ¡Nosotros también estamos aquí!';
    }
    
    // Actualizar título con transición suave
    if (elements.title && hour >= 22 || hour < 5) {
      elements.title.style.transition = 'opacity 0.3s ease';
      elements.title.style.opacity = '0';
      
      setTimeout(() => {
        elements.title.textContent = greeting;
        elements.title.style.opacity = '1';
      }, 300);
    }
  }

  // Confetti al hacer hover prolongado
  function initConfettiEffect() {
    let hoverTimer;
    
    elements.button.addEventListener('mouseenter', () => {
      hoverTimer = setTimeout(() => {
        createConfetti();
      }, 2000); // 2 segundos de hover
    });
    
    elements.button.addEventListener('mouseleave', () => {
      clearTimeout(hoverTimer);
    });
  }

  // Crear efecto confetti
  function createConfetti() {
    const confettiCount = 30;
    const container = elements.container;
    const rect = elements.button.getBoundingClientRect();
    
    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      
      const colors = ['#007aff', '#5856d6', '#ff3b30', '#ff9500', '#34c759'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      confetti.style.cssText = `
        position: absolute;
        width: 10px;
        height: 10px;
        background: ${color};
        left: ${rect.left + rect.width / 2}px;
        top: ${rect.top + rect.height / 2}px;
        pointer-events: none;
        z-index: 1000;
      `;
      
      document.body.appendChild(confetti);
      
      // Animación
      const angle = (Math.PI * 2 * i) / confettiCount;
      const velocity = Math.random() * 300 + 200;
      const rotateAngle = Math.random() * 720 - 360;
      
      confetti.animate([
        {
          transform: 'translate(-50%, -50%) rotate(0deg) scale(1)',
          opacity: 1
        },
        {
          transform: `translate(calc(-50% + ${Math.cos(angle) * velocity}px), calc(-50% + ${Math.sin(angle) * velocity}px + 100px)) rotate(${rotateAngle}deg) scale(0)`,
          opacity: 0
        }
      ], {
        duration: 1500,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      }).onfinish = () => confetti.remove();
    }
  }

  // Modo presentación (fullscreen)
  function initPresentationMode() {
    // Doble click para entrar en modo presentación
    elements.container.addEventListener('dblclick', () => {
      if (!document.fullscreenElement) {
        cta.requestFullscreen().then(() => {
          cta.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          `;
          
          showExitHint();
        });
      }
    });
    
    // Salir con ESC
    document.addEventListener('fullscreenchange', () => {
      if (!document.fullscreenElement) {
        cta.style.cssText = '';
      }
    });
  }

  // Mostrar hint para salir de fullscreen
  function showExitHint() {
    const hint = document.createElement('div');
    hint.textContent = 'Presiona ESC para salir';
    hint.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 14px;
      z-index: 10000;
      animation: fadeIn 0.3s ease;
    `;
    
    document.body.appendChild(hint);
    
    setTimeout(() => {
      hint.style.opacity = '0';
      setTimeout(() => hint.remove(), 300);
    }, 3000);
  }

  // Inicialización
  initScrollAnimations();
  initMagneticButton();
  initImageParallax();
  initLazyLoading();
  initParticles();
  initEngagementTracking();
  initBreathingEffect();
  initDynamicGreeting();
  initConfettiEffect();
  initPresentationMode();

  // Analytics
  elements.button.addEventListener('click', () => {
    console.log('CTA clicked:', {
      timestamp: new Date().toISOString(),
      pageTime: performance.now() / 1000,
      source: 'cta-section'
    });
  });

  // Accesibilidad - Anunciar cambios dinámicos
  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('aria-atomic', 'true');
  liveRegion.className = 'sr-only';
  liveRegion.style.cssText = `
    position: absolute;
    left: -10000px;
    width: 1px;
    height: 1px;
    overflow: hidden;
  `;
  document.body.appendChild(liveRegion);

  // Cleanup
  window.addEventListener('beforeunload', () => {
    // Guardar tiempo de interacción
    const timeSpent = sessionStorage.getItem('cta-time') || 0;
    sessionStorage.setItem('cta-time', parseInt(timeSpent) + timeOnSection);
  });

  // Performance optimization
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Desactivar animaciones complejas
    elements.button.style.animation = 'none';
    if (elements.image) {
      elements.image.style.transform = 'none';
    }
  }
});

// Estilos adicionales dinámicos
const ctaStyles = document.createElement('style');
ctaStyles.textContent = `
  .cta-tooltip::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 8px solid transparent;
    border-top-color: #000000;
  }
  
  .particle,
  .confetti {
    will-change: transform;
  }
  
  @media (prefers-color-scheme: dark) {
    .cta-tooltip {
      background: #f5f5f7;
      color: #000000;
    }
    
    .cta-tooltip::after {
      border-top-color: #f5f5f7;
    }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;
document.head.appendChild(ctaStyles);



















/**
 * ==========================================
 * CTA SECTION - INTERACTIVE JAVASCRIPT
 * Apple-style interactions and animations
 * ==========================================
 */

// Namespace para evitar conflictos globales
const CTASection = (() => {
  'use strict';

  // Configuración y constantes
  const CONFIG = {
    animationDuration: 800,
    easingCurve: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    intersectionThreshold: 0.1,
    parallaxIntensity: 0.3,
    magneticIntensity: 0.15,
    rippleDuration: 600
  };

  // Estado de la aplicación
  const state = {
    isAnimated: false,
    isMouseOver: false,
    mousePosition: { x: 0, y: 0 },
    viewportHeight: window.innerHeight,
    isTouchDevice: 'ontouchstart' in window
  };

  // Cache de elementos DOM
  const elements = {
    section: null,
    container: null,
    title: null,
    description: null,
    ctaButton: null,
    figure: null,
    image: null,
    figcaption: null
  };

  /**
   * Inicialización del módulo
   */
  const init = () => {
    cacheElements();
    
    if (!elements.section) {
      console.warn('CTA Section: No se encontró la sección #cta');
      return;
    }

    setupEventListeners();
    setupIntersectionObserver();
    setupAnimations();
    
    if (!state.isTouchDevice) {
      setupParallaxEffect();
      setupMagneticButton();
    }
    
    setupRippleEffect();
    setupImageEffects();
    setupTextSplitAnimation();
  };

  /**
   * Cache de elementos DOM para mejor rendimiento
   */
  const cacheElements = () => {
    elements.section = document.querySelector('#cta');
    elements.container = document.querySelector('.container-cta');
    elements.title = document.querySelector('#cta-titulo');
    elements.description = document.querySelector('#cta p');
    elements.ctaButton = document.querySelector('.cta-boton');
    elements.figure = document.querySelector('.cta-figura');
    elements.image = document.querySelector('.cta-figura img');
    elements.figcaption = document.querySelector('.cta-figura figcaption');
  };

  /**
   * Configuración de event listeners
   */
  const setupEventListeners = () => {
    // Actualizar viewport en resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        state.viewportHeight = window.innerHeight;
      }, 250);
    });

    // Tracking del mouse para efectos
    if (!state.isTouchDevice) {
      document.addEventListener('mousemove', handleMouseMove);
    }

    // Mejorar rendimiento en scroll
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateParallax();
          ticking = false;
        });
        ticking = true;
      }
    });
  };

  /**
   * Manejo del movimiento del mouse
   */
  const handleMouseMove = (e) => {
    state.mousePosition = {
      x: e.clientX,
      y: e.clientY
    };
  };

  /**
   * Intersection Observer para animaciones on-scroll
   */
  const setupIntersectionObserver = () => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: CONFIG.intersectionThreshold
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !state.isAnimated) {
          triggerEntranceAnimations();
          state.isAnimated = true;
        }
      });
    }, observerOptions);

    observer.observe(elements.section);
  };

  /**
   * Animaciones de entrada
   */
  const triggerEntranceAnimations = () => {
    // Animar elementos con retraso escalonado
    const animateElement = (element, delay = 0) => {
      if (!element) return;
      
      element.style.opacity = '0';
      element.style.transform = 'translateY(30px)';
      
      setTimeout(() => {
        element.style.transition = `all ${CONFIG.animationDuration}ms ${CONFIG.easingCurve}`;
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }, delay);
    };

    animateElement(elements.title, 0);
    animateElement(elements.description, 100);
    animateElement(elements.ctaButton, 200);
    animateElement(elements.figure, 300);

    // Animación especial para la imagen
    if (elements.image) {
      setTimeout(() => {
        elements.image.style.transform = 'scale(0.95) perspective(1000px) rotateX(5deg)';
        elements.image.style.opacity = '0';
        elements.image.style.transition = `all ${CONFIG.animationDuration * 1.5}ms ${CONFIG.easingCurve}`;
        
        setTimeout(() => {
          elements.image.style.transform = 'scale(1) perspective(1000px) rotateX(2deg)';
          elements.image.style.opacity = '1';
        }, 50);
      }, 400);
    }
  };

  /**
   * Configuración de animaciones CSS personalizadas
   */
  const setupAnimations = () => {
    // Crear keyframes dinámicamente
    const style = document.createElement('style');
    style.textContent = `
      @keyframes ctaPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
      
      @keyframes ctaShine {
        0% { background-position: -200% center; }
        100% { background-position: 200% center; }
      }
      
      @keyframes ctaFloat {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        33% { transform: translateY(-10px) rotate(1deg); }
        66% { transform: translateY(-5px) rotate(-1deg); }
      }
    `;
    document.head.appendChild(style);
  };

  /**
   * Efecto parallax suave
   */
  const setupParallaxEffect = () => {
    if (!elements.figure) return;

    const updateParallax = () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * CONFIG.parallaxIntensity * -1;
      const yPos = Math.round(rate * 100) / 100;
      
      requestAnimationFrame(() => {
        elements.figure.style.transform = `translateY(${yPos}px)`;
      });
    };

    window.addEventListener('scroll', updateParallax, { passive: true });
  };

  /**
   * Botón magnético (efecto de atracción)
   */
  const setupMagneticButton = () => {
    if (!elements.ctaButton) return;

    let buttonRect = elements.ctaButton.getBoundingClientRect();
    
    // Actualizar posición del botón en resize
    window.addEventListener('resize', () => {
      buttonRect = elements.ctaButton.getBoundingClientRect();
    });

    elements.ctaButton.addEventListener('mouseenter', () => {
      state.isMouseOver = true;
      buttonRect = elements.ctaButton.getBoundingClientRect();
    });

    elements.ctaButton.addEventListener('mouseleave', () => {
      state.isMouseOver = false;
      // Reset suave
      elements.ctaButton.style.transform = 'translate(0, 0)';
    });

    document.addEventListener('mousemove', (e) => {
      if (!state.isMouseOver) return;

      const centerX = buttonRect.left + buttonRect.width / 2;
      const centerY = buttonRect.top + buttonRect.height / 2;
      
      const deltaX = (e.clientX - centerX) * CONFIG.magneticIntensity;
      const deltaY = (e.clientY - centerY) * CONFIG.magneticIntensity;
      
      requestAnimationFrame(() => {
        elements.ctaButton.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      });
    });
  };

  /**
   * Efecto ripple al hacer clic
   */
  const setupRippleEffect = () => {
    if (!elements.ctaButton) return;

    elements.ctaButton.addEventListener('click', function(e) {
      // Prevenir múltiples ripples
      const existingRipple = this.querySelector('.ripple');
      if (existingRipple) {
        existingRipple.remove();
      }

      // Crear elemento ripple
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      
      // Calcular tamaño y posición
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      // Aplicar estilos
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
        transform: scale(0);
        animation: rippleAnimation ${CONFIG.rippleDuration}ms ease-out;
      `;
      
      this.appendChild(ripple);
      
      // Limpiar después de la animación
      setTimeout(() => ripple.remove(), CONFIG.rippleDuration);
    });

    // Añadir animación ripple
    const style = document.createElement('style');
    style.textContent = `
      @keyframes rippleAnimation {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  };

  /**
   * Efectos especiales para la imagen
   */
  const setupImageEffects = () => {
    if (!elements.image || state.isTouchDevice) return;

    let isHovering = false;
    
    elements.figure.addEventListener('mouseenter', () => {
      isHovering = true;
      elements.image.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    });

    elements.figure.addEventListener('mousemove', (e) => {
      if (!isHovering) return;

      const rect = elements.figure.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;
      
      requestAnimationFrame(() => {
        elements.image.style.transform = 
          `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
      });
    });

    elements.figure.addEventListener('mouseleave', () => {
      isHovering = false;
      elements.image.style.transform = 'perspective(1000px) rotateX(2deg) rotateY(0deg) scale(1)';
    });

    // Efecto de zoom suave en click
    elements.image.addEventListener('click', () => {
      elements.image.style.transition = 'transform 0.3s ease';
      elements.image.style.transform = 'scale(0.95)';
      
      setTimeout(() => {
        elements.image.style.transform = 'scale(1)';
      }, 150);
    });
  };

  /**
   * Animación de texto letra por letra
   */
   /**
   * Animación de texto letra por letra
   */
  const setupTextSplitAnimation = () => {
    if (!elements.title || state.isAnimated) return;

    const text = elements.title.textContent;
    elements.title.textContent = '';
    
    // Dividir texto en spans
    text.split('').forEach((char, index) => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.cssText = `
        display: inline-block;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * 30}ms;
      `;
      elements.title.appendChild(span);
    });

    // Activar animación cuando sea visible
    setTimeout(() => {
      const spans = elements.title.querySelectorAll('span');
      spans.forEach(span => {
        span.style.opacity = '1';
        span.style.transform = 'translateY(0)';
      });
    }, 100);
  };

  /**
   * Efecto de typing para el texto
   */
  const typewriterEffect = (element, text, speed = 50) => {
    if (!element) return;
    
    let index = 0;
    element.textContent = '';
    
    const type = () => {
      if (index < text.length) {
        element.textContent += text.charAt(index);
        index++;
        setTimeout(type, speed);
      }
    };
    
    type();
  };

  /**
   * Contador animado para números
   */
  const animateCounter = (element, start, end, duration) => {
    if (!element) return;
    
    const range = end - start;
    const startTime = performance.now();
    
    const updateCounter = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      // Easing function
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.round(start + (range * easeOutQuart));
      
      element.textContent = currentValue.toLocaleString();
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };
    
    requestAnimationFrame(updateCounter);
  };

  /**
   * Detector de movimiento del dispositivo (para efectos móviles)
   */
  const setupDeviceMotion = () => {
    if (!window.DeviceOrientationEvent || !state.isTouchDevice) return;

    let lastBeta = 0;
    let lastGamma = 0;

    window.addEventListener('deviceorientation', (e) => {
      const beta = e.beta || 0;  // Inclinación adelante/atrás
      const gamma = e.gamma || 0; // Inclinación izquierda/derecha
      
      // Suavizar valores
      const smoothBeta = lastBeta + (beta - lastBeta) * 0.1;
      const smoothGamma = lastGamma + (gamma - lastGamma) * 0.1;
      
      lastBeta = smoothBeta;
      lastGamma = smoothGamma;
      
      // Aplicar transformación sutil
      if (elements.image) {
        const tiltX = smoothGamma * 0.5;
        const tiltY = smoothBeta * 0.5;
        
        requestAnimationFrame(() => {
          elements.image.style.transform = 
            `perspective(1000px) rotateX(${tiltY}deg) rotateY(${tiltX}deg)`;
        });
      }
    });
  };

  /**
   * Sistema de partículas decorativas
   */
  const createParticleSystem = () => {
    const particleContainer = document.createElement('div');
    particleContainer.className = 'cta-particles';
    particleContainer.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      overflow: hidden;
    `;
    
    elements.section.appendChild(particleContainer);
    
    // Crear partículas
    const createParticle = () => {
      const particle = document.createElement('div');
      const size = Math.random() * 5 + 2;
      const duration = Math.random() * 20 + 10;
      const delay = Math.random() * 5;
      
      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: radial-gradient(circle, rgba(0, 113, 227, 0.5) 0%, transparent 70%);
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        pointer-events: none;
        animation: floatParticle ${duration}s ${delay}s infinite ease-in-out;
      `;
      
      particleContainer.appendChild(particle);
      
      // Eliminar partícula después de la animación
      setTimeout(() => particle.remove(), (duration + delay) * 1000);
    };
    
    // Crear partículas iniciales
    for (let i = 0; i < 15; i++) {
      setTimeout(() => createParticle(), i * 200);
    }
    
    // Añadir animación de partículas
    const style = document.createElement('style');
    style.textContent = `
      @keyframes floatParticle {
        0%, 100% {
          transform: translate(0, 0) scale(0);
          opacity: 0;
        }
        10% {
          transform: translate(0, 0) scale(1);
          opacity: 1;
        }
        90% {
          transform: translate(${Math.random() * 200 - 100}px, -300px) scale(1);
          opacity: 1;
        }
        100% {
          transform: translate(${Math.random() * 200 - 100}px, -350px) scale(0);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  };

  /**
   * Efectos de audio (hover sounds)
   */
  const setupAudioEffects = () => {
    // Crear contexto de audio
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    
    const audioContext = new AudioContext();
    
    // Sonido de hover
    const playHoverSound = () => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    };
    
    // Añadir a botón (opcional, comentado por defecto)
    // elements.ctaButton?.addEventListener('mouseenter', playHoverSound);
  };

  /**
   * Modo de alto contraste
   */
  const setupAccessibility = () => {
    // Detectar preferencias de usuario
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
    
    if (prefersReducedMotion) {
      // Desactivar animaciones complejas
      elements.section.classList.add('reduced-motion');
    }
    
    if (prefersHighContrast) {
      // Añadir clase para estilos de alto contraste
      elements.section.classList.add('high-contrast');
    }
    
    // Mejorar navegación por teclado
    elements.ctaButton?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        elements.ctaButton.click();
      }
    });
  };

  /**
   * Analytics y tracking
   */
  const setupAnalytics = () => {
    // Tracking de visibilidad
    let visibilityTime = 0;
    let isVisible = false;
    let startTime = null;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !isVisible) {
          isVisible = true;
          startTime = Date.now();
        } else if (!entry.isIntersecting && isVisible) {
          isVisible = false;
          visibilityTime += Date.now() - startTime;
          console.log(`CTA visible por: ${visibilityTime}ms`);
        }
      });
    }, { threshold: 0.5 });
    
    observer.observe(elements.section);
    
    // Tracking de clicks
    elements.ctaButton?.addEventListener('click', () => {
      // Enviar evento a analytics
      if (typeof gtag !== 'undefined') {
        gtag('event', 'click', {
          'event_category': 'CTA',
          'event_label': 'Hablemos de tu proyecto'
        });
      }
    });
  };

  /**
   * Limpieza y destrucción del módulo
   */
  const destroy = () => {
    // Remover event listeners
    document.removeEventListener('mousemove', handleMouseMove);
    
    // Limpiar observers
    if (window.ctaObserver) {
      window.ctaObserver.disconnect();
    }
    
    // Limpiar animaciones
    const particles = document.querySelector('.cta-particles');
    if (particles) particles.remove();
    
    // Reset estilos
    Object.values(elements).forEach(element => {
      if (element && element.style) {
        element.style.transition = '';
        element.style.transform = '';
        element.style.opacity = '';
      }
    });
  };

  /**
   * API Pública del módulo
   */
  return {
    init,
    destroy,
    animateCounter,
    typewriterEffect,
    createParticleSystem
  };
})();

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', CTASection.init);
} else {
  CTASection.init();
}

// Exportar para uso global si es necesario
window.CTASection = CTASection;











/**
 * ==========================================
 * CONTACT SECTION - INTERACTIVE JAVASCRIPT
 * Apple-style form interactions and validation
 * ==========================================
 */

const ContactForm = (() => {
  'use strict';

  // Configuración global
  const CONFIG = {
    apiEndpoint: '/api/contact',
    animationDuration: 300,
    debounceDelay: 500,
    maxMessageLength: 1000,
    emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phoneRegex: /^[\d\s\-\+$$$$]+$/,
    smoothScroll: true,
    showSuccessMessage: 3000,
    rateLimit: {
      maxAttempts: 3,
      windowMs: 60000 // 1 minuto
    }
  };

  // Estado de la aplicación
  const state = {
    isSubmitting: false,
    attempts: [],
    formData: {},
    touchedFields: new Set(),
    errors: {},
    isValid: false
  };

  // Cache de elementos DOM
  const elements = {
    form: null,
    fields: {},
    submitButton: null,
    infoSection: null,
    mapContainer: null,
    messageContainer: null
  };

  // Mensajes de validación
  const MESSAGES = {
    required: 'Este campo es obligatorio',
    email: 'Por favor, ingresa un email válido',
    phone: 'Por favor, ingresa un número de teléfono válido',
    minLength: 'Este campo debe tener al menos {min} caracteres',
    maxLength: 'Este campo no puede exceder {max} caracteres',
    submitSuccess: '¡Mensaje enviado exitosamente! Te contactaremos pronto.',
    submitError: 'Hubo un error al enviar el mensaje. Por favor, intenta nuevamente.',
    rateLimit: 'Has alcanzado el límite de intentos. Por favor, espera un momento.'
  };

  /**
   * Inicialización del módulo
   */
  const init = () => {
    cacheElements();
    
    if (!elements.form) {
      console.warn('ContactForm: No se encontró el formulario');
      return;
    }

    setupEventListeners();
    setupFieldAnimations();
    setupLiveValidation();
    setupCharacterCounter();
    setupTooltips();
    initializeMap();
    setupAccessibility();
    
    // Restaurar datos del formulario si existen
    restoreFormData();
  };

  /**
   * Cache de elementos DOM
   */
  const cacheElements = () => {
    elements.form = document.querySelector('#contacto form');
    elements.submitButton = document.querySelector('#contacto button[type="submit"]');
    elements.infoSection = document.querySelector('.info-contacto');
    elements.mapContainer = document.querySelector('.mapa-contacto');
    
    // Cache de campos del formulario
    if (elements.form) {
      const fields = ['nombre', 'email', 'telefono', 'asunto', 'mensaje'];
      fields.forEach(fieldName => {
        elements.fields[fieldName] = elements.form.querySelector(`#${fieldName}`);
      });
    }
    
    // Crear contenedor de mensajes
    createMessageContainer();
  };

  /**
   * Crear contenedor para mensajes
   */
  const createMessageContainer = () => {
    const container = document.createElement('div');
    container.className = 'form-messages';
    container.setAttribute('role', 'alert');
    container.setAttribute('aria-live', 'polite');
    container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1000;
      pointer-events: none;
    `;
    document.body.appendChild(container);
    elements.messageContainer = container;
  };

  /**
   * Configurar event listeners
   */
  const setupEventListeners = () => {
    // Submit del formulario
    elements.form?.addEventListener('submit', handleSubmit);
    
    // Input listeners para cada campo
    Object.entries(elements.fields).forEach(([name, field]) => {
      if (!field) return;
      
      field.addEventListener('input', debounce(() => handleInput(name), CONFIG.debounceDelay));
      field.addEventListener('blur', () => handleBlur(name));
      field.addEventListener('focus', () => handleFocus(name));
    });
    
    // Animación al hacer scroll
    if (CONFIG.smoothScroll) {
      setupScrollAnimations();
    }
    
    // Guardar datos del formulario
    elements.form?.addEventListener('input', debounce(saveFormData, 1000));
    
    // Limpiar datos al enviar exitosamente
    window.addEventListener('beforeunload', handleBeforeUnload);
  };

  /**
   * Manejo del envío del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (state.isSubmitting) return;
    
    // Verificar rate limiting
    if (isRateLimited()) {
      showMessage(MESSAGES.rateLimit, 'error');
      return;
    }
    
    // Validar todos los campos
    const isValid = validateForm();
    
    if (!isValid) {
      showValidationErrors();
      focusFirstError();
      return;
    }
    
    // Iniciar envío
    state.isSubmitting = true;
    updateSubmitButton(true);
    
    try {
      // Recopilar datos del formulario
      const formData = collectFormData();
      
      // Simular llamada a API
      const response = await submitForm(formData);
      
      if (response.success) {
        handleSubmitSuccess();
      } else {
        handleSubmitError(response.error);
      }
    } catch (error) {
      handleSubmitError(error);
    } finally {
      state.isSubmitting = false;
      updateSubmitButton(false);
    }
  };

  /**
   * Validación en tiempo real
   */
  const handleInput = (fieldName) => {
    const field = elements.fields[fieldName];
    if (!field) return;
    
    // Marcar campo como tocado
    state.touchedFields.add(fieldName);
    
    // Validar campo
    const error = validateField(fieldName, field.value);
    
    // Actualizar estado de error
    if (error) {
      state.errors[fieldName] = error;
      showFieldError(fieldName, error);
    } else {
      delete state.errors[fieldName];
      clearFieldError(fieldName);
    }
    
    // Actualizar estado del formulario
    updateFormValidity();
    
    // Actualizar contador de caracteres si aplica
    if (fieldName === 'mensaje') {
      updateCharacterCounter(field);
    }
  };

  /**
   * Manejo del blur
   */
  const handleBlur = (fieldName) => {
    state.touchedFields.add(fieldName);
    handleInput(fieldName);
    
    // Animación de salida
    const field = elements.fields[fieldName];
    if (field && !field.value) {
      field.parentElement.classList.remove('focused');
    }
  };

  /**
   * Manejo del focus
   */
  const handleFocus = (fieldName) => {
    const field = elements.fields[fieldName];
    if (field) {
      field.parentElement.classList.add('focused');
      
      // Animar label si existe
      animateLabel(field);
    }
  };

  /**
   * Validación de campos individuales
   */
  const validateField = (fieldName, value) => {
    const validators = {
      nombre: (val) => {
        if (!val.trim()) return MESSAGES.required;
        if (val.trim().length < 2) return MESSAGES.minLength.replace('{min}', '2');
        if (val.trim().length > 100) return MESSAGES.maxLength.replace('{max}', '100');
        return null;
      },
      
      email: (val) => {
        if (!val.trim()) return MESSAGES.required;
        if (!CONFIG.emailRegex.test(val)) return MESSAGES.email;
        return null;
      },
      
      telefono: (val) => {
        if (val && !CONFIG.phoneRegex.test(val)) return MESSAGES.phone;
        return null;
      },
      
      asunto: (val) => {
        if (!val.trim()) return MESSAGES.required;
        if (val.trim().length < 5) return MESSAGES.minLength.replace('{min}', '5');
        if (val.trim().length > 200) return MESSAGES.maxLength.replace('{max}', '200');
        return null;
      },
      
      mensaje: (val) => {
        if (!val.trim()) return MESSAGES.required;
        if (val.trim().length < 10) return MESSAGES.minLength.replace('{min}', '10');
        if (val.trim().length > CONFIG.maxMessageLength) {
          return MESSAGES.maxLength.replace('{max}', CONFIG.maxMessageLength);
        }
        return null;
      }
    };
    
    return validators[fieldName] ? validators[fieldName](value) : null;
  };

  /**
   * Validar todo el formulario
   */
  const validateForm = () => {
    let isValid = true;
    state.errors = {};
    
    Object.entries(elements.fields).forEach(([name, field]) => {
      if (!field) return;
      
      const error = validateField(name, field.value);
      if (error) {
        state.errors[name] = error;
        isValid = false;
      }
    });
    
    state.isValid = isValid;
    return isValid;
  };

  /**
   * Mostrar error en campo
   */
  const showFieldError = (fieldName, error) => {
    const field = elements.fields[fieldName];
    if (!field) return;
    
    const formGroup = field.closest('.form-group');
    formGroup.classList.add('error');
    formGroup.classList.remove('success');
    
    // Crear o actualizar mensaje de error
    let errorElement = formGroup.querySelector('.form-message');
    if (!errorElement) {
      errorElement = document.createElement('span');
      errorElement.className = 'form-message';
      errorElement.setAttribute('role', 'alert');
      formGroup.appendChild(errorElement);
    }
    
    errorElement.textContent = error;
    
    // Animación de shake
    field.classList.add('shake');
    setTimeout(() => field.classList.remove('shake'), 300);
  };

  /**
   * Limpiar error de campo
   */
  const clearFieldError = (fieldName) => {
    const field = elements.fields[fieldName];
    if (!field) return;
    
    const formGroup = field.closest('.form-group');
    formGroup.classList.remove('error');
    
    // Mostrar estado de éxito si el campo ha sido tocado
    if (state.touchedFields.has(fieldName) && field.value) {
      formGroup.classList.add('success');
    }
    
    const errorElement = formGroup.querySelector('.form-message');
    if (errorElement) {
      errorElement.textContent = '';
    }
  };

  /**
   * Recopilar datos del formulario
   */
  const collectFormData = () => {
    const data = {};
    
    Object.entries(elements.fields).forEach(([name, field]) => {
      if (field) {
        data[name] = field.value.trim();
      }
    });
    
    // Agregar metadata
    data.timestamp = new Date().toISOString();
    data.userAgent = navigator.userAgent;
    data.language = navigator.language;
    
    return data;
  };

  /**
   * Enviar formulario (simulado)
   */
  /**
   * Enviar formulario (simulado)
   */
  const submitForm = async (data) => {
    // Simular llamada a API
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simular éxito/error aleatoriamente para demostración
        const success = Math.random() > 0.1; // 90% de éxito
        
        if (success) {
          resolve({
            success: true,
            data: { id: Date.now(), ...data }
          });
        } else {
          resolve({
            success: false,
            error: 'Error de servidor'
          });
        }
      }, 2000);
    });
    
    // En producción, usar fetch real:
    /*
    try {
      const response = await fetch(CONFIG.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      
      return await response.json();
    } catch (error) {
      throw new Error('Error de red');
    }
    */
  };

  /**
   * Manejo de envío exitoso
   */
  const handleSubmitSuccess = () => {
    // Registrar intento exitoso
    state.attempts.push({ timestamp: Date.now(), success: true });
    
    // Mostrar mensaje de éxito
    showMessage(MESSAGES.submitSuccess, 'success');
    
    // Animación de éxito
    animateSuccess();
    
    // Limpiar formulario
    setTimeout(() => {
      elements.form.reset();
      state.touchedFields.clear();
      state.errors = {};
      clearAllFieldStates();
      clearFormData();
    }, 1000);
    
    // Analytics
    trackEvent('form_submit', {
      form_name: 'contact',
      success: true
    });
  };

  /**
   * Manejo de error en envío
   */
  const handleSubmitError = (error) => {
    // Registrar intento fallido
    state.attempts.push({ timestamp: Date.now(), success: false });
    
    // Mostrar mensaje de error
    showMessage(error || MESSAGES.submitError, 'error');
    
    // Animación de error
    animateError();
    
    // Analytics
    trackEvent('form_submit_error', {
      form_name: 'contact',
      error: error?.toString()
    });
  };

  /**
   * Actualizar estado del botón de envío
   */
  const updateSubmitButton = (isLoading) => {
    if (!elements.submitButton) return;
    
    if (isLoading) {
      elements.submitButton.classList.add('loading');
      elements.submitButton.disabled = true;
      elements.submitButton.setAttribute('aria-busy', 'true');
      
      // Texto durante carga
      elements.submitButton.dataset.originalText = elements.submitButton.textContent;
      elements.submitButton.textContent = 'Enviando...';
    } else {
      elements.submitButton.classList.remove('loading');
      elements.submitButton.disabled = false;
      elements.submitButton.setAttribute('aria-busy', 'false');
      
      // Restaurar texto original
      if (elements.submitButton.dataset.originalText) {
        elements.submitButton.textContent = elements.submitButton.dataset.originalText;
      }
    }
  };

  /**
   * Mostrar mensaje flotante
   */
  const showMessage = (message, type = 'info') => {
    const messageElement = document.createElement('div');
    messageElement.className = `form-message-toast ${type}`;
    messageElement.textContent = message;
    messageElement.style.cssText = `
      background: ${type === 'success' ? '#34c759' : type === 'error' ? '#ff3b30' : '#0066cc'};
      color: white;
      padding: 16px 24px;
      border-radius: 12px;
      margin-bottom: 12px;
      font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
      font-size: 15px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      transform: translateX(400px);
      transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      pointer-events: auto;
    `;
    
    elements.messageContainer.appendChild(messageElement);
    
    // Animar entrada
    requestAnimationFrame(() => {
      messageElement.style.transform = 'translateX(0)';
    });
    
    // Auto-ocultar
    setTimeout(() => {
      messageElement.style.transform = 'translateX(400px)';
      setTimeout(() => messageElement.remove(), 300);
    }, CONFIG.showSuccessMessage);
  };

  /**
   * Configurar animaciones de campos
   */
  const setupFieldAnimations = () => {
    // Añadir clases para animaciones
    Object.values(elements.fields).forEach(field => {
      if (!field) return;
      
      const formGroup = field.closest('.form-group');
      formGroup.style.transition = 'all 0.3s ease';
      
      // Efecto de floating label
      if (field.value) {
        formGroup.classList.add('has-value');
      }
    });
    
    // CSS para shake animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
      }
      
      .shake {
        animation: shake 0.3s ease-in-out;
      }
      
      @keyframes successPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
      
      .success-animation {
        animation: successPulse 0.5s ease;
      }
    `;
    document.head.appendChild(style);
  };

  /**
   * Configurar contador de caracteres
   */
  const setupCharacterCounter = () => {
    const messageField = elements.fields.mensaje;
    if (!messageField) return;
    
    // Crear contador
    const counter = document.createElement('div');
    counter.className = 'char-counter';
    counter.setAttribute('aria-live', 'polite');
    counter.setAttribute('aria-atomic', 'true');
    
    const formGroup = messageField.closest('.form-group');
    formGroup.appendChild(counter);
    
    // Actualizar contador inicial
    updateCharacterCounter(messageField);
  };

  /**
   * Actualizar contador de caracteres
   */
  const updateCharacterCounter = (field) => {
    const counter = field.closest('.form-group').querySelector('.char-counter');
    if (!counter) return;
    
    const current = field.value.length;
    const max = CONFIG.maxMessageLength;
    const remaining = max - current;
    
    counter.textContent = `${remaining} caracteres restantes`;
    
    // Cambiar color según caracteres restantes
    if (remaining < 50) {
      counter.classList.add('warning');
    } else {
      counter.classList.remove('warning');
    }
    
    if (remaining < 0) {
      counter.classList.add('error');
    } else {
      counter.classList.remove('error');
    }
  };

  /**
   * Configurar tooltips
   */
  const setupTooltips = () => {
    // Añadir tooltips a campos específicos
    const tooltips = {
      telefono: 'Opcional. Incluye código de país si es internacional.',
      mensaje: 'Describe tu proyecto o consulta con el mayor detalle posible.'
    };
    
    Object.entries(tooltips).forEach(([fieldName, text]) => {
      const field = elements.fields[fieldName];
      if (!field) return;
      
      const formGroup = field.closest('.form-group');
      const tooltip = document.createElement('div');
      tooltip.className = 'form-tooltip';
      tooltip.innerHTML = `
        <span>?</span>
        <div class="tooltip-content">${text}</div>
      `;
      
      formGroup.appendChild(tooltip);
    });
  };

  /**
   * Inicializar mapa interactivo
   */
  const initializeMap = () => {
    const mapImg = document.querySelector('.mapa-contacto img');
    if (!mapImg) return;
    
    // Hacer el mapa interactivo
    mapImg.style.cursor = 'pointer';
    
    mapImg.addEventListener('click', () => {
      // Abrir en Google Maps
      const address = encodeURIComponent('Calle Falsa 123, Ciudad, País');
      window.open(`https://www.google.com/maps/search/${address}`, '_blank');
    });
    
    // Efecto hover 3D
    mapImg.addEventListener('mousemove', (e) => {
      const rect = mapImg.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * 5;
      const rotateY = ((x - centerX) / centerX) * -5;
      
      mapImg.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });
    
    mapImg.addEventListener('mouseleave', () => {
      mapImg.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
  };

  /**
   * Configurar accesibilidad
   */
  const setupAccessibility = () => {
    // Añadir indicadores de campos requeridos
    ['nombre', 'email', 'asunto', 'mensaje'].forEach(fieldName => {
      const field = elements.fields[fieldName];
      if (!field) return;
      
      const label = elements.form.querySelector(`label[for="${fieldName}"]`);
      if (label) {
        label.classList.add('required');
        field.setAttribute('aria-required', 'true');
      }
    });
    
    // Mejorar navegación por teclado
    elements.form?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        
        const fields = Array.from(elements.form.elements);
        const currentIndex = fields.indexOf(e.target);
        const nextField = fields[currentIndex + 1];
        
        if (nextField && nextField.tagName !== 'BUTTON') {
          nextField.focus();
        } else if (nextField && nextField.tagName === 'BUTTON') {
          nextField.click();
        }
      }
    });
  };

  /**
   * Guardar datos del formulario en localStorage
   */
  const saveFormData = () => {
    const data = collectFormData();
    localStorage.setItem('contactFormData', JSON.stringify(data));
  };

  /**
   * Restaurar datos del formulario
   */
  const restoreFormData = () => {
    const savedData = localStorage.getItem('contactFormData');
    if (!savedData) return;
    
    try {
      const data = JSON.parse(savedData);
      
      Object.entries(data).forEach(([name, value]) => {
        const field = elements.fields[name];
        if (field && value) {
          field.value = value;
          field.closest('.form-group').classList.add('has-value');
        }
      });
    } catch (error) {
      console.error('Error restaurando datos del formulario:', error);
    }
  };

  /**
   * Limpiar datos guardados
   */
  const clearFormData = () => {
    localStorage.removeItem('contactFormData');
  };

  /**
   * Verificar rate limiting
   */
  const isRateLimited = () => {
    const now = Date.now();
    const recentAttempts = state.attempts.filter(
      attempt => now - attempt.timestamp < CONFIG.rateLimit.windowMs
    );
    
    return recentAttempts.length >= CONFIG.rateLimit.maxAttempts;
  };

  /**
   * Animaciones de scroll
   */
  /**
   * Animaciones de scroll
   */
  const setupScrollAnimations = () => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '50px'
    });
    
    // Observar elementos
    const animatedElements = document.querySelectorAll('.info-contacto, form, .mapa-contacto');
    animatedElements.forEach(el => observer.observe(el));
  };

  /**
   * Manejar antes de salir de la página
   */
  const handleBeforeUnload = (e) => {
    // Guardar datos si hay cambios sin guardar
    if (hasUnsavedChanges()) {
      saveFormData();
    }
  };

  /**
   * Verificar si hay cambios sin guardar
   */
  const hasUnsavedChanges = () => {
    return Object.values(elements.fields).some(field => field && field.value);
  };

  /**
   * Limpiar todos los estados de campos
   */
  const clearAllFieldStates = () => {
    document.querySelectorAll('.form-group').forEach(group => {
      group.classList.remove('error', 'success', 'focused', 'has-value');
    });
    
    document.querySelectorAll('.form-message').forEach(msg => {
      msg.textContent = '';
    });
  };

  /**
   * Mostrar errores de validación
   */
  const showValidationErrors = () => {
    Object.entries(state.errors).forEach(([fieldName, error]) => {
      showFieldError(fieldName, error);
    });
  };

  /**
   * Enfocar primer campo con error
   */
  const focusFirstError = () => {
    const firstErrorField = Object.keys(state.errors)[0];
    if (firstErrorField && elements.fields[firstErrorField]) {
      elements.fields[firstErrorField].focus();
      
      // Scroll suave al campo
      elements.fields[firstErrorField].scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  };

  /**
   * Animar label flotante
   */
  const animateLabel = (field) => {
    const label = field.previousElementSibling;
    if (label && label.tagName === 'LABEL') {
      label.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    }
  };

  /**
   * Actualizar validez del formulario
   */
  const updateFormValidity = () => {
    state.isValid = Object.keys(state.errors).length === 0;
    
    // Habilitar/deshabilitar botón de envío
    if (elements.submitButton) {
      const hasValues = Object.values(elements.fields).some(field => 
        field && field.hasAttribute('required') && field.value
      );
      
      elements.submitButton.disabled = !state.isValid || !hasValues;
    }
  };

  /**
   * Animación de éxito
   */
  const animateSuccess = () => {
    // Animar formulario
    elements.form.classList.add('success-animation');
    
    // Crear confetti o partículas
    createSuccessParticles();
    
    // Reproducir sonido de éxito (opcional)
    playSuccessSound();
    
    setTimeout(() => {
      elements.form.classList.remove('success-animation');
    }, 500);
  };

  /**
   * Animación de error
   */
  const animateError = () => {
    elements.form.classList.add('shake');
    
    setTimeout(() => {
      elements.form.classList.remove('shake');
    }, 300);
  };

  /**
   * Crear partículas de éxito
   */
  const createSuccessParticles = () => {
    const particleCount = 30;
    const colors = ['#34c759', '#30d158', '#32d74b', '#28cd41'];
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      `;
      
      document.body.appendChild(particle);
      
      // Animar partícula
      const angle = (Math.PI * 2 * i) / particleCount;
      const velocity = 200 + Math.random() * 200;
      const duration = 1000 + Math.random() * 1000;
      
      particle.animate([
        { 
          transform: 'translate(-50%, -50%) scale(0)',
          opacity: 1 
        },
        { 
          transform: `translate(calc(-50% + ${Math.cos(angle) * velocity}px), 
                               calc(-50% + ${Math.sin(angle) * velocity}px)) scale(1)`,
          opacity: 0 
        }
      ], {
        duration: duration,
        easing: 'cubic-bezier(0, 0.5, 1, 1)'
      });
      
      // Eliminar partícula
      setTimeout(() => particle.remove(), duration);
    }
  };

  /**
   * Reproducir sonido de éxito
   */
  const playSuccessSound = () => {
    // Crear contexto de audio si está disponible
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    
    try {
      const audioContext = new AudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Sonido agradable de éxito
      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
      oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
      oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      // Silenciar errores de audio
    }
  };

  /**
   * Tracking de eventos (Analytics)
   */
  const trackEvent = (eventName, eventData) => {
    // Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, eventData);
    }
    
    // Custom analytics
    console.log('Track Event:', eventName, eventData);
  };

  /**
   * Función de debounce
   */
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Destruir el módulo
   */
  const destroy = () => {
    // Remover event listeners
    elements.form?.removeEventListener('submit', handleSubmit);
    window.removeEventListener('beforeunload', handleBeforeUnload);
    
    // Limpiar observadores
    if (window.contactObserver) {
      window.contactObserver.disconnect();
    }
    
    // Limpiar elementos creados
    elements.messageContainer?.remove();
    
    // Limpiar estado
    state.touchedFields.clear();
    state.errors = {};
    state.formData = {};
  };

  /**
   * API pública del módulo
   */
  return {
    init,
    destroy,
    validateForm,
    submitForm,
    clearForm: () => {
      elements.form?.reset();
      clearAllFieldStates();
      state.touchedFields.clear();
      state.errors = {};
    },
    getFormData: collectFormData
  };
})();

/**
 * ==========================================
 * INICIALIZACIÓN
 * ==========================================
 */

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ContactForm.init);
} else {
  ContactForm.init();
}

// Exportar para uso global
window.ContactForm = ContactForm;

/**
 * ==========================================
 * UTILIDADES ADICIONALES
 * ==========================================
 */

// Smooth scroll para enlaces internos
document.addEventListener('click', (e) => {
  if (e.target.matches('a[href^="#contacto"]')) {
    e.preventDefault();
    
    const target = document.querySelector('#contacto');
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      
      // Focus en el primer campo después del scroll
      setTimeout(() => {
        const firstField = target.querySelector('input, textarea');
        if (firstField) firstField.focus();
      }, 500);
    }
  }
});

// Copiar información de contacto al portapapeles
document.querySelectorAll('.info-contacto a[href^="mailto:"], .info-contacto a[href^="tel:"]').forEach(link => {
  link.addEventListener('click', (e) => {
    if (e.metaKey || e.ctrlKey) {
      e.preventDefault();
      
      const text = link.textContent;
      navigator.clipboard.writeText(text).then(() => {
        // Mostrar feedback
        const originalText = link.textContent;
        link.textContent = '¡Copiado!';
        link.style.color = '#34c759';
        
        setTimeout(() => {
          link.textContent = originalText;
          link.style.color = '';
        }, 2000);
      });
    }
  });
});
















/**
 * ==========================================
 * FOOTER SECTION - INTERACTIVE JAVASCRIPT
 * Apple-style footer interactions
 * ==========================================
 */

const FooterModule = (() => {
  'use strict';

  // Configuración global
  const CONFIG = {
    animationDuration: 600,
    scrollDuration: 800,
    parallaxSpeed: 0.5,
    observerThreshold: 0.1,
    tooltipDelay: 500,
    copyFeedbackDuration: 2000,
    newsletterEndpoint: '/api/newsletter',
    analytics: {
      enabled: true,
      trackClicks: true,
      trackHover: false
    }
  };

  // Estado del módulo
  const state = {
    isInitialized: false,
    currentYear: new Date().getFullYear(),
    hoveredElement: null,
    touchStartY: 0,
    lastScrollY: 0
  };

  // Cache de elementos DOM
  const elements = {
    footer: null,
    sections: [],
    links: [],
    socialLinks: [],
    contactInfo: {},
    copyright: null,
    newsletter: null
  };

  /**
   * Inicialización del módulo
   */
  const init = () => {
    if (state.isInitialized) return;
    
    cacheElements();
    
    if (!elements.footer) {
      console.warn('FooterModule: No se encontró el elemento footer');
      return;
    }
    
    setupEventListeners();
    setupIntersectionObserver();
    setupSmoothScroll();
    setupContactInteractions();
    setupSocialAnimations();
    updateCopyrightYear();
    setupParallaxEffect();
    setupAccessibility();
    initNewsletterForm();
    setupTooltips();
    
    state.isInitialized = true;
    
    // Dispatch evento personalizado
    window.dispatchEvent(new CustomEvent('footerReady'));
  };

  /**
   * Cache de elementos DOM
   */
  const cacheElements = () => {
    elements.footer = document.querySelector('footer');
    
    if (!elements.footer) return;
    
    elements.sections = elements.footer.querySelectorAll('.footer-seccion');
    elements.links = elements.footer.querySelectorAll('a');
    elements.socialLinks = elements.footer.querySelectorAll('.footer-social a');
    elements.copyright = elements.footer.querySelector('.footer-copy p');
    elements.newsletter = elements.footer.querySelector('.footer-newsletter');
    
    // Cache de información de contacto
    const contactSection = elements.footer.querySelector('.footer-contacto');
    if (contactSection) {
      elements.contactInfo = {
        email: contactSection.querySelector('a[href^="mailto:"]'),
        phone: contactSection.querySelector('a[href^="tel:"]'),
        address: contactSection.querySelector('p:first-of-type')
      };
    }
  };

  /**
   * Configurar event listeners
   */
  const setupEventListeners = () => {
    // Eventos de mouse/touch
    elements.links.forEach(link => {
      link.addEventListener('mouseenter', handleLinkHover);
      link.addEventListener('mouseleave', handleLinkLeave);
      link.addEventListener('click', handleLinkClick);
      
      // Touch events para móviles
      link.addEventListener('touchstart', handleTouchStart, { passive: true });
      link.addEventListener('touchend', handleTouchEnd);
    });
    
    // Eventos de ventana
    window.addEventListener('scroll', throttle(handleScroll, 100));
    window.addEventListener('resize', debounce(handleResize, 250));
    
    // Eventos de teclado
    elements.footer.addEventListener('keydown', handleKeyboardNavigation);
  };

  /**
   * Intersection Observer para animaciones
   */
  const setupIntersectionObserver = () => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: CONFIG.observerThreshold
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          
          // Animar elementos hijos con retraso
          const children = entry.target.querySelectorAll('li, p');
          children.forEach((child, index) => {
            setTimeout(() => {
              child.style.opacity = '1';
              child.style.transform = 'translateY(0)';
            }, index * 50);
          });
          
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    // Observar secciones del footer
    elements.sections.forEach(section => {
      section.style.opacity = '0';
      section.style.transform = 'translateY(20px)';
      observer.observe(section);
    });
  };

  /**
   * Smooth scroll para enlaces internos
   */
  const setupSmoothScroll = () => {
    const internalLinks = elements.footer.querySelectorAll('a[href^="#"]');
    
    internalLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          smoothScrollTo(targetElement);
          
          // Focus en el elemento objetivo
          setTimeout(() => {
            targetElement.setAttribute('tabindex', '-1');
            targetElement.focus();
          }, CONFIG.scrollDuration);
        }
      });
    });
  };

  /**
   * Función de smooth scroll
   */
  const smoothScrollTo = (element) => {
    const targetPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const startTime = performance.now();
    
    const animation = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / CONFIG.scrollDuration, 1);
      
      // Easing function (ease-in-out-cubic)
      const easeInOutCubic = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      
      window.scrollTo(0, startPosition + distance * easeInOutCubic);
      
      if (progress < 1) {
        requestAnimationFrame(animation);
      }
    };
    
    requestAnimationFrame(animation);
  };

  /**
   * Interacciones de contacto
   */
  const setupContactInteractions = () => {
    // Email - copiar al portapapeles
    if (elements.contactInfo.email) {
      elements.contactInfo.email.addEventListener('click', (e) => {
        if (e.metaKey || e.ctrlKey) {
          e.preventDefault();
          copyToClipboard(elements.contactInfo.email.textContent, elements.contactInfo.email);
        }
      });
    }
    
    // Teléfono - copiar o llamar
    if (elements.contactInfo.phone) {
      const phoneNumber = elements.contactInfo.phone.textContent;
      elements.contactInfo.phone.href = `tel:${phoneNumber.replace(/\s/g, '')}`;
      
      elements.contactInfo.phone.addEventListener('click', (e) => {
        if (e.metaKey || e.ctrlKey) {
          e.preventDefault();
          copyToClipboard(phoneNumber, elements.contactInfo.phone);
        }
      });
    }
    
    // Dirección - abrir en mapas
    if (elements.contactInfo.address) {
      elements.contactInfo.address.style.cursor = 'pointer';
      elements.contactInfo.address.addEventListener('click', () => {
        const address = elements.contactInfo.address.textContent.replace('Dirección:', '').trim();
        const encodedAddress = encodeURIComponent(address);
        
        // Detectar si es móvil para abrir la app nativa
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        
        if (isMobile) {
          // Intentar abrir en app nativa primero
          window.location.href = `maps://maps.google.com/maps?q=${encodedAddress}`;
          
          // Fallback a web si la app no está disponible
          setTimeout(() => {
            window.open(`https://maps.google.com/maps?q=${encodedAddress}`, '_blank');
          }, 500);
        } else {
          window.open(`https://maps.google.com/maps?q=${encodedAddress}`, '_blank');
        }
      });
    }
  };

  /**
   * Copiar al portapapeles con feedback
   */
  const copyToClipboard = async (text, element) => {
    try {
      await navigator.clipboard.writeText(text);
      
      // Feedback visual
      const originalText = element.textContent;
      const originalColor = element.style.color;
      
      element.textContent = '¡Copiado!';
      element.style.color = '#34c759';
      element.style.transform = 'scale(1.05)';
      
      // Animación de checkmark
      const checkmark = document.createElement('span');
      checkmark.innerHTML = ' ✓';
      checkmark.style.cssText = `
        display: inline-block;
        animation: fadeInScale 0.3s ease;
      `;
      element.appendChild(checkmark);
      
      setTimeout(() => {
        element.textContent = originalText;
        element.style.color = originalColor;
        element.style.transform = '';
      }, CONFIG.copyFeedbackDuration);
      
      // Haptic feedback en móviles
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
      
    } catch (err) {
      console.error('Error al copiar:', err);
      showToast('Error al copiar', 'error');
    }
  };

  /**
   * Animaciones para redes sociales
   */
  const setupSocialAnimations = () => {
    elements.socialLinks.forEach((link, index) => {
      // Hover effect con magnetic pull
      link.addEventListener('mousemove', (e) => {
        const rect = link.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        link.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px) scale(1.1)`;
      });
      
      link.addEventListener('mouseleave', () => {
        link.style.transform = '';
      });
      
      // Click animation
      link.addEventListener('click', () => {
        link.style.animation = 'socialPulse 0.6s ease';
        setTimeout(() => {
          link.style.animation = '';
        }, 600);
      });
      
      // Stagger animation on load
      link.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Añadir animación CSS
    const style = document.createElement('style');
    style.textContent = `
      @keyframes socialPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(0.9); }
      }
      
      @keyframes fadeInScale {
        from {
          opacity: 0;
          transform: scale(0.8);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
    `;
    document.head.appendChild(style);
  };

  /**
   * Actualizar año del copyright
   */
  const updateCopyrightYear = () => {
    if (elements.copyright) {
      const copyrightText = elements.copyright.textContent;
      elements.copyright.textContent = copyrightText.replace(/\d{4}/, state.currentYear);
      
      // Animación sutil al cambiar el año
      elements.copyright.style.transition = 'opacity 0.3s ease';
      elements.copyright.style.opacity = '0';
      
      setTimeout(() => {
        elements.copyright.style.opacity = '1';
      }, 150);
    }
  };

  /**
   * Efecto parallax suave
   */
  const setupParallaxEffect = () => {
    const handleParallax = () => {
      const scrolled = window.pageYOffset;
      const windowHeight = window.innerHeight;
      const footerTop = elements.footer.offsetTop;
      
      // Solo aplicar cuando el footer esté visible
      if (scrolled + windowHeight > footerTop) {
        const parallaxOffset = (scrolled + windowHeight - footerTop) * CONFIG.parallaxSpeed;
        
        // Aplicar a elementos específicos
        elements.sections.forEach((section, index) => {
          const speed = 0.5 + (index * 0.1);
          section.style.transform = `translateY(${parallaxOffset * speed}px)`;
        });
      }
    };
    
    // Solo en desktop
    if (!isMobile()) {
      window.addEventListener('scroll', throttle(handleParallax, 16));
    }
  };

  /**
   * Configurar accesibilidad
   */
  const setupAccessibility = () => {
    // Añadir roles ARIA
    elements.sections.forEach(section => {
      section.setAttribute('role', 'complementary');
    });
    
    // Skip links para navegación rápida
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.className = 'skip-to-main';
    skipLink.textContent = 'Volver al contenido principal';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 0;
      background: #0066cc;
      color: white;
      padding: 8px 16px;
      text-decoration: none;
      border-radius: 0 0 8px 0;
      transition: top 0.3s ease;
    `;
    
    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '0';
    });
    
    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });
    
    elements.footer.insertBefore(skipLink, elements.footer.firstChild);
  };

  /**
   * Newsletter form
   */
  const initNewsletterForm = () => {
    if (!elements.newsletter) return;
    
    const form = elements.newsletter.querySelector('form');
    const input = form?.querySelector('input[type="email"]');
    const button = form?.querySelector('button');
    
    if (!form || !input || !button) return;
    
    // Validación en tiempo real
    input.addEventListener('input', debounce(() => {
      const isValid = validateEmail(input.value);
      
      if (input.value && !isValid) {
        input.style.borderColor = '#ff3b30';
        showInputError(input, 'Email inválido');
      } else {
        input.style.borderColor = '';
        clearInputError(input);
      }
    }, 500));
    
    // Submit del formulario
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = input.value.trim();
      
      if (!validateEmail(email)) {
        shakeElement(input);
        showInputError(input, 'Por favor, ingresa un email válido');
        return;
      }
      
      // Deshabilitar mientras se envía
      button.disabled = true;
      button.textContent = 'Enviando...';
      
      try {
        // Simular envío
        await subscribeToNewsletter(email);
        
        // Éxito
        form.style.display = 'none';
        const successMessage = document.createElement('p');
        successMessage.className = 'newsletter-success';
        successMessage.textContent = '¡Gracias por suscribirte! 🎉';
        successMessage.style.cssText = `
          color: #34c759;
          font-weight: 500;
          animation: fadeInScale 0.5s ease;
        `;
        elements.newsletter.appendChild(successMessage);
        
        // Analytics
        trackEvent('newsletter_subscribe', { email: email });
        
      } catch (error) {
        // Error
        showToast('Error al suscribirse. Intenta nuevamente.', 'error');
        button.disabled = false;
        button.textContent = 'Suscribirse';
      }
    });
  };

  /**
   * Suscribir al newsletter
   */
  const subscribeToNewsletter = async (email) => {
    // Simular llamada API
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.1) {
          resolve({ success: true });
        } else {
          reject(new Error('Server error'));
        }
      }, 1500);
    });
    
    // En producción:
    /*
    const response = await fetch(CONFIG.newsletterEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    
    if (!response.ok) throw new Error('Subscription failed');
    return response.json();
    */
  };

  /**
   * Tooltips dinámicos
   */
  const setupTooltips = () => {
    const tooltipTriggers = {
      'Twitter': 'Síguenos para las últimas noticias',
      'LinkedIn': 'Conecta con nosotros profesionalmente',
      'GitHub': 'Explora nuestros proyectos open source',
      'Facebook': 'Únete a nuestra comunidad'
    };
    
    elements.socialLinks.forEach(link => {
      const platform = link.textContent || link.querySelector('::before')?.content;
      const tooltipText = Object.entries(tooltipTriggers).find(([key]) => 
        link.href.includes(key.toLowerCase())
      )?.[1];
      
      if (tooltipText) {
        let tooltip;
        let tooltipTimeout;
        
        link.addEventListener('mouseenter', () => {
          tooltipTimeout = setTimeout(() => {
            tooltip = createTooltip(tooltipText, link);
          }, CONFIG.tooltipDelay);
        });
        
        link.addEventListener('mouseleave', () => {
          clearTimeout(tooltipTimeout);
          if (tooltip) {
            tooltip.remove();
            tooltip = null;
          }
        });
      }
    });
  };

  /**
   * Crear tooltip
   */
  const createTooltip = (text, element) => {
    const tooltip = document.createElement('div');
    tooltip.className = 'footer-tooltip';
    tooltip.textContent = text;
    tooltip.style.cssText = `
      position: absolute;
      background: #1d1d1f;
      color: #ffffff;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
      white-space: nowrap;
      z-index: 1000;
      pointer-events: none;
      opacity: 0;
      transform: translateY(5px);
      transition: all 0.2s ease;
    `;
    
    document.body.appendChild(tooltip);
    
    // Posicionar tooltip
    const rect = element.getBoundingClientRect();
    tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
    tooltip.style.top = `${rect.top - tooltip.offsetHeight - 8}px`;
    
    // Animar entrada
    requestAnimationFrame(() => {
      tooltip.style.opacity = '1';
      tooltip.style.transform = 'translateY(0)';
    });
    
    return tooltip;
  };

  /**
   * Manejadores de eventos
   */
  const handleLinkHover = (e) => {
    const link = e.currentTarget;
    state.hoveredElement = link;
    
    // Prefetch para mejorar rendimiento
    if (link.href && !link.href.startsWith('#') && !link.hasAttribute('data-prefetched')) {
      const linkElement = document.createElement('link');
      linkElement.rel = 'prefetch';
      linkElement.href = link.href;
      document.head.appendChild(linkElement);
      link.setAttribute('data-prefetched', 'true');
    }
    
    // Analytics
    if (CONFIG.analytics.trackHover) {
      trackEvent('footer_link_hover', {
        text: link.textContent,
        href: link.href
      });
    }
  };

  const handleLinkLeave = () => {
    state.hoveredElement = null;
  };

  const handleLinkClick = (e) => {
    const link = e.currentTarget;
    
    // Analytics
    if (CONFIG.analytics.trackClicks) {
      trackEvent('footer_link_click', {
        text: link.textContent,
        href: link.href,
        section: link.closest('.footer-seccion')?.querySelector('h4')?.textContent
      });
    }
    
    // Animación de click
    link.style.transform = 'scale(0.95)';
    setTimeout(() => {
      link.style.transform = '';
    }, 150);
  };

  const handleTouchStart = (e) => {
    state.touchStartY = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    const touchEndY = e.changedTouches[0].clientY;
    const diff = state.touchStartY - touchEndY;
    
    // Detectar swipe up para mostrar más contenido
    if (diff > 50) {
      // Implementar lógica de swipe si es necesario
    }
  };

  const handleScroll = () => {
    const scrollY = window.pageYOffset;
    const scrollDirection = scrollY > state.lastScrollY ? 'down' : 'up';
    
    state.lastScrollY = scrollY;
    
    // Añadir clase según dirección del scroll
    elements.footer.setAttribute('data-scroll-direction', scrollDirection);
  };

  const handleResize = () => {
    // Recalcular layouts si es necesario
    if (isMobile() && !elements.footer.classList.contains('mobile-optimized')) {
      elements.footer.classList.add('mobile-optimized');
    } else if (!isMobile() && elements.footer.classList.contains('mobile-optimized')) {
      elements.footer.classList.remove('mobile-optimized');
    }
  };

  const handleKeyboardNavigation = (e) => {
    // Navegación con teclas de flecha entre enlaces
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      const currentIndex = Array.from(elements.links).indexOf(document.activeElement);
      
      if (currentIndex !== -1) {
        e.preventDefault();
        const nextIndex = e.key === 'ArrowRight' 
          ? (currentIndex + 1) % elements.links.length 
          : (currentIndex - 1 + elements.links.length) % elements.links.length;
        
        elements.links[nextIndex].focus();
      }
    }
  };

  /**
   * Funciones auxiliares
   */
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isMobile = () => {
    return window.innerWidth <= 768 || 'ontouchstart' in window;
  };

   const showToast = (message, type = 'info') => {
    const toast = document.createElement('div');
    toast.className = `footer-toast ${type}`;
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: ${type === 'error' ? '#ff3b30' : type === 'success' ? '#34c759' : '#0066cc'};
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 14px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      transform: translateY(100px);
      transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      z-index: 10000;
    `;
    
    document.body.appendChild(toast);
    
    // Animar entrada
    requestAnimationFrame(() => {
      toast.style.transform = 'translateY(0)';
    });
    
    // Auto-ocultar
    setTimeout(() => {
      toast.style.transform = 'translateY(100px)';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  const showInputError = (input, message) => {
    let errorElement = input.parentElement.querySelector('.input-error');
    
    if (!errorElement) {
      errorElement = document.createElement('span');
      errorElement.className = 'input-error';
      errorElement.style.cssText = `
        display: block;
        color: #ff3b30;
        font-size: 12px;
        margin-top: 4px;
        animation: fadeIn 0.2s ease;
      `;
      input.parentElement.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
  };

  const clearInputError = (input) => {
    const errorElement = input.parentElement.querySelector('.input-error');
    if (errorElement) {
      errorElement.style.opacity = '0';
      setTimeout(() => errorElement.remove(), 200);
    }
  };

  const shakeElement = (element) => {
    element.style.animation = 'shake 0.5s ease';
    setTimeout(() => {
      element.style.animation = '';
    }, 500);
  };

  const trackEvent = (eventName, eventData = {}) => {
    if (!CONFIG.analytics.enabled) return;
    
    // Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, {
        event_category: 'Footer',
        ...eventData
      });
    }
    
    // Custom analytics
    if (window.analytics) {
      window.analytics.track(eventName, eventData);
    }
    
    // Console log en desarrollo
    if (window.location.hostname === 'localhost') {
      console.log('📊 Track Event:', eventName, eventData);
    }
  };

  /**
   * Throttle function
   */
  function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /**
   * Debounce function
   */
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Funciones especiales de Easter Eggs
   */
  const initEasterEggs = () => {
    // Konami Code
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;
    
    document.addEventListener('keydown', (e) => {
      if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        
        if (konamiIndex === konamiCode.length) {
          activateEasterEgg();
          konamiIndex = 0;
        }
      } else {
        konamiIndex = 0;
      }
    });
  };

  const activateEasterEgg = () => {
    // Efecto arcoíris en el footer
    elements.footer.style.animation = 'rainbow 3s ease infinite';
    
    const style = document.createElement('style');
    style.textContent = `
      @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    
    showToast('🌈 ¡Easter egg activado!', 'success');
    
    // Confetti
    createConfetti();
    
    // Desactivar después de 10 segundos
    setTimeout(() => {
      elements.footer.style.animation = '';
      style.remove();
    }, 10000);
  };

  const createConfetti = () => {
    const colors = ['#ff3b30', '#ff9500', '#ffcc00', '#34c759', '#5856d6', '#ff2d55'];
    const confettiCount = 100;
    
    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        left: ${Math.random() * 100}vw;
        top: -10px;
        border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
        pointer-events: none;
        z-index: 9999;
        animation: confettiFall ${3 + Math.random() * 2}s linear;
      `;
      
      document.body.appendChild(confetti);
      
      setTimeout(() => confetti.remove(), 5000);
    }
    
    // Añadir animación si no existe
    if (!document.querySelector('#confetti-animation')) {
      const style = document.createElement('style');
      style.id = 'confetti-animation';
      style.textContent = `
        @keyframes confettiFall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  };

  /**
   * Modo de depuración
   */
  const enableDebugMode = () => {
    console.log('🔧 Footer Debug Mode Enabled');
    
    // Mostrar información de debug
    const debugInfo = document.createElement('div');
    debugInfo.className = 'footer-debug';
    debugInfo.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 20px;
      background: rgba(0, 0, 0, 0.8);
      color: #0f0;
      padding: 10px;
      font-family: monospace;
      font-size: 12px;
      border-radius: 4px;
      z-index: 10000;
    `;
    
    const updateDebugInfo = () => {
      debugInfo.innerHTML = `
        <strong>Footer Debug</strong><br>
        Links: ${elements.links.length}<br>
        Sections: ${elements.sections.length}<br>
        Scroll: ${state.lastScrollY}px<br>
        Mobile: ${isMobile() ? 'Yes' : 'No'}<br>
        Hovered: ${state.hoveredElement?.textContent || 'None'}
      `;
    };
    
    updateDebugInfo();
    document.body.appendChild(debugInfo);
    
    // Actualizar cada 100ms
    setInterval(updateDebugInfo, 100);
    
    // Permitir cerrar con ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        debugInfo.remove();
      }
    });
  };

  /**
   * Limpiar recursos
   */
  const destroy = () => {
    // Remover event listeners
    elements.links.forEach(link => {
      link.removeEventListener('mouseenter', handleLinkHover);
      link.removeEventListener('mouseleave', handleLinkLeave);
      link.removeEventListener('click', handleLinkClick);
    });
    
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('resize', handleResize);
    
    // Limpiar observers
    if (window.footerObserver) {
      window.footerObserver.disconnect();
    }
    
    // Limpiar animaciones
    elements.sections.forEach(section => {
      section.style.animation = '';
      section.style.transform = '';
      section.style.opacity = '';
    });
    
    // Reset state
    state.isInitialized = false;
  };

  /**
   * API pública del módulo
   */
  return {
    init,
    destroy,
    showToast,
    trackEvent,
    enableDebugMode,
    copyToClipboard,
    smoothScrollTo,
    updateCopyrightYear
  };
})();

/**
 * ==========================================
 * INICIALIZACIÓN Y CONFIGURACIÓN GLOBAL
 * ==========================================
 */

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', FooterModule.init);
} else {
  FooterModule.init();
}

// Exponer API global
window.FooterModule = FooterModule;

// Activar modo debug con parámetro URL
if (new URLSearchParams(window.location.search).has('debug')) {
  FooterModule.enableDebugMode();
}

// Easter eggs
document.addEventListener('DOMContentLoaded', () => {
  // Click 5 veces en el logo para activar modo especial
  let clickCount = 0;
  let clickTimer;
  
  const logo = document.querySelector('.footer-logo h3');
  if (logo) {
    logo.style.cursor = 'pointer';
    logo.addEventListener('click', () => {
      clickCount++;
      
      clearTimeout(clickTimer);
      clickTimer = setTimeout(() => {
        clickCount = 0;
      }, 1000);
      
      if (clickCount === 5) {
        logo.style.animation = 'logoSpin 1s ease';
        setTimeout(() => {
          logo.style.animation = '';
        }, 1000);
        
        FooterModule.showToast('🎯 ¡Modo especial activado!', 'success');
        clickCount = 0;
      }
    });
  }
});

// CSS para animaciones especiales
const specialStyles = document.createElement('style');
specialStyles.textContent = `
  @keyframes logoSpin {
    0% { transform: rotate(0deg) scale(1); }
    50% { transform: rotate(180deg) scale(1.2); }
    100% { transform: rotate(360deg) scale(1); }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
  }
`;
document.head.appendChild(specialStyles);

// Exportar funciones útiles globalmente
window.footerUtils = {
  copyEmail: () => FooterModule.copyToClipboard('info@Orhyntic.com', document.querySelector('.footer-contacto a[href^="mailto:"]')),
  scrollToTop: () => FooterModule.smoothScrollTo(document.body),
  subscribe: (email) => FooterModule.subscribeToNewsletter(email)
};