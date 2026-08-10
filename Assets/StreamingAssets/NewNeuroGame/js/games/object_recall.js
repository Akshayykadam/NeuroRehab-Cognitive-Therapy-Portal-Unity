/**
 * Game Module: Object Recall Game (Clinical Version)
 */
(function() {
    const RECALL_SYMBOLS = [
        "🍎", "🍌", "🍒", "🍇", "🍊", "🍓", "🍍", "🥑", 
        "🐱", "🐶", "🐰", "🦊", "🐻", "🐼", "🦁", "🐸", 
        "🚗", "🚌", "🚑", "🚒", "🚲", "✈️", "🚢", "🚂",
        "🏠", "🌲", "🌸", "☀️", "☁️", "☂️", "🔑", "📖"
    ];

    class ObjectRecallGame {
        constructor() {
            this.container = null;
            this.gameCtx = null;
            this.activeLevel = 1;
            
            this.studyItems = [];
            this.allItems = [];
            this.newAddedItem = "";
            this.phase = "study";
            this.round = 1;
            this.maxRounds = 3;
            this.score = 0;
            this.lives = 3;
            this.studyTime = 8; // seconds
            
            this.timerTimeout = null;
            this.timerInterval = null;
        }

        init(container, gameCtx) {
            this.container = container;
            this.gameCtx = gameCtx;
            this.activeLevel = gameCtx.level;
            
            this.score = 0;
            this.lives = 3;
            this.round = 1;
            
            // Generous study times to assist recovery: min 3.0s
            this.studyTime = Math.max(3.0, 9.0 - Math.min(6.0, this.activeLevel * 0.8)); 
            this.maxRounds = 3;

            this.gameCtx.setScore(this.score);
            this.gameCtx.setLives(this.lives);
            this.gameCtx.setTimer(`Round 1/${this.maxRounds}`);

            this.startRound();
        }

        startRound() {
            this.phase = "study";
            this.gameCtx.setTimer(`Round ${this.round}/${this.maxRounds}`);
            
            let studyCount = 3;
            if (this.activeLevel === 2) studyCount = 4;
            else if (this.activeLevel === 3) studyCount = 5;
            else if (this.activeLevel === 4) studyCount = 7;
            else {
                // Unlimited levels (L5+): scale card count up to 12 symbols
                studyCount = Math.min(12, 9 + Math.floor((this.activeLevel - 5) / 2));
            }

            const shuffledSymbols = [...RECALL_SYMBOLS].sort(() => Math.random() - 0.5);
            this.studyItems = shuffledSymbols.slice(0, studyCount);
            
            const remainingSymbols = shuffledSymbols.slice(studyCount);
            this.newAddedItem = remainingSymbols[0];

            this.renderStudyScreen();
            this.startStudyTimer();
        }

        renderStudyScreen() {
            this.container.innerHTML = `
                <div class="recall-container">
                    <div class="recall-prompt">MEMORIZE THESE SYMBOLS</div>
                    <div class="recall-board" id="recall-board"></div>
                    <div class="recall-progress-container">
                        <div class="recall-progress-fill" id="recall-progress"></div>
                    </div>
                </div>
            `;

            const board = document.getElementById("recall-board");
            const colors = ["#ff4d4d", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#14b8a6", "#ef4444", "#84cc16", "#06b6d4", "#f97316", "#a855f7"];
            this.studyItems.forEach(item => {
                const div = document.createElement("div");
                div.className = "recall-item";
                div.innerText = item;
                const code = item.codePointAt(0) || 0;
                const col = colors[code % colors.length];
                div.style.cssText = `border-color: ${col}40;`;
                board.appendChild(div);
            });
        }

        startStudyTimer() {
            const bar = document.getElementById("recall-progress");
            bar.style.transition = `width ${this.studyTime}s linear`;
            requestAnimationFrame(() => {
                if (bar) bar.style.width = "0%";
            });

            this.timerTimeout = setTimeout(() => {
                this.switchToRecallPhase();
            }, this.studyTime * 1000);
        }

        switchToRecallPhase() {
            this.phase = "recall";
            this.gameCtx.playSound('match');

            this.allItems = [...this.studyItems, this.newAddedItem].sort(() => Math.random() - 0.5);

            this.container.innerHTML = `
                <div class="recall-container">
                    <div class="recall-prompt" style="color: #60a5fa;">WHICH OBJECT WAS ADDED?</div>
                    <div class="recall-board interactive" id="recall-board"></div>
                    <div style="height:6px;"></div>
                </div>
            `;

            const board = document.getElementById("recall-board");
            const colors = ["#ff4d4d", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#14b8a6", "#ef4444", "#84cc16", "#06b6d4", "#f97316", "#a855f7"];
            this.allItems.forEach(item => {
                const div = document.createElement("div");
                div.className = "recall-item";
                const code = item.codePointAt(0) || 0;
                const col = colors[code % colors.length];
                div.style.cssText = `border-color: ${col}40;`;
                div.innerText = item;
                
                div.addEventListener("click", () => {
                    this.handleSelection(item, div);
                });
                
                board.appendChild(div);
            });
        }

        handleSelection(selectedItem, element) {
            if (this.phase !== "recall") return;
            
            const isCorrect = selectedItem === this.newAddedItem;

            if (isCorrect) {
                this.phase = "transition";
                element.style.borderColor = "#10b981";
                element.style.background = "linear-gradient(135deg, #064e3b, #065f46)";
                element.innerText = "✓";
                element.style.color = "#34d399";
                this.gameCtx.playSound('success');
                
                this.score += 200;
                this.gameCtx.setScore(this.score);

                setTimeout(() => {
                    this.round++;
                    if (this.round > this.maxRounds) {
                        this.triggerWin();
                    } else {
                        this.startRound();
                    }
                }, 1000);
            } else {
                this.phase = "transition";
                element.style.borderColor = "#ef4444";
                element.style.background = "linear-gradient(135deg, #450a0a, #7f1d1d)";
                element.innerText = "✗";
                element.style.color = "#f87171";
                this.gameCtx.playSound('error');
                
                this.lives--;
                this.gameCtx.setLives(this.lives);

                setTimeout(() => {
                    if (this.lives <= 0) {
                        this.gameCtx.onLose(this.score);
                    } else {
                        this.startRound();
                    }
                }, 1000);
            }
        }

        triggerWin() {
            const finalScore = this.score + (this.lives * 200);
            const xp = 100;
            this.gameCtx.onWin(finalScore, xp);
        }

        destroy() {
            if (this.timerTimeout) clearTimeout(this.timerTimeout);
            if (this.timerInterval) clearInterval(this.timerInterval);
        }
    }

    window.Games = window.Games || {};
    window.Games.object_recall = new ObjectRecallGame();
})();
