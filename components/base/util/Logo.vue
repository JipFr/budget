<template>
  <div class="logo">
    <crab-icon />
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
import CrabIcon from '~/assets/logos/crab.svg?inline'

export default {
  components: {
    CrabIcon,
  },
}
</script>
