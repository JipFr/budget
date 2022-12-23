<template>
  <div class="hero" :class="isLoading ? 'loading' : ''">
    <div class="hero-layout">
      <div class="padded">
        <subtitle>Your balance this period</subtitle>
        <h2>
          <money :cents="regularTotal" />
        </h2>
      </div>
      <div v-if="foodTotal !== 0 || foodSpent !== 0" class="padded">
        <subtitle>Food remaining (of <money :cents="foodTotal" />)</subtitle>
        <h2>
          <money :cents="foodTotal - foodSpent" />
        </h2>
      </div>

      <div v-if="foodTotal === 0 && foodSpent === 0" class="padded">
        <subtitle>Gained</subtitle>
        <h2>
          <money :cents="gained" />
        </h2>
      </div>
      <div v-if="foodTotal === 0 && foodSpent === 0" class="padded">
        <subtitle>Spent</subtitle>
        <h2>
          <money :cents="spent" />
        </h2>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.hero-layout > div {
  h2 {
    font-size: 28px;
    margin-top: 10px;
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
      foodTotal: 0,
      foodSpent: 0,
    }
  },
  computed: {
    isLoading() {
      return this.$store.state.user.data.loading
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
      this.gained = 0
      this.spent = 0
      this.regularTotal = 0
      this.foodTotal = 0
      this.foodSpent = 0

      // Now go over each transaction and add it to the relevant field
      for (const payment of this.payments) {
        const lowercaseCategories = payment.categories.map((category) =>
          category.toLowerCase()
        )

        if (!lowercaseCategories.includes('exclude')) {
          // If it's food, keep a seperate "food total"
          // Otherwise add it to the normal total
          if (
            lowercaseCategories.includes('eten') ||
            lowercaseCategories.includes('food')
          ) {
            if (payment.cents > 0) {
              this.foodTotal += payment.cents
            } else {
              this.foodSpent += payment.cents * -1
            }
          } else if (
            lowercaseCategories.includes('eten aanpassen') ||
            lowercaseCategories.includes('adjust food')
          ) {
            this.regularTotal -= payment.cents
            this.foodTotal += payment.cents
          } else {
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
    },
  },
}
</script>
