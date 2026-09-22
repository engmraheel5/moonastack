/**
 * MoonaStack - High-Performance IT Solutions & Technology Engineering
 * Mobile-First Controller, Rich Animation Engine & Case Study Modals
 */

document.documentElement.classList.add('js-enabled');

function initMoonaStackApp() {
  // Google Apps Script Web App Endpoint for Form Submissions
  // Automatically logs inquiries into your Google Drive under "MoonaStack Contacts/Site Contact" sheet.
  // Follow the setup guide in the modal or README to deploy your Web App.
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
      const isMs = targetStr.includes('ms');
      const isPlus = targetStr.includes('+');
      const isLessThan = targetStr.includes('<');
      const numericVal = parseFloat(targetStr.replace(/[^0-9.]/g, '')) || 0;

      let current = 0;
      const stepTime = 25;
      const steps = 40;
      const increment = numericVal / steps;

      const timer = setInterval(() => {
        current += increment;
        if (current >= numericVal) {
          current = numericVal;
          clearInterval(timer);
        }

        let formatted = current % 1 === 0 ? current.toFixed(0) : current.toFixed(1);
        if (isLessThan) formatted = '< ' + formatted;
        if (isPercent) formatted = formatted + '%';
        if (isMs) formatted = formatted + 'ms';
        if (isPlus) formatted = formatted + '+';

        el.textContent = formatted;
      }, stepTime);
    });
  };

  /* ==========================================================================
     3. Scroll-Based Reveal Animations
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal');

  // Immediately activate elements that are already within or near the initial viewport
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

          // Trigger stat counter when metrics container appears
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

  // Safety failsafe: ensure all content becomes visible in case of iframe observer restrictions
  setTimeout(() => {
    revealElements.forEach(el => el.classList.add('active'));
    if (!statsCounted) {
      statsCounted = true;
      runCounterAnimation();
    }
  }, 650);

  /* ==========================================================================
     4. Interactive Hero Constellation Canvas (Performance & Mobile Optimized)
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

        // Mouse proximity repulsion/glow
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (1 - dist / mouse.radius);
          this.x -= (dx / dist) * force * 3;
          this.y -= (dy / dist) * force * 3;
          this.radius = this.baseRadius * 1.6;
        } else {
          this.radius = this.baseRadius;
        }
      }

      draw() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowColor = '#00d1ff';
        ctx.shadowBlur = 6;
        ctx.globalAlpha = this.alpha;
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
            const alpha = (1 - dist / maxConnectionDistance) * 0.28;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 209, 255, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Subtle background grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      drawConnections();

      for (let p of particles) {
        p.update();
        p.draw();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    canvas.addEventListener('mouseleave', () => {
      mouse.x = -1000;
      mouse.y = -1000;
    });

    resize();
    animate();
  };
  initHeroCanvas();

  /* ==========================================================================
     5. Interactive 3D Card Hover Effect (Desktop)
     ========================================================================== */
  if (window.matchMedia('(pointer: fine)').matches) {
    const tiltCards = document.querySelectorAll('.service-card, .work-card');
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
      });
    });
  }

  /* ==========================================================================
     6. Technology Filter Tabs
     ========================================================================== */
  const techTabs = document.querySelectorAll('.tech-tab-btn');
  const techCards = document.querySelectorAll('.tech-card');

  techTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      techTabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter') || 'all';

      techCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.3s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ==========================================================================
     7. Work / Case Studies Data & Interactive Deep-Dive Modal
     ========================================================================== */
  // Real enterprise project data derived from the official engineering portfolio documents
  const enterpriseProjects = {
    'alethea': {
      title: 'Alethea AI Platform Engineering',
      client: 'Alethea AI (alethea.ai)',
      role: 'Backend & Test Automation Engineer',
      domain: 'Decentralized Generative AI & Autonomous Agents',
      stack: ['Python', 'Django', 'Django REST Framework', 'React.js', 'pytest', 'unittest', 'PostgreSQL'],
      metrics: [
        { label: 'Latency', value: 'Sub-50ms' },
        { label: 'Character Generation', value: 'CharacterGPT' },
        { label: 'Test Coverage', value: '98%+' },
        { label: 'Asset Minting', value: 'Atomic iNFTs' }
      ],
      executiveSummary: 'Alethea AI is a research and product studio pioneering the convergence of Generative Artificial Intelligence and decentralized blockchain protocols, powering multimodal text-to-character engines (CharacterGPT) and autonomous conversational virtual agents (iNFTs). As Backend & Test Automation Engineer, I architected the server-side REST API infrastructure bridging the React.js client with backend AI model orchestrations, user session states, and rigorous quality assurance pipelines.',
      architecture: [
        'Decoupled ViewSets & Routers: Created dedicated API endpoints for user authentication, character creation workflows, metadata storage, and prompt queues.',
        'Data Serialization & Schema Validation: Designed strict DRF serializers that sanitize incoming prompts, validate bounds, and enforce type safety before hitting execution pipelines.',
        'ORM Optimization & Query Tuning: Modeled complex relational schemas in PostgreSQL with Django ORM, utilizing indexed queries and select_related to eliminate N+1 bottlenecks under peak user traffic.',
        'State Persistence & Transaction Handling: Enforced atomic database transactions for credit tracking, asset minting statuses, and multi-turn conversational histories.'
      ],
      handshake: '01. Prompt Dispatch: React client sends character description and style parameters via authenticated REST API request.\n02. Auth & Sanitization: DRF validates JWT tokens, checks user session allowances, and prepares the generation queue task.\n03. Model Orchestration: Backend dispatches inference jobs to AI processing services while tracking generation states in PostgreSQL.\n04. Hydrated Response: Standardized JSON payload delivers persona attributes, animation links, and asset IDs to the React UI.',
      testingRigor: [
        'REST API Endpoints: Validated status codes (200, 201, 400, 403), payload parsing, header security, and rate limiting with pytest-django and APIClient.',
        'AI Inference Mocking: Isolated third-party AI model endpoints with unittest.mock and monkeypatching, running tests in milliseconds with zero network flakiness.',
        'Database Isolation: Transactional test fixtures and database rollbacks to ensure complete isolation without cross-test state pollution.',
        'CI/CD Pull Request Gates: Automated test suites running on every commit, preventing regressions from merging into main.'
      ],
      impact: 'Dramatically minimized production bug reports, enabled zero-downtime releases, and accelerated feature velocity with spotless API contracts for the React frontend.'
    },
    'apexnow': {
      title: 'ApexNow Broker Microservice Platform',
      client: 'ApexNow (apexnow.com)',
      role: 'Backend & Microservices Engineer',
      domain: 'FinTech • Broker-Dealer Platform • Digital Lending',
      stack: ['FastAPI', 'Pydantic V2', 'Alembic', 'PostgreSQL', 'Celery', 'Redis', 'Investec API', 'Salesforce'],
      metrics: [
        { label: 'Endpoint Latency', value: 'Sub-50ms' },
        { label: 'Enterprise Integrations', value: 'Investec & SF' },
        { label: 'Processing', value: 'Async Celery' },
        { label: 'Test Suite Coverage', value: '90%+' }
      ],
      executiveSummary: 'ApexNow is an advanced API-first FinTech platform providing modular financial services and loan origination infrastructure for brokers, dealers, and financial institutions, replacing legacy paperwork with automated, cloud-native digital lending pipelines. As Backend Engineer, I developed the core Broker Microservice using FastAPI and Pydantic, managing Alembic migrations, orchestrating Celery asynchronous worker queues, and establishing secure enterprise integrations with Investec (lender underwriting) and Salesforce (CRM sync).',
      architecture: [
        'Asynchronous REST Endpoints: Utilized Python async/await paradigm and Uvicorn ASGI server to process concurrent broker and dealer requests with minimal latency.',
        'Pydantic Request/Response Validation: Defined rigorous data models for quotations, proposals, and lender payloads, ensuring automated input validation and serialization.',
        'Alembic Database Migrations: Maintained version-controlled database schemas using Alembic, executing incremental migrations and rollbacks across PostgreSQL environments safely.',
        'Decoupled Microservice Design: Communicated with ecosystem services via asynchronous event brokers and authenticated REST APIs, ensuring high availability and fault containment.'
      ],
      handshake: 'Step 1: Broker/Dealer inputs asset & client details; FastAPI calculates initial pricing terms.\nStep 2: Viable quotation presented to client for review and digital acceptance.\nStep 3: Accepted quote converts to formal proposal with compliance & financial verification.\nStep 4: Proposal submitted asynchronously to internal & external lenders (Investec, etc.) via Celery.',
      testingRigor: [
        'FastAPI Endpoints: Tested with pytest-asyncio and TestClient to validate responses, Pydantic schemas, and broker RBAC rules.',
        'Alembic Migrations: Tested upgrade/downgrade scripts against PostgreSQL test DBs to guarantee zero-downtime database evolution.',
        'Celery Task Verification: Verified asynchronous task dispatch, retry backoff logic, and exception handling using Celery eager mode.',
        'Investec & Salesforce Mocks: Authored unittest.mock fixtures simulating lender payloads, token refresh cycles, and status webhooks.'
      ],
      impact: 'Accelerated quotation-to-proposal conversion and multi-lender submission cycles; eliminated UI blocking during heavy financial syncs with 100% data idempotency.'
    },
    'utilidata': {
      title: 'Utilidata Grid Digitalization Platform',
      client: 'Utilidata (In Collaboration with NVIDIA)',
      role: 'Backend & Data Pipeline Engineer',
      domain: 'Clean Energy • Smart Grid Digitalization • Edge AI',
      stack: ['Django', 'GeoDjango', 'PostGIS', 'Databricks', 'PySpark', 'Apache Airflow', 'AWS', 'LocalStack'],
      metrics: [
        { label: 'Sampling Interval', value: '1-Sec' },
        { label: 'Mapped Assets', value: '100K+' },
        { label: 'API Uptime Target', value: '99.9%' },
        { label: 'Spatial Latency', value: 'Sub-10ms' }
      ],
      executiveSummary: 'Utilidata is a smart grid software company pioneering modern grid digitalization through AI-driven edge computing. In strategic collaboration with NVIDIA, Utilidata developed the Karman platform—embedding AI capabilities directly into smart meters to manage renewable energy, integrate electric vehicles (EVs), and enhance grid resiliency. My responsibilities spanned Django REST APIs, geospatial asset tracking with GeoDjango & PostGIS, distributed big data pipelines on Databricks with PySpark, and Airflow DAG orchestration.',
      architecture: [
        'Geospatial Asset Tracking: Modeled smart meters, transformers, and DER battery units as PointFields with PostGIS spatial indexing (GIST), cutting spatial query execution times to sub-10ms.',
        'Radial Distance & Bounding Containment: Implemented high-speed dwithin proximity lookups and polygon intersects to isolate outage zones and phase topology.',
        'High-Frequency Time-Series ETL: Built distributed PySpark streaming pipelines on Databricks ingesting 1-second interval electrical measurements (voltage RMS, power factor).',
        'Delta Lake Storage: Stored processed telemetry with ACID guarantees, schema enforcement, and rapid time-travel querying.'
      ],
      handshake: '01. Telemetry Landing: Automated Airflow DAGs trigger upon batch arrival in S3, validating payload checksums and device headers.\n02. Databricks Run: Airflow dispatches PySpark jobs for voltage anomaly and sag/swell detection.\n03. Spatial Enrichment: Joins electrical telemetry with PostGIS physical circuit feeder models.\n04. Alert Publishing: Hydrates analytical tables for Django REST APIs and publishes automated SNS notifications.',
      testingRigor: [
        'Geospatial Queries: Verified spatial logic, dwithin proximity radiuses, and coordinate transformations using GeoDjango test runners.',
        'Data Pipeline Logic: Tested PySpark window functions, rolling averages, and voltage anomaly algorithms with local synthetic DataFrames.',
        'AWS Emulation: Virtualized S3, SQS, SNS, and Lambda offline via LocalStack and Terraform, reducing dev onboarding time by 80%.'
      ],
      impact: 'Delivered sub-second spatial queries across 100K+ grid edge assets, processed millions of daily high-frequency telemetry points with zero dropped records, and maintained a 90%+ test coverage standard.'
    },
    'eachat': {
      title: 'EA Chat AI Assistant & Connector Platform',
      client: 'Enterprise Knowledge Hub',
      role: 'Full Stack & AI Integration Engineer',
      domain: 'Retrieval-Augmented Generation (RAG) • Conversational AI',
      stack: ['React.js', 'FastAPI', 'Jira & Slack APIs', 'VectorStore', 'OpenAI Embeddings & LLM', 'Docker'],
      metrics: [
        { label: 'API Response Time', value: 'Sub-Sec' },
        { label: 'Integrated Connectors', value: 'Jira & Slack' },
        { label: 'Context Filtering', value: 'Tag-Based' },
        { label: 'Test Suite Coverage', value: '90%+' }
      ],
      executiveSummary: 'EA Chat is an advanced Retrieval-Augmented Generation (RAG) conversational assistant designed to unify disparate enterprise communication channels and project management tools into a single, intelligent knowledge base. I architected and built the entire system: developing the React.js frontend for real-time chat and connector management, engineering a high-performance FastAPI backend, building secure Jira and Slack sync connectors, managing vector embeddings within a scalable VectorStore, and integrating the OpenAI API for context-aware question answering.',
      architecture: [
        'Asynchronous Connector Engine: Harvests Jira issues, epics, comments, and Slack channel messages with rate-limiting and token refresh.',
        'Vector Embedding & Tagging Pipeline: Cleans raw text, generates OpenAI embeddings, and indexes them with granular tags (source:jira, project:alpha, channel:engineering).',
        'Semantic Similarity Search: Uses cosine similarity with top-k filtering and tag isolation to inject source-backed context into structured prompt templates.',
        'Streaming Response Handshake: Streams the synthesized, source-backed answer directly back to the React UI for instant user perception.'
      ],
      handshake: 'Step 1: User clicks "Sync Jira" or "Sync Slack" in React UI.\nStep 2: FastAPI background task pulls tickets and threads asynchronously.\nStep 3: Text chunker splits documents and sends them to OpenAI Embeddings API.\nStep 4: When user queries in chat, cosine similarity retrieves relevant chunks and OpenAI synthesizes the verified answer.',
      testingRigor: [
        'FastAPI Endpoints: Tested with pytest-asyncio and TestClient validating response schemas and auth guards.',
        'VectorStore Logic: Mocked OpenAI embedding tests verifying vector search dimensions, tag filtering, and ranking accuracy.',
        'RAG Assembly Tests: Verified prompt token budgeting and graceful degradation during external API rate limits.'
      ],
      impact: 'Eliminated context switching across company tools, delivered sub-second conversational retrieval, and guaranteed multi-tenant data privacy with granular tag isolation.'
    },
    'microsoft': {
      title: 'Microsoft BluePrint Enterprise Architecture',
      client: 'Microsoft Azure Reference Initiative',
      role: 'Backend & Distributed Systems Engineer',
      domain: 'Enterprise Cloud Lakehouse • Multi-Threaded C# APIs',
      stack: ['C# .NET Core', 'Azure Synapse Analytics', 'PySpark', 'Delta Lake', 'ADLS Gen2', 'Docker'],
      metrics: [
        { label: 'API Concurrency', value: 'Multi-Thread' },
        { label: 'Compute Pool', value: 'Synapse Spark' },
        { label: 'Data Tier', value: 'Silver Layer' },
        { label: 'Pipeline Reliability', value: '99.9%' }
      ],
      executiveSummary: 'The Microsoft BluePrint enterprise architecture initiative establishes reference implementations and data engineering patterns for large-scale distributed cloud systems, utilizing Azure Synapse Analytics as a powerful enterprise lakehouse ecosystem. My responsibilities centered on developing high-performance, multi-threaded C# .NET APIs capable of concurrent task coordination and workload dispatching, orchestrating distributed PySpark data processing jobs on Azure Synapse Spark pools, and engineering the mission-critical Silver data pipelines within the Medallion architecture.',
      architecture: [
        'Multi-Threaded C# API Architecture: Leveraged async/await patterns and Task Parallel Library (TPL) with SemaphoreSlim synchronization to coordinate parallel batch operations.',
        'Azure Synapse SDK Integration: Integrated official Azure .NET SDKs to programmatically trigger, parameterize, and monitor PySpark pipeline runs.',
        'Medallion Silver Pipeline Engineering: Built transformation pipelines that ingest raw Bronze data, enforce Delta Lake schemas, eliminate duplicates, and execute optimized MERGE INTO upserts without full table re-writes.',
        'Stateless Service Design: Architected controllers to scale horizontally behind Azure Application Gateway with Polly-based resilience retries.'
      ],
      handshake: 'Step 1: C# Controller receives batch trigger payload and initializes async task context.\nStep 2: Concurrent task dispatcher coordinates job dependencies with semaphore throttling.\nStep 3: Azure Synapse API submits PySpark job to Spark pool and monitors execution status until clean completion.',
      testingRigor: [
        'C# API Testing: Authored xUnit unit tests with Moq dependency mocking and concurrency stress tests validating thread safety.',
        'PySpark Local Testing: Built lightweight local Spark testing harnesses verifying Delta MERGE logic and schema enforcement.',
        'CI/CD Quality Gates: Integrated Azure DevOps CI pipelines with automated test runs and 90%+ code coverage thresholds.'
      ],
      impact: 'Delivered multi-threaded APIs capable of heavy workload coordination without thread pool starvation; transformed raw ingestion feeds into certified, high-quality enterprise assets.'
    },
    'constructionbevy': {
      title: 'ConstructionBevy Platform Engineering',
      client: 'ConstructionBevy (constructionbevy.com)',
      role: 'Backend Engineer',
      domain: 'ConstructionTech • AI Bidding Network • Estimating Math',
      stack: ['Django', 'Django REST Framework', 'django-dsl-drf', 'PostgreSQL', 'Redis', 'PyTest'],
      metrics: [
        { label: 'Indexed Bid Docs', value: '1,000s' },
        { label: 'DSL Search Latency', value: 'Sub-50ms' },
        { label: 'Calculation Precision', value: '100%' },
        { label: 'Test Suite Coverage', value: '90%+' }
      ],
      executiveSummary: 'ConstructionBevy is the world\'s first AI-driven bidding network tailored specifically for commercial subcontractors and general contractors, automating preconstruction workflows from invitation-to-bid (ITB) intake and AI-powered document indexing to bid/no-bid recommendations. My core contributions centered on building server-side APIs in Django & DRF, integrating the django-dsl-drf library to power advanced document search across architectural drawings, engineering complex multi-variable form calculation and answer evaluation engines, and authoring extensive PyTest suites.',
      architecture: [
        'Advanced Document Search via django-dsl-drf: Configured domain-specific language search syntax (e.g. division:03 status:active keyword:"concrete") directly against PostgreSQL and JSON indexes.',
        'Sub-50ms Indexing: Implemented database-level indexing across complex drawing indices, allowing estimators to combine free-text searches with precise attribute filtering.',
        'Heavy Form Calculation Engines: Developed computational models handling multi-variable tender pricing, crew labor multipliers, material cost indices, and subcontractor scope leveling.',
        'Decimal Precision & Integrity: Utilized Python decimal module for all financial calculations, preventing floating-point errors with immutable audit logging.'
      ],
      handshake: '01. Tender Intake: ITB forms parsed into structured dynamic question-and-answer Django models.\n02. Evaluation Engine: Cross-references questions against subcontractor preferences and historical data.\n03. Automated Scoring: Generates Go/No-Go recommendations and pre-populates bid responses.\n04. Transactional Locking: Enforces atomic database transactions during final bid sign-off.',
      testingRigor: [
        'REST API & Search: Validated response schemas, HTTP codes, and DSL query fixtures with pytest-django.',
        'Form Calculations: Parameterized PyTest test cases with strict decimal assertions covering pricing edge cases and scope leveling.',
        'Database Transactions: Guaranteed atomic rollbacks on failed submissions to prevent partial data corruption.'
      ],
      impact: 'Enabled sub-50ms document discovery across thousands of complex architectural files and eliminated rounding errors in high-stakes commercial subcontractor bids.'
    }
  };

  // Work filter tabs
  const workFilters = document.querySelectorAll('.filter-btn');
  const workCards = document.querySelectorAll('.work-card');

  workFilters.forEach(btn => {
    btn.addEventListener('click', () => {
      workFilters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter') || 'all';

      workCards.forEach(card => {
        const cat = card.getAttribute('data-category') || '';
        if (filter === 'all' || cat.includes(filter)) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.3s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Modal open/close logic
  const projectModal = document.getElementById('projectModal');
  const modalDetails = document.getElementById('modalDetails');
  const closeModalBtn = document.getElementById('closeModalBtn');

  const openProjectModal = (projectKey) => {
    const data = enterpriseProjects[projectKey];
    if (!data || !projectModal || !modalDetails) return;

    modalDetails.innerHTML = `
      <div style="margin-bottom: 8px;">
        <span class="badge-tag">${data.domain}</span>
      </div>
      <h2 style="font-size: 1.6rem; color: var(--text-highlight); margin-bottom: 6px;">${data.title}</h2>
      <p style="font-size: 0.88rem; color: var(--accent-cyan); font-weight: 600; margin-bottom: 16px;">
        ${data.client} • Role: ${data.role}
      </p>

      <!-- Key Metrics Row -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px; margin-bottom: 20px; background: rgba(0, 209, 255, 0.04); border: 1px solid rgba(0, 209, 255, 0.15); border-radius: var(--radius-sm); padding: 12px 14px;">
        ${data.metrics.map(m => `
          <div>
            <div style="font-family: var(--font-mono); font-size: 1.15rem; font-weight: 700; color: #a5f3fc;">${m.value}</div>
            <div style="font-size: 0.72rem; text-transform: uppercase; color: var(--text-muted);">${m.label}</div>
          </div>
        `).join('')}
      </div>

      <!-- Navigation Tabs inside Modal -->
      <div class="modal-tabs">
        <button class="modal-tab-btn active" data-pane="tab-summary">Executive Summary</button>
        <button class="modal-tab-btn" data-pane="tab-arch">System Architecture</button>
        <button class="modal-tab-pane-btn modal-tab-btn" data-pane="tab-handshake">Request Handshake</button>
        <button class="modal-tab-btn" data-pane="tab-testing">Testing & QA Rigor</button>
      </div>

      <!-- Pane 1: Summary -->
      <div class="modal-tab-pane active" id="tab-summary">
        <p style="font-size: 0.94rem; color: var(--text-secondary); line-height: 1.65; margin-bottom: 16px;">
          ${data.executiveSummary}
        </p>
        <h4 style="font-size: 0.95rem; margin-bottom: 10px; color: var(--text-highlight);">Technology Stack & Tooling:</h4>
        <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px;">
          ${data.stack.map(tech => `<span class="work-tag" style="background: rgba(0, 209, 255, 0.08); border-color: rgba(0, 209, 255, 0.25); color: #7dd3fc;">${tech}</span>`).join('')}
        </div>
        <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.25); border-radius: var(--radius-sm); padding: 12px 14px; font-size: 0.88rem; color: #6ee7b7;">
          <strong>Engineering Impact:</strong> ${data.impact}
        </div>
      </div>

      <!-- Pane 2: Architecture -->
      <div class="modal-tab-pane" id="tab-arch">
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 12px;">
          ${data.architecture.map(item => `
            <li style="display: flex; align-items: flex-start; gap: 10px; font-size: 0.9rem; color: var(--text-secondary); line-height: 1.55;">
              <span style="color: var(--accent-cyan); font-weight: bold;">•</span>
              <span>${item}</span>
            </li>
          `).join('')}
        </ul>
      </div>

      <!-- Pane 3: Handshake -->
      <div class="modal-tab-pane" id="tab-handshake">
        <p style="font-size: 0.86rem; color: var(--text-muted); margin-bottom: 10px;">
          Standardized JSON payload contract and client-server request/response flow:
        </p>
        <div class="code-block-container" style="margin: 0;">
          <pre>${data.handshake}</pre>
        </div>
      </div>

      <!-- Pane 4: Testing & QA -->
      <div class="modal-tab-pane" id="tab-testing">
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 12px;">
          ${data.testingRigor.map(item => `
            <li style="display: flex; align-items: flex-start; gap: 10px; font-size: 0.9rem; color: var(--text-secondary); line-height: 1.55;">
              <span style="color: #10b981; font-weight: bold;">✓</span>
              <span>${item}</span>
            </li>
          `).join('')}
        </ul>
      </div>

      <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
        <span style="font-size: 0.8rem; color: var(--text-muted);">MoonaStack Enterprise Verified Case Study</span>
        <a href="#contact" class="btn btn-primary btn-sm modal-inquire-btn" onclick="document.getElementById('projectModal').classList.remove('active'); document.body.style.overflow='';">
          Discuss Similar Project &rarr;
        </a>
      </div>
    `;

    // Hook up internal modal tab switching
    const tabButtons = modalDetails.querySelectorAll('.modal-tab-btn');
    const tabPanes = modalDetails.querySelectorAll('.modal-tab-pane');
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        tabButtons.forEach(b => b.classList.remove('active'));
        tabPanes.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const targetId = btn.getAttribute('data-pane');
        const targetPane = modalDetails.querySelector(`#${targetId}`);
        if (targetPane) targetPane.classList.add('active');
      });
    });

    projectModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  // Bind project cards view button
  document.querySelectorAll('.view-project-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const projectKey = btn.getAttribute('data-project');
      if (projectKey) openProjectModal(projectKey);
    });
  });

  const closeProjectModal = () => {
    if (projectModal) {
      projectModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  closeModalBtn?.addEventListener('click', closeProjectModal);
  projectModal?.addEventListener('click', (e) => {
    if (e.target === projectModal) closeProjectModal();
  });

  // Esc key to close any modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProjectModal();
      document.getElementById('sheetsGuideModal')?.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  /* ==========================================================================
     8. Google Apps Script Setup Guide Modal
     ========================================================================== */
  const openSheetsGuideBtn = document.getElementById('openSheetsGuideBtn');
  const sheetsGuideModal = document.getElementById('sheetsGuideModal');
  const closeGuideModalBtn = document.getElementById('closeGuideModalBtn');
  const copyScriptBtn = document.getElementById('copyScriptBtn');
  const appsScriptCode = document.getElementById('appsScriptCode');

  openSheetsGuideBtn?.addEventListener('click', () => {
    sheetsGuideModal?.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  const closeGuide = () => {
    sheetsGuideModal?.classList.remove('active');
    document.body.style.overflow = '';
  };

  closeGuideModalBtn?.addEventListener('click', closeGuide);
  sheetsGuideModal?.addEventListener('click', (e) => {
    if (e.target === sheetsGuideModal) closeGuide();
  });

  copyScriptBtn?.addEventListener('click', () => {
    if (!appsScriptCode) return;
    navigator.clipboard.writeText(appsScriptCode.textContent || '').then(() => {
      copyScriptBtn.textContent = 'Copied!';
      setTimeout(() => {
        copyScriptBtn.textContent = 'Copy Code';
      }, 2500);
    });
  });

  /* ==========================================================================
     9. Services Links to Pre-fill Contact Form
     ========================================================================== */
  const serviceButtons = document.querySelectorAll('.service-link');
  const serviceSelect = document.getElementById('service');
  serviceButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const sVal = btn.getAttribute('data-service');
      if (serviceSelect && sVal) {
        serviceSelect.value = sVal;
      }
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ==========================================================================
     10. Contact Form Submission & Lead Dispatch (with Google Sheets & Local Fallback)
     ========================================================================== */
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const formStatus = document.getElementById('formStatus');

  if (contactForm && submitBtn && formStatus) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Reset validation states
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

        // Email regex check
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

      // Extract form fields
      const formData = {
        name: document.getElementById('name')?.value.trim() || '',
        email: document.getElementById('email')?.value.trim() || '',
        company: document.getElementById('company')?.value.trim() || 'N/A',
        phone: document.getElementById('phone')?.value.trim() || 'N/A',
        service: document.getElementById('service')?.value || 'General Inquiry',
        message: document.getElementById('message')?.value.trim() || '',
        timestamp: new Date().toISOString(),
        formattedDate: new Date().toLocaleString()
      };

      // Button loading state
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;
      formStatus.style.display = 'none';
      formStatus.className = 'form-feedback';

      try {
        if (GOOGLE_APPS_SCRIPT_URL && GOOGLE_APPS_SCRIPT_URL !== 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
          // Live Google Apps Script Web App submission
          await fetch(GOOGLE_APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // standard cross-origin POST for Google Apps Script Web Apps
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
          });
        } else {
          // LocalStorage fallback when URL is still the default placeholder
          const existingLeads = JSON.parse(localStorage.getItem('moonastack_inquiries') || localStorage.getItem('moonstack_inquiries') || '[]');
          existingLeads.push(formData);
          localStorage.setItem('moonastack_inquiries', JSON.stringify(existingLeads));
          await new Promise(r => setTimeout(r, 650)); // realistic network feel
        }

        // Display Success Feedback
        formStatus.innerHTML = `
          <strong>Inquiry Dispatched Successfully!</strong><br>
          Thank you, ${formData.name}. Our technical solutions team will review your project requirements and respond within 24 business hours.
        `;
        formStatus.className = 'form-feedback success';
        formStatus.style.display = 'block';
        contactForm.reset();
      } catch (err) {
        console.error('Submission error:', err);
        formStatus.innerHTML = `
          <strong>Submission Error:</strong> Unable to dispatch inquiry. Please email us directly at <a href="mailto:raheel@moonstack.tech" style="color: var(--accent-cyan); text-decoration: underline;">raheel@moonstack.tech</a>.
        `;
        formStatus.className = 'form-feedback';
        formStatus.style.display = 'block';
        formStatus.style.background = 'rgba(239, 68, 68, 0.12)';
        formStatus.style.border = '1px solid rgba(239, 68, 68, 0.3)';
        formStatus.style.color = '#f87171';
      } finally {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
      }
    });

    // Clear error style on input focus
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
