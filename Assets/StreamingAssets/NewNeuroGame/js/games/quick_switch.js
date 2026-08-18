/**
 * Game Module: Quick Switch (Trail Making Test - Alternating Attention)
 */
(function() {
    const SEQUENCE_ITEMS = [
        { label: "1", val: 1, type: "num" },
        { label: "A", val: 2, type: "let" },
        { label: "2", val: 3, type: "num" },
        { label: "B", val: 4, type: "let" },
        { label: "3", val: 5, type: "num" },
        { label: "C", val: 6, type: "let" },
        { label: "4", val: 7, type: "num" },
        { label: "D", val: 8, type: "let" },
        { label: "5", val: 9, type: "num" },
        { label: "E", val: 10, type: "let" },
        { label: "6", val: 11, type: "num" },
        { label: "F", val: 12, type: "let" },
        { label: "7", val: 13, type: "num" },
        { label: "G", val: 14, type: "let" },
        { label: "8", val: 15, type: "num" },
        { label: "H", val: 16, type: "let" }
    ];

    class QuickSwitchGame {
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
            this.nodes = [];
            this.sequence = [];
            this.targetIdx = 0;
            this.lastClickedNode = null;
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
                <div class="qs-container">
                    <div class="qs-prompt" id="qs-prompt">
                        ${window.t('T394')}
                    </div>
                    
                    <div class="qs-field" id="qs-field">
                        <svg class="qs-svg" id="qs-svg"></svg>
                        <!-- Nodes populated dynamically -->
                    </div>

                    <div class="word-score-tracker" id="qs-dots">
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

            const field = document.getElementById("qs-field");
            const svg = document.getElementById("qs-svg");
            
            // Clear existing SVG and nodes
            svg.innerHTML = "";
            const oldCircles = field.querySelectorAll(".qs-circle");
            oldCircles.forEach(c => c.remove());

            this.nodes = [];
            this.targetIdx = 0;
            this.lastClickedNode = null;

            // Determine sequence length based on level
            // L1-L3: 6 items (1 to C)
            // L4-L7: 8 items (1 to D)
            // L8-L12: 10 items (1 to E)
            // L13+: 12 items (1 to F)
            let itemCount = 6;
            if (this.activeLevel >= 13) itemCount = 12;
            else if (this.activeLevel >= 8) itemCount = 10;
            else if (this.activeLevel >= 4) itemCount = 8;

            this.sequence = SEQUENCE_ITEMS.slice(0, itemCount);
            this.updatePrompt();

            const fieldWidth = field.offsetWidth || 780;
            const fieldHeight = field.offsetHeight || 385;

            // To avoid overlapping, distribute in a non-overlapping grid layout
            // Column/Row setup based on itemCount
            let cols = 3;
            let rows = 2;
            if (itemCount === 8) { cols = 4; rows = 2; }
            else if (itemCount === 10) { cols = 5; rows = 2; }
            else if (itemCount === 12) { cols = 4; rows = 3; }

            const colWidth = fieldWidth / cols;
            const rowHeight = fieldHeight / rows;

            // Generate cell indices and shuffle them
            const cells = [];
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    cells.push({ row: r, col: c });
                }
            }
            cells.sort(() => Math.random() - 0.5);

            this.sequence.forEach((item, idx) => {
                const cell = cells[idx];
                const circleRadius = 28; // 56px diameter

                // Position node inside cell with randomized padding jitter
                const minX = cell.col * colWidth + 20;
                const maxX = (cell.col + 1) * colWidth - 20 - circleRadius * 2;
                const minY = cell.row * rowHeight + 20;
                const maxY = (cell.row + 1) * rowHeight - 20 - circleRadius * 2;

                const x = minX + Math.random() * (maxX - minX);
                const y = minY + Math.random() * (maxY - minY);

                const el = document.createElement("div");
                el.className = "qs-circle";
                el.innerText = item.label;

                // Color themes matching type
                const color = (item.type === "num") ? "#0d9488" : "#2563eb";
                el.style.borderColor = color + "60";
                el.style.color = color;
                el.style.boxShadow = `0 4px 12px rgba(15, 23, 42, 0.05), inset 0 0 12px ${color}0a`;

                el.style.left = `${x}px`;
                el.style.top = `${y}px`;

                field.appendChild(el);

                const node = {
                    element: el,
                    item: item,
                    idx: idx,
                    x: x + circleRadius,
                    y: y + circleRadius
                };

                el.addEventListener("click", () => this.handleNodeClick(node));
                this.nodes.push(node);
            });
        }

        handleNodeClick(node) {
            this.gameCtx.playSound('click');

            if (node.idx === this.targetIdx) {
                // Correct node
                node.element.classList.add("correct-anim");
                node.element.style.borderColor = "#10b981";
                node.element.style.color = "#ffffff";
                node.element.style.background = "#10b981";
                
                // Draw connecting line if not first
                if (this.lastClickedNode) {
                    this.drawLine(this.lastClickedNode, node);
                }

                this.lastClickedNode = node;
                this.targetIdx++;
                this.score += 50;
                this.gameCtx.setScore(this.score);
                this.updatePrompt();

                // Check if sequence is complete
                if (this.targetIdx >= this.sequence.length) {
                    this.gameCtx.playSound('success');
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
                // Ignore click if already clicked
                if (node.idx < this.targetIdx) return;

                // Wrong node click
                this.gameCtx.playSound('error');
                node.element.classList.add("wrong-anim");
                this.lives--;
                this.gameCtx.setLives(this.lives);

                setTimeout(() => {
                    node.element.classList.remove("wrong-anim");
                    if (this.lives <= 0) {
                        clearInterval(this.timerInterval);
                        this.gameCtx.onLose(this.score);
                    }
                }, 500);
            }
        }

        drawLine(nodeA, nodeB) {
            const svg = document.getElementById("qs-svg");
            if (!svg) return;

            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", nodeA.x);
            line.setAttribute("y1", nodeA.y);
            line.setAttribute("x2", nodeB.x);
            line.setAttribute("y2", nodeB.y);
            line.setAttribute("stroke", "#10b981");
            line.setAttribute("stroke-width", "3");
            line.setAttribute("stroke-linecap", "round");
            line.setAttribute("stroke-dasharray", "1000");
            line.setAttribute("stroke-dashoffset", "1000");

            // Animation for drawing line
            svg.appendChild(line);

            // Trigger reflow to run transition
            line.getBoundingClientRect();
            line.setAttribute("stroke-dashoffset", "0");
            line.style.transition = "stroke-dashoffset 0.4s ease-out";
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

        updatePrompt() {
            const nextItem = this.sequence[this.targetIdx];
            const promptEl = document.getElementById("qs-prompt");
            if (promptEl && nextItem) {
                promptEl.innerHTML = window.t('T395', { target: nextItem.label }).replace('{target}', `<span class="qs-target-highlight">${nextItem.label}</span>`);
            }
        }
    }

    window.Games = window.Games || {};
    window.Games.quick_switch = new QuickSwitchGame();
})();
