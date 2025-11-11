import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base colors
        background: "var(--background)",
        foreground: "var(--foreground)",
        
        // Brand colors from Figma
        brand: {
          primary: "#57007B",
          secondary: "#F76680",
          tertiary: "#FF92AE",
          success: "#66CB9F",
          warning: "#F7936F",
          danger: "#F16063",
          info: "#68DBF2",
          dark: "#16192C",
        },
        
        // Gray scale from Figma
        gray: {
          50: "#FAFAFA",
          100: "#F7FAFC",
          200: "#EDF2F7",
          300: "#E2E8F0",
          400: "#CBD5E0",
          500: "#A0AEC0",
          600: "#718096",
          700: "#4A5568",
          800: "#2D3748",
          900: "#1A202C",
        },
        
        // Shade colors (light versions)
        shade: {
          primary: "#E7DAED",
          secondary: "#FFE7EB",
          tertiary: "#FFADBA",
          success: "#E0FFEF",
          warning: "#FFEFE8",
          danger: "#F68E87",
          info: "#E3FCFF",
          dark: "#505780",
          light: "#F9F9FF",
        },
      },
      
      // Typography from Figma
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
      
      fontSize: {
        // Display sizes
        "display-1": ["53px", { lineHeight: "1.34", fontWeight: "800" }],
        "display-2": ["64px", { lineHeight: "1.21", fontWeight: "700" }],
        "display-3": ["56px", { lineHeight: "1.21", fontWeight: "700" }],
        "display-4": ["48px", { lineHeight: "1.21", fontWeight: "700" }],
        "display-5": ["40px", { lineHeight: "1.21", fontWeight: "700" }],
        
        // Headings
        "h1": ["35px", { lineHeight: "1.57", fontWeight: "700" }],
        "h2": ["35px", { lineHeight: "1.57", fontWeight: "700" }],
        "h3": ["28px", { lineHeight: "1.36", fontWeight: "600" }],
        "h4": ["20px", { lineHeight: "1.37", fontWeight: "600" }],
        "h5": ["18px", { lineHeight: "1.21", fontWeight: "700", letterSpacing: "-0.5%" }],
        "h6": ["16px", { lineHeight: "1.56", fontWeight: "500" }],
        
        // Paragraphs
        "para-lg": ["18px", { lineHeight: "2", fontWeight: "400" }],
        "para-base": ["14px", { lineHeight: "1.62", fontWeight: "400" }],
        
        // Utility text
        "text-xl": ["28px", { lineHeight: "1.36", fontWeight: "400" }],
        "text-lg": ["20px", { lineHeight: "1.36", fontWeight: "400" }],
        "text-sm": ["14px", { lineHeight: "1.64", fontWeight: "400" }],
        "text-xs": ["12px", { lineHeight: "1.67", fontWeight: "400" }],
        
        // Special
        "caption": ["12px", { lineHeight: "1.21", fontWeight: "700" }],
        "surtitle": ["14px", { lineHeight: "1.21", fontWeight: "600" }],
      },
      
      // Box shadows from Figma
      boxShadow: {
        "nav": "0px 4px 40px rgba(0, 0, 0, 0.1)",
        "card": "0px 4px 30px rgba(0, 0, 0, 0.1)",
        "card-lite": "0px 4px 30px rgba(0, 0, 0, 0.05)",
        "btn": "0px 4px 49px rgba(0, 0, 0, 0.15)",
      },
      
      // Border radius
      borderRadius: {
        "card": "7px",
        "button": "5px",
      },
    },
  },
  plugins: [],
} satisfies Config;




