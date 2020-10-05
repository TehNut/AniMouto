<template>
  <div class="spinner-wrapper">
    <div class="spinner">
      {{ randomEmoji() }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

const emoji = [
  "(づ｡◕‿‿◕｡)づ",
  "(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧",
  "(~˘▾˘)~",
  "~(˘▾˘~)",
  "(｡◕‿◕｡)",
  "(ﾉ>ω<)ﾉ :｡･:*:･ﾟ’★,｡･:*:･ﾟ’☆",
  "(ノ°∀°)ノ⌒･*:.｡. .｡.:*･゜ﾟ･*☆",
  "✺◟( • ω • )◞✺",
  "(~‾▽‾)~",
  "ଘ(੭ˊᵕˋ)੭* ੈ✩‧₊˚",
  "∠( ᐛ 」∠)＿",
  "☆⌒(ゝ。∂)",
  "(づ ◕‿◕ )づ",
  "ヾ(^ω^*)",
  "(⁄ ⁄•⁄ω⁄•⁄ ⁄)",
  "(⁄ ⁄>⁄ ▽ ⁄<⁄ ⁄)",
  "☆⌒ヽ(*'､^*)chu",
  "☆*:.｡.o(≧▽≦)o.｡.:*☆",
  "°˖✧◝(⁰▿⁰)◜✧˖°"
];

@Component
export default class Loader extends Vue {
  randomEmoji() {
    return emoji[Math.floor(Math.random() * emoji.length)];
  }
}
</script>

<style>
.spinner-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  width: 100%;
  margin: auto;
  margin-top: 20%;
}

.spinner {
  font-size: 24px;
  color: rgb(var(--color-accent));
  
  animation-duration: 3s;
  animation-timing-function: linear;
  animation-delay: 0s;
  animation-iteration-count: infinite;
  animation-direction: normal;
  animation-fill-mode: none;
  animation-play-state: running;
  animation-name: spin;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(359deg);
  }
}
</style>