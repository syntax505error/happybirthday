/**
 * ============================================================================
 * HAPPY BIRTHDAY SURPRISE WEB APP - JAVASCRIPT
 * ============================================================================
 * 
 * PERSONALIZATION CONFIGURATION
 * Edit the values inside this CONFIG object to customize everything!
 */
const CONFIG = {
  // Boyfriend's Name
  boyfriendName: "Ian",

  // --------------------------------------------------------------------------
  // STAGE 1: CATCH GAME
  // --------------------------------------------------------------------------
  catchGame: {
    targetCatches: 15, // Number of items to catch to win
    avatarSrc: "assets/photos/avatar.jpg", // Path to his cute cutout avatar
    bubbleText: "catch me!", // Text in the floating speech bubble
    spawnIntervalMs: 1150, // How often items drop (milliseconds)
    fallSpeedMin: 2.4, // Minimum falling speed (px per frame)
    fallSpeedMax: 3.6, // Maximum falling speed (px per frame)
  },

  // --------------------------------------------------------------------------
  // STAGE 2: WORD SEARCH LOVE LETTER
  // --------------------------------------------------------------------------
  wordSearch: {
    // 8 words hidden in the grid and highlighted in the letter
    targetWords: [
      "SPECIAL",
      "KEEP",
      "COMFORT",
      "REASON",
      "BEST",
      "GRATEFUL",
      "SAINT",
      "COMPLETE"
    ],
    // Heartfelt letter paragraph containing the 8 bold words
    letterParagraph: `Happy Birthday to the person who makes every single day feel SPECIAL just by being in it. On this beautiful day, I wish you endless HAPPINESS, good health, and every dream you’ve been quietly holding onto finally coming true. Thank you for being my safe place, my COMFORT, and the sweetest REASON I smile for no reason at all. You deserve all the LOVE in the world, and I’m so GRATEFUL that I get to celebrate another year of you. May this new chapter bring you SUCCESS, laughter, and more beautiful memories than you can count. Here’s to you, my favorite person, today and always. Happy Birthday, and may this year be your BEST one yet!`,
    gridSize: 10,
    modalTitle: "Perfect! Great job finding all the words!",
    modalMessage: "Something special is waiting on the next page.",
    modalButtonText: "Unlock Next Page"
  },

  // --------------------------------------------------------------------------
  // STAGE 3: PIN LOCK
  // --------------------------------------------------------------------------
  pinLock: {
    pin: "050626", // 6-digit PIN code (e.g. DDMMYY)
    clue: "Clue: Our first meet",
    cardTitle: "Enter PIN",
    cardSubtitle: "Unlock our journey",
  },

  // --------------------------------------------------------------------------
  // STAGE 4: MEMORIES GALLERY & FINAL BIRTHDAY LETTER
  // --------------------------------------------------------------------------
  memories: {
    galleryTitle: "this is where our journey began.",
    gallerySubtitle: "Every single chapter with you is my favorite",
    photos: [
      {
        src: "assets/photos/photo1.jpg",
        caption: "Where it all began — our very first date in Paris ",
        date: "05/06/2026"
      },
      {
        src: "assets/photos/photo2.jpg ",
        caption: "Our Family Photoshoot",
      },
      {
        src: "assets/photos/photo3.jpg",
        caption: "Happy Birthday ibok, from your beloved Miller, Abang, dan Adek",
      },
      {
        src: "assets/photos/photo4.jpg",
        caption: "That day we walked in the park at night 🤍",
      },
      {
        src: "assets/photos/photo5.jpg  ",
        caption: "Were together and talk a lot about nothing, but feel warm and happy inside",
      },
      {
        src: "assets/photos/photo6.jpg",
        caption: "Evrery single day with you is my favorite, and I can’t wait to make more memories together.",
        date: "Today & Always"
      }
    ],
    envelopeButtonText: "Open Birthday Letter",
    finalLetter: {
      salutation: "My Dearest Ian,",
      paragraphs: [
        "Happy birthday, love! Another year older and somehow you’re still getting pretty, it’s honestly unfair.",
        "When I think back on everything we’ve been through, I just end up smiling because I got so lucky with you. Thank you for always being there for me, for being the place I feel safe, for cheering me on, and for being my favorite person in the whole world.",
        "Even the small stuff with you feels like home, like our coffee runs or those long drives where we sing way too loud. You make my life brighter, funnier, and a lot calmer.",
        "I hope this year gives you all the happiness, peace, success, and love you give to everyone around you. I can’t wait to keep growing, laughing, and building our future together."
      ],
      closing: "With all my love, Miller.",
      birthdayWish: "Happy Birthday, Ian!"
    }
  }
};

/* ============================================================================
   GLOBAL STATE & UTILITIES
   ============================================================================ */
let currentStage = 1;
const totalStages = 4;

/**
 * Transitions smoothly between stages.
 * @param {number} stageNum - The destination stage number (1 to 4)
 */
function goToStage(stageNum) {
  if (stageNum === currentStage) return;

  const currentStageEl = document.getElementById(`stage-${currentStage}`);
  const nextStageEl = document.getElementById(`stage-${stageNum}`);

  if (!nextStageEl) return;

  // Update Top Stepper Dots
  const dots = document.querySelectorAll('.step-dot');
  dots.forEach(dot => {
    const step = parseInt(dot.getAttribute('data-step'), 10);
    dot.classList.remove('active', 'completed');
    if (step === stageNum) {
      dot.classList.add('active');
    } else if (step < stageNum) {
      dot.classList.add('completed');
    }
  });

  // Fade out current stage
  if (currentStageEl) {
    currentStageEl.classList.add('fade-out');
    currentStageEl.classList.remove('active');
  }

  setTimeout(() => {
    if (currentStageEl) {
      currentStageEl.style.display = 'none';
      currentStageEl.classList.remove('fade-out');
    }

    nextStageEl.style.display = 'block';
    // Force reflow
    void nextStageEl.offsetWidth;
    nextStageEl.classList.add('active');
    currentStage = stageNum;

    // Scroll smoothly to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Initialize specific stage actions if needed
    if (stageNum === 4) {
      initMemoriesObserver();
    }
  }, 350);
}

// Enable clicking on header stage dots for quick navigation/testing
document.querySelectorAll('.step-dot').forEach(dot => {
  dot.addEventListener('click', () => {
    const targetStep = parseInt(dot.getAttribute('data-step'), 10);
    goToStage(targetStep);
  });
  dot.style.cursor = 'pointer';
});

/* ============================================================================
   BACKGROUND SPARKLES / STARS CANVAS ANIMATION
   ============================================================================ */
(function initBackgroundCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particleCount = 28;
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.8 + 1.2,
      speedY: Math.random() * 0.45 + 0.15,
      speedX: (Math.random() - 0.5) * 0.2,
      opacity: Math.random() * 0.7 + 0.3,
      pulseSpeed: Math.random() * 0.02 + 0.01,
      angle: Math.random() * Math.PI * 2,
      isStar: Math.random() > 0.45
    });
  }

  function drawStar(cx, cy, spikes, outerRadius, innerRadius, alpha) {
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    let step = Math.PI / spikes;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fillStyle = `rgba(186, 230, 253, ${alpha})`;
    ctx.shadowBlur = 6;
    ctx.shadowColor = 'rgba(56, 189, 248, 0.4)';
    ctx.fill();
    ctx.restore();
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.y -= p.speedY;
      p.x += p.speedX;
      p.angle += p.pulseSpeed;

      const currentAlpha = p.opacity * (0.6 + 0.4 * Math.sin(p.angle));

      if (p.y < -10) {
        p.y = height + 10;
        p.x = Math.random() * width;
      }
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;

      if (p.isStar) {
        drawStar(p.x, p.y, 4, p.size * 2.2, p.size * 0.8, currentAlpha);
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(224, 242, 254, ${currentAlpha})`;
        ctx.fill();
      }
    });

    requestAnimationFrame(render);
  }

  render();
})();

/* ============================================================================
   CONFETTI PARTICLE SYSTEM (FOR CELEBRATIONS & FINAL LETTER)
   ============================================================================ */
const Confetti = (function () {
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas ? canvas.getContext('2d') : null;

  let width = 0;
  let height = 0;
  let particles = [];
  let isRunning = false;

  function resize() {
    if (!canvas) return;
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  const colors = [
    '#38bdf8', // baby blue
    '#7dd3fc', // sky blue
    '#0284c7', // royal baby blue
    '#f472b6', // pastel pink
    '#fbbf24', // pastel gold
    '#c084fc', // pastel purple
    '#ffffff'  // white
  ];

  function burst(count = 90) {
    if (!canvas || !ctx) return;
    resize();

    for (let i = 0; i < count; i++) {
      particles.push({
        x: width * 0.5 + (Math.random() - 0.5) * 60,
        y: height * 0.35 + (Math.random() - 0.5) * 40,
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.8) * 14 - 3,
        size: Math.random() * 8 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10,
        wobble: Math.random() * 10,
        opacity: 1,
        shape: Math.random() > 0.3 ? 'rect' : 'circle'
      });
    }

    if (!isRunning) {
      isRunning = true;
      requestAnimationFrame(update);
    }
  }

  function update() {
    ctx.clearRect(0, 0, width, height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.38; // Gravity
      p.vx *= 0.98; // Air resistance
      p.rotation += p.rotSpeed;
      p.opacity -= 0.007;

      if (p.opacity <= 0 || p.y > height + 20) {
        particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.fillStyle = p.color;

      if (p.shape === 'rect') {
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    if (particles.length > 0) {
      requestAnimationFrame(update);
    } else {
      isRunning = false;
      ctx.clearRect(0, 0, width, height);
    }
  }

  return { burst };
})();

/* ============================================================================
   STAGE 1: CATCH GAME IMPLEMENTATION
   ============================================================================ */
(function initCatchGame() {
  const arena = document.getElementById('catch-arena');
  const itemsLayer = document.getElementById('catch-items-layer');
  const basket = document.getElementById('basket');
  const counterText = document.getElementById('catch-counter-text');
  const hint = document.getElementById('catch-hint');

  if (!arena || !itemsLayer || !basket || !counterText) return;

  let catches = 0;
  let isGameOver = false;
  let basketX = 0;
  let basketWidth = 84;
  let isDragging = false;
  let activeFallingItems = [];
  let spawnTimer = null;
  let animFrameId = null;

  function updateBasketPosition(clientX) {
    const arenaRect = arena.getBoundingClientRect();
    let relativeX = clientX - arenaRect.left;
    // Center basket on cursor/touch
    let newX = relativeX - basketWidth / 2;
    const maxX = arenaRect.width - basketWidth;
    newX = Math.max(0, Math.min(newX, maxX));
    basketX = newX;
    basket.style.left = `${basketX}px`;
  }

  // Pointer & Touch Listeners for Basket
  function onPointerDown(e) {
    if (isGameOver) return;
    isDragging = true;
    if (hint) hint.style.opacity = '0';
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    updateBasketPosition(clientX);
  }

  function onPointerMove(e) {
    if (!isDragging || isGameOver) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    updateBasketPosition(clientX);
    if (e.cancelable && e.type.startsWith('touch')) {
      e.preventDefault();
    }
  }

  function onPointerUp() {
    isDragging = false;
  }

  arena.addEventListener('mousedown', onPointerDown);
  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('mouseup', onPointerUp);

  arena.addEventListener('touchstart', onPointerDown, { passive: true });
  window.addEventListener('touchmove', onPointerMove, { passive: false });
  window.addEventListener('touchend', onPointerUp, { passive: true });

  // Spawn Falling Item
  function spawnItem() {
    if (isGameOver) return;

    const arenaRect = arena.getBoundingClientRect();
    const itemWidth = 58;
    const maxX = arenaRect.width - itemWidth;
    const randomX = Math.max(8, Math.min(Math.random() * maxX, maxX - 8));

    const itemEl = document.createElement('div');
    itemEl.className = 'falling-item';
    itemEl.innerHTML = `
      <div class="falling-speech-bubble">${CONFIG.catchGame.bubbleText}</div>
      <div class="falling-avatar-circle">
        <img src="${CONFIG.catchGame.avatarSrc}" alt="${CONFIG.boyfriendName}" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 100 100\\'><circle cx=\\'50\\' cy=\\'50\\' r=\\'50\\' fill=\\'%23bae6fd\\'/><text x=\\'50\\' y=\\'58\\' font-size=\\'36\\' text-anchor=\\'middle\\'>💙</text></svg>'">
      </div>
    `;

    itemsLayer.appendChild(itemEl);

    const speed =
      Math.random() *
        (CONFIG.catchGame.fallSpeedMax - CONFIG.catchGame.fallSpeedMin) +
      CONFIG.catchGame.fallSpeedMin;

    const itemObj = {
      el: itemEl,
      x: randomX,
      y: -75,
      speed: speed,
      caught: false
    };

    activeFallingItems.push(itemObj);
  }

  // Create Catch Sparkle Burst
  function triggerCatchEffect(x, y) {
    const pop = document.createElement('div');
    pop.className = 'catch-sparkle-pop';
    pop.innerHTML = '💖 +1';
    pop.style.left = `${x}px`;
    pop.style.top = `${y}px`;
    arena.appendChild(pop);

    setTimeout(() => {
      if (pop.parentNode) pop.parentNode.removeChild(pop);
    }, 700);

    // Basket squish bounce
    basket.style.transform = 'scale(1.15, 0.85)';
    setTimeout(() => {
      basket.style.transform = 'scale(1, 1)';
    }, 120);
  }

  // Main Game Loop
  function gameLoop() {
    const arenaRect = arena.getBoundingClientRect();
    const basketTop = arenaRect.height - 62;
    const basketBottom = arenaRect.height - 8;

    for (let i = activeFallingItems.length - 1; i >= 0; i--) {
      const item = activeFallingItems[i];
      if (item.caught) continue;

      item.y += item.speed;
      item.el.style.transform = `translate(${item.x}px, ${item.y}px)`;

      // Collision Check with Basket
      const itemBottom = item.y + 70;
      const itemCenter = item.x + 29;

      if (
        itemBottom >= basketTop &&
        item.y <= basketBottom &&
        itemCenter >= basketX - 10 &&
        itemCenter <= basketX + basketWidth + 10
      ) {
        // Caught!
        item.caught = true;
        catches++;
        counterText.textContent = `Catches: ${catches} / ${CONFIG.catchGame.targetCatches}`;

        triggerCatchEffect(itemCenter, basketTop);

        // Remove item element
        if (item.el.parentNode) {
          item.el.parentNode.removeChild(item.el);
        }
        activeFallingItems.splice(i, 1);

        // Check Victory Condition
        if (catches >= CONFIG.catchGame.targetCatches) {
          isGameOver = true;
          clearInterval(spawnTimer);
          cancelAnimationFrame(animFrameId);

          Confetti.burst(60);

          // Smooth transition to Stage 2
          setTimeout(() => {
            goToStage(2);
          }, 850);
          return;
        }
        continue;
      }

      // Missed item falling off the bottom
      if (item.y > arenaRect.height + 20) {
        if (item.el.parentNode) {
          item.el.parentNode.removeChild(item.el);
        }
        activeFallingItems.splice(i, 1);
      }
    }

    if (!isGameOver) {
      animFrameId = requestAnimationFrame(gameLoop);
    }
  }

  // Initialize Basket Position at center
  const initialArenaWidth = arena.clientWidth || 360;
  basketX = (initialArenaWidth - basketWidth) / 2;
  basket.style.left = `${basketX}px`;

  // Start Item Spawning & Game Loop
  spawnTimer = setInterval(spawnItem, CONFIG.catchGame.spawnIntervalMs);
  animFrameId = requestAnimationFrame(gameLoop);
})();

/* ============================================================================
   STAGE 2: WORD SEARCH LOVE LETTER
   ============================================================================ */
(function initWordSearchStage() {
  const wordsCounterText = document.getElementById('words-counter-text');
  const letterBody = document.getElementById('wordsearch-letter-body');
  const wordGrid = document.getElementById('word-grid');
  const foundTagsContainer = document.getElementById('found-tags-container');
  const modal = document.getElementById('stage2-modal');
  const nextBtn = document.getElementById('stage2-next-btn');

  if (!wordGrid || !letterBody || !wordsCounterText) return;

  const targetWords = CONFIG.wordSearch.targetWords.map(w => w.toUpperCase());
  const foundWords = new Set();
  const gridSize = CONFIG.wordSearch.gridSize || 10;

  // 1. Render Love Letter Paragraph with highlighted bold words
  function renderLoveLetter() {
    let html = CONFIG.wordSearch.letterParagraph;

    targetWords.forEach(word => {
      // Matches word even if user entered **WORD** or __WORD__ in the config string
      const regex = new RegExp(`(\\*\\*|__)?\\b${word}\\b(\\*\\*|__)?`, 'gi');
      html = html.replace(
        regex,
        `<span class="highlight-word" data-word="${word}">${word}</span>`
      );
    });

    letterBody.innerHTML = html;
  }

  // 2. Render Found Word Tag Chips
  function renderTags() {
    foundTagsContainer.innerHTML = '';
    targetWords.forEach(word => {
      const tag = document.createElement('span');
      tag.className = 'word-tag';
      tag.dataset.word = word;
      tag.textContent = word;
      foundTagsContainer.appendChild(tag);
    });
  }

  // 3. Programmatic Word Grid Generation (Guaranteed findable)
  let gridMatrix = Array(gridSize)
    .fill(null)
    .map(() => Array(gridSize).fill(''));
  let wordPlacements = {}; // word -> Array of {r, c}

  const directions = [
    { dr: 0, dc: 1 },  // Horizontal Right
    { dr: 1, dc: 0 },  // Vertical Down
    { dr: 1, dc: 1 },  // Diagonal Down-Right
    { dr: -1, dc: 1 }, // Diagonal Up-Right
    { dr: 0, dc: -1 }, // Horizontal Left
    { dr: 1, dc: -1 }  // Diagonal Down-Left
  ];

  function tryGenerateGrid() {
    // Sort words descending by length to fit longer words first
    const sortedWords = [...targetWords].sort((a, b) => b.length - a.length);

    for (let attempt = 0; attempt < 250; attempt++) {
      gridMatrix = Array(gridSize)
        .fill(null)
        .map(() => Array(gridSize).fill(''));
      wordPlacements = {};
      let allPlaced = true;

      for (const word of sortedWords) {
        let placed = false;
        // Shuffle directions
        const shuffledDirs = [...directions].sort(() => Math.random() - 0.5);

        for (let tries = 0; tries < 200 && !placed; tries++) {
          const dir = shuffledDirs[tries % shuffledDirs.length];
          const startR = Math.floor(Math.random() * gridSize);
          const startC = Math.floor(Math.random() * gridSize);

          const endR = startR + dir.dr * (word.length - 1);
          const endC = startC + dir.dc * (word.length - 1);

          if (endR >= 0 && endR < gridSize && endC >= 0 && endC < gridSize) {
            let canPlace = true;
            for (let i = 0; i < word.length; i++) {
              const r = startR + dir.dr * i;
              const c = startC + dir.dc * i;
              const currentCell = gridMatrix[r][c];
              if (currentCell !== '' && currentCell !== word[i]) {
                canPlace = false;
                break;
              }
            }

            if (canPlace) {
              const coords = [];
              for (let i = 0; i < word.length; i++) {
                const r = startR + dir.dr * i;
                const c = startC + dir.dc * i;
                gridMatrix[r][c] = word[i];
                coords.push({ r, c });
              }
              wordPlacements[word] = coords;
              placed = true;
            }
          }
        }

        if (!placed) {
          allPlaced = false;
          break;
        }
      }

      if (allPlaced) return true;
    }
    return false;
  }

  // Generate grid with fallback safety
  const generatedSuccessfully = tryGenerateGrid();
  if (!generatedSuccessfully) {
    // Fallback deterministic placement if extreme config words
    console.warn('Word Search: Using deterministic packing fallback');
    gridMatrix = Array(gridSize)
      .fill(null)
      .map(() => Array(gridSize).fill(''));
    targetWords.forEach((word, idx) => {
      const r = idx % gridSize;
      const coords = [];
      for (let c = 0; c < Math.min(word.length, gridSize); c++) {
        gridMatrix[r][c] = word[c];
        coords.push({ r, c });
      }
      wordPlacements[word] = coords;
    });
  }

  // Fill empty cells with random uppercase letters
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (gridMatrix[r][c] === '') {
        gridMatrix[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)];
      }
    }
  }

  // 4. Render Grid to DOM
  wordGrid.innerHTML = '';
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      const cell = document.createElement('div');
      cell.className = 'grid-cell';
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.textContent = gridMatrix[r][c];
      wordGrid.appendChild(cell);
    }
  }

  // 5. Touch & Mouse Swipe Selection Mechanics
  let isSwiping = false;
  let startCoord = null;
  let selectedCells = [];

  function getCellAtPoint(x, y) {
    const el = document.elementFromPoint(x, y);
    if (el && el.classList.contains('grid-cell')) {
      return {
        r: parseInt(el.dataset.row, 10),
        c: parseInt(el.dataset.col, 10),
        el: el
      };
    }
    return null;
  }

  function getCellElement(r, c) {
    return wordGrid.querySelector(`.grid-cell[data-row="${r}"][data-col="${c}"]`);
  }

  function clearSelectionClasses() {
    selectedCells.forEach(cell => {
      if (!cell.classList.contains('cell-found')) {
        cell.classList.remove('selecting', 'selection-wrong');
      }
    });
    selectedCells = [];
  }

  function handleSwipeStart(x, y) {
    const cell = getCellAtPoint(x, y);
    if (!cell) return;

    isSwiping = true;
    startCoord = { r: cell.r, c: cell.c };
    clearSelectionClasses();

    cell.el.classList.add('selecting');
    selectedCells = [cell.el];
  }

  function handleSwipeMove(x, y) {
    if (!isSwiping || !startCoord) return;

    const cell = getCellAtPoint(x, y);
    if (!cell) return;

    const dr = cell.r - startCoord.r;
    const dc = cell.c - startCoord.c;

    // Check if straight line: horizontal, vertical, or diagonal
    const isHorizontal = dr === 0;
    const isVertical = dc === 0;
    const isDiagonal = Math.abs(dr) === Math.abs(dc);

    if (isHorizontal || isVertical || isDiagonal) {
      clearSelectionClasses();

      const stepR = dr === 0 ? 0 : dr / Math.abs(dr);
      const stepC = dc === 0 ? 0 : dc / Math.abs(dc);
      const steps = Math.max(Math.abs(dr), Math.abs(dc));

      const newSelection = [];
      for (let i = 0; i <= steps; i++) {
        const r = startCoord.r + stepR * i;
        const c = startCoord.c + stepC * i;
        const el = getCellElement(r, c);
        if (el) {
          el.classList.add('selecting');
          newSelection.push(el);
        }
      }
      selectedCells = newSelection;
    }
  }

  function handleSwipeEnd() {
    if (!isSwiping) return;
    isSwiping = false;

    if (selectedCells.length === 0) return;

    // Form selected word string
    const forwardWord = selectedCells.map(c => c.textContent).join('');
    const reverseWord = forwardWord.split('').reverse().join('');

    let matchedWord = null;
    if (targetWords.includes(forwardWord) && !foundWords.has(forwardWord)) {
      matchedWord = forwardWord;
    } else if (targetWords.includes(reverseWord) && !foundWords.has(reverseWord)) {
      matchedWord = reverseWord;
    }

    if (matchedWord) {
      // SUCCESS: Word found!
      foundWords.add(matchedWord);

      // Permanently style matched cells
      selectedCells.forEach(cell => {
        cell.classList.remove('selecting');
        cell.classList.add('cell-found');
      });

      // Update Word in Love Letter
      const letterSpan = letterBody.querySelector(
        `.highlight-word[data-word="${matchedWord}"]`
      );
      if (letterSpan) {
        letterSpan.classList.add('word-found');
      }

      // Update Tag Chip
      const tagChip = foundTagsContainer.querySelector(
        `.word-tag[data-word="${matchedWord}"]`
      );
      if (tagChip) {
        tagChip.classList.add('tag-found');
      }

      // Update Counter
      wordsCounterText.textContent = `Words found: ${foundWords.size} / ${targetWords.length}`;

      // Check if all 8 words are found
      if (foundWords.size === targetWords.length) {
        setTimeout(() => {
          if (modal) {
            modal.classList.add('open');
            modal.setAttribute('aria-hidden', 'false');
            Confetti.burst(50);
          }
        }, 450);
      }
    } else {
      // WRONG SELECTION: flash shake/red & reset
      const cellsToReset = [...selectedCells];
      cellsToReset.forEach(cell => {
        if (!cell.classList.contains('cell-found')) {
          cell.classList.add('selection-wrong');
        }
      });
      setTimeout(() => {
        cellsToReset.forEach(cell => {
          if (!cell.classList.contains('cell-found')) {
            cell.classList.remove('selecting', 'selection-wrong');
          }
        });
      }, 300);
    }

    selectedCells = [];
    startCoord = null;
  }

  // Pointer Events on Grid
  wordGrid.addEventListener('pointerdown', e => {
    handleSwipeStart(e.clientX, e.clientY);
  });

  window.addEventListener('pointermove', e => {
    if (isSwiping) {
      handleSwipeMove(e.clientX, e.clientY);
    }
  });

  window.addEventListener('pointerup', () => {
    handleSwipeEnd();
  });

  // Touch fallback
  wordGrid.addEventListener(
    'touchstart',
    e => {
      const t = e.touches[0];
      handleSwipeStart(t.clientX, t.clientY);
    },
    { passive: true }
  );

  window.addEventListener(
    'touchmove',
    e => {
      if (isSwiping) {
        const t = e.touches[0];
        handleSwipeMove(t.clientX, t.clientY);
        if (e.cancelable) e.preventDefault();
      }
    },
    { passive: false }
  );

  window.addEventListener(
    'touchend',
    () => {
      handleSwipeEnd();
    },
    { passive: true }
  );

  // Modal Next Page Button
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (modal) {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
      }
      goToStage(3);
    });
  }

  // Initialize Stage 2
  renderLoveLetter();
  renderTags();
})();

/* ============================================================================
   STAGE 3: PIN LOCK
   ============================================================================ */
(function initPinLockStage() {
  const pinCard = document.getElementById('pin-card-box');
  const heartDots = document.querySelectorAll('.heart-dot');
  const keypad = document.getElementById('keypad');
  const unlockBtn = document.getElementById('pin-unlock-btn');
  const feedbackMsg = document.getElementById('pin-feedback-msg');
  const hintText = document.getElementById('pin-hint-text');

  if (!pinCard || !keypad || !unlockBtn) return;

  if (hintText) {
    hintText.textContent = CONFIG.pinLock.clue;
  }

  let enteredPin = '';
  const correctPin = String(CONFIG.pinLock.pin).trim();
  const maxDigits = 6;
  let isChecking = false;

  function updateHeartVisuals() {
    heartDots.forEach((dot, idx) => {
      dot.classList.remove('error', 'success');
      if (idx < enteredPin.length) {
        dot.classList.add('filled');
      } else {
        dot.classList.remove('filled');
      }
    });
  }

  function handleDigit(digit) {
    if (isChecking || enteredPin.length >= maxDigits) return;
    enteredPin += digit;
    updateHeartVisuals();

    if (feedbackMsg) feedbackMsg.textContent = '';

    // Auto-check on 6th digit
    if (enteredPin.length === maxDigits) {
      setTimeout(verifyPin, 150);
    }
  }

  function handleBackspace() {
    if (isChecking || enteredPin.length === 0) return;
    enteredPin = enteredPin.slice(0, -1);
    updateHeartVisuals();
    if (feedbackMsg) feedbackMsg.textContent = '';
  }

  function handleClear() {
    if (isChecking) return;
    enteredPin = '';
    updateHeartVisuals();
    if (feedbackMsg) feedbackMsg.textContent = '';
  }

  function verifyPin() {
    if (isChecking) return;
    isChecking = true;

    if (enteredPin === correctPin) {
      // PIN CORRECT!
      heartDots.forEach(dot => {
        dot.classList.remove('filled', 'error');
        dot.classList.add('success');
      });

      if (feedbackMsg) {
        feedbackMsg.style.color = '#0284c7';
        feedbackMsg.textContent = 'Unlocked! 💙';
      }

      setTimeout(() => {
        goToStage(4);
        isChecking = false;
      }, 500);
    } else {
      // WRONG PIN: Shake card and flash red
      pinCard.classList.add('shake');
      heartDots.forEach(dot => {
        dot.classList.add('error');
      });

      if (feedbackMsg) {
        feedbackMsg.style.color = '#e11d48';
        feedbackMsg.textContent = 'Incorrect PIN, try again!';
      }

      setTimeout(() => {
        pinCard.classList.remove('shake');
        enteredPin = '';
        updateHeartVisuals();
        isChecking = false;
      }, 650);
    }
  }

  // Keypad click handlers
  keypad.addEventListener('click', e => {
    const btn = e.target.closest('button');
    if (!btn) return;

    if (btn.dataset.key !== undefined) {
      handleDigit(btn.dataset.key);
    } else if (btn.id === 'key-backspace') {
      handleBackspace();
    } else if (btn.id === 'key-clear') {
      handleClear();
    }
  });

  // Unlock button click
  unlockBtn.addEventListener('click', () => {
    if (enteredPin.length === maxDigits) {
      verifyPin();
    } else {
      if (feedbackMsg) {
        feedbackMsg.style.color = '#e11d48';
        feedbackMsg.textContent = 'Please enter all 6 digits!';
      }
    }
  });

  // Physical keyboard support for desktop testing
  window.addEventListener('keydown', e => {
    if (currentStage !== 3) return;

    if (e.key >= '0' && e.key <= '9') {
      handleDigit(e.key);
    } else if (e.key === 'Backspace') {
      handleBackspace();
    } else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
      handleClear();
    } else if (e.key === 'Enter') {
      verifyPin();
    }
  });
})();

/* ============================================================================
   STAGE 4: MEMORIES GALLERY & FINAL LETTER
   ============================================================================ */
let memoriesObserver = null;

function initMemoriesObserver() {
  const cards = document.querySelectorAll('.polaroid-card');
  if (!cards.length) return;

  if (memoriesObserver) {
    memoriesObserver.disconnect();
  }

  memoriesObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -20px 0px' }
  );

  cards.forEach(card => memoriesObserver.observe(card));

  // Immediate check for cards already in viewport
  setTimeout(() => {
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        card.classList.add('visible');
      }
    });
  }, 120);
}

(function initMemoriesStage() {
  const gallery = document.getElementById('polaroid-gallery');
  const memoriesTitle = document.getElementById('memories-title');
  const openLetterBtn = document.getElementById('open-letter-btn');
  const closeLetterBtn = document.getElementById('close-letter-btn');
  const letterModal = document.getElementById('letter-modal');
  const letterSalutation = document.getElementById('letter-salutation');
  const letterParagraphs = document.getElementById('letter-paragraphs');
  const letterClosing = document.getElementById('letter-closing');
  const letterBirthdayWish = document.getElementById('letter-birthday-wish');
  const reburstBtn = document.getElementById('reburst-confetti-btn');
  const envelopeLabel = document.getElementById('envelope-button-label');

  if (!gallery) return;

  if (memoriesTitle && CONFIG.memories.galleryTitle) {
    memoriesTitle.textContent = CONFIG.memories.galleryTitle;
  }

  if (envelopeLabel && CONFIG.memories.envelopeButtonText) {
    envelopeLabel.textContent = CONFIG.memories.envelopeButtonText;
  }

  // Populate Polaroid Gallery
  const rotations = [-2.5, 2.2, -1.8, 2.8, -2.2, 1.9, -2.4, 2.1];
  gallery.innerHTML = '';

  CONFIG.memories.photos.forEach((photo, idx) => {
    const card = document.createElement('div');
    card.className = 'polaroid-card';
    const rot = rotations[idx % rotations.length];
    card.style.setProperty('--rotation', `${rot}deg`);

    card.innerHTML = `
      <div class="polaroid-img-wrapper">
        <img src="${photo.src}" alt="${photo.caption}" loading="lazy" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 400 360\\'><rect width=\\'400\\' height=\\'360\\' fill=\\'%23bae6fd\\'/><text x=\\'200\\' y=\\'180\\' font-family=\\'sans-serif\\' font-size=\\'24\\' text-anchor=\\'middle\\' fill=\\'%230284c7\\'>Our Sweet Memory 💙</text></svg>'">
      </div>
      <div class="polaroid-caption-area">
        <p class="polaroid-caption">${photo.caption}</p>
        <span class="polaroid-date">${photo.date || ''}</span>
      </div>
    `;

    gallery.appendChild(card);
  });

  // Populate Final Birthday Letter Modal
  const finalLetterData = CONFIG.memories.finalLetter;
  if (finalLetterData) {
    if (letterSalutation) {
      letterSalutation.textContent = finalLetterData.salutation;
    }
    if (letterParagraphs) {
      letterParagraphs.innerHTML = finalLetterData.paragraphs
        .map(p => `<p>${p}</p>`)
        .join('');
    }
    if (letterClosing) {
      letterClosing.textContent = finalLetterData.closing;
    }
    if (letterBirthdayWish) {
      letterBirthdayWish.textContent = finalLetterData.birthdayWish;
    }
  }

  // Open & Close Letter Modal
  function openLetter() {
    if (!letterModal) return;
    letterModal.classList.add('open');
    letterModal.setAttribute('aria-hidden', 'false');
    // Launch Grand Confetti Explosion!
    Confetti.burst(120);
    setTimeout(() => Confetti.burst(80), 400);
  }

  function closeLetter() {
    if (!letterModal) return;
    letterModal.classList.remove('open');
    letterModal.setAttribute('aria-hidden', 'true');
  }

  if (openLetterBtn) openLetterBtn.addEventListener('click', openLetter);
  if (closeLetterBtn) closeLetterBtn.addEventListener('click', closeLetter);

  if (reburstBtn) {
    reburstBtn.addEventListener('click', () => {
      Confetti.burst(100);
    });
  }

  // Close letter on backdrop click
  if (letterModal) {
    letterModal.addEventListener('click', e => {
      if (e.target === letterModal) {
        closeLetter();
      }
    });
  }
})();
