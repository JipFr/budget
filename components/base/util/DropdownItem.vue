<template>
  <button @click="(evt) => $emit('click', evt)">
    <component :is="icon" />
    <slot />
  </button>
</template>

<style lang="scss" scoped>
button {
  width: 100%;
  text-align: left;
  background: transparent;
  color: var(--text);
  border: 0;
  padding: 10px 12px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 50ms;

  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: 10px;
  align-items: center;

  svg {
    display: block;
    width: 1.1rem;
    height: 1.1rem;
  }

  &:hover {
    opacity: 0.9;
  }
}
</style>

<script>
// Import icons
import PlusCircleIcon from '~/assets/icons/plus-circle.svg?inline'

export default {
  props: {
    icon: {
      type: Object,
      default: () => PlusCircleIcon,
    },
  },
}
</script>
