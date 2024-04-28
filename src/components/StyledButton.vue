<script setup lang="ts">
const props = withDefaults(defineProps<{ style?: 'light' | 'dark' }>(), {
  style: 'light'
})
</script>

<template>
  <button :class="props.style" @click="$emit('click')">
    <slot />
  </button>
</template>

<style scoped>
button {
  border-radius: 0.75rem;
  padding: 0.5rem 2rem;
  outline: none;
  border: none;
  font-weight: 600;
  margin: 0.5rem;
  cursor: pointer;
}

button.light {
  background-color: var(--light);
  color: var(--dark);
}

button.dark {
  background-color: var(--dark);
  color: var(--light);
}
</style>
