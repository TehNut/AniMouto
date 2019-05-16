<template>
  <div>
    <transition name="fade">
      <Spinner v-if="!response && !error"/>
    </transition>
    <transition name="fade">
      <Error v-if="error">
        {{ errorText }}
      </Error>
    </transition>
    <transition name="fade">
      <slot scope="response" v-if="response" :response="response"/>
    </transition>
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
      responsifier: {
        type: Function
      },
      errorText: {
        type: String
      }
    },
    methods: {
      runQuery() {
        // First clear out any prior data in case of a refresh
        this.reset();

        const _self = this;
        this.query().then(res => _self.response = this.responsifier ? this.responsifier(res) : res).catch(err => {
          _self.error = true;
          console.log(err);
        });
      },
      reset() {
        this.response = null;
        this.error = false;
      }
    },
    created() {
      this.runQuery();
    }
  }
</script>
