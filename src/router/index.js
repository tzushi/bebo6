import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { supabase } from '../config/supabase'
import ChatMemo from '../components/ChatMemo.vue'
import WelcomePage from '../components/WelcomePage.vue'
import LoginPage from '../views/LoginPage.vue'
import SignupPage from '../views/SignupPage.vue'
import ForgotPasswordPage from '../views/ForgotPasswordPage.vue'
import ResetPasswordPage from '../views/ResetPasswordPage.vue'
import AccountMenu from '../components/AccountMenu.vue'
import EmailChange from '../components/EmailChange.vue'
import PasswordChange from '../components/PasswordChange.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
      meta: { requiresGuest: true }
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupPage,
      meta: { requiresGuest: true }
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: ForgotPasswordPage,
      meta: { requiresGuest: true }
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: ResetPasswordPage,
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      name: 'home',
      component: WelcomePage,
      meta: { requiresAuth: true }
    },
    {
      path: '/memo/:id',
      name: 'memo',
      component: ChatMemo,
      props: route => ({ chatMemoId: Number(route.params.id) }),
      meta: { requiresAuth: true }
    },
    {
      path: '/account',
      name: 'account',
      component: AccountMenu,
      meta: { requiresAuth: true }
    },
    {
      path: '/account/email',
      name: 'email-change',
      component: EmailChange,
      meta: { requiresAuth: true }
    },
    {
      path: '/account/password',
      name: 'password-change',
      component: PasswordChange,
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  if (!authStore.authInitialized) {
    await authStore.initializeFromStorage()
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router