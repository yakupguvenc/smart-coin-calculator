<template>
  <div class="col-md-6 m-auto left-area">
    <div class="h-100 p-1 bg-white rounded-3">
      <h2>Select Symbol</h2>

      <div class="d-flex justify-content-between mt-4">
        <template v-for="(symbol,index) in symbols">
          <router-link type="button" :key="index"
                       class="btn btn-light btn-symbols border" :to="'/calculator/'+symbol.name">
            {{ symbol.icon }}
          </router-link>
        </template>
      </div>

    </div>
  </div>

</template>

<script>
// @ is an alias to /src

export default {
  name: 'SymbolList',
  data() {
    return {
      symbols: [
        {name: 'EUR', icon: '€'},
        {name: 'USD', icon: '$'},
        {name: 'GBP', icon: '£'}
      ]
    }
  }
}
</script>
