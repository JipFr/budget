<template>
  <div class="tag">{{ capitalize }}</div>
</template>

<style lang="scss" scoped>
.tag {
  padding: 3px 8px;
  background: rgba(0, 0, 0, 0.1);
  display: inline-flex;
  align-items: center;
  margin-right: 3px;
  font-size: 0.9rem;
}
.tag::before {
  content: '';
  display: inline-block;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  margin-right: 5px;
}

@media (prefers-color-scheme: dark) {
  .tag {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 6px;
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
  computed: {
    capitalize() {
      return this.tag.slice(0, 1).toUpperCase() + this.tag.slice(1)
    },
  },
}
</script>
