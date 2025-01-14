const {nextui} = require('@nextui-org/theme');
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/components/(autocomplete|avatar|button|chip|dropdown|input|modal|navbar|spinner|table|tabs|popover|ripple|form|listbox|divider|scroll-shadow|menu|checkbox|spacer).js"
  ],
  theme: {
    extend: {},
  },
  plugins: [nextui()],
}