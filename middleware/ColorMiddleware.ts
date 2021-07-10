import { Middleware } from '@nuxt/types'
import { GetSiteSettings } from '../graphql/query/site-settings/GetSiteSettings'

// @ts-ignore
const ColorMiddleware: Middleware = async ({ app, $vuetify }) => {
  const { data } = await app.apolloProvider.defaultClient.query({
    query: GetSiteSettings,
  })
  const {
    isDark,
    darkPrimary,
    darkSecondary,
    darkAccent,
    lightPrimary,
    lightSecondary,
    lightAccent,
  } = data.GetSiteSettings

  $vuetify.theme.dark = isDark

  $vuetify.theme.themes.dark = {
    ...$vuetify.theme.themes.dark,
    primary: darkPrimary,
    secondary: darkSecondary,
    accent: darkAccent,
  }

  $vuetify.theme.themes.light = {
    ...$vuetify.theme.themes.light,
    primary: lightPrimary,
    secondary: lightSecondary,
    accent: lightAccent,
  }
}

export default ColorMiddleware
