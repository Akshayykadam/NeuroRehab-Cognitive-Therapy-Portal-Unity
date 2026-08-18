/**
 * Game Module: Colour Fill Game (Coloring Book Illustrations with Flood Fill)
 */
(function () {
    // Elegant therapy color palette (9 glossy swatches including white eraser)
    const COLOR_PALETTE = [
        { name: window.t('T234'), hex: "#3b82f6", rgb: { r: 59, g: 130, b: 246 } },
        { name: window.t('T235'), hex: "#15dfc7ff", rgb: { r: 20, g: 184, b: 166 } },
        { name: window.t('T236'), hex: "#10b918ff", rgb: { r: 16, g: 185, b: 129 } },
        { name: window.t('T237'), hex: "#f5e20bff", rgb: { r: 245, g: 158, b: 11 } },
        { name: window.t('T238'), hex: "#f97316", rgb: { r: 249, g: 115, b: 22 } },
        { name: window.t('T239'), hex: "#f11212ff", rgb: { r: 239, g: 68, b: 68 } },
        { name: window.t('T240'), hex: "#8b5cf6", rgb: { r: 139, g: 92, b: 246 } },
        { name: window.t('T241'), hex: "#eb117eff", rgb: { r: 236, g: 72, b: 153 } },
        { name: window.t('T242'), hex: "#ffffff", rgb: { r: 255, g: 255, b: 255 } }
    ];

    // Mapped illustrations per level (exactly 50 levels)
    const LEVEL_ILLUSTRATIONS = [
        { id: "001", cat: "easy" },   // Level 1
        { id: "005", cat: "easy" },   // Level 2
        { id: "007", cat: "easy" },   // Level 3
        { id: "010", cat: "easy" },   // Level 4
        { id: "012", cat: "easy" },   // Level 5
        { id: "041", cat: "hard" },   // Level 6
        { id: "042", cat: "easy" },   // Level 7
        { id: "068", cat: "medium" }, // Level 8
        { id: "003", cat: "medium" }, // Level 9
        { id: "004", cat: "medium" }, // Level 10
        { id: "006", cat: "medium" }, // Level 11
        { id: "008", cat: "medium" }, // Level 12
        { id: "009", cat: "medium" }, // Level 13
        { id: "013", cat: "medium" }, // Level 14
        { id: "014", cat: "medium" }, // Level 15
        { id: "015", cat: "medium" }, // Level 16
        { id: "016", cat: "medium" }, // Level 17
        { id: "019", cat: "medium" }, // Level 18
        { id: "070", cat: "medium" }, // Level 19
        { id: "023", cat: "medium" }, // Level 20
        { id: "025", cat: "medium" }, // Level 21
        { id: "026", cat: "medium" }, // Level 22
        { id: "027", cat: "medium" }, // Level 23
        { id: "028", cat: "medium" }, // Level 24
        { id: "029", cat: "medium" }, // Level 25
        { id: "031", cat: "medium" }, // Level 26
        { id: "035", cat: "medium" }, // Level 27
        { id: "037", cat: "medium" }, // Level 28
        { id: "039", cat: "medium" }, // Level 29
        { id: "040", cat: "medium" }, // Level 30
        { id: "047", cat: "medium" }, // Level 31
        { id: "048", cat: "medium" }, // Level 32
        { id: "049", cat: "medium" }, // Level 33
        { id: "050", cat: "medium" }, // Level 34
        { id: "052", cat: "medium" }, // Level 35
        { id: "054", cat: "medium" }, // Level 36
        { id: "055", cat: "medium" }, // Level 37
        { id: "058", cat: "medium" }, // Level 38
        { id: "061", cat: "medium" }, // Level 39
        { id: "063", cat: "medium" }, // Level 40
        { id: "002", cat: "hard" },   // Level 41
        { id: "011", cat: "hard" },   // Level 42
        { id: "017", cat: "hard" },   // Level 43
        { id: "018", cat: "hard" },   // Level 44
        { id: "020", cat: "hard" },   // Level 45
        { id: "030", cat: "hard" },   // Level 46
        { id: "032", cat: "hard" },   // Level 47
        { id: "033", cat: "hard" },   // Level 48
        { id: "034", cat: "hard" },   // Level 49
        { id: "036", cat: "hard" }    // Level 50
    ];

    class ColourFillGame {
        constructor() {
            this.container = null;
            this.gameCtx = null;
            this.canvas = null;
            this.ctx2d = null;
            this.activeLevel = 1;

            this.selectedColorIdx = 0;
            this.timeLeft = 0;
            this.score = 0;

            this.timerInterval = null;
            this.handlers = {};

            // Coloring metrics
            this.illustrationImg = null;
            this.initialWhiteCount = 0;
            this.whitePixelCount = 0;
            this.coloringProgress = 0;
            this.victoryTriggered = false;
        }

        init(container, gameCtx) {
            this.container = container;
            this.gameCtx = gameCtx;
            this.activeLevel = gameCtx.level;
            this.score = 0;
            this.selectedColorIdx = 0;
            this.victoryTriggered = false;
            this.coloringProgress = 0;

            // Set time limits: 120 seconds base, capped min 45 seconds for higher levels
            this.timeLeft = Math.max(45, 120 - Math.floor((this.activeLevel - 1) / 5) * 6);

            this.gameCtx.setScore(this.score);
            this.gameCtx.setLives("---");

            // Setup HTML container
            container.innerHTML = `
                <div class="canvas-game-container" style="flex-direction: column; gap: 0.8rem; padding: 0.6rem 0; align-items: center;">
                    <!-- Real-time Centered Progress Banner -->
                    <div class="trace-guide-overlay" id="coloring-progress-banner" style="position: relative; top: auto; right: auto; margin-bottom: 0.2rem; font-size:1.05rem; font-weight:700; color:var(--text-main); padding: 0.6rem 2rem; display: inline-block; text-align: center; width: auto; box-sizing: border-box;">
                        <span id="coloring-progress-text">${window.t('T243', { val: 0 })}</span>
                    </div>
                    <canvas id="fill-canvas" width="800" height="460"></canvas>
                    
                    <!-- Premium Glossy Swatch Palette -->
                    <div style="display:flex; flex-direction: column; gap: 0.5rem; align-items: center; margin-top: 0.5rem; width: 100%;">
                        <span style="font-size:0.85rem; font-weight:700; text-transform:uppercase; color: var(--text-muted); letter-spacing:1px; margin-bottom: 0.3rem;">${window.t('T244')}</span>
                        <div id="fill-palette" style="display:flex; gap:1.2rem; align-items:center;"></div>
                    </div>
                </div>
            `;

            this.canvas = document.getElementById("fill-canvas");
            this.ctx2d = this.canvas.getContext("2d", { willReadFrequently: true });

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

            this.loadIllustration();
            this.renderPalette();
            this.startTimer();
            this.bindInput();
        }

        loadIllustration() {
            const level = this.activeLevel;
            const idx = (level - 1) % LEVEL_ILLUSTRATIONS.length;
            const item = LEVEL_ILLUSTRATIONS[idx];
            const number = item.id;

            const dataUri = (window.COLOUR_FILL_DATA && window.COLOUR_FILL_DATA[number]) ? window.COLOUR_FILL_DATA[number] : null;
            const imgSrc = dataUri || `assets/coloring_game_illustrations/${item.cat}/illustration_${number}.png`;

            this.illustrationImg = new Image();
            this.illustrationImg.onload = () => {
                this.setupCanvasWithImage();
            };
            this.illustrationImg.onerror = () => {
                this.setupVectorFallback();
            };
            this.illustrationImg.src = imgSrc;
        }

        setupVectorFallback() {
            this.ctx2d.fillStyle = "#ffffff";
            this.ctx2d.fillRect(0, 0, 800, 460);
            
            // Draw clean interactive geometric vector outline so level is fully playable
            this.ctx2d.strokeStyle = "#1e293b";
            this.ctx2d.lineWidth = 4;
            
            // Draw 4 interconnected fillable shapes
            this.ctx2d.beginPath();
            this.ctx2d.arc(280, 230, 80, 0, Math.PI * 2);
            this.ctx2d.stroke();

            this.ctx2d.beginPath();
            this.ctx2d.arc(520, 230, 80, 0, Math.PI * 2);
            this.ctx2d.stroke();

            this.ctx2d.beginPath();
            this.ctx2d.rect(340, 150, 120, 160);
            this.ctx2d.stroke();

            const width = this.canvas.width;
            const height = this.canvas.height;
            try {
                const finalImgData = this.ctx2d.getImageData(0, 0, width, height);
                let whiteCount = 0;
                for (let i = 0; i < finalImgData.data.length; i += 4) {
                    if (finalImgData.data[i] > 240) whiteCount++;
                }
                this.initialWhiteCount = whiteCount;
                this.whitePixelCount = whiteCount;
                this.coloringProgress = 0;
                this.updateProgressUI();
            } catch(e) {}
        }

        setupCanvasWithImage() {
            try {
                const isUnity = window.location.search.indexOf('unity=true') > -1;
                const dpr = isUnity ? 1.0 : (window.devicePixelRatio || 1);
                const width = this.canvas.width;
                const height = this.canvas.height;

                // Clear to white in logical coordinates
                this.ctx2d.fillStyle = "#ffffff";
                this.ctx2d.fillRect(0, 0, 800, 460);

                const img = this.illustrationImg;
                const scale = Math.min(380 / img.width, 380 / img.height);
                const dw = img.width * scale;
                const dh = img.height * scale;
                const dx = (800 - dw) / 2;
                const dy = (460 - dh) / 2;

                // Draw scaled illustration using high smoothing and dynamic subpixel sharpening filters
                this.ctx2d.save();
                this.ctx2d.imageSmoothingEnabled = true;
                this.ctx2d.imageSmoothingQuality = "high";
                this.ctx2d.filter = "blur(0.8px) contrast(250%)";
                this.ctx2d.drawImage(img, dx, dy, dw, dh);
                this.ctx2d.restore();

                // Pre-fill the external background canvas area (surrounding the outlines)
                // with light slate #f1f5f9 (RGB 241, 245, 249) using a stack-based DFS
                const bgImgData = this.ctx2d.getImageData(0, 0, width, height);
                const bgData = bgImgData.data;

                const bgStartX = Math.round(2 * dpr);
                const bgStartY = Math.round(2 * dpr);
                const bgStartIdx = (bgStartY * width + bgStartX) * 4;
                const bgsr = bgData[bgStartIdx];
                const bgsg = bgData[bgStartIdx + 1];
                const bgsb = bgData[bgStartIdx + 2];

                const bgtr = 241;
                const bgtg = 245;
                const bgtb = 249;

                const bgStack = [bgStartY * width + bgStartX];
                const bgVisited = new Uint8Array(width * height);

                while (bgStack.length > 0) {
                    const curr = bgStack.pop();
                    const x = curr % width;
                    const y = Math.floor(curr / width);
                    const idx = curr * 4;

                    if (bgVisited[curr]) continue;
                    bgVisited[curr] = 1;

                    const r = bgData[idx];
                    const g = bgData[idx + 1];
                    const b = bgData[idx + 2];

                    // Stop at outlines (outlines are dark, brightness < 120)
                    const brightness = r * 0.299 + g * 0.587 + b * 0.114;
                    if (brightness < 120) continue;

                    const dist = Math.abs(r - bgsr) + Math.abs(g - bgsg) + Math.abs(b - bgsb);
                    if (dist > 40) continue;

                    bgData[idx] = bgtr;
                    bgData[idx + 1] = bgtg;
                    bgData[idx + 2] = bgtb;
                    bgData[idx + 3] = 255;

                    if (x > 0) bgStack.push(curr - 1);
                    if (x < width - 1) bgStack.push(curr + 1);
                    if (y > 0) bgStack.push(curr - width);
                    if (y < height - 1) bgStack.push(curr + width);
                }
                this.ctx2d.putImageData(bgImgData, 0, 0);

                // Draw background grids ONLY over the light border margin area in logical coordinates
                this.ctx2d.fillStyle = "rgba(99, 102, 241, 0.12)";
                const gridSize = 50;
                for (let x = 0; x < 800; x += gridSize) {
                    for (let y = 0; y < 460; y += 2) {
                        const px = Math.round(x * dpr);
                        const py = Math.round(y * dpr);
                        const idx = (py * width + px) * 4;
                        if (bgData[idx] === bgtr && bgData[idx + 1] === bgtg && bgData[idx + 2] === bgtb) {
                            this.ctx2d.fillRect(x, y, 1, 2);
                        }
                    }
                }
                for (let y = 0; y < 460; y += gridSize) {
                    for (let x = 0; x < 800; x += 2) {
                        const px = Math.round(x * dpr);
                        const py = Math.round(y * dpr);
                        const idx = (py * width + px) * 4;
                        if (bgData[idx] === bgtr && bgData[idx + 1] === bgtg && bgData[idx + 2] === bgtb) {
                            this.ctx2d.fillRect(x, y, 2, 1);
                        }
                    }
                }

                // Count initial pure white canvas pixels to measure fill progress (only count pure white interiors)
                const finalImgData = this.ctx2d.getImageData(0, 0, width, height);
                const finalData = finalImgData.data;

                let whiteCount = 0;
                for (let i = 0; i < finalData.length; i += 4) {
                    const r = finalData[i];
                    const g = finalData[i + 1];
                    const b = finalData[i + 2];
                    if (r > 245 && g > 245 && b > 245) {
                        whiteCount++;
                    }
                }
                this.initialWhiteCount = whiteCount;
                this.whitePixelCount = whiteCount;
                this.coloringProgress = 0;
                this.updateProgressUI();
            } catch (e) {
                console.warn("Canvas getImageData file:// restriction caught, activating vector fallback: ", e);
                this.setupVectorFallback();
            }
        }

        performFloodFill(startX, startY) {
            const width = this.canvas.width;
            const height = this.canvas.height;
            const imgData = this.ctx2d.getImageData(0, 0, width, height);
            const data = imgData.data;

            const startIdx = (startY * width + startX) * 4;
            const sr = data[startIdx];
            const sg = data[startIdx + 1];
            const sb = data[startIdx + 2];

            const color = COLOR_PALETTE[this.selectedColorIdx];
            const tr = color.rgb.r;
            const tg = color.rgb.g;
            const tb = color.rgb.b;

            // Do not fill outlines
            const clickedBrightness = sr * 0.299 + sg * 0.587 + sb * 0.114;
            if (clickedBrightness < 160) {
                return;
            }

            // Already painted
            if (Math.abs(sr - tr) < 8 && Math.abs(sg - tg) < 8 && Math.abs(sb - tb) < 8) {
                return;
            }

            // DFS Stack based pixel coloring loop (runs in <15ms)
            const stack = [startY * width + startX];
            const visited = new Uint8Array(width * height);

            while (stack.length > 0) {
                const curr = stack.pop();
                const x = curr % width;
                const y = Math.floor(curr / width);
                const idx = curr * 4;

                if (visited[curr]) continue;
                visited[curr] = 1;

                const r = data[idx];
                const g = data[idx + 1];
                const b = data[idx + 2];

                const brightness = r * 0.299 + g * 0.587 + b * 0.114;
                if (brightness < 160) continue; // stop at outlines

                const dist = Math.abs(r - sr) + Math.abs(g - sg) + Math.abs(b - sb);
                if (dist > 40) continue;

                data[idx] = tr;
                data[idx + 1] = tg;
                data[idx + 2] = tb;
                data[idx + 3] = 255;

                if (x > 0) stack.push(curr - 1);
                if (x < width - 1) stack.push(curr + 1);
                if (y > 0) stack.push(curr - width);
                if (y < height - 1) stack.push(curr + width);
            }

            this.ctx2d.putImageData(imgData, 0, 0);

            this.recalculateProgress();
        }

        recalculateProgress() {
            const imgData = this.ctx2d.getImageData(0, 0, this.canvas.width, this.canvas.height);
            const data = imgData.data;

            let whiteCount = 0;
            for (let i = 0; i < data.length; i += 4) {
                if (data[i] > 245 && data[i + 1] > 245 && data[i + 2] > 245) {
                    whiteCount++;
                }
            }
            this.whitePixelCount = whiteCount;
            this.coloringProgress = Math.min(100, Math.floor((1.0 - (this.whitePixelCount / this.initialWhiteCount)) * 100));
            this.updateProgressUI();

            if (this.coloringProgress >= 96 && !this.victoryTriggered) {
                this.victoryTriggered = true;
                this.handleVictory();
            }
        }

        updateProgressUI() {
            const textEl = document.getElementById("coloring-progress-text");
            if (textEl) {
                textEl.innerText = window.t('T243', { val: this.coloringProgress });
            }
        }

        renderPalette() {
            const paletteEl = document.getElementById("fill-palette");
            if (!paletteEl) return;

            paletteEl.innerHTML = COLOR_PALETTE.map((c, idx) => {
                const isActive = idx === this.selectedColorIdx ? "active" : "";
                const border = c.hex === "#ffffff" ? "border: 2.5px solid #cbd5e1;" : "";
                return `
                    <div class="color-swatch ${isActive}" 
                         data-idx="${idx}" 
                         style="background-color: ${c.hex}; ${border}"
                         title="${c.name}">
                    </div>
                `;
            }).join("");

            paletteEl.querySelectorAll(".color-swatch").forEach(swatch => {
                swatch.addEventListener("click", (e) => {
                    paletteEl.querySelectorAll(".color-swatch").forEach(s => s.classList.remove("active"));
                    const idx = parseInt(e.target.getAttribute("data-idx"));
                    this.selectedColorIdx = idx;
                    e.target.classList.add("active");
                });
            });
        }

        startTimer() {
            const timerValEl = document.getElementById("timer-value");
            if (timerValEl) timerValEl.innerText = this.timeLeft;

            if (this.timerInterval) clearInterval(this.timerInterval);
            this.timerInterval = setInterval(() => {
                this.timeLeft--;
                if (timerValEl) timerValEl.innerText = this.timeLeft;

                if (this.timeLeft <= 0) {
                    clearInterval(this.timerInterval);
                    this.handleGameOver();
                }
            }, 1000);
        }

        bindInput() {
            const onCanvasClick = (e) => {
                if (this.victoryTriggered) return;

                const rect = this.canvas.getBoundingClientRect();
                const x = Math.floor(((e.clientX - rect.left) / rect.width) * this.canvas.width);
                const y = Math.floor(((e.clientY - rect.top) / rect.height) * this.canvas.height);

                this.performFloodFill(x, y);
            };

            this.canvas.addEventListener("click", onCanvasClick);
            this.handlers.click = onCanvasClick;
        }

        handleVictory() {
            clearInterval(this.timerInterval);
            this.score = Math.floor(1000 + (this.timeLeft * 18));
            this.gameCtx.setScore(this.score);

            if (window.soundManager) {
                window.soundManager.play("win");
            }

            setTimeout(() => {
                this.gameCtx.onWin(this.score, 100);
            }, 300);
        }

        handleGameOver() {
            if (window.soundManager) {
                window.soundManager.play("lose");
            }
            this.gameCtx.onLose();
        }

        destroy() {
            if (this.canvas && this.handlers.click) {
                this.canvas.removeEventListener("click", this.handlers.click);
            }
            if (this.timerInterval) {
                clearInterval(this.timerInterval);
            }
        }
    }

    window.Games = window.Games || {};
    window.Games.colour_fill = new ColourFillGame();
})();
