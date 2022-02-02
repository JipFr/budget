<template>
  <div>
    <card>
      <div class="card-layout">
        <div class="full">
          <p>
            <span class="index">#01</span>
            <span>Tortillas met roomkaas, zalm</span>
          </p>
          <div class="tags">
            <tag tag="Lunch" />
            <tag tag="Avondeten" />
          </div>
        </div>
        <div class="info-list">
          <div class="info">
            <clock-icon />
            <span>15 min</span>
          </div>
        </div>
      </div>
    </card>
  </div>
</template>

<style lang="scss" scoped>
.card-layout {
  display: flex;
  align-items: center;

  > .full {
    width: 100%;
  }
}

.index {
  padding: 0 6px;
  border-radius: 4px;
  background: var(--alt-content);
  font-weight: bold;
}
.tags {
  margin-top: 5px;
}

svg {
  display: block;
  width: 1rem;
  height: 1rem;
}

.info {
  color: var(--text-secondary);
  text-align: center;
  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: 5px;
  flex-wrap: wrap;
  justify-content: center;
  white-space: nowrap;
}
</style>

<script>
// Import components
import Card from '~/components/layout/Card'
import Tag from '~/components/base/Tag'

// Import icons
import ClockIcon from '~/assets/icons/clock.svg?inline'

export default {
  components: {
    Card,
    Tag,
    ClockIcon,
  },
}
</script>
