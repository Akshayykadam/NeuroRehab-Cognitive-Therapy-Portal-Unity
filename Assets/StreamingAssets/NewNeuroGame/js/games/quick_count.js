/**
 * Game Module: Quick Count (Subitizing & Speed Attention)
 */
(function() {
    const COLOR_THEMES = {
        PINK: { label: "PINK BLOCKS", hex: "#ec4899", class: "color-target" },
        BLUE: { label: "BLUE BLOCKS", hex: "#3b82f6", class: "color-distractor1" },
        YELLOW: { label: "YELLOW BLOCKS", hex: "#fbbf24", class: "color-distractor2" }
    };

    class QuickCountGame {
        constructor() {
            this.container = null;
            this.gameCtx = null;
            this.activeLevel = 1;

            this.score = 0;
            this.lives = 3;
            this.timeLeft = 35; // Total time for the game
            this.round = 1;
            this.maxRounds = 5;

            this.roundTimeLeft = 8; // Seconds per round
            this.roundTimerInterval = null;
            this.gameTimerInterval = null;

            this.gridSize = 3; // 3 for L1-3, 4 for L4-7, 5 for L8+
            this.targetColorKey = "PINK";
            this.correctCount = 0;
            this.options = [];
            this.interactionDisabled = false;
        }

        init(container, gameCtx) {
            this.container = container;
            this.gameCtx = gameCtx;
            this.activeLevel = gameCtx.level;

            this.score = 0;
            this.lives = 3;
            this.round = 1;
            this.maxRounds = 5;
            this.timeLeft = 35;
            this.interactionDisabled = false;

            this.gridSize = this.activeLevel <= 3 ? 3 : (this.activeLevel <= 7 ? 4 : 5);

            this.gameCtx.setScore(this.score);
            this.gameCtx.setLives(this.lives);

            this.startTimers();
            this.generateRound();
        }

        startTimers() {
            // Main game timer
            const updateTimerDisplay = () => {
                const mm = Math.floor(this.timeLeft / 60).toString().padStart(2, '0');
                const ss = (this.timeLeft % 60).toString().padStart(2, '0');
                this.gameCtx.setTimer(`${mm}:${ss}`);
            };

            updateTimerDisplay();
            this.gameTimerInterval = setInterval(() => {
                this.timeLeft--;
                updateTimerDisplay();
                if (this.timeLeft <= 0) {
                    this.endGame(false);
                }
            }, 1000);
        }

        generateRound() {
            this.interactionDisabled = false;
            
            // Set round speed: L1-3 gets 8s, L4-7 gets 6s, L8+ gets 5s
            this.roundTimeLeft = this.activeLevel <= 3 ? 8 : (this.activeLevel <= 7 ? 6 : 5);

            // Determine colors in play
            // L1-3: Pink & Slate (Neutral)
            // L4-7: Pink & Blue (Count targets can be either)
            // L8+: Pink, Blue & Yellow (Count targets can be any of the three)
            const colorsInPlay = ["PINK"];
            if (this.activeLevel >= 4) colorsInPlay.push("BLUE");
            if (this.activeLevel >= 8) colorsInPlay.push("YELLOW");

            this.targetColorKey = colorsInPlay[Math.floor(Math.random() * colorsInPlay.length)];

            const totalCells = this.gridSize * this.gridSize;
            const cells = Array(totalCells).fill("neutral");

            // Fill target blocks (count between 2 and grid maximum)
            const maxTarget = Math.floor(totalCells * 0.5);
            const minTarget = 2;
            this.correctCount = minTarget + Math.floor(Math.random() * (maxTarget - minTarget + 1));

            const indices = [];
            for (let i = 0; i < totalCells; i++) indices.push(i);
            this.shuffle(indices);

            // Place targets
            for (let i = 0; i < this.correctCount; i++) {
                cells[indices[i]] = this.targetColorKey;
            }

            // Place distractors (other colors)
            const remainingIndices = indices.slice(this.correctCount);
            if (colorsInPlay.length > 1) {
                const otherColors = colorsInPlay.filter(c => c !== this.targetColorKey);
                remainingIndices.forEach((cellIdx, offset) => {
                    // 50% chance of placing a distractor
                    if (Math.random() < 0.6) {
                        cells[cellIdx] = otherColors[offset % otherColors.length];
                    }
                });
            }

            // Generate unique options
            this.options = [this.correctCount];
            while (this.options.length < 4) {
                // Pick a number close to correctCount
                const delta = Math.floor(Math.random() * 5) - 2; // -2, -1, 1, 2, etc.
                const val = this.correctCount + delta;
                if (val > 0 && !this.options.includes(val)) {
                    this.options.push(val);
                }
            }
            this.shuffle(this.options);

            // Render Round
            this.render(cells);

            // Start round timer
            if (this.roundTimerInterval) clearInterval(this.roundTimerInterval);
            this.roundTimerInterval = setInterval(() => {
                this.roundTimeLeft--;
                
                // Update countdown visual bar/text if exists
                const timeLabel = this.container.querySelector("#qc-round-time");
                if (timeLabel) timeLabel.innerText = this.roundTimeLeft;

                if (this.roundTimeLeft <= 0) {
                    clearInterval(this.roundTimerInterval);
                    this.handleRoundTimeout();
                }
            }, 1000);
        }

        handleRoundTimeout() {
            if (this.interactionDisabled) return;
            this.interactionDisabled = true;
            this.gameCtx.playSound("error");

            this.lives--;
            this.gameCtx.setLives(this.lives);

            // Flash correct choice
            const correctBtn = this.container.querySelector(`.qc-btn[data-val="${this.correctCount}"]`);
            if (correctBtn) correctBtn.classList.add("correct-btn");

            setTimeout(() => {
                this.advanceOrEnd();
            }, 1200);
        }

        handleSelection(val, btnElement) {
            if (this.interactionDisabled) return;
            this.interactionDisabled = true;
            clearInterval(this.roundTimerInterval);

            if (val === this.correctCount) {
                // Correct!
                this.gameCtx.playSound("success");
                btnElement.classList.add("correct-btn");

                const basePoints = 150;
                const timeBonus = this.roundTimeLeft * 15;
                this.score += basePoints + timeBonus;
                this.gameCtx.setScore(this.score);

                setTimeout(() => {
                    this.advanceOrEnd();
                }, 600);
            } else {
                // Wrong!
                this.gameCtx.playSound("error");
                btnElement.classList.add("wrong-btn");
                
                // Also highlight correct button
                const correctBtn = this.container.querySelector(`.qc-btn[data-val="${this.correctCount}"]`);
                if (correctBtn) correctBtn.classList.add("correct-btn");

                this.lives--;
                this.gameCtx.setLives(this.lives);

                setTimeout(() => {
                    this.advanceOrEnd();
                }, 1200);
            }
        }

        advanceOrEnd() {
            if (this.lives <= 0) {
                this.endGame(false);
            } else if (this.round >= this.maxRounds) {
                this.endGame(true);
            } else {
                this.round++;
                this.generateRound();
            }
        }

        endGame(isWin) {
            if (this.roundTimerInterval) clearInterval(this.roundTimerInterval);
            if (this.gameTimerInterval) clearInterval(this.gameTimerInterval);

            if (isWin) {
                this.gameCtx.onWin(this.score, 100);
            } else {
                this.gameCtx.onLose(this.score);
            }
        }

        render(cells) {
            // Update dots
            let dotsHtml = "";
            for (let i = 1; i <= this.maxRounds; i++) {
                const activeClass = i <= this.round ? "active" : "";
                dotsHtml += `<div class="word-dot ${activeClass}"></div>`;
            }

            const size = this.gridSize;
            const targetInfo = COLOR_THEMES[this.targetColorKey];

            this.container.innerHTML = `
                <div class="qc-container">
                    <div class="qc-prompt">
                        Count: <span style="color: ${targetInfo.hex}">${targetInfo.label}</span> 
                        <span style="font-size: 0.8rem; color: var(--text-muted); margin-left: 1rem;">Time: <b id="qc-round-time">${this.roundTimeLeft}</b>s</span>
                    </div>

                    <div class="qc-grid" style="grid-template-columns: repeat(${size}, 1fr); width: ${size * 70}px;">
                        ${cells.map(type => {
                            const blockClass = type === "neutral" ? "color-neutral" : COLOR_THEMES[type].class;
                            return `<div class="qc-block ${blockClass}" style="width: 54px; height: 54px;"></div>`;
                        }).join("")}
                    </div>

                    <div class="qc-options">
                        ${this.options.map(opt => `
                            <button class="qc-btn" data-val="${opt}">${opt}</button>
                        `).join("")}
                    </div>

                    <div class="word-score-tracker" style="margin-top: 0.5rem;">
                        ${dotsHtml}
                    </div>
                </div>
            `;

            // Bind events
            const buttons = this.container.querySelectorAll(".qc-btn");
            buttons.forEach(btn => {
                btn.addEventListener("click", () => {
                    const val = parseInt(btn.getAttribute("data-val"));
                    this.handleSelection(val, btn);
                });
            });
        }

        shuffle(arr) {
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
        }

        destroy() {
            if (this.roundTimerInterval) clearInterval(this.roundTimerInterval);
            if (this.gameTimerInterval) clearInterval(this.gameTimerInterval);
        }
    }

    // Register module globally
    window.Games = window.Games || {};
    window.Games.quick_count = new QuickCountGame();
})();
