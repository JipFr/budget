<template>
  <card>
    <div class="card-title spread">
      <tag :tag="category[0]" />
    </div>
    <div
      class="progress-bar"
      :style="`--width: ${category[1].spentPercentage}%; --tag-color: ${
        colors[category[0]]
      }`"
    >
      <div class="progress-inner"></div>
    </div>
    <div class="cat-info">
      <div
        v-for="field of category[1].fields"
        :key="field.label"
        class="category-information"
      >
        <p>{{ field.label }}:</p>
        <money v-if="field.type === 'money'" :cents="field.value" />
        <span v-else-if="field.type === 'percentage'">{{ field.value }}%</span>
        <span v-else>{{ field.value }}</span>
      </div>

      <slot />
    </div>
  </card>
</template>

<style lang="scss" scoped>
.card-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.is-paragraph {
  margin: 20px 0;
  color: var(--text-secondary);
}

.cat-info {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 5px;
  margin-top: 10px;

  .category-information {
    display: grid;
    grid-template-columns: 70px 1fr;
  }
}
.progress-bar {
  width: 100%;
  border-radius: 4px;
  height: 6px;
  background: var(--body);
  margin-top: 10px;
  overflow: hidden;

  .progress-inner {
    width: var(--width, 50%);
    height: 100%;
    background: var(--tag-color, var(--theme));
  }
}
</style>

<script>
// Import components
import Card from '~/components/layout/Card'
import Tag from '~/components/base/Tag'
import Money from '~/components/title/Money'

export default {
  components: {
    Card,
    Tag,
    Money,
  },
  props: {
    category: {
      type: Array,
      required: true,
    },
  },
  data() {
    // Get each tag's color, as assigned in `user.js`
    const colors = this.$store.state.user.tagColors

    return {
      colors,
    }
  },
}
</script>
