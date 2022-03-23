<template>
  <div class="header-wrapper">
    <header>
      <container>
        <div></div>
        <div>
          <crab-icon />
          {{ title }}
        </div>
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
  padding: 20px 0;
  font-family: Inter, Arial;
  font-weight: bold;
  background: var(--body);
  border-top: env(safe-area-inset-top) solid var(--theme);

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

  svg {
    width: 1.5rem;
    height: 1.5rem;
    fill: var(--text);
    margin-right: 10px;
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

// Import icons
import CrabIcon from '~/assets/logos/crab.svg?inline'

const { StatusBar } = Plugins

export default {
  components: {
    Container,
    CrabIcon,
  },
  props: {
    title: {
      type: String,
      required: false,
      default: 'No title',
    },
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
