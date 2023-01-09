<!-- eslint-disable prettier/prettier -->
<template>
  <div>
    <page-title>Recipes</page-title>
    <div style="display: grid; grid-template-columns: 1fr 1fr; grid-gap: 20px">
      <div>
        Requirements:
        <p v-html="requirements.replace(/\n/g, '<br />')"></p>
      </div>
      <p style="white-space: pre">
        {{ needToPurchase }}
      </p>
    </div>
  </div>
</template>

<script>
//
import PageTitle from '~/components/title/PageTitle'
import getTransactionItemList from '~/util/getList'
import { getInventory, unmeasured } from '~/util/getInventory'
import { clean } from '~/util/getDifferences'

const requirements = `
      300gr geraspte kaas
      200gr macaroni
      60gr hamblokjes
      ketchup
      2 x ui
      2 x 300gr ui
`.trim()

export default {
  components: {
    PageTitle,
  },
  computed: {
    requirementsAsList() {
      return getTransactionItemList(requirements, {
        removeCount: true,
        removeEuroString: true,
        removeMeasurements: true,
        forceList: true,
      })
    },
    needToPurchase() {
      // Find the products the user is lacking after `requirementsAsList`
      const inventory = getInventory(this.$store)

      //
      const requirements = []
      for (const product of this.requirementsAsList) {
        const name = clean(product.description)
        const measurementUnit = product?.weight?.measurement ?? unmeasured
        const productInInventory = inventory[name]?.weights[measurementUnit]

        const inStockCount = productInInventory?.count ?? 0
        const requiredCount = product?.weight?.totalValue ?? product.itemCount

        const missing = Math.max(requiredCount - inStockCount, 0)

        console.log(name, missing)

        requirements.push({
          measurementUnit,
          description: product.description,
          requiredTotal: requiredCount,
          inStock: inStockCount,
          missing,
        })
      }

      console.log(inventory)
      return requirements
    },
  },
  data() {
    return { requirements }
  },
}
</script>
