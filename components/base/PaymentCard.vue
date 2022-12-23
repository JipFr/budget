<template>
  <card
    ref="card"
    class="no-padding payment-card"
    :class="active && 'card-active'"
    :minimal="minimal"
  >
    <div
      class="card-core card-sect"
      :minimal="minimal"
      :class="
        (!payment.categories || payment.categories.length === 0) &&
        'no-categories'
      "
    >
      <subtitle class="is-subtitle transaction-content">
        <div v-if="entries.length > 0" class="sum-calculated">
          <div>
            <div
              v-for="(entry, i) in entries"
              :key="entry.id"
              class="payment-row"
              :class="[
                i === 0 && entry.cents === 0 && 'is-store',
                entry.itemCount === 1 &&
                  entry.centsPerEntry === entry.cents &&
                  'just-one-badge',
              ]"
            >
              <div v-if="entry.cents !== 0 || i !== 0" class="badge-wrapper">
                <span
                  v-if="entry.cents !== 0"
                  class="badge"
                  :class="
                    entry.itemCount === 1 &&
                    entry.centsPerEntry === entry.cents &&
                    'just-one'
                  "
                >
                  {{ entry.itemCount }}
                  <span v-if="entry.centsPerEntry !== entry.cents">
                    &nbsp;x
                    <money :cents="entry.centsPerEntry" />
                  </span>
                </span>
              </div>
              <span>{{ entry.description }}</span>
              <money v-if="entry.cents !== 0" :cents="entry.cents" />
            </div>
          </div>
          <div>
            <hr />
            <div class="spread">
              <span></span>
              <money :cents="entriesTotalCents" />
            </div>
          </div>
        </div>
        <span v-else class="bold usual-description">{{ description }} </span>
        <span v-if="isInXDays(payment)" class="in-x-days">
          <span v-if="payment.inXDays === 0"> Today </span>
          <span v-else-if="payment.inXDays === 1"> Tomorrow </span>
          <span v-else>
            in {{ payment.inXDays }} {{ payment.inXDays == 1 ? 'day' : 'days' }}
          </span>
        </span>
      </subtitle>
      <div
        v-if="payment.categories && payment.categories.length > 0"
        class="categories"
      >
        <span class="card-title">Categories</span>
        <div class="tags">
          <tag
            v-for="tag in Object.assign([], payment.categories || []).sort(
              (a, b) => a.localeCompare(b)
            )"
            :key="tag"
            :tag="tag"
          />
        </div>
      </div>
      <div class="total-price">
        <span class="card-title">Price</span>
        <money :cents="payment.cents" />
      </div>
    </div>
    <div v-if="showReaddButton" class="card-actions card-sect dec-margin">
      <div class="action-wrapper">
        <button class="action-button" @click="reAdd">
          <refresh-icon />
          <span>Add transaction to date</span>
        </button>
      </div>
    </div>
    <!--
      Only show this section if it's a past transaction.
      Otherwise it's an "in X days" card, without actions
     -->
    <div v-if="!disableActions" class="card-actions card-sect dec-margin">
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
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  transition: box-shadow 1s;

  &.card-active {
    box-shadow: 0 0 8px var(--theme);
  }

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

@mixin cardTitle {
  font-weight: 500;
  color: var(--text-secondary);
}

.card-title {
  @include cardTitle;
}

.payment-row {
  display: grid;
  grid-template-columns: 100px 1fr auto;
  grid-gap: 10px;
  align-items: center;
  margin: 5px 0;
  font-weight: 500;

  &.is-store {
    margin-bottom: 15px;

    > * {
      @include cardTitle;
      grid-column: 1 / -1;
    }
  }

  .badge {
    min-width: 28px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    padding: 4px;
    border: 1px solid var(--content-lighter);
    border-radius: 10px;
  }
}

.in-x-days {
  white-space: nowrap;
}

.sum-calculated {
  display: grid;
  height: 100%;
  grid-template-rows: 1fr auto;

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

    svg + * {
      margin-left: 1rem;
    }
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
.spread {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.card-core {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.tags {
  margin-top: 5px;
}

.card-core {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-areas: 'content price' 'categories price';
  grid-gap: 0 10px;

  &:not(.no-categories) {
    grid-template-rows: 1fr auto;
  }

  .transaction-content {
    grid-area: content;
  }

  .categories {
    grid-area: categories;
    height: 100%;

    .card-title {
      display: none;
    }
  }

  .total-price {
    grid-area: price;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .card-title {
      display: none;
    }
  }
}

@mixin minimal {
  .payment-row .just-one {
    display: none;
  }
  .payment-row {
    grid-template-columns: auto 1fr auto;

    &.just-one-badge {
      .badge-wrapper {
        display: none;
      }

      grid-template-columns: 1fr auto;
    }
  }
}

[minimal] {
  @include minimal;
}

@media (min-width: 950px) {
  .card .card-sect:not(:first-child) {
    display: none;
  }
}

@media (min-width: 1200px) {
  .card-core:not([minimal]) {
    grid-gap: 10px 50px;
    grid-template-columns: 1fr 200px;
    grid-template-areas: 'content categories' 'content price';

    &.no-categories {
      grid-template-areas: 'content price';
    }

    .transaction-content {
      height: 100%;
    }

    &:not(.no-categories) .total-price {
      padding-top: 10px;
      border-top: 1px solid var(--border);
    }

    .tags {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .total-price,
    .categories {
      .card-title {
        display: initial;
      }
    }
  }
}

@media (max-width: 1350px) {
  .card {
    @include minimal;
  }
}
</style>

<script>
import { mapMutations } from 'vuex'

// Import components
import Card from '~/components/layout/Card'
import Subtitle from '~/components/title/Subtitle'
import Money from '~/components/title/Money'
import Tag from '~/components/base/Tag'

// Import icons
import TrashIcon from '~/assets/icons/trash.svg?inline'
import EditIcon from '~/assets/icons/edit.svg?inline'
import RefreshIcon from '~/assets/icons/refresh.svg?inline'

// Import Supabase
import SupabaseClient from '~/util/supabase'

// Import other
import getTransactionItemList from '~/util/getList'

export default {
  components: {
    Card,
    Subtitle,
    Money,
    Tag,
    TrashIcon,
    EditIcon,
    RefreshIcon,
  },
  props: {
    payment: {
      type: Object,
      required: true,
    },
    disableActions: {
      type: Boolean,
      default: false,
    },
    showReaddButton: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: false,
    },
    minimal: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    entriesTotalCents() {
      return this.entries.reduce((a, b) => a + b.cents, 0)
    },
    description() {
      return this.payment.description.replace(/\n\n/g, '\n').trim()
    },
    entries() {
      const entries = getTransactionItemList(this.description, true, true)
      return entries
    },
  },
  watch: {
    active() {
      const el = this.$refs.card.$el
      const isDesktop = window.innerWidth >= 1350
      let delay = 300
      if (isDesktop) {
        delay = 0
      }
      setTimeout(() => {
        if (this.active) {
          el.scrollTo({
            left: 0,
          })

          setTimeout(() => {
            // Do it again, just in case; Chrome sometimes doesn't do it
            el.scrollTo({
              left: 0,
            })
          }, 300)

          if (isDesktop) {
            // Only scroll the card to the top on desktop, not mobile
            el.scrollIntoView()
            window.scrollTo({
              top: window.pageYOffset - 100,
            })
          }
        }
      }, delay)
    },
  },
  methods: {
    async doDelete() {
      if (confirm(`Delete transaction '${this.payment.description}'?`)) {
        const { error } = await SupabaseClient.from('transactions')
          .delete()
          .match({
            id: this.payment.id,
          })

        if (error) {
          alert(error.message)
        } else {
          this.$nuxt.$emit('refetch')
        }
      }
    },
    doEdit() {
      this.$nuxt.$emit('edit-transaction', this.payment.id)
    },
    async reAdd() {
      const submitObj = {
        user_id: SupabaseClient.auth.user().id,
        description: this.payment.description,
        cents: this.payment.cents,
        categories: this.payment.categories,
        date: this.payment.date,
      }

      // Insert transaction
      const { error } = await SupabaseClient.from('transactions').insert([
        submitObj,
      ])

      if (error) {
        alert(error.message)
      } else {
        this.setUntil(submitObj.date.toISOString().split('T')[0])
        window.scrollTo(0, 0)
        this.$nuxt.$emit('refetch')
        this.$router.push({ path: '/' })
      }
    },
    isInXDays(payment) {
      return typeof payment.inXDays !== 'undefined'
    },
    ...mapMutations({
      setUntil: 'user/setUntil',
    }),
  },
}
</script>
