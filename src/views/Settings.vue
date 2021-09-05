<template>
  <div class="settings-container">
    <Section :title="$t('settings.account.title')">
      <div class="flex-settings col">
        <i18n path="settings.account.logged_in_as" tag="span" class="text-h2">
          <a :href="`https://anilist.co/user/${user.id}`" target="_blank">{{ user.name }}</a>
        </i18n>
        <span>{{ $t("settings.account.token_expiration", { date: new Date(decoded.exp * 1000).toLocaleDateString() }) }}</span>
        <div class="flex-settings row">
          <Button :text="$t('settings.account.btn_update_user')" @click="updateUser()"/>
          <Button :text="$t('settings.account.btn_logout')" color="rgb(var(--color-red))" @click="logout(this)"/>
        </div>
        <br>
        <i18n path="settings.account.revoke_reminder" tag="span">
          <a href="https://anilist.co/settings/apps" target="_blank" class="text-error">{{ $t("settings.account.revoke_reminder_link") }}</a>
        </i18n>
      </div>
    </Section>
    <Section :title="$t('settings.theme.title')">
      <span class="text-title text-h2">{{ $t('settings.theme.primary_colors') }}</span>
      <div class="flex-settings row spacer">
        <div
          v-for="theme in themes" 
          :key="theme.name"
          class="theme-preview" 
          :style="{ backgroundColor: theme.background, color: theme.color }" 
          @click="changeAndSave(() => changeTheme(theme.name))"
        >{{ $t('settings.theme.theme_preview') }}</div>
      </div>
      <span class="text-title text-h2">{{ $t('settings.theme.accent_color') }}</span>
      <div class="flex-settings row spacer">
        <div
          v-for="accent in accents"
          :key="accent"
          :style="{ backgroundColor: `rgb(var(--color-${accent})` }"
          class="accent-button"
          @click="changeAndSave(() => changeAccent(accent))"
        />
      </div>
      <Checkbox :value="wide" @change="e => changeAndSave(() => setWide(!e))">
        {{ $t('settings.theme.wide') }}
      </Checkbox>
    </Section>
    <Section :title="$t('settings.notifications.title')">
      <div class="flex-settings col spacer">
        <Checkbox :value="enablePolling" @change="e => changeAndSaveNotification(() => setPollingEnabled(!e))">
          {{ $t("settings.notifications.enable_polling") }}
        </Checkbox>
      </div>
      <div class="flex-settings col spacer">
        <TextInput
          :label="$t('settings.notifications.polling_interval')"
          :min="1"
          :value="pollingInterval"
          @change="e => changeAndSaveNotification(() => setPollingInterval(e))"
        />
        <br/>
        <span>{{ $t("settings.notifications.polling_interval_desc") }}</span>
      </div>
      <div class="flex-settings col spacer">
        <Checkbox :value="desktopNotifications" @change="e => handleDesktopToggle(!e)">
          {{ $t("settings.notifications.desktop_notifications") }}
        </Checkbox>
      </div>
    </Section>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import browser from "webextension-polyfill";
import decode, { JwtPayload } from "jwt-decode";
import Section from "@/components/Section.vue";
import Tooltip from "@/components/Tooltip.vue";
import Checkbox from "@/components/form/Checkbox.vue";
import TextInput from "@/components/form/TextInput.vue";
import Button from "@/components/Button.vue";
import { namespace } from "vuex-class";
import { Settings as SettingsObj } from "@/models/Settings";
import { AniListUser } from "@/models/User";

const user = namespace("user");
const settings = namespace("settings");
const root = namespace("root");

type Theme = {
  name: string;
  background: string;
  color: string;
}

@Component({
  components: {
    Checkbox,
    Section,
    Tooltip,
    Button,
    TextInput
  }
})
export default class Settings extends Vue {
  @user.Getter
  user!: AniListUser;

  @user.Getter
  token!: string;

  @user.Action
  updateUser!: () => void;

  @user.Action("logout")
  logoutAction!: () => void;

  @settings.Getter
  theme!: string;

  @settings.Getter
  accent!: string;

  @settings.Getter
  wide!: boolean;

  @settings.Getter
  enablePolling!: boolean;

  @settings.Getter
  pollingInterval!: number;

  @settings.Getter
  desktopNotifications!: boolean;

  @settings.Mutation
  changeTheme!: (theme: string) => void;

  @settings.Mutation
  changeAccent!: (accent: string) => void;

  @settings.Mutation
  setWide!: (wide: boolean) => void;

  @settings.Mutation
  setPollingEnabled!: (enabled: boolean) => void;

  @settings.Mutation
  setPollingInterval!: (interval: number) => void;

  @settings.Mutation
  setDesktopNotifications!: (enabled: boolean) => void;

  @settings.Action
  save!: () => void;

  @root.Action
  changePage!: (page: string) => void;

  decoded!: JwtPayload;

  themes: Theme[] = [
    {             
      name: "light",
      background: "rgb(237, 241, 245)",
      color: "rgb(92, 114, 138)"
    },
    {
      name: "dark",
      background: "rgb(39, 44, 56)",
      color: "rgb(159, 173, 189)"
    },
    {
      name: "contrast-dark",
      background: "rgb(11, 22, 34)",
      color: "rgb(159,173,189)"
    },
    {
      name: "contrast",
      background: "rgb(214, 224, 239)",
      color: "rgb(0, 0, 0)"
    }
  ];

  accents: string[] = [
    "blue",
    "red",
    "blue-dim",
    "peach",
    "orange",
    "yellow",
    "green",
    "purple",
    "pink"
  ];

  changeAndSave(runner: () => void) {
    runner();
    this.save();
  }

  async changeAndSaveNotification(runner: () => void) {
    this.changeAndSave(runner);
    await browser.runtime.sendMessage("RESET_ALARMS")
  }

  async logout() {
    await this.logoutAction();
    await this.changePage("login")
    this.$router.push("login").catch(e => {});
  }

  async handleDesktopToggle(enabled: boolean) {
    if (enabled && !(await browser.permissions.contains({ permissions: [ "notifications"] })))
      enabled = await browser.permissions.request({ permissions: [ "notifications" ] });

    this.changeAndSaveNotification(() => this.setDesktopNotifications(enabled));
  }

  created() {
    this.decoded = decode(this.token);
  }
}
</script>

<style>
.theme-preview {
  cursor: pointer;
  margin-right: 10px;
  width: 30px;
  height: 30px;
  text-indent: 3px;
  font-size: 1.2rem;
  border: solid 3px rgba(var(--color-accent), .8);
}

.flex-settings {
  display: flex;
  flex-wrap: wrap;
}

.flex-settings.row {
  flex-flow: row;
}

.flex-settings.col {
  flex-flow: column;
}

.flex-settings.spacer {
  padding: 10px 0;
}

.option {
  padding: 10px 0;
}

.accent-button {
  border-radius: 5px;
  border: 2px solid rgb(var(--color-background));
  width: 20px;
  height: 20px;
  cursor: pointer;
  transition: .1s;
}

.accent-button:hover {
  border-radius: 50%;
  border: 2px solid rgb(var(--color-text-light));
}
</style>