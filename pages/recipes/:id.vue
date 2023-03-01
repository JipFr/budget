<template>
  <div>
    <page-title>
      <div class="spread">
        {{
          recipe?.title
            ? 'Your recipe'
            : editing
            ? 'New recipe'
            : 'Unknown recipe'
        }}
        <app-button v-if="recipe && !editing" class="secondary" @click="edit">
          Edit
        </app-button>
        <app-button v-if="recipe?.id && editing" class="primary" @click="save">
          Save
        </app-button>
        <app-button v-else-if="editing" class="primary" @click="save">
          Create
        </app-button>
      </div>
    </page-title>

    <banner v-if="error">{{ error }}</banner>

    <card v-if="(recipe && steps) || editing" class="mb">
      {{/*  Title  */}}
      <div v-if="!editing" class="spread title-wrapper">
        <h3>{{ recipe.title }}</h3>
        <div class="icon-with-text">
          <watch-icon />
          <span class="no-wrap">
            {{
              recipe.durationInMinutes
                ? `${recipe.durationInMinutes} min`
                : '???'
            }}
          </span>
        </div>
      </div>
      <div v-if="editing" class="title-wrapper">
        <app-input v-model="editingData.title" label="Title" />
        <app-input v-model="editingData.durationInMinutes" label="Minutes" />
      </div>

      {{/*  Steps  */}}
      <div v-if="!editing">
        <div v-for="(step, i) of steps" :key="`${step}-${i}`" class="step">
          <div class="index">{{ i + 1 }}</div>
          <p>{{ step }}</p>
        </div>
      </div>
      <div v-else class="mt">
        <app-input v-model="editingData.steps" label="Steps" type="textarea" />
      </div>
    </card>

    <div v-if="editing && recipe?.id" class="spread mb">
      <div></div>
      <div class="buttons">
        <app-button class="secondary" @click="editing = false">
          Cancel
        </app-button>
        <app-button class="dangerous" @click="deleteRecipe">Delete</app-button>
      </div>
    </div>

    <portal v-if="!editing" to="right-side">
      <p>Ingredients</p>
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
    <portal v-else to="right-side">
      <app-input
        v-model="editingData.ingredients"
        label="Ingredients"
        type="textarea"
      />
    </portal>
  </div>
</template>

<style lang="scss" scoped>
.spread {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.buttons {
  display: flex;
  gap: 10px;
}
.title-wrapper {
  display: grid;
  grid-template-columns: 1fr 100px;
  grid-gap: 10px;
}
.ingredients {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  grid-gap: 10px;
  margin: 5px 0;

  .progress-bar {
    margin-top: 5px;
  }
}

.card .title-wrapper {
  margin-bottom: 20px;
}

.icon-with-text {
  display: flex;
  gap: 6px;
  align-items: center;

  svg {
    display: block;
  }

  .no-wrap {
    white-space: nowrap;
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
.mt {
  margin-top: 20px;
}
.mb {
  margin-bottom: 20px;
}

@media (max-width: 720px) {
  .title-wrapper.spread {
    display: block;

    .icon-with-text {
      margin-top: 20px;
    }
  }
}
</style>

<script>
// Import components
import { Portal } from 'portal-vue'
import PageTitle from '~/components/title/PageTitle'
import Card from '~/components/layout/Card'
import ProgressBar from '~/components/util/ProgressBar'
import AppButton from '~/components/util/Button'
import AppInput from '~/components/base/inputs/Input'
import Banner from '~/components/base/Banner'

// Import icons
import WatchIcon from '~/assets/icons/watch.svg?inline'

// Import utility functions
import { getRecipeInfo } from '~/util/recipeInfo'
import { getWeightLabel } from '~/util/getList'

// Import Supabase
import SupabaseClient from '~/util/supabase'

const steps = `
Prepare dish
Eat dish
`.trim()

const ingredients = `
200ml milk
1kg potatoes
`.trim()

export default {
  components: {
    PageTitle,
    Card,
    ProgressBar,
    Portal,
    AppButton,
    AppInput,
    Banner,
    WatchIcon,
  },
  data() {
    return {
      error: '',
      editing: this.$route.params.id === 'create',
      editingData: {
        title: 'My new recipe',
        steps,
        ingredients,
        durationInMinutes: '30',
      },
    }
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
    async deleteRecipe() {
      if (confirm('Are you sure you want to delete this recipe?')) {
        if (!this.recipe?.id) {
          alert('No id')
          return
        }
        const { error } = await SupabaseClient.from('recipes').delete().match({
          id: this.recipe?.id,
        })

        if (error?.message) {
          this.error = error?.message
        } else {
          this.$nuxt.$emit('refetch-recipes')
          this.$router.push('/recipes')
        }
      }
    },
    edit() {
      const trim = (str) => {
        return (str || '')
          .replace(/ +/g, ' ')
          .trim()
          .replace(/\n +/g, '\n')
          .trim()
      }

      this.editing = true
      this.editingData = {
        title: this.recipe?.title || 'My new recipe',
        steps: trim(this.recipe.steps) || steps,
        ingredients: trim(this.recipe?.ingredients) || ingredients,
        id: this.recipe?.id,
        durationInMinutes: (this.recipe?.durationInMinutes || 30).toString(),
      }
    },
    async save() {
      const submitObj = {
        ...this.editingData,
        user_id: SupabaseClient.auth.user().id,
      }

      if (!submitObj.id) {
        // Create
        const data = await SupabaseClient.from('recipes').insert(submitObj)

        if (data.error?.message) {
          this.error = data.error?.message
        } else {
          this.$nuxt.$emit('refetch-recipes')
          this.editing = false
          this.$router.push(`/recipes/${data.data.find(Boolean).id}`)
        }
      } else if (submitObj.id) {
        // Update
        const { error } = await SupabaseClient.from('recipes')
          .update(submitObj)
          .match({
            id: submitObj.id,
          })

        if (error?.message) {
          this.error = error?.message
        } else {
          this.error = ''
          this.$nuxt.$emit('refetch-recipes')
          this.editing = false
        }
      }
    },
  },
}
</script>
