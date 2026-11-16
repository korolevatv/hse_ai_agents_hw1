import { TaskTrackerDomain } from './domain.mjs';

const tracker = new TaskTrackerDomain();

const form = document.querySelector('#task-form');
const titleInput = document.querySelector('#task-title');
const hoursInput = document.querySelector('#task-hours');
const titleError = document.querySelector('#title-error');
const hoursError = document.querySelector('#hours-error');

const taskList = document.querySelector('#task-list');
const filterSelect = document.querySelector('#task-filter');
const emptyMessage = document.querySelector('#empty-message');

const totalHoursElement = document.querySelector('#total-hours');
const doneHoursElement = document.querySelector('#done-hours');
const progressElement = document.querySelector('#progress');
const progressBar = document.querySelector('#progress-bar');

function renderStats() {
  const totals = tracker.getTotals();
  const progress = tracker.getProgress();

  totalHoursElement.textContent = totals.totalHours;
  doneHoursElement.textContent = totals.doneHours;
  progressElement.textContent = `${progress}%`;
  progressBar.style.width = `${progress}%`;
  progressBar.setAttribute('aria-valuenow', String(progress));
}

function renderTasks() {
  const filter = filterSelect.value;
  const tasks = tracker.getFilteredTasks(filter);

  taskList.innerHTML = '';

  tasks.forEach((task) => {
    const item = document.createElement('li');
    item.className = `task-item${task.done ? ' completed' : ''}`;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.checked = task.done;
    checkbox.setAttribute('aria-label', `Отметить задачу «${task.title}» выполненной`);

    checkbox.addEventListener('change', () => {
      tracker.toggleDone(task.id);
      render();
    });

    const info = document.createElement('div');
    info.className = 'task-info';

    const title = document.createElement('div');
    title.className = 'task-title';
    title.textContent = task.title;

    const hours = document.createElement('div');
    hours.className = 'task-hours';
    hours.textContent = `${task.hours} ч.`;

    info.append(title, hours);

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'delete-button';
    deleteButton.textContent = 'Удалить';
    deleteButton.setAttribute('aria-label', `Удалить задачу «${task.title}»`);

    deleteButton.addEventListener('click', () => {
      tracker.deleteTask(task.id);
      render();
    });

    item.append(checkbox, info, deleteButton);
    taskList.append(item);
  });

  emptyMessage.hidden = tasks.length !== 0;
}

function render() {
  renderStats();
  renderTasks();
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  titleError.textContent = '';
  hoursError.textContent = '';

  const title = titleInput.value;
  const rawHours = hoursInput.value;
  const hours = Number(rawHours);

  let hasError = false;

  if (!title.trim()) {
    titleError.textContent = 'Введите название задачи.';
    hasError = true;
  }

  if (
    rawHours.trim() === '' ||
    !Number.isFinite(hours) ||
    hours < 0.5 ||
    hours > 24 ||
    (hours * 2) % 1 !== 0
  ) {
    hoursError.textContent = 'Введите число от 0.5 до 24 с шагом 0.5.';
    hasError = true;
  }

  if (hasError) {
    return;
  }

  tracker.addTask(title, hours);

  form.reset();
  render();
  titleInput.focus();
});

filterSelect.addEventListener('change', renderTasks);

render();
