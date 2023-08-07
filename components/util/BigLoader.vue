<template>
  <div class="big-loader">
    <krab-icon class="icon" />
    Loading...
  </div>
</template>

<style lang="scss" scoped>
.big-loader {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 80vh;
  gap: 1rem;
}
.icon {
  width: 8rem;
  height: 8rem;
  border-radius: 6px;
  filter: grayscale(0.2);
  // animation: 3s slowJiggle infinite;
}

@keyframes slowJiggle {
  0% {
    transform: rotate(-5deg);
  }
  50% {
    transform: rotate(5deg);
  }
  100% {
    transform: rotate(-5deg);
  }
}
</style>

<script>
import KrabIcon from '~/assets/logos/krab-full-pride.svg?inline'

export default {
  components: {
    KrabIcon,
  },
}
</script>
