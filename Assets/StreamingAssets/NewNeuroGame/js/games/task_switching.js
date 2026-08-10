/**
 * Game Module: Task Switching Game (Clinical Version)
 */
(function() {
    const SHAPES = ["circle", "square", "triangle"];
    const COLORS = [
        { name: "blue", hex: "#60a5fa", rgba: "rgba(96, 165, 250, 0.15)" },
        { name: "teal", hex: "#2dd4bf", rgba: "rgba(45, 212, 191, 0.15)" },
        { name: "green", hex: "#4ade80", rgba: "rgba(74, 222, 128, 0.15)" }
    ];
    const NUMBERS = [1, 2, 3];
    const RULES = ["COLOR", "SHAPE", "NUMBER"];

    class TaskSwitchingGame {
        constructor() {
            this.container = null;
            this.gameCtx = null;
            this.activeLevel = 1;
            
            this.score = 0;
            this.lives = 3;
            this.correctCount = 0;
            this.targetMatches = 12;
            
            this.currentRule = "COLOR";
            this.turnsUntilSwitch = 3;
            this.maxTurnsPerRule = 3;
            
            this.centerCard = null;
            this.leftCard = null;
            this.rightCard = null;
            
            this.perCardTimeLimit = 6.0; // seconds
            this.cardTimeRemaining = 6.0;
            
            this.timerInterval = null;
            this.cardTimerInterval = null;
            this.startTime = null;
        }

        init(container, gameCtx) {
            this.container = container;
            this.gameCtx = gameCtx;
            this.activeLevel = gameCtx.level;
            
            this.score = 0;
            this.lives = 3;
            this.correctCount = 0;
            this.targetMatches = 12;
            
            // Scaled timers for dynamic infinite clinical difficulty: cap at 3.0s minimum
            this.perCardTimeLimit = Math.max(3.0, 9.0 - this.activeLevel * 1.0);
            this.maxTurnsPerRule = Math.max(2, 6 - Math.floor(this.activeLevel / 2));

            this.turnsUntilSwitch = this.maxTurnsPerRule;
            this.currentRule = "COLOR";

            this.gameCtx.setScore(this.score);
            this.gameCtx.setLives(this.lives);

            this.startTime = Date.now();
            this.startGlobalTimer();

            this.container.innerHTML = `
                <div class="switching-container">
                    <div class="rule-banner">
                        <div class="rule-title">Match Criterion</div>
                        <div id="active-rule-text" class="rule-active rule-color" style="color: #2dd4bf;">COLOR</div>
                    </div>
                    
                    <div style="display:flex; justify-content:center; align-items:center; gap:2.5rem; width:100%;">
                        <div class="switching-card-slot">
                            <div id="center-card" class="switching-card"></div>
                        </div>
                    </div>
                    
                    <div class="switching-btn-row">
                        <div id="choice-left" class="switching-action-btn"></div>
                        <div id="choice-right" class="switching-action-btn"></div>
                    </div>
                    
                    <div class="recall-progress-container" style="width:40%;">
                        <div class="recall-progress-fill" id="card-progress"></div>
                    </div>
                </div>
            `;

            this.bindInput();
            this.nextTurn();
        }

        startGlobalTimer() {
            this.timerInterval = setInterval(() => {
                const elapsedSecs = Math.floor((Date.now() - this.startTime) / 1000);
                const mm = Math.floor(elapsedSecs / 60).toString().padStart(2, '0');
                const ss = (elapsedSecs % 60).toString().padStart(2, '0');
                this.gameCtx.setTimer(`${mm}:${ss}`);
            }, 1000);
        }

        bindInput() {
            document.getElementById("choice-left").addEventListener("click", () => this.handleChoice("left"));
            document.getElementById("choice-right").addEventListener("click", () => this.handleChoice("right"));
        }

        nextTurn() {
            this.turnsUntilSwitch--;
            if (this.turnsUntilSwitch <= 0) {
                this.switchRule();
            }

            this.generateCards();
            
            this.renderCard("center-card", this.centerCard);
            this.renderCard("choice-left", this.leftCard);
            this.renderCard("choice-right", this.rightCard);

            this.startCardTimer();
        }

        switchRule() {
            this.turnsUntilSwitch = this.maxTurnsPerRule;
            
            const availableRules = this.activeLevel >= 3 ? RULES : ["COLOR", "SHAPE"];
            const otherRules = availableRules.filter(r => r !== this.currentRule);
            this.currentRule = otherRules[Math.floor(Math.random() * otherRules.length)];

            this.gameCtx.playSound('match');
            const ruleText = document.getElementById("active-rule-text");
            if (ruleText) {
                ruleText.innerText = `MATCH ${this.currentRule}`;
                ruleText.className = "rule-active";
                if (this.currentRule === "COLOR") ruleText.style.color = "#2dd4bf";
                else if (this.currentRule === "SHAPE") ruleText.style.color = "#60a5fa";
                else if (this.currentRule === "NUMBER") ruleText.style.color = "#fbbf24";
            }
        }

        generateCards() {
            this.centerCard = this.randomCardConfig();
            this.leftCard = this.randomCardConfig();
            this.rightCard = this.randomCardConfig();

            const rule = this.currentRule;

            if (rule === "COLOR") {
                this.leftCard.color = this.centerCard.color;
                this.leftCard.shape = this.getDifferentValue(SHAPES, this.centerCard.shape);
                this.leftCard.number = this.getDifferentValue(NUMBERS, this.centerCard.number);
                this.rightCard.color = this.getDifferentValue(COLORS, this.centerCard.color);
            } 
            else if (rule === "SHAPE") {
                this.leftCard.shape = this.centerCard.shape;
                this.leftCard.color = this.getDifferentValue(COLORS, this.centerCard.color);
                this.leftCard.number = this.getDifferentValue(NUMBERS, this.centerCard.number);
                this.rightCard.shape = this.getDifferentValue(SHAPES, this.centerCard.shape);
            } 
            else if (rule === "NUMBER") {
                this.leftCard.number = this.centerCard.number;
                this.leftCard.color = this.getDifferentValue(COLORS, this.centerCard.color);
                this.leftCard.shape = this.getDifferentValue(SHAPES, this.centerCard.shape);
                this.rightCard.number = this.getDifferentValue(NUMBERS, this.centerCard.number);
            }

            this.correctChoice = "left";
            if (Math.random() > 0.5) {
                const temp = this.leftCard;
                this.leftCard = this.rightCard;
                this.rightCard = temp;
                this.correctChoice = "right";
            }
        }

        randomCardConfig() {
            return {
                shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                number: NUMBERS[Math.floor(Math.random() * NUMBERS.length)]
            };
        }

        getDifferentValue(array, valueToAvoid) {
            const avoidName = valueToAvoid.name || valueToAvoid;
            const choices = array.filter(item => (item.name || item) !== avoidName);
            return choices[Math.floor(Math.random() * choices.length)];
        }

        renderCard(elementId, config) {
            const card = document.getElementById(elementId);
            if (!card) return;

            let shapeSVG = "";
            const fillHex = config.color.hex;
            
            if (config.shape === "circle") {
                shapeSVG = `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="32" fill="${fillHex}" /></svg>`;
            } else if (config.shape === "square") {
                shapeSVG = `<svg viewBox="0 0 100 100"><rect x="18" y="18" width="64" height="64" fill="${fillHex}" /></svg>`;
            } else if (config.shape === "triangle") {
                shapeSVG = `<svg viewBox="0 0 100 100"><polygon points="50,18 82,78 18,78" fill="${fillHex}" /></svg>`;
            }

            let shapesHTML = "";
            for (let i = 0; i < config.number; i++) {
                shapesHTML += `<div class="switching-card-shape" style="width: 28px; height: 28px;">${shapeSVG}</div>`;
            }

            card.innerHTML = `
                <div class="switching-card-content" style="pointer-events: none;">
                    <div style="display:flex; gap:0.4rem; justify-content:center; align-items:center;">${shapesHTML}</div>
                    <div class="switching-card-number" style="color: ${fillHex}; margin-top: 0.2rem;">${config.number}</div>
                </div>
            `;
            
            // Apply premium colored border & corner glow gradient (Light Theme)
            card.style.borderColor = `${fillHex}40`;
            card.style.background = `linear-gradient(135deg, #ffffff 0%, #fcfdfd 55%, ${config.color.rgba} 100%)`;
        }

        startCardTimer() {
            if (this.cardTimerInterval) clearInterval(this.cardTimerInterval);
            
            this.cardTimeRemaining = this.perCardTimeLimit;
            const bar = document.getElementById("card-progress");
            if (bar) {
                bar.style.transition = "none";
                bar.style.width = "100%";
                bar.offsetHeight; 
                bar.style.transition = `width ${this.perCardTimeLimit}s linear`;
                bar.style.width = "0%";
            }

            this.cardTimerInterval = setInterval(() => {
                this.cardTimeRemaining -= 0.1;
                if (this.cardTimeRemaining <= 0) {
                    clearInterval(this.cardTimerInterval);
                    this.handleTimeout();
                }
            }, 100);
        }

        handleChoice(choice) {
            clearInterval(this.cardTimerInterval);
            const isCorrect = choice === this.correctChoice;

            if (isCorrect) {
                this.gameCtx.playSound('success');
                this.correctCount++;
                this.score += 150;
                this.gameCtx.setScore(this.score);

                if (this.correctCount >= this.targetMatches) {
                    this.triggerWin();
                } else {
                    this.nextTurn();
                }
            } else {
                this.handleIncorrect();
            }
        }

        handleTimeout() {
            this.handleIncorrect();
        }

        handleIncorrect() {
            this.gameCtx.playSound('error');
            this.lives--;
            this.gameCtx.setLives(this.lives);

            const container = document.querySelector(".switching-container");
            if (container) {
                container.style.animation = "shake 0.4s ease";
                setTimeout(() => container.style.animation = "none", 400);
            }

            if (this.lives <= 0) {
                if (this.timerInterval) clearInterval(this.timerInterval);
                this.gameCtx.onLose(this.score);
            } else {
                this.nextTurn();
            }
        }

        triggerWin() {
            if (this.timerInterval) clearInterval(this.timerInterval);
            
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            const speedBonus = Math.max(0, 1000 - elapsed * 5);
            const finalScore = this.score + speedBonus + (this.lives * 200);
            const xp = 100;

            this.gameCtx.onWin(finalScore, xp);
        }

        destroy() {
            if (this.timerInterval) clearInterval(this.timerInterval);
            if (this.cardTimerInterval) clearInterval(this.cardTimerInterval);
        }
    }

    window.Games = window.Games || {};
    window.Games.task_switching = new TaskSwitchingGame();
})();
