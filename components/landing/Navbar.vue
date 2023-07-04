<template>
  <header>
    <logo />
    <div class="nav-items">
      <a href="#faq">FAQ</a>
      <a href="#features">Features</a>
      <div class="dropdown-wrapper">
        <div
          class="dropdown-content"
          :open="dropdownOpen"
          @click="toggleDropdown"
        >
          <span>Sign in</span>
          <chevron-down-icon />
        </div>
        <div v-if="dropdownOpen" class="dropdown-out">
          <div class="logos">
            <button data-link="github" @click="login('github')">
              <github-logo />
              Log in with GitHub
            </button>
            <button data-link="discord" @click="login('discord')">
              <discord-logo />
              Log in with Discord
            </button>
            <button data-link="google" @click="login('google')">
              <google-logo />
              Log in with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
header {
  padding: 30px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 90;
}

.logo {
  font-weight: 500;
}

.nav-items {
  display: flex;
  align-items: center;
  gap: 38px;

  a {
    color: inherit;
    text-decoration: none;
    display: block;
  }
}

.dropdown-wrapper {
  position: relative;

  .dropdown-content,
  .dropdown-out {
    padding: 6px 8px;
    background: var(--content);
    border: 1px solid var(--border);
    border-radius: 6px;

    svg {
      display: block;
      transition: transform 100ms;
    }
  }

  .dropdown-content {
    display: flex;
    gap: 10px;
    align-items: center;
    font-weight: 500;
    cursor: pointer;

    &[open] svg {
      transform: rotate(-180deg);
    }
  }

  .dropdown-out {
    position: absolute;
    top: calc(100% + 10px);
    right: 0;
    width: 220px;

    button {
      display: grid;
      align-items: center;
      grid-template-columns: auto 1fr;
      grid-gap: 10px;
      background: transparent;
      border: 0;
      font-size: 1rem;
      color: var(--text);
      padding: 10px;
      width: 100%;
      border-radius: 6px;
      transition: background-color 200ms;
      cursor: pointer;

      &:hover {
        background: var(--content-light);
      }

      svg {
        width: 1.2rem;
        height: 1.2rem;
      }
    }
  }
}

@media (max-width: 949px) {
  .nav-items > a {
    display: none;
  }
}
</style>

<script>
// Import components
import Logo from '~/components/base/util/Logo'

// Import icons
import ChevronDownIcon from '~/assets/icons/chevron-down.svg?inline'

// Import logo SVGs (for login buttons)
import GithubLogo from '~/assets/logos/github.svg?inline'
import DiscordLogo from '~/assets/logos/discord.svg?inline'
import GoogleLogo from '~/assets/logos/google.svg?inline'

// Import Supabase
import SupabaseClient from '~/util/supabase'

export default {
  components: {
    Logo,
    ChevronDownIcon,
    GithubLogo,
    DiscordLogo,
    GoogleLogo,
  },
  data() {
    return {
      dropdownOpen: false,
    }
  },
  methods: {
    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen
    },
    async login(provider) {
      await SupabaseClient.auth.signIn(
        {
          provider,
        },
        {
          redirectTo:
            process.env.NODE_ENV === 'production'
              ? 'https://krabbijkas.nl/'
              : process.env.REDIRECT_URL,
        }
      )
    },
  },
}
</script>
