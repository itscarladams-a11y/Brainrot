/* The studio intro tracks real asset loads and waits for app initialization. */
(() => {
  const essentials = [
    './assets/brand/bantam-entertainment-logo.png',
    './assets/ui/brainrot-academy-logo.svg',
    './assets/brand/professor-brainrot-hero.webp',
    './assets/glorp.png'
  ];
  const startedAt = performance.now();
  const minimumMs = 2200;
  let assetsDone = 0, failures = 0, appReady = false, exiting = false;

  function update() {
    const percent = Math.round((assetsDone + Number(appReady)) / (essentials.length + 1) * 100);
    const bar = document.getElementById('bootProgress');
    const fill = document.getElementById('bootProgressFill');
    const label = document.getElementById('bootProgressLabel');
    const number = document.getElementById('bootPercent');
    if (bar) bar.setAttribute('aria-valuenow', String(percent));
    if (fill) fill.style.width = `${percent}%`;
    if (number) number.textContent = `${percent}%`;
    if (label) label.textContent = percent === 100
      ? (failures ? 'READY · SOME ART COULD NOT LOAD' : 'READY TO PLAY')
      : 'LOADING BRAINROT ACADEMY…';
    if (percent === 100 && !exiting) {
      exiting = true;
      clearTimeout(failureTimer);
      setTimeout(() => {
        const splash = document.getElementById('bootSplash');
        splash?.classList.add('done');
        setTimeout(() => splash?.remove(), 500);
      }, Math.max(0, minimumMs - (performance.now() - startedAt)));
    }
  }

  function preload(url) {
    const img = new Image();
    let settled = false;
    const timer = setTimeout(() => finish(false), 9000);
    function finish(ok) {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (!ok) failures++;
      assetsDone++;
      update();
    }
    img.onload = () => {
      if (typeof img.decode === 'function') img.decode().then(() => finish(true), () => finish(false));
      else finish(true);
    };
    img.onerror = () => finish(false);
    img.src = url;
  }

  window.brainrotBoot = {
    appReady() {
      if (appReady) return;
      appReady = true;
      update();
    }
  };
  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('bootRetryBtn')?.addEventListener('click', () => location.reload());
    update();
  }, {once: true});
  essentials.forEach(preload);
  const failureTimer = setTimeout(() => {
    if (appReady || exiting) return;
    const label = document.getElementById('bootProgressLabel');
    const retry = document.getElementById('bootRetryBtn');
    if (label) label.textContent = 'COULD NOT START THE GAME';
    if (retry) retry.hidden = false;
  }, 15000);
})();
