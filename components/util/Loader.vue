<template>
  <loader-icon class="loader" />
</template>

<style lang="scss" scoped>
.loader {
  color: var(--text-secondary);
  display: block;
  animation: 2s spin infinite linear;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

<script>
import LoaderIcon from '~/assets/icons/loader.svg?inline'

export default {
  components: {
    LoaderIcon,
  },
}
</script>
