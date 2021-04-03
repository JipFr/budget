<template>
  <card class="no-padding">
    <div class="card-core card-sect">
      <subtitle class="is-subtitle">
        <div v-if="entries.length > 0" class="sum-calculated">
          <div
            v-for="entry in entries"
            :key="entry.id"
            class="spread payment-row"
          >
            <span class="bold">{{ entry.description }}</span>
            <div>
              <span v-if="entry.itemCount > 1">{{ entry.itemCount }} x</span>
              <money :cents="entry.centsPerEntry" />
            </div>
          </div>
          <hr />
          <div class="spread">
            <span></span>
            <money :cents="entriesTotalCents" />
          </div>
        </div>
        <span v-else class="bold">
          {{ payment.description }}
        </span>
        <div
          v-if="payment.categories && payment.categories.length > 0"
          class="tags"
        >
          <tag v-for="tag in payment.categories || []" :key="tag" :tag="tag" />
        </div>
      </subtitle>
      <money :cents="payment.cents" />
    </div>
    <div class="card-actions card-sect dec-margin">
      <div class="action-wrapper">
        <button class="action-button" @click="doDelete">
          <trash-icon />
        </button>
        <button class="action-button" @click="doEdit">
          <edit-icon />
        </button>
      </div>
    </div>
  </card>
</template>

<style lang="scss" scoped>
.card {
  display: flex;
  flex-wrap: nowrap;
  // align-items: center;
  overflow-x: auto;
  scroll-snap-type: x mandatory;

  > * {
    width: 100%;
    min-width: 100%;
    scroll-snap-align: start;
  }

  .is-subtitle {
    width: 100%;
    margin-right: 10px;
  }
}

.sum-calculated {
  .payment-row {
    width: calc(100% + 6px);
    padding: 3px;
    margin-left: -3px;
    border-radius: 4px;

    &.payment-row {
      margin-top: 3px;
    }
  }
  .payment-row:nth-child(even) {
    background: var(--body);
  }

  hr {
    margin: 10px 0;
    border: 0;
    background: var(--border);
    width: 100%;
    height: 1px;
  }
}

.action-wrapper {
  display: flex;
  flex-wrap: nowrap;
  height: 100%;

  .action-button {
    background: transparent;
    color: var(--text);
    border: 1px solid var(--border);
    width: 100%;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }

  svg {
    display: block;
  }

  > * + * {
    margin-left: 10px;
  }
}
.card-sect {
  padding: 15px;

  &.dec-margin {
    padding: 8px 15px;
  }
}
.bold {
  font-weight: bold;
}
.thin {
  color: var(--text-secondary);
}
.card-core {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.tags {
  margin-top: 5px;
}
.spread {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

<script>
// Import components
import Card from '~/components/layout/Card'
import Subtitle from '~/components/title/Subtitle'
import Money from '~/components/title/Money'
import Tag from '~/components/base/Tag'

// Import icons
import TrashIcon from '~/assets/icons/trash.svg?inline'
import EditIcon from '~/assets/icons/edit.svg?inline'

// Functions
function toCents(euroVal) {
  return Number(euroVal.replace(/\.|€/g, ''))
}

export default {
  components: {
    Card,
    Subtitle,
    Money,
    Tag,
    TrashIcon,
    EditIcon,
  },
  props: {
    payment: {
      type: Object,
      required: true,
    },
  },
  data() {
    const description = this.payment.description
    const entries = []

    // See if description is grocery-like
    if (description.match(/.+ €\d/g)) {
      const descriptionArray = description.split(',').map((item) => item.trim())

      for (const [i, entry] of Object.entries(descriptionArray)) {
        // Find item count
        const countRegex = /(?:x ?(\d+))|(?:(\d+) ?x)/
        const countMatch = entry.match(countRegex) || []
        const itemCount = Number(countMatch[1] || countMatch[2] || 1)

        // Find money totals
        const moneyRegex = /€(\d+\.\d+)/
        const euroArray = entry.match(new RegExp(moneyRegex, 'g'))
        const centArray = euroArray.map(toCents)
        const totalCents = centArray.reduce((a, b) => a + b, 0)

        // Get item name without fields we already have
        const newDescription = entry
          .replace(new RegExp(countRegex, 'g'), '')
          .trim()
          .replace(/ +/g, ' ')

        // Add to entries
        entries.push({
          description:
            newDescription.slice(0, 1).toUpperCase() + newDescription.slice(1),
          cents: totalCents,
          centsPerEntry: totalCents / itemCount,
          original: entry,
          id: i,
          itemCount,
        })
      }
    }

    return {
      entries,
    }
  },
  computed: {
    entriesTotalCents() {
      return this.entries.reduce((a, b) => a + b.cents, 0)
    },
  },
  methods: {
    doDelete() {
      if (confirm(`Delete transaction '${this.payment.description}'?`)) {
        this.$axios
          .post('/transactions/delete', {
            id: this.payment.id,
          })
          .then(() => {
            this.$nuxt.$emit('refetch')
          })
          .catch((err) => {
            alert(err)
          })
      }
    },
    doEdit() {
      this.$nuxt.$emit('edit-transaction', this.payment.id)
    },
  },
}
</script>
