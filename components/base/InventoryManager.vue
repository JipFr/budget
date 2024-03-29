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
      <subtitle>Inventory</subtitle>
      <div class="cards">
        <inventory-card
          v-for="card of cards.withContent"
          :key="card.key"
          :card="card"
          @adjust="(count) => adjustCount(count, card)"
        />
      </div>
    </div>
    <hr v-if="cards.withContent.length > 0 && cards.usedUp.length > 0" />
    <div v-if="cards.usedUp.length > 0" class="section">
      <subtitle>Used up</subtitle>
      <div class="cards">
        <inventory-card
          v-for="card of cards.usedUp"
          :key="card.key"
          :card="card"
          @adjust="(count) => adjustCount(count, card)"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
::v-deep .subtitle {
  margin-bottom: 5px;
}
.cards {
  display: grid;

  .card {
    border-radius: 0;
  }

  .card + .card {
    border-top: 0;
  }

  .card:first-child {
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
  }

  .card:last-child {
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
  }
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
import Subtitle from '~/components/title/Subtitle'

// Import Supabase
import SupabaseClient from '~/util/supabase'

// Import other
import { getWeightLabel } from '~/util/getList'
import { clean } from '~/util/getDifferences'
import { getInventory } from '~/util/getInventory'

export default {
  components: {
    InventoryCard,
    AppInput,
    Subtitle,
  },
  data() {
    return {
      filter: '',
    }
  },
  computed: {
    productsWithQuantities() {
      return getInventory(this.$store)
    },
    cards() {
      const products = this.productsWithQuantities
      let cards = []

      for (const value of Object.values(products)) {
        if (!clean(value.name).includes(clean(this.filter))) continue

        for (const [measurementUnit, v] of Object.entries(value.weights)) {
          cards.push({
            key: `${measurementUnit}-${value.name}`,
            productName: value.name,
            weightLabel: getWeightLabel(measurementUnit, v.count),
            measurementUnit,
            count: v.count,
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
    async adjustProductCount(measurementUnit, productName, quantity) {
      const submitObj = {
        user_id: SupabaseClient.auth.user().id,
        count: -quantity,
        name: productName,
        measuringUnit: measurementUnit,
      }

      // Insert transaction
      await SupabaseClient.from('inventory').insert([submitObj])

      this.$nuxt.$emit('refetch-inventory')
    },
    async adjustCount(count, card) {
      await this.adjustProductCount(
        card.measurementUnit,
        card.productName,
        count
      )
    },
  },
}
</script>
