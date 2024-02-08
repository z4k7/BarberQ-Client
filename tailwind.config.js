

import withMT from "@material-tailwind/html/utils/withMT";
 
/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = withMT({
  content: [
    
    "./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js"
  ],
  darkMode: 'class',
  theme: {
    
  },
  plugins: [
    // eslint-disable-next-line no-undef
    require('flowbite/plugin'),
    // eslint-disable-next-line no-undef
    require("daisyui")
  ],
});  