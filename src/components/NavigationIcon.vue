<template>
  <fa-icon @click="changePage()" :icon="icon" :class="{ icon: true }" />
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { Getter } from 'vuex-class';

@Component
export default class NavigationIcon extends Vue {
  @Prop()
  page!: string;

  @Prop()
  icon!: string;

  @Getter("user/loggedIn")
  loggedIn!: boolean;

  changePage() {
    if (!this.loggedIn)
      return;

    this.$router.push(this.page).catch(e => {});
    this.$store.dispatch("root/changePage", this.page)
  }
}
</script>

<style>
.icon {
  cursor: pointer;
  padding: 3px 13px 3px 13px;
  margin-bottom: 4px;
  color: rgb(var(--color-text));
  width: 100%;
  font-size: 20px;
  transition: .3s;
}

.icon:hover {
  color: rgb(var(--color-accent));
}
</style>