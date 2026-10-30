import { useEffect, useState } from "react"

let plotPromise

// react-plotly.js imports the full Plotly bundle by default. The plots only
// use scatter traces, so the much smaller basic bundle is enough. Plotly
// touches window on import, so it is only loaded in the browser.
const loadPlot = () => {
  plotPromise ??= Promise.all([
    import("react-plotly.js/factory"),
    import("plotly.js-basic-dist-min"),
  ]).then(([{ default: createPlotlyComponent }, { default: Plotly }]) =>
    createPlotlyComponent(Plotly)
  )
  return plotPromise
}

const Plot = props => {
  const [PlotComponent, setPlotComponent] = useState(null)

  useEffect(() => {
    let mounted = true
    loadPlot().then(Component => {
      if (mounted) {
        setPlotComponent(() => Component)
      }
    })
    return () => {
      mounted = false
    }
  }, [])

  return PlotComponent ? <PlotComponent {...props} /> : null
}

export default Plot
