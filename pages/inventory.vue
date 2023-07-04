<template>
  <div>
    <page-title>Inventory</page-title>
    <inventory-manager />
  </div>
</template>

<script>
// Import components
import InventoryManager from '~/components/base/InventoryManager'
import PageTitle from '~/components/title/PageTitle'

export default {
  components: {
    InventoryManager,
    PageTitle,
  },
}
</script>
