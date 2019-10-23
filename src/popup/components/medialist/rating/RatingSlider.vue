<template>
  <div class="slider-rating">
    <div class="slider-container">
      <input
        class="slider"
        type="range"
        min="0"
        :max="format === 'POINT_100' ? '100' : '10'"
        ref="input"
        :step="format === 'POINT_10_DECIMAL' ? '.1' : '1'"
        value="0"
        v-model="score"
      />
    </div>
    <span class="highlight score">{{ score }}</span>
  </div>
</template>

<script>
  export default {
    name: "RatingSlider",
    data() {
      return {
        score: 0
      }
    },
    props: [
      "format"
    ],
    watch: {
      score: function (val, oldVal) {
        this.$emit('updateScore', val);
      }
    }
  }
</script>

<style scoped>
  .slider-rating {
    display: flex;
    margin: auto;
    height: 50px;
    flex-flow: column;
    justify-content: space-between;
  }

  .slider-container {
    width: 100%;
  }

  .slider:hover {
    opacity: 1;
  }

  .slider {
    -webkit-appearance: none;
    width: 100%;
    height: 10px;
    border-radius: 5px;
    background-color: rgb(var(--color-foreground));
    outline: none;
    opacity: 0.7;
    -webkit-transition: .2s;
    transition: opacity .2s;
  }

  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: rgb(var(--color-accent));
    cursor: pointer;
  }

  .slider::-moz-range-thumb {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: rgb(var(--color-accent));
    cursor: pointer;
  }

  .score {
    text-align: center;
    font-size: large;
  }
</style>
