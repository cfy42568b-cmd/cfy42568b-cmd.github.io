(() => {
  'use strict';
  const icons = {
    music: '<path d="M9 18V5l12-2v13M9 9l12-2"/><ellipse cx="6" cy="18" rx="3" ry="3"/><ellipse cx="18" cy="16" rx="3" ry="3"/>',
    play: '<path d="m9 5 11 7-11 7Z"/>', pause: '<path d="M8 5v14M16 5v14"/>',
    previous: '<path d="M5 5v14m14-14L8 12l11 7Z"/>', next: '<path d="M19 5v14M5 5l11 7-11 7Z"/>',
    close: '<path d="m6 6 12 12M6 18 18 6"/>', plus: '<path d="M12 5v14M5 12h14"/>',
    volume: '<path d="m11 4-6 5H2v6h3l6 5Zm4 4a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>',
  };
  const icon = name => `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]}</svg>`;
  const widget = document.createElement('div');
  widget.className = 'music-widget';
  widget.innerHTML = `
    <section class="music-panel" id="music-panel" aria-label="音乐播放器" hidden>
      <div class="music-panel-heading"><span>TAFFY'S LITTLE RADIO</span><button type="button" data-action="close" class="music-icon-button" aria-label="关闭音乐面板">${icon('close')}</button></div>
      <div class="music-now"><span class="music-record" aria-hidden="true">${icon('music')}</span><div><h2 class="music-track-title">给阅读加一点旋律</h2><p class="music-track-detail">选择喜欢的纯音乐</p></div></div>
      <div class="music-timeline"><input type="range" min="0" max="1000" step="1" value="0" aria-label="播放进度" class="music-seek" disabled><div><span class="music-current">0:00</span><span class="music-duration">0:00</span></div></div>
      <div class="music-controls"><button type="button" data-action="previous" class="music-icon-button" aria-label="上一首" disabled>${icon('previous')}</button><button type="button" data-action="play" class="music-play" aria-label="播放音乐" disabled>${icon('play')}</button><button type="button" data-action="next" class="music-icon-button" aria-label="下一首" disabled>${icon('next')}</button></div>
      <div class="music-volume"><label for="music-volume" aria-label="音量">${icon('volume')}</label><input id="music-volume" type="range" min="0" max="1" step="0.05" value="0.6" aria-label="音量"><span class="music-volume-value">60%</span></div>
      <div class="music-list-heading"><h3>我的纯音乐 <span class="music-count">0</span></h3><button type="button" data-action="import" class="music-add">${icon('plus')} 添加音乐</button></div>
      <ul class="music-list" aria-label="歌曲列表"></ul>
      <div class="music-empty"><p>选一首喜欢的纯音乐，陪你慢慢读。</p><button type="button" data-action="import" class="music-import-button">选择音频文件</button></div>
      <p class="music-feedback" role="status" aria-live="polite">本机选歌仅保存在当前浏览器，不会上传。</p>
      <input class="music-file-input" type="file" accept="audio/*,.mp3,.m4a,.aac,.ogg,.wav,.flac" multiple hidden aria-label="选择音乐文件">
    </section>
    <div class="music-dock"><button type="button" class="music-toggle" aria-label="展开音乐播放器" aria-controls="music-panel" aria-expanded="false"><span class="music-mini-record" aria-hidden="true">${icon('music')}</span><span><strong class="music-dock-title">Taffy 的纯音乐</strong><small class="music-dock-detail">添加喜欢的旋律</small></span></button><button type="button" class="music-dock-play" data-action="play" aria-label="播放音乐" disabled>${icon('play')}</button></div>`;
  document.body.append(widget);
  const audio = document.createElement('audio');
  audio.preload = 'metadata';
  widget.append(audio);
  const panel = widget.querySelector('.music-panel'), toggle = widget.querySelector('.music-toggle');
  const input = widget.querySelector('.music-file-input'), seek = widget.querySelector('.music-seek');
  const volume = widget.querySelector('#music-volume'), status = widget.querySelector('.music-feedback');
  let tracks = [], index = -1, database = null, resume = 0, lastSaved = 0, saved = {};
  try { saved = JSON.parse(localStorage.getItem('taffy-music-state') || '{}') || {}; } catch (_) {}
  audio.volume = Number.isFinite(saved.volume) ? Math.max(0, Math.min(1, saved.volume)) : 0.6;
  volume.value = audio.volume;
  widget.querySelector('.music-volume-value').textContent = `${Math.round(audio.volume * 100)}%`;
  const time = seconds => { const n = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0; return `${Math.floor(n / 60)}:${String(n % 60).padStart(2, '0')}`; };
  function save() {
    try { localStorage.setItem('taffy-music-state', JSON.stringify({ id: tracks[index]?.id, time: audio.currentTime || 0, volume: audio.volume })); } catch (_) {}
    lastSaved = Date.now();
  }
  function show(open, focus = false) {
    panel.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? '收起音乐播放器' : '展开音乐播放器');
    if (focus) (open ? panel.querySelector('[data-action="close"]') : toggle).focus();
  }
  function list() {
    const ul = widget.querySelector('.music-list');
    ul.replaceChildren();
    tracks.forEach((track, position) => {
      const li = document.createElement('li'), button = document.createElement('button');
      button.type = 'button'; button.className = 'music-track';
      button.setAttribute('aria-label', `播放 ${track.title}`);
      if (position === index) button.setAttribute('aria-current', 'true');
      const number = document.createElement('span'), title = document.createElement('span');
      number.className = 'music-track-number'; number.textContent = String(position + 1).padStart(2, '0'); title.textContent = track.title;
      button.append(number, title); button.addEventListener('click', () => select(position, true)); li.append(button);
      if (track.file) {
        const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'music-remove';
        remove.setAttribute('aria-label', `从本机歌单移除 ${track.title}`); remove.innerHTML = icon('close');
        remove.addEventListener('click', () => removeTrack(position)); li.append(remove);
      }
      ul.append(li);
    });
    widget.querySelector('.music-count').textContent = tracks.length;
    widget.querySelector('.music-empty').hidden = tracks.length > 0;
    widget.querySelectorAll('[data-action="play"], [data-action="previous"], [data-action="next"]').forEach(button => { button.disabled = !tracks.length; });
  }
  function playback() {
    const playing = !audio.paused && !audio.ended, track = tracks[index];
    widget.classList.toggle('is-playing', playing);
    widget.querySelectorAll('[data-action="play"]').forEach(button => { button.innerHTML = icon(playing ? 'pause' : 'play'); button.setAttribute('aria-label', playing ? '暂停音乐' : '播放音乐'); });
    widget.querySelector('.music-dock-title').textContent = track?.title || 'Taffy 的纯音乐';
    widget.querySelector('.music-dock-detail').textContent = track ? (playing ? '正在播放 · 点击展开' : '点击播放喜欢的旋律') : '添加喜欢的旋律';
    widget.querySelector('.music-track-title').textContent = track?.title || '给阅读加一点旋律';
    widget.querySelector('.music-track-detail').textContent = track ? (track.artist || '我的音乐 · 本机歌单') : '选择喜欢的纯音乐';
  }
  function timeline() {
    seek.disabled = !Number.isFinite(audio.duration) || audio.duration <= 0;
    seek.value = seek.disabled ? 0 : Math.round(audio.currentTime / audio.duration * 1000);
    seek.setAttribute('aria-valuetext', `${time(audio.currentTime)} / ${time(audio.duration)}`);
    widget.querySelector('.music-current').textContent = time(audio.currentTime); widget.querySelector('.music-duration').textContent = time(audio.duration);
  }
  async function play() {
    if (!tracks.length) return;
    try { await audio.play(); status.textContent = tracks[index].file ? '正在播放本机音乐，不会上传音频。' : '正在播放博客歌单。'; }
    catch (error) { if (error.name !== 'AbortError') status.textContent = '暂时无法播放，请点击重试或换一个音频文件。'; }
    playback();
  }
  function select(position, autoplay = false, start = 0) {
    if (!tracks.length) return;
    index = (position + tracks.length) % tracks.length; resume = Number.isFinite(start) ? start : 0;
    audio.src = tracks[index].url; audio.load(); list(); playback(); timeline();
    if (autoplay) void play();
  }
  function store(operation) {
    if (!database) return Promise.resolve(false);
    return new Promise((resolve, reject) => {
      const tx = database.transaction('tracks', 'readwrite'); operation(tx.objectStore('tracks'));
      tx.oncomplete = () => resolve(true); tx.onerror = tx.onabort = () => reject(tx.error || new Error('Storage unavailable'));
    });
  }
  async function removeTrack(position) {
    const playing = !audio.paused, removed = tracks[position];
    if (position === index) audio.pause();
    tracks.splice(position, 1); URL.revokeObjectURL(removed.url);
    try { await store(table => table.delete(removed.id)); } catch (_) { status.textContent = '已移除；浏览器未能保存这次修改。'; }
    if (!tracks.length) { index = -1; audio.removeAttribute('src'); audio.load(); list(); playback(); timeline(); }
    else if (position === index) select(Math.min(position, tracks.length - 1), playing);
    else { if (position < index) index -= 1; list(); }
    save();
  }
  input.addEventListener('change', async () => {
    input.disabled = true;
    let added = 0, persistent = Boolean(database);
    for (const file of [...input.files]) {
      if (!file.type.startsWith('audio/') && !/\.(mp3|m4a|aac|ogg|wav|flac)$/i.test(file.name)) continue;
      const id = `${file.name}:${file.size}:${file.lastModified}`;
      if (tracks.some(track => track.id === id)) continue;
      const record = { id, title: file.name.replace(/\.[^.]+$/, ''), file, added: Date.now() + added };
      tracks.push({ ...record, url: URL.createObjectURL(file) });
      try { if (!await store(table => table.put(record))) persistent = false; } catch (_) { persistent = false; }
      added += 1;
    }
    input.value = ''; input.disabled = false; list();
    if (index < 0 && tracks.length) select(0);
    status.textContent = added ? (persistent ? `已添加 ${added} 首，歌单已保存在当前浏览器。点击播放即可试听。` : `已添加 ${added} 首；浏览器未允许保存，刷新后需重新选择。`) : '没有添加新歌曲，请选择音频文件，或检查是否已在歌单中。';
  });
  toggle.addEventListener('click', () => show(panel.hidden));
  widget.addEventListener('click', event => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'close') show(false, true);
    if (action === 'import') input.click();
    if (action === 'play') { if (audio.paused) void play(); else audio.pause(); }
    if (action === 'previous') select(index - 1, true);
    if (action === 'next') select(index + 1, true);
  });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !panel.hidden) show(false, true); });
  volume.addEventListener('input', () => { audio.volume = Number(volume.value); widget.querySelector('.music-volume-value').textContent = `${Math.round(audio.volume * 100)}%`; save(); });
  seek.addEventListener('input', () => { if (Number.isFinite(audio.duration)) audio.currentTime = Number(seek.value) / 1000 * audio.duration; timeline(); });
  audio.addEventListener('loadedmetadata', () => { if (resume > 0 && resume < audio.duration) audio.currentTime = resume; resume = 0; timeline(); });
  audio.addEventListener('timeupdate', () => { timeline(); if (Date.now() - lastSaved > 3000) save(); });
  audio.addEventListener('play', playback); audio.addEventListener('pause', () => { playback(); save(); });
  audio.addEventListener('ended', () => select(index + 1, true));
  audio.addEventListener('error', () => { if (audio.getAttribute('src')) { status.textContent = '这个音频暂时无法播放，请尝试 MP3、M4A 或 WAV 格式。'; playback(); } });
  window.addEventListener('pagehide', save);
  async function initialize() {
    try {
      const response = await fetch('/music/playlist.json', { cache: 'no-cache', signal: AbortSignal.timeout(5000) });
      if (response.ok) {
        const publicTracks = await response.json();
        if (Array.isArray(publicTracks)) publicTracks.forEach((track, n) => {
          if (!track || typeof track.src !== 'string' || typeof track.title !== 'string') return;
          const url = new URL(track.src, location.href);
          if (url.protocol === 'https:' || (url.origin === location.origin && url.protocol === 'http:')) tracks.push({ id: `public:${n}:${url.href}`, title: track.title, artist: track.artist || '博客歌单', url: url.href });
        });
      }
    } catch (_) { /* Local imports work when the public playlist is unavailable. */ }
    try {
      database = await new Promise((resolve, reject) => {
        const request = indexedDB.open('taffy-local-music', 1);
        request.onupgradeneeded = () => request.result.createObjectStore('tracks', { keyPath: 'id' });
        request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error); request.onblocked = () => reject(new Error('Music storage busy'));
      });
      const records = await new Promise((resolve, reject) => {
        const request = database.transaction('tracks', 'readonly').objectStore('tracks').getAll();
        request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error);
      });
      records.sort((a, b) => a.added - b.added).forEach(track => tracks.push({ ...track, url: URL.createObjectURL(track.file) }));
    } catch (_) { status.textContent = '可从本机选歌；当前浏览器暂不支持保存音频。'; }
    const previous = tracks.findIndex(track => track.id === saved.id);
    if (tracks.length) select(previous < 0 ? 0 : previous, false, previous < 0 ? 0 : saved.time);
    list(); input.disabled = false;
    widget.querySelectorAll('[data-action="import"]').forEach(button => { button.disabled = false; });
  }
  input.disabled = true;
  widget.querySelectorAll('[data-action="import"]').forEach(button => { button.disabled = true; });
  void initialize();
})();
