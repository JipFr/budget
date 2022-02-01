<template>
  <details class="collapsible">
    <summary>
      <div class="summary-top">
        <span>{{ title }}</span>
        <chevron-icon />
      </div>
    </summary>

    <div class="content">
      <slot />
    </div>
  </details>
</template>

<style lang="scss" scoped>
details:not([open]) svg {
  transform: rotate(180deg);
}
details > summary {
  list-style: none;
}
details > summary::-webkit-details-marker {
  display: none;
}
.summary-top {
  display: flex;
  justify-content: space-between;
  font-size: 1.2rem;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 10px;
  font-weight: bold;
  svg {
    display: block;
  }
}
</style>

<script>
// Import icons
import ChevronIcon from '~/assets/icons/chevron-down.svg?inline'
export default {
  components: {
    ChevronIcon,
  },
  props: {
    title: {
      type: String,
      required: false,
      default: '',
    },
  },
}
</script>
