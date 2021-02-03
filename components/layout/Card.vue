<template>
  <div class="card">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.card {
  padding: 15px;
  border-radius: 6px;
  background: var(--content);
  border: 1px solid transparent;
}
@media (prefers-color-scheme: light) {
  .card.highlight {
    background: var(--theme);
    --text-secondary: #e2e2e2;
    color: white;
    --negative: rgb(255, 255, 255);
  }
}
</style>
