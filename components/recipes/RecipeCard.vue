<template>
  <card>
    <h4 class="title">{{ recipe.title }}</h4>
    <hr />

    <div class="cols">
      <div class="icon-with-text">
        <watch-icon />
        <span>{{ recipe.durationInMinutes }} minutes</span>
      </div>
      <div class="divider"></div>
      <div class="icon-with-text">
        <dollar-sign-icon />
        <span>
          <money :cents="recipeInfo.approximatePriceInCents" />
        </span>
      </div>
    </div>

    <hr />

    <div class="spread to-bottom">
      <span> Required ingredients </span>
      <div class="dropdown-wrapper">
        <dropdown>
          <div
            v-for="requirement of recipeInfo.requirements"
            :key="requirement"
            class="requirement spread"
          >
            <span class="ingredient">{{ requirement.description }}</span>
            <span class="quantities"
              >{{
                getWeightLabel(
                  requirement.measurementUnit,
                  requirement.inStock,
                  false
                )
              }}
              /
              {{
                getWeightLabel(
                  requirement.measurementUnit,
                  requirement.requiredTotal,
                  false
                )
              }}</span
            >
          </div>
        </dropdown>
      </div>
    </div>

    <div class="spread bar-wrapper">
      <span class="no-wrap">
        {{ recipeInfo.requirementsPossesedPercentage }}%
      </span>
      <div class="progress-bar">
        <div
          class="progress-bar-inner"
          :style="`width: ${
            recipeInfo.requirementsPossesedPercentage
          }%; background-color: ${getPercentageColor(
            recipeInfo.requirementsPossesedPercentage
          )}`"
        ></div>
      </div>
      <span class="no-wrap">100%</span>
    </div>
  </card>
</template>

<style lang="scss" scoped>
.title {
  font-size: 1rem;
  font-weight: 500;
}
hr {
  margin: 20px 0;
  border: 0;
  width: calc(100% + 30px);
  margin-left: -15px;
  height: 1px;
  background: var(--border);
}
.cols {
  display: grid;
  grid-template-columns: auto 1fr auto;

  .divider {
    height: calc(100% + 40px);
    padding: 20px 0;
    margin: -20px auto;
    width: 1px;
    background: var(--border);
  }
}
.icon-with-text {
  display: flex;
  gap: 6px;
  align-items: center;

  svg {
    display: block;
  }

  & + .icon-with-text {
    border-left: 1px solid var(--border);
    padding-left: 8px;
  }
}

.bar-wrapper {
  margin: 10px 0;
}
.progress-bar {
  width: 100%;
  height: 10px;
  background: var(--body);
  border-radius: 100px;
  overflow: hidden;

  .progress-bar-inner {
    height: 100%;
    background: green;
  }
}

.spread {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;

  .no-wrap {
    white-space: nowrap;
  }

  &.to-bottom {
    align-items: flex-end;
  }
}

.dropdown-wrapper {
  display: flex;
  justify-content: flex-end;
  --dropdown-width: 250px;

  .requirement {
    padding: 10px 12px;

    .quantities {
      color: var(--text-secondary);
    }

    & + .requirement {
      border-top: 1px solid var(--border);
    }
  }
}
</style>

<script>
// Import components
import Card from '~/components/layout/Card'
import Money from '~/components/title/Money'
import Dropdown from '~/components/base/util/Dropdown'

// Import icons
import WatchIcon from '~/assets/icons/watch.svg?inline'
import DollarSignIcon from '~/assets/icons/dollar-sign.svg?inline'

// Import utility functions
import { getRecipeInfo, getPercentageColor } from '~/util/recipeInfo'
import { getWeightLabel } from '~/util/getList'

export default {
  components: {
    Card,
    Money,
    WatchIcon,
    DollarSignIcon,
    Dropdown,
  },
  props: {
    recipe: {
      type: Object,
      required: true,
    },
  },
  computed: {
    recipeInfo() {
      return getRecipeInfo(this.recipe, this.$store)
    },
  },
  methods: {
    getPercentageColor,
    getWeightLabel,
  },
}
</script>
