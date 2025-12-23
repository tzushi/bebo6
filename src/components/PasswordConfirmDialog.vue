<template>
  <Teleport to="body">
    <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>

      <div class="flex min-h-full items-center justify-center p-4 text-center">
        <div
          class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-full max-w-lg"
        >
          <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                <h3 class="text-lg font-semibold leading-6 text-gray-900">
                  パスワードの確認
                </h3>
                <div class="mt-4">
                  <input
                    v-model="password"
                    type="password"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                    placeholder="現在のパスワードを入力"
                    @keyup.enter="handleConfirm"
                  />
                </div>
                <div v-if="error" class="mt-2 text-sm text-red-600">
                  {{ error }}
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
              @click="handleConfirm"
            >
              削除
            </button>
            <button
              type="button"
              class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              @click="$emit('cancel')"
            >
              キャンセル
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'

const props = defineProps({
  show: Boolean
})

const emit = defineEmits(['confirm', 'cancel'])
const authStore = useAuthStore()
const password = ref('')
const error = ref('')

async function handleConfirm() {
  try {
    error.value = ''
    const isValid = await authStore.verifyPassword(password.value)
    if (!isValid) {
      error.value = 'パスワードが正しくありません'
      return
    }
    emit('confirm', password.value)
  } catch (e) {
    error.value = 'エラーが発生しました'
  }
}
</script>