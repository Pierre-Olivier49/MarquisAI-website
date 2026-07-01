/*
 * Voice demo audio player
 * A simple play/stop control for the AI voice agent sample recording.
 * Self-contained — does not depend on js/app.js.
 */
(function () {
  var btn = document.getElementById('voiceAudioBtn');
  var icon = document.getElementById('voiceAudioIcon');
  var audio = document.getElementById('voiceAudioEl');
  var wave = document.getElementById('voiceAudioWave');

  if (!btn || !icon || !audio) return;

  function setPlayingState(isPlaying) {
    btn.classList.toggle('is-playing', isPlaying);
    if (wave) wave.classList.toggle('active', isPlaying);
    icon.textContent = isPlaying ? '■' : '▶';
    btn.setAttribute('aria-label', isPlaying ? 'Arrêter la démo' : 'Écouter la démo');
  }

  btn.addEventListener('click', function () {
    if (audio.paused) {
      audio.play().catch(function () {
        setPlayingState(false);
      });
    } else {
      audio.pause();
      audio.currentTime = 0;
      setPlayingState(false);
    }
  });

  audio.addEventListener('playing', function () { setPlayingState(true); });
  audio.addEventListener('pause', function () { setPlayingState(false); });
  audio.addEventListener('ended', function () {
    audio.currentTime = 0;
    setPlayingState(false);
  });
  audio.addEventListener('error', function () {
    console.warn('Voice demo: could not load audio/demo_voice_adam_EL.mp3 — check the file is in the "audio" folder next to index.html.');
  });
})();