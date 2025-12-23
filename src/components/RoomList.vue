<script setup>
import { ref, onMounted } from 'vue'
import { useChatStore } from '../stores/chat'
import { useRouter } from 'vue-router'

const router = useRouter()
const store = useChatStore()
const newRoomTitle = ref('')

onMounted(async () => {
  await store.loadRooms()
})

const createNewRoom = async () => {
  if (!newRoomTitle.value.trim()) return
  const roomId = await store.createRoom(newRoomTitle.value)
  newRoomTitle.value = ''
  router.push({ name: 'room', params: { id: roomId }})
}
</script>

<template>
  <div class="p-4">
    <div class="mb-4">
      <div class="flex gap-2">
        <input
          v-model="newRoomTitle"
          type="text"
          placeholder="チャットメモのタイトル"
          class="flex-1 rounded-lg border p-2"
          @keyup.enter="createNewRoom"
        />
        <button
          @click="createNewRoom"
          class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
        >
          作成
        </button>
      </div>
    </div>
    <div class="space-y-2">
      <router-link
        v-for="room in store.rooms"
        :key="room.id"
        :to="{ name: 'room', params: { id: room.id }}"
        class="block bg-white rounded-lg p-4 shadow hover:shadow-md transition"
      >
        {{ room.title }}
      </router-link>
    </div>
  </div>
</template>