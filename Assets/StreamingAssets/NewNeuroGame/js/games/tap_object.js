/**
 * Game Module: Selective Focus (Visual Attention Game - Clinical Version)
 */
(function() {
    const SHAPE_TYPES = ["circle", "square", "triangle", "star"];
    const COLOR_CLASSES = [
        { name: "Blue", hex: "#1b52a4", grad: "#74b9ff" },
        { name: "Teal", hex: "#0d8a94", grad: "#34e7e4" },
        { name: "Green", hex: "#1e7e34", grad: "#58b16a" },
        { name: "Orange", hex: "#d97706", grad: "#ffc048" }
    ];

    class TapObjectGame {
        constructor() {
            this.container = null;
            this.gameCtx = null;
            this.canvas = null;
            this.ctx2d = null;
            this.activeLevel = 1;

            this.shapes = [];
            this.targetRule = { type: "", color: null };
            this.score = 0;
            this.lives = 3;
            this.timeLeft = 30;
            
            this.timerInterval = null;
            this.ruleShiftInterval = null;
            this.animationFrameId = null;
            this.handlers = {};
            // ponytail: cached gradient
            this._bgGrad = null;
        }

        init(container, gameCtx) {
            this.container = container;
            this.gameCtx = gameCtx;
            this.activeLevel = gameCtx.level;
            
            this.score = 0;
            this.lives = 3;
            this.timeLeft = 30;
            this.shapes = [];

            this.gameCtx.setScore(this.score);
            this.gameCtx.setLives(this.lives);

            container.innerHTML = `
                <div class="canvas-game-container" style="flex-direction: column;">
                    <div class="trace-guide-overlay" id="tap-rule-banner" style="top: 3%; right: auto; font-size:1.15rem; font-weight:700; color:var(--text-main); padding: 0.6rem 2rem;">
                        ${window.t('T245')} <span id="tap-rule-text">...</span>
                    </div>
                    <canvas id="tap-canvas" width="800" height="460"></canvas>
                </div>
            `;
            
            this.canvas = document.getElementById("tap-canvas");
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

            // ponytail: cache background gradient once
            this._bgGrad = this.ctx2d.createLinearGradient(0, 0, 800, 460);
            this._bgGrad.addColorStop(0, "#f8fafc");
            this._bgGrad.addColorStop(0.4, "#f1f5f9");
            this._bgGrad.addColorStop(0.7, "#eef2f7");
            this._bgGrad.addColorStop(1, "#f1f5f9");

            this.spawnInitialShapes();
            this.setRandomTargetRule();
            this.startTimers();
            this.bindInput();
            this.gameLoop();
        }

        spawnInitialShapes() {
            // Reduced count for clinical focus
            const count = 10 + this.activeLevel * 2; 
            for (let i = 0; i < count; i++) {
                this.shapes.push(this.generateRandomShape());
            }
        }

        generateRandomShape() {
            const type = SHAPE_TYPES[Math.floor(Math.random() * SHAPE_TYPES.length)];
            const color = COLOR_CLASSES[Math.floor(Math.random() * COLOR_CLASSES.length)];
            const size = 22 + Math.random() * 8; // Supportive tap targets
            
            let x = 0, y = 0;
            let attempts = 0;
            let overlapping = true;
            
            // Loop to guarantee no overlapping coordinates on spawn
            while (overlapping && attempts < 50) {
                x = size + 20 + Math.random() * (800 - size * 2 - 40);
                y = size + 20 + Math.random() * (460 - size * 2 - 40);
                overlapping = false;
                
                for (const other of this.shapes) {
                    const dist = Math.sqrt((other.x - x)**2 + (other.y - y)**2);
                    if (dist < (size + other.size + 30)) {
                        overlapping = true;
                        break;
                    }
                }
                attempts++;
            }
            
            // Speed scaling with safety bounds
            const speedFactor = 0.4 + this.activeLevel * 0.2; 
            const angle = Math.random() * Math.PI * 2;
            const vx = Math.cos(angle) * speedFactor;
            const vy = Math.sin(angle) * speedFactor;

            return { type, color, size, x, y, vx, vy, isPopping: false, popTimer: 0 };
        }

        setRandomTargetRule() {
            const randomShape = this.shapes[Math.floor(Math.random() * this.shapes.length)];
            this.targetRule = {
                type: randomShape ? randomShape.type : SHAPE_TYPES[0],
                color: randomShape ? randomShape.color : COLOR_CLASSES[0]
            };

            const textEl = document.getElementById("tap-rule-text");
            if (textEl) {
                const shapeKey = { circle: 'T246', square: 'T247', triangle: 'T248', star: 'T249' }[this.targetRule.type] || 'T246';
                textEl.innerText = window.t('T250', { color: this.targetRule.color.name.toUpperCase(), type: window.t(shapeKey) });
                textEl.style.color = this.targetRule.color.hex;
            }
        }

        startTimers() {
            const updateTimerDisplay = () => {
                const mm = Math.floor(this.timeLeft / 60).toString().padStart(2, '0');
                const ss = (this.timeLeft % 60).toString().padStart(2, '0');
                this.gameCtx.setTimer(`${mm}:${ss}`);
            };
            
            updateTimerDisplay();
            this.timerInterval = setInterval(() => {
                this.timeLeft--;
                updateTimerDisplay();
                if (this.timeLeft <= 0) {
                    clearInterval(this.timerInterval);
                    if (this.ruleShiftInterval) clearInterval(this.ruleShiftInterval);
                    
                    const targetScore = 200 + this.activeLevel * 100;
                    if (this.score >= targetScore) {
                        const xp = 100;
                        this.gameCtx.onWin(this.score, xp);
                    } else {
                        this.gameCtx.onLose(this.score);
                    }
                }
            }, 1000);

            // Shifting rules at a slower, supportive rate
            if (this.activeLevel >= 3) {
                const intervalSecs = this.activeLevel === 3 ? 16 : (this.activeLevel === 4 ? 13 : 10);
                this.ruleShiftInterval = setInterval(() => {
                    this.gameCtx.playSound('match');
                    this.setRandomTargetRule();
                }, intervalSecs * 1000);
            }
        }

        bindInput() {
            const onCanvasClick = (e) => {
                const rect = this.canvas.getBoundingClientRect();
                const scaleX = 800 / rect.width;
                const scaleY = 460 / rect.height;
                const clickX = (e.clientX - rect.left) * scaleX;
                const clickY = (e.clientY - rect.top) * scaleY;

                let hitIndex = -1;
                for (let i = this.shapes.length - 1; i >= 0; i--) {
                    const s = this.shapes[i];
                    if (s.isPopping) continue;
                    const dist = Math.sqrt((s.x - clickX)**2 + (s.y - clickY)**2);
                    if (dist <= s.size + 15) { // Generous pointer hit target size
                        hitIndex = i;
                        break;
                    }
                }

                if (hitIndex !== -1) {
                    const hitShape = this.shapes[hitIndex];
                    const isCorrect = hitShape.type === this.targetRule.type && hitShape.color.name === this.targetRule.color.name;
                    
                    if (isCorrect) {
                        this.gameCtx.playSound('click');
                        hitShape.isPopping = true;
                        this.score += 100;
                        this.gameCtx.setScore(this.score);
                        
                        setTimeout(() => {
                            this.shapes = this.shapes.filter(s => s !== hitShape);
                            this.shapes.push(this.generateRandomShape());
                            
                            // Check if any matching target shapes remain on the board
                            const hasTargetsLeft = this.shapes.some(
                                s => s.type === this.targetRule.type && s.color.name === this.targetRule.color.name
                            );
                            
                            // If no matching targets exist, immediately pick a new random target rule
                            if (!hasTargetsLeft) {
                                this.setRandomTargetRule();
                            }
                        }, 200);
                    } else {
                        this.gameCtx.playSound('error');
                        this.lives--;
                        this.gameCtx.setLives(this.lives);
                        
                        if (this.canvas) this.canvas.style.transform = "translateX(5px)";
                        setTimeout(() => {
                            if (this.canvas) this.canvas.style.transform = "translateX(-5px)";
                        }, 50);
                        setTimeout(() => {
                            if (this.canvas) this.canvas.style.transform = "none";
                        }, 100);

                        if (this.lives <= 0) {
                            clearInterval(this.timerInterval);
                            if (this.ruleShiftInterval) clearInterval(this.ruleShiftInterval);
                            this.gameCtx.onLose(this.score);
                        }
                    }
                }
            };

            this.canvas.addEventListener("mousedown", onCanvasClick);
            this.handlers.mousedown = onCanvasClick;
        }

        gameLoop() {
            if (!this.canvas) return;
            this.update();
            this.draw();
            this.animationFrameId = requestAnimationFrame(() => this.gameLoop());
        }

        update() {
            // 1. Move shapes and check wall bounds (logical 800x460 bounds)
            this.shapes.forEach(s => {
                if (s.isPopping) {
                    s.popTimer += 0.15;
                    return;
                }
                
                s.x += s.vx;
                s.y += s.vy;
                
                if (s.x - s.size < 0) {
                    s.x = s.size;
                    s.vx *= -1;
                }
                if (s.x + s.size > 800) {
                    s.x = 800 - s.size;
                    s.vx *= -1;
                }
                if (s.y - s.size < 0) {
                    s.y = s.size;
                    s.vy *= -1;
                }
                if (s.y + s.size > 460) {
                    s.y = 460 - s.size;
                    s.vy *= -1;
                }
            });

            // 2. Resolve overlaps and apply circle-to-circle physics reflections
            for (let i = 0; i < this.shapes.length; i++) {
                const s1 = this.shapes[i];
                if (s1.isPopping) continue;
                
                for (let j = i + 1; j < this.shapes.length; j++) {
                    const s2 = this.shapes[j];
                    if (s2.isPopping) continue;
                    
                    const dx = s2.x - s1.x;
                    const dy = s2.y - s1.y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    const minDist = s1.size + s2.size + 20; // safe separation margin
                    
                    if (dist < minDist) {
                        // Push apart along contact normal
                        const overlap = minDist - dist;
                        const nx = dx / (dist || 1);
                        const ny = dy / (dist || 1);
                        
                        s1.x -= nx * overlap * 0.5;
                        s1.y -= ny * overlap * 0.5;
                        s2.x += nx * overlap * 0.5;
                        s2.y += ny * overlap * 0.5;
                        
                        // Relative velocity momentum exchange
                        const rvx = s1.vx - s2.vx;
                        const rvy = s1.vy - s2.vy;
                        const velAlongNormal = rvx * nx + rvy * ny;
                        
                        if (velAlongNormal > 0) {
                            // Perfect elastic bounce
                            s1.vx -= velAlongNormal * nx;
                            s1.vy -= velAlongNormal * ny;
                            s2.vx += velAlongNormal * nx;
                            s2.vy += velAlongNormal * ny;
                        }
                    }
                }
            }
        }

        draw() {
            // ponytail: cached gradient, no per-frame allocation
            this.ctx2d.fillStyle = this._bgGrad;
            this.ctx2d.fillRect(0, 0, 800, 460);
            
            // ponytail: killed the ambient dot grid — was ~300 arc() calls per frame with sin() wobble.
            // The bouncing shapes ARE the visual content.

            // Draw premium shapes — ponytail: replaced shadowBlur with simple under-circle
            this.shapes.forEach(s => {
                this.ctx2d.save();
                this.ctx2d.translate(s.x, s.y);
                
                if (s.isPopping) {
                    const scale = 1.0 + s.popTimer * 1.5;
                    const alpha = Math.max(0, 1.0 - s.popTimer);
                    this.ctx2d.scale(scale, scale);
                    this.ctx2d.globalAlpha = alpha;
                }
 
                // ponytail: simple soft circle shadow instead of shadowBlur (no Gaussian blur GPU cost)
                this.ctx2d.beginPath();
                this.ctx2d.arc(0, 4, s.size + 3, 0, Math.PI * 2);
                this.ctx2d.fillStyle = s.color.hex + "18";
                this.ctx2d.fill();

                // Radial gradient fill
                const grad = this.ctx2d.createRadialGradient(-s.size * 0.3, -s.size * 0.3, 0, 0, 0, s.size * 1.2);
                grad.addColorStop(0, s.color.grad);
                grad.addColorStop(0.6, s.color.hex);
                grad.addColorStop(1, s.color.hex + "cc");
                this.ctx2d.fillStyle = grad;
                
                // Subtle dark outline for high contrast on light backgrounds
                this.ctx2d.strokeStyle = "rgba(15, 23, 42, 0.15)";
                this.ctx2d.lineWidth = 1.5;
                
                this.ctx2d.beginPath();
                
                if (s.type === "circle") {
                    this.ctx2d.arc(0, 0, s.size, 0, Math.PI * 2);
                    this.ctx2d.fill();
                } else if (s.type === "square") {
                    const r = 4;
                    this.ctx2d.roundRect(-s.size, -s.size, s.size * 2, s.size * 2, r);
                    this.ctx2d.fill();
                } else if (s.type === "triangle") {
                    this.ctx2d.moveTo(0, -s.size);
                    this.ctx2d.lineTo(s.size, s.size);
                    this.ctx2d.lineTo(-s.size, s.size);
                    this.ctx2d.closePath();
                    this.ctx2d.fill();
                } else if (s.type === "star") {
                    this.drawStar(0, 0, 5, s.size, s.size / 2.2);
                    this.ctx2d.fill();
                }
                
                this.ctx2d.stroke();
                
                // Inner shine highlight
                if (!s.isPopping) {
                    this.ctx2d.beginPath();
                    this.ctx2d.globalAlpha = 0.3;
                    if (s.type === "circle") {
                        this.ctx2d.arc(-s.size * 0.25, -s.size * 0.25, s.size * 0.4, 0, Math.PI * 2);
                    } else {
                        this.ctx2d.arc(-s.size * 0.2, -s.size * 0.3, s.size * 0.35, 0, Math.PI * 2);
                    }
                    this.ctx2d.fillStyle = "#ffffff";
                    this.ctx2d.fill();
                }
                
                this.ctx2d.restore();
            });
        }

        drawStar(cx, cy, spikes, outerRadius, innerRadius) {
            let rot = Math.PI / 2 * 3;
            let x = cx;
            let y = cy;
            const step = Math.PI / spikes;

            this.ctx2d.moveTo(cx, cy - outerRadius);
            for (let i = 0; i < spikes; i++) {
                x = cx + Math.cos(rot) * outerRadius;
                y = cy + Math.sin(rot) * outerRadius;
                this.ctx2d.lineTo(x, y);
                rot += step;

                x = cx + Math.cos(rot) * innerRadius;
                y = cy + Math.sin(rot) * innerRadius;
                this.ctx2d.lineTo(x, y);
                rot += step;
            }
            this.ctx2d.lineTo(cx, cy - outerRadius);
            this.ctx2d.closePath();
        }

        destroy() {
            if (this.canvas) {
                this.canvas.removeEventListener("mousedown", this.handlers.mousedown);
            }
            if (this.timerInterval) clearInterval(this.timerInterval);
            if (this.ruleShiftInterval) clearInterval(this.ruleShiftInterval);
            if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);

            this.canvas = null;
            this.ctx2d = null;
            this._bgGrad = null;
        }
    }

    window.Games = window.Games || {};
    window.Games.tap_object = new TapObjectGame();
})();
