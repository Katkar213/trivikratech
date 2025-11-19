// ==========================
// Trivikra Tech — Interactions & Hover Effects
// ==========================
(function () {

  // ==========================
  // Helper: Smooth Scroll
  // ==========================
  function smoothScrollTo(target, offset) {
    var top = target.getBoundingClientRect().top + window.pageYOffset - (offset || 80);
    window.scrollTo({ top: top, behavior: 'smooth' });
  }

  // ==========================
  // Mobile Navigation Toggle
  // ==========================
 // ===== Mobile menu (safe, single-responsibility) =====
(function () {
  // helper
  function $ (sel) { return document.querySelector(sel); }

  const toggleBtn = $('#menu-toggle');      // button in your HTML
  const mobileMenu = $('#mobile-menu');      // mobile menu container
  // defensive checks
  if (!toggleBtn || !mobileMenu) {
    // if elements not found, do nothing (prevents runtime errors)
    // console.warn('menu toggle or mobile menu not found');
    return;
  }

  // Make sure aria attributes exist for accessibility
  if (!toggleBtn.getAttribute('aria-expanded')) toggleBtn.setAttribute('aria-expanded', 'false');
  if (!toggleBtn.getAttribute('aria-controls')) toggleBtn.setAttribute('aria-controls', mobileMenu.id || 'mobile-menu');

  // Open / close helpers
  function openMenu() {
    mobileMenu.classList.add('open');
    mobileMenu.style.display = 'block';
    toggleBtn.textContent = '✕';
    toggleBtn.setAttribute('aria-expanded', 'true');
    // optional: prevent body scroll while menu open (comment out if unwanted)
    document.documentElement.classList.add('mobile-menu-open');
  }

  function closeMenu() {
    mobileMenu.classList.remove('open');
    mobileMenu.style.display = ''; // let CSS determine default
    toggleBtn.textContent = '☰';
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.documentElement.classList.remove('mobile-menu-open');
  }

  // Toggle handler
  toggleBtn.addEventListener('click', function (e) {
    const isOpen = mobileMenu.classList.contains('open');
    if (isOpen) closeMenu();
    else openMenu();
  });

  // Close when a link inside the mobile menu is clicked (for small viewports)
  mobileMenu.addEventListener('click', function (e) {
    const anchor = e.target.closest('a');
    if (!anchor) return;
    // allow normal navigation, but close menu after short delay
    if (window.innerWidth < 992) {
      setTimeout(closeMenu, 80);
    }
  });

  // Close on resize when moving to desktop view
  window.addEventListener('resize', function () {
    if (window.innerWidth >= 992) {
      // Clear inline styles so desktop CSS takes over
      closeMenu();
      mobileMenu.style.removeProperty('display');
    }
  });

  // Close on Escape key
  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      closeMenu();
    }
  });

})();




  (function () {
    const header   = document.querySelector('.site-header');
    const logoImg  = document.getElementById('site-logo');
    if (!header || !logoImg) return;

    const defaultSrc  = logoImg.getAttribute('data-logo-default');
    const scrolledSrc = logoImg.getAttribute('data-logo-scrolled');

    function applyTopState() {
      header.classList.add('transparent');
      if (logoImg.src !== location.origin + defaultSrc.replace(/^\./,'')) {
        logoImg.style.opacity = '0';
        requestAnimationFrame(() => {
          logoImg.src = defaultSrc;
          logoImg.onload = () => (logoImg.style.opacity = '1');
        });
      }
    }

    function applyScrolledState() {
      header.classList.remove('transparent');
      if (logoImg.src !== location.origin + scrolledSrc.replace(/^\./,'')) {
        logoImg.style.opacity = '0';
        requestAnimationFrame(() => {
          logoImg.src = scrolledSrc;
          logoImg.onload = () => (logoImg.style.opacity = '1');
        });
      }
    }

    function onScroll() {
      const atTop = window.scrollY < 10; // adjust threshold if needed
      atTop ? applyTopState() : applyScrolledState();
    }

    // Initial state on load
    window.addEventListener('load', onScroll, { passive: true });
    // Update on scroll
    window.addEventListener('scroll', onScroll, { passive: true });
  })();






  // ==========================
  // Smooth Scroll for Anchor Links
  // ==========================
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href.length > 1) {
        var target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          smoothScrollTo(target, 90);
          history.pushState(null, '', href);
        }
      }
    });
  });

  // ==========================
  // Active Nav Link Highlight on Scroll
  // ==========================
  var sectionIds = Array.from(document.querySelectorAll('section[id]')).map(s => s.id);
  var navLinks = document.querySelectorAll('#mainNav .nav-link');

  function setActiveLink() {
    var fromTop = window.scrollY + 100;
    var current = null;

    sectionIds.forEach(id => {
      var el = document.getElementById(id);
      if (el && el.offsetTop <= fromTop) {
        current = id;
      }
    });

    navLinks.forEach(a => {
      a.classList.remove('active');
      if (current && a.getAttribute('href') === '#' + current) {
        a.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', setActiveLink);
  setActiveLink();

  // ==========================
  // Contact Form Handling
  // ==========================
  // Contact form: clean, modular and easy-to-modify
// (function () {
//   // --- Config (change if needed) ---
//   const FORM_SELECTOR = '#contactForm'; // or '#contact form' etc.
//   const SUCCESS_MESSAGE = 'Thanks! Your form was submitted.';
//   const ERROR_MESSAGE_PREFIX = 'Please fix the following:';

//   // --- Utility helpers ---
//   function qs(parent, selector) {
//     return (parent || document).querySelector(selector);
//   }
//   function qsa(parent, selector) {
//     return Array.from((parent || document).querySelectorAll(selector));
//   }
//   function showAlert(msg) {
//     // Simple fallback using alert; replace with custom UI if you want
//     alert(msg);
//   }

//   // --- Get form element ---
//   const form = document.querySelector(FORM_SELECTOR) || document.querySelector('#contact form');

//   if (!form) {
//     console.warn('Contact form not found. Selector used:', FORM_SELECTOR);
//     return;
//   }

//   // --- Field getters (adjust selectors if structure differs) ---
//   function getValues() {
//     const name = qs(form, 'input[name="name"], input[type="text"]')?.value.trim() || '';
//     const email = qs(form, 'input[name="email"], input[type="email"]')?.value.trim() || '';
//     // if you have more than one text input, use name attributes to target phone specifically
//     const phone = qs(form, 'input[name="phone"], input[type="tel"]')?.value.trim() || '';
//     const service = qs(form, 'select[name="service"]')?.value || '';
//     const description = qs(form, 'textarea[name="description"]')?.value.trim() || '';
//     return { name, email, phone, service, description };
//   }

//   // --- Validation (simple and extensible) ---
//   function validate(values) {
//     const errors = [];
//     if (!values.name) errors.push('Name is required.');
//     if (!values.email) {
//       errors.push('Email is required.');
//     } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
//       errors.push('Please enter a valid email address.');
//     }
//     if (!values.service) errors.push('Please select a service.');
//     // Add more validations as needed
//     return errors;
//   }

//   // --- Placeholder for handling the cleaned/validated data ---
//   // Replace or extend this function to:
//   // - POST to a Google Apps Script URL
//   // - POST to your backend (fetch)
//   // - Save to Firebase
//   // - Send an email via API
//   function handleFormData(data) {
//     // Example: just log for now
//     console.log('Prepared form data:', data);

//     // ---- EXAMPLE: To send to an endpoint, uncomment and change URL ----
//     /*
//     fetch('https://your-endpoint.example/submit', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data)
//     })
//     .then(resp => {
//       if (!resp.ok) throw new Error('Network response was not ok');
//       return resp.json();
//     })
//     .then(respJson => {
//       // handle success
//       showAlert(SUCCESS_MESSAGE);
//       form.reset();
//     })
//     .catch(err => {
//       console.error('Submit error:', err);
//       showAlert('There was an error submitting the form. Please try again later.');
//     });
//     */

//     // Default behaviour (no external action): show message and reset if you want
//     showAlert(SUCCESS_MESSAGE);
//     form.reset();
//   }

//   // --- Submit handler ---
//   function onSubmit(event) {
//     event.preventDefault(); // prevent native submit

//     const values = getValues();
//     const errors = validate(values);

//     if (errors.length) {
//       showAlert(ERROR_MESSAGE_PREFIX + '\n' + errors.join('\n'));
//       return;
//     }

//     // All good — call central handler
//     handleFormData(values);
//   }

//   // --- Attach listener ---
//   form.addEventListener('submit', onSubmit);

//   // Optional: expose functions for debugging or runtime modification
//   window.__ContactForm = {
//     form,
//     getValues,
//     validate,
//     handleFormData,
//     onSubmit
//   };

// })();























// Trivikra Tech — Interactions & Hover Effects
// ==========================
(function () {

  // ==========================
  // Helper: Smooth Scroll
  // ==========================
  function smoothScrollTo(target, offset) {
    var top = target.getBoundingClientRect().top + window.pageYOffset - (offset || 80);
    window.scrollTo({ top: top, behavior: 'smooth' });
  }

  // ==========================
  // Mobile Navigation Toggle
  // ==========================
  var nav = document.getElementById('mainNav');
  var toggle = document.getElementById('navToggle');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isHidden = window.getComputedStyle(nav).display === 'none';
      nav.style.display = isHidden ? 'flex' : 'none';
      if (isHidden) {
        nav.style.flexDirection = 'column';
        nav.style.gap = '12px';
        nav.style.background = '#fff';
        nav.style.position = 'absolute';
        nav.style.top = '64px';
        nav.style.right = '16px';
        nav.style.padding = '12px 16px';
        nav.style.border = '1px solid #e5e7eb';
        nav.style.borderRadius = '12px';
        nav.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)';
        nav.style.zIndex = '1001';
      }
    });

    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A' && window.innerWidth < 768) {
        nav.style.display = 'none';
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth >= 768) {
        nav.removeAttribute('style');
      }
    });
  }




  (function () {
    const header   = document.querySelector('.site-header');
    const logoImg  = document.getElementById('site-logo');
    if (!header || !logoImg) return;

    const defaultSrc  = logoImg.getAttribute('data-logo-default');
    const scrolledSrc = logoImg.getAttribute('data-logo-scrolled');

    function applyTopState() {
      header.classList.add('transparent');
      if (logoImg.src !== location.origin + defaultSrc.replace(/^\./,'')) {
        logoImg.style.opacity = '0';
        requestAnimationFrame(() => {
          logoImg.src = defaultSrc;
          logoImg.onload = () => (logoImg.style.opacity = '1');
        });
      }
    }

    function applyScrolledState() {
      header.classList.remove('transparent');
      if (logoImg.src !== location.origin + scrolledSrc.replace(/^\./,'')) {
        logoImg.style.opacity = '0';
        requestAnimationFrame(() => {
          logoImg.src = scrolledSrc;
          logoImg.onload = () => (logoImg.style.opacity = '1');
        });
      }
    }

    function onScroll() {
      const atTop = window.scrollY < 10; // adjust threshold if needed
      atTop ? applyTopState() : applyScrolledState();
    }

    // Initial state on load
    window.addEventListener('load', onScroll, { passive: true });
    // Update on scroll
    window.addEventListener('scroll', onScroll, { passive: true });
  })();






  // ==========================
  // Smooth Scroll for Anchor Links
  // ==========================
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href.length > 1) {
        var target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          smoothScrollTo(target, 90);
          history.pushState(null, '', href);
        }
      }
    });
  });

  // ==========================
  // Active Nav Link Highlight on Scroll
  // ==========================
  var sectionIds = Array.from(document.querySelectorAll('section[id]')).map(s => s.id);
  var navLinks = document.querySelectorAll('#mainNav .nav-link');

  function setActiveLink() {
    var fromTop = window.scrollY + 100;
    var current = null;

    sectionIds.forEach(id => {
      var el = document.getElementById(id);
      if (el && el.offsetTop <= fromTop) {
        current = id;
      }
    });

    navLinks.forEach(a => {
      a.classList.remove('active');
      if (current && a.getAttribute('href') === '#' + current) {
        a.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', setActiveLink);
  setActiveLink();

  // ==========================
  // Effect 1: Button Ripple Effect
  // ==========================
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', function (e) {
      let ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.left = e.offsetX + 'px';
      ripple.style.top = e.offsetY + 'px';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // ==========================
  // Effect 2: Service Cards Hover
  // ==========================
  document.querySelectorAll('.service-card').forEach(card => {
    const title = card.querySelector('h3');

    card.addEventListener('mouseenter', function () {
      card.style.transform = 'translateY(-8px) scale(1.05)';
      card.style.transition = 'all 0.3s ease';
      card.style.boxShadow = '0 12px 24px rgba(0,0,0,0.2)';
      if (title) {
        title.style.opacity = '1';
        title.style.transform = 'translateY(0)';
      }
    });

    card.addEventListener('mouseleave', function () {
      card.style.transform = 'translateY(0) scale(1)';
      card.style.boxShadow = '';
      if (title) {
        title.style.opacity = '0';
        title.style.transform = 'translateY(20px)';
      }
    });
  });

  // ==========================
  // Effect 3: Header Nav Hover
  // ==========================
  document.querySelectorAll('.site-header .nav-link').forEach(link => {
    link.addEventListener('mouseenter', function () {
      this.style.transition = 'all 0.3s ease';
      this.style.color = '#213C72';
      this.style.textShadow = '0 0 12px rgba(33, 60, 114, 0.6)';
      this.style.transform = 'scale(1.1)';
    });
    link.addEventListener('mouseleave', function () {
      this.style.color = '';
      this.style.textShadow = '';
      this.style.transform = 'scale(1)';
    });
  });

  // ==========================
  // Effect 4: Header Button Ripple
  // ==========================
  document.querySelectorAll('.site-header .btn').forEach(btn => {
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.addEventListener('mouseenter', function (e) {
      let ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.left = e.offsetX + 'px';
      ripple.style.top = e.offsetY + 'px';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // ==========================
  // Effect 5: Stats Counter Animation
  // ==========================
 document.addEventListener("DOMContentLoaded", () => {
    const counters = document.querySelectorAll(".stat-number");

    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute("data-target"));
      const suffix = counter.textContent.replace(/[0-9]/g, '').trim(); // capture "+" or "%"
      let count = 0;
      const duration = 2000; // in milliseconds
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        count = Math.floor(progress * target);
        counter.textContent = count ;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          counter.textContent = target;
        }
      }

      requestAnimationFrame(update);
    });
  });

  // ==========================
  // Effect 6: Hero Image Hover
  // ==========================
  document.querySelectorAll(".hero-image img").forEach(img => {
    img.addEventListener("mouseenter", () => {
      img.style.boxShadow = "0px 15px 40px rgba(0, 0, 0, 0.3)";
    });
    img.addEventListener("mouseleave", () => {
      img.style.boxShadow = "0px 5px 15px rgba(0, 0, 0, 0.1)";
    });
  });

  // ==========================
  // Effect 7: Custom Cursor
  // ==========================
  const cursor = document.querySelector(".cursor");
  const cursorView = document.querySelector(".cursor-view");

  document.addEventListener("mousemove", (e) => {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
    cursorView.style.left = e.clientX + "px";
    cursorView.style.top = e.clientY + "px";
  });

  document.querySelectorAll(".card, .service-card").forEach(card => {
    card.addEventListener("mouseenter", () => {
      cursor.style.opacity = "0";
      cursorView.style.transform = "translate(-50%, -50%) scale(1)";
    });
    card.addEventListener("mouseleave", () => {
      cursor.style.opacity = "1";
      cursorView.style.transform = "translate(-50%, -50%) scale(0)";
    });
  });

  // ==========================
  // Effect 7: Custom Cursor
  // ==========================
   const overlay = document.querySelector('.overlay');

document.addEventListener('mousemove', (e) => {
  overlay.style.background = `radial-gradient(circle 250px at ${e.clientX}px ${e.clientY}px, rgba(255,255,255,0.25), rgba(0,0,0,0.9))`;
});

 

})();


// triggering option div....
// JS to handle showing/hiding card sections
  // Show selected card section, hide others
 
  // Show selected card section, hide others and update active style
  document.querySelectorAll('.clickable-div').forEach(div => {
    div.addEventListener('click', () => {
      // Hide all card sections
      document.querySelectorAll('.card-section').forEach(section => {
        section.classList.add('d-none');
      });

      // Remove active class from all clickable divs
      document.querySelectorAll('.clickable-div').forEach(btn => {
        btn.classList.remove('active');
      });

      // Show selected card section
      const target = div.getAttribute('data-target');
      document.getElementById(target).classList.remove('d-none');

      // Mark this div as active
      div.classList.add('active');
    });
  });

  // Set Option 1 as active on load
  window.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.clickable-div[data-target="cards1"]').classList.add('active');
  });


// navbar color changing..........
  const header = document.querySelector('.site-header');

  function updateHeader() {
    if (window.scrollY > 40) {
      header.classList.remove('transparent');
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
      header.classList.add('transparent');
    }
  }

  window.addEventListener('scroll', updateHeader);
  window.addEventListener('DOMContentLoaded', updateHeader);






  // hamburger animation
    const toggleBtn = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  let isOpen = false;

  toggleBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    isOpen = !isOpen;
    toggleBtn.textContent = isOpen ? '✕' : '☰';
  });




// sliders code for faq


(function () {
  /**
   * Make a horizontally scrolling, infinitely looping, auto-playing track
   * with drag/swipe support.
   * @param {HTMLElement} track - the .faq-track element
   * @param {number} pxPerFrame - speed in px per animation frame (approx 60fps)
   */
  function initAutoScroller(track, pxPerFrame) {
    // Ensure content is long enough; we rely on duplicated items already present in your HTML.
    // If you ever remove duplicates, you can clone here instead.

    let rafId = null;
    let playing = true;
    let speed = pxPerFrame; // positive => left to right scrollLeft++, appears moving left
    let isDown = false;
    let startX = 0;
    let startScrollLeft = 0;

    // Start at 0 for cleanliness
    track.scrollLeft = 0;

    // Limit used for seamless loop: assume second half is duplicate
    function halfWidth() {
      // total width minus viewport equals max scrollable distance
      const maxScrollable = Math.max(0, track.scrollWidth - track.clientWidth);
      return maxScrollable / 2; // because you duplicated items once
    }

    function step() {
      if (!playing) return;
      track.scrollLeft += speed;

      // wrap forward
      if (track.scrollLeft >= halfWidth()) {
        track.scrollLeft = 0;
      }
      // wrap backward (if speed is negative)
      if (track.scrollLeft <= 0 && speed < 0) {
        track.scrollLeft = halfWidth() - 1;
      }
      rafId = requestAnimationFrame(step);
    }

    function play() {
      if (rafId == null) {
        playing = true;
        rafId = requestAnimationFrame(step);
      }
    }

    function pause() {
      playing = false;
      if (rafId != null) cancelAnimationFrame(rafId);
      rafId = null;
    }

    // Hover to pause/resume (desktop)
    track.addEventListener('mouseenter', pause);
    track.addEventListener('mouseleave', play);

    // Touch to pause while interacting (mobile)
    track.addEventListener('touchstart', pause, { passive: true });
    track.addEventListener('touchend', play);
    track.addEventListener('touchcancel', play);

    // Drag/Swipe handlers (mouse + touch)
    const onPointerDown = (clientX) => {
      isDown = true;
      startX = clientX;
      startScrollLeft = track.scrollLeft;
      track.classList.add('dragging');
      pause();
    };

    const onPointerMove = (clientX) => {
      if (!isDown) return;
      const dx = clientX - startX;
      track.scrollLeft = startScrollLeft - dx;

      // Seamless wrap while dragging
      if (track.scrollLeft >= halfWidth()) track.scrollLeft = 0;
      if (track.scrollLeft <= 0) track.scrollLeft = halfWidth() - 1;
    };

    const onPointerUp = () => {
      if (!isDown) return;
      isDown = false;
      track.classList.remove('dragging');
      // resume autoplay after a short moment so it feels natural
      setTimeout(play, 100);
    };

    // Mouse
    track.addEventListener('mousedown', (e) => onPointerDown(e.clientX));
    window.addEventListener('mousemove', (e) => onPointerMove(e.clientX));
    window.addEventListener('mouseup', onPointerUp);

    // Touch
    track.addEventListener('touchstart', (e) => onPointerDown(e.touches[0].clientX), { passive: true });
    track.addEventListener('touchmove', (e) => onPointerMove(e.touches[0].clientX), { passive: true });
    track.addEventListener('touchend', onPointerUp);
    track.addEventListener('touchcancel', onPointerUp);

    // Respect reduced motion
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      pause();
    } else {
      play();
    }

    // Recompute on resize (helps when layout changes)
    window.addEventListener('resize', () => {
      // keep scroll within bounds when viewport changes
      if (track.scrollLeft > halfWidth()) track.scrollLeft = halfWidth() - 1;
    });

    // Expose a tiny API if you ever need to change speed dynamically
    return {
      setSpeed: (newPxPerFrame) => { speed = newPxPerFrame; },
      pause,
      play
    };
  }

  // Initialize both rows:
  // Top row: move left (positive speed)
  // Bottom row: move right (negative speed) for a nice counter motion
  const tracks = document.querySelectorAll('.faq-track');
  if (tracks[0]) initAutoScroller(tracks[0], 0.6);   // adjust speed if you like
  if (tracks[1]) initAutoScroller(tracks[1], -0.6);  // opposite direction
})();



// Auto highlight active nav link
document.addEventListener("DOMContentLoaded", () => {
  const current = window.location.pathname.split("/").pop() || "index.html";
  const links = document.querySelectorAll(".main-nav .nav-link, #mobile-menu .nav-link");

  links.forEach(link => {
    const href = link.getAttribute("href").replace("./", "");
    link.classList.remove("activated");

    if (href === current) {
      link.classList.add("activated");
    }
  });
});




















  // ==========================
  // Effect 1: Button Ripple Effect
  // ==========================
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', function (e) {
      let ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.left = e.offsetX + 'px';
      ripple.style.top = e.offsetY + 'px';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // ==========================
  // Effect 2: Service Cards Hover
  // ==========================
  document.querySelectorAll('.service-card').forEach(card => {
    const title = card.querySelector('h3');

    card.addEventListener('mouseenter', function () {
      card.style.transform = 'translateY(-8px) scale(1.05)';
      card.style.transition = 'all 0.3s ease';
      card.style.boxShadow = '0 12px 24px rgba(0,0,0,0.2)';
      if (title) {
        title.style.opacity = '1';
        title.style.transform = 'translateY(0)';
      }
    });

    card.addEventListener('mouseleave', function () {
      card.style.transform = 'translateY(0) scale(1)';
      card.style.boxShadow = '';
      if (title) {
        title.style.opacity = '0';
        title.style.transform = 'translateY(20px)';
      }
    });
  });

  // ==========================
  // Effect 3: Header Nav Hover
  // ==========================
  document.querySelectorAll('.site-header .nav-link').forEach(link => {
    link.addEventListener('mouseenter', function () {
      this.style.transition = 'all 0.3s ease';
      this.style.color = '#213C72';
      this.style.textShadow = '0 0 12px rgba(33, 60, 114, 0.6)';
      this.style.transform = 'scale(1.1)';
    });
    link.addEventListener('mouseleave', function () {
      this.style.color = '';
      this.style.textShadow = '';
      this.style.transform = 'scale(1)';
    });
  });

  // ==========================
  // Effect 4: Header Button Ripple
  // ==========================
  document.querySelectorAll('.site-header .btn').forEach(btn => {
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.addEventListener('mouseenter', function (e) {
      let ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.left = e.offsetX + 'px';
      ripple.style.top = e.offsetY + 'px';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // ==========================
  // Effect 5: Stats Counter Animation
  // ==========================
 document.addEventListener("DOMContentLoaded", () => {
    const counters = document.querySelectorAll(".stat-number");

    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute("data-target"));
      const suffix = counter.textContent.replace(/[0-9]/g, '').trim(); // capture "+" or "%"
      let count = 0;
      const duration = 2000; // in milliseconds
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        count = Math.floor(progress * target);
        counter.textContent = count ;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          counter.textContent = target;
        }
      }

      requestAnimationFrame(update);
    });
  });

  // ==========================
  // Effect 6: Hero Image Hover
  // ==========================
  document.querySelectorAll(".hero-image img").forEach(img => {
    img.addEventListener("mouseenter", () => {
      img.style.boxShadow = "0px 15px 40px rgba(0, 0, 0, 0.3)";
    });
    img.addEventListener("mouseleave", () => {
      img.style.boxShadow = "0px 5px 15px rgba(0, 0, 0, 0.1)";
    });
  });

  // ==========================
  // Effect 7: Custom Cursor
  // ==========================
  const cursor = document.querySelector(".cursor");
  const cursorView = document.querySelector(".cursor-view");

  document.addEventListener("mousemove", (e) => {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
    cursorView.style.left = e.clientX + "px";
    cursorView.style.top = e.clientY + "px";
  });

  document.querySelectorAll(".card, .service-card").forEach(card => {
    card.addEventListener("mouseenter", () => {
      cursor.style.opacity = "0";
      cursorView.style.transform = "translate(-50%, -50%) scale(1)";
    });
    card.addEventListener("mouseleave", () => {
      cursor.style.opacity = "1";
      cursorView.style.transform = "translate(-50%, -50%) scale(0)";
    });
  });

  // ==========================
  // Effect 7: Custom Cursor
  // ==========================
   const overlay = document.querySelector('.overlay');

document.addEventListener('mousemove', (e) => {
  overlay.style.background = `radial-gradient(circle 250px at ${e.clientX}px ${e.clientY}px, rgba(255,255,255,0.25), rgba(0,0,0,0.9))`;
});

 

})();


// triggering option div....
// JS to handle showing/hiding card sections
  // Show selected card section, hide others
 
  // Show selected card section, hide others and update active style
  document.querySelectorAll('.clickable-div').forEach(div => {
    div.addEventListener('click', () => {
      // Hide all card sections
      document.querySelectorAll('.card-section').forEach(section => {
        section.classList.add('d-none');
      });

      // Remove active class from all clickable divs
      document.querySelectorAll('.clickable-div').forEach(btn => {
        btn.classList.remove('active');
      });

      // Show selected card section
      const target = div.getAttribute('data-target');
      document.getElementById(target).classList.remove('d-none');

      // Mark this div as active
      div.classList.add('active');
    });
  });

  // Set Option 1 as active on load
  window.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.clickable-div[data-target="cards1"]').classList.add('active');
  });


// navbar color changing..........
  const header = document.querySelector('.site-header');

  function updateHeader() {
    if (window.scrollY > 40) {
      header.classList.remove('transparent');
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
      header.classList.add('transparent');
    }
  }

  window.addEventListener('scroll', updateHeader);
  window.addEventListener('DOMContentLoaded', updateHeader);






  // hamburger animation
    const toggleBtn = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  let isOpen = false;

  toggleBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    isOpen = !isOpen;
    toggleBtn.textContent = isOpen ? '✕' : '☰';
  });


  



// sliders code for faq


(function () {
  /**
   * Make a horizontally scrolling, infinitely looping, auto-playing track
   * with drag/swipe support.
   * @param {HTMLElement} track - the .faq-track element
   * @param {number} pxPerFrame - speed in px per animation frame (approx 60fps)
   */
  function initAutoScroller(track, pxPerFrame) {
    // Ensure content is long enough; we rely on duplicated items already present in your HTML.
    // If you ever remove duplicates, you can clone here instead.

    let rafId = null;
    let playing = true;
    let speed = pxPerFrame; // positive => left to right scrollLeft++, appears moving left
    let isDown = false;
    let startX = 0;
    let startScrollLeft = 0;

    // Start at 0 for cleanliness
    track.scrollLeft = 0;

    // Limit used for seamless loop: assume second half is duplicate
    function halfWidth() {
      // total width minus viewport equals max scrollable distance
      const maxScrollable = Math.max(0, track.scrollWidth - track.clientWidth);
      return maxScrollable / 2; // because you duplicated items once
    }

    function step() {
      if (!playing) return;
      track.scrollLeft += speed;

      // wrap forward
      if (track.scrollLeft >= halfWidth()) {
        track.scrollLeft = 0;
      }
      // wrap backward (if speed is negative)
      if (track.scrollLeft <= 0 && speed < 0) {
        track.scrollLeft = halfWidth() - 1;
      }
      rafId = requestAnimationFrame(step);
    }

    function play() {
      if (rafId == null) {
        playing = true;
        rafId = requestAnimationFrame(step);
      }
    }

    function pause() {
      playing = false;
      if (rafId != null) cancelAnimationFrame(rafId);
      rafId = null;
    }

    // Hover to pause/resume (desktop)
    track.addEventListener('mouseenter', pause);
    track.addEventListener('mouseleave', play);

    // Touch to pause while interacting (mobile)
    track.addEventListener('touchstart', pause, { passive: true });
    track.addEventListener('touchend', play);
    track.addEventListener('touchcancel', play);

    // Drag/Swipe handlers (mouse + touch)
    const onPointerDown = (clientX) => {
      isDown = true;
      startX = clientX;
      startScrollLeft = track.scrollLeft;
      track.classList.add('dragging');
      pause();
    };

    const onPointerMove = (clientX) => {
      if (!isDown) return;
      const dx = clientX - startX;
      track.scrollLeft = startScrollLeft - dx;

      // Seamless wrap while dragging
      if (track.scrollLeft >= halfWidth()) track.scrollLeft = 0;
      if (track.scrollLeft <= 0) track.scrollLeft = halfWidth() - 1;
    };

    const onPointerUp = () => {
      if (!isDown) return;
      isDown = false;
      track.classList.remove('dragging');
      // resume autoplay after a short moment so it feels natural
      setTimeout(play, 100);
    };

    // Mouse
    track.addEventListener('mousedown', (e) => onPointerDown(e.clientX));
    window.addEventListener('mousemove', (e) => onPointerMove(e.clientX));
    window.addEventListener('mouseup', onPointerUp);

    // Touch
    track.addEventListener('touchstart', (e) => onPointerDown(e.touches[0].clientX), { passive: true });
    track.addEventListener('touchmove', (e) => onPointerMove(e.touches[0].clientX), { passive: true });
    track.addEventListener('touchend', onPointerUp);
    track.addEventListener('touchcancel', onPointerUp);

    // Respect reduced motion
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      pause();
    } else {
      play();
    }

    // Recompute on resize (helps when layout changes)
    window.addEventListener('resize', () => {
      // keep scroll within bounds when viewport changes
      if (track.scrollLeft > halfWidth()) track.scrollLeft = halfWidth() - 1;
    });

    // Expose a tiny API if you ever need to change speed dynamically
    return {
      setSpeed: (newPxPerFrame) => { speed = newPxPerFrame; },
      pause,
      play
    };
  }

  // Initialize both rows:
  // Top row: move left (positive speed)
  // Bottom row: move right (negative speed) for a nice counter motion
  const tracks = document.querySelectorAll('.faq-track');
  if (tracks[0]) initAutoScroller(tracks[0], 0.6);   // adjust speed if you like
  if (tracks[1]) initAutoScroller(tracks[1], -0.6);  // opposite direction
})();



// Auto highlight active nav link
document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname.toLowerCase();

  const links = document.querySelectorAll(".main-nav .nav-link .nav-link");

  links.forEach(link => {
    const href = link.getAttribute("href").replace("./", "").toLowerCase();
    link.classList.remove("activated");

    // Exact match for home pages
    if (path.endsWith(href)) {
      link.classList.add("activated");
    }

    // If URL contains "service" → activate Service menu
    if (href.includes("service") && path.includes("service")) {
      link.classList.add("activated");
    }

    // If URL contains "training" → activate Training menu
    if (href.includes("training") && path.includes("training")) {
      link.classList.add("activated");
    }
  });
});




// working form  final service downside

    const scriptURL = 'https://script.google.com/macros/s/AKfycbyGY8d_G4yY0ddfHi1Maq4D3gf_DFBFbWNpYcvJiAr-Bo67BVpkJNcppeTGzDa9x5YC/exec'; // 👈 paste new URL here
    const form = document.getElementById('enquiryForm');

    form.addEventListener('submit', e => {
      e.preventDefault();
      const formData = new FormData(form);

      fetch(scriptURL, {
        method: 'POST',
        body: formData
      })
      .then(response => response.text())
      .then(result => {
        console.log("Success:", result);
        alert("Form submitted successfully!");
        form.reset();
      })
      .catch(error => {
        console.error('Error:', error);
        alert("Error! Please try again.");
      });
    });




    // working form  final upside


    const form2 = document.getElementById('mentorForm');

    form2.addEventListener('submit', e => {
      e.preventDefault();
      const formData = new FormData(form2);

      fetch(scriptURL, {
        method: 'POST',
        body: formData
      })
      .then(response => response.text())
      .then(result => {
        console.log("Success:", result);
        alert("Form submitted successfully!");
        form2.reset();
      })
      .catch(error => {
        console.error('Error:', error);
        alert("Error! Please try again.");
      });
    });



  console.log(document.getElementById('tainingupForm'))



    // working training down form  final service downside

    const trainingscriptURL = 'https://script.google.com/macros/s/AKfycbzNtIfLV03hhwcy8tcmaowvRocaDm9WMsMXL_hHvI0ShwesbbPzkqrc8DWOLqdPMd9LFQ/exec'; // 👈 paste new URL here
    const trainingform = document.getElementById('tainingdownForm');

   trainingform.addEventListener('submit', e => {
      e.preventDefault();
      const formData = new FormData(trainingform);

      fetch(trainingscriptURL, {
        method: 'POST',
        body: formData
      })
      .then(response => response.text())
      .then(result => {
        console.log("Success:", result);
        alert("Form submitted successfully!");
        trainingform.reset();
      })
      .catch(error => {
        console.error('Error:', error);
        alert("Error! Please try again.");
      });
    });




     // working training up form  final service downside

    const trainingupform = document.getElementById('tainingupForm');

   trainingupform.addEventListener('submit', e => {
      e.preventDefault();
      const formData = new FormData(trainingupform);

      fetch(trainingscriptURL, {
        method: 'POST',
        body: formData
      })
      .then(response => response.text())
      .then(result => {
        console.log("Success:", result);
        alert("Form submitted successfully!");
        trainingupform.reset();
      })
      .catch(error => {
        console.error('Error:', error);
        alert("Error! Please try again.");
      });
    });



























    // bubbling on clicking view all button



//     document.addEventListener('click', (e) => {
//   // prevent clicks on module buttons inside #moreModules from bubbling to other handlers
//   if (e.target.closest && e.target.closest('#moreModules .module-btn')) {
//     e.stopPropagation();
//   }
// });

document.addEventListener('DOMContentLoaded', () => {
  const DEBUG = false; // set true to see console logs

  const moreModulesEl = document.getElementById('moreModules');
  if (!moreModulesEl) {
    if (DEBUG) console.warn('moreModules element not found');
    return;
  }

  // Try targeted selector first, fallback to any .view-all-btn
  let viewBtns = Array.from(document.querySelectorAll(
    '.view-all-btn[data-bs-target="#moreModules"], .view-all-btn[href="#moreModules"]'
  ));
  if (!viewBtns.length) {
    viewBtns = Array.from(document.querySelectorAll('.view-all-btn'));
    if (DEBUG) console.log('Fallback: found viewBtns count =', viewBtns.length);
  } else {
    if (DEBUG) console.log('Found viewBtns via targeted selector, count =', viewBtns.length);
  }

  // if nothing found, exit (avoid errors)
  if (!viewBtns.length) {
    if (DEBUG) console.warn('No .view-all-btn buttons found on page.');
    return;
  }

  const LABEL_OPEN = 'View Less';
  const LABEL_CLOSED = 'View All';

  // Make sure each button has a .vab-label child (preserve icons / other children)
  function ensureLabelEl(btn) {
    let label = btn.querySelector('.vab-label');
    if (!label) {
      label = document.createElement('span');
      label.className = 'vab-label';
      // Move any plain text node (first) into label, keep icons intact
      const textNodes = Array.from(btn.childNodes).filter(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim());
      if (textNodes.length) {
        label.textContent = textNodes[0].textContent.trim();
        textNodes[0].textContent = '';
      }
      btn.appendChild(label);
      if (DEBUG) console.log('created label for', btn);
    }
    return label;
  }

  function setLabelText(btn, text) {
    const label = ensureLabelEl(btn);
    label.textContent = text;
    // Also update aria-expanded for accessibility
    try { btn.setAttribute('aria-expanded', String(moreModulesEl.classList.contains('show'))); } catch (e) {}
  }

  function syncAll() {
    const isOpen = moreModulesEl.classList.contains('show');
    if (DEBUG) console.log('syncAll() — moreModules show? ', isOpen);
    viewBtns.forEach(btn => {
      // allow per-button overrides via data attributes
      const open = btn.getAttribute('data-label-open') || LABEL_OPEN;
      const closed = btn.getAttribute('data-label-closed') || LABEL_CLOSED;
      setLabelText(btn, isOpen ? open : closed);
    });
  }

  // Bootstrap events — robustly attach only if events exist
  if (typeof bootstrap !== 'undefined' && moreModulesEl) {
    moreModulesEl.addEventListener('shown.bs.collapse', () => {
      if (DEBUG) console.log('shown.bs.collapse fired');
      setTimeout(syncAll, 0);
    });
    moreModulesEl.addEventListener('hidden.bs.collapse', () => {
      if (DEBUG) console.log('hidden.bs.collapse fired');
      setTimeout(syncAll, 0);
    });
  } else {
    if (DEBUG) console.warn('Bootstrap not found; relying on MutationObserver only.');
  }

  // Click handler to sync after user clicks (small delay to let bootstrap update)
  viewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (DEBUG) console.log('view-btn clicked');
      setTimeout(syncAll, 20);
    });
  });

  // MutationObserver as safety for programmatic toggles
  const mo = new MutationObserver(muts => {
    for (const m of muts) {
      if (m.attributeName === 'class') {
        if (DEBUG) console.log('MutationObserver saw class change');
        syncAll();
        break;
      }
    }
  });
  mo.observe(moreModulesEl, { attributes: true, attributeFilter: ['class'] });

  // Do an initial sync *after* a tiny delay (handles timing where collapse JS runs after DOMContentLoaded)
  setTimeout(syncAll, 30);
});




// fill form before downloading syllabus....

/* === Syllabus-download via modal (non-invasive) ===
   Place this at the end of script.js or right before </body>.
   It intercepts clicks on .btn-download, opens your auditModal,
   and after the modal form is submitted it downloads the original PDF. */

(function () {
  // Which modal/form to use
  const modalEl = document.getElementById('auditModal'); // existing modal
  const primaryForm = document.getElementById('mentorForm'); // modal form (preferred)
  const fallbackForm = document.getElementById('enquiryForm'); // fallback if mentorForm missing
  const formToUse = primaryForm || fallbackForm || null;

  // Keep the download URL that user originally clicked
  let pendingDownloadUrl = null;
  let submittedOnce = false;

  // Helper: show bootstrap modal (works with BS5)
  function showModal() {
    if (!modalEl) return;
    try {
      const bsModal = new bootstrap.Modal(modalEl);
      bsModal.show();
    } catch (e) {
      // fallback: add class if bootstrap not available
      modalEl.classList.add('show');
      modalEl.style.display = 'block';
    }
  }

  // Helper: hide bootstrap modal
  function hideModal() {
    if (!modalEl) return;
    try {
      const bsModal = bootstrap.Modal.getInstance(modalEl);
      if (bsModal) bsModal.hide();
    } catch (e) {
      modalEl.classList.remove('show');
      modalEl.style.display = 'none';
    }
  }

  // Programmatic download helper
  function triggerDownload(href) {
    if (!href) return;
    const a = document.createElement('a');
    a.href = href;
    // try to keep the original filename by reading last path segment
    const parts = href.split('/');
    a.download = parts[parts.length - 1] || '';
    // open in same tab download style
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  // Basic client-side validation for required inputs inside the form
  function validateForm(f) {
    if (!f) return false;
    // use HTML5 constraint validation
    try {
      if (typeof f.checkValidity === 'function') {
        return f.checkValidity();
      }
    } catch (e) {}
    // Fallback: ensure required inputs have values
    const requiredEls = Array.from(f.querySelectorAll('[required]'));
    return requiredEls.every(el => String(el.value || '').trim() !== '');
  }

  // Intercept clicks on any .btn-download anchors
  document.querySelectorAll('a.btn-download').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      // allow ctrl/cmd+click to open in new tab if user wants
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const href = this.getAttribute('href') || this.dataset.syllabus || null;
      if (!href) return; // nothing to download

      e.preventDefault();
      pendingDownloadUrl = href;

      // reset flag so multiple open/submit cycles work
      submittedOnce = false;

      // Ensure modal form message label updates (optional)
      // Open your existing audit modal
      showModal();

      // If modal form exists, focus first input
      if (formToUse) {
        const firstInput = formToUse.querySelector('input, textarea, select');
        if (firstInput) firstInput.focus();
      }
    });
  });

  // If no form available, still allow direct download (safety)
  if (!formToUse) {
    // if the project doesn't have mentorForm/enquiryForm, fallback: convert .btn-download to normal behavior
    // nothing else to do.
    console.warn('No mentorForm/enquiryForm present — .btn-download will behave normally.');
    return;
  }

  // Submit handler for the modal form: one handler that will only run when a pendingDownloadUrl exists.
  // We attach a listener but keep it lightweight and non-destructive to other handlers.
  formToUse.addEventListener('submit', function (ev) {
    // If user didn't open modal via a download button, do nothing special — allow normal behavior
    if (!pendingDownloadUrl) {
      return; // allow other handlers / default submission handling
    }

    ev.preventDefault(); // we control the flow for the download case

    // Prevent double submission
    if (submittedOnce) return;
    submittedOnce = true;

    // Basic validation (will use HTML5 built-in too)
    const valid = validateForm(formToUse);
    if (!valid) {
      // show native validation UI if available
      try {
        formToUse.reportValidity && formToUse.reportValidity();
      } catch (e) {}
      submittedOnce = false;
      return;
    }

    // OPTIONAL: If you want to keep existing remote submission (like Google Script),
    // you can trigger it here. But to keep this non-invasive we only download + reset.
    // If you do want to POST, you can implement fetch(...) here using FormData(formToUse).

    // Close modal, then trigger download
    hideModal();

    // small timeout to let modal animation finish
    setTimeout(() => {
      try {
        triggerDownload(pendingDownloadUrl);
      } catch (err) {
        console.error('Download failed', err);
      }

      // Reset the form visually
      try { formToUse.reset(); } catch (e) {}

      // Clear pending url so further standard form submits are not affected
      pendingDownloadUrl = null;
      submittedOnce = false;

      // Friendly confirmation (non-blocking)
      try {
        // if you prefer a custom UI, replace this alert
        alert('Syllabus will download now. Thank you for your submission!');
      } catch (e) {}
    }, 250);
  });

  // Safety: If modal is closed manually, clear pendingDownloadUrl so the flow cancels
  if (modalEl) {
    modalEl.addEventListener('hidden.bs.modal', function () {
      pendingDownloadUrl = null;
      submittedOnce = false;
    });
  }
})();
