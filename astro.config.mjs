import solid from '@astrojs/solid-js'
import deno from '@astrojs/deno'
import { defineConfig } from 'astro/config'
import Unocss from 'unocss/vite'

// https://astro.build/config
export default defineConfig({
  adapter: deno(),
  integrations: [solid()],
  vite: {
    plugins: [Unocss()],
  },
})
