import Plot, { toPoints } from "./LoadablePlot"
import { useEffect, useMemo, useRef, useState } from "react"
import { computeConsistentStrategyData, h, CostFun } from "./Utils.js"
import Latex from "react-latex-next"
import "katex/dist/katex.min.css"
import usePlotTheme from "./usePlotTheme"
import SliderControl from "./SliderControl"

const emptyStrategyData = {
  x: [],
  y: [],
  scatter: { x: [], y: [] },
  lines: [],
}

const linspace = (start, end, count) =>
  Array.from(
    { length: count },
    (_, i) => start + ((end - start) * i) / (count - 1)
  )

// All datasets of one kind share a label, so they form one legend entry
const buildStrategyDatasets = (plotData, label, color, useLineRendering) => {
  const markers = (points, radius) => ({
    label,
    data: points,
    showLine: false,
    backgroundColor: color,
    borderColor: color,
    pointRadius: radius,
    pointBorderWidth: 0,
    // Only drawn as the legend line
    borderWidth: 2,
  })

  if (!useLineRendering) {
    return [markers(toPoints(plotData.x, plotData.y), 2)]
  }

  const datasets = plotData.lines.map(line => ({
    label,
    data: toPoints(line.x, line.y),
    borderColor: color,
    backgroundColor: color,
    borderWidth: 2,
    pointRadius: 0,
  }))

  if (plotData.scatter.x.length > 0) {
    datasets.push(markers(toPoints(plotData.scatter.x, plotData.scatter.y), 1))
  }

  return datasets
}

const ConsistentStrategies = () => {
  const [m, setM] = useState(1)
  const [theA, setTheA] = useState(1)
  const [theB, setTheB] = useState(1)
  const [rho, setRho] = useState(2)
  const [k, setK] = useState(1)
  const [kap, setKap] = useState(0.5)
  const [a0, setA0] = useState(1)
  const [av, setAv] = useState(1)
  const [b0, setB0] = useState(0.6)
  const [bv, setBv] = useState(0.6)
  const [data, setData] = useState(emptyStrategyData)
  const [data2, setData2] = useState(emptyStrategyData)
  const [showRefinedStrategies, setShowRefinedStrategies] = useState(false)
  const { colors, axis, legend } = usePlotTheme()
  const workerRef = useRef(null)
  const requestId = useRef(0)

  // The refined strategies can take a few hundred milliseconds on slow
  // devices, so they are computed in a worker to keep the page responsive
  useEffect(() => {
    const worker = new Worker(new URL("./strategyWorker.js", import.meta.url), {
      type: "module",
    })
    worker.onmessage = ({ data: result }) => {
      // Results for parameters that have changed since are dropped
      if (result.id === requestId.current) {
        setData(result.data)
        setData2(result.data2)
        setShowRefinedStrategies(true)
      }
    }
    workerRef.current = worker
    return () => worker.terminate()
  }, [])

  // A coarse pass right away, and a refined one once the parameters have
  // stayed the same for 200 ms
  useEffect(() => {
    const params = { m, theA, theB, rho, kap, k, a0, av, b0, bv }
    const id = ++requestId.current
    const coarseData = computeConsistentStrategyData({
      ...params,
      resolution: 30,
    })
    setData(coarseData.data)
    setData2(coarseData.data2)
    setShowRefinedStrategies(false)

    const timeoutId = setTimeout(() => {
      workerRef.current?.postMessage({
        id,
        params: { ...params, resolution: 1000 },
      })
    }, 200)
    return () => clearTimeout(timeoutId)
  }, [m, theA, theB, rho, kap, k, a0, av, b0, bv])

  const abline = useMemo(() => {
    const x = [Math.max(a0, b0), Math.min(a0 + av, b0 + bv)]
    return { x, y: x }
  }, [a0, av, b0, bv])

  const benefit = useMemo(() => {
    const x = linspace(-1, 1, 200)
    return { x, y: x.map(alpha => h(alpha, m)) }
  }, [m])

  const cost = useMemo(() => {
    const x = linspace(a0, a0 + av, 200)
    return { x, y: x.map(a => CostFun(theA, a0, a, av, k)) }
  }, [a0, av, theA, k])

  const CDF = useMemo(() => {
    const x = linspace(0, theA, 200)
    return { x, y: x.map(value => (value / theA) ** (1 / k)) }
  }, [theA, k])

  const smallChartOptions = {
    plugins: { legend: { display: false } },
    scales: { x: axis(), y: axis() },
  }

  const strategyChartOptions = {
    plugins: { legend },
    scales: {
      x: axis("a", { min: a0 - 0.0025 * av, max: a0 + 1.0025 * av }),
      y: axis("b", { min: b0 - 0.0025 * bv, max: b0 + 1.0025 * bv }),
    },
  }

  const strategyChartData = {
    datasets: [
      ...buildStrategyDatasets(
        data,
        "A-consistent strategies",
        colors.traceA,
        showRefinedStrategies
      ),
      ...buildStrategyDatasets(
        data2,
        "B-consistent strategies",
        colors.traceB,
        showRefinedStrategies
      ),
      {
        label: "a=b",
        data: toPoints(abline.x, abline.y),
        borderColor: colors.line,
        backgroundColor: colors.line,
        borderWidth: 1,
        borderDash: [6, 4],
        pointRadius: 0,
      },
    ],
  }

  const singleLineData = (label, { x, y }) => ({
    datasets: [
      {
        label,
        data: toPoints(x, y),
        borderColor: colors.line,
        backgroundColor: colors.line,
        borderWidth: 2,
        pointRadius: 0,
      },
    ],
  })

  const benefitChartData = singleLineData("Benefit function", benefit)
  const costChartData = singleLineData("Cost function", cost)
  const CDFChartData = singleLineData("CDF", CDF)

  return (
    <div className="plot-page">
      <div className="plot-layout">
        <div className="plot-main">
          <Plot
            data={strategyChartData}
            options={strategyChartOptions}
            className="plot-main-chart"
            label="Plot of the A-consistent and B-consistent strategies in the (a, b) plane, with the diagonal a = b"
          />
        </div>
        <div className="plot-controls">
          <div>
            <h3>Adjust Parameters: </h3>
            <SliderControl
              id="m"
              label="m"
              value={m}
              min={0.01}
              max={100}
              step={0.01}
              log1pArrowSteps
              onChange={setM}
            />
            <SliderControl
              id="k"
              label="k"
              value={k}
              min={1}
              max={10}
              step={1}
              onChange={setK}
            />
            <SliderControl
              id="kap"
              label="\kappa"
              value={kap}
              min={0.01}
              max={1}
              step={0.01}
              onChange={setKap}
            />
            <SliderControl
              id="rho"
              label="\rho"
              value={rho}
              min={0.01}
              max={10}
              step={0.01}
              onChange={setRho}
            />
            <SliderControl
              id="theA"
              label="\theta_A"
              value={theA}
              min={0.01}
              max={10}
              step={0.01}
              onChange={setTheA}
            />
            <SliderControl
              id="theB"
              label="\theta_B"
              value={theB}
              min={0.01}
              max={10}
              step={0.01}
              onChange={setTheB}
            />
            <SliderControl
              id="a0"
              label="a_0"
              value={a0}
              min={0.01}
              max={2}
              step={0.01}
              log1pArrowSteps
              onChange={setA0}
            />
            <SliderControl
              id="av"
              label="a_v"
              value={av}
              min={0.1}
              max={10}
              step={0.01}
              log1pArrowSteps
              onChange={setAv}
            />
            <SliderControl
              id="b0"
              label="b_0"
              value={b0}
              min={0.01}
              max={2}
              step={0.01}
              log1pArrowSteps
              onChange={setB0}
            />
            <SliderControl
              id="bv"
              label="b_v"
              value={bv}
              min={0.1}
              max={10}
              step={0.01}
              log1pArrowSteps
              onChange={setBv}
            />
          </div>
        </div>
      </div>
      <div>
        <h2>Explanations</h2>
        <p>
          <Latex>{`We plot $A$-consistent and $B$-consistent strategies for a range of parameters. The cost is described by the cumulative distribution functions \\[ F_A(x) = \\left(\\frac{x}{\\theta_A}\\right)^{1/k}\\quad \\text{ and }\\quad  F_B(x) = \\left(\\frac{x}{\\theta_B}\\right)^{1/k}. \\] Especially, for $k =1$, the cost is uniformly distributed on $[0, \\theta_A]$ and $[0,\\theta_B]$, respectively.`}</Latex>
        </p>
      </div>
      <div className="small-plots">
        <div className="small-plot">
          <div className="small-plot-title">
            <h3>
              Benefit Function <Latex>$h(\alpha)$</Latex>
            </h3>
          </div>
          <Plot
            data={benefitChartData}
            options={smallChartOptions}
            className="small-plot-chart"
            label="Plot of the benefit function h(α) for α from −1 to 1"
          />
        </div>
        <div className="small-plot">
          <div className="small-plot-title">
            <h3>
              Cost function <Latex>$C_A(a^i)$</Latex>
            </h3>
          </div>
          <Plot
            data={costChartData}
            options={smallChartOptions}
            className="small-plot-chart"
            label="Plot of the cost function C_A(aⁱ) for aⁱ from a₀ to a₀ + a_v"
          />
        </div>
        <div className="small-plot">
          <div className="small-plot-title">
            <h3>
              CDF <Latex>$F_A(x)$</Latex>
            </h3>
          </div>
          <Plot
            data={CDFChartData}
            options={smallChartOptions}
            className="small-plot-chart"
            label="Plot of the cost distribution function F_A(x) for x from 0 to θ_A"
          />
        </div>
      </div>
    </div>
  )
}

export default ConsistentStrategies
