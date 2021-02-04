<template>
  <overlay :open="open" :show-button="showButton" @toggle-open="toggleOpen">
    <div class="overlay-content">
      <!-- Title -->
      <h2>{{ editingData.id ? 'Edit transaction' : 'New transaction' }}</h2>

      <!-- Error banner -->
      <banner v-if="error">⚠️ {{ error }}</banner>

      <!-- All inputs -->
      <app-input
        v-model="editingData.description"
        label="Description"
        placeholder="Netflix subscription"
      />
      <app-input v-model="editingData.date" label="Date" type="date" />
      <app-input
        v-model="editingData.tags"
        label="Categories"
        placeholder="netflix, monthly"
        @change="(e) => cleanDescription(e)"
      />
      <app-input
        v-model="editingData.euros"
        label="Euros"
        placeholder="10,99"
        prefix="€"
        @change="(e) => cleanEuro(e)"
      />

      <!-- Placeholders -->
      <hr />
      <button class="primary" @click="submit">
        {{ editingData.id ? 'Save' : 'Submit' }}
      </button>
    </div>
  </overlay>
</template>

<style lang="scss" scoped>
.auto-fr {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: 10px;
}
.overlay-content > * + * {
  margin-top: 10px;
}

button.primary {
  font-size: 1rem;
  padding: 12px 20px;
  border-radius: 6px;
  border: 0;
  background: var(--theme);
  color: white;
  text-transform: uppercase;
}

@media (prefers-color-scheme: dark) {
  button.primary {
    color: var(--text-secondary);
    background: var(--content);
  }
}
</style>

<script>
// Import components
import Overlay from '~/components/base/util/Overlay'
import AppInput from '~/components/base/inputs/Input'
import Banner from '~/components/base/Banner'

// Other values
const editingData = {
  description: '',
  euros: '0,00',
  tags: '',
  date: new Date().toISOString().split('T')[0],
}

export default {
  components: {
    AppInput,
    Banner,
    Overlay,
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
    }
  },
  mounted() {
    /**
     * On this event, open the pop-over to edit a transaction
     */
    this.$nuxt.$on('edit-transaction', (id) => {
      // Get all transactions and find relevant ones
      const allTransactions = this.$store.state.user.data.transactions
      const relevantTransaction = allTransactions.find((t) => t.id === id)

      // Convert values to values readable by editor

      // Euros
      const cents = relevantTransaction.cents.toString()
      const euros = `${cents.slice(0, -2)},${cents.slice(-2)}`

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
      const allowedCharacters = '-0987654321,'

      let newValue = evt.currentTarget.value
        .replace(/\./g, ',') // Replace dots with commas to prevent errors
        .split(',')
        .slice(0, 2) // Only allow 1 comma in the whole thing

      // Make sure only 2 decimal points are allowed
      if (newValue[1]) newValue[1] = newValue[1].slice(0, 2)

      // String it back together
      newValue = newValue.join(',')

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

      // Add cents field
      if (!this.editingData.euros.includes(',')) this.editingData.euros += ',00'
      submitObj.cents = Number(this.editingData.euros.replace(/,/g, ''))

      // Add other fields
      submitObj.description = this.editingData.description
      submitObj.date = this.editingData.date
      submitObj.categories = this.editingData.tags
      if (this.editingData.id) submitObj.id = this.editingData.id

      const path = submitObj.id
        ? '/transactions/update'
        : '/transactions/insert'

      await this.$axios
        .post(path, submitObj)
        .then(({ data }) => {
          // Transaction might have been added
          if (data.status !== 200) {
            // Error handling
            this.error = data.error
          } else {
            // Transaction inserted!
            // Close the modal and remove the input
            this.open = false
            setTimeout(() => {
              this.editingData = Object.assign({}, editingData)
              this.error = ''
              this.$nuxt.$emit('refetch')
            }, 500)
          }
        })
        .catch((err) => {
          this.error = err
        })
    },
  },
}
</script>
