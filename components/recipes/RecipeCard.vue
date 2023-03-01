<template>
  <card
    :class="
      recipeInfo.approximateMissingItemsPriceInCents < availableMoneyInCents
        ? 'can-afford'
        : ''
    "
  >
    <div class="ribbon-wrapper"></div>
    <nuxt-link :to="`/recipes/${recipe.id}`" class="link-wrapper">
      <div class="title-wrapper">
        <h4 class="title">{{ recipe.title }}</h4>
      </div>
    </nuxt-link>
    <div>
      <hr class="no-top" />

      <div class="cols">
        <div class="icon-with-text">
          <watch-icon />
          <span>{{
            recipe.durationInMinutes
              ? `${recipe.durationInMinutes} minutes`
              : 'Unknown length'
          }}</span>
        </div>
      </div>

      <hr />

      <div class="cols">
        <div>
          <span class="secondary">Total:</span>
          <money :cents="recipeInfo.approximatePriceInCents" />
        </div>
        <div class="divider"></div>
        <div>
          <span class="secondary">Missing:</span>
          <money :cents="recipeInfo.approximateMissingItemsPriceInCents" />
        </div>
      </div>

      <hr />

      <div class="spread to-bottom">
        <span> Required ingredients </span>
        <div class="dropdown-wrapper">
          <dropdown :icon="MoreHorizontalIcon">
            <div class="requirement spread">
              <span>Remaining cost:</span>
              <money :cents="recipeInfo.approximateMissingItemsPriceInCents" />
            </div>
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

      <progress-bar :percentage="recipeInfo.requirementsPossesedPercentage" />
    </div>
  </card>
</template>

<style lang="scss" scoped>
.card {
  display: grid;
  grid-template-rows: 1fr auto;

  .ribbon-wrapper {
    display: none;
  }

  &.can-afford {
    position: relative;

    .ribbon-wrapper {
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: -10px;
        right: -64px;
        width: 100px;
        height: 50px;
        background: rgb(52, 199, 89);
        transform: rotate(45deg);
        opacity: 0.3;
      }

      &::after {
        content: '€';
        position: absolute;
        top: 2px;
        right: 5px;
      }
    }
  }

  .link-wrapper {
    display: block;
    text-decoration: none;
    color: inherit;
    padding: 15px;
    margin-left: -15px;
    margin-top: -15px;
    width: calc(100% + 30px);

    &:hover {
      background: var(--content-light);
    }
  }

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

  &.no-top {
    margin-top: 0;
  }
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

.progress-bar {
  margin: 10px 0;
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
  --dropdown-width: 300px;
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
import ProgressBar from '~/components/util/ProgressBar'

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
    ProgressBar,
  },
  props: {
    recipe: {
      type: Object,
      required: true,
    },
    availableMoneyInCents: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      MoreHorizontalIcon,
    }
  },
  computed: {
    recipeInfo() {
      const info = getRecipeInfo(this.recipe, this.$store)
      return info
    },
  },
  methods: {
    getWeightLabel,
    getPercentageColor,
  },
}
</script>
