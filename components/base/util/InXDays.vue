<!-- eslint-disable no-irregular-whitespace -->
<template>
  <span class="in-x-days">
    <span v-if="days === 0"> Today </span>
    <span v-else-if="days === 1"> Tomorrow </span>
    <span v-else>
      - in {{ days }}
      {{ days == 1 ? 'day' : 'days' }}
    </span>
  </span>
</template>

<style lang="scss" scoped>
.in-x-days {
  color: var(--text-secondary);
  font-weight: 500;
}
</style>

<script>
export default {
  props: {
    days: {
      type: Number,
      required: true,
    },
  },
}
</script>
