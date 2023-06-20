<template>
  <div class="plugin-loader" :class="pluginsState.loading && 'visible'">
    <div class="logos">
      <component
        :is="plugin.icon"
        v-for="(plugin, i) of plugins"
        :key="plugin.id"
        :class="
          (i === pluginsState.pluginsLoaded ||
            (i === pluginsState.pluginCount - 1 &&
              pluginsState.pluginsLoaded === pluginsState.pluginCount)) &&
          'currently-loading'
        "
      />
    </div>
    <div class="bar">
      <div
        v-for="(_, i) of plugins"
        :key="`plugin-block-${i}`"
        class="block"
        :class="i < pluginsState.pluginsLoaded && 'activated'"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.plugin-loader {
  position: relative;

  .bar {
    position: absolute;
    top: calc(100% + 10px);
    width: 100%;
    height: 3px;
    display: flex;
    gap: 2px;

    > .block {
      width: 100%;
      height: 100%;
      border-radius: 1px;
      background: white;
      opacity: 0.5;
    }

    > .block.activated {
      opacity: 1;
      background: var(--theme);
    }
  }
}
.logos {
  position: relative;
  width: 1.5rem;
  height: 1.5rem;

  > * {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transition: opacity 300ms;

    &:not(.currently-loading) {
      opacity: 0;
    }
  }
}

.plugin-loader:not(.visible) {
  animation: fadeOutAfterABit 1s linear forwards;
}

@keyframes fadeOutAfterABit {
  0% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>

<script>
import { plugins, pluginsState } from '~/krab-plugins'

export default {
  data() {
    return {
      plugins,
      pluginsState,
    }
  },
}
</script>
