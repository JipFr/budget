<template>
  <details ref="details" tabindex="0" @click="onElementClick" @keyup="onKeyUp">
    <summary tabindex="-1">
      <div class="toggle-button">
        <component :is="icon" />
      </div>
    </summary>

    <div class="dropdown">
      <slot />
    </div>
  </details>
</template>

<style lang="scss" scoped>
details {
  position: relative;
  z-index: 0;

  &[open] {
    z-index: 9;
  }
}
details > summary {
  list-style: none;
}
details > summary::-webkit-details-marker {
  display: none;
}

[open] .toggle-button {
  background: var(--content-darker);
}

details:not([open]) .toggle-button:hover {
  background: var(--content-light);
}

.toggle-button {
  width: var(--button-size, 39.5px);
  height: var(--button-size, 39.5px);
  margin: 0;
  border: 0;
  border-radius: 6px;
  background: var(--content);
  color: var(--text-secondary);
  border: var(--button-border-width, 1px) solid var(--border);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  svg {
    width: 1.4rem;
    height: 1.4rem;
    display: block;
  }
}

.dropdown {
  width: var(--dropdown-width, 200px);
  position: absolute;
  z-index: 0;
  top: calc(100% + 15px);
  right: 0;
  background: var(--content);
  border: 1px solid var(--border);
  border-radius: 6px;

  &::after {
    content: '';
    display: block;
    position: absolute;
    // Center chevron: (Button size - border) - (half of width)
    right: calc(((var(--button-size, 36px) - 2px) / 2) - (12px / 2));
    transform: rotate(45deg);
    top: -6px;
    width: 12px;
    height: 12px;
    background: var(--content);
    border-left: 1px solid var(--border);
    border-top: 1px solid var(--border);
    z-index: -1;
    border-top-left-radius: 4px;
  }

  > *:first-child {
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
  }

  > *:last-child {
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
  }
}
</style>

<script>
// Import icons
import { nextTick } from 'process'
import MoreVerticalIcon from '~/assets/icons/more-vertical.svg?inline'

export default {
  props: {
    icon: {
      type: Object,
      default: () => MoreVerticalIcon,
    },
  },
  mounted() {
    window.addEventListener('click', this.onClick)
  },
  beforeDestroy() {
    window.removeEventListener('click', this.onClick)
  },
  methods: {
    onClick() {
      this.$refs.details.removeAttribute('open')
    },
    onElementClick() {
      if (this.$refs.details.getAttribute('open') !== null)
        nextTick(this.onClick)
    },
    toggleOpen() {
      this.$refs.details.toggleAttribute('open')
    },
    onKeyUp(evt) {
      if (evt.key === 'Enter') this.toggleOpen()
    },
  },
}
</script>
