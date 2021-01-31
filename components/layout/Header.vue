<template>
  <header style="border-top: env(safe-area-inset-top) solid rgba(0, 0, 0, 0.1)">
    <img class="logo" src="https://bsl.jipfr.nl/icon.png" />
  </header>
</template>

<style lang="scss">
header {
  width: 100%;
  padding: 5px 20px;
  position: fixed;
  top: 0;
  left: 0;
  background: var(--theme);
  display: grid;
  place-items: center;

  .logo {
    height: 45px;
    border-radius: 6px;
  }
}
</style>
