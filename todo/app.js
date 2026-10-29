'use strict';

/* ================= 工具 ================= */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const pad = n => String(n).padStart(2, '0');
const fmtDate = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const todayStr = () => fmtDate(new Date());
const parseDate = s => { const [a, b, c] = s.split('-').map(Number); return new Date(a, b - 1, c); };
const DAY = 86400000;
const daysBetween = (a, b) => Math.round((parseDate(b) - parseDate(a)) / DAY);
const WEEK = ['日', '一', '二', '三', '四', '五', '六'];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981', '#06b6d4', '#3b82f6'];

const SVG = {
  target: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="8.2"/><circle cx="12" cy="12" r="3" fill="currentColor" stroke="none"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7"/></svg>',
  skip: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 12h10M13 8.5 16.5 12 13 15.5"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 7h15M9.5 7V4.8h5V7M6.5 7l1 13.2h9l1-13.2M10 10.5v6M14 10.5v6"/></svg>',
  pencil: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 5.8l3.7 3.7L8 19.7H4.3V16zM13 7.3l3.7 3.7"/></svg>',
  flame: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2.5c.8 2.9-2.3 4.6-2.3 7.2a3.6 3.6 0 0 0 7.1.6c1.3-1.4 1.7-3.2 1.7-5 3 1.9 4.5 4.9 4.5 8a9 9 0 0 1-18 0c0-2.3 1.1-4.3 2.1-5.9.9 1 1.7 1.8 2.9 2.6.4-2.5 0-4.7 2-7.5z"/></svg>'
};

const ICONS = {
  heart: '<path d="M12 20.5S3.5 15.5 3.5 9.9C3.5 7 5.7 5 8.2 5c1.7 0 3 .9 3.8 2.4C12.8 5.9 14.1 5 15.8 5c2.5 0 4.7 2 4.7 4.9 0 5.6-8.5 10.6-8.5 10.6z"/>',
  cake: '<path d="M4 20h16M5 20v-6.5h14V20M5 13.5c0-2 2-2.5 2-4.5S5 7 5 5.5c0 1.5 2 2 2 3.5S5 11 5 13.5zm14 0c0-2-2-2.5-2-4.5s2-1.5 2-3c0 1.5-2 2-2 3.5s2 2 2 4zM12 20v-3"/>',
  ring: '<circle cx="12" cy="8.5" r="3.5"/><path d="M7.8 12.5C6.3 14.6 5.8 17.2 6.2 20M16.2 12.5c1.5 2.1 2 4.7 1.6 7.5"/>',
  home: '<path d="M4.5 10.5 12 4l7.5 6.5"/><path d="M6.5 9.5V20h11V9.5"/><path d="M10 20v-5.5h4V20"/>',
  plane: '<path d="M21.5 15.5v2l-8.5-2.5V19l2 1.5V22l-3-1-3 1v-1.5L11 19v-4L2.5 17.5v-2l8.5-3.5V6.5L9.5 5V3l2.5 1L14.5 3v2L13 6.5V12z"/>',
  gift: '<rect x="4" y="11" width="16" height="9" rx="1.2"/><path d="M3.5 7.5h17V11h-17zM12 7.5V20M12 7.5S7.5 8 7.5 5.3C7.5 3.4 9.6 2.8 12 7.5zm0 0s4.5.5 4.5-2.2c0-1.9-2.1-2.5-4.5 2.2z"/>',
  star: '<path d="M12 3.6l2.4 5.1 5.6.7-4.1 3.9 1.1 5.5L12 16l-5 2.8 1.1-5.5L4 9.4l5.6-.7z"/>',
  flag: '<path d="M6 21V4M6 4.5h11.5L14.8 8l2.7 3.5H6"/>',
  book: '<path d="M5.5 4.8C7.5 3.8 9.5 3.8 12 4.5c2.5-.7 4.5-.7 6.5.3v14.7c-2-1-4-1-6.5-.3-2.5-.7-4.5-.7-6.5.3z"/><path d="M12 4.5v14.7"/>',
  car: '<path d="M4.5 13.5 6 9.2A2 2 0 0 1 7.9 7.5h8.2a2 2 0 0 1 1.9 1.7l1.5 4.3"/><rect x="3.5" y="13.5" width="17" height="5.5" rx="1.5"/><path d="M6.8 19v-2M17.2 19v-2M8 11.5h.01M16 11.5h.01"/>',
  tree: '<path d="M12 3.5l4.6 6.5h-2.8l3.7 5h-11l3.7-5H7.4z"/><path d="M12 20v-4.5"/>',
  calendar: '<rect x="4" y="5.5" width="16" height="14.5" rx="2.5"/><path d="M8.5 3.5v4M15.5 3.5v4M4 10.5h16"/>',
  trophy: '<path d="M8.5 4.5h7v4.5a3.5 3.5 0 0 1-7 0z"/><path d="M8.5 6H5.5c0 2.6 1.6 4.6 4 5.4M15.5 6h3c0 2.6-1.6 4.6-4 5.4M12 13v3.5M8.8 20.5h6.4M10 16.8h4v3.7h-4z"/>',
  rocket: '<path d="M12 2.5c3 1.8 4.5 5.4 4.5 9.5l-2 1.5-.5 5.5h-4l-.5-5.5-2-1.5c0-4.1 1.5-7.7 4.5-9.5z"/><circle cx="12" cy="9.5" r="1.6"/><path d="M5.5 13.5c-1.5.7-2.5 1.8-2.8 3.2 1.4.6 2.7.5 3.8-.4M18.5 13.5c1.5.7 2.5 1.8 2.8 3.2-1.4.6-2.7.5-3.8-.4"/>'
};
const iconSvg = k => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${ICONS[k]}</svg>`;

/* ================= 存储 ================= */
const KEY = 'lifedriver.data.v1';
let db = load();
function load() {
  try {
    const d = JSON.parse(localStorage.getItem(KEY));
    if (d && Array.isArray(d.tasks)) return d;
  } catch (e) { /* 忽略损坏数据 */ }
  return { tasks: [], logs: {}, countdowns: [], taskSeq: 1, cdSeq: 1, activeTab: 'today' };
}
function save() { localStorage.setItem(KEY, JSON.stringify(db)); }
const uid = p => (db[p + 'Seq']++) + '-' + Date.now().toString(36);
const findTask = id => db.tasks.find(t => t.id === id);
const findCd = id => db.countdowns.find(c => c.id === id);

/* ================= 日程逻辑 ================= */
function repeatLabel(t) {
  if (t.repeat === 'daily') return '每日';
  if (t.repeat === 'weekly') return '每周' + t.weekdays.map(d => WEEK[d]).join('、');
  if (t.repeat === 'monthly') return `每月${t.monthDay}日`;
  return '一次性';
}
function isDueExactly(t, ds) {
  const d = parseDate(ds);
  switch (t.repeat) {
    case 'none': return t.date === ds;
    case 'daily': return true;
    case 'weekly': return t.weekdays.includes(d.getDay());
    case 'monthly': return t.monthDay === d.getDate();
  }
}
function isDueOn(t, ds) {
  return isDueExactly(t, ds) || (t.repeat === 'none' && t.date < ds);
}
function overdueDays(t) {
  return t.repeat === 'none' ? Math.max(0, daysBetween(t.date, todayStr())) : 0;
}
function nextDueDate(t) {
  if (t.repeat === 'none') return t.date;
  let d = parseDate(todayStr());
  for (let i = 0; i < 40; i++) {
    const ds = fmtDate(d);
    if (isDueExactly(t, ds)) return ds;
    d = new Date(d.getTime() + DAY);
  }
  return null;
}
function getLog(ds, id) { return db.logs[ds]?.[id]; }

/* ================= 渲染：日程 ================= */
function taskMeta(t) {
  const parts = [repeatLabel(t)];
  if (t.time) parts.push(t.time);
  if (t.note) parts.push(t.note);
  return { label: parts.join(' · '), ov: overdueDays(t) };
}

function dueCard(t) {
  const m = taskMeta(t);
  return `<div class="task-card" data-id="${t.id}">
    <div class="task-dot" style="--c:${t.color}">${SVG.target}</div>
    <div class="task-info">
      <p class="task-title">${esc(t.title)}</p>
      <p class="task-meta">${esc(m.label)}${m.ov ? `<span class="ov-badge">逾期 ${m.ov} 天</span>` : ''}</p>
    </div>
    <div class="task-act">
      <button class="btn-act skip" data-act="skip">跳过</button>
      <button class="btn-act done" data-act="done">完成</button>
    </div>
  </div>`;
}
function logRow(t) {
  const m = taskMeta(t);
  return `<div class="log-row" data-id="${t.id}">
    <span class="log-ic" style="--c:${t.color}">${SVG.check}</span>
    <div class="task-info">
      <p class="task-title strike">${esc(t.title)}</p>
      <p class="task-meta">${esc(m.label)}</p>
    </div>
  </div>`;
}

function renderToday() {
  const ts = todayStr();
  const due = [], done = [], skip = [];
  for (const t of db.tasks) {
    const l = getLog(ts, t.id);
    if (l === 'done') done.push(t);
    else if (l === 'skip') skip.push(t);
    else if (isDueOn(t, ts)) due.push(t);
  }
  due.sort((a, b) => {
    const oa = overdueDays(a), ob = overdueDays(b);
    if (oa !== ob) return ob - oa;
    if (a.time && b.time) return a.time < b.time ? -1 : 1;
    if (a.time) return -1;
    if (b.time) return 1;
    return 0;
  });
  const total = due.length + done.length + skip.length;

  $('#dueCount').textContent = due.length;
  $('#doneCount').textContent = done.length;
  $('#skipCount').textContent = skip.length;
  $('#dueList').innerHTML = due.map(dueCard).join('');
  $('#doneList').innerHTML = done.map(logRow).join('');
  $('#skipList').innerHTML = skip.map(logRow).join('');
  $('#dueEmpty').hidden = due.length > 0;
  $('#doneSec').hidden = done.length === 0;
  $('#skipSec').hidden = skip.length === 0;

  const ringWrap = $('#ringWrap');
  if (total > 0) {
    ringWrap.hidden = false;
    const C = 163.4;
    $('#ringFg').style.strokeDashoffset = C * (1 - done.length / total);
    $('#ringText').textContent = `${done.length}/${total}`;
  } else {
    ringWrap.hidden = true;
  }
}

function act(taskId, type) {
  const ts = todayStr();
  (db.logs[ts] ??= {})[taskId] = type;
  save();
  renderToday();
  renderStats();
  if (type === 'done') {
    const stillDue = db.tasks.some(t => isDueOn(t, ts) && !getLog(ts, t.id));
    if (!stillDue) { confetti(); toast('今天的日程全部完成，太棒了'); }
    else { const t = findTask(taskId); toast(`已完成「${t ? t.title : ''}」`); }
  } else {
    const t = findTask(taskId);
    toast(`已跳过「${t ? t.title : ''}」`);
  }
}

/* ================= 日程弹窗 ================= */
let editingTaskId = null;
const tmWeek = $('#tmWeek'), tmMonthDay = $('#tmMonthDay'), tmColors = $('#tmColors');

function setRepeat(r) {
  $$('#tmRepeat button').forEach(b => b.classList.toggle('active', b.dataset.r === r));
  $('#tmDateWrap').hidden = r !== 'none';
  $('#tmWeekWrap').hidden = r !== 'weekly';
  $('#tmMonthWrap').hidden = r !== 'monthly';
}
function curRepeat() { return $('#tmRepeat .active').dataset.r; }
function curWeekdays() { return $$('#tmWeek .active').map(b => +b.dataset.d); }
function curSwatch(el) { return el.querySelector('.active')?.dataset.c || COLORS[0]; }

function openTaskModal(task) {
  editingTaskId = task ? task.id : null;
  $('#tmTitle').textContent = task ? '编辑日程' : '新建日程';
  $('#tmName').value = task ? task.title : '';
  setRepeat(task ? task.repeat : 'none');
  $('#tmDate').value = task?.date || todayStr();
  $$('#tmWeek button').forEach(b => b.classList.toggle('active', (task?.weekdays || [1, 2, 3, 4, 5]).includes(+b.dataset.d)));
  tmMonthDay.value = task?.monthDay || 1;
  $('#tmTime').value = task?.time || '';
  $('#tmNote').value = task?.note || '';
  $$('#tmColors button').forEach(b => b.classList.toggle('active', b.dataset.c === (task?.color || COLORS[0])));
  $('#tmDelete').hidden = !task;
  openMask($('#taskModal'));
  setTimeout(() => $('#tmName').focus(), 320);
}

function saveTask() {
  const title = $('#tmName').value.trim();
  if (!title) { toast('请填写事项名称'); $('#tmName').focus(); return; }
  const repeat = curRepeat();
  const t = {
    title, repeat, color: curSwatch(tmColors),
    time: $('#tmTime').value, note: $('#tmNote').value.trim()
  };
  if (repeat === 'none') t.date = $('#tmDate').value || todayStr();
  if (repeat === 'weekly') {
    t.weekdays = curWeekdays();
    if (!t.weekdays.length) { toast('请至少选择一个星期'); return; }
  }
  if (repeat === 'monthly') t.monthDay = +tmMonthDay.value;
  if (editingTaskId) {
    Object.assign(findTask(editingTaskId), t);
  } else {
    t.id = uid('task');
    t.createdAt = todayStr();
    db.tasks.push(t);
  }
  save();
  closeMask($('#taskModal'));
  renderToday();
  renderStats();
  toast(editingTaskId ? '日程已更新' : '日程已添加');
  editingTaskId = null;
}

/* ================= 全部事项 ================= */
function renderAllSheet() {
  const ts = todayStr();
  const sorted = [...db.tasks].sort((a, b) => {
    if ((a.repeat === 'none') !== (b.repeat === 'none')) return a.repeat === 'none' ? 1 : -1;
    return a.createdAt < b.createdAt ? -1 : 1;
  });
  $('#allList').innerHTML = sorted.map(t => {
    const m = taskMeta(t);
    const nd = nextDueDate(t);
    let nextLabel;
    if (t.repeat === 'none') nextLabel = nd < ts ? '已逾期' : `下次 ${nd.slice(5).replace('-', '月')}日`;
    else nextLabel = `下次 ${nd.slice(5).replace('-', '月')}日`;
    return `<div class="all-row" data-id="${t.id}">
      <div class="task-dot small" style="--c:${t.color}">${SVG.target}</div>
      <div class="task-info">
        <p class="task-title">${esc(t.title)}</p>
        <p class="task-meta">${esc(m.label)} · ${nextLabel}</p>
      </div>
      <button class="icon-btn del" data-del>${SVG.trash}</button>
    </div>`;
  }).join('');
  $('#allEmpty').hidden = db.tasks.length > 0;
  $$('#allList .del').forEach(btn => bindTapConfirm(btn, () => {
    const id = btn.closest('.all-row').dataset.id;
    db.tasks = db.tasks.filter(t => t.id !== id);
    save(); renderToday(); renderStats(); renderAllSheet();
    toast('事项已删除');
  }));
  $$('#allList .all-row').forEach(row => row.addEventListener('click', e => {
    if (e.target.closest('[data-del]')) return;
    openTaskModal(findTask(row.dataset.id));
  }));
}

/* ================= 倒数日 ================= */
let editingCdId = null;
const cdmIcons = $('#cdmIcons'), cdmColors = $('#cdmColors');

function safeDate(y, m, d) {
  const dim = new Date(y, m + 1, 0).getDate();
  return new Date(y, m, Math.min(d, dim));
}
function cdInfo(c) {
  const ts = todayStr();
  if (c.type === 'anniv') {
    const t = parseDate(c.date);
    let y = new Date().getFullYear();
    let occ = safeDate(y, t.getMonth(), t.getDate());
    if (daysBetween(ts, fmtDate(occ)) < 0) { y++; occ = safeDate(y, t.getMonth(), t.getDate()); }
    const days = daysBetween(ts, fmtDate(occ));
    let years = y - t.getFullYear();
    if (days > 0) years--;
    return {
      days, today: days === 0, over: false,
      label: days === 0 ? '就是今天' : `距第 ${years + 1} 个周年`,
      dateLabel: `${c.date} · 已走过 ${years} 年`, prog: null
    };
  }
  const days = daysBetween(ts, c.date);
  const total = Math.max(1, daysBetween(c.createdAt, c.date));
  const elapsed = Math.max(1, daysBetween(c.createdAt, ts));
  const prog = Math.min(100, Math.round(elapsed / total * 100));
  if (days > 0) return { days, today: false, over: false, label: '天后', dateLabel: `目标 ${c.date}`, prog };
  if (days === 0) return { days: 0, today: true, over: false, label: '就是今天', dateLabel: c.date, prog: 100 };
  return { days: -days, today: false, over: true, label: '天前', dateLabel: `目标 ${c.date}`, prog: 100 };
}

function renderCountdowns() {
  const cards = db.countdowns
    .map(c => ({ c, info: cdInfo(c) }))
    .sort((a, b) => {
      const ka = a.info.over ? 100000 + a.info.days : a.info.days;
      const kb = b.info.over ? 100000 + b.info.days : b.info.days;
      return ka - kb;
    });
  $('#cdGrid').innerHTML = cards.map(({ c, info }) => {
    const cls = [info.today ? 'today' : '', info.over ? 'over' : ''].filter(Boolean).join(' ');
    return `<div class="cd-card ${cls}" style="--c:${c.color}" data-id="${c.id}">
      <div class="cd-head">
        <span class="cd-ic">${iconSvg(c.icon)}</span>
        <span class="cd-title">${esc(c.title)}</span>
        <button class="cd-edit" data-edit>${SVG.pencil}</button>
      </div>
      <div class="cd-days">${info.today ? '今天' : info.days}<small>${info.today ? '' : '天'}</small></div>
      <p class="cd-label">${info.label}</p>
      <p class="cd-date">${info.dateLabel}</p>
      ${info.prog !== null ? `<div class="cd-progress"><i style="width:${info.prog}%"></i></div>` : ''}
    </div>`;
  }).join('');
  $('#cdEmpty').hidden = db.countdowns.length > 0;
}

function openCdModal(cd) {
  editingCdId = cd ? cd.id : null;
  $('#cdmTitle').textContent = cd ? '编辑' : '添加倒数日';
  $('#cdmName').value = cd ? cd.title : '';
  const type = cd ? cd.type : 'countdown';
  $$('#cdmType button').forEach(b => b.classList.toggle('active', b.dataset.t === type));
  $('#cdmDate').value = cd ? cd.date : (type === 'countdown' ? fmtDate(new Date(Date.now() + 30 * DAY)) : todayStr());
  $$('#cdmIcons button').forEach(b => b.classList.toggle('active', b.dataset.ic === (cd?.icon || 'star')));
  $$('#cdmColors button').forEach(b => b.classList.toggle('active', b.dataset.c === (cd?.color || COLORS[0])));
  $('#cdmDelete').hidden = !cd;
  openMask($('#cdModal'));
  setTimeout(() => $('#cdmName').focus(), 320);
}

function saveCd() {
  const title = $('#cdmName').value.trim();
  if (!title) { toast('请填写名称'); $('#cdmName').focus(); return; }
  const date = $('#cdmDate').value;
  if (!date) { toast('请选择日期'); return; }
  const cd = {
    title, date, type: $('#cdmType .active').dataset.t,
    icon: cdmIcons.querySelector('.active')?.dataset.ic || 'star',
    color: curSwatch(cdmColors)
  };
  if (editingCdId) {
    Object.assign(findCd(editingCdId), cd);
  } else {
    cd.id = uid('cd');
    cd.createdAt = todayStr();
    db.countdowns.push(cd);
  }
  save();
  closeMask($('#cdModal'));
  renderCountdowns();
  toast(editingCdId ? '已更新' : '已添加');
  editingCdId = null;
}

/* ================= 统计 ================= */
function countAction(action) {
  let n = 0;
  for (const ds in db.logs)
    for (const v of Object.values(db.logs[ds]))
      if (v === action) n++;
  return n;
}
function hasDone(ds) {
  const l = db.logs[ds];
  return !!l && Object.values(l).some(v => v === 'done');
}
function overallStreak() {
  let d = new Date();
  if (!hasDone(fmtDate(d))) d = new Date(d.getTime() - DAY);
  let s = 0;
  while (s < 3650 && hasDone(fmtDate(d))) { s++; d = new Date(d.getTime() - DAY); }
  return s;
}
function taskStreaks(t) {
  const dates = [];
  for (const ds in db.logs) if (db.logs[ds][t.id] === 'done') dates.push(ds);
  dates.sort();
  let run = 0, best = 0, prev = null;
  for (const ds of dates) {
    run = (prev && daysBetween(prev, ds) === 1) ? run + 1 : 1;
    best = Math.max(best, run);
    prev = ds;
  }
  const yest = fmtDate(new Date(Date.now() - DAY));
  const cur = dates.length && (prev === todayStr() || prev === yest) ? run : 0;
  return { cur, best, total: dates.length };
}
function chartBars(points, maxH) {
  const max = Math.max(1, ...points.map(p => p.done + p.skip));
  return points.map(p => {
    const hd = p.done / max * maxH, hs = p.skip / max * maxH;
    return `<div class="bar-col${p.today ? ' today' : ''}">
      <div class="bar-stack">
        ${p.done ? `<div class="bar b-done" style="height:${Math.max(hd, 4)}px" title="完成 ${p.done}"></div>` : ''}
        ${p.skip ? `<div class="bar b-skip" style="height:${Math.max(hs, 3)}px" title="跳过 ${p.skip}"></div>` : ''}
        ${(!p.done && !p.skip) ? '<div class="bar b-none"></div>' : ''}
      </div>
      <span class="bar-label">${p.label}</span>
    </div>`;
  }).join('');
}

function renderStats() {
  const ts = todayStr();
  const tl = db.logs[ts] || {};
  let td = 0, tsk = 0;
  for (const v of Object.values(tl)) v === 'done' ? td++ : tsk++;
  $('#sTodayDone').textContent = td;
  $('#sTodaySkip').textContent = tsk;
  const allDone = countAction('done'), allSkip = countAction('skip');
  $('#sRate').textContent = (allDone + allSkip) ? Math.round(allDone / (allDone + allSkip) * 100) + '%' : '—';
  $('#sStreak').textContent = overallStreak();
  $('#statTotal').textContent = `累计完成 ${allDone} 次 · 累计跳过 ${allSkip} 次 · 共 ${db.tasks.length} 个事项`;

  const pts = [];
  let d = new Date(Date.now() - 13 * DAY);
  for (let i = 0; i < 14; i++) {
    const ds = fmtDate(d), l = db.logs[ds] || {};
    let dn = 0, sp = 0;
    for (const v of Object.values(l)) v === 'done' ? dn++ : sp++;
    pts.push({ label: `${d.getMonth() + 1}/${d.getDate()}`, done: dn, skip: sp, today: ds === ts });
    d = new Date(d.getTime() + DAY);
  }
  $('#chartDaily').innerHTML = chartBars(pts, 110);

  const mpts = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const ym = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    let dn = 0, sp = 0;
    for (let dd = new Date(ym); dd < end; dd = new Date(dd.getTime() + DAY)) {
      const l = db.logs[fmtDate(dd)] || {};
      for (const v of Object.values(l)) v === 'done' ? dn++ : sp++;
    }
    mpts.push({ label: `${ym.getMonth() + 1}月`, done: dn, skip: sp, today: false });
  }
  $('#chartMonthly').innerHTML = chartBars(mpts, 110);

  const rows = db.tasks
    .map(t => ({ t, s: taskStreaks(t) }))
    .filter(x => x.s.total > 0)
    .sort((a, b) => b.s.cur - a.s.cur || b.s.best - a.s.best || b.s.total - a.s.total);
  $('#streakList').innerHTML = rows.map(({ t, s }) => `
    <div class="streak-row">
      <div class="task-dot small" style="--c:${t.color}">${SVG.flame}</div>
      <div class="task-info">
        <p class="task-title">${esc(t.title)}</p>
        <p class="task-meta">${esc(repeatLabel(t))} · 累计 ${s.total} 次</p>
      </div>
      <div class="streak-stats">
        <span class="st-cur">${s.cur}</span>
        <span class="st-best">最佳 ${s.best} 天</span>
      </div>
    </div>`).join('');
  $('#streakEmpty').hidden = rows.length > 0;
}

/* ================= 弹层 / Toast / 彩带 ================= */
function openMask(el) { el.classList.add('show'); }
function closeMask(el) { el.classList.remove('show'); }

let toastTimer;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 1900);
}

function confetti() {
  const box = $('#confetti');
  for (let i = 0; i < 36; i++) {
    const p = document.createElement('span');
    p.className = 'confetti-piece';
    p.style.left = Math.random() * 100 + 'vw';
    p.style.width = (5 + Math.random() * 6) + 'px';
    p.style.height = (8 + Math.random() * 8) + 'px';
    p.style.background = COLORS[i % COLORS.length];
    p.style.animationDuration = (1.6 + Math.random() * 1.6) + 's';
    p.style.animationDelay = (Math.random() * .35) + 's';
    p.style.transform = `rotate(${Math.random() * 360}deg)`;
    box.appendChild(p);
    setTimeout(() => p.remove(), 4000);
  }
}

function bindTapConfirm(btn, onConfirm) {
  const orig = btn.innerHTML;
  let timer = null;
  btn.addEventListener('click', e => {
    e.stopPropagation();
    if (btn.classList.contains('confirm')) {
      clearTimeout(timer);
      btn.classList.remove('confirm');
      onConfirm();
    } else {
      btn.classList.add('confirm');
      btn.textContent = '确认删除';
      timer = setTimeout(() => { btn.classList.remove('confirm'); btn.innerHTML = orig; }, 2200);
    }
  });
}

/* ================= 标签切换 ================= */
function switchTab(name) {
  $$('.tab').forEach(b => b.classList.toggle('active', b.dataset.tab === name));
  $$('.page').forEach(p => p.classList.toggle('active', p.dataset.page === name));
  db.activeTab = name;
  save();
  if (name === 'stats') renderStats();
  if (name === 'countdown') renderCountdowns();
  if (name === 'today') renderToday();
}

/* ================= 初始化 ================= */
function buildStatic() {
  WEEK.forEach((w, i) => {
    const b = document.createElement('button');
    b.textContent = w;
    b.dataset.d = i;
    b.addEventListener('click', () => b.classList.toggle('active'));
    tmWeek.appendChild(b);
  });
  for (let i = 1; i <= 31; i++) tmMonthDay.add(new Option(i + ' 日', i));
  [tmColors, cdmColors].forEach(el => COLORS.forEach(c => {
    const b = document.createElement('button');
    b.dataset.c = c;
    b.style.background = c;
    b.style.setProperty('--sw', c);
    b.innerHTML = SVG.check;
    b.addEventListener('click', () => {
      el.querySelectorAll('button').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
    });
    el.appendChild(b);
  }));
  Object.keys(ICONS).forEach(k => {
    const b = document.createElement('button');
    b.dataset.ic = k;
    b.innerHTML = iconSvg(k);
    b.addEventListener('click', () => {
      cdmIcons.querySelectorAll('button').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
    });
    cdmIcons.appendChild(b);
  });
}

function bindEvents() {
  $$('.tab').forEach(b => b.addEventListener('click', () => switchTab(b.dataset.tab)));
  $('#fabAdd').addEventListener('click', () => openTaskModal());
  $('#btnAdd1').addEventListener('click', () => openTaskModal());
  $('#btnAdd2').addEventListener('click', () => openTaskModal());
  $('#btnAll').addEventListener('click', () => { renderAllSheet(); openMask($('#allSheet')); });
  $('#btnAddCd').addEventListener('click', () => openCdModal());
  $('#btnAddCd2').addEventListener('click', () => openCdModal());

  $$('#tmRepeat button').forEach(b => b.addEventListener('click', () => setRepeat(b.dataset.r)));
  $$('#cdmType button').forEach(b => b.addEventListener('click', () => {
    $$('#cdmType button').forEach(x => x.classList.toggle('active', x === b));
  }));
  $('#tmSave').addEventListener('click', saveTask);
  $('#cdmSave').addEventListener('click', saveCd);
  $('#tmName').addEventListener('keydown', e => { if (e.key === 'Enter') saveTask(); });
  $('#cdmName').addEventListener('keydown', e => { if (e.key === 'Enter') saveCd(); });
  bindTapConfirm($('#tmDelete'), () => {
    db.tasks = db.tasks.filter(t => t.id !== editingTaskId);
    save(); closeMask($('#taskModal')); renderToday(); renderStats();
    toast('事项已删除');
  });
  bindTapConfirm($('#cdmDelete'), () => {
    db.countdowns = db.countdowns.filter(c => c.id !== editingCdId);
    save(); closeMask($('#cdModal')); renderCountdowns();
    toast('已删除');
  });

  $('#dueList').addEventListener('click', e => {
    const card = e.target.closest('.task-card');
    if (!card) return;
    const btn = e.target.closest('[data-act]');
    if (btn) act(card.dataset.id, btn.dataset.act);
    else openTaskModal(findTask(card.dataset.id));
  });
  $('#cdGrid').addEventListener('click', e => {
    const card = e.target.closest('.cd-card');
    if (card) openCdModal(findCd(card.dataset.id));
  });

  $$('.mask').forEach(m => m.addEventListener('click', e => { if (e.target === m) closeMask(m); }));
  $$('[data-close]').forEach(b => b.addEventListener('click', () => closeMask(b.closest('.mask'))));
}

function init() {
  buildStatic();
  bindEvents();
  const h = new Date().getHours();
  $('#greet').textContent = h < 5 ? '夜深了' : h < 11 ? '早上好' : h < 14 ? '中午好' : h < 18 ? '下午好' : '晚上好';
  const n = new Date();
  $('#todayDate').textContent = `${n.getMonth() + 1}月${n.getDate()}日 · 星期${WEEK[n.getDay()]}`;
  switchTab(db.activeTab || 'today');
}
init();
