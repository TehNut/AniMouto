<template>
  <div class="error-container">
    <div class="error">
      <span style="font-size:32px;">{{ getRandomEmoji() }}</span>
      <br/>
      <slot>
        <span>Oopsy doopsy</span>
      </slot>
    </div>
  </div>
</template>

<script>
  const emoji = [
    "(＃`Д´)",
    "ヽ(`⌒´メ)ノ",
    "ヽ( `д´*)ノ",
    "୧((#Φ益Φ#))୨",
    "٩(ఠ益ఠ)۶",
    "(╬ Ò﹏Ó)",
    "(ノ_<。)",
    "(｡╯︵╰｡)",
    "(-ω-、)",
    "(｡T ω T｡)",
    "＼(º □ º l|l)/",
    "[ ± _ ± ]"
  ];

  export default {
    name: "Error",
    methods: {
      getRandomEmoji() {
        return emoji[Math.floor(Math.random() * emoji.length)];
      }
    }
  }
</script>

<style scoped>
  .error-container {
    width: 100%;
    height: auto;
    display: flex;
    flex-flow: row;
    justify-content: center;
  }

  .error {
    position: absolute;
    top: 35%;
    text-align: center;
    color: rgb(var(--color-red));
  }
</style>
