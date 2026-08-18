/**
 * Game Module: Trace the Shape (Clinical Version)
 */
(function() {
    // Define trace shapes per level
    const SHAPE_DATA = {
        1: { // L Shape - Simple straight line
            points: [
                { x: 300, y: 100 },
                { x: 300, y: 400 },
                { x: 500, y: 400 }
            ],
            guideText: window.t('T180'),
            tolerance: 45 // Generous tolerance for clinical rehabilitation
        },
        2: { // U Shape - Curved bottom
            points: [
                { x: 250, y: 120 },
                { x: 250, y: 350 },
                { x: 300, y: 400 },
                { x: 500, y: 400 },
                { x: 550, y: 350 },
                { x: 550, y: 120 }
            ],
            guideText: window.t('T181'),
            tolerance: 40
        },
        3: { // A Shape
            points: [
                { x: 250, y: 420 },
                { x: 400, y: 80 },
                { x: 550, y: 420 },
                { x: 475, y: 250 },
                { x: 325, y: 250 }
            ],
            guideText: window.t('T182'),
            tolerance: 38
        },
        4: { // S Shape - Double curve
            points: [
                { x: 520, y: 130 },
                { x: 420, y: 90 },
                { x: 320, y: 140 },
                { x: 300, y: 220 },
                { x: 400, y: 270 },
                { x: 500, y: 320 },
                { x: 480, y: 400 },
                { x: 380, y: 420 },
                { x: 280, y: 380 }
            ],
            guideText: window.t('T183'),
            tolerance: 35
        },
        5: { // Infinity symbol
            points: [
                { x: 400, y: 250 },
                { x: 480, y: 170 },
                { x: 580, y: 170 },
                { x: 620, y: 250 },
                { x: 580, y: 330 },
                { x: 480, y: 330 },
                { x: 400, y: 250 },
                { x: 320, y: 170 },
                { x: 220, y: 170 },
                { x: 180, y: 250 },
                { x: 220, y: 330 },
                { x: 320, y: 330 },
                { x: 400, y: 250 }
            ],
            guideText: window.t('T184'),
            tolerance: 30
        }
    };

    function getShapeForLevel(level) {
        const centerX = 400;
        const centerY = 250;
        const points = [];
        let guideText = "";
        
        switch (level) {
            case 1: // L Shape
                points.push({ x: 300, y: 100 }, { x: 300, y: 400 }, { x: 500, y: 400 });
                guideText = window.t('T180');
                break;
            case 2: // U Shape
                points.push(
                    { x: 250, y: 120 }, { x: 250, y: 350 }, { x: 300, y: 400 },
                    { x: 500, y: 400 }, { x: 550, y: 350 }, { x: 550, y: 120 }
                );
                guideText = window.t('T181');
                break;
            case 3: // A Shape
                points.push(
                    { x: 250, y: 420 }, { x: 400, y: 80 }, { x: 550, y: 420 },
                    { x: 475, y: 250 }, { x: 325, y: 250 }
                );
                guideText = window.t('T182');
                break;
            case 4: // S Shape
                points.push(
                    { x: 520, y: 130 }, { x: 420, y: 90 }, { x: 320, y: 140 },
                    { x: 300, y: 220 }, { x: 400, y: 270 }, { x: 500, y: 320 },
                    { x: 480, y: 400 }, { x: 380, y: 420 }, { x: 280, y: 380 }
                );
                guideText = window.t('T183');
                break;
            case 5: // Infinity symbol
                guideText = window.t('T184');
                for (let i = 0; i <= 24; i++) {
                    const t = (i * 2 * Math.PI) / 24;
                    const scale = 200 / (3 - Math.cos(2*t));
                    points.push({
                        x: Math.round(centerX + scale * Math.cos(t)),
                        y: Math.round(centerY + scale * Math.sin(2*t) / 2)
                    });
                }
                break;
            case 6: // Triangle
                guideText = window.t('T185');
                for (let i = 0; i <= 3; i++) {
                    const angle = (i * 2 * Math.PI) / 3 - Math.PI / 2;
                    points.push({ x: Math.round(centerX + Math.cos(angle) * 140), y: Math.round(centerY + Math.sin(angle) * 140) });
                }
                break;
            case 7: // Square
                guideText = window.t('T186');
                for (let i = 0; i <= 4; i++) {
                    const angle = (i * 2 * Math.PI) / 4 - Math.PI / 4;
                    points.push({ x: Math.round(centerX + Math.cos(angle) * 140), y: Math.round(centerY + Math.sin(angle) * 140) });
                }
                break;
            case 8: // Pentagon
                guideText = window.t('T187');
                for (let i = 0; i <= 5; i++) {
                    const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
                    points.push({ x: Math.round(centerX + Math.cos(angle) * 135), y: Math.round(centerY + Math.sin(angle) * 135) });
                }
                break;
            case 9: // Hexagon
                guideText = window.t('T188');
                for (let i = 0; i <= 6; i++) {
                    const angle = (i * 2 * Math.PI) / 6;
                    points.push({ x: Math.round(centerX + Math.cos(angle) * 130), y: Math.round(centerY + Math.sin(angle) * 130) });
                }
                break;
            case 10: // Heptagon
                guideText = window.t('T189');
                for (let i = 0; i <= 7; i++) {
                    const angle = (i * 2 * Math.PI) / 7 - Math.PI / 2;
                    points.push({ x: Math.round(centerX + Math.cos(angle) * 130), y: Math.round(centerY + Math.sin(angle) * 130) });
                }
                break;
            case 11: // Octagon
                guideText = window.t('T190');
                for (let i = 0; i <= 8; i++) {
                    const angle = (i * 2 * Math.PI) / 8 - Math.PI / 8;
                    points.push({ x: Math.round(centerX + Math.cos(angle) * 130), y: Math.round(centerY + Math.sin(angle) * 130) });
                }
                break;
            case 12: // Heart
                guideText = window.t('T191');
                for (let i = 0; i <= 32; i++) {
                    const t = (i * 2 * Math.PI) / 32;
                    const x = 16 * Math.pow(Math.sin(t), 3);
                    const y = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
                    points.push({ x: Math.round(centerX + x * 9.5), y: Math.round(centerY - y * 9.5) });
                }
                break;
            case 13: // 4-Point Star (Sparkle)
                guideText = window.t('T192');
                for (let i = 0; i <= 8; i++) {
                    const angle = (i * 2 * Math.PI) / 8 - Math.PI / 2;
                    const r = i % 2 === 0 ? 140 : 50;
                    points.push({ x: Math.round(centerX + Math.cos(angle) * r), y: Math.round(centerY + Math.sin(angle) * r) });
                }
                break;
            case 14: // 5-Point Star
                guideText = window.t('T193');
                for (let i = 0; i <= 10; i++) {
                    const angle = (i * 2 * Math.PI) / 10 - Math.PI / 2;
                    const r = i % 2 === 0 ? 140 : 55;
                    points.push({ x: Math.round(centerX + Math.cos(angle) * r), y: Math.round(centerY + Math.sin(angle) * r) });
                }
                break;
            case 15: // 6-Point Star (Hexagram)
                guideText = window.t('T194');
                for (let i = 0; i <= 12; i++) {
                    const angle = (i * 2 * Math.PI) / 12 - Math.PI / 2;
                    const r = i % 2 === 0 ? 140 : 60;
                    points.push({ x: Math.round(centerX + Math.cos(angle) * r), y: Math.round(centerY + Math.sin(angle) * r) });
                }
                break;
            case 16: // Crescent Moon
                guideText = window.t('T195');
                for (let i = 0; i <= 16; i++) {
                    const angle = -Math.PI / 2 + (i / 16) * Math.PI;
                    points.push({ x: Math.round(centerX - 20 + Math.cos(angle) * 130), y: Math.round(centerY + Math.sin(angle) * 130) });
                }
                for (let i = 16; i >= 0; i--) {
                    const angle = -Math.PI / 2 + (i / 16) * Math.PI;
                    points.push({ x: Math.round(centerX + 20 + Math.cos(angle) * 95), y: Math.round(centerY + Math.sin(angle) * 95) });
                }
                break;
            case 17: // Diamond Gem
                guideText = window.t('T196');
                points.push(
                    { x: 400, y: 110 }, { x: 530, y: 190 }, { x: 480, y: 360 },
                    { x: 400, y: 400 }, { x: 320, y: 360 }, { x: 270, y: 190 }, { x: 400, y: 110 }
                );
                break;
            case 18: // Cross (Plus Sign)
                guideText = window.t('T197');
                points.push(
                    { x: 360, y: 120 }, { x: 440, y: 120 }, { x: 440, y: 200 },
                    { x: 520, y: 200 }, { x: 520, y: 280 }, { x: 440, y: 280 },
                    { x: 440, y: 380 }, { x: 360, y: 380 }, { x: 360, y: 280 },
                    { x: 280, y: 280 }, { x: 280, y: 200 }, { x: 360, y: 200 }, { x: 360, y: 120 }
                );
                break;
            case 19: // House outline
                guideText = window.t('T198');
                points.push(
                    { x: 280, y: 380 }, { x: 280, y: 240 }, { x: 400, y: 120 },
                    { x: 520, y: 240 }, { x: 520, y: 380 }, { x: 280, y: 380 }
                );
                break;
            case 20: // Letter M
                guideText = window.t('T199');
                points.push(
                    { x: 250, y: 380 }, { x: 250, y: 120 }, { x: 400, y: 280 },
                    { x: 550, y: 120 }, { x: 550, y: 380 }
                );
                break;
            case 21: // Teardrop / Raindrop
                guideText = window.t('T200');
                for (let i = 0; i <= 30; i++) {
                    const t = (i * 2 * Math.PI) / 30;
                    const x = 110 * Math.sin(t);
                    const y = 140 * Math.sin(t/2) * Math.cos(t/2) * Math.sin(t/2) - 100 * Math.cos(t);
                    points.push({ x: Math.round(centerX + x), y: Math.round(centerY + y) });
                }
                break;
            case 22: // Bowtie / Hourglass
                guideText = window.t('T201');
                points.push(
                    { x: 260, y: 140 }, { x: 540, y: 360 }, { x: 540, y: 140 },
                    { x: 260, y: 360 }, { x: 260, y: 140 }
                );
                break;
            case 23: // Envelope
                guideText = window.t('T202');
                points.push(
                    { x: 260, y: 160 }, { x: 540, y: 160 }, { x: 540, y: 340 },
                    { x: 260, y: 340 }, { x: 260, y: 160 }, { x: 400, y: 250 }, { x: 540, y: 160 }
                );
                break;
            case 24: // Wave curve (horizontal)
                guideText = window.t('T203');
                for (let i = 0; i <= 20; i++) {
                    const pct = i / 20;
                    const x = 200 + pct * 400;
                    const y = centerY + Math.sin(pct * 2 * Math.PI) * 70;
                    points.push({ x: Math.round(x), y: Math.round(y) });
                }
                break;
            case 25: // Spiral (Clockwise)
                guideText = window.t('T204');
                for (let i = 0; i < 24; i++) {
                    const angle = (i / 23) * 1.5 * 2 * Math.PI;
                    const r = 25 + (i / 23) * 130;
                    points.push({ x: Math.round(centerX + Math.cos(angle) * r), y: Math.round(centerY + Math.sin(angle) * r) });
                }
                break;
            case 26: // 3-Petal Rose
                guideText = window.t('T205');
                for (let i = 0; i <= 36; i++) {
                    const angle = (i * 2 * Math.PI) / 36;
                    const r = 50 + Math.sin(3 * angle) * 105;
                    points.push({ x: Math.round(centerX + Math.cos(angle) * r), y: Math.round(centerY + Math.sin(angle) * r) });
                }
                break;
            case 27: // 4-Petal Rose
                guideText = window.t('T206');
                for (let i = 0; i <= 40; i++) {
                    const angle = (i * 2 * Math.PI) / 40;
                    const r = 50 + Math.sin(4 * angle) * 105;
                    points.push({ x: Math.round(centerX + Math.cos(angle) * r), y: Math.round(centerY + Math.sin(angle) * r) });
                }
                break;
            case 28: // Fish outline
                guideText = window.t('T207');
                for (let i = 0; i <= 28; i++) {
                    const t = (i * 2 * Math.PI) / 28;
                    const x = 140 * Math.cos(t) - 30 * Math.sin(t) * Math.sin(t);
                    const y = 80 * Math.sin(t) * Math.cos(t);
                    points.push({ x: Math.round(centerX + x), y: Math.round(centerY + y) });
                }
                break;
            case 29: // Arrow Right
                guideText = window.t('T208');
                points.push(
                    { x: 260, y: 210 }, { x: 440, y: 210 }, { x: 440, y: 150 },
                    { x: 540, y: 250 }, { x: 440, y: 350 }, { x: 440, y: 290 },
                    { x: 260, y: 290 }, { x: 260, y: 210 }
                );
                break;
            case 30: // Arrow Up
                guideText = window.t('T209');
                points.push(
                    { x: 360, y: 350 }, { x: 360, y: 230 }, { x: 300, y: 230 },
                    { x: 400, y: 130 }, { x: 500, y: 230 }, { x: 440, y: 230 },
                    { x: 440, y: 350 }, { x: 360, y: 350 }
                );
                break;
            case 31: // Crown outline
                guideText = window.t('T210');
                points.push(
                    { x: 280, y: 360 }, { x: 260, y: 200 }, { x: 330, y: 260 },
                    { x: 400, y: 160 }, { x: 470, y: 260 }, { x: 540, y: 200 },
                    { x: 520, y: 360 }, { x: 280, y: 360 }
                );
                break;
            case 32: // Lightning Bolt
                guideText = window.t('T211');
                points.push(
                    { x: 440, y: 100 }, { x: 320, y: 260 }, { x: 400, y: 260 },
                    { x: 360, y: 400 }, { x: 480, y: 240 }, { x: 400, y: 240 }, { x: 440, y: 100 }
                );
                break;
            case 33: // Shield outline
                guideText = window.t('T212');
                points.push(
                    { x: 280, y: 150 }, { x: 520, y: 150 }, { x: 520, y: 270 },
                    { x: 400, y: 390 }, { x: 280, y: 270 }, { x: 280, y: 150 }
                );
                break;
            case 34: // Letter W
                guideText = window.t('T213');
                points.push(
                    { x: 250, y: 140 }, { x: 320, y: 380 }, { x: 400, y: 220 },
                    { x: 480, y: 380 }, { x: 550, y: 140 }
                );
                break;
            case 35: // 8-sided Star
                guideText = window.t('T214');
                for (let i = 0; i <= 16; i++) {
                    const angle = (i * 2 * Math.PI) / 16 - Math.PI / 2;
                    const r = i % 2 === 0 ? 140 : 60;
                    points.push({ x: Math.round(centerX + Math.cos(angle) * r), y: Math.round(centerY + Math.sin(angle) * r) });
                }
                break;
            case 36: // Wave curve (vertical)
                guideText = window.t('T215');
                for (let i = 0; i <= 20; i++) {
                    const pct = i / 20;
                    const y = 100 + pct * 300;
                    const x = centerX + Math.sin(pct * 2 * Math.PI) * 70;
                    points.push({ x: Math.round(x), y: Math.round(y) });
                }
                break;
            case 37: // Hourglass geometric outline
                guideText = window.t('T216');
                points.push(
                    { x: 300, y: 140 }, { x: 500, y: 140 }, { x: 380, y: 250 },
                    { x: 500, y: 360 }, { x: 300, y: 360 }, { x: 420, y: 250 }, { x: 300, y: 140 }
                );
                break;
            case 38: // Cloud outline
                guideText = window.t('T217');
                points.push(
                    { x: 300, y: 320 }, { x: 260, y: 280 }, { x: 260, y: 220 },
                    { x: 320, y: 180 }, { x: 400, y: 160 }, { x: 480, y: 180 },
                    { x: 540, y: 220 }, { x: 540, y: 280 }, { x: 500, y: 320 }, { x: 300, y: 320 }
                );
                break;
            case 39: // Diamond grid path
                guideText = window.t('T218');
                points.push(
                    { x: 400, y: 120 }, { x: 500, y: 250 }, { x: 400, y: 380 },
                    { x: 300, y: 250 }, { x: 400, y: 120 }, { x: 400, y: 380 }
                );
                break;
            case 40: // Trefoil (Three-leaf clover)
                guideText = window.t('T219');
                for (let i = 0; i <= 36; i++) {
                    const angle = (i * 2 * Math.PI) / 36;
                    const r = 40 + Math.sin(3 * angle) * 70 + Math.cos(6 * angle) * 20;
                    points.push({ x: Math.round(centerX + Math.cos(angle) * r * 1.2), y: Math.round(centerY + Math.sin(angle) * r * 1.2) });
                }
                break;
            case 41: // Moon Crescent (Mirrored)
                guideText = window.t('T220');
                for (let i = 0; i <= 16; i++) {
                    const angle = -Math.PI / 2 + (i / 16) * Math.PI;
                    points.push({ x: Math.round(centerX + 20 - Math.cos(angle) * 130), y: Math.round(centerY + Math.sin(angle) * 130) });
                }
                for (let i = 16; i >= 0; i--) {
                    const angle = -Math.PI / 2 + (i / 16) * Math.PI;
                    points.push({ x: Math.round(centerX - 20 - Math.cos(angle) * 95), y: Math.round(centerY + Math.sin(angle) * 95) });
                }
                break;
            case 42: // Spiral Inward (Counter-clockwise)
                guideText = window.t('T221');
                for (let i = 0; i < 24; i++) {
                    const angle = (i / 23) * 1.5 * 2 * Math.PI * -1;
                    const r = 25 + (i / 23) * 130;
                    points.push({ x: Math.round(centerX + Math.cos(angle) * r), y: Math.round(centerY + Math.sin(angle) * r) });
                }
                break;
            case 43: // 5-Petal Rose flower
                guideText = window.t('T222');
                for (let i = 0; i <= 45; i++) {
                    const angle = (i * 2 * Math.PI) / 45;
                    const r = 50 + Math.sin(5 * angle) * 105;
                    points.push({ x: Math.round(centerX + Math.cos(angle) * r), y: Math.round(centerY + Math.sin(angle) * r) });
                }
                break;
            case 44: // Quatrefoil (Four-leaf clover)
                guideText = window.t('T223');
                for (let i = 0; i <= 48; i++) {
                    const angle = (i * 2 * Math.PI) / 48;
                    const r = 85 + Math.sin(4 * angle) * 45;
                    points.push({ x: Math.round(centerX + Math.cos(angle) * r), y: Math.round(centerY + Math.sin(angle) * r) });
                }
                break;
            case 45: // Yin Yang Separator Curve
                guideText = window.t('T224');
                for (let i = 0; i <= 24; i++) {
                    const pct = i / 24;
                    const x = Math.sin(pct * Math.PI * 2) * 50;
                    const y = -140 + pct * 280;
                    points.push({ x: Math.round(centerX + x), y: Math.round(centerY + y) });
                }
                break;
            case 46: // Key outline path
                guideText = window.t('T225');
                points.push(
                    { x: 300, y: 250 }, { x: 300, y: 210 }, { x: 340, y: 170 },
                    { x: 420, y: 170 }, { x: 460, y: 210 }, { x: 460, y: 290 },
                    { x: 420, y: 330 }, { x: 340, y: 330 }, { x: 300, y: 290 },
                    { x: 300, y: 250 }, { x: 200, y: 250 }, { x: 200, y: 290 },
                    { x: 220, y: 290 }, { x: 220, y: 250 }, { x: 240, y: 250 },
                    { x: 240, y: 290 }, { x: 260, y: 290 }, { x: 260, y: 250 }
                );
                break;
            case 47: // Bell outline
                guideText = window.t('T226');
                points.push(
                    { x: 400, y: 130 }, { x: 440, y: 170 }, { x: 440, y: 290 },
                    { x: 500, y: 340 }, { x: 300, y: 340 }, { x: 360, y: 290 },
                    { x: 360, y: 170 }, { x: 400, y: 130 }
                );
                break;
            case 48: // Octagram (8-pointed star)
                guideText = window.t('T227');
                for (let i = 0; i <= 16; i++) {
                    const angle = (i * 2 * Math.PI) / 16 - Math.PI / 2;
                    const r = i % 2 === 0 ? 140 : 50;
                    points.push({ x: Math.round(centerX + Math.cos(angle) * r), y: Math.round(centerY + Math.sin(angle) * r) });
                }
                break;
            case 49: // Hexagram Star
                guideText = window.t('T228');
                for (let i = 0; i <= 12; i++) {
                    const angle = (i * 2 * Math.PI) / 12 - Math.PI / 2;
                    const r = i % 2 === 0 ? 140 : 45;
                    points.push({ x: Math.round(centerX + Math.cos(angle) * r), y: Math.round(centerY + Math.sin(angle) * r) });
                }
                break;
            case 50: // Double Loop
                guideText = window.t('T229');
                for (let i = 0; i <= 60; i++) {
                    const angle = (i * 2 * Math.PI) / 60;
                    const r = 60 + Math.sin(6 * angle) * 90;
                    points.push({ x: Math.round(centerX + Math.cos(angle) * r), y: Math.round(centerY + Math.sin(angle) * r) });
                }
                break;
            default:
                points.push({ x: 300, y: 100 }, { x: 300, y: 400 }, { x: 500, y: 400 });
                guideText = window.t('T180');
                break;
        }
        
        return {
            points: points,
            guideText: guideText,
            tolerance: Math.max(26, 40 - Math.floor((level - 1) / 5) * 2)
        };
    }

    class TraceLetterGame {
        constructor() {
            this.container = null;
            this.ctx = null;
            this.canvas = null;
            this.ctx2d = null;
            this.gameCtx = null;
            this.activeLevel = 1;
            
            this.points = [];
            this.currentCheckIndex = 0;
            this.isDrawing = false;
            this.mousePos = { x: 0, y: 0 };
            this.userPath = [];
            this.lives = 3;
            this.score = 0;
            
            this.timerInterval = null;
            this.animationFrameId = null;
            this.handlers = {};
            // ponytail: cached gradient
            this._bgGrad = null;
        }

        init(container, gameCtx) {
            this.container = container;
            this.gameCtx = gameCtx;
            this.activeLevel = gameCtx.level;
            this.lives = 3;
            this.score = 0;
            
            const shape = getShapeForLevel(this.activeLevel);
            this.points = shape.points;
            this.tolerance = shape.tolerance;
            this.currentCheckIndex = 0;
            this.userPath = [];
            
            // Random clinical stroke colors
            const colors = ["#1b52a4", "#0d8a94", "#1e7e34", "#d97706", "#9333ea", "#e11d48"];
            this.drawColor = colors[Math.floor(Math.random() * colors.length)];

            this.gameCtx.setScore(this.score);
            this.gameCtx.setLives(this.lives);
            this.gameCtx.setTimer("00:00");

            container.innerHTML = `
                <div class="canvas-game-container">
                    <div class="trace-guide-overlay" id="trace-guide">${shape.guideText}</div>
                    <canvas id="trace-canvas" width="800" height="500"></canvas>
                </div>
            `;
            
            this.canvas = document.getElementById("trace-canvas");
            this.ctx2d = this.canvas.getContext("2d");

            // ponytail: cache background gradient once
            const w = this.canvas.width;
            const h = this.canvas.height;
            this._bgGrad = this.ctx2d.createLinearGradient(0, 0, w, h);
            this._bgGrad.addColorStop(0, "#f8fafc");
            this._bgGrad.addColorStop(0.3, "#f1f5f9");
            this._bgGrad.addColorStop(0.6, "#e2e8f0");
            this._bgGrad.addColorStop(1, "#f1f5f9");
            
            this.startTime = Date.now();
            this.startTimer();
            
            this.bindInput();
            this.gameLoop();
        }

        startTimer() {
            this.timerInterval = setInterval(() => {
                const elapsedSecs = Math.floor((Date.now() - this.startTime) / 1000);
                const mm = Math.floor(elapsedSecs / 60).toString().padStart(2, '0');
                const ss = (elapsedSecs % 60).toString().padStart(2, '0');
                this.gameCtx.setTimer(`${mm}:${ss}`);
            }, 1000);
        }

        bindInput() {
            const getPos = (e) => {
                const rect = this.canvas.getBoundingClientRect();
                const scaleX = this.canvas.width / rect.width;
                const scaleY = this.canvas.height / rect.height;
                const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                const clientY = e.touches ? e.touches[0].clientY : e.clientY;
                return {
                    x: (clientX - rect.left) * scaleX,
                    y: (clientY - rect.top) * scaleY
                };
            };

            const onStart = (e) => {
                e.preventDefault();
                this.gameCtx.playSound('click');
                const pos = getPos(e);
                
                const dist = this.getDistance(pos, this.points[0]);
                if (dist <= this.tolerance + 15) {
                    this.isDrawing = true;
                    this.currentCheckIndex = 0;
                    this.userPath = [pos];
                    this.score = 10;
                    this.gameCtx.setScore(this.score);
                } else {
                    this.triggerTraceFail(window.t('T230'));
                }
            };

            const onMove = (e) => {
                if (!this.isDrawing) return;
                e.preventDefault();
                const pos = getPos(e);
                this.mousePos = pos;
                
                this.userPath.push(pos);
                
                const prevTarget = this.points[Math.max(0, this.currentCheckIndex - 1)];
                const nextTarget = this.points[this.currentCheckIndex];
                
                let deviation = 0;
                if (this.currentCheckIndex === 0) {
                    deviation = this.getDistance(pos, nextTarget);
                } else {
                    deviation = this.getDistanceToSegment(pos, prevTarget, nextTarget);
                }
                
                if (deviation > this.tolerance) {
                    this.triggerTraceFail(window.t('T231'));
                    return;
                }

                const targetPoint = this.points[this.currentCheckIndex];
                const distToNext = this.getDistance(pos, targetPoint);
                
                if (distToNext <= this.tolerance) {
                    this.currentCheckIndex++;
                    this.gameCtx.playSound('match');
                    this.score += 150;
                    this.gameCtx.setScore(this.score);
                    
                    if (this.currentCheckIndex >= this.points.length) {
                        this.triggerWin();
                    }
                }
            };

            const onEnd = () => {
                if (this.isDrawing) {
                    this.isDrawing = false;
                    this.triggerTraceFail(window.t('T232'));
                }
            };

            this.canvas.addEventListener("mousedown", onStart);
            this.canvas.addEventListener("mousemove", onMove);
            window.addEventListener("mouseup", onEnd);

            this.canvas.addEventListener("touchstart", onStart, { passive: false });
            this.canvas.addEventListener("touchmove", onMove, { passive: false });
            window.addEventListener("touchend", onEnd);

            this.handlers = {
                mousedown: onStart,
                mousemove: onMove,
                mouseup: onEnd,
                touchstart: onStart,
                touchmove: onMove,
                touchend: onEnd
            };
        }

        getDistance(p1, p2) {
            return Math.sqrt((p1.x - p2.x)**2 + (p1.y - p2.y)**2);
        }

        getDistanceToSegment(p, a, b) {
            const l2 = (a.x - b.x)**2 + (a.y - b.y)**2;
            if (l2 === 0) return this.getDistance(p, a);
            let t = ((p.x - a.x) * (b.x - a.x) + (p.y - a.y) * (b.y - a.y)) / l2;
            t = Math.max(0, Math.min(1, t));
            return this.getDistance(p, {
                x: a.x + t * (b.x - a.x),
                y: a.y + t * (b.y - a.y)
            });
        }

        triggerTraceFail(msg) {
            this.isDrawing = false;
            this.userPath = [];
            this.currentCheckIndex = 0;
            this.lives--;
            this.gameCtx.setLives(this.lives);
            this.gameCtx.playSound('error');
            
            const guide = document.getElementById("trace-guide");
            if (guide) {
                        guide.innerText = msg;
                guide.style.color = "#f87171";
                setTimeout(() => {
                    if (guide) {
                        guide.innerText = SHAPE_DATA[this.activeLevel].guideText;
                        guide.style.color = "var(--text-main)";
                    }
                }, 2500);
            }

            if (this.lives <= 0) {
                this.gameCtx.onLose(this.score);
            }
        }

        triggerWin() {
            this.isDrawing = false;
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            const timeBonus = Math.max(0, 1000 - elapsed * 5); // gentler penalty
            const finalScore = this.score + timeBonus + (this.lives * 200);
            const xpGained = 100;
            
            this.gameCtx.onWin(finalScore, xpGained);
        }

        gameLoop() {
            if (!this.canvas) return;
            this.draw();
            this.animationFrameId = requestAnimationFrame(() => this.gameLoop());
        }

        draw() {
            const w = this.canvas.width;
            const h = this.canvas.height;
            const t = Date.now() / 1000;
            
            // ponytail: cached background gradient, no per-frame allocation
            this.ctx2d.fillStyle = this._bgGrad;
            this.ctx2d.fillRect(0, 0, w, h);
            
            // ponytail: killed dot grid — was ~300 arc() calls per frame, pure GPU waste in Unity WebView

            // Glowing guide corridor
            this.ctx2d.save();
            this.ctx2d.beginPath();
            this.ctx2d.strokeStyle = "rgba(99, 102, 241, 0.08)";
            this.ctx2d.lineWidth = this.tolerance * 2;
            this.ctx2d.lineCap = "round";
            this.ctx2d.lineJoin = "round";
            this.ctx2d.shadowColor = "rgba(99, 102, 241, 0.04)";
            this.ctx2d.shadowBlur = 10;
            this.points.forEach((p, index) => {
                if (index === 0) this.ctx2d.moveTo(p.x, p.y);
                else this.ctx2d.lineTo(p.x, p.y);
            });
            this.ctx2d.stroke();
            this.ctx2d.restore();

            // Neon center guide line with animated dash
            this.ctx2d.save();
            this.ctx2d.beginPath();
            this.ctx2d.strokeStyle = "rgba(99, 102, 241, 0.4)";
            this.ctx2d.lineWidth = 2.5;
            this.ctx2d.setLineDash([8, 6]);
            this.ctx2d.lineDashOffset = -t * 30;
            this.ctx2d.shadowColor = "rgba(99, 102, 241, 0.15)";
            this.ctx2d.shadowBlur = 4;
            this.points.forEach((p, index) => {
                if (index === 0) this.ctx2d.moveTo(p.x, p.y);
                else this.ctx2d.lineTo(p.x, p.y);
            });
            this.ctx2d.stroke();
            this.ctx2d.setLineDash([]);
            this.ctx2d.restore();

            // User trace path with neon glow
            if (this.userPath.length > 1) {
                // Outer glow
                this.ctx2d.save();
                this.ctx2d.shadowColor = this.drawColor;
                this.ctx2d.shadowBlur = 12;
                this.ctx2d.beginPath();
                this.ctx2d.strokeStyle = this.drawColor + "40";
                this.ctx2d.lineWidth = 18;
                this.ctx2d.lineCap = "round";
                this.ctx2d.lineJoin = "round";
                this.userPath.forEach((p, idx) => {
                    if (idx === 0) this.ctx2d.moveTo(p.x, p.y);
                    else this.ctx2d.lineTo(p.x, p.y);
                });
                this.ctx2d.stroke();
                this.ctx2d.restore();
                
                // Core bright line
                this.ctx2d.save();
                this.ctx2d.shadowColor = this.drawColor;
                this.ctx2d.shadowBlur = 8;
                this.ctx2d.beginPath();
                this.ctx2d.strokeStyle = this.drawColor;
                this.ctx2d.lineWidth = 6;
                this.ctx2d.lineCap = "round";
                this.ctx2d.lineJoin = "round";
                this.userPath.forEach((p, idx) => {
                    if (idx === 0) this.ctx2d.moveTo(p.x, p.y);
                    else this.ctx2d.lineTo(p.x, p.y);
                });
                this.ctx2d.stroke();
                this.ctx2d.restore();
                
                // White inner highlight
                this.ctx2d.beginPath();
                this.ctx2d.strokeStyle = "rgba(255, 255, 255, 0.7)";
                this.ctx2d.lineWidth = 2;
                this.ctx2d.lineCap = "round";
                this.ctx2d.lineJoin = "round";
                this.userPath.forEach((p, idx) => {
                    if (idx === 0) this.ctx2d.moveTo(p.x, p.y);
                    else this.ctx2d.lineTo(p.x, p.y);
                });
                this.ctx2d.stroke();
            }

            // Premium glowing checkpoints (Light theme adjustments)
            this.points.forEach((p, idx) => {
                const isCleared = idx < this.currentCheckIndex;
                const isTarget = idx === this.currentCheckIndex;
                const pulse = isTarget ? 14 + Math.sin(t * 4) * 4 : 10;
                
                // Outer glow ring for target
                if (isTarget) {
                    this.ctx2d.save();
                    const glowSize = pulse + 10 + Math.sin(t * 3) * 4;
                    this.ctx2d.beginPath();
                    this.ctx2d.arc(p.x, p.y, glowSize, 0, Math.PI * 2);
                    this.ctx2d.strokeStyle = "rgba(217, 119, 6, 0.15)";
                    this.ctx2d.lineWidth = 2;
                    this.ctx2d.shadowColor = "rgba(217, 119, 6, 0.25)";
                    this.ctx2d.shadowBlur = 10;
                    this.ctx2d.stroke();
                    this.ctx2d.restore();
                }
                
                // Checkpoint body
                this.ctx2d.save();
                this.ctx2d.beginPath();
                this.ctx2d.arc(p.x, p.y, isTarget ? pulse : 12, 0, Math.PI * 2);
                
                if (isCleared) {
                    const grad = this.ctx2d.createRadialGradient(p.x, p.y, 0, p.x, p.y, 12);
                    grad.addColorStop(0, "#a7f3d0");
                    grad.addColorStop(1, "#059669");
                    this.ctx2d.fillStyle = grad;
                    this.ctx2d.shadowColor = "rgba(16, 185, 129, 0.2)";
                    this.ctx2d.shadowBlur = 8;
                } else if (isTarget) {
                    const grad = this.ctx2d.createRadialGradient(p.x, p.y, 0, p.x, p.y, pulse);
                    grad.addColorStop(0, "#fef3c7");
                    grad.addColorStop(1, "#d97706");
                    this.ctx2d.fillStyle = grad;
                    this.ctx2d.shadowColor = "rgba(217, 119, 6, 0.3)";
                    this.ctx2d.shadowBlur = 10;
                } else {
                    const grad = this.ctx2d.createRadialGradient(p.x, p.y, 0, p.x, p.y, 10);
                    grad.addColorStop(0, "#ffffff");
                    grad.addColorStop(1, "#cbd5e1");
                    this.ctx2d.fillStyle = grad;
                }
                this.ctx2d.fill();
                
                // Draw a subtle border for uncleared pegs
                if (!isCleared && !isTarget) {
                    this.ctx2d.strokeStyle = "rgba(100, 116, 139, 0.3)";
                    this.ctx2d.lineWidth = 1;
                    this.ctx2d.stroke();
                }
                
                // Inner shine highlight
                if (isCleared || isTarget) {
                    this.ctx2d.beginPath();
                    const r = isTarget ? pulse * 0.5 : 5;
                    this.ctx2d.arc(p.x - 2, p.y - 2, r, 0, Math.PI * 2);
                    this.ctx2d.fillStyle = "rgba(255, 255, 255, 0.5)";
                    this.ctx2d.fill();
                }
                this.ctx2d.restore();

                // START label
                if (idx === 0 && !isCleared) {
                    this.ctx2d.save();
                    this.ctx2d.font = "bold 13px 'Outfit'";
                    this.ctx2d.fillStyle = "#d97706";
                    this.ctx2d.shadowColor = "rgba(217, 119, 6, 0.25)";
                    this.ctx2d.shadowBlur = 4;
                    this.ctx2d.textAlign = "center";
                    this.ctx2d.fillText(window.t('T233'), p.x, p.y - 26);
                    this.ctx2d.restore();
                }
            });
        }

        destroy() {
            if (this.canvas) {
                this.canvas.removeEventListener("mousedown", this.handlers.mousedown);
                this.canvas.removeEventListener("mousemove", this.handlers.mousemove);
                window.removeEventListener("mouseup", this.handlers.mouseup);
                this.canvas.removeEventListener("touchstart", this.handlers.touchstart);
                this.canvas.removeEventListener("touchmove", this.handlers.touchmove);
                window.removeEventListener("touchend", this.handlers.touchend);
            }
            if (this.timerInterval) clearInterval(this.timerInterval);
            if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);

            this.canvas = null;
            this.ctx2d = null;
            this._bgGrad = null;
        }
    }

    window.Games = window.Games || {};
    window.Games.trace_letter = new TraceLetterGame();
})();
