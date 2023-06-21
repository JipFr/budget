<template>
  <div class="plugin-loader" :class="pluginsState.loading && 'visible'">
    <div class="logos">
      <component
        :is="plugin.icon"
        v-for="(plugin, i) of plugins"
        :key="plugin.id"
        :class="i === pluginsState.pluginsLoaded && 'currently-loading'"
      />
      <check-icon
        :class="
          pluginsState.pluginsLoaded === pluginsState.pluginCount &&
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

@media (prefers-color-scheme: light) {
  .plugin-loader .bar .block {
    background: var(--content-darker);
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

    &.feather-check {
      color: #34c759;
    }
  }
}

.plugin-loader:not(.visible) {
  animation: fadeOutAfterABit 1s linear forwards;
}
.plugin-loader:not(.visilbe) .feather-check {
  animation: jiggle 1.5s linear infinite;
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
@keyframes jiggle {
  0% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(5deg);
  }
  50% {
    transform: rotate(0deg);
  }
  75% {
    transform: rotate(-5deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
</style>

<script>
import { plugins, pluginsState } from '~/krab-plugins'

// Import icons
import CheckIcon from '~/assets/icons/check.svg?inline'

export default {
  components: {
    CheckIcon,
  },
  data() {
    return {
      plugins,
      pluginsState,
    }
  },
}
</script>
