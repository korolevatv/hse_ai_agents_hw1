export class TaskTrackerDomain {
  constructor() {
    this.tasks = [
      { id: 1, title: 'Чтение', hours: 2, done: true },
      { id: 2, title: 'Практика', hours: 4, done: false },
      { id: 3, title: 'Повторение', hours: 2, done: false }
    ];
  }

  addTask(title, hours) {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      throw new Error('Название задачи не может быть пустым');
    }

    if (hours < 0.5 || hours > 24 || (hours * 2) % 1 !== 0) {
      throw new Error('Часы должны быть числом от 0.5 до 24 с шагом 0.5');
    }

    const newId = Math.max(0, ...this.tasks.map(t => t.id)) + 1;
    this.tasks.push({ id: newId, title: trimmedTitle, hours, done: false });
  }

  deleteTask(id) {
    this.tasks = this.tasks.filter(task => task.id !== id);
  }

  toggleDone(id) {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.done = !task.done;
    }
  }

  getProgress() {
    if (this.tasks.length === 0) {
      return 0;
    }

    const totalHours = this.tasks.reduce((sum, task) => sum + task.hours, 0);
    const doneHours = this.tasks.reduce((sum, task) => sum + (task.done ? task.hours : 0), 0);

    return Math.round(100 * doneHours / totalHours);
  }

  getTotals() {
    const totalHours = this.tasks.reduce((sum, task) => sum + task.hours, 0);
    const doneHours = this.tasks.reduce((sum, task) => sum + (task.done ? task.hours : 0), 0);

    return { totalHours, doneHours };
  }

  getFilteredTasks(filter) {
    switch (filter) {
      case 'active':
        return this.tasks.filter(task => !task.done);
      case 'completed':
        return this.tasks.filter(task => task.done);
      default:
        return this.tasks;
    }
  }
}
