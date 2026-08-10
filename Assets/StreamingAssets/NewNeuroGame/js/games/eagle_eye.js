/**
 * Game Module: Eagle Eye (Visual Attention & Ascending Search)
 */
(function() {
    class EagleEyeGame {
        constructor() {
            this.container = null;
            this.gameCtx = null;
            this.activeLevel = 1;

            this.score = 0;
            this.lives = 3;
            this.timeLeft = 50;
            this.round = 1;
            this.maxRounds = 3;

            this.timerInterval = null;
            this.driftFrameId = null;
            this.isDrifting = false;
            this.lastTime = 0;

            this.circles = [];
            this.currentTargetVal = 1;
            this.maxTargetVal = 5;
        }

        init(container, gameCtx) {
            this.container = container;
            this.gameCtx = gameCtx;
            this.activeLevel = gameCtx.level;

            this.score = 0;
            this.lives = 3;
            this.round = 1;
            this.maxRounds = 3;
            // Scale timer limit from 50s down to 25s minimum
            this.timeLeft = Math.max(25, 50 - Math.floor((this.activeLevel - 1) / 4) * 3);

            this.gameCtx.setScore(this.score);
            this.gameCtx.setLives(this.lives);

            this.container.innerHTML = `
                <div class="ee-container">
                    <div class="ee-prompt" id="ee-prompt">
                        Find and tap in ascending order: <span id="ee-next-target" class="ee-target-highlight">1</span>
                    </div>
                    
                    <div class="ee-field" id="ee-field">
                        <!-- Number circles populated dynamically -->
                    </div>

                    <div class="word-score-tracker" id="ee-dots">
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
                    this.cleanupDrift();
                    clearInterval(this.timerInterval);
                    this.gameCtx.onLose(this.score);
                }
            }, 1000);
        }

        cleanupDrift() {
            this.isDrifting = false;
            if (this.driftFrameId) {
                cancelAnimationFrame(this.driftFrameId);
                this.driftFrameId = null;
            }
        }

        generateRound() {
            this.cleanupDrift();

            // Update dots
            const dots = document.querySelectorAll(".word-dot");
            dots.forEach((dot, idx) => {
                if (idx < this.round) dot.classList.add("active");
                else dot.classList.remove("active");
            });

            this.currentTargetVal = 1;

            // Determine target range and distractor count based on level
            // L1-L3: 5 targets (1-5), 0 distractors, static
            // L4-L7: 8 targets (1-8), 3 distractors, static
            // L8-L12: 10 targets (1-10), 4 distractors, slow drift motion
            // L13+: 12 targets (1-12), 6 distractors, medium drift motion
            let targetCount = 5;
            let distractorCount = 0;
            let hasDrift = false;

            if (this.activeLevel >= 13) {
                targetCount = 12;
                distractorCount = 6;
                hasDrift = true;
            } else if (this.activeLevel >= 8) {
                targetCount = 10;
                distractorCount = 4;
                hasDrift = true;
            } else if (this.activeLevel >= 4) {
                targetCount = 8;
                distractorCount = 3;
                hasDrift = false;
            }

            this.maxTargetVal = targetCount;
            this.updatePrompt();

            const field = document.getElementById("ee-field");
            field.innerHTML = "";
            this.circles = [];

            const fieldWidth = field.offsetWidth || 780;
            const fieldHeight = field.offsetHeight || 385;

            // Gather item list
            const itemList = [];
            for (let i = 1; i <= targetCount; i++) {
                itemList.push({ label: i.toString(), isTarget: true, val: i });
            }

            // Distractor labels
            const distractorsPool = ["A", "B", "X", "Y", "Z", "88", "99", "77", "55", "33"];
            for (let i = 0; i < distractorCount; i++) {
                const pick = distractorsPool[i % distractorsPool.length];
                itemList.push({ label: pick, isTarget: false, val: -1 });
            }

            // Shuffle list
            itemList.sort(() => Math.random() - 0.5);

            // Positioning using simple grid cells to avoid overlaps
            const totalCircles = itemList.length;
            let cols = 4;
            let rows = 2;
            if (totalCircles > 14) { cols = 6; rows = 3; }
            else if (totalCircles > 8) { cols = 5; rows = 3; }

            const colWidth = fieldWidth / cols;
            const rowHeight = fieldHeight / rows;

            const cells = [];
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    cells.push({ row: r, col: c });
                }
            }
            cells.sort(() => Math.random() - 0.5);

            itemList.forEach((item, idx) => {
                const cell = cells[idx % cells.length];
                const circleRadius = 26; // 52px diameter

                const minX = cell.col * colWidth + 15;
                const maxX = (cell.col + 1) * colWidth - 15 - circleRadius * 2;
                const minY = cell.row * rowHeight + 15;
                const maxY = (cell.row + 1) * rowHeight - 15 - circleRadius * 2;

                const x = minX + Math.random() * (maxX - minX);
                const y = minY + Math.random() * (maxY - minY);

                const el = document.createElement("div");
                el.className = "ee-circle";
                el.innerText = item.label;

                // Color schemes (Targets are soft blue, distractors are soft grey-slate)
                const color = item.isTarget ? "#2563eb" : "#4b6584";
                el.style.borderColor = color + "60";
                el.style.color = color;
                el.style.boxShadow = `0 4px 12px rgba(15, 23, 42, 0.05), inset 0 0 10px ${color}08`;
                
                // Variable sizing for visual tracking challenge
                const size = 52 + (idx % 3) * 6; // sizes between 52px and 64px
                el.style.width = `${size}px`;
                el.style.height = `${size}px`;
                el.style.borderRadius = "50%";
                el.style.lineHeight = `${size - 4}px`;

                el.style.left = `${x}px`;
                el.style.top = `${y}px`;

                field.appendChild(el);

                // Movement vector if drift active
                let vx = 0;
                let vy = 0;
                if (hasDrift) {
                    const speed = this.activeLevel >= 13 ? 0.6 : 0.35;
                    vx = (Math.random() - 0.5) * speed;
                    vy = (Math.random() - 0.5) * speed;
                }

                const circle = {
                    element: el,
                    item: item,
                    x: x,
                    y: y,
                    vx: vx,
                    vy: vy,
                    width: size,
                    height: size
                };

                el.addEventListener("click", () => this.handleCircleClick(circle));
                this.circles.push(circle);
            });

            if (hasDrift) {
                this.lastTime = performance.now();
                this.isDrifting = true;
                this.driftLoop();
            }
        }

        driftLoop() {
            if (!this.isDrifting) return;
            const now = performance.now();
            const dt = Math.min(3.0, (now - this.lastTime) / 30); // scale speed relative to original 30ms interval
            this.lastTime = now;

            this.updateDrift(dt);
            this.driftFrameId = requestAnimationFrame(() => this.driftLoop());
        }

        updateDrift(dt = 1) {
            const field = document.getElementById("ee-field");
            if (!field) return;
            const fieldWidth = field.offsetWidth || 780;
            const fieldHeight = field.offsetHeight || 385;

            this.circles.forEach(c => {
                c.x += c.vx * dt;
                c.y += c.vy * dt;

                if (c.x < 8) { c.x = 8; c.vx *= -1; }
                if (c.x > fieldWidth - c.width - 8) { c.x = fieldWidth - c.width - 8; c.vx *= -1; }
                if (c.y < 8) { c.y = 8; c.vy *= -1; }
                if (c.y > fieldHeight - c.height - 8) { c.y = fieldHeight - c.height - 8; c.vy *= -1; }

                c.element.style.left = `${c.x}px`;
                c.element.style.top = `${c.y}px`;
            });
        }

        updatePrompt() {
            const nextEl = document.getElementById("ee-next-target");
            if (nextEl) {
                nextEl.innerText = this.currentTargetVal;
            }
        }

        handleCircleClick(circle) {
            this.gameCtx.playSound('click');

            const isCorrect = circle.item.isTarget && circle.item.val === this.currentTargetVal;

            if (isCorrect) {
                this.gameCtx.playSound('success');
                circle.element.classList.add("correct-anim");
                circle.element.style.borderColor = "#10b981";
                circle.element.style.background = "#10b981";
                circle.element.style.color = "#ffffff";

                this.score += 100;
                this.gameCtx.setScore(this.score);

                // Fade out and disable
                circle.element.style.pointerEvents = "none";
                setTimeout(() => {
                    circle.element.style.opacity = "0";
                    circle.element.style.transform = "scale(0.5)";
                }, 300);

                this.currentTargetVal++;
                this.updatePrompt();

                if (this.currentTargetVal > this.maxTargetVal) {
                    this.cleanupDrift();
                    setTimeout(() => {
                        this.round++;
                        if (this.round > this.maxRounds) {
                            this.triggerWin();
                        } else {
                            this.generateRound();
                        }
                    }, 800);
                }
            } else {
                // Ignore if clicked completed targets
                if (circle.item.isTarget && circle.item.val < this.currentTargetVal) return;

                // Wrong target click
                this.gameCtx.playSound('error');
                circle.element.classList.add("wrong-anim");
                this.lives--;
                this.gameCtx.setLives(this.lives);

                setTimeout(() => {
                    circle.element.classList.remove("wrong-anim");
                    if (this.lives <= 0) {
                        this.cleanupDrift();
                        clearInterval(this.timerInterval);
                        this.gameCtx.onLose(this.score);
                    }
                }, 500);
            }
        }

        triggerWin() {
            this.cleanupDrift();
            if (this.timerInterval) clearInterval(this.timerInterval);
            const timeBonus = this.timeLeft * 10;
            const finalScore = this.score + timeBonus + (this.lives * 150);
            const xp = 100;
            this.gameCtx.onWin(finalScore, xp);
        }

        destroy() {
            this.cleanupDrift();
            if (this.timerInterval) clearInterval(this.timerInterval);
        }
    }

    window.Games = window.Games || {};
    window.Games.eagle_eye = new EagleEyeGame();
})();
