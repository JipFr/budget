<template>
  <div class="logo">
    <krab-icon />
    <span>Krab Bij Kas</span>
  </div>
</template>

<style lang="scss">
.logo {
  display: flex;
  gap: 1rem;
  align-items: center;

  svg {
    display: block;
    width: 1.5rem;
    height: 1.5rem;
    color: inherit;
  }
}
</style>

<script>
// Import icons
import KrabIcon from '~/assets/logos/krab.svg?inline'

export default {
  components: {
    KrabIcon,
  },
}
</script>
