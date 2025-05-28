import { defineConfig } from 'vite'
import tsc from 'vite-tsconfig-paths'

export default defineConfig({
    plugins: [tsc()],
    publicDir: 'resources',
    base: '/greenrally/'
})
