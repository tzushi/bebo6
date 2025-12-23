<template>
  <div class="min-h-screen bg-gray-100 flex items-start justify-center px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-6 rounded-lg shadow mt-4">
      <form class="space-y-6" @submit.prevent="handleSubmit">
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

        <div>
          <label for="new-password" class="block text-sm font-medium text-gray-700">
            新しいパスワード
          </label>
          <input
            id="new-password"
            v-model="newPassword"
            type="password"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
            placeholder="新しいパスワードを入力"
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
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
            placeholder="新しいパスワードを再入力"
          />
        </div>

        <button
          type="submit"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? '処理中...' : 'パスワードを変更' }}
        </button>

        <div v-if="error" class="text-red-500 text-sm text-center">
          {{ error }}
        </div>

        <div v-if="message" class="text-green-500 text-sm text-center">
          {{ message }}
        </div>
      </form>
    </div>

    <SuccessDialog
      :show="showSuccessDialog"
      title="パスワード変更"
      message="パスワードを変更しました"
      @confirm="handleSuccessConfirm"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { validatePassword } from '../utils/passwordValidation'
import { useMessage } from '../composables/useMessage'
import SuccessDialog from './SuccessDialog.vue'

const router = useRouter()
const authStore = useAuthStore()
const { message, error, showMessage, showError } = useMessage()

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const isSubmitting = ref(false)
const showSuccessDialog = ref(false)

const handleSubmit = async () => {
  try {
    error.value = ''
    isSubmitting.value = true

    // パスワードの一致確認
    if (newPassword.value !== confirmPassword.value) {
      showError('新しいパスワードが一致しません')
      return
    }

    // パスワードのバリデーション
    const validationErrors = validatePassword(currentPassword.value, newPassword.value, confirmPassword.value)
    if (validationErrors.length > 0) {
      showError(validationErrors[0])
      return
    }

    await authStore.updatePassword(currentPassword.value, newPassword.value)
    showSuccessDialog.value = true
  } catch (e) {
    showError(e.message)
  } finally {
    isSubmitting.value = false
  }
}

const handleSuccessConfirm = () => {
  router.push({ name: 'home' })
}
</script>