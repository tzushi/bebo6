<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import SuccessDialog from './SuccessDialog.vue'
import LoadingSpinner from './LoadingSpinner.vue'

const router = useRouter()
const authStore = useAuthStore()
const newEmail = ref('')
const currentPassword = ref('')
const error = ref('')
const isSubmitting = ref(false)
const showSuccessDialog = ref(false)

const handleSubmit = async () => {
  try {
    error.value = ''
    isSubmitting.value = true

    await authStore.updateEmail(newEmail.value, currentPassword.value)
    showSuccessDialog.value = true
  } catch (e) {
    error.value = e.message
  } finally {
    isSubmitting.value = false
  }
}

const handleSuccessConfirm = async () => {
  await authStore.logout()
  router.push({ 
    name: 'login',
    query: { message: 'メールアドレスの変更を確認するメールを送信しました。メール内のリンクをクリックして変更を完了してください。' }
  })
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex items-start justify-center px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-6 rounded-lg shadow mt-4">
      <div class="space-y-6">
        <div v-if="authStore.currentUser" class="bg-gray-50 p-4 rounded-lg">
          <div class="text-sm text-gray-600 mb-2">現在のメールアドレス:</div>
          <div class="font-medium text-gray-900">{{ authStore.currentUser.email }}</div>
        </div>

        <form class="space-y-6" @submit.prevent="handleSubmit">
          <div>
            <label for="new-email" class="block text-sm font-medium text-gray-700">
              新しいメールアドレス
            </label>
            <input
              id="new-email"
              v-model="newEmail"
              type="email"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
              placeholder="新しいメールアドレスを入力"
            />
          </div>

          <div>
            <label for="current-password" class="block text-sm font-medium text-gray-700">
              現在のパスワード
            </label>
            <input
              id="current-password"
              v-model="currentPassword"
              type="password"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
              placeholder="現在のパスワードを入力"
            />
          </div>

          <button
            type="submit"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? '処理中...' : 'メールアドレスを変更' }}
          </button>

          <div v-if="error" class="text-red-500 text-sm text-center">
            {{ error }}
          </div>
        </form>
      </div>
    </div>

    <SuccessDialog
      :show="showSuccessDialog"
      title="メールアドレス変更"
      message="メールアドレス変更を確認するメールを送信しました。メール内のリンクをクリックして変更を完了してください。"
      @confirm="handleSuccessConfirm"
    />

    <LoadingSpinner 
      v-if="isSubmitting" 
      message="処理中..." 
    />
  </div>
</template>