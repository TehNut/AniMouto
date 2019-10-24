<template>
  <div class="star-container">
    <div v-for="(value, index) in stars">
      <span
        :class="`material-icons star ${value.hovered || value.forced ? 'hovered' : ''}`"
        @mouseenter="starHover(index)"
        @mouseleave="starHover(-1)"
        @click="starClick(index)"
      >star</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: "RatingStar",
    data() {
      return {
        stars: [ /* Populated below */ ],
        selectedIndex: null
      }
    },
    methods: {
      starHover(index) {
        for (let i = 0; i < this.stars.length; i++)
          this.stars[i].hovered = i <= index;
      },
      starClick(index) {
        this.selectedIndex = index;
        for (let i = 0; i < this.stars.length; i++)
          this.stars[i].forced = i <= index;

        this.$emit("updateScore", index + 1);
      }
    },
    created() {
      for (let i = 0; i < 5; i++)
        this.stars.push({ hovered: false, forced: false });
    }
  }
</script>

<style scoped>
  .star-container {
    display: flex;
    justify-content: space-evenly;
  }

  .star {
    font-size: x-large;
    color: rgb(var(--color-text-light));
    transition: .2s;
    cursor: pointer;
  }

  .hovered {
    color: rgb(var(--color-accent));
  }
</style>
