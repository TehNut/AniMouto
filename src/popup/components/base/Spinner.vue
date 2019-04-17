<template>
  <div class="loading-container">
    <div class="spinner">{{ emoji }}</div>
  </div>
</template>

<script>
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

  export default {
    name: "Spinner",
    data() {
      return {
        emoji: getRandomEmoji()
      }
    }
  }

  function getRandomEmoji() {
    return emoji[Math.floor(Math.random() * emoji.length)];
  }
</script>

<style>
  .loading-container {
    width: 100%;
    height: auto;
    display: flex;
    flex-flow: row;
    justify-content: center;
  }

  .spinner {
    position: absolute;
    top: 35%;
    color: rgb(var(--color-accent));
    font-size: 24px;
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
