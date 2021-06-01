<template>
  <div class="container">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.container {
  width: 100%;
  margin: 0 auto;
  max-width: 500px;
  &.limited-width {
    width: calc(100% - 40px);
  }
}
@media screen and (min-width: 1150px) {
  .container {
    width: 90%;
  }
}
</style>
