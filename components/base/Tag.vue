<template>
  <div class="tag" :style="`--bg-color: ${color}`">{{ capitalize }}</div>
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
  background: var(--bg-color, rgba(0, 0, 0, 0.2));
  margin-right: 8px;
}

@media (prefers-color-scheme: dark) {
  .tag {
    background: rgba(255, 255, 255, 0.1);
  }
  .tag::before {
    background: rgba(255, 255, 255, 0.2);
  }
}
</style>

<script>
export default {
  props: {
    tag: {
      type: String,
      required: true,
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
      return this.tag.slice(0, 1).toUpperCase() + this.tag.slice(1)
    },
  },
}
</script>
