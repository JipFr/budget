<template>
  <div class="badge-and-text" :smaller="smaller">
    <div class="badge">
      <slot />
    </div>
    <h4>{{ title }}</h4>
    <p>{{ description }}</p>
  </div>
</template>

<style lang="scss" scoped>
.badge-and-text {
  &[smaller] {
    h4 {
      font-size: 1rem;
      margin-top: 18px;
    }
    .badge {
      width: 35px;
      height: 35px;

      svg {
        width: 20px;
        height: 20px;
      }
    }
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

    svg {
      width: 20px;
      height: 20px;
    }
  }
  p {
    color: var(--text-secondary);
  }
}

h4 {
  font-size: 1.2rem;
  font-weight: 500;
  margin-top: 22px;
  margin-bottom: 15px;
}
</style>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    smaller: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
