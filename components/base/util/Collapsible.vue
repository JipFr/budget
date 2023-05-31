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
details {
  background: var(--content);
  border: 1px solid var(--border);
  border-radius: 6px;
}
details:not([open]) svg {
  transform: rotate(-180deg);
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
  font-size: 1.25rem;
  padding: 15px 20px;

  svg {
    display: block;
    transition: transform 200ms;
  }
}
.content {
  padding: 15px 20px;
  border-top: 1px solid var(--border);

  a {
    color: var(--anchor);
  }
}

@media (max-width: 949px) {
  .summary-top {
    font-size: 1rem;
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
