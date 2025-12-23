<script setup>
const openDonationPage = () => {
  window.open('https://buy.stripe.com/test_donation', '_blank')
}
</script>

<template>
  <button
    @click="openDonationPage"
    class="fixed bottom-4 left-4 z-40 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow duration-200 group"
    title="開発者を支援する"
  >
    <div class="relative">
      <svg class="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
      <span class="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
        開発者を支援する
      </span>
    </div>
  </button>
</template>