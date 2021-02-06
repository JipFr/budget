<template>
  <div>
    <!-- Main list of categories -->
    <div class="category-list">
      <category-progress-card
        v-for="category in entries"
        :key="category[0]"
        :category="category"
        :percentage="category[1].spentPercentage"
      >
        <div class="is-link" @click="(_) => showTransactions(category[0])">
          <p>Show transactions in period</p>
        </div>
      </category-progress-card>
    </div>

    <!-- Overlay to see all transactions -->
    <overlay :show-button="false" :open="overlayOpen" @toggle-open="toggleOpen">
      <!-- Description -->
      <h2>Category overview</h2>
      <p class="is-paragraph">
        This is showing all transactions in your selected period for the '{{
          categoryName
        }}' category.
      </p>
      <hr />

      <!-- Payment list -->
      <payment-list :raw-payments="overlayTransactions" />
    </overlay>
  </div>
</template>

<style lang="scss" scoped>
.card + .card {
  margin-top: 6px;
}
.is-link {
  grid-column: 1 / -1;
  color: var(--anchor);
  margin-top: 10px;
  cursor: pointer;
}
</style>

<script>
// Import vuex
import { mapMutations } from 'vuex'

// Import components
import Overlay from '~/components/base/util/Overlay'
import PaymentList from '~/components/base/PaymentList'
import CategoryProgressCard from '~/components/base/CategoryProgressCard'

// Import helpers
import { getEntriesData } from '~/util/entries'

export default {
  components: {
    Overlay,
    PaymentList,
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

    // Find existing pop-up
    const existingName = this.$store.state.user.viewingCat

    const categoryData = existingName
      ? this.showTransactions(existingName)
      : {
          overlayOpen: false,
          overlayTransactions: [],
          categoryName: '',
        }

    return {
      ...entriesData,
      ...categoryData,
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
      return getEntriesData(this.payments, 'category')
    },
    showTransactions(categoryName) {
      // Now get all transactions with the category's name and display it

      // get all transactions
      const user = this.$store.state.user.data
      const transactions = user.transactionsInPeriod || []

      const relevantTransactions = transactions.filter((v) => {
        return (
          v.categories.includes(categoryName) ||
          (categoryName === 'other' && v.categories.length === 0)
        )
      })

      this.overlayTransactions = relevantTransactions
      this.categoryName = categoryName
      this.overlayOpen = true
      this.setViewing(categoryName)
      return {
        overlayTransactions: relevantTransactions,
        categoryName,
        overlayOpen: true,
      }
    },
    toggleOpen() {
      this.overlayOpen = !this.overlayOpen
      if (!this.overlayOpen) {
        setTimeout(() => {
          this.categoryName = ''
          this.setViewing('')
        }, 500)
      }
    },
    ...mapMutations({
      setViewing: 'user/setViewing',
    }),
  },
}
</script>
