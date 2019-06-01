<template>
  <div>

  </div>
</template>

<script>
  export default {
    name: "CondensedNotifications",
    data() {
      return {
        parsed: {}
      }
    },
    props: [
      "notifications"
    ],
    created() {
      this.notifications.forEach(notification => {
        switch (notification.type) {
          case "": {

          }
        }
      });
    }
  }
</script>

<style scoped>

</style>
