<template>
  <card>
    <div class="title-wrapper">
      <h4 class="title">{{ recipe.title }}</h4>
    </div>
    <div>
      <hr />

      <div class="cols">
        <div class="icon-with-text">
          <watch-icon />
          <span>{{ recipe.durationInMinutes }} minutes</span>
        </div>
        <div class="divider"></div>
        <div>
          <span class="secondary">About</span>
          <money :cents="recipeInfo.approximatePriceInCents" />
        </div>
      </div>

      <hr />

      <div class="spread to-bottom">
        <span> Required ingredients </span>
        <div class="dropdown-wrapper">
          <dropdown :icon="MoreHorizontalIcon">
            <div
              v-for="requirement of recipeInfo.requirements"
              :key="requirement.description"
              class="requirement spread"
            >
              <div class="ingredient">
                <span
                  class="dot"
                  :style="`background-color: ${getPercentageColor(
                    (requirement.inStock / requirement.requiredTotal) * 100
                  )}`"
                ></span>
                {{ requirement.description }}
              </div>
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
        <span class="no-wrap">
          {{ recipeInfo.requirementsPossesedPercentage }}%
        </span>
      </div>
    </div>
  </card>
</template>

<style lang="scss" scoped>
.card {
  display: grid;
  grid-template-rows: 1fr auto;

  .title-wrapper {
    display: flex;
    align-items: center;
  }
}
.title {
  font-size: 1rem;
  font-weight: 500;
}
hr {
  margin: 15px 0;
  border: 0;
  width: calc(100% + 30px);
  margin-left: -15px;
  height: 1px;
  background: var(--border);
}

.secondary {
  color: var(--text-secondary);
}

.cols {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;

  .divider {
    height: calc(100% + 30px);
    padding: 15px 0;
    margin: -15px auto;
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
  --button-size: 28px;
  --button-border-width: 0;

  .requirement {
    padding: 10px 12px;

    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }

    .ingredient {
      display: flex;
      gap: 10px;
      align-items: center;
    }

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
import MoreHorizontalIcon from '~/assets/icons/more-horizontal.svg?inline'

// Import utility functions
import { getRecipeInfo, getPercentageColor } from '~/util/recipeInfo'
import { getWeightLabel } from '~/util/getList'

export default {
  components: {
    Card,
    Money,
    WatchIcon,
    Dropdown,
  },
  props: {
    recipe: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      MoreHorizontalIcon,
    }
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
