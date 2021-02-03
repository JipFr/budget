<template>
  <div class="loading"></div>
</template>

<style lang="scss" scoped>
.loading {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  background-image: linear-gradient(
    to bottom,
    transparent 49%,
    var(--theme) 51%
  );
  animation: spin 2s infinite;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@media (prefers-color-scheme: dark) {
  .loading {
    --theme: var(--text);
  }
}
</style>
