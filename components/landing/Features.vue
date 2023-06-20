<template>
  <div class="features">
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>
    <container class="limited-width">
      <h2>Features</h2>
      <div class="feature-list">
        <badge-and-text
          v-for="feature of features"
          :key="`feature-${feature.title}`"
          :title="feature.title"
          :description="feature.description"
          smaller
        >
          <component :is="feature.icon" />
        </badge-and-text>
      </div>
    </container>
  </div>
</template>

<style lang="scss" scoped>
.features {
  position: relative;
  margin-top: 150px;
}

.container {
  max-width: 900px;
}

h2 {
  color: var(--text);
  font-size: 2.5rem;
}

h3 {
  color: var(--text-secondary);
  margin: 2rem 0;
  font-size: 1.4rem;
  font-weight: 500;
}

.feature-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-gap: 50px;
  margin-top: 70px;
}

.badge {
  width: 35px;
  height: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--content);
  border: 1px solid var(--border);
  border-radius: 10px;
  font-size: 1.2rem;
}

.blob {
  position: absolute;
  transform: translate(-50%, -50%);
  filter: blur(67px);
  width: 300px;
  height: 300px;
  background: var(--blob-color);
  opacity: 0.2;
  border-radius: 100%;
  z-index: -1;

  &.blob-1 {
    opacity: 0.3;
    top: 20%;
    left: 20%;
  }
  &.blob-2 {
    bottom: -30%;
    right: 0;
  }
}

@media (max-width: 949px) {
  h2 {
    font-size: 2rem;
  }
  p {
    font-size: 1rem;
  }
}
</style>

<script>
// Import components
import Container from '~/components/layout/Container'
import BadgeAndText from '~/components/landing/util/BadgeAndText'

// Import icons
import DollarSignIcon from '~/assets/icons/dollar-sign.svg?inline'
import CalendarIcon from '~/assets/icons/calendar.svg?inline'
import BriefcaseIcon from '~/assets/icons/briefcase.svg?inline'
import BookmarkIcon from '~/assets/icons/bookmark.svg?inline'
import FileTextIcon from '~/assets/icons/file-text.svg?inline'

export default {
  components: {
    Container,
    BadgeAndText,
  },
  data() {
    return {
      features: [
        {
          icon: DollarSignIcon,
          title: 'Financial tracking',
          description:
            "It will track your budget, giving you an overview of how much you've got this month, and show spendings for each category.",
        },
        {
          icon: BriefcaseIcon,
          title: 'Food budget tracking',
          description:
            'You can keep separate track of your food budget. It will spread it out over the month, so you always know to stay inside your budget.',
        },
        {
          icon: DollarSignIcon,
          title: 'Product tracking',
          description:
            "Krab will use your history of receipts to track a product's cost over time at any given store.",
        },
        {
          icon: BookmarkIcon,
          title: 'Pantry',
          description:
            'Using your lists, Krab Bij Kas can keep track of what you have in the house.',
        },
        {
          icon: CalendarIcon,
          title: 'Recurring payments',
          description:
            'Using the "monthly" category, Krab Bij Kas can remind you when a recurring payment is about to occur.',
        },
        {
          icon: FileTextIcon,
          title: 'Recipes',
          description:
            "Using what's in your pantry, Krab Bij Kas can show you what you can cook right now, even showing you how much a recipe costs.",
        },
      ],
    }
  },
}
</script>
