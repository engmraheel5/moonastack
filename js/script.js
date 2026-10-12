/**
 * MoonaStack - Intelligent Workflow Automation for Teams
 * Autonomous AI Agent Engine, Interactive Simulator & 4D Spatial Stage Controller
 */

document.documentElement.classList.add('js-enabled');

function initMoonaStackApp() {
  // Google Apps Script Web App Endpoint for Early Access Form Submissions
  const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyieGaNcB5GBoRK-uIUqk_chiuLnSM0opHfPcSmYf1oFIFxUQFzyXdlml3wa7DUFphf9g/exec';

  /* ==========================================================================
     1. Mobile Navigation & Drawer Controller
     ========================================================================== */
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const siteHeader = document.getElementById('siteHeader');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navMenu.classList.toggle('mobile-open');
      mobileToggle.classList.toggle('active', isOpen);
      mobileToggle.setAttribute('aria-expanded', isOpen.toString());
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close mobile drawer when clicking any link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('mobile-open')) {
          navMenu.classList.remove('mobile-open');
          mobileToggle.classList.remove('active');
          mobileToggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      });
    });

    // Close when tapping outside the menu
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('mobile-open') && !navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        navMenu.classList.remove('mobile-open');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  // Header blur and shadow on scroll
  const handleScrollHeader = () => {
    if (window.scrollY > 20) {
      siteHeader?.classList.add('scrolled');
    } else {
      siteHeader?.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScrollHeader, { passive: true });
  handleScrollHeader();

  /* ==========================================================================
     2. Animated Stat Counters on Scroll
     ========================================================================== */
  const statElements = document.querySelectorAll('[data-counter-target]');
  let statsCounted = false;

  const runCounterAnimation = () => {
    statElements.forEach(el => {
      const targetStr = el.getAttribute('data-counter-target') || '0';
      const isPercent = targetStr.includes('%');
      const isPlus = targetStr.includes('+');
      const numericVal = parseFloat(targetStr.replace(/[^0-9.]/g, '')) || 0;

      let current = 0;
      const stepTime = 25;
      const steps = 30;
      const increment = numericVal / steps;

      const timer = setInterval(() => {
        current += increment;
        if (current >= numericVal) {
          current = numericVal;
          clearInterval(timer);
        }

        let formatted = current % 1 === 0 ? current.toFixed(0) : current.toFixed(1);
        if (isPercent) formatted = formatted + '%';
        if (isPlus) formatted = formatted + '+';

        el.textContent = formatted;
      }, stepTime);
    });
  };

  /* ==========================================================================
     3. Scroll-Based Reveal Animations
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal');

  revealElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top <= (window.innerHeight || document.documentElement.clientHeight) + 80) {
      el.classList.add('active');
    }
  });

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');

          if (entry.target.classList.contains('hero-badges') && !statsCounted) {
            statsCounted = true;
            runCounterAnimation();
          }
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: '40px 0px 40px 0px'
    });

    revealElements.forEach(el => {
      if (!el.classList.contains('active')) {
        revealObserver.observe(el);
      }
    });
  } else {
    revealElements.forEach(el => el.classList.add('active'));
  }

  setTimeout(() => {
    revealElements.forEach(el => el.classList.add('active'));
    if (!statsCounted) {
      statsCounted = true;
      runCounterAnimation();
    }
  }, 650);

  /* ==========================================================================
     4. Interactive Hero Constellation Canvas
     ========================================================================== */
  const initHeroCanvas = () => {
    const canvas = document.getElementById('architectureCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particles = [];
    let animationFrameId = null;
    let mouse = { x: -1000, y: -1000, radius: 110 };

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      width = canvas.width = rect ? rect.width : 400;
      height = canvas.height = rect ? rect.height : 320;
      createParticles();
    };

    const isMobile = window.innerWidth <= 768;
    const particleCount = isMobile ? 32 : 55;
    const maxConnectionDistance = isMobile ? 75 : 95;

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.75;
        this.vy = (Math.random() - 0.5) * 0.75;
        this.radius = Math.random() * 2 + 1.2;
        this.baseRadius = this.radius;
        this.alpha = Math.random() * 0.6 + 0.3;
        this.color = Math.random() > 0.3 ? '#00d1ff' : '#60a5fa';
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          this.x -= (dx / distance) * force * 3;
          this.y -= (dy / distance) * force * 3;
          this.radius = this.baseRadius * 1.5;
        } else {
          this.radius = this.baseRadius;
        }
      }

      draw() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
      }
    }

    const createParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const drawConnections = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxConnectionDistance) {
            const opacity = (1 - dist / maxConnectionDistance) * 0.28;
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = '#00d1ff';
            ctx.globalAlpha = opacity;
            ctx.lineWidth = 0.8;
            ctx.stroke();
            ctx.restore();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      drawConnections();
      animationFrameId = requestAnimationFrame(animate);
    };

    resize();
    animate();

    window.addEventListener('resize', () => {
      cancelAnimationFrame(animationFrameId);
      resize();
      animate();
    });

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    canvas.addEventListener('mouseleave', () => {
      mouse.x = -1000;
      mouse.y = -1000;
    });
  };
  initHeroCanvas();

  /* ==========================================================================
     5. 4D Anamorphic Spatial Stage: MoonaStack Walking Out of Screen Controller
     ========================================================================== */
  const init4DSpatialStage = () => {
    const card = document.getElementById('spatial4DCard');
    const walker = document.getElementById('moonaWalker');
    const breachBtn = document.getElementById('spatialBreachBtn');
    const depthVal = document.getElementById('depthValue');
    if (!card || !walker) return;

    let isSurging = false;
    let surgeTimeout = null;

    const handleMove = (clientX, clientY) => {
      if (isSurging) return;

      const rect = card.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotX = ((y - centerY) / centerY) * -12;
      const rotY = ((x - centerX) / centerX) * 16;

      card.style.transform = `perspective(1200px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;

      const forwardZ = 90 + ((y - centerY) / centerY) * -35;
      walker.style.transform = `translateX(-50%) translateZ(${Math.max(60, forwardZ)}px)`;

      if (depthVal) {
        const mm = Math.round(160 + ((y - centerY) / centerY) * -50);
        depthVal.textContent = `+${Math.max(120, mm)}mm`;
      }
    };

    card.addEventListener('mousemove', (e) => {
      handleMove(e.clientX, e.clientY);
    });

    card.addEventListener('mouseleave', () => {
      if (isSurging) return;
      card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)';
      walker.style.transform = 'translateX(-50%) translateZ(90px)';
      if (depthVal) {
        depthVal.textContent = '+160mm';
      }
    });

    card.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    card.addEventListener('touchend', () => {
      if (isSurging) return;
      card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)';
      walker.style.transform = 'translateX(-50%) translateZ(90px)';
      if (depthVal) {
        depthVal.textContent = '+160mm';
      }
    });

    // "⚡ Step Closer" Interactive 4D Surge
    if (breachBtn) {
      breachBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isSurging) return;

        isSurging = true;
        card.classList.add('breach-surge');
        breachBtn.textContent = '🚀 BREACH ACTIVE!';
        breachBtn.style.background = 'rgba(0, 209, 255, 0.4)';
        breachBtn.style.borderColor = '#ffffff';

        if (depthVal) {
          depthVal.textContent = '+280mm [MAX DEPTH]';
          depthVal.style.color = '#ffffff';
        }

        const stage = document.getElementById('spatialScreenStage');
        if (stage) {
          const burst = document.createElement('div');
          burst.className = 'step-shockwave ring-2';
          burst.style.cssText = 'bottom: 22px; left: 68%; border-color: #ffffff; width: 140px; height: 80px;';
          stage.appendChild(burst);
          setTimeout(() => burst.remove(), 2000);
        }

        if (surgeTimeout) clearTimeout(surgeTimeout);
        surgeTimeout = setTimeout(() => {
          card.classList.remove('breach-surge');
          isSurging = false;
          breachBtn.textContent = '⚡ Step Closer';
          breachBtn.style.background = '';
          breachBtn.style.borderColor = '';
          walker.style.transform = 'translateX(-50%) translateZ(90px)';
          if (depthVal) {
            depthVal.textContent = '+160mm';
            depthVal.style.color = '';
          }
        }, 3200);
      });
    }
  };
  init4DSpatialStage();

  /* ==========================================================================
     6. Live Agent Workflow Simulator Controller
     ========================================================================== */
  const initWorkflowSimulator = () => {
    const pills = document.querySelectorAll('.scenario-pill-btn');
    const logContainer = document.getElementById('agentReasoningLog');
    const nodeSlack = document.getElementById('nodeSlack');
    const nodeDocs = document.getElementById('nodeDocs');
    const nodeBoards = document.getElementById('nodeBoards');
    const nodeClaude = document.getElementById('nodeClaude');

    if (!pills.length || !logContainer) return;

    const scenarios = {
      incident: {
        nodes: ['nodeSlack', 'nodeDocs', 'nodeBoards', 'nodeClaude'],
        logs: [
          { time: '10:04:12', agent: 'MoonaStack Agent:', text: 'Received event from Slack #eng-triage: "Customer reporting 429 rate limit on API checkout endpoint."' },
          { time: '10:04:13', agent: 'Claude Reasoning:', text: 'Searching internal runbooks and architecture docs for "API rate limits"...', highlight: true },
          { time: '10:04:13', agent: 'Knowledge Retrieval:', text: 'Retrieved Runbook RB-402: "Payment Gateway Tier Quotas & Fallback Procedure".' },
          { time: '10:04:14', agent: 'Agentic Action:', text: 'Dispatched tool call: create_jira_issue(project="ENG", priority="P1", title="API 429 surge on checkout")', highlight: true },
          { time: '10:04:15', agent: 'Slack Notification:', text: '✓ Posted resolution summary to #eng-triage with Jira ticket ENG-1849 linked and runbook steps cited.', success: true }
        ]
      },
      sync: {
        nodes: ['nodeBoards', 'nodeSlack', 'nodeClaude'],
        logs: [
          { time: '09:00:01', agent: 'MoonaStack Agent:', text: 'Cron trigger fired: Weekly Monday engineering sprint sync.' },
          { time: '09:00:02', agent: 'Cross-Tool Query:', text: 'Querying Linear and GitHub: 14 PRs merged, 3 blockers pending review.', highlight: true },
          { time: '09:00:03', agent: 'Claude Reasoning:', text: 'Synthesizing team standup summary categorized by Feature, Bugfix, and Blockers...' },
          { time: '09:00:04', agent: 'Slack Notification:', text: '✓ Posted sprint progress digest to #team-standup with blocker owners tagged.', success: true }
        ]
      },
      knowledge: {
        nodes: ['nodeSlack', 'nodeDocs', 'nodeClaude'],
        logs: [
          { time: '14:22:10', agent: 'Slack Question:', text: 'Teammate in #general asked: "What is our company policy on expense approvals over $500?"' },
          { time: '14:22:11', agent: 'Vector Search:', text: 'Scanning Google Drive & Notion for "Expense & Reimbursement Policy 2026"...', highlight: true },
          { time: '14:22:12', agent: 'Knowledge Retrieval:', text: 'Found Doc "Finance-Policy-v4", Section 3.2: "Manager pre-approval required via Ramp/Brex."' },
          { time: '14:22:13', agent: 'Claude Response:', text: '✓ Replied directly in Slack thread with exact policy quote and link to approval form.', success: true }
        ]
      }
    };

    const renderScenario = (key) => {
      const data = scenarios[key];
      if (!data) return;

      // Update active nodes
      [nodeSlack, nodeDocs, nodeBoards, nodeClaude].forEach(n => n?.classList.remove('active-node'));
      data.nodes.forEach(id => {
        document.getElementById(id)?.classList.add('active-node');
      });

      // Render logs
      logContainer.innerHTML = data.logs.map(log => `
        <div class="log-entry">
          <span class="log-time">[${log.time}]</span>
          <span class="log-agent-name">${log.agent}</span>
          <span class="log-text ${log.highlight ? 'highlight' : ''} ${log.success ? 'success' : ''}">${log.text}</span>
        </div>
      `).join('');
    };

    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const key = pill.getAttribute('data-scenario') || 'incident';
        renderScenario(key);
      });
    });
  };
  initWorkflowSimulator();

  /* ==========================================================================
     7. Early Access Form Submission Controller
     ========================================================================== */
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const formStatus = document.getElementById('formStatus');

  if (contactForm && submitBtn && formStatus) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      let isValid = true;
      const requiredInputs = contactForm.querySelectorAll('input[required], textarea[required]');

      requiredInputs.forEach(input => {
        const errorSpan = input.nextElementSibling;
        if (!input.value.trim()) {
          isValid = false;
          input.classList.add('error');
          if (errorSpan && errorSpan.classList.contains('error-message')) {
            errorSpan.classList.add('visible');
          }
        } else {
          input.classList.remove('error');
          if (errorSpan && errorSpan.classList.contains('error-message')) {
            errorSpan.classList.remove('visible');
          }
        }

        if (input.type === 'email' && input.value.trim()) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(input.value.trim())) {
            isValid = false;
            input.classList.add('error');
            if (errorSpan) errorSpan.classList.add('visible');
          }
        }
      });

      if (!isValid) return;

      const formData = {
        name: document.getElementById('name')?.value.trim() || '',
        email: document.getElementById('email')?.value.trim() || '',
        company: document.getElementById('company')?.value.trim() || 'N/A',
        stack: document.getElementById('primaryStack')?.value || 'General',
        message: document.getElementById('message')?.value.trim() || '',
        timestamp: new Date().toISOString(),
        formattedDate: new Date().toLocaleString()
      };

      submitBtn.classList.add('loading');
      submitBtn.disabled = true;
      formStatus.style.display = 'none';
      formStatus.className = 'form-feedback';

      try {
        if (GOOGLE_APPS_SCRIPT_URL && GOOGLE_APPS_SCRIPT_URL !== 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
          await fetch(GOOGLE_APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
          });
        }

        // Save local backup
        const existingLeads = JSON.parse(localStorage.getItem('moonastack_early_access') || '[]');
        existingLeads.push(formData);
        localStorage.setItem('moonastack_early_access', JSON.stringify(existingLeads));

        formStatus.innerHTML = `
          <strong>Early Access Requested!</strong><br>
          Thank you, ${formData.name}. We have registered ${formData.email} for the private beta cohort. You will receive an onboarding invite shortly. You can also reach out anytime at <a href="mailto:raheel@moonastack.tech" style="color: var(--accent-cyan); text-decoration: underline;">raheel@moonastack.tech</a>.
        `;
        formStatus.className = 'form-feedback success';
        formStatus.style.display = 'block';
        contactForm.reset();
      } catch (err) {
        console.error('Submission error:', err);
        formStatus.innerHTML = `
          <strong>Inquiry recorded!</strong><br>
          Please also email us directly at <a href="mailto:raheel@moonastack.tech" style="color: var(--accent-cyan); text-decoration: underline;">raheel@moonastack.tech</a> to guarantee priority beta access.
        `;
        formStatus.className = 'form-feedback';
        formStatus.style.display = 'block';
        formStatus.style.background = 'rgba(0, 209, 255, 0.12)';
        formStatus.style.border = '1px solid rgba(0, 209, 255, 0.3)';
        formStatus.style.color = '#38bdf8';
      } finally {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
      }
    });

    contactForm.querySelectorAll('input, textarea').forEach(input => {
      input.addEventListener('input', () => {
        input.classList.remove('error');
        const err = input.nextElementSibling;
        if (err && err.classList.contains('error-message')) {
          err.classList.remove('visible');
        }
      });
    });
  }
}

// Support standard scripts, deferred scripts, and bundled ES modules
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMoonaStackApp);
} else {
  initMoonaStackApp();
}
