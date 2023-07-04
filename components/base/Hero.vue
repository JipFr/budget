<template>
  <div class="hero" :class="isLoading ? 'loading' : ''">
    <div class="hero-layout">
      <div class="padded">
        <div>
          <subtitle :class="(loading || isLoading) && 'skeleton-text'">
            Your balance this period
          </subtitle>
        </div>
        <h2 :class="(loading || isLoading) && 'skeleton-text'">
          <money :cents="regularTotal" />
        </h2>
      </div>
      <div
        v-if="
          (foodInfo && foodInfo.availableMoneyToday) || loading || isLoading
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
import { getFoodInfo } from '~/util/food'

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
  fetch() {
    this.setData()
  },
  fetchOnServer: false,
  data() {
    return {
      gained: 0,
      spent: 0,
      regularTotal: 0,
      loading: true,
    }
  },
  computed: {
    isLoading() {
      return this.$store.state.user.data.loading
    },
    foodInfo() {
      return this.payments.length > 0 ? getFoodInfo(this.payments) : null
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
      this.regularTotal = 0

      // Now go over each transaction and add it to the relevant field
      for (const payment of this.payments) {
        const lowercaseCategories = payment.categories.map((category) =>
          category.toLowerCase()
        )

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
