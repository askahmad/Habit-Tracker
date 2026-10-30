import confetti from 'canvas-confetti';

let audioCtx = null;
let ambientAudioNode = null;
let ambientGainNode = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playSound(type = 'click', soundEnabled = true) {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.08);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'complete') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(659.25, now + 0.08);
      osc.frequency.setValueAtTime(880, now + 0.16);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'gong') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 1.2);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
      osc.start(now);
      osc.stop(now + 1.2);
    } else if (type === 'victory') {
      const chords = [523.25, 659.25, 783.99, 1046.50];
      chords.forEach((freq, idx) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(freq, now + idx * 0.08);
        g.gain.setValueAtTime(0.1, now + idx * 0.08);
        g.gain.linearRampToValueAtTime(0.001, now + idx * 0.08 + 0.3);
        o.connect(g);
        g.connect(ctx.destination);
        o.start(now + idx * 0.08);
        o.stop(now + idx * 0.08 + 0.3);
      });
    }
  } catch (e) {
    console.error('Audio synthesis error:', e);
  }
}

export function triggerConfetti() {
  try {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#38bdf8']
    });
  } catch (e) {
    // Canvas confetti fallback
  }
}

export function toggleAmbientNoise(on = false) {
  const ctx = getAudioContext();
  if (!ctx) return false;

  if (!on) {
    if (ambientGainNode) {
      ambientGainNode.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      setTimeout(() => {
        try {
          if (ambientAudioNode) ambientAudioNode.stop();
        } catch (e) {}
        ambientAudioNode = null;
        ambientGainNode = null;
      }, 500);
    }
    return false;
  }

  try {
    // Generate pink/zen noise + 432Hz binaural harmonic drone
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      output[i] = (b0 + b1 + b2) * 0.05;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter to make it sound like gentle ambient rain
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, ctx.currentTime);

    // Zen 432Hz sine drone
    const zenOsc = ctx.createOscillator();
    zenOsc.type = 'sine';
    zenOsc.frequency.setValueAtTime(216, ctx.currentTime); // 432Hz subharmonic

    const zenGain = ctx.createGain();
    zenGain.gain.setValueAtTime(0.015, ctx.currentTime);
    zenOsc.connect(zenGain);

    ambientGainNode = ctx.createGain();
    ambientGainNode.gain.setValueAtTime(0.001, ctx.currentTime);
    ambientGainNode.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 1);

    whiteNoise.connect(filter);
    filter.connect(ambientGainNode);
    zenGain.connect(ambientGainNode);
    ambientGainNode.connect(ctx.destination);

    whiteNoise.start();
    zenOsc.start();
    ambientAudioNode = whiteNoise;
    return true;
  } catch (err) {
    console.error('Ambient audio error:', err);
    return false;
  }
}

