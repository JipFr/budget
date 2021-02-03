<template>
  <div class="new-transaction-wrapper">
    <div class="fixed-button">
      <plus-circle-icon />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.new-transaction-wrapper {
  position: fixed;
  top: calc(100% - 60px - env(safe-area-inset-bottom));
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}
.fixed-button {
  background: var(--content);
  padding: 20px;
  border-top-left-radius: 1000px;
  border-top-right-radius: 1000px;
  display: inline-block;
  color: var(--theme);

  svg {
    display: block;
  }
}

@media (prefers-color-scheme: dark) {
  .fixed-button {
    color: var(--text);
  }
}
</style>

<script>
// Import icons
import PlusCircleIcon from '~/assets/icons/plus-circle.svg?inline'

export default {
  components: {
    PlusCircleIcon,
  },
}
</script>
