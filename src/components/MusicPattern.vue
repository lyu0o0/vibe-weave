<script setup lang="ts">
import { ref, onMounted, defineProps } from 'vue'

const props = defineProps<{
  video1: string
  video2: string
  audio: string
  id: string
  x: number
  y: number
}>()

const patternIdToTranslateX = {
  line: '0',
  block: '-50%',
  wave: '-50%'
}

const patternIdToTranslateY = {
  line: '-50%',
  block: '-50%',
  wave: '-50%'
}

const localX = ref(props.x)
const localY = ref(props.y)
const intro = ref(true)

const video1Ref = ref(null)
const video2Ref = ref(null)
const audioRef = ref(null)

function introEnded() {
  intro.value = false
  video2Ref.value.play()
}

onMounted(() => {
  video1Ref.value.play()
  audioRef.value.play()
})
</script>

<template>
  <div
    :style="{
      transform:
        'translateX(' +
        localX +
        'px) translateY(' +
        localY +
        'px) translateX(' +
        patternIdToTranslateX[id] +
        ') translateY(' +
        patternIdToTranslateY[id] +
        ')'
    }"
    :class="{ line: id === 'line', musicPattern: id !== 'line' }"
  >
    <video v-show="intro" :src="video1" @ended="introEnded" ref="video1Ref"></video>
    <video v-show="!intro" :src="video2" ref="video2Ref" loop></video>
    <audio :src="audio" ref="audioRef" loop></audio>
  </div>
</template>

<style scoped>
.musicPattern {
  position: absolute;
  width: 50%;
}

.musicPattern > video {
  width: 100%;
}
</style>
