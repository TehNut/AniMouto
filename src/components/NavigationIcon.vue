<template>
  <div class="navigator-container">
    <fa-icon @click="doChangePage()" :icon="icon" :class="{ icon: true }" />
    <slot/>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { Action, Getter, namespace } from 'vuex-class';

const root = namespace("root");
const user = namespace("user");

@Component
export default class NavigationIcon extends Vue {
  @Prop()
  page!: string;

  @Prop()
  icon!: string;

  @user.Getter
  loggedIn!: boolean;

  @root.Action
  changePage!: Function;

  doChangePage() {
    if (!this.loggedIn)
      return;

    this.$router.push(this.page).catch(e => {});
    this.changePage(this.page);
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