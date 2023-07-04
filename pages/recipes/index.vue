<template>
  <div>
    <page-title>
      <div class="spread">
        Your recipes
        <nuxt-link to="/recipes/create">
          <app-button class="secondary">Create new</app-button>
        </nuxt-link>
      </div>
    </page-title>

    <banner v-if="error">⚠️ {{ error }}</banner>

    <div class="cards">
      <recipe-card
        v-for="recipe in recipes"
        :key="recipe.title"
        :recipe="recipe"
        :available-money-in-cents="foodBudgetInfo.availableMoneyToday"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  grid-gap: 20px;
}
.banner {
  margin: 20px 0;
}
.spread {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

<script>
// Import components
import PageTitle from '~/components/title/PageTitle'
import RecipeCard from '~/components/recipes/RecipeCard'
import AppButton from '~/components/util/Button'
import Banner from '~/components/base/Banner'

// Import util functions
import { getRecipeInfo } from '~/util/recipeInfo'
import { getFoodInfo } from '~/util/food'

export default {
  components: {
    PageTitle,
    RecipeCard,
    AppButton,
    Banner,
  },
  data() {
    return {
      error: null,
    }
  },
  computed: {
    recipes() {
      const recipes = this.$store.state.user.data.recipes
      const recipeInfo = recipes
        .map((r) => ({
          ...getRecipeInfo(r, this.$store),
          ...r,
        }))
        .sort(
          (a, b) =>
            b.requirementsPossesedPercentage - a.requirementsPossesedPercentage
        )
      return recipeInfo
    },
    foodBudgetInfo() {
      const transactions = this.$store.state.user.data.transactions
      const foodInfo = getFoodInfo(transactions || [])
      return foodInfo
    },
  },
  head: {
    bodyAttrs: {
      'no-right': true,
    },
  },
}
</script>
