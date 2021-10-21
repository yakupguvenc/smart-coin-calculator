<template>
  <div id="app">
    <main>
      <div class="container py-4">
        <header class="pb-3 mb-4 border-bottom">
          <router-link to="/" class="d-flex align-items-center text-dark text-decoration-none">
            <logo/>
            <span class="fs-4">Smart Coin Calculator</span>
          </router-link>
        </header>
        <transition name="slide-fade" mode="out-in">
          <router-view/>
        </transition>
        <footer class="pt-3 mt-4 text-muted border-top">
          &copy; 2021
        </footer>
      </div>
    </main>
  </div>
</template>
<script>
// @ is an alias to /src
import Logo from "./components/Logo";

export default {
  name: 'Home',
  components: {
    Logo
  },
  created() {
    let lastData = window.getCookie('lastData');
    let currentRouteName = this.$router.currentRoute.name;
    if (lastData && lastData.currencyAmount && currentRouteName !== 'Coin Calculator') {
      this.$router.push('/calculator/' + lastData.selectedCurrency)
    }
  }
}
</script>
<style>
.slide-fade-enter-active {
  transition: all .3s ease;
}

.slide-fade-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-fade-enter, .slide-fade-leave-to
{
  transform: translateX(10px);
  opacity: 1;
}
</style>