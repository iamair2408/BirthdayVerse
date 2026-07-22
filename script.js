/* ==========================================================================
   BirthdayVerse - Main Application Engine
   ========================================================================== */

/**
 * Global Configuration Object
 * Modify this object or pass URL parameters (e.g. index.html?name=Aire)
 */
const birthdayConfig = {
  name: "skye",
  age: "19",
  date: "2026-03-08", // Format: YYYY-MM-DD
  sender: "aire",
  message: `Happy Birthday! 🎉\n\nMay your year be filled with happiness, success, beautiful memories, endless opportunities, good health, and dreams that come true.\n\nKeep smiling, keep creating, and never stop believing in yourself.\n\nWishing you a day as wonderful and unique as you are.\n\nHave an amazing birthday! ❤️`,
  accentColor: "#ff69b4"
};

// State Flags
let isGiftOpened = false;
let candlesBlownCount = 0;
let isAudioPlaying = false;
let audioContext = null;

/* --------------------------------------------------------------------------
   Initialization
   -------------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  parseUrlParameters();
  applyConfigData();
  initTypewriter();
  initCountdown();
  initFloatingDecorations();
  setupEventListeners();
  initFireworksEngine();
});

/* --------------------------------------------------------------------------
   1. Configuration & URL Parameter Parsing
   -------------------------------------------------------------------------- */
function parseUrlParameters() {
  const urlParams = new URLSearchParams(window.location.search);
  const nameParam = urlParams.get("name");
  const senderParam = urlParams.get("sender");
  const dateParam = urlParams.get("date");

  if (nameParam) birthdayConfig.name = nameParam;
  if (senderParam) birthdayConfig.sender = senderParam;
  if (dateParam) birthdayConfig.date = dateParam;
}

function applyConfigData() {
  const name = birthdayConfig.name || "Friend";
  
  // Set text content across components
  document.getElementById("letterGreeting").textContent = `Dearest ${name},`;
  document.getElementById("letterMessage").textContent = birthdayConfig.message;
  document.getElementById("letterSender").textContent = birthdayConfig.sender;
  document.getElementById("footerName").textContent = name;
  document.getElementById("letterDate").textContent = new Date().toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric"
  });
}

/* --------------------------------------------------------------------------
   2. Typewriter Effect
   -------------------------------------------------------------------------- */
function initTypewriter() {
  const text = `Happy Birthday, ${birthdayConfig.name}! 🎉`;
  const targetEl = document.getElementById("typewriter");
  let index = 0;

  targetEl.textContent = "";

  function type() {
    if (index < text.length) {
      targetEl.textContent += text.charAt(index);
      index++;
      setTimeout(type, 80);
    }
  }

  setTimeout(type, 300);
}

/* --------------------------------------------------------------------------
   3. Countdown Timer Engine
   -------------------------------------------------------------------------- */
function initCountdown() {
  const badgeEl = document.getElementById("countdownBadge");
  const textEl = document.getElementById("countdownText");
  
  if (!birthdayConfig.date) {
    textEl.textContent = "It's Celebration Time! ✨";
    return;
  }

  const today = new Date();
  const targetDate = new Date(birthdayConfig.date);
  
  // Normalize dates to ignore time parts
  today.setHours(0, 0, 0, 0);
  const currentYearTarget = new Date(today.getFullYear(), targetDate.getMonth(), targetDate.getDate());
  
  if (currentYearTarget < today) {
    currentYearTarget.setFullYear(today.getFullYear() + 1);
  }

  const diffTime = currentYearTarget - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0 || diffDays === 365) {
    textEl.textContent = "🎉 Today is the Special Day!";
  } else {
    textEl.textContent = `Only ${diffDays} day${diffDays > 1 ? 's' : ''} left until the celebration!`;
  }
}

/* --------------------------------------------------------------------------
   4. Floating Ambient Decorations (Balloons, Hearts, Sparkles)
   -------------------------------------------------------------------------- */
function initFloatingDecorations() {
  const container = document.getElementById("floatingDecorations");
  const items = ["🎈", "💖", "⭐", "✨", "🌸", "🎉", "🎁"];
  const itemCount = 20;

  for (let i = 0; i < itemCount; i++) {
    const span = document.createElement("span");
    span.classList.add("floating-item");
    span.textContent = items[Math.floor(Math.random() * items.length)];
    
    span.style.left = `${Math.random() * 100}%`;
    span.style.animationDuration = `${6 + Math.random() * 8}s`;
    span.style.animationDelay = `${Math.random() * 5}s`;
    span.style.fontSize = `${1.2 + Math.random() * 1.5}rem`;

    container.appendChild(span);
  }
}

/* --------------------------------------------------------------------------
   5. Event Listeners & Interaction Wiring
   -------------------------------------------------------------------------- */
function setupEventListeners() {
  // Candle Blowing Mechanics
  const candles = document.querySelectorAll(".candle");
  candles.forEach((candle) => {
    candle.addEventListener("click", blowOutCandle);
  });

  // Gift Opening Mechanics
  const giftBox = document.getElementById("giftBox");
  giftBox.addEventListener("click", openGift);

  // Theme Toggle
  const themeBtn = document.getElementById("themeToggleBtn");
  themeBtn.addEventListener("click", toggleTheme);

  // Music Toggle
  const musicBtn = document.getElementById("musicToggleBtn");
  musicBtn.addEventListener("click", toggleMusic);

  // Action Buttons
  document.getElementById("downloadBtn").addEventListener("click", downloadCard);
  document.getElementById("shareBtn").addEventListener("click", shareCelebration);
}

/* --------------------------------------------------------------------------
   6. Interactive Cake & Candle Blowing
   -------------------------------------------------------------------------- */
function blowOutCandle(e) {
  const candle = e.currentTarget;
  const flame = candle.querySelector(".flame");

  if (flame && !flame.classList.contains("off")) {
    flame.classList.add("off");
    candlesBlownCount++;

    // Trigger local sparkle
    triggerBurstAtElement(candle);

    const totalCandles = document.querySelectorAll(".candle").length;
    const statusEl = document.getElementById("cakeStatus");

    if (candlesBlownCount === totalCandles) {
      statusEl.textContent = "🎉 All candles blown! Wish granted!";
      triggerConfettiExplosion();
      triggerFireworksBurst();
    } else {
      statusEl.textContent = `${totalCandles - candlesBlownCount} candle(s) remaining!`;
    }
  }
}

/* --------------------------------------------------------------------------
   7. Interactive Gift Box Opening
   -------------------------------------------------------------------------- */
function openGift() {
  if (isGiftOpened) return;

  isGiftOpened = true;
  const giftBox = document.getElementById("giftBox");
  const giftStatus = document.getElementById("giftStatus");
  const letterCard = document.getElementById("letterCard");

  giftBox.classList.add("opened");
  giftStatus.textContent = "🎁 Surprise Unlocked!";

  // Trigger Celebration Effects
  triggerFireworksBurst();
  triggerConfettiExplosion();

  // Unlock Letter Section
  setTimeout(() => {
    letterCard.classList.remove("locked");
    letterCard.scrollIntoView({ behavior: "smooth", block: "center" });
  }, 600);
}

/* --------------------------------------------------------------------------
   8. Web Audio API Instrumental Music Synthesizer
   -------------------------------------------------------------------------- */
function toggleMusic() {
  const btn = document.getElementById("musicToggleBtn");

  if (isAudioPlaying) {
    if (audioContext) audioContext.suspend();
    isAudioPlaying = false;
    btn.classList.remove("active");
  } else {
    if (!audioContext) {
      initBirthdayMelodySynth();
    } else {
      audioContext.resume();
    }
    isAudioPlaying = true;
    btn.classList.add("active");
  }
}

function initBirthdayMelodySynth() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  audioContext = new AudioCtx();

  // "Happy Birthday To You" Notes & Frequencies
  const notes = [
    { f: 261.63, d: 0.3 }, { f: 261.63, d: 0.3 }, { f: 293.66, d: 0.6 }, { f: 261.63, d: 0.6 }, { f: 349.23, d: 0.6 }, { f: 329.63, d: 1.2 },
    { f: 261.63, d: 0.3 }, { f: 261.63, d: 0.3 }, { f: 293.66, d: 0.6 }, { f: 261.63, d: 0.6 }, { f: 392.00, d: 0.6 }, { f: 349.23, d: 1.2 },
    { f: 261.63, d: 0.3 }, { f: 261.63, d: 0.3 }, { f: 523.25, d: 0.6 }, { f: 440.00, d: 0.6 }, { f: 349.23, d: 0.6 }, { f: 329.63, d: 0.6 }, { f: 293.66, d: 0.6 },
    { f: 466.16, d: 0.3 }, { f: 466.16, d: 0.3 }, { f: 440.00, d: 0.6 }, { f: 349.23, d: 0.6 }, { f: 392.00, d: 0.6 }, { f: 349.23, d: 1.2 }
  ];

  let noteIndex = 0;

  function playNextNote() {
    if (!isAudioPlaying) return;

    const currentNote = notes[noteIndex];
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(currentNote.f, audioContext.currentTime);

    gain.gain.setValueAtTime(0.12, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + currentNote.d - 0.05);

    osc.connect(gain);
    gain.connect(audioContext.destination);

    osc.start();
    osc.stop(audioContext.currentTime + currentNote.d);

    noteIndex = (noteIndex + 1) % notes.length;
    setTimeout(playNextNote, currentNote.d * 1000);
  }

  playNextNote();
}

/* --------------------------------------------------------------------------
   9. Custom Fireworks & Confetti Engines
   -------------------------------------------------------------------------- */
let canvas, ctx, particles = [];

function initFireworksEngine() {
  canvas = document.getElementById("fireworksCanvas");
  ctx = canvas.getContext("2d");

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    requestAnimationFrame(render);
  }

  render();
}

function triggerFireworksBurst() {
  const colors = ["#ff69b4", "#d8b4fe", "#fde047", "#38bdf8", "#4ade80"];
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 3;

  for (let i = 0; i < 80; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 2 + Math.random() * 8;
    particles.push({
      x: centerX,
      y: centerY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      gravity: 0.08,
      size: 2 + Math.random() * 3,
      alpha: 1,
      decay: 0.015 + Math.random() * 0.01,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }
}

function triggerConfettiExplosion() {
  const colors = ["#ec4899", "#a855f7", "#eab308", "#06b6d4", "#10b981"];
  
  for (let i = 0; i < 100; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: -20,
      vx: (Math.random() - 0.5) * 4,
      vy: 3 + Math.random() * 5,
      gravity: 0.02,
      size: 4 + Math.random() * 4,
      alpha: 1,
      decay: 0.008,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }
}

function triggerBurstAtElement(element) {
  const rect = element.getBoundingClientRect();
  const colors = ["#fde047", "#ff5e00", "#ffffff"];

  for (let i = 0; i < 20; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1 + Math.random() * 4;
    particles.push({
      x: rect.left + rect.width / 2,
      y: rect.top,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2,
      gravity: 0.05,
      size: 2 + Math.random() * 2,
      alpha: 1,
      decay: 0.03,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }
}

/* --------------------------------------------------------------------------
   10. Theme Toggle
   -------------------------------------------------------------------------- */
function toggleTheme() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  
  html.setAttribute("data-theme", newTheme);
  document.getElementById("themeIcon").textContent = newTheme === "dark" ? "🌙" : "☀️";
}

/* --------------------------------------------------------------------------
   11. Card Export & Web Share API
   -------------------------------------------------------------------------- */
function downloadCard() {
  const cardNode = document.getElementById("printableCard");
  const downloadBtn = document.getElementById("downloadBtn");
  
  downloadBtn.disabled = true;
  downloadBtn.textContent = "Generating Image...";

  html2canvas(cardNode, {
    backgroundColor: null,
    scale: 2
  }).then((renderedCanvas) => {
    const link = document.createElement("a");
    link.download = `Birthday-Card-${birthdayConfig.name}.png`;
    link.href = renderedCanvas.toDataURL("image/png");
    link.click();

    downloadBtn.disabled = false;
    downloadBtn.innerHTML = "<span>📸</span> Save Card as Image";
  }).catch((err) => {
    console.error("Card download failed:", err);
    downloadBtn.disabled = false;
    downloadBtn.innerHTML = "<span>📸</span> Save Card as Image";
  });
}

function shareCelebration() {
  const name = birthdayConfig.name;
  const shareData = {
    title: `Happy Birthday ${name}!`,
    text: `Celebrate ${name}'s birthday on BirthdayVerse! 🎉`,
    url: window.location.href
  };

  if (navigator.share) {
    navigator.share(shareData).catch(() => {});
  } else {
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert("Celebration link copied to clipboard! 📋");
    });
  }
}
