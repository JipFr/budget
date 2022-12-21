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
@media screen and (min-width: 1350px) {
  .container {
    width: calc(100% - 90px);
    max-width: 1300px;
  }
}
@media (min-width: 950px) and (max-width: 1349px) {
  .container {
    width: 90%;
    max-width: 930px;
  }
}
</style>
