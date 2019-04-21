<template>
  <div>
    <AccountSection/>
    <ThemeSection @update-theme="$emit('update-theme')"/>
    <NotificationSection v-if="false"/>
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
