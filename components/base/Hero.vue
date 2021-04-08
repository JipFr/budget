<template>
  <div class="hero" :class="isLoading ? 'loading' : ''">
    <div class="hero-layout">
      <card class="fw highlight">
        <subtitle>In this period...</subtitle>
        <h1>
          <money :cents="regularTotal" />
        </h1>
      </card>
      <card class="fw">
        <subtitle>Food remaining (of <money :cents="foodTotal" />)</subtitle>
        <h1>
          <money :cents="foodTotal - foodSpent" />
        </h1>
      </card>
      <card>
        <subtitle>Gained</subtitle>
        <h2>
          <money :cents="gained" />
        </h2>
      </card>
      <card>
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
        if (!payment.categories.includes('exclude')) {
          // If it's food, keep a seperate "food total"
          // Otherwise add it to the normal total
          if (
            payment.categories.includes('eten') ||
            payment.categories.includes('food')
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
