<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useChatStore } from '../stores/chat'
import LegalLinks from '../components/LegalLinks.vue'
import VerificationMessage from '../components/VerificationMessage.vue'
import PWAInstallPrompt from '../components/PWAInstallPrompt.vue'

const router = useRouter()
const authStore = useAuthStore()
const chatStore = useChatStore()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const acceptTerms = ref(false)
const showVerificationMessage = ref(false)
const showPWAPrompt = ref(false)

const isPasswordValid = computed(() => password.value.length >= 8)

const signup = async () => {
  try {
    error.value = ''
    
    if (!acceptTerms.value) {
      error.value = '利用規約とプライバシーポリシーに同意してください'
      return
    }
    
    if (!isPasswordValid.value) {
      error.value = 'パスワードは8文字以上である必要があります'
      return
    }
    
    if (password.value !== confirmPassword.value) {
      error.value = 'パスワードが一致しません'
      return
    }

    await authStore.signup(email.value, password.value)
    showPWAPrompt.value = true
    showVerificationMessage.value = true
  } catch (e) {
    error.value = e.message
  }
}

const handleVerificationClose = () => {
  showVerificationMessage.value = false
  router.push({ name: 'login' })
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md text-center">
      <h1 class="text-4xl font-extrabold text-gray-900 mb-2">
        bebo6
      </h1>

      <p class="text-xl text-gray-600 mb-8">
        自分だけのプライベートな会話スペース
      </p>
    </div>

    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10 space-y-6">
        <h2 class="text-2xl font-bold text-center text-gray-900 mb-8">
          新規登録
        </h2>

        <form class="space-y-6" @submit.prevent="signup">
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

          <div>
            <label for="confirm-password" class="block text-sm font-medium text-gray-700">
              パスワード（確認）
            </label>
            <div class="mt-1">
              <input
                id="confirm-password"
                v-model="confirmPassword"
                type="password"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <!-- Password Requirements -->
          <div v-if="password" class="text-sm space-y-2">
            <h3 class="font-medium text-gray-700">パスワードの要件:</h3>
            <ul class="list-disc pl-5">
              <li :class="password.length >= 8 ? 'text-green-600' : 'text-gray-500'">
                8文字以上
              </li>
            </ul>
          </div>

          <div class="flex items-center">
            <input
              id="accept-terms"
              v-model="acceptTerms"
              type="checkbox"
              class="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
            />
            <label for="accept-terms" class="ml-2 block text-sm text-gray-900">
              利用規約とプライバシーポリシーに同意する
            </label>
          </div>

          <div>
            <button
              type="submit"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              :disabled="!isPasswordValid"
            >
              登録する
            </button>
          </div>

          <div v-if="error" class="text-red-500 text-sm text-center">
            {{ error }}
          </div>

          <div class="text-center text-sm">
            <router-link
              :to="{ name: 'login' }"
              class="font-medium text-gray-600 hover:text-gray-500"
            >
              既にアカウントをお持ちの方はこちら
            </router-link>
          </div>
        </form>

        <div class="mt-6">
          <LegalLinks />
        </div>
      </div>
    </div>

    <VerificationMessage
      :show="showVerificationMessage"
      @close="handleVerificationClose"
    />
    
    <PWAInstallPrompt
      :show="showPWAPrompt"
      :is-signup="true"
      @close="showPWAPrompt = false"
    />
  </div>
</template>