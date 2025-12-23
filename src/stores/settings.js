import { defineStore } from 'pinia'
import { ref } from 'vue'
import Dexie from 'dexie'

const db = new Dexie('HitorigotoChatMemoSettings')
db.version(1).stores({
  settings: 'key'
})

export const useSettingsStore = defineStore('settings', () => {
  const showTimestamps = ref(true)
  const showUrlPreviews = ref(true)
  const showDetails = ref(true)

  async function loadSettings() {
    const timestampSetting = await db.settings.get('showTimestamps')
    const urlPreviewSetting = await db.settings.get('showUrlPreviews')
    const detailsSetting = await db.settings.get('showDetails')
    
    showTimestamps.value = timestampSetting?.value ?? true
    showUrlPreviews.value = urlPreviewSetting?.value ?? true
    showDetails.value = detailsSetting?.value ?? true
  }

  async function toggleTimestamps() {
    showTimestamps.value = !showTimestamps.value
    await db.settings.put({ key: 'showTimestamps', value: showTimestamps.value })
  }

  async function toggleUrlPreviews() {
    showUrlPreviews.value = !showUrlPreviews.value
    await db.settings.put({ key: 'showUrlPreviews', value: showUrlPreviews.value })
  }

  async function toggleDetails() {
    showDetails.value = !showDetails.value
    await db.settings.put({ key: 'showDetails', value: showDetails.value })
  }

  // Load settings on store initialization
  loadSettings()

  return {
    showTimestamps,
    showUrlPreviews,
    showDetails,
    toggleTimestamps,
    toggleUrlPreviews,
    toggleDetails
  }
})