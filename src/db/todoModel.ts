import { Todo } from '../types'

const STORAGE_KEY = "todos-vuejs-2.0";
const todoStorage: any = {
  fetch() {
    const todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    todos.forEach((todo: Todo, index: number) => {
      todo.id = index;
    });
    todoStorage.uid = todos.length;
    return todos;
  },
  save(todos: Array<Todo>) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  },
};

export default todoStorage;