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
}
</style>
