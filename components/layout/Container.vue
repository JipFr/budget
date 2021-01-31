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
    width: 90%;
  }
}
@media screen and (min-width: 700px) {
  .container {
    width: 90%;
  }
}
</style>
