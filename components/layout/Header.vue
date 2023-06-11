<template>
  <div class="header-wrapper">
    <header>
      <container class="limited-width">
        <div class="sidebar-toggle" @click="$emit('toggle-sidebar')">
          <menu-icon />
        </div>
        <logo />
        <div>
          <loader v-if="plaidLoading" />
        </div>
      </container>
    </header>
  </div>
</template>

<style lang="scss" scoped>
header {
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  height: calc(64px + env(safe-area-inset-top));
  display: flex;
  align-items: center;
  z-index: 10;
  font-family: Inter, Arial;
  font-weight: bold;
  background: var(--body);
  border-top: env(safe-area-inset-top) solid var(--theme);

  .container {
    display: grid;
    grid-template-columns: 32px 1fr 32px;
    justify-content: center;
    align-items: center;
    grid-gap: 10px;

    .sidebar-toggle {
      background: var(--content);
      width: 32px;
      height: 32px;
      border-radius: 4px;
      border: 1px solid var(--border);
      display: flex;
      justify-content: center;
      align-items: center;
    }

    svg {
      display: block;
    }

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

  .logo {
    font-weight: normal;
  }
}

.header-wrapper {
  margin-bottom: 60px;
}
@media (prefers-color-scheme: dark) {
  header {
    border-color: var(--body);
  }
}

@media (min-width: 701px) {
  .header-wrapper {
    display: none;
  }
}
</style>

<script>
import { plaidState } from '~/plugins/plaid-import-transactions.client'

// Import components
import Container from '~/components/layout/Container'
import Logo from '~/components/base/util/Logo'
import Loader from '~/components/util/Loader'

// Import icons
import MenuIcon from '~/assets/icons/menu.svg?inline'

export default {
  components: {
    Container,
    Logo,
    MenuIcon,
    Loader,
  },
  props: {
    title: {
      type: String,
      required: false,
      default: 'No title',
    },
  },
  computed: {
    plaidLoading() {
      return plaidState.loading
    },
  },
}
</script>
