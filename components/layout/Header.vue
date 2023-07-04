<template>
  <div class="header-wrapper">
    <header>
      <container class="limited-width">
        <div class="sidebar-toggle" @click="$emit('toggle-sidebar')">
          <menu-icon />
        </div>
        <logo />
        <div>
          <plugin-loader />
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

  --content-darker: rgba(0, 0, 0, 0.2); // For the plugin loader
  --theme: #457461;

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
// Import components
import Container from '~/components/layout/Container'
import Logo from '~/components/base/util/Logo'
import PluginLoader from '~/components/util/PluginLoader'

// Import icons
import MenuIcon from '~/assets/icons/menu.svg?inline'

export default {
  components: {
    Container,
    Logo,
    MenuIcon,
    PluginLoader,
  },
  props: {
    title: {
      type: String,
      required: false,
      default: 'No title',
    },
  },
}
</script>
