<template>
  <overlay :open="open" :show-button="showButton" @toggle-open="toggleOpen">
    <div class="overlay-content">
      <!-- Title -->
      <h3>{{ editingData.id ? 'Edit transaction' : 'New transaction' }}</h3>

      <!-- Error banner -->
      <banner v-if="error">⚠️ {{ error }}</banner>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <banner v-if="message" type="message" v-html="message" />

      <card>
        <!-- All inputs -->
        <app-input
          v-model="editingData.description"
          label="Description"
          type="textarea"
          placeholder="Netflix subscription"
        />
        <app-input v-model="editingData.date" label="Date" type="date" />
        <app-input
          v-model="editingData.tags"
          label="Categories"
          placeholder="netflix, monthly"
          type="list"
          @change="(e) => cleanDescription(e)"
        />
        <app-input
          v-model="editingData.euros"
          :label="settingsState.currency.name"
          :prefix="settingsState.currency.symbol"
          placeholder="10,99"
          @change="(e) => cleanEuro(e)"
        />

        <!-- Placeholders -->
        <hr />
        <div class="spread">
          <div class="buttons">
            <app-button class="primary" @click="submit">
              {{ editingData.id ? 'Save' : 'Submit' }}
            </app-button>
            <app-button v-if="editingData.id" class="secondary" @click="cancel">
              Cancel
            </app-button>
          </div>
          <div class="buttons">
            <app-button class="secondary" @click="copyCurrency">
              {{ settingsState.currency.symbol }}
            </app-button>
          </div>
        </div>
      </card>
    </div>
  </overlay>
</template>

<style lang="scss" scoped>
h3 {
  font-size: 1rem;
  font-weight: normal;
  margin-bottom: 5px;
}
label ::v-deep span {
  // --border: var(--content-lighter);
  font-weight: 500;
}
.auto-fr {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: 10px;
}
.card > * + * {
  margin-top: 10px;
}
.spread {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

@media (prefers-color-scheme: dark) {
  button.primary {
    background: var(--body);
  }
}
</style>

<script>
import eventBus from '~/plugins/event-bus'

// Import components
import Overlay from '~/components/base/util/Overlay'
import AppInput from '~/components/base/inputs/Input'
import Banner from '~/components/base/Banner'
import AppButton from '~/components/util/Button'
import Card from '~/components/layout/Card'

// Import Supabase
import SupabaseClient from '~/util/supabase'

import { state as settingsState } from '~/util/settings'

// Other values
const editingData = {
  description: '',
  euros: '0.00',
  tags: '',
  date: new Date().toISOString().split('T')[0],
}

export default {
  components: {
    AppInput,
    Banner,
    Overlay,
    AppButton,
    Card,
  },
  props: {
    showButton: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  data() {
    return {
      open: false,
      editingData: Object.assign({}, editingData),
      error: '',
      message: '',
      settingsState,
      splitter: '.',
    }
  },
  mounted() {
    // Find out if preferred split is comma or period
    const formatter = new Intl.NumberFormat(
      settingsState.currency.countryCode ?? 'en-US',
      {
        style: 'currency',
        currency: settingsState.currency.code,
      }
    )
    const str = formatter.format(0).trim()
    const splitter = str.includes('.') ? '.' : ','

    editingData.euros = editingData.euros.replace('.', splitter)
    this.editingData.euros = this.editingData.euros.replace('.', splitter)
    this.splitter = splitter

    // On this event, open the pop-over to edit a transaction
    this.$nuxt.$on('edit-transaction', (id) => {
      // Get all transactions and find relevant ones
      const allTransactions = this.$store.state.user.data.transactions
      const relevantTransaction = allTransactions.find((t) => t.id === id)

      // Convert values to values readable by editor

      // Euros
      const cents = relevantTransaction.cents.toString()
      const euros = `${cents.slice(0, -2)}${this.splitter}${cents.slice(-2)}`

      // Other fields
      const tags = relevantTransaction.categories.join(', ')
      const date = relevantTransaction.date
      const description = relevantTransaction.description

      this.editingData = {
        id: relevantTransaction.id,
        euros,
        tags,
        date,
        description,
      }

      this.open = true
    })
  },
  methods: {
    toggleOpen() {
      this.open = !this.open
      if (this.open) {
        // It was opened, reset the data so pressing the + doesn't have you edit a transaction
        this.editingData = Object.assign({}, editingData)
      }
    },
    reload() {
      location.reload()
    },
    cleanDescription(evt) {
      const newValue = evt.currentTarget.value.replace(/\./g, ',')
      this.editingData.categories = newValue
      evt.currentTarget.value = newValue
    },
    cleanEuro(evt) {
      const allowedCharacters = `-0987654321${this.splitter}`

      let newValue = evt.currentTarget.value
        .replace(/,|\./g, this.splitter) // Replace commas and periods with the preferred splitter
        .split(this.splitter)
        .slice(0, 2) // Only allow 1 period in the whole thing

      // Make sure only 2 decimal points are allowed
      if (newValue[1]) newValue[1] = newValue[1].slice(0, 2)

      // Make sure newValue 0 is not empty or just a negative sign
      if (
        newValue.length === 0 ||
        (newValue[0] === '-' && newValue[0].length === 1 && newValue.length > 1)
      )
        newValue[0] += '0'

      // String it back together
      newValue = newValue.join(this.splitter)

      // Remove disallowed characters
      newValue = newValue
        .split('')
        .filter((v) => allowedCharacters.includes(v.toString()))
        .join('')

      evt.currentTarget.value = newValue
      this.editingData.euros = newValue
    },
    async submit() {
      const submitObj = {}

      // Parse cents from '9.32' or '9.3' or '9,3' to '930'
      if (this.editingData.euros.includes(this.splitter)) {
        const [euros, cents] = this.editingData.euros.split(this.splitter)
        submitObj.cents = Number(`${euros}${cents.padEnd(2, '0')}`)
      } else {
        submitObj.cents = Number(this.editingData.euros) * 100
      }

      // Add other fields
      submitObj.description = this.editingData.description
      submitObj.date = this.editingData.date
      submitObj.categories = this.editingData.tags
        .split(', ')
        .map((v) => v.trim())
        .filter(Boolean)
      if (this.editingData.id) submitObj.id = this.editingData.id

      submitObj.user_id = SupabaseClient.auth.user().id

      if (submitObj.id) {
        // Update transaction
        const { error } = await SupabaseClient.from('transactions')
          .update(submitObj)
          .match({
            id: submitObj.id,
          })

        if (error) {
          this.error = error
        } else {
          this.close()
          this.$nuxt.$emit('refetch')
        }
      } else {
        // Insert transaction
        const { error } = await SupabaseClient.from('transactions').insert([
          submitObj,
        ])
        if (error) {
          this.error = error.message
        } else {
          this.close()
          this.$nuxt.$emit('refetch')
        }
      }

      eventBus.$emit('force-refetch')
    },
    cancel() {
      // The "cancel" button was clicked. Only shows up on desktop
      // Close the modal and remove the input
      this.open = false
      this.editingData = Object.assign({}, editingData)
      this.error = ''
      this.message = ''
      this.$nuxt.$emit('cancel-transaction-edit')
    },
    copyCurrency() {
      const symbol = settingsState.currency.symbol
      navigator.clipboard.writeText(symbol)
      this.message = `Copied <strong>${symbol}</strong> to your clipboard`
    },
    close() {
      this.open = false
      this.$nuxt.$emit('cancel-transaction-edit')
      setTimeout(() => {
        this.editingData = Object.assign({}, editingData)
        this.error = ''
        this.message = ''
      }, 500)
    },
  },
}
</script>
