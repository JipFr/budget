<template>
  <div class="hero">
    <div class="hero-layout">
      <card class="fw highlight">
        <subtitle>In this period...</subtitle>
        <h1>
          <money :cents="12050" />
        </h1>
      </card>
      <card>
        <subtitle>Gained</subtitle>
        <h2>
          <money :cents="13070" />
        </h2>
      </card>
      <card>
        <subtitle>Spent</subtitle>
        <h2>
          <money :cents="1020" />
        </h2>
      </card>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.hero {
  padding: 40px 0;
}
.hero-layout {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 10px;

  .fw {
    grid-column: 1 / -1;
  }
}
</style>

<script>
// Import components
import Card from '~/components/layout/Card'
import Subtitle from '~/components/title/Subtitle'
import Money from '~/components/title/Money'

export default {
  components: {
    Card,
    Subtitle,
    Money,
  },
}
</script>
