/** Browser-only alert preview. Real notifications will be triggered by API events. */
export function playPreviewTone() {
  const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return;
  const context = new AudioContextClass();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(740, context.currentTime);
  oscillator.frequency.setValueAtTime(980, context.currentTime + .11);
  gain.gain.setValueAtTime(.0001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(.08, context.currentTime + .015);
  gain.gain.exponentialRampToValueAtTime(.0001, context.currentTime + .25);
  oscillator.connect(gain).connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + .27);
  oscillator.addEventListener("ended", () => void context.close());
}
