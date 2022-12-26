<template>
  <div class="differences-wrapper">
    <h3>Differences</h3>
    <div class="cards">
      <card
        v-for="difference in differences"
        :key="`diff-${difference.productName}`"
        :class="expanded && 'expanded'"
      >
        <div class="card-layout">
          <div class="left-side">
            <p class="subtitle">{{ difference.store }}</p>
            <h4 class="store">{{ difference.productName }}</h4>
          </div>
          <div class="right-side">
            <money :cents="difference.was" />
            <arrow-right-icon />
            <money :cents="difference.is" />
          </div>
        </div>
        <div v-if="expanded">
          <hr />
          <div class="comparison">
            <payment-list
              :raw-payments="[difference.data.previousTransaction]"
              minimal
              disable-actions
            />
            <arrow-right-icon />
            <payment-list
              :raw-payments="[difference.data.currentTransaction]"
              minimal
              disable-actions
            />
          </div>
        </div>
      </card>
    </div>
  </div>
</template>

<style lang="scss" scoped>
h3 {
  font-size: 1rem;
  font-weight: normal;
  color: var(--text);
  margin-bottom: 5px;
}

hr {
  margin: 20px 0;
  width: 100%;
  height: 1px;
  border: 0;
  background: var(--border);
}

.comparison {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  grid-gap: 10px;
  align-items: center;

  > *:not(svg) {
    height: 100%;
  }

  .list {
    margin: 0;
  }

  svg {
    border-radius: 50%;
    background: var(--content);
    border: 1px solid var(--border);
    padding: 10px;
    box-sizing: content-box;
  }
}

.differences-wrapper {
  margin-bottom: 100px;
}

.cards {
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));

  .expanded {
    grid-column: 1 / -1;
  }
}
.card {
  .card-layout {
    font-weight: medium;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }

  p.subtitle {
    color: var(--text-secondary);
    margin-bottom: 5px;
  }

  h4 {
    color: var(--text);
  }

  .right-side {
    display: flex;
    gap: 10px;
    align-items: center;
    font-size: 1.125rem;

    svg {
      display: block;
      color: var(--text-secondary);
    }
  }
}

@media (prefers-color-scheme: dark) {
  .comparison {
    --content: var(--body);
  }
}

@media (max-width: 1400px) {
  .comparison {
    grid-template-columns: 100%;
    justify-items: center;

    .list {
      width: 100%;
    }

    svg {
      transform: rotate(0.25turn);
    }
  }
}
</style>

<script>
// Import components
import Card from '~/components/layout/Card'
import Money from '~/components/title/Money'
import PaymentList from '~/components/base/PaymentList'

// Import icons
import ArrowRightIcon from '~/assets/icons/arrow-right.svg?inline'

// Import utils
import { getDifferences } from '~/util/getDifferences'

export default {
  components: {
    ArrowRightIcon,
    Card,
    Money,
    PaymentList,
  },
  props: {
    allPayments: {
      type: Array,
      required: true,
    },
    visibleCount: {
      type: Number,
      default: 2,
    },
    expanded: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    differences() {
      const differences = getDifferences(this.allPayments)

      return differences.slice(0, this.visibleCount)
    },
  },
  watch: {
    allPayments() {
      this.$forceUpdate()
    },
  },
}
</script>
