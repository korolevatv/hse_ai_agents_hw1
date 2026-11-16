import {
  createInitialTasks,
  resetIdCounter,
  addTask,
  deleteTask,
  toggleTask,
  validateTaskInput,
  calculateTotals,
  getVisibleTasks,
} from './domain.mjs';

const form = document.getElementById('task-form');
const titleInput = document.getElementById('title-input');
const hoursInput = document.getElementById('hours-input');
const titleError = document.getElementById('title-error');
const hoursError = document.getElementById('hours-error');
const taskList = document.getElementById('task-list');
const emptyState = document.getElementById('empty-state');
const totalHoursEl = document.getElementById('total-hours');
const doneHoursEl = document.getElementById('done-hours');
const progressEl = document.getElementById('progress');
const filterButtons = Array.from(document.querySelectorAll('.filter-btn'));

let tasks = createInitialTasks();
resetIdCounter(tasks);
let currentFilter = 'all';

function clearErrors() {
  titleError.textContent = '';
  hoursError.textContent = '';
}

function renderTotals() {
  const { totalHours, doneHours, progress } = calculateTotals(tasks);
  totalHoursEl.textContent = String(totalHours);
  doneHoursEl.textContent = String(doneHours);
  progressEl.textContent = `${progress}%`;
}

function renderFilters() {
  for (const btn of filterButtons) {
    const active = btn.dataset.filter === currentFilter;
    btn.classList.toggle('is-active', active);
    btn.setAttribute('aria-pressed', String(active));
  }
}

function renderTasks() {
  const visible = getVisibleTasks(tasks, currentFilter);
  taskList.innerHTML = '';

  if (visible.length === 0) {
    emptyState.hidden = false;
    return;
  }
  emptyState.hidden = true;

  for (const task of visible) {
    const li = document.createElement('li');
    li.className = `task-item${task.done ? ' done' : ''}`;

    const main = document.createElement('div');
    main.className = 'task-main';

    const title = document.createElement('p');
    title.className = 'task-title';
    title.textContent = task.title;

    const meta = document.createElement('p');
    meta.className = 'task-meta';
    meta.textContent = `${task.hours} ч · ${task.done ? 'выполнено' : 'активна'}`;

    main.append(title, meta);

    const actions = document.createElement('div');
    actions.className = 'task-actions';

    const toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.className = 'task-btn toggle-btn';
    toggleBtn.dataset.id = task.id;
    toggleBtn.textContent = task.done ? 'Снять отметку' : 'Отметить выполненной';
    toggleBtn.setAttribute('aria-label', `${toggleBtn.textContent}: ${task.title}`);

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'task-btn delete-btn';
    deleteBtn.dataset.id = task.id;
    deleteBtn.textContent = 'Удалить';
    deleteBtn.setAttribute('aria-label', `Удалить задачу: ${task.title}`);

    actions.append(toggleBtn, deleteBtn);
    li.append(main, actions);
    taskList.append(li);
  }
}

function render() {
  renderTotals();
  renderFilters();
  renderTasks();
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  clearErrors();

  const rawTitle = titleInput.value;
  const rawHours = hoursInput.value;
  const result = validateTaskInput({ title: rawTitle, hours: rawHours });

  if (!result.ok) {
    titleInput.value = String(rawTitle);
    hoursInput.value = rawHours ?? '';
    if (result.errors.title) titleError.textContent = result.errors.title;
    if (result.errors.hours) hoursError.textContent = result.errors.hours;
    return;
  }

  tasks = addTask(tasks, result.value);
  form.reset();
  clearErrors();
  render();
});

for (const btn of filterButtons) {
  btn.addEventListener('click', () => {
    currentFilter = btn.dataset.filter || 'all';
    render();
  });
}

taskList.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const id = target.dataset.id;
  if (!id) return;

  if (target.classList.contains('toggle-btn')) {
    tasks = toggleTask(tasks, id);
    render();
  } else if (target.classList.contains('delete-btn')) {
    tasks = deleteTask(tasks, id);
    render();
  }
});

render();
