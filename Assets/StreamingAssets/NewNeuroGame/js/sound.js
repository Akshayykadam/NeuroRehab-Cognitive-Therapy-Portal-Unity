/**
 * NeuroRehab Programmatic Calming Sound Synthesizer using Web Audio API
 */
class SoundManager {
    constructor() {
        this.ctx = null;
        this.muted = false;
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();
            }
        }
    }

    toggleMute() {
        this.muted = !this.muted;
        return this.muted;
    }

    createOscillator(type, freq, duration, gainValue) {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }

        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            // All clinical sounds strictly use gentle 'sine' waves
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
            
            gain.gain.setValueAtTime(gainValue * 0.5, this.ctx.currentTime); // Halve the overall volume
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + duration);
            
            return { osc, gain };
        } catch (e) {
            console.warn("Audio play failed:", e);
        }
    }

    playClick() {
        // Soft click
        this.createOscillator('sine', 800, 0.08, 0.05);
    }

    playSuccess() {
        // Soft double chime (C5 to G5)
        this.init();
        if (this.muted || !this.ctx) return;
        
        try {
            this.createOscillator('sine', 523.25, 0.15, 0.06); // C5
            setTimeout(() => {
                this.createOscillator('sine', 783.99, 0.20, 0.05); // G5
            }, 80);
        } catch (e) {
            this.createOscillator('sine', 600, 0.15, 0.05);
        }
    }

    playError() {
        // Low soft thud (sine drop)
        this.init();
        if (this.muted || !this.ctx) return;

        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(140, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.3);
            
            gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
            
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.3);
        } catch (e) {
            this.createOscillator('sine', 120, 0.2, 0.06);
        }
    }

    playMatch() {
        // Soft bubble pop chime
        this.createOscillator('sine', 659.25, 0.15, 0.05); // E5
    }

    playWin() {
        // Gentle soothing three-note ascending arpeggio (C4 - E4 - G4)
        this.init();
        if (this.muted || !this.ctx) return;

        try {
            const notes = [261.63, 329.63, 392.00]; 
            notes.forEach((freq, idx) => {
                setTimeout(() => {
                    this.createOscillator('sine', freq, 0.3, 0.06);
                }, idx * 120);
            });
        } catch (e) {
            this.createOscillator('sine', 400, 0.4, 0.06);
        }
    }

    playTick() {
        // Muted tick
        this.createOscillator('sine', 400, 0.02, 0.02);
    }
}

const Sound = new SoundManager();
