<template>
  <span class="typewriter">{{ displayText }}</span>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  text: {
    type: String,
    required: true
  },
  speed: {
    type: Number,
    default: 100
  }
})

const displayText = ref('')

onMounted(() => {
  let index = 0
  const interval = setInterval(() => {
    if (index < props.text.length) {
      displayText.value = props.text.slice(0, index + 1)
      index++
    } else {
      clearInterval(interval)
    }
  }, props.speed)
})
</script>

<style scoped>
.typewriter {
  border-right: 2px solid;
  animation: blink 0.75s step-end infinite;
}

@keyframes blink {
  from, to { border-color: transparent }
  50% { border-color: black }
}
</style>