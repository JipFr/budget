<template>
  <h1>
    <slot />
  </h1>
</template>

<style lang="scss">
h1 {
  display: block;
  margin: 0;
  margin-bottom: 50px;
  font-size: 1.5rem;

  &::after {
    content: '';
    display: block;
    width: 100%;
    height: 1px;
    margin-top: 0.8rem;
    background: linear-gradient(to right, var(--border), transparent);
  }
}

@media (max-width: 700px) {
  h1 {
    margin-bottom: 2rem;
  }
}
</style>
