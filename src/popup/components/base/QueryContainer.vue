<template>
  <div>
    <Spinner v-if="!response && !error"/>
    <Error v-if="error">
      {{ errorText }}
    </Error>
    <slot scope="response" v-if="response" :response="response"></slot>
  </div>
</template>

<script>
  import Spinner from "./Spinner";
  import Error from "./Error";
  export default {
    name: "QueryContainer",
    components: {Error, Spinner},
    data() {
      return {
        response: null,
        error: false
      }
    },
    props: {
      query: {
        type: Function // Must return a promise
      },
      errorText: {
        type: String
      }
    },
    created() {
      const _self = this;
      this.query().then(res => _self.response = res).catch(err => _self.error = true);
    }
  }
</script>
