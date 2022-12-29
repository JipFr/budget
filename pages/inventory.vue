<template>
  <div>
    <p>Hi</p>
    <button @click="insertInventory">Insert inventory</button>
    <p>
      {{ JSON.stringify(productsWithQuantities, null, '\t') }}
    </p>
  </div>
</template>

<style lang="scss" scoped>
p {
  margin: 30px 0;
  white-space: pre;
}
</style>

<script>
// Import Supabase
import SupabaseClient from '~/util/supabase'

// Import other
import getTransactionItemList from '~/util/getList'
import { clean } from '~/util/getDifferences'

export default {
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
      for (const list of Object.values(this.lists)) {
        for (const product of list) {
          if (product.cents <= 0) continue

          const productName = clean(product.description)
          if (!products[productName])
            products[productName] = {
              name: product.description,
            }

          const measuringUnit = product.weight?.measurement || 'unmeasured'
          if (!products[productName][measuringUnit])
            products[productName][measuringUnit] = {
              count: 0,
            }

          products[productName][measuringUnit].count +=
            product?.weight?.value ?? product.itemCount
        }
      }

      // Remove all counted thingies from the database
      for (const remover of this.inventory) {
        const productName = clean(remover.name)
        if (products[productName]?.[remover.measuringUnit]) {
          products[productName][remover.measuringUnit].count -= remover.count
        }
      }

      return products
    },
  },
  methods: {
    async insertInventory() {
      const submitObj = {
        user_id: SupabaseClient.auth.user().id,
        count: 20,
        name: 'Cola',
        measuringUnit: 'cl',
      }

      // Insert transaction
      const data = await SupabaseClient.from('inventory').insert([submitObj])
      console.info(data)

      this.$nuxt.$emit('refetch-inventory')
    },
  },
}
</script>
