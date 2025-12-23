<script setup>
import { ref } from 'vue'
import TermsDialog from './TermsDialog.vue'
import PrivacyDialog from './PrivacyDialog.vue'

const showTerms = ref(false)
const showPrivacy = ref(false)
</script>

<template>
  <div class="text-center text-xs text-gray-500 space-x-2">
    <button
      @click="showTerms = true"
      class="text-primary-600 hover:text-primary-500 hover:underline"
    >
      利用規約
    </button>
    <span>・</span>
    <button
      @click="showPrivacy = true"
      class="text-primary-600 hover:text-primary-500 hover:underline"
    >
      プライバシーポリシー
    </button>
  </div>

  <TermsDialog
    :show="showTerms"
    @close="showTerms = false"
  />
  <PrivacyDialog
    :show="showPrivacy"
    @close="showPrivacy = false"
  />
</template>