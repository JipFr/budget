<template>
  <div>
    <page-title>{{ recipe?.title ?? 'Unknown recipe' }}</page-title>
    <portal to="right-side">
      <div v-if="recipeInfo" class="ingredients">
        <card
          v-for="(ingredient, i) of ingredients"
          :key="`${ingredient.description}-${i}`"
        >
          <div class="ingredient-name">
            <div class="dot" />
            <span>{{ ingredient.description }}</span>
          </div>
          <progress-bar
            :percentage="(ingredient.inStock / ingredient.requiredTotal) * 100"
            :label="`${getWeightLabel(
              ingredient.measurementUnit,
              ingredient.inStock,
              false
            )} / ${getWeightLabel(
              ingredient.measurementUnit,
              ingredient.requiredTotal,
              false
            )}`"
          />
        </card>
      </div>
    </portal>

    <card v-if="recipe && steps">
      <div v-for="(step, i) of steps" :key="`${step}-${i}`" class="step">
        <div class="index">{{ i + 1 }}</div>
        <p>{{ step }}</p>
      </div>
    </card>
  </div>
</template>

<style lang="scss" scoped>
.ingredients {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  grid-gap: 10px;
  margin: 20px 0;

  .progress-bar {
    margin-top: 5px;
  }
}

.step {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: 10px;

  .index {
    width: 2rem;
    height: 2rem;
    border: 1px solid var(--border);
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
  }

  & + .step {
    margin-top: 20px;
  }
}
</style>

<script>
// Import components
import { Portal } from 'portal-vue'
import PageTitle from '~/components/title/PageTitle'
import Card from '~/components/layout/Card'
import ProgressBar from '~/components/util/ProgressBar'

// Import utility functions
import { getRecipeInfo } from '~/util/recipeInfo'
import { getWeightLabel } from '~/util/getList'

export default {
  components: {
    PageTitle,
    Card,
    ProgressBar,
    Portal,
  },
  computed: {
    recipes() {
      return this.$store.state.user.data.recipes
    },
    recipe() {
      const recipeId = this.$route.params.id
      const recipe = this.recipes.find((r) => Number(r.id) === Number(recipeId))
      return recipe
    },
    steps() {
      const steps = (this.recipe?.steps || '')
        .split('\n')
        .map((t) => t.trim())
        .filter(Boolean)
      return steps
    },
    recipeInfo() {
      return this.recipe ? getRecipeInfo(this.recipe, this.$store) : null
    },
    ingredients() {
      const requirements = this.recipeInfo.requirements
      return requirements.sort(
        (a, b) => b.inStock / b.requiredTotal - a.inStock / a.requiredTotal
      )
    },
  },
  methods: {
    getWeightLabel,
  },
}
</script>
