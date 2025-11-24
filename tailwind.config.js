/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "features/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        foreground: {
          DEFAULT: "var(--foreground)",
        },
        background: {
          DEFAULT: "var(--background)",
        },
        "background-nuance": {
          DEFAULT: "var(--background-nuance)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
        },
        gray: {
          DEFAULT: "var(--gray)",
        },
        "gray-darker": {
          DEFAULT: "var(--gray-darker)",
        },
        input: {
          DEFAULT: "var(--input)",
        },
        primary: {
          DEFAULT: "var(--primary)",
        },
        yellow: {
          DEFAULT: "var(--yellow)",
        },
        green: {
          DEFAULT: "var(--green)",
        },
      },
      borderRadius: {
        app: "32px",
      },
      spacing: {
        "link-height": "56px",
        "custom-height": "62px",
      },
      fontFamily: {
        euclid_light: ["EuclidCircularBLight", "sans-serif"],
        euclid_light_italic: ["EuclidCircularBLightItalic", "sans-serif"],
        euclid_regular: ["EuclidCircularBRegular", "sans-serif"],
        euclid_medium: ["EuclidCircularBMedium", "sans-serif"],
        euclid_medium_italic: ["EuclidCircularBMediumItalic", "sans-serif"],
        euclid_semibold: ["EuclidCircularBSemiBold", "sans-serif"],
        euclid_semibold_italic: ["EuclidCircularBSemiBoldItalic", "sans-serif"],
        euclid_bold: ["EuclidCircularBBold", "sans-serif"],
        euclid_bold_italic: ["EuclidCircularBBoldItalic", "sans-serif"],
      },
      boxShadow: {
        list_shadow:
          "0 3px 5px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      },
    },
  },
  plugins: [],
};
