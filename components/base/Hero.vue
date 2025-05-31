<template>
  <div class="hero" :class="isLoading ? 'loading' : ''">
    <div class="hero-layout">
      <!-- Balance this month -->
      <div v-if="enabledSidebarItems.includes('total')" class="padded">
        <div>
          <subtitle :class="(loading || isLoading) && 'skeleton-text'">
            Your balance this period
          </subtitle>
        </div>
        <h2 :class="(loading || isLoading) && 'skeleton-text'">
          <money :cents="regularTotal" />
        </h2>
      </div>

      <!-- Food budget in total this month -->
      <div
        v-if="
          foodInfo &&
          foodInfo.remainingBudget &&
          enabledSidebarItems.includes('foodtotal')
        "
        class="padded"
      >
        <div>
          <subtitle :class="(loading || isLoading) && 'skeleton-text'">
            Food (of <money :cents="foodInfo?.totalBudget || 0" />)
          </subtitle>
        </div>
        <h2 :class="(loading || isLoading) && 'skeleton-text'">
          <money :cents="foodInfo?.remainingBudget || 0" />
        </h2>
      </div>

      <!-- Total spent this month -->
      <div
        v-if="
          enabledSidebarItems.includes('spenttotal') &&
          (allSpent || loading || isLoading)
        "
        class="padded"
      >
        <div>
          <subtitle :class="(loading || isLoading) && 'skeleton-text'">
            Total spent (- savings)
          </subtitle>
        </div>
        <h2 :class="(loading || isLoading) && 'skeleton-text'">
          <money :cents="allSpent" />
        </h2>
      </div>

      <!-- Total gained this month -->
      <div
        v-if="
          enabledSidebarItems.includes('gainedtotal') &&
          (allGained || loading || isLoading)
        "
        class="padded"
      >
        <div>
          <subtitle :class="(loading || isLoading) && 'skeleton-text'">
            Total gained (- savings)
          </subtitle>
        </div>
        <h2 :class="(loading || isLoading) && 'skeleton-text'">
          <money :cents="allGained" />
        </h2>
      </div>

      <!-- Food today -->
      <div
        v-if="
          ((foodInfo && foodInfo.availableMoneyToday) ||
            loading ||
            isLoading) &&
          enabledSidebarItems.includes('foodtoday')
        "
        class="padded"
      >
        <div>
          <subtitle :class="(loading || isLoading) && 'skeleton-text'">
            Food available today
          </subtitle>
        </div>
        <h2 :class="(loading || isLoading) && 'skeleton-text'">
          <money :cents="foodInfo?.availableMoneyToday || 0" />
        </h2>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.hero-layout > div {
  h2 {
    font-size: 1.5rem;
    margin-top: 10px;
  }
  .skeleton-text {
    color: transparent;
    user-select: none;
    background: var(--border);
    display: inline-block;
  }

  & + div {
    border-top: 1px solid var(--border);
  }
}
</style>

<script>
// Import components
import Subtitle from '~/components/title/Subtitle'
import Money from '~/components/title/Money'

// Import utils
import { getFoodInfo } from '~/util/food'
import { state as settingsState } from '~/util/settings'

export default {
  components: {
    Subtitle,
    Money,
  },
  props: {
    payments: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      gained: 0,
      spent: 0,
      regularTotal: 0,
      loading: true,
    }
  },
  fetch() {
    this.setData()
  },
  fetchOnServer: false,
  computed: {
    isLoading() {
      return this.$store.state.user.data.loading
    },
    foodInfo() {
      return this.payments.length > 0 ? getFoodInfo(this.payments) : null
    },
    enabledSidebarItems() {
      return settingsState.enabledSidebarItems.split(',')
    },
  },
  watch: {
    payments() {
      this.setData()
    },
  },
  methods: {
    setData() {
      // Re-set values
      this.loading = true
      this.gained = 0
      this.spent = 0
      this.allSpent = 0
      this.allGained = 0
      this.regularTotal = 0

      // Now go over each transaction and add it to the relevant field
      for (const payment of this.payments) {
        const lowercaseCategories = payment.categories.map((category) =>
          category.toLowerCase()
        )

        if (
          !lowercaseCategories.includes('exclude') &&
          !payment.categories.includes('sparen')
        ) {
          if (payment.cents > 0) {
            this.allGained += payment.cents
          } else {
            this.allSpent += payment.cents * -1
          }
        }

        if (!lowercaseCategories.includes('exclude')) {
          // If it's food, keep a seperate "food total"
          // Otherwise add it to the normal total

          if (
            lowercaseCategories.includes('eten aanpassen') ||
            lowercaseCategories.includes('adjust food')
          ) {
            this.regularTotal -= payment.cents
          } else if (
            !lowercaseCategories.includes('food') &&
            !lowercaseCategories.includes('eten')
          ) {
            this.regularTotal += payment.cents
          }

          if (
            !(
              lowercaseCategories.includes('eten aanpassen') ||
              lowercaseCategories.includes('adjust food')
            )
          ) {
            if (payment.cents > 0) {
              this.gained += payment.cents
            } else {
              this.spent += payment.cents * -1
            }
          }
        }
      }

      this.loading = false
    },
  },
}
</script>
