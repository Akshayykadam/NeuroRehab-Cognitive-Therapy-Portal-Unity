/**
 * Game Module: Catching Exercise (Clinical Version)
 */
(function() {
    class FallingCatcherGame {
        constructor() {
            this.container = null;
            this.gameCtx = null;
            this.canvas = null;
            this.ctx2d = null;
            this.activeLevel = 1;

            this.score = 0;
            this.lives = 3;
            this.timeLeft = 30;
            
            // Wider paddle for motor safety
            this.paddle = { x: 400, width: 140, height: 18 };
            this.items = [];
            this.windForce = 0; 
            this.gravity = 1.6; // Slower falling gravity
            
            this.timerInterval = null;
            this.animationFrameId = null;
            this.handlers = {};
            // ponytail: cached gradients — built once in init(), reused every draw()
            this._bgGrad = null;
            this._padGrad = null;
        }

        init(container, gameCtx) {
            this.container = container;
            this.gameCtx = gameCtx;
            this.activeLevel = gameCtx.level;
            
            this.score = 0;
            this.lives = 3;
            this.timeLeft = 30;
            this.items = [];
            
            // Adjusted paddle width to scale asymptotically: L1: 140px, min 70px
            this.paddle.width = Math.max(70, 150 - Math.min(80, this.activeLevel * 8));
            this.gravity = 0.5 + Math.min(2.0, this.activeLevel * 0.2); // Slower initial gravity for acceleration curves
            this.windForce = 0;
            
            this.gameCtx.setScore(this.score);
            this.gameCtx.setLives(this.lives);

            container.innerHTML = `
                <div class="canvas-game-container" style="flex-direction: column;">
                    <div class="trace-guide-overlay" id="wind-banner" style="top: 3%; right: 3%; font-size:0.8rem; font-weight:700; color:rgba(226,232,240,0.6);">
                        WIND: CALM
                    </div>
                    <canvas id="catcher-canvas" width="800" height="460"></canvas>
                </div>
            `;

            this.canvas = document.getElementById("catcher-canvas");
            this.ctx2d = this.canvas.getContext("2d");

            // Set up High-DPI Retina Canvas (cap to 1.0 inside Unity WebView to avoid rendering performance drop on Retina displays)
            const isUnity = window.location.search.indexOf('unity=true') > -1;
            const dpr = isUnity ? 1.0 : (window.devicePixelRatio || 1);
            const logicalWidth = 800;
            const logicalHeight = 460;
            this.canvas.width = logicalWidth * dpr;
            this.canvas.height = logicalHeight * dpr;
            this.canvas.style.width = `${logicalWidth}px`;
            this.canvas.style.height = `${logicalHeight}px`;
            this.ctx2d.scale(dpr, dpr);

            // ponytail: cache gradients once instead of creating 60/sec
            this._bgGrad = this.ctx2d.createLinearGradient(0, 0, 0, 460);
            this._bgGrad.addColorStop(0, "#f0f9ff");
            this._bgGrad.addColorStop(0.4, "#e0f2fe");
            this._bgGrad.addColorStop(0.7, "#bae6fd");
            this._bgGrad.addColorStop(1, "#bae6fd");

            this._padGrad = this.ctx2d.createLinearGradient(0, 460 - 40, 0, 460 - 40 + this.paddle.height);
            this._padGrad.addColorStop(0, "#60a5fa");
            this._padGrad.addColorStop(0.3, "#3b82f6");
            this._padGrad.addColorStop(0.7, "#2563eb");
            this._padGrad.addColorStop(1, "#1d4ed8");

            this.paddle.x = 400;

            this.startTimer();
            this.bindInput();
            this.gameLoop();
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
                
                // Milder wind drift forces
                if (this.activeLevel >= 4) {
                    if (this.timeLeft % 8 === 0) {
                        const directions = [-0.8, -0.4, 0, 0.4, 0.8];
                        this.windForce = directions[Math.floor(Math.random() * directions.length)];
                        
                        const windBanner = document.getElementById("wind-banner");
                        if (windBanner) {
                            if (this.windForce < 0) {
                                windBanner.innerText = window.t('T392');
                                windBanner.style.color = "#60a5fa";
                            } else if (this.windForce > 0) {
                                windBanner.innerText = window.t('T393');
                                windBanner.style.color = "#2dd4bf";
                            } else {
                                windBanner.innerText = window.t('T391');
                                windBanner.style.color = "rgba(226,232,240,0.6)";
                            }
                        }
                        this.gameCtx.playSound('match');
                    }
                }

                if (this.timeLeft <= 5 && this.timeLeft > 0) {
                    this.gameCtx.playSound('tick');
                }
                if (this.timeLeft <= 0) {
                    clearInterval(this.timerInterval);
                    
                    // Supportive target criteria
                    const targetScore = 300 + this.activeLevel * 200; // L1: 500, L5: 1300
                    if (this.score >= targetScore) {
                        const xp = 100;
                        this.gameCtx.onWin(this.score, xp);
                    } else {
                        this.gameCtx.onLose(this.score);
                    }
                }
            }, 1000);
        }

        bindInput() {
            const updatePaddleX = (clientX) => {
                const rect = this.canvas.getBoundingClientRect();
                const scaleX = 800 / rect.width;
                const canvasX = (clientX - rect.left) * scaleX;
                
                this.paddle.x = Math.max(this.paddle.width / 2, Math.min(800 - this.paddle.width / 2, canvasX));
            };

            const onMouseMove = (e) => {
                updatePaddleX(e.clientX);
            };

            const onTouchMove = (e) => {
                if (e.touches.length > 0) {
                    updatePaddleX(e.touches[0].clientX);
                }
            };

            this.canvas.addEventListener("mousemove", onMouseMove);
            this.canvas.addEventListener("touchmove", onTouchMove, { passive: true });
            
            this.handlers = { mousemove: onMouseMove, touchmove: onTouchMove };
        }

        spawnItem() {
            const rand = Math.random();
            let type = "gem";
            let color = "#2e7d32"; // Forest Green
            
            if (this.activeLevel >= 2) {
                // Reduced obstacle spawn rate (20% instead of 28%)
                if (rand < 0.20) {
                    type = "bomb";
                    color = "#d97706"; // Clinical Orange
                } else if (rand > 0.90) {
                    type = "supergem";
                    color = "#1b52a4"; // Clinical Blue
                }
            } else {
                if (rand > 0.92) {
                    type = "supergem";
                    color = "#1b52a4"; // Clinical Blue
                }
            }

            this.items.push({
                x: Math.random() * (800 - 60) + 30,
                y: -20,
                vx: (Math.random() - 0.5) * 1.5, // light initial drift
                vy: this.gravity, // initial falling speed
                type: type,
                color: color,
                radius: type === "supergem" ? 15 : (type === "bomb" ? 14 : 12)
            });
        }

        gameLoop() {
            if (!this.canvas) return;
            this.update();
            this.draw();
            this.animationFrameId = requestAnimationFrame(() => this.gameLoop());
        }

        update() {
            const spawnChance = 0.016 + this.activeLevel * 0.003; 
            if (Math.random() < spawnChance && this.items.length < 8) { // Fewer items on screen at once
                this.spawnItem();
            }

            const paddleTop = 460 - 40;
            const paddleBottom = paddleTop + this.paddle.height;
            const gravityAccel = 0.05 + Math.min(0.08, this.activeLevel * 0.012);

            for (let i = this.items.length - 1; i >= 0; i--) {
                const item = this.items[i];
                
                // 1. Gravity acceleration
                item.vy += gravityAccel;
                // 2. Continuous Wind acceleration & drag
                item.vx += this.windForce * 0.12;
                item.vx *= 0.97; // Horizontal drag
                
                item.x += item.vx;
                item.y += item.vy;

                // Soft wall boundaries check (bounces balls back)
                if (item.x - item.radius < 0) {
                    item.x = item.radius;
                    item.vx *= -0.7;
                }
                if (item.x + item.radius > 800) {
                    item.x = 800 - item.radius;
                    item.vx *= -0.7;
                }

                const isIntersectingY = item.y + item.radius >= paddleTop && item.y - item.radius <= paddleBottom;
                const isIntersectingX = item.x + item.radius >= this.paddle.x - this.paddle.width / 2 && 
                                        item.x - item.radius <= this.paddle.x + this.paddle.width / 2;

                if (isIntersectingY && isIntersectingX) {
                    this.items.splice(i, 1);
                    this.handleCollection(item.type);
                    continue;
                }

                if (item.y - item.radius > 460) {
                    this.items.splice(i, 1);
                }
            }

            // 3. Mid-air ball-to-ball elastic collisions
            for (let i = 0; i < this.items.length; i++) {
                const item1 = this.items[i];
                for (let j = i + 1; j < this.items.length; j++) {
                    const item2 = this.items[j];
                    
                    const dx = item2.x - item1.x;
                    const dy = item2.y - item1.y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    const minDist = item1.radius + item2.radius;
                    
                    if (dist < minDist) {
                        // Push apart along contact normal
                        const overlap = minDist - dist;
                        const nx = dx / (dist || 1);
                        const ny = dy / (dist || 1);
                        
                        item1.x -= nx * overlap * 0.5;
                        item1.y -= ny * overlap * 0.5;
                        item2.x += nx * overlap * 0.5;
                        item2.y += ny * overlap * 0.5;
                        
                        // Elastic collision velocity reflection
                        const rvx = item1.vx - item2.vx;
                        const rvy = item1.vy - item2.vy;
                        const velAlongNormal = rvx * nx + rvy * ny;
                        
                        if (velAlongNormal > 0) {
                            item1.vx -= velAlongNormal * nx;
                            item1.vy -= velAlongNormal * ny;
                            item2.vx += velAlongNormal * nx;
                            item2.vy += velAlongNormal * ny;
                        }
                    }
                }
            }
        }

        handleCollection(type) {
            if (type === "gem") {
                this.gameCtx.playSound('click');
                this.score += 100;
                this.gameCtx.setScore(this.score);
            } else if (type === "supergem") {
                this.gameCtx.playSound('success');
                this.score += 200;
                this.gameCtx.setScore(this.score);
            } else if (type === "bomb") {
                this.gameCtx.playSound('error');
                this.lives--;
                this.gameCtx.setLives(this.lives);

                if (this.canvas) this.canvas.style.transform = "translateY(5px)";
                setTimeout(() => {
                    if (this.canvas) this.canvas.style.transform = "translateY(-5px)";
                }, 50);
                setTimeout(() => {
                    if (this.canvas) this.canvas.style.transform = "none";
                }, 100);

                if (this.lives <= 0) {
                    clearInterval(this.timerInterval);
                    this.gameCtx.onLose(this.score);
                }
            }
        }

        draw() {
            // ponytail: cached background gradient, no per-frame allocation
            this.ctx2d.fillStyle = this._bgGrad;
            this.ctx2d.fillRect(0, 0, 800, 460);
            
            // ponytail: reduced sparkles from 40→15, same visual feel
            const t = Date.now() / 1000;
            for (let i = 0; i < 15; i++) {
                const sx = (i * 137.5) % 800;
                const sy = (i * 89.3) % 400;
                const twinkle = Math.sin(t * 2 + i * 0.7) * 0.4 + 0.5;
                const starSize = (i % 3 === 0) ? 2 : 1;
                this.ctx2d.beginPath();
                this.ctx2d.arc(sx, sy, starSize, 0, Math.PI * 2);
                this.ctx2d.fillStyle = `rgba(14, 165, 233, ${twinkle * 0.25})`;
                this.ctx2d.fill();
            }

            // Draw falling items — ponytail: replaced shadowBlur with simple aura circle (same look, no Gaussian blur GPU cost)
            this.items.forEach(item => {
                this.ctx2d.save();
                
                // Outer aura glow (simple circle, no shadowBlur)
                this.ctx2d.beginPath();
                this.ctx2d.arc(item.x, item.y, item.radius + 6, 0, Math.PI * 2);
                if (item.type === "bomb") {
                    this.ctx2d.fillStyle = "rgba(239, 68, 68, 0.08)";
                } else if (item.type === "supergem") {
                    this.ctx2d.fillStyle = "rgba(59, 130, 246, 0.10)";
                } else {
                    this.ctx2d.fillStyle = "rgba(16, 185, 129, 0.08)";
                }
                this.ctx2d.fill();
                
                // Main jewel body with radial gradient
                this.ctx2d.beginPath();
                this.ctx2d.arc(item.x, item.y, item.radius, 0, Math.PI * 2);
                
                // ponytail: gradient per item is unavoidable (position-dependent), but killed shadowBlur
                const grad = this.ctx2d.createRadialGradient(
                    item.x - item.radius * 0.3, item.y - item.radius * 0.3, 0,
                    item.x, item.y, item.radius * 1.2
                );
                if (item.type === "supergem") {
                    grad.addColorStop(0, "#93c5fd");
                    grad.addColorStop(0.5, "#3b82f6");
                    grad.addColorStop(1, "#1d4ed8");
                } else if (item.type === "bomb") {
                    grad.addColorStop(0, "#fca5a5");
                    grad.addColorStop(0.5, "#ef4444");
                    grad.addColorStop(1, "#b91c1c");
                } else {
                    grad.addColorStop(0, "#6ee7b7");
                    grad.addColorStop(0.5, "#10b981");
                    grad.addColorStop(1, "#047857");
                }
                
                this.ctx2d.fillStyle = grad;
                this.ctx2d.fill();
                
                // Darker edge outline for high contrast
                this.ctx2d.strokeStyle = "rgba(15, 23, 42, 0.12)";
                this.ctx2d.lineWidth = 1.2;
                this.ctx2d.stroke();
                
                // Inner shine highlight
                this.ctx2d.beginPath();
                this.ctx2d.arc(item.x - item.radius * 0.25, item.y - item.radius * 0.25, item.radius * 0.35, 0, Math.PI * 2);
                this.ctx2d.fillStyle = "rgba(255, 255, 255, 0.4)";
                this.ctx2d.fill();

                // Cross detail on bombs
                if (item.type === "bomb") {
                    this.ctx2d.beginPath();
                    this.ctx2d.moveTo(item.x - 5, item.y - 5);
                    this.ctx2d.lineTo(item.x + 5, item.y + 5);
                    this.ctx2d.moveTo(item.x + 5, item.y - 5);
                    this.ctx2d.lineTo(item.x - 5, item.y + 5);
                    this.ctx2d.strokeStyle = "rgba(255, 255, 255, 0.75)";
                    this.ctx2d.lineWidth = 2;
                    this.ctx2d.stroke();
                }
                
                this.ctx2d.restore();
            });

            // Chrome blue metallic paddle — ponytail: cached gradient, no shadowBlur
            const py = 460 - 40;
            const px = this.paddle.x - this.paddle.width / 2;
            
            this.ctx2d.beginPath();
            this.ctx2d.roundRect(px, py, this.paddle.width, this.paddle.height, 9);
            this.ctx2d.fillStyle = this._padGrad;
            this.ctx2d.fill();
            
            // Paddle edge outline
            this.ctx2d.strokeStyle = "rgba(15, 23, 42, 0.15)";
            this.ctx2d.lineWidth = 1.5;
            this.ctx2d.stroke();

            // Inner highlight stripe
            this.ctx2d.beginPath();
            this.ctx2d.roundRect(px + 4, py + 3, this.paddle.width - 8, 4, 2);
            this.ctx2d.fillStyle = "rgba(255, 255, 255, 0.3)";
            this.ctx2d.fill();
            
            // Center notch
            this.ctx2d.beginPath();
            this.ctx2d.roundRect(this.paddle.x - 2, py + 4, 4, this.paddle.height - 8, 2);
            this.ctx2d.fillStyle = "rgba(255, 255, 255, 0.15)";
            this.ctx2d.fill();
        }

        destroy() {
            if (this.canvas) {
                this.canvas.removeEventListener("mousemove", this.handlers.mousemove);
                this.canvas.removeEventListener("touchmove", this.handlers.touchmove);
            }
            if (this.timerInterval) clearInterval(this.timerInterval);
            if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);

            this.canvas = null;
            this.ctx2d = null;
            this._bgGrad = null;
            this._padGrad = null;
        }
    }

    window.Games = window.Games || {};
    window.Games.falling_catcher = new FallingCatcherGame();
})();
