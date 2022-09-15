<template>
  <div>
    <chart v-if="storesLoaded" :chartdata="chartData" />
    <div class="legend">
      <portal to="right-side">
        <card>
          <select @change="setSelectedStore">
            <option
              v-for="[storeKey, storeValue] in Object.entries(stores).sort(
                (a, b) => b[1].total - a[1].total
              )"
              :key="storeKey"
              :value="storeKey"
              :selected="selectedStore === storeKey"
            >
              {{ storeValue.name }}
              <money :raw-string="true" :cents="storeValue.total" />
            </option>
          </select>

          <subtitle>Items you've purchased...</subtitle>

          <div
            v-if="
              stores[selectedStore] &&
              Object.keys(stores[selectedStore].items).length > 0
            "
            class="tag-list"
          >
            <div
              v-for="[key, item] of Object.entries(
                stores[selectedStore].items
              ).sort((a, b) => b[1].totalSpent - a[1].totalSpent)"
              :key="`${key}-${item.totalSpent}-${item.display}`"
              class="can-click"
              @click="toggleItem(key)"
            >
              <tag
                :tag="`${item.count} x ${item.display}`"
                :color-override="item.color"
                :cents="item.totalSpent"
                :disabled="!enabledItems.includes(key)"
              />
            </div>
          </div>
        </card>
      </portal>
    </div>
  </div>
</template>

<style lang="scss" scoped>
select {
  border: 0;
  padding: 8px;
  border-radius: 6px;
  background: var(--body);
  color: var(--text);
  display: block;
  width: 100%;
  font-size: 1rem;
  appearance: none;
  font-family: inherit;
  margin-bottom: 10px;
}
.legend {
  margin-top: 40px;
}
.tag-list {
  margin-top: 10px;
  display: grid;
  grid-template-columns: 100%;
  grid-gap: 10px;

  &::v-deep .tag {
    display: flex;
    padding: 5px 10px;
    border-radius: 4px;
    background: var(--alt-content);
    margin-top: 0;
    margin-right: 0;
    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }
  }
}
.tag-list + .tag-list {
  margin-top: 30px;
}

@media (min-width: 1350px) {
  .tag-list {
    max-height: 600px;
    overflow-y: auto;
  }
}
</style>

<script>
// Import components
import { Portal } from 'portal-vue'
import Chart from '~/components/base/util/ScatterChart'
import Tag from '~/components/base/Tag'
import Card from '~/components/layout/Card'
import Subtitle from '~/components/title/Subtitle'
import Money from '~/components/title/Money'

// Import other
import getTransactionItemList from '~/util/getList'
import { colors } from '~/store/user'

export default {
  components: {
    Chart,
    Card,
    Tag,
    Subtitle,
    Money,
    Portal,
  },
  props: {
    payments: {
      type: Array,
      required: true,
    },
  },
  fetch() {
    const stores = {}

    // For all non-excluded transactions, filter into ones that have lists and add the store
    const transactions = this.payments
      .filter(
        (transaction) => !transaction.categories.includes('exclude pricing')
      )
      .map((transaction) => {
        return {
          ...transaction,
          entries: getTransactionItemList(transaction.description, true),
        }
      })
      .filter((v) => v.entries.filter((item) => item.cents > 0).length > 0)
      .map((transaction) => {
        return {
          ...transaction,
          store:
            transaction.entries.find((item) => item.cents === 0)?.description ||
            null,
        }
      })

    // Map each item onto a store
    for (const transaction of transactions) {
      const store = transaction.store || 'Other'
      const storeKey = store.trim().toLowerCase()
      const allFoodStore = 'all food'
      const allStores = 'all stores'
      const storeKeys = [storeKey, allStores]

      if (
        transaction.categories.includes('eten') ||
        transaction.categories.includes('food')
      ) {
        storeKeys.push(allFoodStore)
      }

      for (const item of transaction.entries) {
        if (item.cents > 0) {
          const desc = item.description.trim().toLowerCase()
          for (const storeKey of storeKeys) {
            const storeNameOverrides = {
              [storeKey]: store,
              [allFoodStore]: 'All Food',
              [allStores]: 'All Stores',
            }

            // Make store if store doesn't exist yet
            if (!stores[storeKey]) {
              stores[storeKey] = {
                name: storeNameOverrides[storeKey],
                items: {},
              }
            }

            // Make item if item doesn't exist yet
            if (!stores[storeKey].items[desc]) {
              stores[storeKey].items[desc] = {
                display: item.description,
                timesBought: 0,
                count: 0,
                totalSpent: 0,
                occurances: [],
              }
            }

            // Add to item
            stores[storeKey].items[desc].timesBought++
            stores[storeKey].items[desc].count += item.itemCount
            stores[storeKey].items[desc].totalSpent += item.cents

            stores[storeKey].items[desc].count = Math.round(
              stores[storeKey].items[desc].count
            )

            stores[storeKey].items[desc].occurances.push({
              ...item,
              on: transaction.date,
              store,
            })
          }
        }
      }
    }

    // Add "total spent" to each store
    for (const storeKey of Object.keys(stores)) {
      stores[storeKey].total = this.getStoreTotal(stores, storeKey)
    }

    const sortedStores = Object.entries(stores).sort(
      (a, b) => b[1].total - a[1].total
    )

    if (this.selectedStore === null) this.selectedStore = sortedStores?.[0]?.[0]

    this.stores = stores
    this.storesLoaded = true

    this.setChartData()
  },
  data() {
    return {
      selectedStore: null,
      stores: {},
      storesLoaded: false,
      enabledItems: [],
      chartData: {
        datasets: [],
      },
    }
  },
  fetchOnServer: false,
  methods: {
    setSelectedStore(v) {
      this.selectedStore = v.currentTarget.value
      this.enabledItems = []
      this.setChartData()
    },
    toggleItem(key) {
      if (this.enabledItems.includes(key)) {
        this.enabledItems.splice(this.enabledItems.indexOf(key), 1)
      } else {
        this.enabledItems.push(key)
      }
      this.setChartData()
    },
    getStoreTotal(stores, storeKey) {
      if (!stores[storeKey]) return null

      let total = 0
      for (const item of Object.values(stores[storeKey].items)) {
        total += item.totalSpent
      }

      return total
    },
    mounted() {
      this.setChartData()
    },
    setChartData() {
      const storeKey = this.selectedStore
      const store = this.stores[storeKey]

      const datasets = Object.keys(store.items)
        .filter((key) => this.enabledItems.includes(key))
        .flatMap((key, i) => {
          const item = store.items[key]

          // Map all occurances into its own store
          const itemsPerStore = item.occurances.reduce((acc, t) => {
            if (!acc[t.store]) acc[t.store] = []
            acc[t.store].push({
              ...t,
              ...item,
            })
            return acc
          }, {})

          return Object.entries(itemsPerStore).map(([store, items]) => {
            return {
              key,
              label: `${
                storeKey === 'all stores' || storeKey === 'all food'
                  ? `${store}: `
                  : ''
              }${items[0].display}`,
              backgroundColor: items[0].color,
              borderColor: 'transparent',
              borderWidth: 0,
              pointHitRadius: 25,
              data: items.map((v) => {
                return {
                  x: new Date(v.on).getTime(),
                  y: Math.round(v.centsPerEntry) / 100,
                }
              }),
            }
          })
        })

      // Assign colors to products
      const sortedEntries = Object.entries(store.items).sort(
        (a, b) => b[1].totalSpent - a[1].totalSpent
      )

      for (let i = 0; i < sortedEntries.length; i++) {
        const item = sortedEntries[i][1]
        item.color = colors[i % colors.length]
      }

      this.chartData = {
        datasets,
      }
    },
  },
}
</script>
