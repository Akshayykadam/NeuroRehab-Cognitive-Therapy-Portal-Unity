/**
 * Game Module: Color Confusion (Clinical Stroop Test)
 */
(function () {
    const COLOR_DATA = {
        RED: { name: "RED", hex: "#f11212ff" },
        BLUE: { name: "BLUE", hex: "#3b82f6" },
        GREEN: { name: "GREEN", hex: "#10b981" },
        YELLOW: { name: "YELLOW", hex: "#f5e20bff" } // calming clinical gold/amber
    };

    const COLOR_KEYS = ["RED", "BLUE", "GREEN", "YELLOW"];

    class ColorConfusionGame {
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

            // Current round question state
            this.currentMode = "MEANING"; // "MEANING" or "COLOR"
            this.currentWord = "RED";
            this.currentColorKey = "RED";
            this.correctAnswer = "";
        }

        init(container, gameCtx) {
            this.container = container;
            this.gameCtx = gameCtx;
            this.activeLevel = gameCtx.level;

            this.score = 0;
            this.lives = 3;
            this.round = 1;
            this.maxRounds = 5;
            // Scale timer limit from 45s down to 20s minimum
            this.timeLeft = Math.max(20, 45 - Math.floor((this.activeLevel - 1) / 3) * 2);

            this.gameCtx.setScore(this.score);
            this.gameCtx.setLives(this.lives);

            this.container.innerHTML = `
                <div class="color-conf-container">
                    <div class="color-conf-instruction" id="color-conf-instruction">
                        IDENTIFY THE WORD MEANING
                    </div>
                    
                    <div class="color-conf-card" id="color-conf-card">
                        <span id="color-conf-text">TEXT</span>
                    </div>
                    
                    <div class="color-conf-options" id="color-conf-options">
                        <!-- Options generated dynamically -->
                    </div>

                    <div class="word-score-tracker" id="color-conf-dots">
                        <div class="word-dot"></div>
                        <div class="word-dot"></div>
                        <div class="word-dot"></div>
                        <div class="word-dot"></div>
                        <div class="word-dot"></div>
                    </div>
                </div>
            `;

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
            // Update dots
            const dots = document.querySelectorAll(".word-dot");
            dots.forEach((dot, idx) => {
                if (idx < this.round) dot.classList.add("active");
                else dot.classList.remove("active");
            });

            // Set Mode based on Level
            // L1-L3: Simple match (Word Meaning matches Color)
            // L4-L8: Conflicting colors, but Mode is always "MEANING" (read the word)
            // L9-L14: Conflicting colors, but Mode is always "COLOR" (identify font color)
            // L15+: Alternating modes
            if (this.activeLevel <= 8) {
                this.currentMode = "MEANING";
                this.currentWord = COLOR_KEYS[Math.floor(Math.random() * COLOR_KEYS.length)];
                // Always pick a conflicting color right from Level 1
                const pool = COLOR_KEYS.filter(k => k !== this.currentWord);
                this.currentColorKey = pool[Math.floor(Math.random() * pool.length)];
            } else if (this.activeLevel <= 14) {
                this.currentMode = "COLOR";
                this.currentWord = COLOR_KEYS[Math.floor(Math.random() * COLOR_KEYS.length)];
                const pool = COLOR_KEYS.filter(k => k !== this.currentWord);
                this.currentColorKey = pool[Math.floor(Math.random() * pool.length)];
            } else {
                // Alternating modes
                this.currentMode = Math.random() > 0.5 ? "MEANING" : "COLOR";
                this.currentWord = COLOR_KEYS[Math.floor(Math.random() * COLOR_KEYS.length)];
                // 70% chance of conflict
                if (Math.random() < 0.7) {
                    const pool = COLOR_KEYS.filter(k => k !== this.currentWord);
                    this.currentColorKey = pool[Math.floor(Math.random() * pool.length)];
                } else {
                    this.currentColorKey = this.currentWord;
                }
            }

            this.correctAnswer = (this.currentMode === "MEANING") ? this.currentWord : this.currentColorKey;

            // Render Prompt & Text
            const instEl = document.getElementById("color-conf-instruction");
            const textEl = document.getElementById("color-conf-text");
            const cardEl = document.getElementById("color-conf-card");

            if (this.currentMode === "MEANING") {
                instEl.innerText = "TAP THE WORD MEANING";
                instEl.className = "color-conf-instruction mode-meaning";
            } else {
                instEl.innerText = "TAP THE FONT COLOR";
                instEl.className = "color-conf-instruction mode-color";
            }

            textEl.innerText = this.currentWord;
            textEl.style.color = COLOR_DATA[this.currentColorKey].hex;

            // Rerender option buttons
            const optionsEl = document.getElementById("color-conf-options");
            optionsEl.innerHTML = "";

            // Shuffle color keys for options
            const shuffledOptions = [...COLOR_KEYS].sort(() => Math.random() - 0.5);
            shuffledOptions.forEach(key => {
                const btn = document.createElement("button");
                btn.className = "color-conf-btn";
                btn.innerText = key;
                btn.style.color = COLOR_DATA[key].hex;
                btn.style.borderColor = COLOR_DATA[key].hex + "40";

                btn.addEventListener("click", () => this.handleAnswer(key, btn));
                optionsEl.appendChild(btn);
            });
        }

        handleAnswer(selectedKey, element) {
            this.gameCtx.playSound('click');

            // Disable buttons temporarily
            const buttons = document.querySelectorAll(".color-conf-btn");
            buttons.forEach(b => b.disabled = true);

            const isCorrect = selectedKey === this.correctAnswer;

            if (isCorrect) {
                this.gameCtx.playSound('success');
                element.classList.add("correct-btn");
                this.score += 200;
                this.gameCtx.setScore(this.score);

                setTimeout(() => {
                    this.round++;
                    if (this.round > this.maxRounds) {
                        this.triggerWin();
                    } else {
                        this.generateRound();
                    }
                }, 800);
            } else {
                this.gameCtx.playSound('error');
                element.classList.add("wrong-btn");

                // Highlight the correct answer button
                buttons.forEach(b => {
                    if (b.innerText === this.correctAnswer) {
                        b.classList.add("correct-btn");
                    }
                });

                this.lives--;
                this.gameCtx.setLives(this.lives);

                setTimeout(() => {
                    if (this.lives <= 0) {
                        clearInterval(this.timerInterval);
                        this.gameCtx.onLose(this.score);
                    } else {
                        this.generateRound();
                    }
                }, 1000);
            }
        }

        triggerWin() {
            if (this.timerInterval) clearInterval(this.timerInterval);
            const timeBonus = this.timeLeft * 12;
            const finalScore = this.score + timeBonus + (this.lives * 150);
            const xp = 100;
            this.gameCtx.onWin(finalScore, xp);
        }

        destroy() {
            if (this.timerInterval) clearInterval(this.timerInterval);
        }
    }

    window.Games = window.Games || {};
    window.Games.color_confusion = new ColorConfusionGame();
})();
