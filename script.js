/**
 * ==========================================================================
 * YANDRATHI BUNNY - CYBERSECURITY PORTFOLIO JAVASCRIPT
 * Features:
 *   - Dark/Light mode toggle with localStorage persistence
 *   - Sticky navbar & active scroll-spy with dual observer & scroll listener
 *   - Mobile responsive navigation drawer
 *   - Typewriter animation in hero terminal
 *   - Cryptographically secure password generator widget (CSPRNG demo)
 *   - Modals (Resume printable preview & project specifications)
 *   - Real contact transmission to mrmadz333@gmail.com (FormSubmit + mailto fallback)
 *   - Copy-to-clipboard utilities for email
 *   - Subtle cyber matrix background canvas
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initNavbar();
  initTypewriter();
  initPasswordGenerator();
  initModals();
  initContactForm();
  initClipboardButtons();
  initScrollAnimations();
  initCyberCanvas();
  setCurrentYear();
});

/* --------------------------------------------------------------------------
   1. THEME TOGGLE (DARK / LIGHT MODE)
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById("theme-toggle");
  const html = document.documentElement;
  const metaColorScheme = document.querySelector('meta[name="color-scheme"]');

  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

  let currentTheme = savedTheme || (prefersDark.matches ? "dark" : "light");
  applyTheme(currentTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const newTheme = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(newTheme);
      localStorage.setItem("theme", newTheme);
    });
  }

  prefersDark.addEventListener("change", (e) => {
    if (!localStorage.getItem("theme")) {
      applyTheme(e.matches ? "dark" : "light");
    }
  });

  function applyTheme(theme) {
    html.setAttribute("data-theme", theme);
    if (metaColorScheme) {
      metaColorScheme.content = theme === "dark" ? "dark light" : "light dark";
    }
  }
}

/* --------------------------------------------------------------------------
   2. NAVBAR, SCROLL SPY & MOBILE MENU
   -------------------------------------------------------------------------- */
function initNavbar() {
  const mobileToggle = document.getElementById("mobile-toggle");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section[id]");
  const backToTopBtn = document.getElementById("back-to-top");

  // Mobile menu toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("open");
      mobileToggle.classList.toggle("open");
      mobileToggle.setAttribute("aria-expanded", isOpen);
    });

    // Close menu when clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("open");
        mobileToggle.classList.remove("open");
        mobileToggle.setAttribute("aria-expanded", false);
      });
    });

    // Close when clicking outside navbar
    document.addEventListener("click", (e) => {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target) && navMenu.classList.contains("open")) {
        navMenu.classList.remove("open");
        mobileToggle.classList.remove("open");
        mobileToggle.setAttribute("aria-expanded", false);
      }
    });
  }

  // Active section scroll-spy using both scroll calculation and IntersectionObserver
  function updateActiveNavLink() {
    const scrollPos = window.scrollY + 200;
    let currentId = "";

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute("id");
      }
    });

    // Handle bottom of page (Contact section)
    if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 90)) {
      currentId = "contact";
    }

    if (currentId) {
      navLinks.forEach(link => {
        if (link.getAttribute("href") === `#${currentId}`) {
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      });
    }
  }

  window.addEventListener("scroll", updateActiveNavLink, { passive: true });
  updateActiveNavLink();

  // IntersectionObserver as secondary precision layer
  const observerOptions = {
    root: null,
    rootMargin: "-20% 0px -55% 0px",
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const currentId = entry.target.getAttribute("id");
        navLinks.forEach(link => {
          if (link.getAttribute("href") === `#${currentId}`) {
            link.classList.add("active");
          } else {
            link.classList.remove("active");
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => observer.observe(sec));

  // Back to Top button
  if (backToTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add("visible");
      } else {
        backToTopBtn.classList.remove("visible");
      }
    }, { passive: true });

    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}

/* --------------------------------------------------------------------------
   3. HERO TERMINAL TYPEWRITER ANIMATION
   -------------------------------------------------------------------------- */
function initTypewriter() {
  const typewriterElement = document.getElementById("typewriter-text");
  if (!typewriterElement) return;

  const roles = [
    "Cybersecurity Student",
    "Offensive & Defensive Security Enthusiast",
    "SOC Analyst Aspirant",
    "Threat Detection & Log Explorer",
    "Python Security Tool Developer"
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 45;
    } else {
      typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 95;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      typingSpeed = 1800;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 450;
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* --------------------------------------------------------------------------
   4. INTERACTIVE LIVE SECURE PASSWORD GENERATOR (CSPRNG)
   -------------------------------------------------------------------------- */
function initPasswordGenerator() {
  const outputInput = document.getElementById("demo-password-output");
  const lengthSlider = document.getElementById("pass-length-slider");
  const lengthVal = document.getElementById("pass-length-val");
  const symbolsCheck = document.getElementById("include-symbols");
  const numbersCheck = document.getElementById("include-numbers");
  const regenerateBtn = document.getElementById("regenerate-btn");
  const copyBtn = document.getElementById("copy-password-btn");
  const copyTooltip = document.getElementById("copy-tooltip");
  const entropyDisplay = document.getElementById("entropy-display");

  if (!outputInput || !lengthSlider) return;

  function generateSecurePassword() {
    const length = parseInt(lengthSlider.value, 10);
    const useSymbols = symbolsCheck ? symbolsCheck.checked : true;
    const useNumbers = numbersCheck ? numbersCheck.checked : true;

    const lower = "abcdefghijklmnopqrstuvwxyz";
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    let pool = lower + upper;
    if (useNumbers) pool += numbers;
    if (useSymbols) pool += symbols;

    // Use Web Crypto CSPRNG
    const randomArray = new Uint32Array(length);
    window.crypto.getRandomValues(randomArray);

    let password = "";
    for (let i = 0; i < length; i++) {
      password += pool[randomArray[i] % pool.length];
    }

    outputInput.value = password;

    // Calculate Shannon entropy (H = L * log2(pool.length))
    const poolSize = pool.length;
    const entropyBits = Math.round(length * Math.log2(poolSize));

    let strengthLabel = "Weak";
    if (entropyBits >= 100) {
      strengthLabel = "Excellent (Cryptographically Resilient)";
    } else if (entropyBits >= 75) {
      strengthLabel = "Strong";
    } else if (entropyBits >= 50) {
      strengthLabel = "Moderate";
    }

    if (entropyDisplay) {
      entropyDisplay.textContent = `Entropy: ~${entropyBits} bits (${strengthLabel})`;
    }
  }

  lengthSlider.addEventListener("input", (e) => {
    if (lengthVal) lengthVal.textContent = e.target.value;
    generateSecurePassword();
  });

  if (symbolsCheck) symbolsCheck.addEventListener("change", generateSecurePassword);
  if (numbersCheck) numbersCheck.addEventListener("change", generateSecurePassword);

  // Click handler that works anywhere on the button
  if (regenerateBtn) {
    const onRegenerateClick = (e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      generateSecurePassword();
    };
    regenerateBtn.addEventListener("click", onRegenerateClick);
  }

  // Copy password to clipboard
  if (copyBtn) {
    copyBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      try {
        await navigator.clipboard.writeText(outputInput.value);
        if (copyTooltip) {
          copyTooltip.classList.add("show");
          setTimeout(() => copyTooltip.classList.remove("show"), 1800);
        }
      } catch {
        outputInput.select();
        document.execCommand("copy");
        if (copyTooltip) {
          copyTooltip.classList.add("show");
          setTimeout(() => copyTooltip.classList.remove("show"), 1800);
        }
      }
    });
  }

  // Initial generation
  generateSecurePassword();
}

/* --------------------------------------------------------------------------
   5. MODALS (RESUME & PROJECT SPECS)
   -------------------------------------------------------------------------- */
function initModals() {
  const resumeModal = document.getElementById("resume-modal");
  const openResumeBtn = document.getElementById("open-resume-btn");
  const quickResumeBtn = document.getElementById("quick-resume-btn");
  const closeResumeBtn = document.getElementById("close-resume-modal");
  const closeFooterBtn = document.getElementById("close-modal-footer-btn");
  const printResumeBtn = document.getElementById("print-resume-btn");

  const graphicalAuthModal = document.getElementById("graphical-auth-modal");
  const openSpecsBtns = document.querySelectorAll(".open-details-btn");
  const closeAuthBtns = document.querySelectorAll(".close-auth-modal");

  function openModal(modal) {
    if (!modal) return;
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove("open");
    document.body.style.overflow = "";
  }

  // Resume Modal Triggers
  if (openResumeBtn) openResumeBtn.addEventListener("click", () => openModal(resumeModal));
  if (quickResumeBtn) {
    quickResumeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      openModal(resumeModal);
    });
  }
  if (closeResumeBtn) closeResumeBtn.addEventListener("click", () => closeModal(resumeModal));
  if (closeFooterBtn) closeFooterBtn.addEventListener("click", () => closeModal(resumeModal));

  if (printResumeBtn) {
    printResumeBtn.addEventListener("click", () => {
      window.print();
    });
  }

  // Project Specs Modal Triggers
  openSpecsBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const modalTarget = btn.getAttribute("data-modal");
      if (modalTarget === "graphical-auth") {
        openModal(graphicalAuthModal);
      }
    });
  });

  closeAuthBtns.forEach(btn => {
    btn.addEventListener("click", () => closeModal(graphicalAuthModal));
  });

  // Close modals on clicking overlay or pressing ESC
  [resumeModal, graphicalAuthModal].forEach(modal => {
    if (!modal) return;
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal(modal);
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal(resumeModal);
      closeModal(graphicalAuthModal);
    }
  });
}

/* --------------------------------------------------------------------------
   6. REAL CONTACT FORM DISPATCH TO mrmadz333@gmail.com
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById("contact-form");
  const submitBtn = document.getElementById("form-submit-btn");
  const feedback = document.getElementById("form-feedback");

  if (!form || !submitBtn) return;

  const nameInput = document.getElementById("form-name");
  const emailInput = document.getElementById("form-email");
  const subjectInput = document.getElementById("form-subject");
  const messageInput = document.getElementById("form-message");

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Clear errors on input
  [nameInput, emailInput, messageInput].forEach(input => {
    if (input) {
      input.addEventListener("input", () => {
        input.closest(".form-group")?.classList.remove("has-error");
        if (feedback) feedback.style.display = "none";
      });
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    let hasError = false;

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const subject = subjectInput?.value.trim() || `[Portfolio Contact] New message from ${name}`;
    const message = messageInput.value.trim();

    if (!name) {
      nameInput.closest(".form-group")?.classList.add("has-error");
      hasError = true;
    }

    if (!email || !isValidEmail(email)) {
      emailInput.closest(".form-group")?.classList.add("has-error");
      hasError = true;
    }

    if (!message) {
      messageInput.closest(".form-group")?.classList.add("has-error");
      hasError = true;
    }

    if (hasError) return;

    // Real live delivery state
    submitBtn.disabled = true;
    const originalBtnHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = `
      <svg class="spin-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
      <span>Dispatching Transmission...</span>
    `;

    try {
      // Direct live submission to FormSubmit endpoint
      const response = await fetch("https://formsubmit.co/ajax/mrmadz333@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name: name,
          email: email,
          _subject: subject,
          message: message
        })
      });

      const data = await response.json();

      if (response.ok || data.success === "true" || data.success === true) {
        feedback.className = "form-feedback success";
        feedback.innerHTML = `<strong>✓ Transmission Delivered:</strong> Message successfully dispatched to <strong>mrmadz333@gmail.com</strong>! Thank you, ${name}. I will review your transmission promptly.`;
        form.reset();
      } else {
        throw new Error(data.message || "Endpoint error");
      }
    } catch (err) {
      console.warn("Direct POST transmission failed, launching mail client fallback:", err);
      // Fallback: direct mailto client execution
      const mailtoUrl = `mailto:mrmadz333@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent("Name: " + name + "\nEmail: " + email + "\n\nMessage:\n" + message)}`;
      window.location.href = mailtoUrl;

      feedback.className = "form-feedback success";
      feedback.innerHTML = `<strong>✓ Mail Client Opened:</strong> Transmission prepared directly addressed to <strong>mrmadz333@gmail.com</strong> in your default mail application.`;
      form.reset();
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHTML;
    }
  });
}

/* --------------------------------------------------------------------------
   7. COPY BUTTONS FOR CONTACT DETAILS
   -------------------------------------------------------------------------- */
function initClipboardButtons() {
  const copyButtons = document.querySelectorAll(".btn-copy-contact");

  copyButtons.forEach(btn => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      const text = btn.getAttribute("data-copy");
      if (!text) return;

      try {
        await navigator.clipboard.writeText(text);
        const originalHTML = btn.innerHTML;
        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00ff66" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
        btn.style.borderColor = "var(--accent-green)";
        setTimeout(() => {
          btn.innerHTML = originalHTML;
          btn.style.borderColor = "";
        }, 1500);
      } catch (err) {
        console.error("Clipboard error:", err);
      }
    });
  });
}

/* --------------------------------------------------------------------------
   8. SCROLL REVEAL ANIMATIONS
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  const targets = Array.from(document.querySelectorAll(".section, .cyber-card, .stat-card"))
    .filter(el => !el.closest(".modal-overlay"));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  }, { threshold: 0.08 });

  targets.forEach(target => {
    target.classList.add("fade-in-section");
    observer.observe(target);
  });
}

/* --------------------------------------------------------------------------
   9. CYBER MATRIX / PARTICLE CANVAS
   -------------------------------------------------------------------------- */
function initCyberCanvas() {
  const canvas = document.getElementById("cyber-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width, height;
  let particles = [];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener("resize", resize);
  resize();

  const particleCount = Math.min(window.innerWidth < 768 ? 25 : 55, 60);

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2 + 1,
      baseAlpha: Math.random() * 0.5 + 0.2
    });
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    const isLight = document.documentElement.getAttribute("data-theme") === "light";
    const particleColor = isLight ? "2, 132, 199" : "0, 240, 255";
    const lineColor = isLight ? "2, 132, 199" : "0, 255, 102";

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.fillStyle = `rgba(${particleColor}, ${p.baseAlpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          ctx.strokeStyle = `rgba(${lineColor}, ${(1 - dist / 110) * 0.15})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
}

/* --------------------------------------------------------------------------
   10. DYNAMIC CURRENT YEAR
   -------------------------------------------------------------------------- */
function setCurrentYear() {
  const yearElement = document.getElementById("current-year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}
