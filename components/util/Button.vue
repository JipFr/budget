<template>
  <button class="button" @click="(e) => $emit('click', e)">
    <slot />
  </button>
</template>

<style lang="scss" scoped>
button {
  font-size: 1rem;
  padding: 12px 22px;
  border-radius: 6px;
  border: 0;
  box-sizing: border-box;
  border: 1px solid var(--border);
  cursor: pointer;

  &:not(.small):not(.medium):not(.no-uppercase) {
    text-transform: uppercase;
  }

  &.small {
    padding: 3px 10px;
  }

  &.medium {
    padding: 8px 10px;
  }

  &.primary {
    background: var(--theme);
    color: white;
    font-weight: bold;
    border-color: transparent;
  }

  &.secondary {
    background: transparent;
    color: var(--text);

    &:hover {
      background: var(--border);
    }
  }

  &.dangerous {
    background: #d43f3a;
    color: white;
    font-weight: bold;
  }

  &:hover {
    opacity: 0.9;
  }
  &:active {
    opacity: 0.8;
  }

  svg {
    display: block;
  }
}
</style>
