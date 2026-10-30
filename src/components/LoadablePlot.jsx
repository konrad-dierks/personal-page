import { useEffect, useRef, useState } from "react"

let chartPromise

// Chart.js is only loaded in the browser, when a plot is first shown. Only
// the parts needed for line plots with numeric axes are registered.
const loadChart = () => {
  chartPromise ??= import("chart.js").then(
    ({
      Chart,
      LineController,
      LineElement,
      PointElement,
      LinearScale,
      Legend,
      Tooltip,
    }) => {
      Chart.register(
        LineController,
        LineElement,
        PointElement,
        LinearScale,
        Legend,
        Tooltip
      )
      const bodyStyle = getComputedStyle(document.body)
      Chart.defaults.font.family = bodyStyle.fontFamily
      // All plot text a bit smaller than the body text
      Chart.defaults.font.size = Math.round(
        Number.parseFloat(bodyStyle.fontSize) * 0.85
      )
      return Chart
    }
  )
  return chartPromise
}

export const toPoints = (x, y) => x.map((xi, i) => ({ x: xi, y: y[i] }))

const formatNumber = value => Number(value.toFixed(3))

// Datasets sharing a label form one legend entry, which shows or hides them
// all. The hidden labels survive data updates, e.g. while moving a slider.
const applyHidden = (chart, hiddenLabels) => {
  chart.data.datasets.forEach((dataset, index) => {
    chart.getDatasetMeta(index).hidden = hiddenLabels.has(dataset.label)
      ? true
      : null
  })
}

// One legend entry per label, drawn as a short line in the line style of the
// label's first dataset. Datasets drawn as points carry a borderWidth for this.
const generateLabels = chart => {
  const { color } = chart.legend.options.labels
  return chart.data.datasets.flatMap((dataset, index, datasets) =>
    datasets.findIndex(d => d.label === dataset.label) === index
      ? [
          {
            text: dataset.label,
            datasetIndex: index,
            hidden: !chart.isDatasetVisible(index),
            fontColor: color,
            fillStyle: dataset.borderColor,
            strokeStyle: dataset.borderColor,
            lineWidth: dataset.borderWidth,
            lineDash: dataset.borderDash ?? [],
            pointStyle: "line",
          },
        ]
      : []
  )
}

const buildOptions = (options, hiddenLabels) => ({
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  interaction: { mode: "nearest", intersect: false },
  // Without tension, Chart.js snaps line points to whole pixels horizontally,
  // which draws steep curves as staircases. Tension needs a line chart, as
  // scatter charts do not compute the curve control points.
  elements: { line: { tension: 0.0001 } },
  ...options,
  scales: {
    ...options.scales,
    x: { type: "linear", ...options.scales?.x },
  },
  plugins: {
    ...options.plugins,
    legend: {
      ...options.plugins?.legend,
      labels: {
        usePointStyle: true,
        pointStyleWidth: 30,
        ...options.plugins?.legend?.labels,
        generateLabels,
      },
      onClick: (event, item, legend) => {
        const chart = legend.chart
        if (hiddenLabels.has(item.text)) {
          hiddenLabels.delete(item.text)
        } else {
          hiddenLabels.add(item.text)
        }
        applyHidden(chart, hiddenLabels)
        chart.update("none")
      },
    },
    tooltip: {
      ...options.plugins?.tooltip,
      callbacks: {
        label: context =>
          `${context.dataset.label}: (${formatNumber(context.parsed.x)}, ${formatNumber(context.parsed.y)})`,
      },
    },
  },
})

const Plot = ({ data, options, className, label }) => {
  const canvasRef = useRef(null)
  const chartRef = useRef(null)
  const hiddenLabels = useRef(new Set())
  const latest = useRef({ data, options })
  const [loaded, setLoaded] = useState(false)
  latest.current = { data, options }

  useEffect(() => {
    let mounted = true
    loadChart().then(Chart => {
      if (!mounted) {
        return
      }
      chartRef.current = new Chart(canvasRef.current, {
        type: "line",
        data: latest.current.data,
        options: buildOptions(latest.current.options, hiddenLabels.current),
      })
      applyHidden(chartRef.current, hiddenLabels.current)
      chartRef.current.update("none")
      setLoaded(true)
    })
    return () => {
      mounted = false
      chartRef.current?.destroy()
      chartRef.current = null
    }
  }, [])

  useEffect(() => {
    const chart = chartRef.current
    if (!chart) {
      return
    }
    chart.data = data
    chart.options = buildOptions(options, hiddenLabels.current)
    applyHidden(chart, hiddenLabels.current)
    chart.update("none")
  }, [data, options])

  // The canvas is taken out of the flow so that it never props up the size
  // of its container, which would keep the plot from shrinking
  return (
    <div className={className} style={{ position: "relative", minWidth: 0 }}>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={label}
        style={{ position: "absolute", inset: 0 }}
      />
      {!loaded && (
        <div
          className="loading-placeholder"
          style={{ position: "absolute", inset: 0 }}
        >
          Loading plot…
        </div>
      )}
    </div>
  )
}

export default Plot
