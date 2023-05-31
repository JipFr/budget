<template>
  <div>
    <div class="top-gradient"></div>
    <div class="hero">
      <div class="images">
        <div class="blob"></div>
        <div class="image center-img with-gradient">
          <img src="/landing/app.png" class="dark" alt="Landing page" />
          <img src="/landing/app-light.png" class="light" alt="Landing page" />
        </div>
        <div class="image top-left">
          <img
            src="/landing/app-recurring.png"
            class="dark"
            alt="Recurring transactions page"
          />
          <img
            src="/landing/app-recurring-light.png"
            class="light"
            alt="Recurring transactions page"
          />
        </div>
        <div class="image bottom-left">
          <img
            src="/landing/app-inventory.png"
            class="dark"
            alt="Inventory page"
          />
          <img
            src="/landing/app-inventory-light.png"
            class="light"
            alt="Inventory page"
          />
        </div>
        <div class="image top-right">
          <img src="/landing/app-recipes.png" class="dark" alt="Recipes page" />
          <img
            src="/landing/app-recipes-light.png"
            class="light"
            alt="Recipes page"
          />
        </div>
      </div>
      <div class="text-content">
        <h2>Want less guesswork when it comes to your finances?</h2>
        <h3>I've got the solution.</h3>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.hero {
  --blob-color: var(--border);
  --image-border: var(--content);

  position: relative;
  min-height: 80vh;
  display: flex;
  align-items: flex-end;
}

@media (prefers-color-scheme: dark) {
  .hero {
    --blob-color: #393647;
  }
}

.top-gradient {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 500px;
  background-color: transparent;
  background-size: 110px;
  background-image: linear-gradient(to top, var(--body), rgba(0, 0, 0, 0)),
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='18' viewBox='0 0 100 18'%3E%3Cpath fill='white' fill-opacity='0.01' d='M61.82 18c3.47-1.45 6.86-3.78 11.3-7.34C78 6.76 80.34 5.1 83.87 3.42 88.56 1.16 93.75 0 100 0v6.16C98.76 6.05 97.43 6 96 6c-9.59 0-14.23 2.23-23.13 9.34-1.28 1.03-2.39 1.9-3.4 2.66h-7.65zm-23.64 0H22.52c-1-.76-2.1-1.63-3.4-2.66C11.57 9.3 7.08 6.78 0 6.16V0c6.25 0 11.44 1.16 16.14 3.42 3.53 1.7 5.87 3.35 10.73 7.24 4.45 3.56 7.84 5.9 11.31 7.34zM61.82 0h7.66a39.57 39.57 0 0 1-7.34 4.58C57.44 6.84 52.25 8 46 8S34.56 6.84 29.86 4.58A39.57 39.57 0 0 1 22.52 0h15.66C41.65 1.44 45.21 2 50 2c4.8 0 8.35-.56 11.82-2z'%3E%3C/path%3E%3C/svg%3E");
  pointer-events: none;
}

.images {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 90%;

  .blob {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    filter: blur(82.5px);
    width: 100%;
    height: 350px;
    background: var(--blob-color);
    border-radius: 100%;

    z-index: 20;
  }

  .image {
    position: absolute;
    z-index: 10;

    .light {
      display: none;
    }

    img {
      width: 100%;
      display: block;
      border-radius: 15px;
      border: 5px solid var(--image-border);
      overflow: hidden;
    }

    &.with-gradient::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 50%;
      background: linear-gradient(to top, var(--body) 30%, rgba(0, 0, 0, 0));
      border-bottom-left-radius: 11px;
      border-bottom-right-radius: 11px;
    }

    // Specific images:
    &.center-img {
      z-index: 30;
      width: 85%;
      max-width: 790px;
      top: 65%;
      left: 50%;
      transform: translate(-50%, -50%);

      img {
        border-width: 11px;
        border-radius: 22px;
      }
    }

    &.top-left {
      width: 40%;
      max-width: 400px;
      top: 10%;
      left: 0;
    }

    &.bottom-left {
      width: 35%;
      bottom: -10%;
      left: 20px;
    }

    &.top-right {
      width: 45%;
      top: 20%;
      right: -15px;
      z-index: 25;
      max-width: 500px;
    }
  }
}

@media (prefers-color-scheme: light) {
  .image {
    .dark {
      display: none !important;
    }
    .light {
      display: block !important;
    }
  }
}

.text-content {
  max-width: 587px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  position: relative;
  z-index: 50;

  h2 {
    font-size: 2.5rem;
    color: var(--text);
  }
  h3 {
    margin-top: 3rem;
    font-size: 1.875rem;
    color: var(--text-secondary);
  }
}

@media (max-width: 949px) {
  .image.bottom-left {
    display: none;
  }

  .text-content {
    h2 {
      font-size: 2rem;
    }
    h3 {
      margin-top: 2rem;
      font-size: 1.5rem;
    }
  }
}
</style>
