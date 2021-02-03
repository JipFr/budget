<template>
  <div class="banner">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.banner {
  padding: 12px;
  border-radius: 3px;
  border-left: 4px solid var(--negative);
  background: rgba(255, 0, 0, 0.1);
}
</style>
