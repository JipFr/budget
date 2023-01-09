<template>
  <div>
    <page-title>Your recipes</page-title>
    <div class="cards">
      <recipe-card
        v-for="recipe in recipes"
        :key="recipe.title"
        :recipe="recipe"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
}
</style>

<script>
import PageTitle from '~/components/title/PageTitle'
import RecipeCard from '~/components/recipes/RecipeCard'

export default {
  components: {
    PageTitle,
    RecipeCard,
  },
  data() {
    return {
      recipes: [
        {
          title: 'Pita vegan shoarma met srirachamayo',
          ingredients: `
          Grote pitabroodjes
          Rode ui
          Limoen
          300gr rode kool
          Olie
          350gr shoarma
          100ml chilisaus
          100ml mayo
          `,
          durationInMinutes: 30,
          steps: `
          Snijd de rode ui in flinterdunne halve ringen. Snijd de komkommer in blokjes. Boen de limoen schoon, rasp de groene schil en pers de vrucht uit. Meng de rodekool met de rode ui, 1 tl (voor 4 personen) limoenrasp en het -sap. Breng op smaak met peper en eventueel zout. Voeg de komkommer toe en schep om.

          Verhit de olie in een hapjespan en bak de shoarma 5 min. al omscheppend op middelhoog vuur. Rooster ondertussen de pitabroodjes volgens de aanwijzingen op de verpakking. Meng ⅔ van de sriracha met de mayonaise. Snijd de broodjes open en besmeer met de srirachamayonaise.

          Vul het broodje vervolgens met een deel van de salade en de shoarma en besprenkel met de rest van de sriracha. Serveer met de rest van de salade.`,
        },
      ],
    }
  },
}
</script>
