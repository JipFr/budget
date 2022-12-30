<template>
  <card>
    <p class="card-title">
      {{ card.productName }}
      <span v-if="card.weightLabel" class="card-subtitle">
        {{ card.weightLabel }}
      </span>
    </p>
    <div class="actions">
      <button
        v-for="action of card.actions"
        :key="action.label"
        @click="action.onClick"
      >
        {{ action.label }}
      </button>
    </div>
  </card>
</template>

<style lang="scss" scoped>
.card {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 10px;
  align-items: center;

  .card-title {
    color: var(--text);
    font-weight: 500;
  }

  .card-subtitle {
    display: inline-block;
    color: var(--text-secondary);
    margin-left: 2rem;
    font-weight: 400;
  }

  .actions {
    display: flex;
    gap: 5px;
  }

  button {
    border: 0;
    padding: 4px 10px;
    border-radius: 4px;
    font-size: 0.875rem;
    color: var(--text);
    background: var(--content-light);
    border: 0;
    cursor: pointer;
    transition: background 100ms;

    &:hover {
      background: var(--content-light);
    }
  }
}
</style>

<script>
// Import components
import Card from '~/components/layout/Card'

export default {
  components: {
    Card,
  },
  props: {
    card: {
      type: Object,
      required: true,
    },
  },
}
</script>
