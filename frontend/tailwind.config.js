/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit', // Enable JIT mode
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: true,
  theme: {
    extend: {
      //Colors
      colors: {
      
        // Primary
        "magenta-050": "#F5E1F7",
        "magenta-100": "#ECBDF2",
        "magenta-200": "#CE80D9",
        "magenta-300": "#BB61C7",
        "magenta-400": "#AD4BB8",
        "magenta-500": "#A23DAD",
        "magenta-600": "#90279C",
        "magenta-700": "#7C1A87",
        "magenta-800": "#671270",
        "magenta-900": "#4E0754",  

        "orange-vivid-050": "#FFE8D9",
        "orange-vivid-100": "#FFD0B5",
        "orange-vivid-200": "#FFB088",
        "orange-vivid-300": "#FF9466",
        "orange-vivid-400": "#F9703E",
        "orange-vivid-500": "#F35627",
        "orange-vivid-600": "#DE3A11",
        "orange-vivid-700": "#C52707",
        "orange-vivid-800": "#AD1D07",
        "orange-vivid-900": "#841003",  

        // Neutrals
        "blue-grey-050": "#F0F4F8",
        "blue-grey-100": "#D9E2EC",
        "blue-grey-200": "#BCCCDC",
        "blue-grey-300": "#9FB3C8",
        "blue-grey-400": "#829AB1",
        "blue-grey-500": "#627D98",
        "blue-grey-600": "#486581",
        "blue-grey-700": "#334E68",
        "blue-grey-800": "#243B53",
        "blue-grey-900": "#102A43",  

        // Supporting
        "yellow-vivid-050": "#FFFBEA",
        "yellow-vivid-100": "#FFF3C4",
        "yellow-vivid-200": "#FCE588",
        "yellow-vivid-300": "#FADB5F",
        "yellow-vivid-400": "#F7C948",
        "yellow-vivid-500": "#F0B429",
        "yellow-vivid-600": "#DE911D",
        "yellow-vivid-700": "#CB6E17",
        "yellow-vivid-800": "#B44D12",
        "yellow-vivid-900": "#8D2B0B",  

        "red-vivid-050": "#FFE3E3",
        "red-vivid-100": "#FFBDBD",
        "red-vivid-200": "#FF9B9B",
        "red-vivid-300": "#F86A6A",
        "red-vivid-400": "#EF4E4E",
        "red-vivid-500": "#E12D39",
        "red-vivid-600": "#CF1124",
        "red-vivid-700": "#AB091E",
        "red-vivid-800": "#8A041A",
        "red-vivid-900": "#610316",  

        "green-vivid-050": "#E3F9E5",
        "green-vivid-100": "#C1F2C7",
        "green-vivid-200": "#91E697",
        "green-vivid-300": "#51CA58",
        "green-vivid-400": "#31B237",
        "green-vivid-500": "#18981D",
        "green-vivid-600": "#0F8613",
        "green-vivid-700": "#0E7817",
        "green-vivid-800": "#07600E",
        "green-vivid-900": "#014807",  
      },
      //Animations
      animation: {
        notify: "notify 6s ease-in-out",
        blobTwo: "blobTwo 15s infinite",
        buttonAnimation: "btn 1s linear",
        startTalk: "startTalk 2s infinite"
      },
      //Keyframes
      keyframes: {
        notify: {
          "0%": {
            transform: "translate(-50%, 1000px)"
          },
          "40%": {
            transform: "translate(-50%, 475px)"
          },
          "60%": {
            transform: "translate(-50%, 475px)"
          },
          "100%": {
            transform: "translate(-50%, 1000px)"
          }
        },
        blobTwo: {
          "0%": {
            transform: "scale(1) translate(0%, 0%)"
          },
          "33%": {
            transform: "scale(1.5) translate(-50%, 50%)"
          },
          "66%": {
            transform: "scale(0.5) translate(-25%, 25%)"
          },
          "100%": {
            transform: "scale(1) translate(0%, 0%)"
          }
        },
        btn: {
          "0%": {
            transform: "scale(1)"
          },
          "100%":{
            transform: "scale(1.1)"
          }
        },
        startTalk: {
          "0%": {
            transform: "translate(0px, 0px)"
          },
          "50%":{
            transform: "translate(0px, 10px)"
          },
          "100%": {
            transform: "translate(0px, 0px)"
          }
        }
      },
      //Font(s)
      fontFamily: {
        'poppin': ['Poppins', 'sans-serif'],
        'roboto': ['Roboto', 'sans-serif'],
        'dancing': ['Dancing Script', 'cursive'],
        'open': ['Open Sans', 'sans-serif']
      },
    },
    
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@headlessui/tailwindcss')({ prefix: 'ui' })
  ],
};