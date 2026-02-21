import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'
import LoginPage from '@/views/LoginPage.vue' 

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login'
  },

  {
    path: '/login',
    component: LoginPage
  },

  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/tab1'
      },
      {
        path: 'tab1',
        component: () => import('@/views/Tab1Page.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'tab2',
        component: () => import('@/views/Tab2Page.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'tab3',
        component: () => import('@/views/Tab3Page.vue'),
        meta: { requiresAuth: true }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})
import { authService } from '@/auth/auth-service';

router.beforeEach(async (to) => {
  const user = await authService.getCurrentUser();

  // login แล้ว ห้ามเข้า /login
  if (to.path === "/login" && user) {
    return "/tabs/tab1";
  }

  // หน้าไหนต้อง login แต่ไม่มี user
  if (to.meta.requiresAuth && !user) {
    return "/login";
  }

  return true;
});
export default router
