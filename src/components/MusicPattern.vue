<script setup lang="ts">
import { ref, onMounted, defineProps } from 'vue'

const props = defineProps<{
  video1: string
  video2: string
  audio: string
  type: string
  x: number
  y: number
  playing: boolean
}>()

const patternTypeToTranslateX: { [patternId: string]: string } = {
  line: '0',
  block: '-50%',
  wave: '-50%'
}

const patternTypeToTranslateY: { [patternId: string]: string } = {
  line: '-50%',
  block: '-50%',
  wave: '-50%'
}

const localX = ref(props.x)
const localY = ref(props.y)
const intro = ref(true)

const video1Ref = ref<HTMLVideoElement | null>(null)
const video2Ref = ref<HTMLVideoElement | null>(null)
const audioRef = ref<HTMLAudioElement | null>(null)

function introEnded() {
  if (!video2Ref.value) {
    console.error('video2Ref is not bound')
    return
  }
  intro.value = false
  video2Ref.value.play()
}

onMounted(() => {
  if (!video1Ref.value || !audioRef.value) {
    console.error('video1Ref or audioRef is not bound')
    return
  }
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
        patternTypeToTranslateX[type] +
        ') translateY(' +
        patternTypeToTranslateY[type] +
        ')'
    }"
    :class="{ line: type === 'line', musicPattern: type !== 'line' }"
  >
    <video v-show="intro" :src="video1" @ended="introEnded" ref="video1Ref"></video>
    <video v-show="!intro" :src="video2" ref="video2Ref" loop></video>
    <audio :src="audio" ref="audioRef" loop v-if="props.playing"></audio>
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
