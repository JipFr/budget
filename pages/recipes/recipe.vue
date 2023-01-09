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
// import getTransactionItemList from '~/util/getList'

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
    // requirementsAsList() {
    //   return getTransactionItemList(requirements, {
    //     removeCount: true,
    //     removeEuroString: true,
    //     removeMeasurements: true,
    //     forceList: true,
    //   })
    // },
    // needToPurchase() {},
  },
  data() {
    return { requirements }
  },
}
</script>
