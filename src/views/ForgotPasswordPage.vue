<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import LoadingSpinner from '../components/LoadingSpinner.vue'

const authStore = useAuthStore()
const email = ref('')
const message = ref('')
const error = ref('')
const isLoading = ref(false)

const requestReset = async () => {
  try {
    error.value = ''
    message.value = ''
    isLoading.value = true
    await authStore.requestPasswordReset(email.value)
    message.value = 'パスワード再設定用のリンクをメールで送信しました'
    email.value = ''
  } catch (e) {
    error.value = e.message
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <LoadingSpinner v-if="isLoading" message="処理中..." />
    
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          パスワードの再設定
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          登録したメールアドレスを入力してください
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="requestReset">
        <div>
          <label for="email" class="sr-only">メールアドレス</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            class="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
            placeholder="メールアドレス"
          />
        </div>

        <div>
          <button
            type="submit"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          >
            送信
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
            :to="{ name: 'login' }"
            class="font-medium text-gray-600 hover:text-gray-500"
          >
            ログイン画面に戻る
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>