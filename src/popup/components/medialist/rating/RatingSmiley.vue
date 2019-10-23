<template>
  <div class="smiley-container">
    <span class="smiley" ref="happy" @click="select('happy')">
      <svg class="happy" viewBox="0 0 496 512" xmlns="http://www.w3.org/2000/svg">
        <path d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 448c-110.3 0-200-89.7-200-200S137.7 56 248 56s200 89.7 200 200-89.7 200-200 200zm-80-216c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm4 72.6c-20.8 25-51.5 39.4-84 39.4s-63.2-14.3-84-39.4c-8.5-10.2-23.7-11.5-33.8-3.1-10.2 8.5-11.5 23.6-3.1 33.8 30 36 74.1 56.6 120.9 56.6s90.9-20.6 120.9-56.6c8.5-10.2 7.1-25.3-3.1-33.8-10.1-8.4-25.3-7.1-33.8 3.1z" fill="currentColor"/>
      </svg>
    </span>
    <span class="smiley" ref="neutral"  @click="select('neutral')">
      <svg class="neutral" viewBox="0 0 496 512" xmlns="http://www.w3.org/2000/svg">
        <path d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 448c-110.3 0-200-89.7-200-200S137.7 56 248 56s200 89.7 200 200-89.7 200-200 200zm-80-216c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm160-64c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32zm8 144H160c-13.2 0-24 10.8-24 24s10.8 24 24 24h176c13.2 0 24-10.8 24-24s-10.8-24-24-24z" fill="currentColor"/>
      </svg>
    </span>
    <span class="smiley" ref="sad" @click="select('sad')">
      <svg class="sad" viewBox="0 0 496 512" xmlns="http://www.w3.org/2000/svg">
        <path d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 448c-110.3 0-200-89.7-200-200S137.7 56 248 56s200 89.7 200 200-89.7 200-200 200zm-80-216c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm160-64c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32zm-80 128c-40.2 0-78 17.7-103.8 48.6-8.5 10.2-7.1 25.3 3.1 33.8 10.2 8.4 25.3 7.1 33.8-3.1 16.6-19.9 41-31.4 66.9-31.4s50.3 11.4 66.9 31.4c8.1 9.7 23.1 11.9 33.8 3.1 10.2-8.5 11.5-23.6 3.1-33.8C326 321.7 288.2 304 248 304z" fill="currentColor"/>
      </svg>
    </span>
  </div>
</template>

<script>
  export default {
    name: "RatingSmiley",
    data() {
      return {
        selected: null
      }
    },
    methods: {
      select(rating) {
        const color = rating === "happy" ? "green" : rating === "sad" ? "red" : "orange";
        if (this.selected)
          this.$refs[this.selected].removeAttribute("style");

        this.$refs[rating].setAttribute("style", `color:rgb(var(--color-${color})) !important;`);
        this.selected = rating;
        this.$emit("updateScore", rating === "happy" ? 3 : rating === "sad" ? 1 : 2);
      }
    }
  }
</script>

<style scoped>
  .smiley-container {
    display: flex;
    justify-content: space-evenly;
  }

  .smiley {
    width: 50px;
    color: rgb(var(--color-text-light));
    transition: .2s;
    cursor: pointer;
  }

  .happy, .neutral, .sad {
    transition: .2s;
  }

  .happy:hover {
    color: rgba(var(--color-green), 0.5);
  }

  .neutral:hover {
    color: rgba(var(--color-orange), 0.5);
  }

  .sad:hover {
    color: rgba(var(--color-red), 0.5);
  }
</style>
