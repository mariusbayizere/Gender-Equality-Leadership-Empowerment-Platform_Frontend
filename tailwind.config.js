
// /** @type {import('tailwindcss').Config} */
// export default {
//     content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
//     darkMode: "class",
//     theme: {
//         extend: {
//         fontFamily: {
//         // sans: ['Roboto', 'sans-serif'],
//         sans: ['Outfit', 'sans-serif'],
//       },
//         },
//     },
//     plugins: [],
// };


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
            keyframes: {
                slideIn: {
                    'from': {
                        transform: 'translateX(100%)',
                        opacity: '0',
                    },
                    'to': {
                        transform: 'translateX(0)',
                        opacity: '1',
                    },
                }
            },
            animation: {
                'slide-in': 'slideIn 0.3s ease-out',
            }
        },
    },
    plugins: [],
};