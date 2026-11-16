import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createInitialTasks,
  toggleTask,
  deleteTask,
  calculateTotals,
  getVisibleTasks,
  validateTaskInput,
} from '../domain.mjs';

test('T1: исходное состояние 8 часов, 2 выполнено, 25%', () => {
  const tasks = createInitialTasks();
  const totals = calculateTotals(tasks);
  assert.equal(totals.totalHours, 8);
  assert.equal(totals.doneHours, 2);
  assert.equal(totals.progress, 25);
});

test('T2: отметка Практики дает 6 из 8 часов, 75%', () => {
  let tasks = createInitialTasks();
  tasks = toggleTask(tasks, '2');
  const totals = calculateTotals(tasks);
  assert.equal(totals.totalHours, 8);
  assert.equal(totals.doneHours, 6);
  assert.equal(totals.progress, 75);
});

test('T3: фильтр активных не меняет общий прогресс', () => {
  const tasks = createInitialTasks();
  const visible = getVisibleTasks(tasks, 'active');
  const totals = calculateTotals(tasks);
  assert.equal(visible.length, 2);
  assert.ok(visible.every((task) => !task.done));
  assert.equal(totals.totalHours, 8);
  assert.equal(totals.doneHours, 2);
  assert.equal(totals.progress, 25);
});

test('T4: пустое название и некорректные часы возвращают ошибки', () => {
  const tasksBefore = createInitialTasks();

  const emptyTitle = validateTaskInput({ title: '   ', hours: '2' });
  assert.equal(emptyTitle.ok, false);
  assert.ok(emptyTitle.errors.title);

  const emptyHours = validateTaskInput({ title: 'Задача', hours: '' });
  assert.equal(emptyHours.ok, false);
  assert.ok(emptyHours.errors.hours);

  const outOfRange = validateTaskInput({ title: 'Задача', hours: '0' });
  assert.equal(outOfRange.ok, false);
  assert.ok(outOfRange.errors.hours);

  const badStep = validateTaskInput({ title: 'Задача', hours: '1.3' });
  assert.equal(badStep.ok, false);
  assert.ok(badStep.errors.hours);

  const tasksAfter = createInitialTasks();
  assert.deepEqual(tasksAfter, tasksBefore);
});

test('T5: удаление всех задач дает 0 часов и 0%', () => {
  let tasks = createInitialTasks();
  for (const task of [...tasks]) {
    tasks = deleteTask(tasks, task.id);
  }
  const totals = calculateTotals(tasks);
  assert.equal(tasks.length, 0);
  assert.equal(totals.totalHours, 0);
  assert.equal(totals.doneHours, 0);
  assert.equal(totals.progress, 0);
  assert.ok(Number.isFinite(totals.progress));
});
