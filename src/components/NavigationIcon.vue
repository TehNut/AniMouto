<template>
  <div class="navigator-container">
    <fa-icon @click="changePage()" :icon="icon" :class="{ icon: true }" />
    <slot/>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { Action, Getter } from 'vuex-class';

@Component
export default class NavigationIcon extends Vue {
  @Prop()
  page!: string;

  @Prop()
  icon!: string;

  @Getter("user/loggedIn")
  loggedIn!: boolean;

  @Action("root/changePage")
  changePageAction!: Function;

  changePage() {
    console.log(this.loggedIn);
    if (!this.loggedIn)
      return;

    this.$router.push(this.page).catch(e => {});
    this.changePageAction(this.page);
  }
}
</script>

<style>
.navigator-container {
  position: relative;
}

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

.overlay {
  position: absolute;
}
</style>