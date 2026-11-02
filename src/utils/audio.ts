/**
 * Subtle Ambient Soundscape Synthesizer
 * Uses Web Audio API to generate a gentle, meditative coastal wind & ocean swell.
 * Fully client-side, zero-dependency, and accessible.
 */

class AmbientSoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isPlaying = false;
  private noiseNode: AudioBufferSourceNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private lfo: OscillatorNode | null = null;
  private lfoGain: GainNode | null = null;
  private cachedBuffer: AudioBuffer | null = null;

  public init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    this.ctx = new AudioContextClass();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);
  }

  public toggle(): boolean {
    if (!this.isPlaying) {
      this.start();
      return true;
    } else {
      this.stop();
      return false;
    }
  }

  public start() {
    try {
      this.init();
      if (!this.ctx || !this.masterGain) return;

      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      // Reuse cached noise buffer to avoid main-thread freeze
      if (!this.cachedBuffer) {
        const bufferSize = this.ctx.sampleRate * 3;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          data[i] = (b0 + b1 + b2) * 0.11;
        }
        this.cachedBuffer = buffer;
      }

      this.noiseNode = this.ctx.createBufferSource();
      this.noiseNode.buffer = this.cachedBuffer;
      this.noiseNode.loop = true;

      // Resonant Lowpass filter to mimic coastal wind & sea spray
      this.filterNode = this.ctx.createBiquadFilter();
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.setValueAtTime(260, this.ctx.currentTime);
      this.filterNode.Q.setValueAtTime(2.2, this.ctx.currentTime);

      // Low Frequency Oscillator (LFO) for natural tidal swell cycle (every 6 seconds)
      this.lfo = this.ctx.createOscillator();
      this.lfo.frequency.setValueAtTime(0.16, this.ctx.currentTime); // ~6.2s wave period
      this.lfoGain = this.ctx.createGain();
      this.lfoGain.gain.setValueAtTime(140, this.ctx.currentTime); // modulate filter frequency between 120Hz and 400Hz

      this.lfo.connect(this.lfoGain);
      this.lfoGain.connect(this.filterNode.frequency);

      // Connect noise -> filter -> master
      this.noiseNode.connect(this.filterNode);
      this.filterNode.connect(this.masterGain);

      // Gentle fade in
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(0.001, now);
      this.masterGain.gain.exponentialRampToValueAtTime(0.28, now + 1.8);

      this.noiseNode.start();
      this.lfo.start();
      this.isPlaying = true;
    } catch {
      this.isPlaying = false;
    }
  }

  public stop() {
    if (!this.ctx || !this.masterGain || !this.isPlaying) return;
    try {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

      setTimeout(() => {
        try {
          this.noiseNode?.stop();
          this.lfo?.stop();
          this.noiseNode?.disconnect();
          this.lfo?.disconnect();
        } catch {
          // ignore already stopped
        }
        this.isPlaying = false;
      }, 850);
    } catch {
      this.isPlaying = false;
    }
  }

  public getStatus(): boolean {
    return this.isPlaying;
  }
}

export const ambientSound = new AmbientSoundEngine();
