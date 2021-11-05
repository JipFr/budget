<template>
  <div class="tag" :style="`--bg-color: ${color}`">
    {{ capitalize }}
    <span v-if="cents !== null" class="amount">
      <!-- eslint-disable-next-line no-irregular-whitespace -->
      — <money :cents="cents" />
    </span>
  </div>
</template>

<style lang="scss" scoped>
.tag {
  padding: 0;
  // background: rgba(0, 0, 0, 0.014);
  display: inline-flex;
  align-items: center;
  margin-right: 15px;
  margin-top: 2px;
  font-size: 0.9rem;
  border-radius: 6px;
}
.tag::before {
  content: '';
  display: inline-block;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: var(--bg-color, var(--theme));
  margin-right: 8px;
}
.amount {
  margin-left: 10px;
  color: var(--text-secondary);
}
</style>

<script>
import Money from '~/components/title/Money'

export default {
  components: {
    Money,
  },
  props: {
    tag: {
      type: [String, Number],
      required: true,
    },
    cents: {
      type: Number,
      required: false,
      default: null,
    },
  },
  data() {
    // Get the tag's color, as assigned in `user.js`
    const colors = this.$store.state.user.tagColors
    const tagName = this.tag.toString().trim().toLowerCase()
    const color = colors[tagName]
    return {
      colors,
      color,
    }
  },
  computed: {
    capitalize() {
      return (
        this.tag.toString().slice(0, 1).toUpperCase() +
        this.tag.toString().slice(1)
      )
    },
  },
}
</script>
