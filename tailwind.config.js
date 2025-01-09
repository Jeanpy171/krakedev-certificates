const {nextui} = require('@nextui-org/theme');
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/components/(autocomplete|avatar|button|dropdown|input|navbar|ripple|spinner|form|listbox|divider|popover|scroll-shadow|menu).js"
  ],
  theme: {
    extend: {},
  },
  plugins: [nextui()],
}