import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ChatbotView from '../views/ChatbotView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/chatbot',
    name: 'chatbot',
    component: ChatbotView,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
