<template>
  <card
    ref="card"
    class="no-padding payment-card"
    :class="active && 'card-active'"
    :imported="payment.plaid_transaction_id || payment.plugin_transaction_id"
    :minimal="minimal"
    :data-id="payment.id"
  >
    <div
      class="card-core card-sect"
      :minimal="minimal"
      :class="
        (!payment.categories || payment.categories.length === 0) &&
        'no-categories'
      "
    >
      <!-- Active indicator -->
      <div v-if="active" class="active-indicator">
        <arrow-right-icon />
        Editing...
      </div>
      <!-- Actions -->
      <dropdown v-if="!disableActions || showReaddButton">
        <div
          v-if="modifiedBy.length > 0"
          class="modified-by fake-dropdown-item"
        >
          <p>Modified by:</p>
          <div
            v-for="plugin of modifiedBy"
            :key="`plugin-${plugin.id}`"
            class="plugin"
          >
            <component :is="plugin.icon" class="logo" />
            <span>{{ plugin.displayName }}</span>
          </div>
        </div>
        <dropdown-item
          v-if="!disableActions"
          :icon="TrashIcon"
          @click="doDelete"
        >
          Delete
        </dropdown-item>
        <dropdown-item v-if="!disableActions" :icon="EditIcon" @click="doEdit">
          Edit
        </dropdown-item>
        <dropdown-item
          v-if="showReaddButton"
          :icon="RefreshIcon"
          @click="reAdd"
        >
          Add transaction to date
        </dropdown-item>
      </dropdown>
      <!-- List / title -->
      <div class="transaction-content">
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
                  !entry.weight?.label &&
                  'just-one-badge',
              ]"
            >
              <div class="row-left-side">
                <div v-if="entry.cents !== 0 || i !== 0" class="badge-wrapper">
                  <span
                    v-if="
                      entry.weight?.label
                        ? entry.centsPerEntry !== entry.cents
                        : entry.cents !== 0
                    "
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
                  <span v-if="entry.weight?.label" class="badge">
                    {{ entry.weight.label }}
                  </span>
                </div>
                <span>
                  <div
                    v-if="
                      (payment.plaid_transaction_id ||
                        payment.plugin_transaction_id) &&
                      i === 0
                    "
                    class="imported-badge badge"
                  >
                    Imported
                  </div>
                  {{ entry.description }}
                  <in-x-days
                    v-if="isInXDays(payment) && i === 0"
                    :days="payment.inXDays"
                  />
                </span>
              </div>
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
        <span v-else class="bold usual-description">
          <div
            v-if="payment.plaid_transaction_id || payment.plugin_transaction_id"
            class="imported-badge badge"
          >
            Imported
          </div>
          {{ description }}
          <in-x-days v-if="isInXDays(payment)" :days="payment.inXDays" />
        </span>
      </div>
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
  scroll-snap-type: x mandatory;
  position: relative;

  .active-indicator {
    position: absolute;
    left: 15px;
    top: 0;
    padding: 5px;
    padding-right: 15px;
    border-radius: 6px;
    background: var(--content);
    border: 1px solid var(--border);
    animation: bob 3s infinite ease-in-out;
    box-shadow: 0 0 8px var(--border);
    display: flex;
    gap: 10px;
    align-items: center;

    transform: translateY(-150%);

    svg {
      display: block;
      transform: rotate(0.25turn);
    }
  }

  details {
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(30%, -30%);
    transition: opacity 100ms;

    &:focus {
      opacity: 1 !important;
    }

    &:not([open]) {
      opacity: 0;
    }
  }

  &:hover details {
    opacity: 1 !important;
  }

  > * {
    width: 100%;
    min-width: 100%;
    scroll-snap-align: start;
  }

  &[imported] {
    border-left-color: var(--theme);
    border-left-width: 3px;
  }
}

@media (prefers-color-scheme: dark) {
  .card[imported] {
    border-left-width: 1px;
    border-left-color: var(--anchor);
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
  grid-template-columns: 1fr auto;
  grid-gap: 10px;
  align-items: center;
  margin: 5px 0;
  font-weight: 500;

  .row-left-side {
    display: flex;
    align-items: center;
    gap: 0 10px;
  }

  .badge-wrapper {
    min-width: 100px;
  }

  &.is-store {
    margin-bottom: 15px;

    > * {
      @include cardTitle;
      grid-column: 1 / -1;
    }
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
  font-weight: normal;
}

.imported-badge {
  opacity: 0;
  min-width: 0;
  max-width: 0;
  max-height: 0;
  overflow: hidden;
  padding: 0;
  margin: 0;
  border: 0;
  display: block;
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
    width: 100%;
    margin-right: 10px;
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
    grid-template-columns: 1fr auto;

    .badge-wrapper {
      min-width: auto;
    }

    &.just-one-badge {
      .badge-wrapper {
        display: none;
      }

      grid-template-columns: 1fr auto;
    }
  }
  .payment-row .row-left-side {
    flex-wrap: wrap;
  }
}

[minimal] {
  @include minimal;
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

.fake-dropdown-item {
  padding: 10px 12px;
  border-bottom: 1px solid var(--border);

  p {
    margin-bottom: 0.5rem;
    color: var(--text-secondary);
  }
}

.plugin {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: 10px;
  align-items: center;

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }

  & + .plugin {
    margin-top: 10px;
  }
}

@media (max-width: 1350px) {
  .card {
    @include minimal;
  }
}

@media (max-width: 700px) {
  .card {
    overflow-x: auto;

    details {
      display: none;
    }
  }
}

@media (min-width: 701px) {
  .card > .card-sect:not(:first-child) {
    display: none;
  }
}
</style>

<style lang="scss">
@keyframes bob {
  0% {
    transform: translateY(-120%);
  }
  50% {
    transform: translateY(-160%);
  }
  100% {
    transform: translateY(-120%);
  }
}
</style>

<script>
import { mapMutations } from 'vuex'
import { plugins } from '~/krab-plugins'

// Import components
import Card from '~/components/layout/Card'
import Money from '~/components/title/Money'
import Tag from '~/components/base/Tag'
import Dropdown from '~/components/base/util/Dropdown'
import DropdownItem from '~/components/base/util/DropdownItem'
import InXDays from '~/components/base/util/InXDays'

// Import icons
import TrashIcon from '~/assets/icons/trash.svg?inline'
import EditIcon from '~/assets/icons/edit.svg?inline'
import RefreshIcon from '~/assets/icons/refresh.svg?inline'
import ArrowRightIcon from '~/assets/icons/arrow-right.svg?inline'

// Import Supabase
import SupabaseClient from '~/util/supabase'

// Import other
import getTransactionItemList from '~/util/getList'

export default {
  components: {
    Card,
    Money,
    Tag,
    Dropdown,
    DropdownItem,
    TrashIcon,
    InXDays,
    EditIcon,
    RefreshIcon,
    ArrowRightIcon,
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
  data() {
    return {
      TrashIcon,
      EditIcon,
      RefreshIcon,
    }
  },
  computed: {
    entriesTotalCents() {
      return this.entries.reduce((a, b) => a + b.cents, 0)
    },
    description() {
      return this.payment.description.replace(/\n\n/g, '\n').trim()
    },
    entries() {
      const entries = getTransactionItemList(this.description, {
        removeEuroString: true,
      })
      return entries
    },
    modifiedBy() {
      const modifiedBy = (this.payment.plugins_unleashed || '')
        .split(',')
        .filter(Boolean)

      if (this.payment.plaid_transaction_id && !modifiedBy.includes('plaid')) {
        modifiedBy.push('plaid')
      }

      const relevantPlugins = modifiedBy
        .map((id) => plugins.find((plugin) => plugin.id === id))
        .sort((a, b) => a.priority - b.priority)
      return relevantPlugins
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
