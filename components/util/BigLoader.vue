<template>
  <div class="big-loader">Loading...</div>
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
