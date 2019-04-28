<template>
  <div>
    <AccountSection/>
    <ThemeSection @update-theme="$emit('update-theme')"/>
    <NotificationSection/>
  </div>
</template>

<script>
  import ThemeSection from "./section/ThemeSection";
  import AccountSection from "./section/AccountSection";
  import NotificationSection from "./section/NotificationSection";

  export default {
    name: "Settings",
    components: {NotificationSection, AccountSection, ThemeSection},
  }
</script>

<style>
  .settings-text-input {
    background-color: rgb(var(--color-background));
    width: 50px;
    margin-left: 0;
    margin-right: 5px;
    display: unset;
  }

  .settings-text-input-label {
    font-size: 14px;
    align-self: center;
  }
</style>
