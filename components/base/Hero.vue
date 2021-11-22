<template>
  <div class="hero" :class="isLoading ? 'loading' : ''">
    <div class="hero-layout">
      <card
        class="highlight"
        :class="foodTotal === 0 && foodSpent === 0 ? 'fw' : ''"
      >
        <subtitle>In this period...</subtitle>
        <h2 v-if="foodTotal !== 0 || foodSpent !== 0">
          <money :cents="regularTotal" />
        </h2>
        <h1 v-else>
          <money :cents="regularTotal" />
        </h1>
      </card>
      <card v-if="foodTotal !== 0 || foodSpent !== 0">
        <subtitle>Total in period</subtitle>
        <h2>
          <money :cents="gained - spent" />
        </h2>
      </card>
      <card v-if="foodTotal !== 0 || foodSpent !== 0" class="fw">
        <subtitle>Food remaining (of <money :cents="foodTotal" />)</subtitle>
        <h2>
          <money :cents="foodTotal - foodSpent" />
        </h2>
      </card>

      <card v-if="foodTotal === 0 && foodSpent === 0">
        <subtitle>Gained</subtitle>
        <h2>
          <money :cents="gained" />
        </h2>
      </card>
      <card v-if="foodTotal === 0 && foodSpent === 0">
        <subtitle>Spent</subtitle>
        <h2>
          <money :cents="spent" />
        </h2>
      </card>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.hero {
  padding: 40px 0;

  h1,
  h2 {
    font-size: 2rem;
    font-weight: bold;
  }

  h2 {
    font-size: 1.5rem;
  }

  &.loading .money {
    background: var(--overlay-color);
    color: transparent;
  }
}
.hero-layout {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 10px;

  .fw {
    grid-column: 1 / -1;
  }
}
</style>

<script>
// Import components
import Card from '~/components/layout/Card'
import Subtitle from '~/components/title/Subtitle'
import Money from '~/components/title/Money'

export default {
  components: {
    Card,
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
          } else {
            this.regularTotal += payment.cents
          }

          if (payment.cents > 0) {
            this.gained += payment.cents
          } else {
            this.spent += payment.cents * -1
          }
        }
      }
    },
  },
}
</script>
