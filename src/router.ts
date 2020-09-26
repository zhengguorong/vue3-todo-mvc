import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import TodoMVC from './views/TodoMVC.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'TodoMVC',
    component: TodoMVC
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;