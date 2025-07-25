// module.exports = {
//   content: [
//     "./src/**/*.{js,jsx,ts,tsx}",
//     "./public/index.html",
//   ],
//   theme: {
//     extend: {
//         fontFamily: {
//              'outfit': ['Outfit', 'sans-serif'], 
//       }
//     },
//   },
//   plugins: [],
// }


/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    darkMode: "class",
    theme: {
        extend: {
        fontFamily: {
        // sans: ['Roboto', 'sans-serif'],
        sans: ['Outfit', 'sans-serif'],
      },
        },
    },
    plugins: [],
};