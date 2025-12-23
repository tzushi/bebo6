<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import LoadingSpinner from '../components/LoadingSpinner.vue'

const router = useRouter()
const authStore = useAuthStore()

const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const isLoading = ref(false)

const resetPassword = async () => {
  try {
    error.value = ''
    
    if (password.value !== confirmPassword.value) {
      error.value = 'パスワードが一致しません'
      return
    }

    if (password.value.length < 8) {
      error.value = 'パスワードは8文字以上である必要があります'
      return
    }

    isLoading.value = true
    await authStore.resetPassword(password.value)
    router.push({ 
      name: 'login',
      query: { message: 'パスワードを変更しました。新しいパスワードでログインしてください。' }
    })
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
          新しいパスワードの設定
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="resetPassword">
        <div class="space-y-4">
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              新しいパスワード
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              class="mt-1 appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label for="confirm-password" class="block text-sm font-medium text-gray-700">
              新しいパスワード（確認）
            </label>
            <input
              id="confirm-password"
              v-model="confirmPassword"
              type="password"
              required
              class="mt-1 appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          >
            パスワードを変更
          </button>
        </div>

        <div v-if="error" class="text-red-500 text-sm text-center">
          {{ error }}
        </div>
      </form>
    </div>
  </div>
</template>