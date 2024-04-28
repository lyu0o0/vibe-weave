<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc } from 'firebase/firestore'
import MusicPattern from './components/MusicPattern.vue'

// Initialize Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyC6spFl1fxjADY-Ii4JTFoRUSmRGWRXBuY',
  authDomain: 'vibeweave.firebaseapp.com',
  projectId: 'vibeweave',
  storageBucket: 'vibeweave.appspot.com',
  messagingSenderId: '1088254463059',
  appId: '1:1088254463059:web:8ba14e6bd566432ad08aa6',
  measurementId: 'G-8YY2E4QD1D'
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const keyToPattern = {
  q: {
    id: 'line',
    audio: 'https://assets.codepen.io/10916095/piano_Am.mp3',
    video1: 'https://assets.codepen.io/10916095/line_1.webm',

    video2: 'https://assets.codepen.io/10916095/line_2.webm'
  },
  w: {
    id: 'line',
    audio: 'https://assets.codepen.io/10916095/Piano_A.mp3',
    video1: 'https://assets.codepen.io/10916095/Line+1.1.webm',
    video2: 'https://assets.codepen.io/10916095/Line+2.1.webm'
  },
  e: {
    id: 'line',
    audio: 'https://assets.codepen.io/10916095/piano_F.mp3',
    video1: 'https://assets.codepen.io/10916095/Line+1.2.webm',
    video2: 'https://assets.codepen.io/10916095/Line+2.2.webm'
  },
  r: {
    id: 'line',
    audio: 'https://assets.codepen.io/10916095/G.mp3',
    video1: 'https://assets.codepen.io/10916095/Line+1.3.webm',
    video2: 'https://assets.codepen.io/10916095/Line+2.3.webm'
  },
  t: {
    id: 'line',
    audio: 'https://assets.codepen.io/10916095/Fm.mp3',
    video1: 'https://assets.codepen.io/10916095/Line+1.4.webm',
    video2: 'https://assets.codepen.io/10916095/Line+2.4.webm'
  },
  a: {
    id: 'block',
    audio: 'https://assets.codepen.io/10916095/Guitar_Am.mp3',
    video1: 'https://assets.codepen.io/10916095/block_1.webm',
    video2: 'https://assets.codepen.io/10916095/block_2.webm'
  },
  s: {
    id: 'block',
    audio: 'https://assets.codepen.io/10916095/D_1.mp3',
    video1: 'https://assets.codepen.io/10916095/Block+1.1_1.webm',
    video2: 'https://assets.codepen.io/10916095/Block+2.1_1.webm'
  },
  d: {
    id: 'block',
    audio: 'https://assets.codepen.io/10916095/Dm_1.mp3',
    video1: 'https://assets.codepen.io/10916095/Block+1.2_1.webm',
    video2: 'https://assets.codepen.io/10916095/Block+2.2_1.webm'
  },
  f: {
    id: 'block',
    audio: 'https://assets.codepen.io/10916095/E_1.mp3',
    video1: 'https://assets.codepen.io/10916095/Block+1.3_1.webm',
    video2: 'https://assets.codepen.io/10916095/Block+2.3_1.webm'
  },
  g: {
    id: 'block',
    audio: 'https://assets.codepen.io/10916095/Em_1.mp3',
    video1: 'https://assets.codepen.io/10916095/Block+1.4_1.webm',
    video2: 'https://assets.codepen.io/10916095/Block+2.4_1.webm'
  },
  z: {
    id: 'wave',
    audio: 'https://assets.codepen.io/10916095/Harp_Am.mp3',
    video1: 'https://assets.codepen.io/10916095/water_wave_1.webm',
    video2: 'https://assets.codepen.io/10916095/water_wave_2.webm'
  },
  x: {
    id: 'wave',
    audio: 'https://assets.codepen.io/10916095/harp_C.mp3',
    video1: 'https://assets.codepen.io/10916095/Water+wave+1.1.webm',
    video2: 'https://assets.codepen.io/10916095/Water+wave+2.1.webm'
  },
  c: {
    id: 'wave',
    audio: 'https://assets.codepen.io/10916095/D_2.mp3',
    video1: 'https://assets.codepen.io/10916095/Water+wave+1.2.webm',
    video2: 'https://assets.codepen.io/10916095/Water+wave+2.2.webm'
  },
  v: {
    id: 'wave',

    audio: 'https://assets.codepen.io/10916095/F_1.mp3',
    video1: 'https://assets.codepen.io/10916095/Water+wave+1.3.webm',

    video2: 'https://assets.codepen.io/10916095/Water+wave+2.3.webm'
  },
  b: {
    id: 'wave',
    audio: 'https://assets.codepen.io/10916095/Em_2.mp3',

    video1: 'https://assets.codepen.io/10916095/Water+wave+1.4.webm',
    video2: 'https://assets.codepen.io/10916095/Water+wave+2.4.webm'
  }
}

const patternAnimations = reactive([])
const position = reactive({
  x: 200,
  y: 200
})
const description = ref(true)
const recording = ref(false)
const enterRecordingName = ref(false)
const recordingStartTime = ref(Date.now())
const recordedMusic = ref([])
const recordingNameInputRef = ref(null)
const inputFocused = ref(false)

function press(event) {
  if (event.repeat || inputFocused.value) {
    return
  }

  const patternData = keyToPattern[event.key]

  if (!patternData) {
    return
  }
  patternAnimations.push(patternData)

  // Record keypress
  if (recording.value) {
    recordedMusic.value.push({
      key: event.key,
      time: Date.now() - recordingStartTime.value,
      x: position.x,
      y: position.y
    })
  }
}

onMounted(() => {
  window.addEventListener('keydown', press)
  window.addEventListener('keyup', release)
})

function changePosition(event) {
  position.x = event.clientX
  position.y = event.clientY
}

function release(event) {
  let indexToDelete = patternAnimations.indexOf(keyToPattern[event.key])
  patternAnimations.splice(indexToDelete, 1)
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
  await addDoc(collection(db, 'recordings'), {
    name: recordingNameInputRef.value.value,
    keys: recordedMusic.value
  })
  recordedMusic.value = []
  enterRecordingName.value = false
}
</script>

<template>
  <div class="canvas" @click="changePosition">
    <div class="description" v-show="description">
      <p>
        Welcome to Harmonic Patterns! Where your creativity brings art and music together in one
        harmonious canvas.
      </p>
      <video src="https://assets.codepen.io/10916095/line_2.webm" loop muted autoplay></video>

      <img src="https://assets.codepen.io/10916095/description-01_1.png" alt="descriptionImg" />
      <button @click="description = false">Click to Start</button>
    </div>
    <MusicPattern
      v-show="!description"
      v-for="pattern in patternAnimations"
      :video1="pattern.video1"
      :video2="pattern.video2"
      :audio="pattern.audio"
      :id="pattern.id"
      :x="position.x"
      :y="position.y"
      :key="pattern.id"
    ></MusicPattern>
  </div>
  <div class="recording_control" v-show="!description">
    <input
      placeholder="Please name your recording"
      v-show="enterRecordingName"
      ref="recordingNameInputRef"
      @focus="inputFocused = true"
      @focusout="inputFocused = false"
    />
    <button v-show="!recording && !enterRecordingName" @click="startRecording">
      Start Recording
    </button>
    <button v-show="recording" @click="stopRecording">Stop Recording</button>
    <button v-show="enterRecordingName" @click="uploadRecording">Upload Recording</button>
  </div>
</template>

<style scoped>
.canvas {
  background-color: #2b0d29;
  width: 100%;
  height: 100%;
  overflow: hidden;
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

.line > video {
  width: 100%;
}

.description {
  background-color: #ffefe4;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.description > img {
  width: 65%;
}

.description > p {
  font-size: 1.5rem;
  color: #2b0d29;
  width: 50%;
  text-align: center;
  margin-bottom: -35px;
}

.description > video {
  width: 35%;
  margin-bottom: 60px;
}

button {
  margin-bottom: 10px;
  margin-top: 40px;
  background-color: #ffefe4;
  border-radius: 9999px;
  border: 5;
  border-color: #eb2ea4;
  padding: 0.5rem 3rem;
  color: #2b0d29;
  cursor: pointer;
}

input {
  border-radius: 9999px;
  margin-bottom: 10px;
  margin-top: 40px;
  background-color: #ffefe4;
  border-radius: 9999px;
  border: 5;
  border-color: #eb2ea4;
  padding: 0.5rem 3rem;
  color: #2b0d29;
  margin: 0 2rem;
}
</style>
