import loadable from "@loadable/component"

// react-plotly.js imports the full Plotly bundle by default. The plots only
// use scatter traces, so the much smaller basic bundle is enough.
const Plot = loadable(async () => {
  const [{ default: createPlotlyComponent }, { default: Plotly }] =
    await Promise.all([
      import("react-plotly.js/factory"),
      import("plotly.js-basic-dist-min"),
    ])
  return { default: createPlotlyComponent(Plotly) }
})

export default Plot
