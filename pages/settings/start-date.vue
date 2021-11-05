<template>
  <div>
    <h2>Period start</h2>
    <p>This is the default starting date for each period. Default: 23</p>
    <hr />
    <div class="selectable-days">
      <div
        v-for="[i] of Object.entries(Array(28).fill(0))"
        :key="i"
        class="day"
        :class="Number(i) + 1 === 23 ? 'selected-day' : ''"
      >
        <div class="label">{{ Number(i) + 1 }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
p {
  color: var(--text-secondary);
  margin: 20px 0;
}
hr {
  margin: 20px 0;
  border: 0;
  width: 100%;
  height: 1px;
  background: var(--border);
}
.selectable-days {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
  grid-gap: 5px;
}
.day {
  width: 100%;
  padding-bottom: 100%;
  background: var(--content);
  border-radius: 4px;
  position: relative;

  &.selected-day {
    background: var(--theme);
    color: white;
  }

  &:not(.selected-day) {
    cursor: pointer;
  }

  .label {
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
