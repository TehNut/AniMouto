import { browser } from "webextension-polyfill-ts";
import decode from "jwt-decode";
import gql from "graphql-tag";
import { Module, VuexModule, MutationAction } from "vuex-module-decorators";
import { AniListUser } from '@/models/User';
import { print } from "graphql/language/printer";
import ApolloClient from 'apollo-boost';

@Module({
  namespaced: true
})
export default class UserModule extends VuexModule {
  _token: string | null = null;
  _user: AniListUser = new AniListUser();

  @MutationAction({ mutate: [ "_token", "_user" ] })
  async load() {
    const storage = await browser.storage.local.get();
    let user;
    if (storage.token) {
      user = (await getUser(storage.token)).data.Viewer;
    } else {
      user = new AniListUser();
    }
    return { 
      _token: storage.token || null,
      _user: user
    };
  }

  @MutationAction({ mutate: [ "_user" ] })
  async updateUser() {
    return { _user: this._token ? await getUser(this._token) : new AniListUser() }
  }

  get token(): string | null {
    return this._token;
  }

  get user(): AniListUser {
    return this._user;
  }

  get loggedIn(): boolean {
    if (!this._token)
      return false;

    const { exp } = decode(this._token);
    return exp - Math.floor(Date.now() / 1000) >= 0;
  }

  @MutationAction({ mutate: [ "_token", "_user" ] })
  async login(app: Vue) {
    try {
      const token = await browser.runtime.sendMessage("START_AUTH");

      // Fix apollo client headers
      app.$apolloProvider.defaultClient = new ApolloClient({
        uri: "https://graphql.anilist.co",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      await browser.storage.local.set({ token });

      const user = await getUser(token);
      return { 
        _token: token,
        _user: user.data.Viewer
      };
    } catch (err) {
      throw err;
    }
  }
}

async function getUser(token: string): Promise<any> {
  const res = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: {
      Accept: "application/json",
      'Content-Type': "application/json",
      'Authorization': token
    },
    body: JSON.stringify({
      query: print(gql`
        {
          Viewer {
            id
            name
            siteUrl
            avatar {
              large
            }
          }
        }
      `)
    })
  })
  return res.json();
}