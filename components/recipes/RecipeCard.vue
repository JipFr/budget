<template>
  <card>
    <h4 class="title">{{ recipe.title }}</h4>
    <hr />
    <div class="icon-with-text">
      <watch-icon />
      <span>{{ recipe.durationInMinutes }} minutes</span>
    </div>
  </card>
</template>

<style lang="scss" scoped>
.title {
  font-size: 1rem;
  font-weight: 500;
}
hr {
  margin: 20px 0;
  border: 0;
  width: calc(100% + 30px);
  margin-left: -15px;
  height: 1px;
  background: var(--border);
}
.icon-with-text {
  display: flex;
  gap: 10px;
  align-items: center;

  svg {
    display: block;
  }
}
</style>

<script>
// Import components
import Card from '~/components/layout/Card'

// Import icons
import WatchIcon from '~/assets/icons/watch.svg?inline'

export default {
  components: {
    Card,
    WatchIcon,
  },
  props: {
    recipe: {
      type: Object,
      required: true,
    },
  },
}
</script>
