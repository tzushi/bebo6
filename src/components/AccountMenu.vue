<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import ConfirmDialog from './ConfirmDialog.vue'
import PasswordConfirmDialog from './PasswordConfirmDialog.vue'
import LoadingSpinner from './LoadingSpinner.vue'

const router = useRouter()
const authStore = useAuthStore()
const showDeleteConfirm = ref(false)
const showPasswordConfirm = ref(false)
const isLoading = ref(false)
const loadingMessage = ref('')

const donationUrl = computed(() => import.meta.env.VITE_DONATION_URL)

const handleLogout = async () => {
  try {
    isLoading.value = true
    loadingMessage.value = 'ログアウト中...'
    await authStore.logout()
    await new Promise(resolve => setTimeout(resolve, 1000))
    router.push({ name: 'login' })
  } catch (error) {
    console.error('Logout error:', error)
  }
}

const confirmDeleteAccount = () => {
  showDeleteConfirm.value = true
}

const handleDeleteConfirm = () => {
  showDeleteConfirm.value = false
  showPasswordConfirm.value = true
}

const handlePasswordConfirm = async () => {
  try {
    isLoading.value = true
    loadingMessage.value = 'アカウントを削除中...'
    await authStore.deleteAccount()
    await new Promise(resolve => setTimeout(resolve, 1000))
    router.push({ 
      name: 'login',
      query: { message: 'アカウントを削除しました' }
    })
  } catch (error) {
    console.error('Delete account error:', error)
  } finally {
    showPasswordConfirm.value = false
  }
}

const handleDeleteCancel = () => {
  showDeleteConfirm.value = false
  showPasswordConfirm.value = false
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex items-start justify-center px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-4 bg-white p-6 rounded-lg shadow mt-4">
      <div class="space-y-3">
        <!-- Menu Items -->
        <router-link
          :to="{ name: 'email-change' }"
          class="block w-full text-left px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          メールアドレス変更
        </router-link>

        <router-link
          :to="{ name: 'password-change' }"
          class="block w-full text-left px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          パスワード変更
        </router-link>

        <a
          :href="donationUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="block w-full text-left px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          寄付でサポート
        </a>

        <a
          href="https://easyp.cc"
          target="_blank"
          rel="noopener noreferrer"
          class="block w-full text-left px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          運営会社
        </a>

        <a
          href="https://forms.gle/HUamk6mRiVVK8sT26"
          target="_blank"
          rel="noopener noreferrer"
          class="block w-full text-left px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          お問い合わせ
        </a>

        <button
          @click="handleLogout"
          class="block w-full text-left px-4 py-3 border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition-colors"
        >
          ログアウト
        </button>

        <button
          @click="confirmDeleteAccount"
          class="block w-full text-left px-4 py-3 border border-red-300 text-red-700 rounded-md hover:bg-red-50 transition-colors"
        >
          アカウント削除
        </button>
      </div>

      <ConfirmDialog
        :show="showDeleteConfirm"
        title="アカウントの削除"
        message="本当にアカウントを削除しますか？この操作は取り消せません。すべてのデータが永久に削除されます。"
        confirm-label="削除"
        confirm-class="bg-red-500 hover:bg-red-600"
        @confirm="handleDeleteConfirm"
        @cancel="handleDeleteCancel"
      />

      <PasswordConfirmDialog
        :show="showPasswordConfirm"
        :email="authStore.currentUser?.email"
        @confirm="handlePasswordConfirm"
        @cancel="handleDeleteCancel"
      />

      <LoadingSpinner 
        v-if="isLoading" 
        :message="loadingMessage" 
      />
    </div>
  </div>
</template>