let nextId = 1;

export function createInitialTasks() {
  return [
    { id: '1', title: 'Чтение', hours: 2, done: true },
    { id: '2', title: 'Практика', hours: 4, done: false },
    { id: '3', title: 'Повторение', hours: 2, done: false },
  ];
}

export function resetIdCounter(tasks = []) {
  const max = tasks.reduce((acc, task) => {
    const n = Number(task.id);
    return Number.isFinite(n) && n > acc ? n : acc;
  }, 0);
  nextId = max + 1;
}

function generateId() {
  const id = String(nextId);
  nextId += 1;
  return id;
}

export function addTask(tasks, taskInput) {
  const task = { id: generateId(), title: taskInput.title, hours: taskInput.hours, done: false };
  return [...tasks, task];
}

export function deleteTask(tasks, id) {
  return tasks.filter((task) => task.id !== id);
}

export function toggleTask(tasks, id) {
  return tasks.map((task) => (task.id === id ? { ...task, done: !task.done } : task));
}

export function validateTaskInput(input) {
  const errors = {};
  const rawTitle = input?.title ?? '';
  const rawHours = input?.hours;

  const title = String(rawTitle).trim();
  if (title.length === 0) {
    errors.title = 'Название не должно быть пустым';
  }

  let hours = null;
  const isEmptyHours = rawHours === '' || rawHours === null || rawHours === undefined;
  if (isEmptyHours) {
    errors.hours = 'Укажите количество часов';
  } else {
    const num = typeof rawHours === 'number' ? rawHours : Number(rawHours);
    if (!Number.isFinite(num)) {
      errors.hours = 'Часы должны быть числом';
    } else if (num < 0.5 || num > 24) {
      errors.hours = 'Часы должны быть от 0.5 до 24';
    } else {
      const scaled = Math.round(num * 2);
      if (Math.abs(scaled - num * 2) > 1e-9 || scaled < 1 || scaled > 48) {
        errors.hours = 'Часы должны быть с шагом 0.5';
      } else {
        hours = scaled / 2;
      }
    }
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors, values: { title: String(rawTitle), hours: rawHours ?? '' } };
  }

  return { ok: true, value: { title, hours } };
}

export function calculateTotals(tasks) {
  const totalHours = tasks.reduce((sum, task) => sum + task.hours, 0);
  const doneHours = tasks.reduce((sum, task) => sum + (task.done ? task.hours : 0), 0);
  const progress = totalHours === 0 ? 0 : Math.round((100 * doneHours) / totalHours);
  return { totalHours, doneHours, progress };
}

export function getVisibleTasks(tasks, filter) {
  if (filter === 'active') return tasks.filter((task) => !task.done);
  if (filter === 'done') return tasks.filter((task) => task.done);
  return [...tasks];
}
