<script lang="ts">
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

  const randomEmoji = emoji[Math.floor(Math.random() * emoji.length)];
</script>

<div class="w-full h-full pointer-events-none">
  <h3 class="mt-[33%] text-center text-xl text-accent animate-[spin_3s_linear_infinite]">{randomEmoji}</h3>
</div>