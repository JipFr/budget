<template>
  <card>
    <div class="card-core">
      <subtitle>
        <span class="bold">{{ payment.description }}</span>
        <div v-if="payment.categories" class="tags">
          <tag v-for="tag in payment.categories || []" :key="tag" :tag="tag" />
        </div>
      </subtitle>
      <money :cents="payment.cents" />
    </div>
  </card>
</template>

<style lang="scss" scoped>
.bold {
  font-weight: bold;
}
.thin {
  color: var(--text-secondary);
}
.card-core {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.tags {
  margin-top: 5px;
}
</style>

<script>
// Import components
import Card from '~/components/layout/Card'
import Subtitle from '~/components/title/Subtitle'
import Money from '~/components/title/Money'
import Tag from '~/components/base/Tag'

export default {
  components: {
    Card,
    Subtitle,
    Money,
    Tag,
  },
  props: {
    payment: {
      type: Object,
      required: true,
    },
  },
}
</script>
