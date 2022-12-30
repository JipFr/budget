<template>
  <div v-if="differences.length > 0" class="differences-wrapper">
    <h3>Differences</h3>
    <div class="cards">
      <card
        v-for="difference in differences"
        :key="`diff ${difference.store} ${difference.productName}`"
        :class="expanded && 'expanded'"
      >
        <overlay
          v-if="expanded"
          :show-button="false"
          :open="
            overlayOpen === `${difference.store}-${difference.productName}`
          "
          @toggle-open="toggleOpen"
        >
          <!-- Description -->
          <h2>Differences</h2>
          <p class="is-paragraph">
            Previous and new transaction for "{{ difference.productName }}" at
            {{ difference.store }}
          </p>
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
        </overlay>
        <div class="card-layout">
          <div class="left-side">
            <p class="subtitle">{{ difference.store }}</p>
            <h4 class="store">{{ difference.productName }}</h4>
          </div>
          <div class="right-side">
            <div class="money-diff">
              <money :cents="difference.was" />
              <arrow-right-icon />
              <money :cents="difference.is" />
            </div>
            <button
              v-if="expanded"
              @click="
                overlayOpen = `${difference.store}-${difference.productName}`
              "
            >
              View transactions
            </button>
          </div>
        </div>
      </card>
    </div>
  </div>
  <div v-else-if="expanded" class="empty-state">
    <p>
      There are no differences between prices found in products you purchased in
      the last 30 days
    </p>
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
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
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
    flex-direction: column;
    align-items: flex-end;

    button {
      margin-top: 0.5rem;
      font-size: 1rem;
      background: transparent;
      border: 0;
      padding: 0;
      color: var(--anchor);
    }
  }

  .money-diff {
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

.empty-state {
  width: 100%;
  background: var(--content);
  height: 300px;
  padding: 5vw;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
  text-align: center;
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

@media (max-width: 700px) {
  .differences-wrapper {
    margin-bottom: 50px;
  }
}
</style>

<script>
// Import components
import Card from '~/components/layout/Card'
import Money from '~/components/title/Money'
import PaymentList from '~/components/base/PaymentList'
import Overlay from '~/components/base/util/Overlay'

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
    Overlay,
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
  data() {
    return {
      overlayOpen: false,
    }
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
  methods: {
    toggleOpen() {
      this.overlayOpen = !this.overlayOpen
    },
  },
}
</script>
