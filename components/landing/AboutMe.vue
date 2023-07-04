<template>
  <section class="about-me">
    <container class="limited-width smol-boi">
      <div>
        <h2>Built by one guy</h2>
        <p>That's right. I'm just that good.</p>
        <div class="socials">
          <a href="mailto:jip@frij.link" target="_blank" class="social-item">
            <div class="social-logo">
              <mail-icon />
            </div>
            <span>jip@frij.link</span>
          </a>
          <a
            href="https://github.com/jipfr"
            target="_blank"
            class="social-item"
          >
            <div class="social-logo">
              <github-icon />
            </div>
            <span>@jipfr</span>
          </a>
        </div>
      </div>
      <aside>
        <img
          src="/landing/jip.jpg"
          alt="Unbelievably good-looking guy. You should honestly be sad you can't see because I am SO HOT."
        />
      </aside>
    </container>
  </section>
</template>

<style lang="scss" scoped>
.about-me {
  --about-me-bg: var(--content-light);
  margin-bottom: 150px;
  padding: 80px 0;
  background: var(--about-me-bg);
}

@media (prefers-color-scheme: dark) {
  .about-me {
    --about-me-bg: #111111;
  }
}

.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

h2 {
  font-size: 2.875rem;
  color: var(--text);
  margin-bottom: 2.5rem;
}

p {
  color: var(--text-secondary);
  font-size: 1.3125rem;
}

aside img {
  max-width: 300px;
  border-radius: 6px;
}

.socials {
  display: grid;
  grid-gap: 10px;
  margin-top: 3.5rem;

  a {
    display: block;
    color: var(--text);
    text-decoration: none;
    display: grid;
    align-items: center;
    grid-template-columns: auto 1fr;
    grid-gap: 15px;
    font-size: 1.2rem;

    .social-logo {
      background: var(--content);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 6px;

      svg {
        display: block;
      }
    }
  }
}

@media (max-width: 949px) {
  .container {
    display: block;

    aside {
      width: 100%;
      display: flex;
      justify-content: center;
    }

    img {
      margin: 0 auto;
      margin-top: 30px;
    }
  }

  h2 {
    font-size: 2rem;
  }
  p {
    font-size: 1rem;
  }

  .socials a {
    font-size: 1rem;

    .social-logo svg {
      width: 20px;
      height: 20px;
    }
  }
}
</style>

<script>
// Import containers
import Container from '~/components/layout/Container'

// Import icons
import MailIcon from '~/assets/icons/mail.svg?inline'
import GithubIcon from '~/assets/icons/github.svg?inline'

export default {
  components: {
    Container,
    MailIcon,
    GithubIcon,
  },
}
</script>
