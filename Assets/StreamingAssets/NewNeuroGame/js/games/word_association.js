/**
 * Game Module: Word Association (Clinical Version)
 */
(function () {
    const WORD_BANK = {
        1: [
            {
                target: "DOG",
                connected: ["BARK", "PUPPY", "BONE"],
                distractors: ["PEN", "CLOCK", "TRAIN"]
            },
            {
                target: "TREE",
                connected: ["LEAF", "BRANCH", "FOREST"],
                distractors: ["PHONE", "MILK", "SHOE"]
            },
            {
                target: "FIRE",
                connected: ["HOT", "FLAME", "SMOKE"],
                distractors: ["ICE", "SHOWER", "GLASS"]
            }
        ],
        2: [
            {
                target: "SPACE",
                connected: ["ORBIT", "GRAVITY", "COMET"],
                distractors: ["BREAD", "TABLE", "CAR"]
            },
            {
                target: "DESERT",
                connected: ["SAND", "CACTUS", "OASIS"],
                distractors: ["SNOW", "OCEAN", "METRO"]
            },
            {
                target: "MUSIC",
                connected: ["RHYTHM", "MELODY", "CHORD"],
                distractors: ["STEEL", "STONE", "FRUIT"]
            }
        ],
        3: [
            {
                target: "ANCIENT",
                connected: ["RUINS", "FOSSIL", "DYNASTY"],
                distractors: ["CYBER", "MODERN", "LASER"]
            },
            {
                target: "STORM",
                connected: ["THUNDER", "LIGHTNING", "TEMPEST"],
                distractors: ["CALM", "DESERT", "SUNNY"]
            },
            {
                target: "KITCHEN",
                connected: ["PANTRY", "UTENSIL", "RECIPE"],
                distractors: ["ORBIT", "SADDLE", "ANCHOR"]
            }
        ],
        4: [
            {
                target: "JUSTICE",
                connected: ["COURT", "SCALES", "VERDICT"],
                distractors: ["RIVER", "CLOUD", "PIANO"]
            },
            {
                target: "GENIUS",
                connected: ["INTELLECT", "CREATIVE", "TALENT"],
                distractors: ["DULL", "SLOW", "CLAY"]
            },
            {
                target: "THEATRE",
                connected: ["DRAMA", "ACTOR", "STAGE"],
                distractors: ["CAR", "SAND", "RIVER"]
            }
        ],
        5: [
            {
                target: "TIME",
                connected: ["CHRONOLOGY", "DECADE", "DIMENSION"],
                distractors: ["FORK", "BRICK", "SHIRT"]
            },
            {
                target: "ENERGY",
                connected: ["KINETIC", "THERMAL", "ELECTRON"],
                distractors: ["STONE", "PAPER", "WOOD"]
            },
            {
                target: "MIND",
                connected: ["SYNAPSE", "THOUGHT", "NEURON"],
                distractors: ["VALVE", "METAL", "PLASTIC"]
            }
        ]
    };

    class WordAssociationGame {
        constructor() {
            this.container = null;
            this.gameCtx = null;
            this.activeLevel = 1;

            this.score = 0;
            this.lives = 3;
            this.timeLeft = 50; // Increased timer
            this.round = 1;
            this.maxRounds = 3;

            this.activeRoundData = null;
            this.bubbles = [];
            this.selectedBubbles = [];

            this.timerInterval = null;
            this.driftFrameId = null;
            this.isDrifting = false;
            this.lastTime = 0;
        }

        init(container, gameCtx) {
            this.container = container;
            this.gameCtx = gameCtx;
            this.activeLevel = gameCtx.level;

            this.score = 0;
            this.lives = 3;
            // Asymptotically scale down timer limit, minimum 30s
            this.timeLeft = Math.max(30, 50 - Math.floor((this.activeLevel - 1) / 5) * 4);
            this.round = 1;
            this.maxRounds = 3;
            this.selectedBubbles = [];

            this.gameCtx.setScore(this.score);
            this.gameCtx.setLives(this.lives);

            const bankIndex = ((this.activeLevel - 1) % 5) + 1;
            this.roundsPool = [...WORD_BANK[bankIndex]].sort(() => Math.random() - 0.5);

            this.container.innerHTML = `
                <div class="word-assoc-container">
                    <div class="word-target-banner">
                        <div class="target-lbl">Core Theme Topic</div>
                        <div id="word-target-text" class="target-word">THEME</div>
                    </div>
                    
                    <div class="word-bubble-field" id="bubble-field">
                        <!-- Floating therapy boxes -->
                    </div>

                    <div class="word-score-tracker" id="word-dots">
                        <div class="word-dot"></div>
                        <div class="word-dot"></div>
                        <div class="word-dot"></div>
                    </div>
                </div>
            `;

            this.startTimer();
            this.startRound();
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

        startRound() {
            this.selectedBubbles = [];
            this.activeRoundData = this.roundsPool[this.round - 1];

            document.getElementById("word-target-text").innerText = this.activeRoundData.target;

            const dots = document.querySelectorAll(".word-dot");
            dots.forEach((dot, idx) => {
                if (idx < this.round) dot.classList.add("active");
                else dot.classList.remove("active");
            });

            const wordsList = [
                ...this.activeRoundData.connected.map(w => ({ val: w, isCorrect: true })),
                ...this.activeRoundData.distractors.map(w => ({ val: w, isCorrect: false }))
            ].sort(() => Math.random() - 0.5);

            const field = document.getElementById("bubble-field");
            field.innerHTML = "";
            this.bubbles = [];

            const fieldWidth = field.offsetWidth || 780;
            const fieldHeight = field.offsetHeight || 260;
            wordsList.forEach((word, idx) => {
                const el = document.createElement("div");
                el.className = "word-bubble";
                el.innerText = word.val;

                const colors = ["#ff4d4d", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#14b8a6", "#ef4444", "#84cc16", "#06b6d4", "#f97316", "#a855f7"];
                const color = colors[idx % colors.length];
                el.style.borderColor = color + "60";
                el.style.color = color;
                el.style.boxShadow = `0 4px 12px rgba(15, 23, 42, 0.05), inset 0 0 12px ${color}0a, 0 0 8px ${color}05`;

                const colWidth = (fieldWidth - 100) / 3;
                const x = 30 + (idx % 3) * colWidth + Math.random() * (colWidth - 145);
                const y = 30 + Math.floor(idx / 3) * 80 + Math.random() * 20;

                el.style.left = `${x}px`;
                el.style.top = `${y}px`;

                field.appendChild(el);

                const bubble = {
                    element: el,
                    word: word.val,
                    isCorrect: word.isCorrect,
                    x: x,
                    y: y,
                    // Slowed velocity vector for patients
                    vx: (Math.random() - 0.5) * 0.35,
                    vy: (Math.random() - 0.5) * 0.35,
                    width: 140,
                    height: 52
                };

                el.addEventListener("click", () => this.toggleBubble(bubble));
                this.bubbles.push(bubble);
            });

            this.cleanupDrift();
            this.lastTime = performance.now();
            this.isDrifting = true;
            this.driftLoop();
        }

        driftLoop() {
            if (!this.isDrifting) return;
            const now = performance.now();
            const dt = Math.min(3.0, (now - this.lastTime) / 30);
            this.lastTime = now;

            this.updateDrift(dt);
            this.driftFrameId = requestAnimationFrame(() => this.driftLoop());
        }

        cleanupDrift() {
            this.isDrifting = false;
            if (this.driftFrameId) {
                cancelAnimationFrame(this.driftFrameId);
                this.driftFrameId = null;
            }
        }

        updateDrift(dt = 1) {
            const field = document.getElementById("bubble-field");
            if (!field) return;
            const fieldWidth = field.offsetWidth || 780;
            const fieldHeight = field.offsetHeight || 260;

            this.bubbles.forEach(b => {
                b.x += b.vx * dt;
                b.y += b.vy * dt;

                if (b.x < 10) { b.x = 10; b.vx *= -1; }
                if (b.x > fieldWidth - b.width) { b.x = fieldWidth - b.width; b.vx *= -1; }
                if (b.y < 10) { b.y = 10; b.vy *= -1; }
                if (b.y > fieldHeight - b.height) { b.y = fieldHeight - b.height; b.vy *= -1; }

                b.element.style.left = `${b.x}px`;
                b.element.style.top = `${b.y}px`;
            });
        }

        toggleBubble(bubble) {
            this.gameCtx.playSound('click');

            const idx = this.selectedBubbles.indexOf(bubble);
            if (idx !== -1) {
                this.selectedBubbles.splice(idx, 1);
                bubble.element.classList.remove("selected");
            } else {
                if (this.selectedBubbles.length >= 3) return;

                this.selectedBubbles.push(bubble);
                bubble.element.classList.add("selected");

                if (this.selectedBubbles.length === 3) {
                    this.checkSelections();
                }
            }
        }

        checkSelections() {
            const allCorrect = this.selectedBubbles.every(b => b.isCorrect);

            if (allCorrect) {
                this.selectedBubbles.forEach(b => {
                    b.element.classList.add("correct-anim");
                });
                this.gameCtx.playSound('success');
                this.score += 300;
                this.gameCtx.setScore(this.score);

                this.cleanupDrift();

                setTimeout(() => {
                    this.round++;
                    if (this.round > this.maxRounds) {
                        this.triggerWin();
                    } else {
                        this.startRound();
                    }
                }, 1000);
            } else {
                this.selectedBubbles.forEach(b => {
                    b.element.classList.add("wrong-anim");
                });
                this.gameCtx.playSound('error');
                this.lives--;
                this.gameCtx.setLives(this.lives);

                this.cleanupDrift();

                setTimeout(() => {
                    if (this.lives <= 0) {
                        if (this.timerInterval) clearInterval(this.timerInterval);
                        this.gameCtx.onLose(this.score);
                    } else {
                        this.startRound();
                    }
                }, 1000);
            }
        }

        triggerWin() {
            if (this.timerInterval) clearInterval(this.timerInterval);
            this.cleanupDrift();

            const timeBonus = this.timeLeft * 15;
            const finalScore = this.score + timeBonus + (this.lives * 150);
            const xp = 100;

            this.gameCtx.onWin(finalScore, xp);
        }

        destroy() {
            if (this.timerInterval) clearInterval(this.timerInterval);
            this.cleanupDrift();
        }
    }

    // Register game
    window.Games = window.Games || {};
    window.Games.word_association = new WordAssociationGame();
})();
