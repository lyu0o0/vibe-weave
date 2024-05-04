<script setup lang="ts">
import { ref } from 'vue'
import { IconHeart, IconHeartFilled, IconPlayerPlay, IconPlayerStop } from '@tabler/icons-vue'
import { doc, updateDoc, arrayUnion, arrayRemove, increment } from 'firebase/firestore'
import StyledButton from './StyledButton.vue'
import { db, auth } from '../firebase'

export interface RecordingData {
  authorName: string
  likes: number
  name: string
  keys: KeyPressData[]
  id: string
}

export interface KeyPressData {
  key: string
  time: number
  x: number
  y: number
  pressed: boolean
}

const emit = defineEmits([
  'upload-recording',
  'start-recording',
  'input-focusin',
  'input-focusout',
  'like',
  'unlike',
  'play',
  'stop'
])

const props = defineProps<{
  myRecordings: RecordingData[]
  globalRecordings: RecordingData[]
  recording: boolean
  myLikes: string[]
  currentlyPlaying: string
}>()

const showPopup = ref(false)
const recordingName = ref('')

function uploadRecording() {
  showPopup.value = false
  emit('upload-recording', recordingName.value)
}

async function like(docId: string) {
  if (!auth.currentUser) {
    console.error('User not logged in')
    return
  }
  await updateDoc(doc(db, 'users', auth.currentUser.uid), {
    liked: arrayUnion(docId)
  })
  await updateDoc(doc(db, 'recordings', docId), {
    likes: increment(1)
  })
  emit('like', docId)
}

async function unlike(docId: string) {
  if (!auth.currentUser) {
    console.error('User not logged in')
    return
  }
  await updateDoc(doc(db, 'users', auth.currentUser.uid), {
    liked: arrayRemove(docId)
  })
  await updateDoc(doc(db, 'recordings', docId), {
    likes: increment(-1)
  })
  emit('unlike', docId)
}
</script>

<template>
  <div class="recording-list">
    <div class="global-section">
      <div class="title">Music Community</div>
      <div class="grid">
        <div class="header">Name</div>
        <div class="header">Artist</div>
        <div class="header">Likes</div>
        <div class="header">Play</div>
      </div>
      <div class="grid scroll">
        <template v-for="(recording, index) in props.globalRecordings" :key="index">
          <div>{{ recording.name }}</div>
          <div>{{ recording.authorName }}</div>
          <div class="likes">
            <IconHeartFilled
              size="18"
              v-if="props.myLikes.includes(recording.id)"
              class="cursor-pointer"
              @click="unlike(recording.id)"
            />
            <IconHeart size="18" v-else class="cursor-pointer" @click="like(recording.id)" />
            {{ recording.likes }}
          </div>
          <div>
            <IconPlayerPlay
              size="18"
              class="cursor-pointer"
              v-if="currentlyPlaying !== recording.id"
              @click="$emit('play', recording.id)"
            />
            <IconPlayerStop size="18" class="cursor-pointer" v-else @click="$emit('stop')" />
          </div>
        </template>
      </div>
    </div>
    <div class="my-section">
      <div class="title">My Music</div>
      <div class="grid my-list scroll">
        <template v-for="(recording, index) in props.myRecordings" :key="index">
          <div>{{ recording.name }}</div>
          <div class="likes">
            <IconHeartFilled size="18" />
            {{ recording.likes }}
          </div>
          <div>
            <IconPlayerPlay
              size="18"
              class="cursor-pointer"
              v-if="currentlyPlaying !== recording.id"
              @click="$emit('play', recording.id)"
            />
            <IconPlayerStop size="18" class="cursor-pointer" v-else @click="$emit('stop')" />
          </div>
        </template>
      </div>
    </div>
    <button class="recording-button" @click="$emit('start-recording')" v-if="!recording">
      Start Recording
    </button>
    <button class="recording-button" @click="showPopup = true" v-if="recording">
      Stop Recording
    </button>
  </div>
  <div class="popup" v-if="showPopup">
    <div>
      Please name your recording
      <input
        v-model="recordingName"
        @focusin="$emit('input-focusin')"
        @focusout="$emit('input-focusout')"
      />
      <StyledButton color="dark" @click="uploadRecording">Upload recording</StyledButton>
    </div>
  </div>
</template>

<style scoped>
.recording-list {
  position: absolute;
  left: 2rem;
  top: 2rem;
  bottom: 2rem;
  width: 24rem;
  background-color: var(--light);
  border-radius: 1rem;
  padding: 0.2rem;
  display: flex;
  flex-direction: column;
}

.title {
  font-size: 2rem;
  font-weight: 600;
  text-align: center;
  display: fixed;
}

.header {
  background-color: var(--dark);
  color: var(--light);
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  grid-auto-flow: row;
  justify-items: center;
  margin-top: 1rem;
  row-gap: 0.5rem;
  align-content: start;
}

.grid.my-list {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.grid > div:not(.header) {
  border-bottom: var(--dark) solid 1px;
  justify-self: stretch;
  text-align: center;
  padding: 0.25rem;
}

.global-section,
.my-section {
  border: var(--dark) solid 1px;
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
}

.scroll {
  overflow-y: scroll;
  flex-shrink: 1;
  flex-grow: 1;
  padding: 0 1rem;
}

.global-section {
  border-top-right-radius: 0.8rem;
  border-top-left-radius: 0.8rem;
  max-height: 50%;
}

.my-section {
  margin-top: 0.2rem;
  flex-grow: 1;
}

.recording-button {
  border: var(--dark) solid 1px;
  outline: none;
  background-color: var(--dark);
  color: var(--light);
  padding: 1rem;
  font-size: 1.5rem;
  border-bottom-right-radius: 0.8rem;
  border-bottom-left-radius: 0.8rem;
  cursor: pointer;
}

.popup {
  background-color: rgba(50, 50, 50, 0.6);
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.popup > div {
  color: var(--dark);
  background-color: var(--light);
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border-radius: 1rem;
  gap: 0.5rem;
}

.popup > div > input {
  border: var(--dark) solid 1px;
  outline: none;
  box-sizing: border-box;
  height: 1.5rem;
  border-radius: 0.5rem;
  padding: 0.5rem;
}

.popup > div > input:focus {
  border-width: 2px;
}

.likes {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  justify-content: center;
}

.likes > svg {
  color: red;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
