import Plot, { toPoints } from "./LoadablePlot"
import React, { useState, useEffect } from "react"
import { computeConsistentStrategyData, h, CostFun } from "./Utils.js"
import Latex from "react-latex-next"
import "katex/dist/katex.min.css"
import usePrefersDark from "./usePrefersDark"
import SliderControl from "./SliderControl"

const ConsistentStrategies = () => {
  const emptyStrategyData = {
    x: [],
    y: [],
    scatter: { x: [], y: [] },
    lines: [],
  }

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
      datasets.push(
        markers(toPoints(plotData.scatter.x, plotData.scatter.y), 1)
      )
    }

    return datasets
  }

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
  const [abline, setAbline] = useState({ x: [], y: [] })
  const [benefit, setBenefit] = useState({ x: [], y: [] })
  const [cost, setCost] = useState({ x: [], y: [] })
  const [CDF, setCDF] = useState({ x: [], y: [] })
  const prefersDark = usePrefersDark()

  useEffect(() => {
    const makeabline = () => {
      const x = [Math.max(a0, b0), Math.min(a0 + av, b0 + bv)]

      setAbline({ x, y: x })
    }
    makeabline()
  }, [a0, av, b0, bv])

  useEffect(() => {
    const coarseData = computeConsistentStrategyData({
      m,
      theA,
      theB,
      rho,
      kap,
      k,
      a0,
      av,
      b0,
      bv,
      resolution: 30,
    })

    setData(coarseData.data)
    setData2(coarseData.data2)
    setShowRefinedStrategies(false)

    const timeoutId = setTimeout(() => {
      const refinedData = computeConsistentStrategyData({
        m,
        theA,
        theB,
        rho,
        kap,
        k,
        a0,
        av,
        b0,
        bv,
        resolution: 1000,
      })

      setData(refinedData.data)
      setData2(refinedData.data2)
      setShowRefinedStrategies(true)
    }, 200)

    return () => clearTimeout(timeoutId)
  }, [m, theA, kap, a0, av, b0, bv, theB, rho, k])

  useEffect(() => {
    const calculateBenefit = () => {
      const alphavec = Array.from({ length: 200 }, (_, i) => -1 + (i * 2) / 199)
      const benefit = alphavec.map(alpha => h(alpha, m))

      setBenefit({ x: alphavec, y: benefit })
    }
    calculateBenefit()
  }, [m])

  useEffect(() => {
    const calculateCostFunction = () => {
      const Avec = Array.from({ length: 200 }, (_, i) => a0 + (i * av) / 199)

      const cost = Avec.map(a => CostFun(theA, a0, a, av, k))

      setCost({ x: Avec, y: cost })
    }

    calculateCostFunction()
  }, [a0, av, theA, k])

  useEffect(() => {
    const calculateCostCDF = () => {
      const xVec = Array.from({ length: 200 }, (_, i) => (i * theA) / 199)

      const cdf = xVec.map(x => Math.pow(x / theA, 1 / k))

      setCDF({ x: xVec, y: cdf })
    }
    calculateCostCDF()
  }, [theA, k])

  const plotTheme = prefersDark
    ? {
        text: "#f2f2f2",
        axisLine: "rgba(255, 255, 255, 0.35)",
        grid: "rgba(255, 255, 255, 0.12)",
        traceA: "#c77dff",
        traceB: "#7fd6c6",
        line: "#f2f2f2",
      }
    : {
        text: "#333333",
        axisLine: "rgba(0, 0, 0, 0.25)",
        grid: "rgba(0, 0, 0, 0.12)",
        traceA: "#440154",
        traceB: "#2e8f7a",
        line: "#000000",
      }

  const axisOptions = {
    ticks: { color: plotTheme.text },
    border: { color: plotTheme.axisLine },
    grid: {
      color: context =>
        context.tick?.value === 0 ? plotTheme.axisLine : plotTheme.grid,
    },
  }

  const axisTitle = text => ({
    display: true,
    text,
    color: plotTheme.text,
    font: { size: 12 },
  })

  const smallChartOptions = {
    plugins: { legend: { display: false } },
    scales: { x: axisOptions, y: axisOptions },
  }

  const strategyChartOptions = {
    plugins: {
      legend: { position: "top", labels: { color: plotTheme.text } },
    },
    scales: {
      x: {
        ...axisOptions,
        min: a0 - 0.0025 * av,
        max: a0 + 1.0025 * av,
        title: axisTitle("a"),
      },
      y: {
        ...axisOptions,
        min: b0 - 0.0025 * bv,
        max: b0 + 1.0025 * bv,
        title: axisTitle("b"),
      },
    },
  }

  const strategyChartData = {
    datasets: [
      ...buildStrategyDatasets(
        data,
        "A-consistent strategies",
        plotTheme.traceA,
        showRefinedStrategies
      ),
      ...buildStrategyDatasets(
        data2,
        "B-consistent strategies",
        plotTheme.traceB,
        showRefinedStrategies
      ),
      {
        label: "a=b",
        data: toPoints(abline.x, abline.y),
        borderColor: plotTheme.line,
        backgroundColor: plotTheme.line,
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
        borderColor: plotTheme.line,
        backgroundColor: plotTheme.line,
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
              onChange={setA0}
            />
            <SliderControl
              id="av"
              label="a_v"
              value={av}
              min={0.1}
              max={10}
              step={0.01}
              onChange={setAv}
            />
            <SliderControl
              id="b0"
              label="b_0"
              value={b0}
              min={0.01}
              max={2}
              step={0.01}
              onChange={setB0}
            />
            <SliderControl
              id="bv"
              label="b_v"
              value={bv}
              min={0.1}
              max={10}
              step={0.01}
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
          />
        </div>
      </div>
    </div>
  )
}

export default ConsistentStrategies
