module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      // Adding custom keyframes for animations
      keyframes: {
        moveRight: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(200px)' }, // Moves selected icon right
        },
        rotateCircle: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }, // Rotate icons
        },
      },
      // Define animation properties using keyframes
      animation: {
        moveRight: 'moveRight 1s forwards', 
        rotateCircle: 'rotateCircle 1s infinite',
      },
    },
  },
  plugins: [],
};
