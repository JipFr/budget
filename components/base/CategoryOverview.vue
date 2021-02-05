<template>
  <div>
    <!-- Main list of categories -->
    <div class="category-list">
      <card v-for="category in entries" :key="category[0]">
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
          <div class="category-information">
            <p>Gained:</p>
            <money :cents="category[1].gained" />
          </div>
          <div class="category-information">
            <p>Spent:</p>
            <money
              :cents="category[1].spent === 0 ? 0 : category[1].spent * -1"
            />
          </div>
          <div class="category-information">
            <p>Ratio:</p>
            <span>{{ Math.round(category[1].spentPercentage) }}%</span>
          </div>
          <div class="category-information">
            <p>Total:</p>
            <money :cents="category[1].gained - category[1].spent" />
          </div>
          <div class="is-link" @click="(_) => showTransactions(category[0])">
            <p>Show transactions in period</p>
          </div>
        </div>
      </card>
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
.card-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.is-link {
  grid-column: 1 / -1;
  color: var(--anchor);
  margin-top: 10px;
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
// Import vuex
import { mapMutations } from 'vuex'

// Import components
import Card from '~/components/layout/Card'
import Tag from '~/components/base/Tag'
import Money from '~/components/title/Money'
import Overlay from '~/components/base/util/Overlay'
import PaymentList from '~/components/base/PaymentList'

export default {
  components: {
    Card,
    Tag,
    Money,
    Overlay,
    PaymentList,
  },
  props: {
    payments: {
      type: Array,
      required: true,
    },
  },
  data() {
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

    // Get each tag's color, as assigned in `user.js`
    const colors = this.$store.state.user.tagColors

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
      spendings,
      entries,
      colors,
      ...categoryData,
    }
  },
  methods: {
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
