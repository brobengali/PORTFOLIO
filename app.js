/**
 * ============================================================================
 * INDIAN SPICE MARKET MEETS DEV TERMINAL — JAVASCRIPT ENGINE
 * Features: Interactive Terminal, Contribution Matrix, Scrollspy, Tactile Copy,
 * Form Dispatch Simulation, Audio/Visual Haptics
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initTerminalConsole();
  initContributionHeatmap();
  initScrollspy();
  initMobileNav();
  initCopyActions();
  initContactForm();
  initUptimeCounter();
  initResumeDownload();
});

/* ============================================================================
   1. HERO INTERACTIVE TERMINAL CONSOLE
   ============================================================================ */
function initTerminalConsole() {
  const terminalBody = document.getElementById('heroTerminalOutput');
  const cliForm = document.getElementById('terminalCliForm');
  const cliInput = document.getElementById('terminalCliInput');
  const quickButtons = document.querySelectorAll('.quick-cmd-btn');

  if (!terminalBody || !cliForm || !cliInput) return;

  const COMMAND_REGISTRY = {
    help: () => `
<span class="highlight-gold">AVAILABLE TERMINAL COMMANDS:</span><br>
  • <span class="highlight-green">whoami</span>        : Inspect architect credentials and location<br>
  • <span class="highlight-green">skills</span>        : Display categorized spice inventory<br>
  • <span class="highlight-green">projects</span>      : List high-heat recipe card summaries<br>
  • <span class="highlight-green">git log</span>       : Output recent production commit stream<br>
  • <span class="highlight-green">stats</span>         : Query production metrics and uptime<br>
  • <span class="highlight-green">contact</span>       : Jump to official merchant chit<br>
  • <span class="highlight-green">sudo hire</span>     : Fast-track priority dispatch<br>
  • <span class="highlight-green">clear</span>         : Flush console buffer
    `,

    whoami: () => `
<strong>Rahul Sharma</strong> // Staff Backend & Distributed Systems Engineer<br>
• Base: Bengaluru, India [IST // UTC+5:30]<br>
• Focus: Zero-copy event brokers, Raft consensus, memory-mapped storage<br>
• Philosophy: Proportions dictate flavor. Zero unneeded dependencies.
    `,

    skills: () => `
<span class="highlight-gold">SPICE INVENTORY SUMMARY:</span><br>
[Base Spices]   : Rust, Go, TypeScript, C++20, Python<br>
[Tadka/RPC]     : gRPC, Tokio, Actix, WebSockets, Node.js/Bun<br>
[Cold Cellar]   : PostgreSQL (WAL), Redis Streams, Kafka, ClickHouse<br>
[Merchant Tools]: Linux eBPF, Docker, Kubernetes, Terraform
    `,

    stack: () => COMMAND_REGISTRY.skills(),

    projects: () => `
<span class="highlight-gold">DEPLOYED RECIPES:</span><br>
1. <span class="highlight-red">DhabaOS</span>      : Distributed POS & Kitchen sync fabric (Go/gRPC/Redis Streams)<br>
2. <span class="highlight-red">GaramQueue</span>   : Zero-copy 10GbE append-only log broker (Rust/io_uring)<br>
3. <span class="highlight-red">KhataZero</span>    : Cryptographic double-entry ledger with Merkle checks (TS/Postgres)<br>
4. <span class="highlight-red">MasalaScript</span> : Domain bytecode compiler & threaded VM (C++20/LLVM)
    `,

    recipes: () => COMMAND_REGISTRY.projects(),

    'git log': () => `
<span class="highlight-gold">RECENT COMMITS:</span><br>
* <span class="highlight-green">f7d2a91</span> (HEAD -> main) feat(storage): cut AWS S3 egress bills by 42%<br>
* <span class="highlight-green">b3e810c</span> fix(postgres): resolved write-amplification deadlock in partition scheme<br>
* <span class="highlight-green">40a9d2e</span> perf(ci): lowered test cycle from 26m to 3m 12s with multi-stage scratch
    `,

    stats: () => `
<span class="highlight-gold">SYSTEM TELEMETRY:</span><br>
• Commits Shipped : 14,280+<br>
• Engine p99      : 320 microseconds<br>
• Production SLA  : 99.995% uptime<br>
• P1 Regressions  : 0
    `,

    contact: () => {
      setTimeout(() => {
        const contactSec = document.getElementById('contact');
        if (contactSec) contactSec.scrollIntoView({ behavior: 'smooth' });
      }, 300);
      return `<span class="highlight-green">Routing transmission channel to Merchant Chit...</span>`;
    },

    'sudo hire': () => `
<span class="highlight-green">[AUTHENTICATION PASSED]</span> Sudo privilege granted.<br>
Direct channel open. Email: <span class="highlight-gold">rahul.sharma@spiceterm.dev</span><br>
Dispatching notification to Rahul's pager...
    `,

    clear: () => {
      terminalBody.innerHTML = '';
      return '';
    }
  };

  function executeCommand(rawCmd) {
    const trimmed = rawCmd.trim().toLowerCase();
    if (!trimmed) return;

    // Create prompt line
    const promptEntry = document.createElement('div');
    promptEntry.className = 'terminal-log-line';
    promptEntry.innerHTML = `<span class="cmd-prompt">❯</span><span class="cmd-text">${escapeHtml(rawCmd)}</span>`;
    terminalBody.appendChild(promptEntry);

    // If clear
    if (trimmed === 'clear') {
      COMMAND_REGISTRY.clear();
      return;
    }

    // Process command
    const outputEntry = document.createElement('div');
    outputEntry.className = 'terminal-log-line';

    if (COMMAND_REGISTRY[trimmed]) {
      const result = COMMAND_REGISTRY[trimmed]();
      outputEntry.innerHTML = `<div class="cmd-output">${result}</div>`;
    } else {
      outputEntry.innerHTML = `<div class="cmd-output"><span class="highlight-red">masala: command not found: ${escapeHtml(trimmed)}</span>. Type <span class="highlight-gold">'help'</span> for list of recipes and flags.</div>`;
    }

    terminalBody.appendChild(outputEntry);
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  // Handle Form Submit
  cliForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = cliInput.value;
    cliInput.value = '';
    executeCommand(val);
  });

  // Handle Quick Chips
  quickButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      if (cmd) executeCommand(cmd);
    });
  });
}

/* ============================================================================
   2. 52-WEEK REALISTIC GITHUB CONTRIBUTION HEATMAP
   ============================================================================ */
function initContributionHeatmap() {
  const grid = document.getElementById('heatmapGrid');
  if (!grid) return;

  grid.innerHTML = '';
  const totalWeeks = 52;
  const daysPerWeek = 7;
  const totalDays = totalWeeks * daysPerWeek;

  // Generate realistic commit distribution
  // Strong weekday activity, lighter weekends, occasional high-heat crunch days
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - totalDays);

  const fragment = document.createDocumentFragment();

  for (let i = 0; i < totalDays; i++) {
    const cell = document.createElement('div');
    cell.className = 'heat-cell';

    const cellDate = new Date(startDate);
    cellDate.setDate(startDate.getDate() + i);
    const dayOfWeek = cellDate.getDay(); // 0 is Sun, 6 is Sat

    let intensity = 0;
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    // Probability weights
    const roll = Math.random();
    if (isWeekend) {
      if (roll > 0.6) intensity = 1;
      else if (roll > 0.85) intensity = 2;
    } else {
      if (roll > 0.08 && roll <= 0.35) intensity = 1;
      else if (roll > 0.35 && roll <= 0.65) intensity = 2;
      else if (roll > 0.65 && roll <= 0.88) intensity = 3;
      else if (roll > 0.88) intensity = 4; // High heat
    }

    cell.classList.add(`heat-${intensity}`);

    // Commit count calculation
    const commitsCount = intensity === 0 ? 0 : intensity * Math.floor(Math.random() * 3 + 2);
    const dateStr = cellDate.toISOString().split('T')[0];

    cell.setAttribute('data-date', dateStr);
    cell.setAttribute('data-commits', commitsCount);

    cell.addEventListener('mouseenter', () => {
      showToast(`${dateStr} : ${commitsCount} commits [${intensity > 2 ? 'High Heat Dispatch' : 'Maintenance'}]`);
    });

    fragment.appendChild(cell);
  }

  grid.appendChild(fragment);
}

/* ============================================================================
   3. ACTIVE SCROLLSPY (INTERSECTION OBSERVER)
   ============================================================================ */
function initScrollspy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  if (!sections.length || !navLinks.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((sec) => observer.observe(sec));
}

/* ============================================================================
   4. MOBILE NAVIGATION TOGGLE
   ============================================================================ */
function initMobileNav() {
  const toggleBtn = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (!toggleBtn || !navLinks) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    toggleBtn.textContent = isOpen ? '[CLOSE ✕]' : '[MENU ☰]';
  });

  // Close on link click
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggleBtn.textContent = '[MENU ☰]';
    });
  });
}

/* ============================================================================
   5. TACTILE COPY ACTIONS & TOAST
   ============================================================================ */
function initCopyActions() {
  const copyButtons = document.querySelectorAll('[data-copy]');

  copyButtons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy);
        showToast(`Copied [${textToCopy}] to clipboard`);
      } catch (err) {
        // Fallback
        showToast(`Buffer copied: ${textToCopy}`);
      }
    });
  });
}

let toastTimeout = null;
function showToast(message) {
  const toast = document.getElementById('terminalToast');
  const toastMsg = document.getElementById('toastMessage');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.add('show');

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

/* ============================================================================
   6. CONTACT FORM SIMULATION ($ sendmail -v)
   ============================================================================ */
function initContactForm() {
  const form = document.getElementById('contactDispatchForm');
  const submitBtn = document.getElementById('submitDispatchBtn');

  if (!form || !submitBtn) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const senderName = document.getElementById('senderName').value;
    const senderEmail = document.getElementById('senderEmail').value;
    const dispatchMsg = document.getElementById('dispatchMsg').value;

    submitBtn.disabled = true;
    submitBtn.textContent = '[ ENCRYPTING & TRANSMITTING... ]';

    setTimeout(() => {
      submitBtn.textContent = '[ DISPATCH SUCCESSFUL ✓ ]';
      submitBtn.style.backgroundColor = 'var(--cardamom)';
      submitBtn.style.color = '#fff';

      showToast(`Payload received from ${senderName}. Confirmation dispatched to ${senderEmail}!`);
      form.reset();

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = '[ TRANSMIT DISPATCH // STAMP SEAL ]';
        submitBtn.style.backgroundColor = '';
        submitBtn.style.color = '';
      }, 4000);
    }, 1200);
  });
}

/* ============================================================================
   7. LIVE UPTIME COUNTER
   ============================================================================ */
function initUptimeCounter() {
  const uptimeEl = document.getElementById('uptimeCounter');
  if (!uptimeEl) return;

  let days = 142;
  let hours = 18;
  let minutes = 24;
  let seconds = 38;

  setInterval(() => {
    seconds++;
    if (seconds >= 60) {
      seconds = 0;
      minutes++;
      if (minutes >= 60) {
        minutes = 0;
        hours++;
        if (hours >= 24) {
          hours = 0;
          days++;
        }
      }
    }
    uptimeEl.textContent = `${days} days, ${hours} hrs, ${minutes} mins, ${seconds}s`;
  }, 1000);
}

/* ============================================================================
   8. RESUME DOWNLOAD SIMULATION
   ============================================================================ */
function initResumeDownload() {
  const btn = document.getElementById('downloadResumeBtn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    showToast(`Downloading dossier: rahul_sharma_lead_systems.pdf [148 KB]`);
    
    // Create simulated file download blob
    const resumeText = `
================================================================================
RAHUL SHARMA // LEAD DISTRIBUTED SYSTEMS & BACKEND ARCHITECT
Email: rahul.sharma@spiceterm.dev | Bengaluru, India
================================================================================

SUMMARY:
Staff-level backend engineer specializing in low-latency systems, zero-copy
event brokers, consensus state machines, and high-throughput data pipelines.
Proven track record scaling production clusters to 1.8M req/sec.

CORE STACK:
Rust, Go, TypeScript, C++20, Linux eBPF, PostgreSQL, Redis Streams, Kafka,
Docker, Kubernetes, gRPC/HTTP2, io_uring.

KEY PROJECTS:
- DhabaOS: Distributed real-time order orchestrator with offline Raft sync.
- GaramQueue: Zero-copy event log saturating 10GbE interfaces using io_uring.
- KhataZero: Cryptographically audited double-entry accounting ledger.
- MasalaScript: Threaded bytecode VM with Computed GOTO dispatch.

EXPERIENCE:
- Lead Distributed Systems Engineer @ BharatScale (2023 - Present)
- Senior Backend Platform Engineer @ SpiceRoute Logistics (2021 - 2023)
- Systems Software Engineer @ InfraCore Labs (2019 - 2021)
================================================================================
    `;

    const blob = new Blob([resumeText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rahul_sharma_lead_systems.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
}

/* Utilities */
function escapeHtml(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}
