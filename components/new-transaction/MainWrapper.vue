<template>
  <div class="new-transaction-wrapper" :class="open ? 'open' : 'closed'">
    <div class="button" @click="toggleOpen">
      <plus-circle-icon />
    </div>
    <div class="content">
      <container class="limited-width">
        <!-- Title -->
        <h2>New transaction</h2>

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
        <button class="primary" @click="submit">Submit</button>
      </container>
    </div>
  </div>
</template>

<style lang="scss" scoped>
h2 {
  margin-bottom: 20px;
}
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
  border: 2px solid var(--body);
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
  padding: 40px 0;
  width: 100%;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  background: var(--body);

  .container > * + * {
    margin-top: 10px;
  }
  .container hr {
    margin: 20px 0;
    border: 0;
    height: 1px;
    background: var(--border);
  }
}

.auto-fr {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: 10px;
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
  .new-transaction-wrapper.open {
    background: rgba(0, 0, 0, 0.6);
  }
  button.primary {
    color: var(--text-secondary);
    background: var(--content);
  }
}
</style>

<script>
// Import components
import Container from '~/components/layout/Container'
import AppInput from '~/components/base/inputs/Input'
import Banner from '~/components/base/Banner'

// Import icons
import PlusCircleIcon from '~/assets/icons/plus-circle.svg?inline'

// Other values
const editingData = {
  description: '',
  euros: '0,00',
  tags: '',
  date: new Date().toISOString().split('T')[0],
}

export default {
  components: {
    Container,
    AppInput,
    PlusCircleIcon,
    Banner,
  },
  data() {
    return {
      open: false,
      editingData: Object.assign({}, editingData),
      error: '',
    }
  },
  methods: {
    toggleOpen() {
      this.open = !this.open
    },
    reload() {
      location.reload()
    },
    cleanDescription(evt) {
      const newValue = evt.currentTarget.value.replace(/\./g, ',')
      this.editingData.categories = newValue
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

      await this.$axios
        .post('/transactions/insert', submitObj)
        .then(({ data }) => {
          if (data.status !== 200) {
            this.error = data.error
          } else {
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
