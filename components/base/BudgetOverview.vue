<template>
  <div>
    <!-- Main list of categories -->
    <div class="category-list">
      <category-progress-card
        v-for="category in entries"
        :key="category[0]"
        :category="category"
        :percentage="category[1].budgetPercentage"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.card + .card {
  margin-top: 6px;
}
</style>

<script>
// Import components
import CategoryProgressCard from '~/components/base/CategoryProgressCard'

// Import helpers
import { getEntriesData } from '~/util/entries'

export default {
  components: {
    CategoryProgressCard,
  },
  props: {
    payments: {
      type: Array,
      required: true,
    },
  },
  data() {
    const entriesData = this.getEntriesData()

    return {
      ...entriesData,
    }
  },
  watch: {
    payments() {
      // Update transaction list now that it has been updated
      // The reason for update is most likely because of a from/until change
      // Or maybe a refetch. Who knows.....
      const { spendings, entries } = this.getEntriesData()
      this.spendings = spendings
      this.entries = entries
    },
  },
  methods: {
    getEntriesData() {
      return getEntriesData(this.payments, 'budget')
    },
  },
}
</script>
