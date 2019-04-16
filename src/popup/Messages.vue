<script>
  import {updateUser} from "../assets/js/utils";

  export default {
    name: "Messages",
    data () {
      return {}
    },
    created() {
      const _self = this;
      chrome.runtime.onMessage.addListener((message, sender, response) => {
        if (message.type === "update_user")
          updateUser();

        if (message.type === "update_notifications")
          _self.$emit("update-notifications", message.notification_count);

        if (message.type === "change_page")
          _self.$router.push(message.page);

        // if (message.type === "display_toast")
        //   displayToast(message.toast);
      });
    }
  }
</script>
