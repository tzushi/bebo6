<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import LegalLinks from '../components/LegalLinks.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import TypeWriter from '../components/TypeWriter.vue'
import AppFooter from '../components/AppFooter.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')
const message = ref('')
const isLoading = ref(false)

onMounted(() => {
  if (route.query.message) {
    message.value = route.query.message
    setTimeout(() => {
      message.value = ''
    }, 5000)
  }
})

const login = async () => {
  try {
    error.value = ''
    isLoading.value = true
    await authStore.login(email.value, password.value)
    await new Promise(resolve => setTimeout(resolve, 1000))
    router.push(route.query.redirect || { name: 'home' })
  } catch (e) {
    error.value = e.message
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-white">
    <LoadingSpinner v-if="isLoading" message="ログイン中..." />

    <!-- Header -->
    <header class="bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div class="flex items-center">
          <img 
            src="/pwa-192x192.png" 
            alt="bebo6" 
            class="h-10 w-10 rounded-lg"
          />
          <h1 class="ml-3 text-xl font-bold text-gray-900">bebo6</h1>
        </div>
        <router-link
          :to="{ name: 'signup' }"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-900"
        >
          新規登録
        </router-link>
      </div>
    </header>

    <!-- Hero Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="lg:grid lg:grid-cols-12 lg:gap-8">
        <!-- Left Column -->
        <div class="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
          <h1>
            <span class="block text-base sm:text-lg font-semibold uppercase tracking-wide text-gray-500">
              チャット形式のメモアプリ
            </span>
            <span class="mt-1 block text-4xl tracking-tight font-extrabold sm:text-5xl xl:text-6xl">
              <TypeWriter text="自分との対話で思考を整理する" />
            </span>
          </h1>
          <p class="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
            bebo6（ビーボシックス、ビーボロク）は、あなたの思考をチャット形式で記録できる新しいメモアプリです。
            自分との対話を通じて、アイデアを整理し、考えを深めることができます。
          </p>
          <div class="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left">
            <p class="text-base font-bold text-gray-900">
              bebo6の6つの大切なこと
            </p>
            <div class="mt-3 grid grid-cols-1 gap-3 sm:gap-4">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p class="ml-3 text-sm text-gray-700">
                  正確性 Accuracy
                </p>
              </div>
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p class="ml-3 text-sm text-gray-700">
                  迅速性 Promptness
                </p>
              </div>
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p class="ml-3 text-sm text-gray-700">
                  簡潔性 Conciseness
                </p>
              </div>
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p class="ml-3 text-sm text-gray-700">
                  定期性 Periodicity
                </p>
              </div>
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p class="ml-3 text-sm text-gray-700">
                  整理性 Systematization
                </p>
              </div>
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p class="ml-3 text-sm text-gray-700">
                  柔軟性 Flexibility
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column (Login Form) -->
        <div class="mt-12 sm:mt-16 lg:mt-0 lg:col-span-6">
          <div class="bg-white sm:max-w-md sm:w-full sm:mx-auto sm:rounded-lg sm:overflow-hidden shadow-xl">
            <div class="px-4 py-8 sm:px-10">
              <div>
                <h2 class="text-2xl font-bold text-center text-gray-900 mb-8">
                  ログイン
                </h2>
              </div>

              <div class="mt-6">
                <form class="space-y-6" @submit.prevent="login">
                  <div>
                    <label for="email" class="block text-sm font-medium text-gray-700">
                      メールアドレス
                    </label>
                    <div class="mt-1">
                      <input
                        id="email"
                        v-model="email"
                        type="email"
                        required
                        class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                        placeholder="example@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label for="password" class="block text-sm font-medium text-gray-700">
                      パスワード
                    </label>
                    <div class="mt-1">
                      <input
                        id="password"
                        v-model="password"
                        type="password"
                        required
                        class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div class="flex items-center justify-between">
                    <div class="text-sm">
                      <router-link
                        :to="{ name: 'forgot-password' }"
                        class="font-medium text-gray-600 hover:text-gray-500"
                      >
                        パスワードをお忘れですか？
                      </router-link>
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                      :disabled="isLoading"
                    >
                      ログイン
                    </button>
                  </div>

                  <div v-if="message" class="text-green-500 text-sm text-center">
                    {{ message }}
                  </div>

                  <div v-if="error" class="text-red-500 text-sm text-center">
                    {{ error }}
                  </div>

                  <div class="text-center text-sm">
                    <router-link
                      :to="{ name: 'signup' }"
                      class="font-medium text-gray-600 hover:text-gray-500"
                    >
                      新規登録はこちら
                    </router-link>
                  </div>
                </form>
              </div>
            </div>
            <div class="px-4 py-6 bg-gray-50 border-t-2 border-gray-200 sm:px-10 space-y-4">
              <LegalLinks />
              <AppFooter />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>