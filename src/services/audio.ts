/**
 * Procedural Web Audio API sound engine for authentic 1990s PC sounds:
 * - PC speaker beeps (frequency, duration)
 * - Power click switch
 * - Floppy drive head seek / stepping motor sounds
 * - Hard drive reading/crunching sounds
 * - CRT degauss electric discharge
 * - Windows 3.1 startup sound ("Tada.wav" chime sequence)
 * - Windows 3.1 exit sound ("Chimes.wav")
 * - Error sound ("Ding.wav")
 * - Polyphonic FM synthesis for retro MIDI files (e.g. Canyon.mid)
 */

class RetroAudioEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;
  public volume: number = 0.5;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  // Click sound for switches and buttons
  public playSwitchClick(type: 'power' | 'button' = 'power') {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    if (type === 'power') {
      // Heavy mechanical rocker switch snap
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.08);

      gain.gain.setValueAtTime(0.4 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } else {
      // Small plastic momentary click
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.04);

      gain.gain.setValueAtTime(0.25 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    }
  }

  // BIOS POST beep (Standard 896 Hz square wave beep)
  public playBiosBeep(freq = 896, duration = 0.16) {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.18 * this.volume, now);
    gain.gain.setValueAtTime(0.18 * this.volume, now + duration - 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + duration);
  }

  // Floppy drive motor step and seek
  public playFloppySeek() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const steps = 6;
    for (let i = 0; i < steps; i++) {
      const stepTime = now + i * 0.045;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180 + (i % 2) * 90, stepTime);
      gain.gain.setValueAtTime(0.12 * this.volume, stepTime);
      gain.gain.exponentialRampToValueAtTime(0.001, stepTime + 0.035);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(stepTime);
      osc.stop(stepTime + 0.035);
    }
  }

  // Hard disk head seek / crunch sound
  public playHddCrunch(durationMs = 250) {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const count = Math.floor(durationMs / 30);
    const now = this.ctx.currentTime;

    for (let i = 0; i < count; i++) {
      const t = now + (i * 0.03) + Math.random() * 0.01;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(80 + Math.random() * 140, t);

      gain.gain.setValueAtTime(0.08 * this.volume, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.02);
    }
  }

  // CRT Degauss sound (intense low hum that vibrates and decays)
  public playDegauss() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 1.2);

    gain.gain.setValueAtTime(0.35 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 1.4);
  }

  // Windows 3.1 Startup Chime (Tada.wav synth emulation: C4, G4, C5 arpeggio and final glorious bright chord)
  public playWindowsStartup() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Classic Tada notes: C4 -> E4 -> G4 -> C5 (staccato fanfares) -> Big chord (C5 + E5 + G5 + C6)
    const notes = [
      { f: 261.63, start: 0.0, dur: 0.12 },
      { f: 329.63, start: 0.14, dur: 0.12 },
      { f: 392.00, start: 0.28, dur: 0.12 },
      { f: 523.25, start: 0.42, dur: 0.22 },
      // Sustain chord
      { f: 261.63, start: 0.65, dur: 1.4 },
      { f: 329.63, start: 0.65, dur: 1.4 },
      { f: 392.00, start: 0.65, dur: 1.4 },
      { f: 523.25, start: 0.65, dur: 1.4 },
      { f: 659.25, start: 0.65, dur: 1.2 },
    ];

    notes.forEach((n) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, now + n.start);

      const noteVol = (n.start >= 0.65 ? 0.12 : 0.15) * this.volume;
      gain.gain.setValueAtTime(noteVol, now + n.start);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + n.start + n.dur);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + n.start);
      osc.stop(now + n.start + n.dur);
    });
  }

  // Windows 3.1 Shutdown Chime (Chimes.wav: descending gentle bell arpeggio)
  public playWindowsShutdown() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [
      { f: 783.99, start: 0.0, dur: 0.25 }, // G5
      { f: 659.25, start: 0.15, dur: 0.25 }, // E5
      { f: 523.25, start: 0.30, dur: 0.3 }, // C5
      { f: 392.00, start: 0.45, dur: 0.6 }, // G4
    ];

    notes.forEach((n) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(n.f, now + n.start);

      gain.gain.setValueAtTime(0.18 * this.volume, now + n.start);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + n.start + n.dur);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + n.start);
      osc.stop(now + n.start + n.dur);
    });
  }

  // Windows Ding / Alert sound
  public playDing() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1046.5, now); // C6

    gain.gain.setValueAtTime(0.2 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.4);
  }

  // Minesweeper click
  public playMineClick() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.02);

    gain.gain.setValueAtTime(0.1 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.02);
  }

  // Minesweeper explosion
  public playExplosion() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.6);

    gain.gain.setValueAtTime(0.3 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.65);
  }

  // Play a simple FM synth note (used by Media Player MIDI synth)
  public playMidiNote(freq: number, duration: number, when = 0) {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime + when;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // FM timbre
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.12 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + duration);
  }
}

export const retroAudio = new RetroAudioEngine();
