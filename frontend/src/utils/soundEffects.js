// Web Audio API Sound Effects (Zero external audio file dependencies)

let audioCtx = null;
let sosIntervalId = null;
let medReminderIntervalId = null;

const getAudioContext = () => {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

// 1. Subtle, pleasant chime for completing a dose
export const playSuccessChime = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(523.25, now); // C5
    osc1.frequency.exponentialRampToValueAtTime(659.25, now + 0.15); // E5

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(659.25, now + 0.15); // E5
    osc2.frequency.exponentialRampToValueAtTime(783.99, now + 0.35); // G5

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 0.15);
    osc2.start(now + 0.15);
    osc2.stop(now + 0.45);
  } catch (e) {
    // Audio context may be blocked by autoplay policies until user interacts
  }
};

// 2. Audible Medication Reminder Alarm (Melodic repeating chime)
export const playMedicationReminderAlarm = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    stopMedicationReminderAlarm(); // Clear any existing

    const playChimeSequence = () => {
      const now = ctx.currentTime;
      const notes = [587.33, 659.25, 783.99, 880.0]; // D5, E5, G5, A5
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 1.2);
      gain.connect(ctx.destination);

      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + index * 0.2);
        osc.connect(gain);
        osc.start(now + index * 0.2);
        osc.stop(now + index * 0.2 + 0.28);
      });
    };

    playChimeSequence();
    medReminderIntervalId = setInterval(playChimeSequence, 2500);
  } catch (e) {
    console.warn('Audio Reminder Alarm Error:', e);
  }
};

export const stopMedicationReminderAlarm = () => {
  if (medReminderIntervalId) {
    clearInterval(medReminderIntervalId);
    medReminderIntervalId = null;
  }
};

// 3. High-urgency audible in-app siren for Emergency SOS
export const startEmergencyAlarm = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    stopEmergencyAlarm(); // Clear any existing

    let highTone = true;
    const playTone = () => {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(highTone ? 880 : 660, now); // Alternating A5 / E5 siren
      highTone = !highTone;

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.28);
    };

    playTone();
    sosIntervalId = setInterval(playTone, 320);
  } catch (e) {
    console.error('Audio Alarm Error:', e);
  }
};

export const stopEmergencyAlarm = () => {
  if (sosIntervalId) {
    clearInterval(sosIntervalId);
    sosIntervalId = null;
  }
};
