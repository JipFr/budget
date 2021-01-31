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

  &.highlight {
    background: var(--theme);
    --text-secondary: #e2e2e2;
    color: white;
  }
}
</style>
