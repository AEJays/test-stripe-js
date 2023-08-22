<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <form @submit="handleSubmit">
      <div id="payment-element"></div>
      <button type="submit">提交</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios'
import {loadStripe} from '@stripe/stripe-js'

export default {
  name: 'App',
  components: {
  },
  data(){
    return {
      elements: undefined,
      stripe: undefined
    }
  },
  created(){
    this.createPayment()
  },
  methods: {
    createPayment(){
      let xToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVVUlEIjoiNWNhZmJkOTUtODZkNS00YTk3LTlkMTEtZmMxMDg5ZTc1ZDkwIiwiSUQiOjIwNjE4LCJVc2VybmFtZSI6Im9EN3AwNml4MEhPbWRxaG4zMVZTa0ZacnhFVTQiLCJOaWNrTmFtZSI6Im5GYzVxb0ZhIiwiQXV0aG9yaXR5SWQiOjAsIlR5cGUiOiJhcGlINSIsIkJ1ZmZlclRpbWUiOjg2NDAwLCJleHAiOjE2OTMyMTI0NDIsImlzcyI6InFtUGx1cyIsIm5iZiI6MTY5MjYwNjY0Mn0.zuUXDVFQVAt0BErDhHC9neiA7OYYgLJKVl2kptnE9f4'
      let that = this
      axios({
        url:'/apih5/token/stripe/createOrder',
        method: 'POST',
        headers: {
          'x-Token':xToken
        },
        data: {
          'comboId':5,
          source: 'tools'
        }
      }).then(async(response)=>{
        this.stripe = await loadStripe('pk_test_51NdSF6LBNBYskEsuX2IUZK8GVmtR78DDYqJRGV5e7gjki9iBVBGDIrsuwCX806Tmo1JCkrsgJVy32U8L8WXD35P300D2Trj1Zh')
        console.log(response,"response");
        let data =  response.data.data
        let clientSecret = data.clientSecret
        console.log(that.stripe);
        that.elements = that.stripe.elements({
          theme: 'stripe',
          clientSecret,
          locale: 'auto'
        })
        const paymentElement = that.elements.create('payment')
        paymentElement.mount('#payment-element')
        paymentElement.on('change',(event)=>{
          console.log(event,"EVENT");
        })
        let sumbit = await that.elements.fetchUpdates()
      console.log(sumbit);
      }).catch(err=>{
        console.log(err,"error");
      })
    },
    async handleSubmit(e){
      console.log(e);
      e.preventDefault();
      let elements = this.elements
      let stripe = this.stripe
      console.log(elements);
      let stripeMes = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // return_url: 'http://localhost:8080'
        },
        redirect: 'if_required'
      })
      console.log('stripe', stripeMes)
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
