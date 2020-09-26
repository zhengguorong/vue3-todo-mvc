<template>
  <section class="todoapp">
    <header class="header">
      <h1>todos</h1>
      <input
        class="new-todo"
        autofocus
        autocomplete="off"
        placeholder="What needs to be done?"
        v-model="newTodo"
        @keyup.enter="addTodo(newTodo)"
      />
    </header>
    <section class="main">
      <input id="toggle-all" class="toggle-all" type="checkbox" />
      <label for="toggle-all"></label>
      <ul class="todo-list">
        <li
          class="todo"
          v-for="todo in filterTodos"
          :key="todo.id"
          :class="{ completed: todo.completed }"
        >
          <div class="view">
            <input class="toggle" type="checkbox" v-model="todo.completed" />
            <label>{{ todo.title }}</label>
            <button class="destroy" @click="removeTodo(todo)"></button>
          </div>
          <input class="edit" type="text" />
        </li>
      </ul>
    </section>
    <footer class="footer">
      <span class="todo-count">
        <strong>{{ remaining }} item</strong> {{ remaining }} left
      </span>
      <ul class="filters">
        <li>
          <a href="#/all" :class="{ selected: visibility == 'all' }">All</a>
        </li>
        <li>
          <a href="#/active" :class="{ selected: visibility == 'active' }"
            >Active</a
          >
        </li>
        <li>
          <a href="#/completed" :class="{ selected: visibility == 'completed' }"
            >Completed</a
          >
        </li>
      </ul>
      <button class="clear-completed" @click="removeCompleted">
        Clear completed
      </button>
    </footer>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from "vue";
import { Todo } from "@/types";
import todoStorage from "@/db/todoModel";
import { onBeforeRouteUpdate } from "vue-router";

function useTodo() {
  const todos = ref(todoStorage.fetch() || []);
  const newTodo = ref();
  const visibility = ref("all"); // 当前显示列表类型，有all、active、completed

  // 监听todos，自动保存
  watch(
    todos,
    (newVal) => {
      todoStorage.save(newVal);
    },
    { deep: true }
  );

  // 过滤不同类型数据
  const todoFilter = (type: string): Array<Todo> => {
    let filterTodo: Array<Todo>;
    if (type === "all") {
      filterTodo  = todos.value;
    } else if (type === "active") {
      filterTodo = todos.value.filter((todo: Todo) => {
        return !todo.completed;
      });
    } else {
      filterTodo = todos.value.filter((todo: Todo) => {
        return todo.completed;
      });
    }
    return filterTodo;
  };

  const filterTodos = computed(() => {
    return todoFilter(visibility.value)
  })

  // 未完成任务
  const remaining = computed(() => {
    const activeTodos = todoFilter('active')
    return activeTodos.length;
  });

  // 新增任务
  const addTodo = (todo: string) => {
    const value = todo && todo.trim();
    if (!value) {
      return;
    }
    todos.value.push({
      id: todoStorage.uid++,
      title: value,
      completed: false,
    });
    newTodo.value = "";
  };

  // 删除任务
  const removeTodo = (todo: Todo) => {
    todos.value.splice(todos.value.indexOf(todo), 1);
  };

  // 删除已完成项
  const removeCompleted = () => {
    todos.value = todoFilter('active')
  };

  // 监听路由切换事件
  onBeforeRouteUpdate((to) => {
    const hash = to.hash.replace(/#\/?/, "");
    visibility.value = hash;
  });

  return {
    todos,
    newTodo,
    visibility,
    remaining,
    addTodo,
    removeTodo,
    removeCompleted,
    filterTodos
  };
}

export default defineComponent({
  setup() {
    return useTodo();
  },
});
</script>



<style lang="scss" scoped>
@import "https://unpkg.com/todomvc-app-css@2.2.0/index.css";
</style>