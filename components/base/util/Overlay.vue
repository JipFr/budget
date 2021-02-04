<template>
  <div class="overlay-top-wrapper" :class="getClass">
    <div
      class="toggle-button"
      :class="showButton ? '' : 'invisible-when-closed'"
      @click="$emit('toggle-open')"
    >
      <plus-circle-icon />
    </div>
    <div class="content">
      <container class="limited-width">
        <slot />
      </container>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.toggle-button {
  background: var(--content);
  border: 2px solid var(--body);
  box-sizing: content-box;
  padding: 20px;
  padding-bottom: calc(20px + env(safe-area-inset-bottom));
  border-top-left-radius: 200px;
  border-top-right-radius: 200px;
  margin: 10px 0;
  transition: border-radius 500ms, padding-bottom 300ms, opacity 300ms;
  display: inline-block;
  color: var(--text-secondary);

  svg {
    display: block;
    transition: transform 500ms;
  }
}

.overlay-top-wrapper {
  position: fixed;
  top: calc(100% - 70px - env(safe-area-inset-bottom));
  transition: top 300ms, background 300ms;
  left: 0;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-end;

  &.open {
    top: env(safe-area-inset-top);
    background: rgba(0, 0, 0, 0.2);

    .toggle-button {
      border-radius: 200px;
      background: var(--body);
      padding-bottom: 20px;
    }
    .toggle-button svg {
      transform: rotate(135deg);
    }
  }

  // Hide button when neccesary
  &:not(.open) .toggle-button.invisible-when-closed {
    opacity: 0;
  }
  &:not(.open) .toggle-button.invisible-when-closed,
  &.invisible-when-closed:not(.open) {
    pointer-events: none;
  }
}

// Main "content" below the button
.content {
  height: calc(100vh - 76px - env(safe-area-inset-top));
  max-height: calc(100vh - 76px - env(safe-area-inset-top));
  overflow-y: auto;
  padding: 40px 0;
  width: 100%;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  background: var(--body);
}

@media (prefers-color-scheme: dark) {
  .overlay-top-wrapper.open {
    background: rgba(0, 0, 0, 0.6);
  }
}
</style>

<style lang="scss">
.overlay-top-wrapper .content {
  // Util
  h2 {
    margin-bottom: 20px;
  }
  hr {
    margin: 20px 0;
    border: 0;
    height: 1px;
    background: var(--border);
  }
}
</style>

<script>
import Container from '~/components/layout/Container'

// Import icons
import PlusCircleIcon from '~/assets/icons/plus-circle.svg?inline'

export default {
  components: {
    Container,
    PlusCircleIcon,
  },
  props: {
    open: {
      type: Boolean,
      required: true,
    },
    showButton: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    getClass() {
      const classes = []

      classes.push(this.open ? 'open' : 'closed')
      if (!this.showButton) classes.push('invisible-when-closed')

      return classes.join(' ')
    },
  },
}
</script>
