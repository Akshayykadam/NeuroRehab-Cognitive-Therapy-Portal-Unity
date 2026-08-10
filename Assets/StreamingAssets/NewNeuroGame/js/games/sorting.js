/**
 * Game Module: Sorting Game (Clinical Version)
 */
(function() {
    const LEVEL_CATEGORIES = {
        1: {
            name: "Even / Odd Numbers",
            leftBin: "EVEN",
            rightBin: "ODD",
            items: [
                { val: "12", match: "left" }, { val: "25", match: "right" },
                { val: "8", match: "left" }, { val: "17", match: "right" },
                { val: "42", match: "left" }, { val: "31", match: "right" },
                { val: "20", match: "left" }, { val: "9", match: "right" },
                { val: "6", match: "left" }, { val: "45", match: "right" },
                { val: "14", match: "left" }, { val: "3", match: "right" },
                { val: "50", match: "left" }, { val: "27", match: "right" },
                { val: "34", match: "left" }, { val: "19", match: "right" }
            ]
        },
        2: {
            name: "Vowels / Consonants",
            leftBin: "VOWEL",
            rightBin: "CONSONANT",
            items: [
                { val: "A", match: "left" }, { val: "B", match: "right" },
                { val: "E", match: "left" }, { val: "C", match: "right" },
                { val: "I", match: "left" }, { val: "D", match: "right" },
                { val: "O", match: "left" }, { val: "F", match: "right" },
                { val: "U", match: "left" }, { val: "G", match: "right" },
                { val: "A", match: "left" }, { val: "H", match: "right" },
                { val: "E", match: "left" }, { val: "J", match: "right" },
                { val: "O", match: "left" }, { val: "K", match: "right" }
            ]
        },
        3: {
            name: "Living / Non-Living",
            leftBin: "LIVING",
            rightBin: "NON-LIVING",
            items: [
                { val: "Dog 🐶", match: "left" }, { val: "Car 🚗", match: "right" },
                { val: "Cat 🐱", match: "left" }, { val: "Rock 🪨", match: "right" },
                { val: "Tree 🌲", match: "left" }, { val: "Book 📖", match: "right" },
                { val: "Bird 🐦", match: "left" }, { val: "Clock ⏰", match: "right" },
                { val: "Fish 🐟", match: "left" }, { val: "Key 🔑", match: "right" },
                { val: "Frog 🐸", match: "left" }, { val: "Phone 📱", match: "right" },
                { val: "Flower 🌸", match: "left" }, { val: "Chair 🪑", match: "right" },
                { val: "Horse 🐴", match: "left" }, { val: "Spoon 🥄", match: "right" }
            ]
        },
        4: {
            name: "Prime / Composite",
            leftBin: "PRIME",
            rightBin: "COMPOSITE",
            items: [
                { val: "3", match: "left" }, { val: "4", match: "right" },
                { val: "5", match: "left" }, { val: "6", match: "right" },
                { val: "7", match: "left" }, { val: "8", match: "right" },
                { val: "11", match: "left" }, { val: "9", match: "right" },
                { val: "13", match: "left" }, { val: "10", match: "right" },
                { val: "17", match: "left" }, { val: "12", match: "right" },
                { val: "19", match: "left" }, { val: "15", match: "right" },
                { val: "23", match: "left" }, { val: "20", match: "right" }
            ]
        },
        5: {
            name: "Thermal: Hot / Cold Items",
            leftBin: "HOT",
            rightBin: "COLD",
            items: [
                { val: "Sun ☀️", match: "left" }, { val: "Ice 🧊", match: "right" },
                { val: "Fire 🔥", match: "left" }, { val: "Snow ❄️", match: "right" },
                { val: "Lava 🌋", match: "left" }, { val: "Glacier 🏔️", match: "right" },
                { val: "Coffee ☕", match: "left" }, { val: "Ice Cream 🍦", match: "right" },
                { val: "Match 🪵", match: "left" }, { val: "Igloo 🛖", match: "right" },
                { val: "Soup 🍲", match: "left" }, { val: "Penguin 🐧", match: "right" },
                { val: "Torch 🔦", match: "left" }, { val: "Wind 🌬️", match: "right" },
                { val: "Steam 💨", match: "left" }, { val: "Frost 🥶", match: "right" }
            ]
        }
    };

    class SortingGame {
        constructor() {
            this.container = null;
            this.gameCtx = null;
            this.activeLevel = 1;
            
            this.score = 0;
            this.lives = 3;
            this.timeLeft = 50; // Increased timer for therapeutic setting
            
            this.itemsList = [];
            this.currentItemIdx = 0;
            this.totalItems = 15;
            
            this.isDragging = false;
            this.dragStartX = 0;
            this.dragCurrentX = 0;
            
            this.timerInterval = null;
            this.keyHandler = null;
        }

        init(container, gameCtx) {
            this.container = container;
            this.gameCtx = gameCtx;
            this.activeLevel = gameCtx.level;
            
            this.score = 0;
            this.lives = 3;
            this.timeLeft = 50;
            this.currentItemIdx = 0;
            
            const catIndex = ((this.activeLevel - 1) % 5) + 1;
            const categoryData = LEVEL_CATEGORIES[catIndex];
            this.itemsList = [...categoryData.items].sort(() => Math.random() - 0.5).slice(0, this.totalItems);
            this.categoryName = categoryData.name;
            
            // Asymptotically scale timer limit, minimum 30s
            this.timeLeft = Math.max(30, 50 - Math.floor((this.activeLevel - 1) / 5) * 5);

            this.gameCtx.setScore(this.score);
            this.gameCtx.setLives(this.lives);

            this.container.innerHTML = `
                <div class="sorting-container">
                    <div id="bin-left" class="sorting-bin bin-left">
                        <span class="bin-label">${categoryData.leftBin}</span>
                        <i class="fa-solid fa-square-caret-left bin-graphic"></i>
                        <span style="font-size:0.75rem; font-weight:600; color:rgba(30,41,59,0.45);">[Press Left Arrow]</span>
                    </div>

                    <div class="sorting-play-area">
                        <div style="position:absolute; top:5%; font-size:0.85rem; font-weight:700; text-transform:uppercase; color:rgba(30,41,59,0.5); letter-spacing:0.5px;">
                            ${categoryData.name} (${this.currentItemIdx + 1}/${this.totalItems})
                        </div>
                        <div id="sort-card" class="sorting-item-card">
                            <span id="sort-item-val" class="sorting-item-val">Item</span>
                        </div>
                    </div>

                    <div id="bin-right" class="sorting-bin bin-right">
                        <span class="bin-label">${categoryData.rightBin}</span>
                        <i class="fa-solid fa-square-caret-right bin-graphic"></i>
                        <span style="font-size:0.75rem; font-weight:600; color:rgba(30,41,59,0.45);">[Press Right Arrow]</span>
                    </div>
                </div>
            `;

            this.startTimer();
            this.bindInput();
            this.loadNextItem();
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

        bindInput() {
            const card = document.getElementById("sort-card");
            const binLeft = document.getElementById("bin-left");
            const binRight = document.getElementById("bin-right");
            const container = document.querySelector(".sorting-container");

            binLeft.addEventListener("click", () => this.sortItem("left"));
            binRight.addEventListener("click", () => this.sortItem("right"));

            const startDrag = (e) => {
                this.isDragging = true;
                this.dragStartX = e.touches ? e.touches[0].clientX : e.clientX;
                card.style.transition = "none";
            };

            const dragMove = (e) => {
                if (!this.isDragging) return;
                const currentX = e.touches ? e.touches[0].clientX : e.clientX;
                const diffX = currentX - this.dragStartX;
                this.dragCurrentX = diffX;

                card.style.transform = `translateX(${diffX}px) rotate(${diffX * 0.03}deg)`;

                if (diffX < -50) {
                    container.classList.add("bin-active-left");
                    container.classList.remove("bin-active-right");
                } else if (diffX > 50) {
                    container.classList.add("bin-active-right");
                    container.classList.remove("bin-active-left");
                } else {
                    container.classList.remove("bin-active-left", "bin-active-right");
                }
            };

            const stopDrag = () => {
                if (!this.isDragging) return;
                this.isDragging = false;
                container.classList.remove("bin-active-left", "bin-active-right");

                if (this.dragCurrentX < -90) {
                    this.sortItem("left");
                } else if (this.dragCurrentX > 90) {
                    this.sortItem("right");
                } else {
                    card.style.transition = "transform 0.2s ease";
                    card.style.transform = "none";
                }
            };

            card.addEventListener("mousedown", startDrag);
            window.addEventListener("mousemove", dragMove);
            window.addEventListener("mouseup", stopDrag);

            card.addEventListener("touchstart", startDrag, { passive: true });
            window.addEventListener("touchmove", dragMove, { passive: true });
            window.addEventListener("touchend", stopDrag);

            this.dragHandlers = { startDrag, dragMove, stopDrag };

            this.keyHandler = (e) => {
                if (e.key === "ArrowLeft") {
                    this.gameCtx.playSound('click');
                    container.classList.add("bin-active-left");
                    setTimeout(() => container.classList.remove("bin-active-left"), 180);
                    this.sortItem("left");
                } else if (e.key === "ArrowRight") {
                    this.gameCtx.playSound('click');
                    container.classList.add("bin-active-right");
                    setTimeout(() => container.classList.remove("bin-active-right"), 180);
                    this.sortItem("right");
                }
            };
            window.addEventListener("keydown", this.keyHandler);
        }

        loadNextItem() {
            if (this.currentItemIdx >= this.totalItems) {
                this.triggerWin();
                return;
            }

            const item = this.itemsList[this.currentItemIdx];
            const card = document.getElementById("sort-card");
            const label = document.getElementById("sort-item-val");
            const indicator = document.querySelector(".sorting-play-area div");

            if (card) {
                card.style.transition = "none";
                card.style.transform = "scale(0.8) translateY(-30px)";
                card.style.opacity = "0";
                
                label.innerText = item.val;
                indicator.innerText = `${this.categoryName} (${this.currentItemIdx + 1}/${this.totalItems})`;

                setTimeout(() => {
                    if (card) {
                        card.style.transition = "transform 0.25s ease-out, opacity 0.2s";
                        card.style.transform = "none";
                        card.style.opacity = "1";
                    }
                }, 50);
            }
        }

        sortItem(choice) {
            const item = this.itemsList[this.currentItemIdx];
            const card = document.getElementById("sort-card");
            const isCorrect = choice === item.match;

            if (card) {
                card.style.transition = "transform 0.25s ease-in, opacity 0.2s";
                card.style.transform = `translateX(${choice === "left" ? -400 : 400}px) rotate(${choice === "left" ? -25 : 25}deg)`;
                card.style.opacity = "0";
            }

            if (isCorrect) {
                this.gameCtx.playSound('success');
                this.score += 100;
                this.gameCtx.setScore(this.score);
                
                this.currentItemIdx++;
                setTimeout(() => this.loadNextItem(), 250);
            } else {
                this.gameCtx.playSound('error');
                this.lives--;
                this.gameCtx.setLives(this.lives);
                
                const cont = document.querySelector(".sorting-container");
                if (cont) {
                    cont.style.transform = "translateX(10px)";
                    setTimeout(() => cont.style.transform = "translateX(-10px)", 50);
                    setTimeout(() => cont.style.transform = "none", 100);
                }

                if (this.lives <= 0) {
                    if (this.timerInterval) clearInterval(this.timerInterval);
                    this.gameCtx.onLose(this.score);
                } else {
                    this.currentItemIdx++;
                    setTimeout(() => this.loadNextItem(), 250);
                }
            }
        }

        triggerWin() {
            if (this.timerInterval) clearInterval(this.timerInterval);
            
            const timeBonus = this.timeLeft * 15;
            const finalScore = this.score + timeBonus + (this.lives * 150);
            const xp = 100;
            
            this.gameCtx.onWin(finalScore, xp);
        }

        destroy() {
            if (this.dragHandlers) {
                const card = document.getElementById("sort-card");
                if (card) {
                    card.removeEventListener("mousedown", this.dragHandlers.startDrag);
                    card.removeEventListener("touchstart", this.dragHandlers.startDrag);
                }
                window.removeEventListener("mousemove", this.dragHandlers.dragMove);
                window.removeEventListener("touchmove", this.dragHandlers.dragMove);
                window.removeEventListener("mouseup", this.dragHandlers.stopDrag);
                window.removeEventListener("touchend", this.dragHandlers.stopDrag);
            }
            if (this.keyHandler) {
                window.removeEventListener("keydown", this.keyHandler);
            }
            if (this.timerInterval) clearInterval(this.timerInterval);
        }
    }

    window.Games = window.Games || {};
    window.Games.sorting = new SortingGame();
})();
