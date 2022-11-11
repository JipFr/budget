<template>
  <details ref="details">
    <summary>
      <div class="toggle-button">
        <more-vertical-icon />
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
}
details > summary {
  list-style: none;
}
details > summary::-webkit-details-marker {
  display: none;
}

.toggle-button {
  width: 2.25rem;
  height: 2.25rem;
  margin: 0;
  border: 0;
  border-radius: 6px;
  background: var(--content);
  color: var(--text-secondary);
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    width: 1.4rem;
    height: 1.4rem;
    display: block;
  }
}

.dropdown {
  width: 200px;
  position: absolute;
  z-index: 0;
  top: calc(100% + 15px);
  right: 0;
  background: var(--content);
  border-radius: 6px;

  &::after {
    content: '';
    display: block;
    position: absolute;
    right: calc((36px / 2) - (12px / 2));
    transform: rotate(45deg);
    top: -6px;
    width: 12px;
    height: 12px;
    background: var(--content);
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
import MoreVerticalIcon from '~/assets/icons/more-vertical.svg?inline'

export default {
  components: {
    MoreVerticalIcon,
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
  },
}
</script>
