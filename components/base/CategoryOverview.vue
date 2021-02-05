<template>
  <div>
    <!-- Main list of categories -->
    <div class="category-list">
      <category-progress-card
        v-for="category in entries"
        :key="category[0]"
        :category="category"
      />
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
</style>

<script>
// Import vuex
import { mapMutations } from 'vuex'

// Import components
import Overlay from '~/components/base/util/Overlay'
import PaymentList from '~/components/base/PaymentList'
import CategoryProgressCard from '~/components/base/CategoryProgressCard'

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
      // Map all payments into an object that shows how much money each category has spent
      const spendings = {}

      for (const payment of this.payments) {
        // If there are no categories, add 'other' so it gets added to that
        if (payment.categories.length === 0) {
          payment.categories.push('other')
        }

        for (let tag of payment.categories) {
          tag = tag.toLowerCase().trim()
          if (tag === 'exclude') continue

          // Ensure spendings has a field for it
          if (!spendings[tag]) {
            spendings[tag] = {
              gained: 0,
              spent: 0,
            }
          }

          if (payment.cents > 0) {
            spendings[tag].gained += payment.cents
          } else {
            spendings[tag].spent += payment.cents * -1
          }
        }
      }

      // Make an array of the entries
      let entries = Object.entries(spendings)

      // Find largest "spent" field in categories, then compare the rest to it
      for (const entry of entries) {
        // Get percentage of "gained"
        const total = entry[1].gained + entry[1].spent
        entry[1].spentPercentage = (entry[1].gained / total) * 100
        entry[1].total = total
      }

      entries = entries.sort(
        (a, b) => b[1].total - a[1].total // Sort by amount of spending and gained combined; large to small
      )

      return {
        spendings,
        entries,
      }
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
