<template>
  <div>
<!--    <AccountSection @update-theme="$emit('update-theme')"/>-->
<!--    <ThemeSection @update-theme="$emit('update-theme')"/>-->
<!--    <ListSection/>-->
<!--    <NotificationSection/>-->
    <SimpleConfig :config="getExample()"/>
  </div>
</template>

<script>
  import ThemeSection from "./section/ThemeSection";
  import AccountSection from "./section/AccountSection";
  import NotificationSection from "./section/NotificationSection";
  import ListSection from "./section/ListSection";
  import SimpleConfig from "../base/SimpleConfig";

  export default {
    name: "Settings",
    components: {SimpleConfig, ListSection, NotificationSection, AccountSection, ThemeSection},
    methods: {
      getExample() {
        return {
          notifications: {
            title: "Notifications",
            options: [
              {
                title: "Timed Check",
                description: "Whether or not AniMouto should regularly check for new notifications in the background.",
                defaultValue: true,
              },
              {
                title: "Check Interval",
                description: "The amount of time <span class='highlight'>in minutes</span> between checks for new notifications.",
                tag: "Minute(s)",
                defaultValue: 1
              },
              {
                title: "Desktop Notifications",
                description: "Allow AniMouto to send desktop notifications when a new notification is found.",
                defaultValue: false
              },
              {
                title: "Hide Like Notifications",
                description: "Hides like notifications from both the notifications page as well as in desktop notifications.",
                tag: "Hide likes",
                defaultValue: false
              },
              {
                title: "Condense Notifications",
                description: "Condense similar notifications into a single entry.",
                defaultValue: true
              },
            ]
          }
        };
      }
    }
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
