<template>
  <div class="row align-items-md-stretch">
    <div class="col-md-6 m-auto left-area">
      <div class="h-100 p-5 bg-light border rounded-3" v-if="!result">
        <h2>Coin Calculate</h2>

        <form @submit.prevent="buyNow">
          <div class="alert alert-success pt-1 pb-1 mt-2" v-if="orderDelayAlert.status">
            {{ orderDelayAlert.message }}
          </div>
          <div class="d-flex justify-content-between mt-4">
            <div class="input-group me-3 mb-3 currency">
              <currency-input class="form-control" name="price"
                              :distraction-free="false"
                              :currency="{currency:'', suffix:'' }"
                              @keyup.native="currencyInputdelay"
                              @keydown.native="process=false"
                              v-model="requestPrice.currencyAmount"
              />
              <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown"
                      aria-expanded="false">{{ selected_currency.symbol }}
              </button>
              <ul class="dropdown-menu dropdown-menu-end">
                <template v-for="(currency,index) in currencies">
                  <li v-if="currency.symbol !== selected_currency.symbol"
                      :key="index">
                    <router-link :to="'/calculator/'+currency.symbol"
                                 class="dropdown-item">{{
                        currency.symbol
                      }}
                    </router-link>
                  </li>
                </template>
              </ul>
            </div>

            <div class="input-group ms-3 mb-3 currency">
              <currency-input class="form-control" name="price"
                              :distraction-free="false"
                              :currency="{currency:'', suffix:'' }"
                              :precision="{min: 0, max: 12}"
                              @keyup.native="cryptoInputdelay"
                              @keydown.native="process=false"
                              v-model="requestPrice.cryptoAmount"
              />
              <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown"
                      aria-expanded="false">{{ selectCrypto.crypto }}
              </button>
              <ul class="dropdown-menu dropdown-menu-end">
                <li v-for="(crypto,index) in cryptoCurrencies" :key="index" @click="selectCrypto.crypto = crypto"><a
                    class="dropdown-item" href="javascript:0">{{
                    crypto
                  }}</a></li>
              </ul>
            </div>
          </div>
          <div class="alert alert-danger pt-1 pb-1" v-if="alert.status">
            {{ alert.message }}
          </div>
          <button type="submit" class="btn btn-primary me-3"
                  @click="$router.push('/')">
            Back List
          </button>
          <button type="submit" class="btn btn-primary "
                  :disabled="alert.status || !requestPrice.cryptoAmount || !requestPrice.currencyAmount || !process">
            Buy now
          </button>
        </form>
      </div>
      <div class="h-100 p-5 bg-light border rounded-3" v-if="result">
        <h2>Order Details</h2>

        <div class="text-start">
          <p>Amount : {{ requestPrice.currencyAmount }} {{ selected_currency.symbol }}</p>

          <p>Coin : {{ requestPrice.cryptoAmount }} {{ selectCrypto.crypto }}</p>
        </div>

        <button type="submit" class="btn btn-primary me-3"
                @click="$router.push('/')">
          Back List
        </button>

      </div>
    </div>

  </div>
</template>

<script>
import axios from "axios";
import _ from "lodash"

export default {
  name: 'Calculate',
  data() {
    return {
      result: false,
      process: false,
      currencyInputdelay: null,
      cryptoInputdelay: null,
      orderDelay: null,
      validCurrencyAmount: {
        USD: {min: '30', max: '50000'},
        EUR: {min: '25', max: '50000'},
        GBP: {min: '20', max: '50000'},
      },
      alert: {status: false, message: ''},
      orderDelayAlert: {status: false, message: ''},
      requestPrice: {
        currencyAmount: null,
        cryptoAmount: null
      },
      validCurrencies: ['USD', 'EUR', 'GBP'],
      currencies: [],
      cryptoCurrencies: ['BTC'],
      selectCrypto: {
        crypto: 'BTC',
      },
      selected_currency: {
        symbol: ''
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    async getCurrencyToCrypto(currencyAmount, currencySymbol) {
      let url = "https://blockchain.info/tobtc?currency=" + currencySymbol + "&value=" + currencyAmount;
      return await axios.get(url);
    },
    async getCurrencies() {
      let url = "https://blockchain.info/ticker";
      return await axios.get(url);
    },
    selectCurrency(currency) {
      this.alert = {status: false, message: ''}
      this.requestPrice.currencyAmount = ''
      this.cryptoInputdelay();
      this.selected_currency = currency;
    },
    async init() {
      this.result = false;
      //Delays
      this.currencyInputdelay = _.debounce(() => this.inputCurrenyAmount(), 600)
      this.cryptoInputdelay = _.debounce(() => this.inputCryptoAmount(), 600)
      this.orderDelay = _.debounce(() => this.orderDelayInfo(), 10000)

      //Currencies
      let response = await this.getCurrencies();
      let currencyUri = this.$route.params.symbol

      this.validCurrencies.filter(item => this.currencies.push(response.data[item]));
      let validCurrency = this.currencies.find(item => item.symbol === currencyUri);
      this.selected_currency = validCurrency !== undefined ? validCurrency : this.currencies.find(item => item.symbol === 'USD')


      //Cookie Control
      let lastData = window.getCookie('lastData');

      if (lastData && lastData.currencyAmount) {
        this.requestPrice.currencyAmount = lastData.currencyAmount;
        this.currencyInputdelay()
      }

    },
    async inputCryptoAmount() {

      let selectedCurrency = this.selected_currency.symbol;
      let amount = parseFloat(this.requestPrice.cryptoAmount);

      this.warning(this.requestPrice.currencyAmount, selectedCurrency);

      let currencies = await this.getCurrencies();
      this.requestPrice.currencyAmount = (currencies.data[selectedCurrency].buy * amount)
      this.saveLastData();
      this.process = true;
    },
    async inputCurrenyAmount() {
      this.alert.status = false;

      let selectedCurrency = this.selected_currency.symbol;
      let amount = parseFloat(this.requestPrice.currencyAmount);

      this.warning(amount, selectedCurrency);

      let toBtc = await this.getCurrencyToCrypto(amount, selectedCurrency)

      this.requestPrice.cryptoAmount = toBtc.data
      this.saveLastData();
      this.process = true;
    },
    warning(amount, selectedCurrency) {

      let minValidAmount = parseFloat(this.validCurrencyAmount[selectedCurrency].min);
      let maxValidAmount = parseFloat(this.validCurrencyAmount[selectedCurrency].max);

      if (amount === null) return this.alert.status = false;

      if (maxValidAmount < amount) return this.alert = {
        status: true,
        message: 'Maximum Amount : ' + maxValidAmount + ' ' + selectedCurrency
      }

      if (minValidAmount > amount) return this.alert = {
        status: true,
        message: 'Minimum Amount : ' + minValidAmount + ' ' + selectedCurrency
      }
    },
    saveLastData() {
      this.orderDelayAlert.status = false;

      let selectedCurrency = this.selected_currency.symbol;
      let selectedCrypto = this.selectCrypto.crypto;
      let currencyAmount = parseFloat(this.requestPrice.currencyAmount);

      let lastData = {
        selectedCurrency, selectedCrypto, currencyAmount, buyButton: false
      }

      this.setCookie('lastData', lastData)
      this.orderDelay();

    },
    setCookie(name, val, expDay) {
      const d = new Date();
      d.setTime(d.getTime() + (expDay * 24 * 60 * 60 * 1000));
      let expires = "expires=" + d.toUTCString();
      document.cookie = name + "=" + JSON.stringify(val) + ";" + expires + ";path=/";
    },
    buyNow() {
      document.cookie = 'lastData=; Max-Age=-99999999;';
      this.result = true;
    },
    orderDelayInfo() {
      this.orderDelayAlert = {status: true, message: 'Amount information has been updated.'}
    }
  }
}
</script>
<style>

</style>