/**
 * Game Module: Turning Tables (Spatial Memory & Tracking)
 */
(function() {
    const ROTATION_DELTAS = [
        { label: "90° CW", delta: 90 },
        { label: "90° CCW", delta: -90 },
        { label: "180°", delta: 180 }
    ];

    class TurningTablesGame {
        constructor() {
            this.container = null;
            this.gameCtx = null;
            this.activeLevel = 1;

            this.score = 0;
            this.lives = 3;
            this.timeLeft = 50;
            this.round = 1;
            this.maxRounds = 5;

            this.timerInterval = null;
            this.slotCount = 6;  // 6 for L1-3, 8 for L4-7, 10 for L8+
            this.targetCount = 2; // 2 for L1-5, 3 for L6-10, 4 for L11+
            this.targetIndices = [];
            this.foundIndices = [];
            this.platterAngle = 0;
            this.interactionState = "MEMORIZE"; // "MEMORIZE", "SPINNING", "PLAY", "REVEAL"
            this.timerInterval = null;
        }

        init(container, gameCtx) {
            this.container = container;
            this.gameCtx = gameCtx;
            this.activeLevel = gameCtx.level;

            this.score = 0;
            this.lives = 3;
            this.round = 1;
            this.maxRounds = 5;
            this.platterAngle = 0;

            // Scale timer: 50s down to 30s
            this.timeLeft = Math.max(30, 50 - Math.floor((this.activeLevel - 1) / 3) * 2);

            this.slotCount = this.activeLevel <= 3 ? 6 : (this.activeLevel <= 7 ? 8 : 10);
            this.targetCount = this.activeLevel <= 5 ? 2 : (this.activeLevel <= 10 ? 3 : 4);

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
            this.interactionState = "MEMORIZE";
            this.foundIndices = [];
            
            // Choose random target slots
            this.targetIndices = [];
            while (this.targetIndices.length < this.targetCount) {
                const idx = Math.floor(Math.random() * this.slotCount);
                if (!this.targetIndices.includes(idx)) {
                    this.targetIndices.push(idx);
                }
            }

            this.render();

            // Memorization phase: show dots for 1.5 seconds
            setTimeout(() => {
                this.startSpinPhase();
            }, 1600);
        }

        startSpinPhase() {
            this.interactionState = "SPINNING";
            
            // Hide the active targets visually
            const slots = this.container.querySelectorAll(".tt-slot");
            slots.forEach(slot => {
                slot.classList.remove("active-target");
            });

            // Choose rotation
            const rot = ROTATION_DELTAS[Math.floor(Math.random() * ROTATION_DELTAS.length)];
            this.platterAngle += rot.delta;

            // Update banner text
            const banner = this.container.querySelector("#tt-banner-text");
            if (banner) {
                banner.innerHTML = `Table spins: <span>${rot.label}</span>`;
            }

            // Animate spin
            const table = this.container.querySelector(".tt-table");
            if (table) {
                table.style.transform = `rotate(${this.platterAngle}deg)`;
            }

            // Once rotation is finished (transition matches style.css: 1.2s)
            setTimeout(() => {
                this.startPlayPhase();
            }, 1400);
        }

        startPlayPhase() {
            this.interactionState = "PLAY";
            const banner = this.container.querySelector("#tt-banner-text");
            if (banner) {
                banner.innerHTML = `Find the <span>${this.targetCount} Rotated Dots</span>!`;
            }
        }

        handleSlotClick(idx, slotElement) {
            if (this.interactionState !== "PLAY") return;
            if (this.foundIndices.includes(idx) || slotElement.classList.contains("selected-wrong")) return;

            if (this.targetIndices.includes(idx)) {
                // Correct slot!
                this.gameCtx.playSound("success");
                slotElement.classList.add("selected-correct");
                this.foundIndices.push(idx);

                // Add points
                this.score += 150;
                this.gameCtx.setScore(this.score);

                // Check if all found
                if (this.foundIndices.length === this.targetCount) {
                    this.interactionState = "REVEAL";
                    setTimeout(() => {
                        if (this.round >= this.maxRounds) {
                            clearInterval(this.timerInterval);
                            this.gameCtx.onWin(this.score, 120);
                        } else {
                            this.round++;
                            this.generateRound();
                        }
                    }, 1000);
                }
            } else {
                // Wrong slot!
                this.gameCtx.playSound("error");
                slotElement.classList.add("selected-wrong");
                this.lives--;
                this.gameCtx.setLives(this.lives);

                if (this.lives <= 0) {
                    this.interactionState = "REVEAL";
                    clearInterval(this.timerInterval);
                    setTimeout(() => {
                        this.gameCtx.onLose(this.score);
                    }, 800);
                } else {
                    setTimeout(() => {
                        slotElement.classList.remove("selected-wrong");
                    }, 800);
                }
            }
        }

        render() {
            // Update dots
            let dotsHtml = "";
            for (let i = 1; i <= this.maxRounds; i++) {
                const activeClass = i <= this.round ? "active" : "";
                dotsHtml += `<div class="word-dot ${activeClass}"></div>`;
            }

            // Create slot markup positioned radially
            let slotsHtml = "";
            const radius = 120; // Radius in pixels matching tt-table width
            for (let i = 0; i < this.slotCount; i++) {
                const angle = (i * 2 * Math.PI) / this.slotCount - Math.PI / 2; // offset by 90deg to start top
                const x = 160 + radius * Math.cos(angle);
                const y = 160 + radius * Math.sin(angle);

                const isTarget = this.targetIndices.includes(i) && this.interactionState === "MEMORIZE";
                const targetClass = isTarget ? "active-target" : "";

                slotsHtml += `
                    <div class="tt-slot ${targetClass}" style="left: ${x}px; top: ${y}px;" data-idx="${i}">
                        <div class="tt-dot"></div>
                    </div>
                `;
            }

            this.container.innerHTML = `
                <div class="tt-container">
                    <div class="tt-prompt" id="tt-banner-text">
                        Memorize the <span>${this.targetCount} Target Dots</span>
                    </div>

                    <div class="tt-arena">
                        <div class="tt-table-wrapper">
                            <div class="tt-table" style="transform: rotate(${this.platterAngle}deg);">
                                ${slotsHtml}
                            </div>
                            <div class="tt-table-center">
                                <i class="fa-solid fa-compass"></i>
                            </div>
                        </div>
                    </div>

                    <div class="word-score-tracker" style="margin-top: 0.5rem;">
                        ${dotsHtml}
                    </div>
                </div>
            `;

            // Bind click events on slots
            const slots = this.container.querySelectorAll(".tt-slot");
            slots.forEach(slot => {
                slot.addEventListener("click", () => {
                    const idx = parseInt(slot.getAttribute("data-idx"));
                    this.handleSlotClick(idx, slot);
                });
            });
        }

        destroy() {
            if (this.timerInterval) clearInterval(this.timerInterval);
        }
    }

    // Register module globally
    window.Games = window.Games || {};
    window.Games.turning_tables = new TurningTablesGame();
})();
