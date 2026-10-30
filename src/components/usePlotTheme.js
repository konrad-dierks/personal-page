import usePrefersDark from "./usePrefersDark"

const darkColors = {
  text: "#f2f2f2",
  axisLine: "rgba(255, 255, 255, 0.35)",
  grid: "rgba(255, 255, 255, 0.12)",
  traceA: "#c77dff",
  traceB: "#7fd6c6",
  line: "#f2f2f2",
}

const lightColors = {
  text: "#333333",
  axisLine: "rgba(0, 0, 0, 0.25)",
  grid: "rgba(0, 0, 0, 0.12)",
  traceA: "#440154",
  traceB: "#2e8f7a",
  line: "#000000",
}

// Colours and Chart.js axis settings shared by the interactive plots
const usePlotTheme = () => {
  const colors = usePrefersDark() ? darkColors : lightColors

  const axis = (title, range = {}) => ({
    ...range,
    // Only round tick values; forced ticks at odd min and max values crowd
    // out the round ones next to them
    ticks: { color: colors.text, includeBounds: false },
    border: { color: colors.axisLine },
    grid: {
      color: context =>
        context.tick?.value === 0 ? colors.axisLine : colors.grid,
    },
    ...(title && { title: { display: true, text: title, color: colors.text } }),
  })

  const legend = { position: "top", labels: { color: colors.text } }

  return { colors, axis, legend }
}

export default usePlotTheme
