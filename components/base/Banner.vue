<template>
  <div class="banner" :data-type="type">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.banner {
  padding: 12px;
  border-radius: 3px;
  border-left: 4px solid var(--negative);
  background: rgba(255, 0, 0, 0.1);
  margin-bottom: 20px;

  &[data-type='message'] {
    border-left-color: var(--anchor);
    background: rgba(0, 200, 255, 0.1);
  }

  &[data-type='warning'] {
    border-left-color: rgb(255, 204, 0);
    background: rgba(255, 251, 0, 0.1);
  }
}
</style>

<script>
export default {
  props: {
    type: {
      type: String,
      required: false,
      default: 'error',
    },
  },
}
</script>
