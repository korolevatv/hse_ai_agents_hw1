import test from 'node:test';
import assert from 'node:assert/strict';
import { TaskTrackerDomain } from '../domain.mjs';

test('T1: initial tasks have 3 tasks, 8 hours and 25% progress', () => {
  const tracker = new TaskTrackerDomain();
  assert.equal(tracker.tasks.length, 3);
  assert.deepEqual(tracker.getTotals(), { totalHours: 8, doneHours: 2 });
  assert.equal(tracker.getProgress(), 25);
});

test('T2: marking Practice done gives 75% progress', () => {
  const tracker = new TaskTrackerDomain();
  tracker.toggleDone(2);
  assert.equal(tracker.getProgress(), 75);
  assert.deepEqual(tracker.getTotals(), { totalHours: 8, doneHours: 6 });
});

test('T3: active filter does not change overall progress', () => {
  const tracker = new TaskTrackerDomain();
  const active = tracker.getFilteredTasks('active');
  assert.equal(active.length, 2);
  assert.equal(tracker.getProgress(), 25);
});

test('T4: invalid title and hours are rejected', () => {
  const tracker = new TaskTrackerDomain();
  assert.throws(() => tracker.addTask('   ', 2));
  assert.throws(() => tracker.addTask('Task', 0));
  assert.throws(() => tracker.addTask('Task', -1));
  assert.throws(() => tracker.addTask('Task', 24.5));
  assert.throws(() => tracker.addTask('Task', 0.7));
});

test('T4: valid boundaries 0.5 and 24 are accepted', () => {
  const tracker = new TaskTrackerDomain();
  tracker.addTask('Minimum', 0.5);
  tracker.addTask('Maximum', 24);
  assert.equal(tracker.tasks.length, 5);
});

test('T5: deleting all tasks gives 0 hours and 0%', () => {
  const tracker = new TaskTrackerDomain();
  tracker.deleteTask(1);
  tracker.deleteTask(2);
  tracker.deleteTask(3);
  assert.deepEqual(tracker.getTotals(), { totalHours: 0, doneHours: 0 });
  assert.equal(tracker.getProgress(), 0);
});

test('adding and deleting tasks works', () => {
  const tracker = new TaskTrackerDomain();
  tracker.addTask(' New task ', 1.5);
  assert.equal(tracker.tasks.length, 4);
  assert.equal(tracker.tasks[3].title, 'New task');
  tracker.deleteTask(4);
  assert.equal(tracker.tasks.length, 3);
});

test('toggleDone changes task status', () => {
  const tracker = new TaskTrackerDomain();
  tracker.toggleDone(2);
  assert.equal(tracker.tasks[1].done, true);
  tracker.toggleDone(2);
  assert.equal(tracker.tasks[1].done, false);
});
