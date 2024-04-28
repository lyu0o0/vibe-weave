<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { collection, addDoc, getDocs, where, query } from 'firebase/firestore'
import { db, auth } from './firebase'
import MusicPattern from './components/MusicPattern.vue'
import FirebaseAuth from './components/FirebaseAuth.vue'

interface PatternData {
  type: string
  audio: string
  video1: string
  video2: string
}

interface PatternRuntimeData {
  key: string
  data: PatternData
  playing: boolean
}

interface RecordingData {
  key: string
  time: number
  x: number
  y: number
  pressed: boolean
}

const keyToPattern: { [key: string]: PatternData } = {
  q: {
    type: 'line',
    audio: 'https://assets.codepen.io/10916095/piano_Am.mp3',
    video1: 'https://assets.codepen.io/10916095/line_1.webm',
    video2: 'https://assets.codepen.io/10916095/line_2.webm'
  },
  w: {
    type: 'line',
    audio: 'https://assets.codepen.io/10916095/Piano_A.mp3',
    video1: 'https://assets.codepen.io/10916095/Line+1.1.webm',
    video2: 'https://assets.codepen.io/10916095/Line+2.1.webm'
  },
  e: {
    type: 'line',
    audio: 'https://assets.codepen.io/10916095/piano_F.mp3',
    video1: 'https://assets.codepen.io/10916095/Line+1.2.webm',
    video2: 'https://assets.codepen.io/10916095/Line+2.2.webm'
  },
  r: {
    type: 'line',
    audio: 'https://assets.codepen.io/10916095/G.mp3',
    video1: 'https://assets.codepen.io/10916095/Line+1.3.webm',
    video2: 'https://assets.codepen.io/10916095/Line+2.3.webm'
  },
  t: {
    type: 'line',
    audio: 'https://assets.codepen.io/10916095/Fm.mp3',
    video1: 'https://assets.codepen.io/10916095/Line+1.4.webm',
    video2: 'https://assets.codepen.io/10916095/Line+2.4.webm'
  },
  a: {
    type: 'block',
    audio: 'https://assets.codepen.io/10916095/Guitar_Am.mp3',
    video1: 'https://assets.codepen.io/10916095/block_1.webm',
    video2: 'https://assets.codepen.io/10916095/block_2.webm'
  },
  s: {
    type: 'block',
    audio: 'https://assets.codepen.io/10916095/D_1.mp3',
    video1: 'https://assets.codepen.io/10916095/Block+1.1_1.webm',
    video2: 'https://assets.codepen.io/10916095/Block+2.1_1.webm'
  },
  d: {
    type: 'block',
    audio: 'https://assets.codepen.io/10916095/Dm_1.mp3',
    video1: 'https://assets.codepen.io/10916095/Block+1.2_1.webm',
    video2: 'https://assets.codepen.io/10916095/Block+2.2_1.webm'
  },
  f: {
    type: 'block',
    audio: 'https://assets.codepen.io/10916095/E_1.mp3',
    video1: 'https://assets.codepen.io/10916095/Block+1.3_1.webm',
    video2: 'https://assets.codepen.io/10916095/Block+2.3_1.webm'
  },
  g: {
    type: 'block',
    audio: 'https://assets.codepen.io/10916095/Em_1.mp3',
    video1: 'https://assets.codepen.io/10916095/Block+1.4_1.webm',
    video2: 'https://assets.codepen.io/10916095/Block+2.4_1.webm'
  },
  z: {
    type: 'wave',
    audio: 'https://assets.codepen.io/10916095/Harp_Am.mp3',
    video1: 'https://assets.codepen.io/10916095/water_wave_1.webm',
    video2: 'https://assets.codepen.io/10916095/water_wave_2.webm'
  },
  x: {
    type: 'wave',
    audio: 'https://assets.codepen.io/10916095/harp_C.mp3',
    video1: 'https://assets.codepen.io/10916095/Water+wave+1.1.webm',
    video2: 'https://assets.codepen.io/10916095/Water+wave+2.1.webm'
  },
  c: {
    type: 'wave',
    audio: 'https://assets.codepen.io/10916095/D_2.mp3',
    video1: 'https://assets.codepen.io/10916095/Water+wave+1.2.webm',
    video2: 'https://assets.codepen.io/10916095/Water+wave+2.2.webm'
  },
  v: {
    type: 'wave',
    audio: 'https://assets.codepen.io/10916095/F_1.mp3',
    video1: 'https://assets.codepen.io/10916095/Water+wave+1.3.webm',
    video2: 'https://assets.codepen.io/10916095/Water+wave+2.3.webm'
  },
  b: {
    type: 'wave',
    audio: 'https://assets.codepen.io/10916095/Em_2.mp3',
    video1: 'https://assets.codepen.io/10916095/Water+wave+1.4.webm',
    video2: 'https://assets.codepen.io/10916095/Water+wave+2.4.webm'
  }
}

const patternAnimations = reactive<PatternRuntimeData[]>([])
const position = reactive<{ x: number; y: number }>({
  x: 200,
  y: 200
})
const username = ref("")
const isOnLanding = ref(true)
const recording = ref(false)
const enterRecordingName = ref(false)
const recordingStartTime = ref(Date.now())
const recordedMusic = ref<RecordingData[]>([])
const recordingNameInputRef = ref<HTMLInputElement | null>(null)
const inputFocused = ref(false)
const myRecordings = ref([])

function press(event: KeyboardEvent) {
  // Ignore keys when: they are repeated keys, typing into input, or when on landing
  if (event.repeat || inputFocused.value || isOnLanding.value) {
    return
  }
  if (!(event.key in keyToPattern)) {
    return
  }

  const patternData = keyToPattern[event.key]

  if (!patternData) {
    return
  }
  patternAnimations.push({ data: patternData, key: event.key, playing: true })

  // Record keypress
  if (recording.value) {
    recordedMusic.value.push({
      key: event.key,
      time: Date.now() - recordingStartTime.value,
      x: position.x,
      y: position.y,
      pressed: true
    })
  }
}

function release(event: KeyboardEvent) {
  // Ignore keys when: they are repeated keys, typing into input, or when on landing
  if (event.repeat || inputFocused.value || isOnLanding.value) {
    return
  }
  if (!(event.key in keyToPattern)) {
    return
  }

  let indexToStop = patternAnimations.findLastIndex((value) => {
    return value.key === event.key
  })
  if (indexToStop < 0) {
    return
  }
  patternAnimations[indexToStop].playing = false
  if (recording.value) {
    recordedMusic.value.push({
      key: event.key,
      time: Date.now() - recordingStartTime.value,
      x: 0,
      y: 0,
      pressed: false
    })
  }
}

onMounted(() => {
  window.addEventListener('keydown', press)
  window.addEventListener('keyup', release)
})

function onLoggedIn(name) {
  isOnLanding.value = false
  username.value = name
  getMyRecordings()
}

function changePosition(event: MouseEvent) {
  position.x = event.clientX
  position.y = event.clientY
}

function startRecording() {
  recording.value = true
  recordingStartTime.value = Date.now()
}

async function stopRecording() {
  recording.value = false
  enterRecordingName.value = true
}

async function uploadRecording() {
  if (!auth.currentUser) {
    console.error("User is not logged in")
    return
  }
  if (!recordingNameInputRef.value) {
    console.error('recordingNameInputRef is not bound')
    return
  }
  await addDoc(collection(db, 'recordings'), {
    name: recordingNameInputRef.value.value,
    keys: recordedMusic.value,
    author: auth.currentUser.uid,
    authorName: username.value
  })
  recordedMusic.value = []
  enterRecordingName.value = false
}

async function getMyRecordings() {
  if (!auth.currentUser) {
    console.error("User is not logged in")
    return
  }
  const q = query(collection(db, "recordings"), where("author", "==", auth.currentUser.uid))
  const snapshot = await getDocs(q)
  const recordings = []
  snapshot.forEach((doc) => {
    recordings.push(doc.data())
  })
}
</script>

<template>
  <div class="canvas" @click="changePosition">
    <div class="description" v-if="isOnLanding">
      <p>
        Welcome to Harmonic Patterns! Where your creativity brings art and music together in one
        harmonious canvas.
      </p>
      <video src="https://assets.codepen.io/10916095/line_2.webm" loop muted autoplay></video>

      <img src="https://assets.codepen.io/10916095/description-01_1.png" alt="descriptionImg" />
    </div>
    <FirebaseAuth v-if="isOnLanding" @logged-in="onLoggedIn" />
    <MusicPattern v-show="!isOnLanding" v-for="(pattern, index) in patternAnimations" :video1="pattern.data.video1"
      :video2="pattern.data.video2" :audio="pattern.data.audio" :type="pattern.data.type" :x="position.x"
      :y="position.y" :key="index" :playing="pattern.playing"></MusicPattern>
  </div>
  <div class="recording_control" v-show="!isOnLanding">
    <input placeholder="Please name your recording" v-show="enterRecordingName" ref="recordingNameInputRef"
      @focusin="inputFocused = true" @focusout="inputFocused = false" />
    <button v-show="!recording && !enterRecordingName" @click="startRecording">
      Start Recording
    </button>
    <button v-show="recording" @click="stopRecording">Stop Recording</button>
    <button v-show="enterRecordingName" @click="uploadRecording">Upload Recording</button>
  </div>
</template>

<style scoped>
.canvas {
  background-color: var(--dark);
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
}

.recording_control {
  position: absolute;
  right: 4rem;
  bottom: 4rem;
}

.line {
  position: absolute;
  width: 70%;
}

.line>video {
  width: 100%;
}

.description {
  background-color: var(--light);
  width: 70%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.description>img {
  width: 65%;
}

.description>p {
  font-size: 1.5rem;
  color: var(--dark);
  width: 50%;
  text-align: center;
  margin-bottom: -35px;
}

.description>video {
  width: 35%;
  margin-bottom: 60px;
}
</style>
