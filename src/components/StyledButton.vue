<script setup lang="ts">
const props = withDefaults(defineProps<{ color?: 'light' | 'dark' }>(), {
  color: 'light'
})
</script>

<template>
  <button :class="props.color">
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
