<template>
  <div>
    <page-title>Your recipes</page-title>
    <button @click="insertRecipe">Insert recipe</button>
    <banner v-if="error">⚠️ {{ error }}</banner>
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
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  grid-gap: 20px;
}
.banner {
  margin: 20px 0;
}
</style>

<script>
// Import components
import PageTitle from '~/components/title/PageTitle'
import RecipeCard from '~/components/recipes/RecipeCard'
import Banner from '~/components/base/Banner'

// Import Supabase
import SupabaseClient from '~/util/supabase'

export default {
  components: {
    PageTitle,
    RecipeCard,
    Banner,
  },
  data() {
    return {
      error: null,
    }
  },
  computed: {
    recipes() {
      return this.$store.state.user.data.recipes
    },
  },
  methods: {
    async insertRecipe() {
      const submitObj = {
        user_id: SupabaseClient.auth.user().id,
        title: 'Mac & cheese',
        ingredients: `
          250gr macaroni
          80gr hamblokjes
          100gr geraspte kaas
          50ml ketchup
          `,
        steps: 'Mac & cheese',
        durationInMinutes: 10,
      }

      // Insert transaction
      const data = await SupabaseClient.from('recipes').insert([submitObj])

      if (data?.error?.message) {
        this.error = data.error.message
      }

      this.$nuxt.$emit('refetch-recipes')
    },
  },
  head: {
    bodyAttrs: {
      'no-right': true,
    },
  },
}
</script>
