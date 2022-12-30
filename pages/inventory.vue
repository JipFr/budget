<template>
  <div>
    <div class="section">
      <app-input
        v-model="filter"
        type="text"
        label="Filter"
        placeholder="Macaroni"
      />
    </div>
    <div v-if="cards.withContent.length > 0" class="section">
      <h3>Inventory</h3>
      <div class="cards">
        <inventory-card
          v-for="card of cards.withContent"
          :key="card.key"
          :card="card"
        />
      </div>
    </div>
    <hr v-if="cards.withContent.length > 0 && cards.usedUp.length > 0" />
    <div v-if="cards.usedUp.length > 0" class="section">
      <h3>Used up</h3>
      <div class="cards">
        <inventory-card
          v-for="card of cards.usedUp"
          :key="card.key"
          :card="card"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
h3 {
  font-size: 1rem;
  font-weight: 500;
  color: var(--text);
  margin-bottom: 10px;
}
.cards {
  display: grid;
  grid-gap: 12px;
}
hr {
  width: 100%;
  height: 1px;
  border: 0;
  background: var(--border);
  margin-top: 30px;
  margin-bottom: 70px;
}
.section + .section {
  margin-top: 40px;
}
</style>

<script>
// Import components
import InventoryCard from '~/components/base/InventoryCard'
import AppInput from '~/components/base/inputs/Input'

// Import Supabase
import SupabaseClient from '~/util/supabase'

// Import other
import getTransactionItemList, { getWeightLabel } from '~/util/getList'
import { clean } from '~/util/getDifferences'

const unmeasured = 'unmeasured'

export default {
  components: {
    InventoryCard,
    AppInput,
  },
  data() {
    return {
      filter: '',
    }
  },
  computed: {
    lists() {
      const lists = {}

      for (const payment of this.inventoryPayments) {
        lists[payment.id] = getTransactionItemList(
          payment.description,
          true,
          true,
          true
        )
      }

      return lists
    },
    inventoryPayments() {
      const user = this.$store.state.user.data
      const transactions = user.transactions || []

      const filtered = transactions.filter(
        (t) =>
          t.categories.includes('stock') || t.categories.includes('inventory')
      )

      return filtered
    },
    inventory() {
      const user = this.$store.state.user.data
      return user.inventory
    },
    productsWithQuantities() {
      const products = {}

      // Add up every single inventory transaction ever
      for (const payment of this.inventoryPayments) {
        const list = this.lists[payment.id]
        for (const product of list) {
          if (product.cents <= 0) continue

          const productName = clean(product.description)
          if (!products[productName])
            products[productName] = {
              name: product.description,
              weights: {},
            }

          const measuringUnit = product.weight?.measurement || unmeasured
          if (!products[productName].weights[measuringUnit])
            products[productName].weights[measuringUnit] = {
              count: 0,
            }

          products[productName].weights[measuringUnit].count +=
            product?.weight?.value ?? product.itemCount
        }
      }

      // Remove all counted thingies from the database
      for (const remover of this.inventory) {
        const productName = clean(remover.name)
        if (
          products[productName]?.weights[remover.measuringUnit || unmeasured]
        ) {
          products[productName].weights[
            remover.measuringUnit || unmeasured
          ].count -= remover.count
        }
      }

      return products
    },
    cards() {
      const products = this.productsWithQuantities
      let cards = []

      for (const value of Object.values(products)) {
        if (!clean(value.name).includes(clean(this.filter))) continue

        for (const [measurementUnit, v] of Object.entries(value.weights)) {
          const actions = []

          // Various size actions
          const generateAction = (count) => {
            return {
              label: `-${
                measurementUnit === unmeasured
                  ? count
                  : getWeightLabel(measurementUnit, count)
              }`,
              onClick: () => {
                this.reduceProductCount(measurementUnit, value.name, count)
              },
            }
          }

          if (v.count > 0 && v.count <= 5)
            actions.push(generateAction(0.1), generateAction(0.5))
          if (v.count > 1 && v.count < 10) actions.push(generateAction(1))
          if (v.count >= 10 && v.count < 100) actions.push(generateAction(5))
          if (v.count >= 10 && v.count < 300) actions.push(generateAction(10))
          if (v.count >= 50 && v.count < 800) actions.push(generateAction(50))
          if (v.count >= 300 && v.count < 800) actions.push(generateAction(100))
          if (v.count >= 800) actions.push(generateAction(500))
          if (v.count >= 1e3) actions.push(generateAction(1e3))

          // Halve action
          if (v.count > 0.1) {
            actions.push(
              {
                label: '-1/2',
                onClick: () => {
                  this.reduceProductCount(
                    measurementUnit,
                    value.name,
                    Math.floor((v.count / 2) * 100) / 100
                  )
                },
              },
              {
                label: '-1/3',
                onClick: () => {
                  this.reduceProductCount(
                    measurementUnit,
                    value.name,
                    Math.floor((v.count / 3) * 100) / 100
                  )
                },
              }
            )
          }

          // Set to zero action
          if (v.count > 0) {
            actions.push({
              label: 'Set to zero',
              onClick: () => {
                this.reduceProductCount(measurementUnit, value.name, v.count)
              },
            })
          }

          cards.push({
            key: `${measurementUnit}-${value.name}`,
            productName: value.name,
            weightLabel: getWeightLabel(measurementUnit, v.count),
            count: v.count,
            actions,
          })
        }
      }

      cards = cards.sort((a, b) => a.productName.localeCompare(b.productName))

      return {
        withContent: cards.filter((t) => t.count > 0),
        usedUp: cards.filter((t) => t.count <= 0),
      }
    },
  },
  methods: {
    async reduceProductCount(measurementUnit, productName, quantity) {
      const submitObj = {
        user_id: SupabaseClient.auth.user().id,
        count: quantity,
        name: productName,
        measuringUnit: measurementUnit,
      }

      // Insert transaction
      await SupabaseClient.from('inventory').insert([submitObj])

      this.$nuxt.$emit('refetch-inventory')
    },
  },
}
</script>
