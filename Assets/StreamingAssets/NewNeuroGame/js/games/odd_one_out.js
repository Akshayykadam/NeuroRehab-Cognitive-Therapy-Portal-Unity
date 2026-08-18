/**
 * Game Module: Spot the Difference (Clinical Version)
 */
(function() {
    class OddOneOutGame {
        constructor() {
            this.container = null;
            this.gameCtx = null;
            this.activeLevel = 1;
            
            this.round = 1;
            this.maxRounds = 5;
            this.score = 0;
            this.lives = 3;
            this.timeLeft = 50; // Increased timer for clinical pace
            
            this.oddIndex = 0;
            this.gridSize = 9;
            
            this.timerInterval = null;
        }

        init(container, gameCtx) {
            this.container = container;
            this.gameCtx = gameCtx;
            this.activeLevel = gameCtx.level;
            
            this.score = 0;
            this.lives = 3;
            this.round = 1;
            this.timeLeft = 50;
            this.maxRounds = 5;

            // Grid size: 3x3 (9) for L1-L3, 4x3 (12) for L4-L7, 4x4 (16) for L8+
            this.gridSize = this.activeLevel >= 8 ? 16 : (this.activeLevel >= 4 ? 12 : 9);

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
            this.oddIndex = Math.floor(Math.random() * this.gridSize);
            const itemsData = this.generateItemsForLevel();
            const cols = this.gridSize === 9 ? 3 : 4;

            this.container.innerHTML = `
                <div class="recall-container" style="gap:1rem;">
                    <div class="recall-prompt" style="font-size:0.95rem; text-transform:uppercase; color:rgba(226,232,240,0.6);">
                        ${window.t('T254', { round: this.round, max: this.maxRounds })}
                    </div>
                    <div class="odd-board" id="odd-board" style="
                        grid-template-columns: repeat(${cols}, 1fr);
                        width: ${cols * 105}px;
                    "></div>
                </div>
            `;

            const board = document.getElementById("odd-board");
            itemsData.forEach((data, index) => {
                const button = document.createElement("div");
                button.className = "odd-item";
                button.style.borderColor = data.color + "40";
                
                const canvas = document.createElement("canvas");
                canvas.width = 80;
                canvas.height = 80;
                button.appendChild(canvas);
                
                this.drawItem(canvas, data);

                button.addEventListener("click", () => {
                    this.handleSelection(index, button);
                });

                board.appendChild(button);
            });
        }

        generateItemsForLevel() {
            const list = [];
            
            const anomalyIndex = ((this.activeLevel - 1) % 5) + 1;
            
            if (anomalyIndex === 1) {
                // Shape anomaly (e.g. circle among squares)
                const normalType = Math.random() > 0.5 ? "circle" : "triangle";
                const oddType = normalType === "circle" ? "square" : "circle";
                for (let i = 0; i < this.gridSize; i++) {
                    list.push({ type: i === this.oddIndex ? oddType : normalType, color: "#0984e3" });
                }
            } 
            else if (anomalyIndex === 2) {
                // Polygon edges count
                const sides = Math.random() > 0.5 ? 6 : 5;
                const oddSides = sides === 6 ? 5 : 6;
                for (let i = 0; i < this.gridSize; i++) {
                    list.push({ type: "polygon", sides: i === this.oddIndex ? oddSides : sides, color: "#10ac84" });
                }
            } 
            else if (anomalyIndex === 3) {
                // Rotation (e.g. arrow straight up and 1 tilted 45 deg)
                const baseAngle = 0; // vertical arrow
                const oddAngle = Math.PI / 4; // tilted 45 degrees
                for (let i = 0; i < this.gridSize; i++) {
                    list.push({ type: "arrow", angle: i === this.oddIndex ? oddAngle : baseAngle, color: "#2ed573" });
                }
            } 
            else if (anomalyIndex === 4) {
                // Lightness shade anomaly: shade contrast difference scales down, min 10%
                const hue = 200; // Blue shade
                const sat = 85;
                const normalLight = 58;
                const diff = Math.max(10, 22 - Math.floor((this.activeLevel - 1) / 5) * 3);
                const oddLight = normalLight - diff;
                
                const normalColor = `hsl(${hue}, ${sat}%, ${normalLight}%)`;
                const oddColor = `hsl(${hue}, ${sat}%, ${oddLight}%)`;
                for (let i = 0; i < this.gridSize; i++) {
                    list.push({ type: "circle", color: i === this.oddIndex ? oddColor : normalColor });
                }
            } 
            else if (anomalyIndex === 5) {
                // Logical anomaly (Prime vs. Composites)
                const primes = [3, 5, 7, 11, 13, 17, 19, 23];
                const composites = [4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20];
                
                const oddIsPrime = Math.random() > 0.5;
                const poolNormal = oddIsPrime ? composites : primes;
                const poolOdd = oddIsPrime ? primes : composites;

                const pickedNormals = [...poolNormal].sort(() => Math.random() - 0.5).slice(0, this.gridSize);
                const pickedOdd = poolOdd[Math.floor(Math.random() * poolOdd.length)];

                for (let i = 0; i < this.gridSize; i++) {
                    list.push({ 
                        type: "number", 
                        value: i === this.oddIndex ? pickedOdd : pickedNormals[i], 
                        color: "#ff9f43" 
                    });
                }
            }
            return list;
        }

        drawItem(canvas, data) {
            const ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.lineWidth = 3;
            ctx.strokeStyle = data.color;
            ctx.fillStyle = data.color;
            ctx.shadowColor = data.color;
            ctx.shadowBlur = 6;

            const cx = canvas.width / 2;
            const cy = canvas.height / 2;

            if (data.type === "circle") {
                ctx.beginPath();
                ctx.arc(cx, cy, 22, 0, Math.PI * 2);
                ctx.stroke();
            } 
            else if (data.type === "square") {
                ctx.beginPath();
                ctx.rect(cx - 20, cy - 20, 40, 40);
                ctx.stroke();
            } 
            else if (data.type === "triangle") {
                ctx.beginPath();
                ctx.moveTo(cx, cy - 22);
                ctx.lineTo(cx + 22, cy + 18);
                ctx.lineTo(cx - 22, cy + 18);
                ctx.closePath();
                ctx.stroke();
            } 
            else if (data.type === "polygon") {
                ctx.beginPath();
                const radius = 22;
                const sides = data.sides;
                for (let i = 0; i < sides; i++) {
                    const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
                    const x = cx + Math.cos(angle) * radius;
                    const y = cy + Math.sin(angle) * radius;
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.closePath();
                ctx.stroke();
            } 
            else if (data.type === "arrow") {
                ctx.save();
                ctx.translate(cx, cy);
                ctx.rotate(data.angle);
                ctx.beginPath();
                ctx.moveTo(0, -22);
                ctx.lineTo(15, -4);
                ctx.lineTo(6, -4);
                ctx.lineTo(6, 20);
                ctx.lineTo(-6, 20);
                ctx.lineTo(-6, -4);
                ctx.lineTo(-15, -4);
                ctx.closePath();
                ctx.stroke();
                ctx.restore();
            } 
            else if (data.type === "number") {
                ctx.font = "bold 26px 'Outfit'";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(data.value, cx, cy);
            }
        }

        handleSelection(selectedIndex, element) {
            const isCorrect = selectedIndex === this.oddIndex;

            // Draw clean overlay feedback on canvas
            const canvas = element.querySelector("canvas");
            if (canvas) {
                const ctx = canvas.getContext("2d");
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.font = "bold 50px 'Outfit'";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.shadowBlur = 0;
                if (isCorrect) {
                    ctx.fillStyle = "#34d399";
                    ctx.fillText("✓", canvas.width / 2, canvas.height / 2);
                } else {
                    ctx.fillStyle = "#f87171";
                    ctx.fillText("✗", canvas.width / 2, canvas.height / 2);
                }
            }

            if (isCorrect) {
                this.gameCtx.playSound('success');
                element.style.borderColor = "#10b981";
                element.style.background = "linear-gradient(135deg, #064e3b, #065f46)";
                
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
                element.style.borderColor = "#ef4444";
                element.style.background = "linear-gradient(135deg, #450a0a, #7f1d1d)";
                
                this.lives--;
                this.gameCtx.setLives(this.lives);

                setTimeout(() => {
                    if (this.lives <= 0) {
                        clearInterval(this.timerInterval);
                        this.gameCtx.onLose(this.score);
                    } else {
                        this.generateRound();
                    }
                }, 800);
            }
        }

        triggerWin() {
            if (this.timerInterval) clearInterval(this.timerInterval);
            
            const timeBonus = this.timeLeft * 10;
            const finalScore = this.score + timeBonus + (this.lives * 150);
            const xp = 100;
            
            this.gameCtx.onWin(finalScore, xp);
        }

        destroy() {
            if (this.timerInterval) clearInterval(this.timerInterval);
        }
    }

    window.Games = window.Games || {};
    window.Games.odd_one_out = new OddOneOutGame();
})();
