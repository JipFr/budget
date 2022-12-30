<template>
  <card>
    <p class="card-title">
      {{ card.productName }}
    </p>
    <span v-if="card.weightLabel" class="card-subtitle">
      {{ card.weightLabel }}
    </span>
    <div ref="actions" class="actions">
      <div v-if="inputVisible" class="input-wrapper">
        <app-input
          v-model="inputValue"
          placeholder="-10"
          @blur="onBlur"
          @keyup="onKeyUp"
          @change="(e) => cleanString(e)"
        />
        <span v-if="card.measurementUnit !== 'unmeasured'">
          {{ card.measurementUnit }}
        </span>
      </div>
      <app-button v-else class="secondary small edit-button" @click="showInput">
        <edit-icon />
      </app-button>
    </div>
  </card>
</template>

<style lang="scss" scoped>
.card {
  display: grid;
  grid-template-columns: 1fr 100px 100px;
  gap: 10px;
  align-items: center;

  &:not(.no-padding) {
    padding-top: 5px;
    padding-bottom: 5px;
  }

  .card-title {
    color: var(--text);
    font-weight: 500;
  }

  .card-subtitle {
    display: inline-block;
    color: var(--text-secondary);
    font-weight: 400;
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    gap: 5px;
  }

  .input-wrapper {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 10px;
    align-items: center;
  }
}
</style>

<script>
import { nextTick } from 'vue'

// Import components
import Card from '~/components/layout/Card'
import AppButton from '~/components/util/Button'
import AppInput from '~/components/base/inputs/Input'

// Import icons
import EditIcon from '~/assets/icons/edit-alt.svg?inline'

export default {
  components: {
    Card,
    AppButton,
    AppInput,
    EditIcon,
  },
  props: {
    card: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      inputVisible: false,
      inputValue: '',
    }
  },
  methods: {
    showInput() {
      this.inputVisible = true
      this.inputValue = ''
      nextTick(() => {
        this.$refs.actions.querySelector('label').click()
      })
    },
    onBlur() {
      this.inputVisible = false

      const value = this.inputValue

      const numberValue = Number(value)
      if (
        (numberValue ?? null) === null ||
        Number.isNaN(numberValue) ||
        value.trim().length === 0
      )
        return

      if (value.startsWith('-') || value.startsWith('+')) {
        // Relative adjustment
        const desiredResult = Math.max(this.card.count + numberValue, 0)
        this.$emit('adjust', desiredResult - this.card.count)
      } else {
        // "Set full"
        const desiredResult = Math.max(numberValue, 0)
        this.$emit('adjust', desiredResult - this.card.count)
      }
    },
    onKeyUp(evt) {
      if (evt.key === 'Enter') evt.currentTarget.blur()
      if (evt.key === 'Escape') {
        this.inputValue = ''
        this.inputVisible = false
      }
    },
    cleanString(evt) {
      const allowedCharacters = '+-0987654321.'

      let newValue = evt.currentTarget.value
        .replace(/,/g, '.') // Replace commas wih dots to prevent errors
        .split('.')
        .slice(0, 2) // Only allow 1 comma in the whole thing

      // Make sure only 2 decimal points are allowed
      if (newValue[1]) newValue[1] = newValue[1].slice(0, 2)

      // String it back together
      newValue = newValue.join('.')

      // Remove disallowed characters
      newValue = newValue
        .split('')
        .filter((v) => allowedCharacters.includes(v.toString()))
        .join('')

      evt.currentTarget.value = newValue
      this.inputValue = newValue
    },
  },
}
</script>
