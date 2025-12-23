<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useSettingsStore } from '../stores/settings'
import { useRouter } from 'vue-router'
import ConfirmDialog from '../components/ConfirmDialog.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'

const authStore = useAuthStore()
const settingsStore = useSettingsStore()
const router = useRouter()

const newEmail = ref('')
const message = ref('')
const error = ref('')
const showDeleteConfirm = ref(false)
const isLoading = ref(false)

const updateEmail = async () => {
  try {
    error.value = ''
    message.value = ''
    await authStore.updateEmail(newEmail.value)
    message.value = 'メールアドレスを更新しました'
    newEmail.value = ''
  } catch (e) {
    error.value = e.message
  }
}

const logout = async () => {
  try {
    isLoading.value = true
    await authStore.logout()
    await new Promise(resolve => setTimeout(resolve, 1000)) // Add delay for smooth transition
    router.push({ name: 'login' })
  } catch (e) {
    error.value = e.message
    isLoading.value = false
  }
}

const confirmDeleteAccount = () => {
  showDeleteConfirm.value = true
}

const handleDeleteConfirm = async () => {
  try {
    isLoading.value = true
    await authStore.deleteAccount()
    await new Promise(resolve => setTimeout(resolve, 1000)) // Add delay for smooth transition
    router.push({ 
      name: 'login',
      query: { message: 'アカウントを削除しました' }
    })
  } catch (e) {
    error.value = e.message
    isLoading.value = false
  } finally {
    showDeleteConfirm.value = false
  }
}

const handleDeleteCancel = () => {
  showDeleteConfirm.value = false
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <LoadingSpinner 
      v-if="isLoading" 
      :message="showDeleteConfirm ? 'アカウントを削除中...' : 'ログアウト中...'" 
    />
    
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          設定
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="updateEmail">
        <!-- Email Section -->
        <div class="space-y-4">
          <div class="bg-gray-50 p-4 rounded-lg">
            <div class="text-sm text-gray-600 mb-2">現在のメールアドレス:</div>
            <div class="font-medium text-gray-900">{{ authStore.currentUser?.email }}</div>
          </div>
          
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              メールアドレスを変更
            </label>
            <input
              id="email"
              v-model="newEmail"
              type="email"
              required
              class="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="新しいメールアドレスを入力"
            />
          </div>

          <button
            type="submit"
            class="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            メールアドレスを変更
          </button>
        </div>

        <!-- Settings Section -->
        <div class="pt-6 border-t space-y-4">
          <h3 class="text-lg font-medium text-gray-900 mb-4">表示設定</h3>
          
          <div class="flex items-center justify-between">
            <label class="block text-sm font-medium text-gray-700">タイムスタンプを表示</label>
            <button
              type="button"
              class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              :class="settingsStore.showTimestamps ? 'bg-indigo-600' : 'bg-gray-200'"
              @click="settingsStore.toggleTimestamps"
            >
              <span
                class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                :class="settingsStore.showTimestamps ? 'translate-x-5' : 'translate-x-0'"
              />
            </button>
          </div>

          <div class="flex items-center justify-between">
            <label class="block text-sm font-medium text-gray-700">URLプレビューを表示</label>
            <button
              type="button"
              class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              :class="settingsStore.showUrlPreviews ? 'bg-indigo-600' : 'bg-gray-200'"
              @click="settingsStore.toggleUrlPreviews"
            >
              <span
                class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                :class="settingsStore.showUrlPreviews ? 'translate-x-5' : 'translate-x-0'"
              />
            </button>
          </div>
        </div>

        <div v-if="message" class="text-green-500 text-sm text-center">
          {{ message }}
        </div>

        <div v-if="error" class="text-red-500 text-sm text-center">
          {{ error }}
        </div>

        <!-- Account Actions -->
        <div class="pt-6 border-t space-y-3">
          <button
            type="button"
            @click="logout"
            class="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            :disabled="isLoading"
          >
            ログアウト
          </button>

          <button
            type="button"
            @click="confirmDeleteAccount"
            class="w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-red-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            :disabled="isLoading"
          >
            アカウントを削除する
          </button>
        </div>
      </form>

      <ConfirmDialog
        :show="showDeleteConfirm"
        title="アカウントの削除"
        message="本当にアカウントを削除しますか？この操作は取り消せません。すべてのデータが永久に削除されます。"
        confirm-label="削除"
        confirm-class="bg-red-500 hover:bg-red-600"
        @confirm="handleDeleteConfirm"
        @cancel="handleDeleteCancel"
      />
    </div>
  </div>
</template>