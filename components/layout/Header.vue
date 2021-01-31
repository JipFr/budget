<template>
  <div class="header-wrapper">
    <header style="border-top: env(safe-area-inset-top) solid var(--theme)">
      <container class="limited-width">
        <img class="logo" src="https://starships.me/icon.png" />
      </container>
    </header>
  </div>
</template>

<style lang="scss">
header {
  width: 100%;
  padding: 20px 0;
  position: fixed;
  top: 0;
  left: 0;
  background: var(--body);

  .logo {
    height: 30px;
    border-radius: 6px;
    display: block;
  }
}

.header-wrapper {
  margin-bottom: calc(60px + env(safe-area-inset-top));
}
</style>

<script>
// Import Capacitor
import { Capacitor, Plugins, StatusBarStyle } from '@capacitor/core'
import Container from '~/components/layout/Container'
const { StatusBar } = Plugins

export default {
  components: {
    Container,
  },
  beforeCreate() {
    if (Capacitor.platform === 'ios') {
      StatusBar.setStyle({
        style: StatusBarStyle.Dark,
      })
    }
  },
}
</script>
