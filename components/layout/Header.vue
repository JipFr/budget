<template>
  <div class="header-wrapper">
    <header style="border-top: env(safe-area-inset-top) solid var(--theme)">
      <container>
        <div></div>
        <div>Overview</div>
        <div></div>
      </container>
    </header>
  </div>
</template>

<style lang="scss">
header {
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  padding: 15px 0;
  padding-top: 20px;
  font-family: Inter, Arial;
  font-weight: bold;
  background: var(--body);

  .container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 10px;

    > * {
      display: flex;
    }
    > * :nth-child(1) {
      justify-content: flex-start;
    }
    > *:nth-child(2) {
      justify-content: center;
    }
    > *:nth-child(3) {
      justify-content: flex-end;
    }
  }
}

.header-wrapper {
  margin-bottom: calc(60px + env(safe-area-inset-top));
}
@media (prefers-color-scheme: dark) {
  header {
    border-color: var(--content);
  }
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
