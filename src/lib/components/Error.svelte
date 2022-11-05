<script lang="ts">
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

  const randomEmoji = emoji[Math.floor(Math.random() * emoji.length)];

  export let text: string;
  export let warning: boolean = false;
</script>

<div class="w-full h-full items-center justify-center text-center {warning ? "text-orange" : "text-red"} pointer-events-none">
  <h3 class="mt-[33%] text-xl">{randomEmoji}</h3>
  <span class="text-sm font-medium">{text}</span>
</div>