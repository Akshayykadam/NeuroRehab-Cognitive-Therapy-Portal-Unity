/**
 * Game Module: Turnabout (Mental Rotation & Spatial Logic)
 */
(function() {
    const SHAPES = ["▲", "■", "●", "★", "♦", "♥"];
    const ROTATIONS = [
        { label: window.t('T397'), angle: 90, dir: "CW", arrow: "↻" },
        { label: window.t('T398'), angle: 270, dir: "CCW", arrow: "↺" },
        { label: window.t('T399'), angle: 180, dir: "180", arrow: "⇅" }
    ];

    class TurnaboutGame {
        constructor() {
            this.container = null;
            this.gameCtx = null;
            this.activeLevel = 1;

            this.score = 0;
            this.lives = 3;
            this.timeLeft = 45;
            this.round = 1;
            this.maxRounds = 5;

            this.timerInterval = null;
            this.gridSize = 3; // 2 for L1-L3, 3 for L4+
            this.itemCount = 3; // 2 for L1-L3, 3 or 4 for higher
            this.currentGrid = [];
            this.targetRotation = null;
            this.options = [];
            this.correctOptionIdx = -1;
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
            this.interactionDisabled = false;

            // Scale timer: 45s down to 25s
            this.timeLeft = Math.max(25, 45 - Math.floor((this.activeLevel - 1) / 3) * 2);

            this.gridSize = this.activeLevel <= 3 ? 2 : 3;
            this.itemCount = this.activeLevel <= 3 ? 2 : (this.activeLevel <= 7 ? 3 : 4);

            this.gameCtx.setScore(this.score);
            this.gameCtx.setLives(this.lives);

            this.startTimer();
            this.generateRound();
        }

        startTimer() {
            const updateTimerDisplay = () => {
                const mm = Math.floor(this.timeLeft / 60).toString().padStart(2, '0');
                const ss = (this.timeLeft % 60).toString().padStart(2, '0');
                this.gameCtx.setTimer(`${mm}:${ss}`);
            };

            updateTimerDisplay();
            this.timerInterval = setInterval(() => {
                this.timeLeft--;
                updateTimerDisplay();
                if (this.timeLeft <= 5 && this.timeLeft > 0) {
                    this.gameCtx.playSound('tick');
                }
                if (this.timeLeft <= 0) {
                    clearInterval(this.timerInterval);
                    this.gameCtx.onLose(this.score);
                }
            }, 1000);
        }

        generateRound() {
            this.interactionDisabled = false;

            // 1. Generate base grid
            const size = this.gridSize;
            this.currentGrid = Array(size * size).fill("");
            
            // Randomly place shapes
            const indices = [];
            for (let i = 0; i < size * size; i++) indices.push(i);
            this.shuffle(indices);

            const shapesPool = [...SHAPES];
            this.shuffle(shapesPool);

            for (let i = 0; i < this.itemCount; i++) {
                const cellIdx = indices[i];
                this.currentGrid[cellIdx] = shapesPool[i];
            }

            // 2. Select target rotation
            this.targetRotation = ROTATIONS[Math.floor(Math.random() * ROTATIONS.length)];

            // 3. Compute rotated grid for correct option
            const rotatedGrid = this.rotateGrid(this.currentGrid, this.targetRotation.angle);
            const correctOpt = {
                grid: rotatedGrid,
                angle: this.targetRotation.angle,
                isCorrect: true
            };

            // 4. Generate distractor options
            const otherRots = ROTATIONS.filter(r => r.angle !== this.targetRotation.angle);
            
            // Distractor A: Other angle 1
            const distractorA = {
                grid: this.rotateGrid(this.currentGrid, otherRots[0].angle),
                angle: otherRots[0].angle,
                isCorrect: false
            };
            
            // Distractor B: Other angle 2
            const distractorB = {
                grid: this.rotateGrid(this.currentGrid, otherRots[1].angle),
                angle: otherRots[1].angle,
                isCorrect: false
            };

            // Distractor C: Correct angle, but scrambled cell positions
            const scrambledGrid = [...rotatedGrid];
            const nonEmpties = [];
            const empties = [];
            scrambledGrid.forEach((v, idx) => {
                if (v) nonEmpties.push(idx);
                else empties.push(idx);
            });
            if (nonEmpties.length > 0 && empties.length > 0) {
                const fromIdx = nonEmpties[Math.floor(Math.random() * nonEmpties.length)];
                const toIdx = empties[Math.floor(Math.random() * empties.length)];
                scrambledGrid[toIdx] = scrambledGrid[fromIdx];
                scrambledGrid[fromIdx] = "";
            }
            const distractorC = {
                grid: scrambledGrid,
                angle: this.targetRotation.angle,
                isCorrect: false
            };

            // Combine and shuffle options
            this.options = [correctOpt, distractorA, distractorB, distractorC];
            this.shuffle(this.options);
            this.correctOptionIdx = this.options.findIndex(opt => opt.isCorrect);

            // Render
            this.render();
        }

        rotateGrid(grid, angle) {
            const size = this.gridSize;
            const newGrid = Array(size * size).fill("");

            for (let r = 0; r < size; r++) {
                for (let c = 0; c < size; c++) {
                    const val = grid[r * size + c];
                    if (!val) continue;

                    let targetR, targetC;
                    if (angle === 90) {
                        targetR = c;
                        targetC = size - 1 - r;
                    } else if (angle === 180) {
                        targetR = size - 1 - r;
                        targetC = size - 1 - c;
                    } else if (angle === 270) {
                        targetR = size - 1 - c;
                        targetC = r;
                    } else {
                        targetR = r;
                        targetC = c;
                    }
                    newGrid[targetR * size + targetC] = val;
                }
            }
            return newGrid;
        }

        render() {
            // Update dots
            let dotsHtml = "";
            for (let i = 1; i <= this.maxRounds; i++) {
                const activeClass = i <= this.round ? "active" : "";
                dotsHtml += `<div class="word-dot ${activeClass}"></div>`;
            }

            const size = this.gridSize;

            this.container.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: space-between; width: 100%; height: 100%; padding: 1rem 1.5rem; box-sizing: border-box;">
                    <div class="ta-container" style="flex: 1; margin: 0; width: 100%;">
                        <div class="ta-left-panel">
                            <div class="ta-prompt-banner">
                                ${window.t('T400', { arrow: this.targetRotation.arrow, label: this.targetRotation.label })}
                            </div>
                            <div class="ta-grid" style="grid-template-columns: repeat(${size}, 1fr); width: ${size * 76}px;">
                                ${this.currentGrid.map(cell => `<div class="ta-cell" style="width: 60px; height: 60px;">${cell}</div>`).join("")}
                            </div>
                        </div>
                        
                        <div class="ta-right-panel">
                            <div style="font-size:0.85rem; font-weight:700; text-transform:uppercase; color: var(--text-muted); letter-spacing:1px; margin-bottom: 0.5rem;">${window.t('T401')}</div>
                            <div class="ta-options">
                                ${this.options.map((opt, idx) => `
                                    <div class="ta-option-card" data-idx="${idx}">
                                        <div class="ta-grid" style="grid-template-columns: repeat(${size}, 1fr); width: ${size * 56}px; padding: 0.4rem; gap: 0.4rem; border-radius: 12px; pointer-events: none;">
                                            ${opt.grid.map(cell => `
                                                <div class="ta-cell" style="width: 44px; height: 44px; font-size: 1.25rem;">
                                                    ${cell ? `<div style="transform: rotate(${opt.angle}deg); display: inline-block; transform-origin: center;">${cell}</div>` : ""}
                                                </div>
                                            `).join("")}
                                        </div>
                                    </div>
                                `).join("")}
                            </div>
                        </div>
                    </div>
                    <div class="word-score-tracker" style="margin-top: 0.5rem;">
                        ${dotsHtml}
                    </div>
                </div>
            `;

            // Bind click events
            const cards = this.container.querySelectorAll(".ta-option-card");
            cards.forEach(card => {
                card.addEventListener("click", () => {
                    const idx = parseInt(card.getAttribute("data-idx"));
                    this.handleOptionSelection(idx, card);
                });
            });
        }

        handleOptionSelection(selectedIdx, cardElement) {
            if (this.interactionDisabled) return;

            if (selectedIdx === this.correctOptionIdx) {
                // Correct!
                this.interactionDisabled = true;
                this.gameCtx.playSound("success");
                cardElement.classList.add("correct-btn");

                const basePoints = 200;
                const speedBonus = Math.max(0, this.timeLeft * 8);
                this.score += basePoints + speedBonus;
                this.gameCtx.setScore(this.score);

                setTimeout(() => {
                    if (this.round >= this.maxRounds) {
                        clearInterval(this.timerInterval);
                        this.gameCtx.onWin(this.score, 120);
                    } else {
                        this.round++;
                        this.generateRound();
                    }
                }, 1000);

            } else {
                // Incorrect!
                this.interactionDisabled = true;
                this.gameCtx.playSound("error");
                cardElement.classList.add("wrong-btn");
                this.lives--;
                this.gameCtx.setLives(this.lives);

                if (this.lives <= 0) {
                    clearInterval(this.timerInterval);
                    setTimeout(() => {
                        this.gameCtx.onLose(this.score);
                    }, 800);
                } else {
                    setTimeout(() => {
                        cardElement.classList.remove("wrong-btn");
                        this.interactionDisabled = false;
                    }, 800);
                }
            }
        }

        shuffle(arr) {
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
        }

        destroy() {
            if (this.timerInterval) clearInterval(this.timerInterval);
        }
    }

    // Register module globally
    window.Games = window.Games || {};
    window.Games.turnabout = new TurnaboutGame();
})();
