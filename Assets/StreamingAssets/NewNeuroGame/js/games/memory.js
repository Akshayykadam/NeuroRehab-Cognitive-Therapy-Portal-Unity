/**
 * Game Module: Memory Cards (Clinical Version)
 */
(function() {
    const SIMPLE_ICONS = [
        "fa-solid fa-brain",
        "fa-solid fa-heart",
        "fa-solid fa-star",
        "fa-solid fa-leaf",
        "fa-solid fa-dna",
        "fa-solid fa-cloud",
        "fa-solid fa-hand-holding-medical",
        "fa-solid fa-shield-halved",
        "fa-solid fa-circle-nodes",
        "fa-solid fa-sun",
        "fa-solid fa-moon",
        "fa-solid fa-umbrella",
        "fa-solid fa-clock",
        "fa-solid fa-wrench"
    ];

    const MATH_PAIRS = [
        { display: "3 + 5", id: 1 },
        { display: "8", id: 1 },
        
        { display: "2 x 6", id: 2 },
        { display: "12", id: 2 },
        
        { display: "15 - 9", id: 3 },
        { display: "6", id: 3 },
        
        { display: "20 / 4", id: 4 },
        { display: "5", id: 4 },
        
        { display: "9 + 7", id: 5 },
        { display: "16", id: 5 },
        
        { display: "25 - 15", id: 6 },
        { display: "10", id: 6 },
        
        { display: "3 x 3", id: 7 },
        { display: "9", id: 7 },
        
        { display: "14 / 2", id: 8 },
        { display: "7", id: 8 },
        
        { display: "8 + 6", id: 9 },
        { display: "14", id: 9 },
        
        { display: "30 / 10", id: 10 },
        { display: "3", id: 10 },
        
        { display: "4 x 5", id: 11 },
        { display: "20", id: 11 },
        
        { display: "11 + 4", id: 12 },
        { display: "15", id: 12 }
    ];

    class MemoryGame {
        constructor() {
            this.container = null;
            this.gameCtx = null;
            this.activeLevel = 1;
            
            this.cards = [];
            this.firstCard = null;
            this.secondCard = null;
            this.lockBoard = false;
            this.pairsFound = 0;
            this.totalPairs = 6;
            this.score = 0;
            
            this.timeLeft = 0;
            this.timerInterval = null;
        }

        init(container, gameCtx) {
            this.container = container;
            this.gameCtx = gameCtx;
            this.activeLevel = gameCtx.level;
            
            this.score = 0;
            this.pairsFound = 0;
            this.firstCard = null;
            this.secondCard = null;
            this.lockBoard = false;

            this.gameCtx.setScore(this.score);
            this.gameCtx.setLives("---");

            this.setupBoard();
        }

        setupBoard() {
            let cols = 4;
            let rows = 3;
            let cardData = [];

            if (this.activeLevel === 1) {
                cols = 4; rows = 3;
                this.totalPairs = 6;
                cardData = this.generateIconPairs(this.totalPairs);
            } else if (this.activeLevel === 2) {
                cols = 4; rows = 4;
                this.totalPairs = 8;
                cardData = this.generateIconPairs(this.totalPairs);
            } else if (this.activeLevel === 3) {
                cols = 5; rows = 4;
                this.totalPairs = 10;
                cardData = this.generateIconPairs(this.totalPairs);
                this.timeLeft = 75; // Relaxed timer
                this.startTimer();
            } else if (this.activeLevel === 4) {
                cols = 6; rows = 4;
                this.totalPairs = 12;
                cardData = this.generateMathPairs();
                this.timeLeft = 120; // Relaxed timer
                this.startTimer();
            } else {
                // Infinite levels L5+: Alternating challenge grids
                const isEven = this.activeLevel % 2 === 0;
                if (isEven) {
                    cols = 6; rows = 4;
                    this.totalPairs = 12;
                    cardData = this.generateMathPairs();
                } else {
                    cols = 6; rows = 6;
                    this.totalPairs = 18;
                    cardData = this.generateIconPairs(this.totalPairs);
                }
                // Asymptotically decreasing timer: cap at 45 seconds minimum
                this.timeLeft = Math.max(45, 95 - (this.activeLevel - 5) * 5);
                this.startTimer();
            }

            if (!this.timeLeft) {
                this.gameCtx.setTimer("---");
            }

            cardData.sort(() => Math.random() - 0.5);

            this.container.innerHTML = `
                <div class="memory-board" id="memory-board" style="
                    grid-template-columns: repeat(${cols}, 1fr);
                    width: ${cols * 95}px;
                "></div>
            `;

            const board = document.getElementById("memory-board");
            cardData.forEach((data, index) => {
                const card = document.createElement("div");
                card.className = "memory-card";
                card.dataset.matchId = data.id;
                card.dataset.index = index;

                const colors = ["#ff4d4d", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#14b8a6", "#ef4444", "#84cc16", "#06b6d4", "#f97316", "#a855f7"];
                const color = colors[data.id % colors.length];
                let frontContent = "";
                if (data.icon) {
                    frontContent = `<i class="${data.icon}" style="color: ${color}; font-size: 2.6rem;"></i>`;
                } else if (data.text) {
                    frontContent = `<span style="font-size:1.15rem; font-weight:800; color: ${color};">${data.text}</span>`;
                }

                card.innerHTML = `
                    <div class="card-inner">
                        <div class="card-back">
                            <i class="fa-solid fa-brain"></i>
                        </div>
                        <div class="card-front" style="border-color: ${color}60; box-shadow: inset 0 0 15px ${color}15, 0 0 10px ${color}10;">
                            ${frontContent}
                        </div>
                    </div>
                `;

                card.addEventListener("click", () => this.flipCard(card));
                board.appendChild(card);
            });
        }

        generateIconPairs(count) {
            const list = [];
            const icons = [...SIMPLE_ICONS].sort(() => Math.random() - 0.5).slice(0, count);
            icons.forEach((icon, idx) => {
                list.push({ id: idx, icon: icon });
                list.push({ id: idx, icon: icon });
            });
            return list;
        }

        generateMathPairs() {
            const uniqueIds = Array.from(new Set(MATH_PAIRS.map(x => x.id))).slice(0, 12);
            const list = [];
            uniqueIds.forEach(id => {
                const items = MATH_PAIRS.filter(x => x.id === id);
                list.push({ id: id, text: items[0].display });
                list.push({ id: id, text: items[1].display });
            });
            return list;
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

        flipCard(card) {
            if (this.lockBoard) return;
            if (card === this.firstCard) return;
            if (card.classList.contains("flipped") || card.classList.contains("matched")) return;

            this.gameCtx.playSound('click');
            card.classList.add("flipped");

            if (!this.firstCard) {
                this.firstCard = card;
                return;
            }

            this.secondCard = card;
            this.checkForMatch();
        }

        checkForMatch() {
            const isMatch = this.firstCard.dataset.matchId === this.secondCard.dataset.matchId;
            if (isMatch) {
                this.disableCards();
            } else {
                this.unflipCards();
            }
        }

        disableCards() {
            this.lockBoard = true;
            this.firstCard.classList.add("matched");
            this.secondCard.classList.add("matched");
            
            setTimeout(() => {
                this.gameCtx.playSound('match');
                this.pairsFound++;
                this.score += 200;
                this.gameCtx.setScore(this.score);
                this.resetBoardState();

                if (this.pairsFound === this.totalPairs) {
                    this.triggerWin();
                }
            }, 300);
        }

        unflipCards() {
            this.lockBoard = true;
            // Increased showing time slightly for therapy observation
            setTimeout(() => {
                this.firstCard.classList.remove("flipped");
                this.secondCard.classList.remove("flipped");
                this.resetBoardState();
            }, 1400); 
        }

        resetBoardState() {
            [this.firstCard, this.secondCard] = [null, null];
            this.lockBoard = false;
        }

        triggerWin() {
            if (this.timerInterval) clearInterval(this.timerInterval);
            
            const timeBonus = this.timeLeft > 0 ? this.timeLeft * 10 : 0;
            const finalScore = this.score + timeBonus;
            const xp = 100;

            setTimeout(() => {
                this.gameCtx.onWin(finalScore, xp);
            }, 600);
        }

        destroy() {
            if (this.timerInterval) clearInterval(this.timerInterval);
        }
    }

    window.Games = window.Games || {};
    window.Games.memory = new MemoryGame();
})();
