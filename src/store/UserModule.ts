import { browser } from "webextension-polyfill-ts";
import decode, { JwtPayload } from "jwt-decode";
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
    let cached: boolean = false;
    if (storage.token) {
      if (storage.cachedUser) {
        user = storage.cachedUser;
      } else {
        user = (await getUser(storage.token)).data.Viewer;
        await browser.storage.local.set({ cachedUser: user });
      }
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
    // @ts-ignore
    return { _user: this.state?._token ? (await getUser(this.state?._token)).data.Viewer : new AniListUser() }
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

    const { exp } = decode<JwtPayload>(this._token);
    return exp ? exp - Math.floor(Date.now() / 1000) >= 0 : false;
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

  @MutationAction({ mutate: [ "_token", "_user" ] })
  async logout() {
    await browser.storage.local.remove([ "token", "cachedUser" ]);

    return {
      _token: null,
      _user: new AniListUser()
    };
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
  });
  return res.json();
}