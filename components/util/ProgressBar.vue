<template>
  <div class="progress-bar spread">
    <div class="bar">
      <div
        class="progress-bar-inner"
        :style="`width: ${calculatedPercentage}%; background-color: ${getPercentageColor(
          calculatedPercentage
        )}`"
      ></div>
    </div>

    <span class="no-wrap">
      {{ label ? label : `${calculatedPercentage}%` }}
    </span>
  </div>
</template>

<style lang="scss" scoped>
.bar {
  width: 100%;
  height: 10px;
  background: var(--content-light);
  border-radius: 100px;
  overflow: hidden;

  .progress-bar-inner {
    height: 100%;
    background: green;
  }
}
.spread {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;

  .no-wrap {
    white-space: nowrap;
  }
}
</style>

<script>
import { getPercentageColor } from '~/util/recipeInfo'

export default {
  props: {
    percentage: {
      type: Number,
      required: true,
    },
    label: {
      type: String,
      default: null,
    },
  },
  computed: {
    calculatedPercentage() {
      return Math.max(Math.min(100, this.percentage), 0)
    },
  },
  methods: {
    getPercentageColor,
  },
}
</script>
