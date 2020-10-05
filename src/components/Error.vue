<template>
  <div class="error-wrapper">
    <div class="error">
      <h1>{{ randomEmoji() }}</h1>
      <slot>
        <span>Oops!</span>
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

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

@Component
export default class Error extends Vue {
  randomEmoji() {
    return emoji[Math.floor(Math.random() * emoji.length)];
  }
}
</script>

<style>
.error-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  width: 100%;
  margin: auto;
  margin-top: 20%;
}

.error {
  display: flex;
  flex-flow: column;
  align-items: center;
  font-size: 24px;
  color: rgb(var(--color-red));
}

.error h1 {
  font-size: 32px;
  margin-bottom: 8px;
}
</style>