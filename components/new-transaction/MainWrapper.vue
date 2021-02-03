<template>
  <div class="new-transaction-wrapper" :class="open ? 'open' : 'closed'">
    <div class="button" @click="toggleOpen">
      <plus-circle-icon />
    </div>
    <div class="content">
      <button @click="reload">reload</button>
      <p>Hallo</p>
      <p>Hallo</p>
      <p>Hallo</p>
      <p>Hallo</p>
      <p>Hallo</p>
      <p>Hallo</p>
      <p>Hallo</p>
      <p>Hallo</p>
      <p>Hallo</p>
      <p>Hallo</p>
      <p>Hallo</p>
      <p>Hallo</p>
      <p>Hallo</p>
      <p>Hallo</p>
      <p>Hallo</p>
      <p>Hallo</p>
      <p>Hallo</p>
      <p>Hallo</p>
      <p>Hallo</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.new-transaction-wrapper {
  position: fixed;
  top: calc(100% - 70px - env(safe-area-inset-bottom));
  transition: top 300ms, background 300ms;
  left: 0;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-end;

  &.open {
    top: env(safe-area-inset-top);
    background: rgba(0, 0, 0, 0.2);

    .button {
      border-radius: 200px;
      background: var(--body);
      padding-bottom: 20px;
    }
    .button svg {
      transform: rotate(135deg);
    }
  }
}
.button {
  background: var(--content);
  border: 2px solid var(--content);
  // border-bottom: env(safe-area-inset-bottom) solid yellow;
  box-sizing: content-box;
  padding: 20px;
  padding-bottom: calc(20px + env(safe-area-inset-bottom));
  border-top-left-radius: 200px;
  border-top-right-radius: 200px;
  margin: 10px 0;
  transition: border-radius 500ms, padding-bottom 300ms;
  display: inline-block;
  color: var(--text-secondary);

  svg {
    display: block;
    transition: transform 500ms;
  }
}
.content {
  height: calc(100vh - 76px - env(safe-area-inset-top));
  max-height: calc(100vh - 76px - env(safe-area-inset-top));
  overflow-y: auto;
  padding: 20px;
  width: 100%;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  background: var(--body);

  p {
    margin: 30px 0;
  }
}
</style>

<script>
// Import icons
import PlusCircleIcon from '~/assets/icons/plus-circle.svg?inline'

export default {
  components: {
    PlusCircleIcon,
  },
  data() {
    return {
      open: false,
    }
  },
  methods: {
    toggleOpen() {
      this.open = !this.open
    },
    reload() {
      location.reload()
    },
  },
}
</script>
