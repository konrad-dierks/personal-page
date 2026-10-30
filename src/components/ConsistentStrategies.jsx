import Plot from "./LoadablePlot"
import React, { useState, useEffect } from "react"
import { computeConsistentStrategyData, h, CostFun } from "./Utils.js"
import Latex from "react-latex-next"
import "katex/dist/katex.min.css"
import usePrefersDark from "./usePrefersDark"

const ConsistentStrategies = () => {
  const emptyStrategyData = {
    x: [],
    y: [],
    scatter: { x: [], y: [] },
    lines: [],
  }

  const buildStrategyTraces = (
    plotData,
    name,
    color,
    legendGroup,
    useLineRendering
  ) => {
    const traces = [
      {
        x: [null],
        y: [null],
        type: "scatter",
        name,
        mode: "lines",
        line: { color, width: 2 },
        showlegend: true,
        legendgroup: legendGroup,
        hoverinfo: "skip",
      },
    ]

    if (!useLineRendering) {
      traces.push({
        x: plotData.x,
        y: plotData.y,
        type: "scatter",
        name,
        mode: "markers",
        marker: { size: 4, color },
        showlegend: false,
        legendgroup: legendGroup,
      })
      return traces
    }

    plotData.lines.forEach(line => {
      traces.push({
        x: line.x,
        y: line.y,
        type: "scatter",
        name,
        mode: "lines",
        line: { color, width: 2 },
        showlegend: false,
        legendgroup: legendGroup,
      })
    })

    if (plotData.scatter.x.length > 0) {
      traces.push({
        x: plotData.scatter.x,
        y: plotData.scatter.y,
        type: "scatter",
        name,
        mode: "markers",
        marker: { size: 2, color },
        showlegend: false,
        legendgroup: legendGroup,
      })
    }

    return traces
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
  const [isHorizontal, setIsHorizontal] = useState(
    typeof window === "undefined"
      ? true
      : window.innerWidth > window.innerHeight
  )
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

  const handleSliderChange = setter => e => {
    setter(parseFloat(e.target.value))
  }

  const rangeStyle = (value, min, max) => ({
    "--range-value": `${((value - min) / (max - min)) * 100}%`,
  })

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

  useEffect(() => {
    const handleResize = () => {
      if (typeof window === "undefined") {
        setIsHorizontal(true)
      } else {
        setIsHorizontal(window.innerWidth > window.innerHeight)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const containerStyle = {
    display: "flex",
    flexDirection: isHorizontal ? "row" : "column",
    height: "100%",
    width: "100%",
    padding: "0px",
  }

  const verticalStyle = {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    padding: "0px",
  }

  const threePlots = {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    height: isHorizontal ? "calc(var(--size-content) * 0.35)" : "35vw",
    padding: "0px",
  }

  const plotTitles = {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    height: "100%",
    padding: "0px",
  }

  const thirdStyle = {
    display: "flex",
    flexDirection: "column",
    width: "33%",
    height: "100%",
    padding: "0px",
  }

  const plotStyle = {
    display: "flex",
    flexDirection: "row",
    width: isHorizontal ? "70%" : "100%",
    height: isHorizontal ? "100%" : "70%",
    padding: "0px",
  }

  const plotTitle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    padding: "0px",
  }

  const controlsStyle = {
    display: "flex",
    flexDirection: "column",
    width: isHorizontal ? "30%" : "100%",
    height: isHorizontal ? "100%" : "auto",
    padding: "0px",
    boxSizing: "border-box",
  }

  const plotTheme = prefersDark
    ? {
        background: "#0f1113",
        text: "#f2f2f2",
        axisLine: "rgba(255, 255, 255, 0.35)",
        grid: "rgba(255, 255, 255, 0.12)",
        traceA: "#c77dff",
        traceB: "#7fd6c6",
        raw: "rgba(255, 255, 255, 0.18)",
        line: "#f2f2f2",
      }
    : {
        background: "#ffffff",
        text: "#333333",
        axisLine: "rgba(0, 0, 0, 0.25)",
        grid: "rgba(0, 0, 0, 0.12)",
        traceA: "#440154",
        traceB: "#2e8f7a",
        raw: "rgba(0, 0, 0, 0.12)",
        line: "#000000",
      }

  const axisBase = {
    automargin: true,
    tickfont: { color: plotTheme.text },
    linecolor: plotTheme.axisLine,
    gridcolor: plotTheme.grid,
    zerolinecolor: plotTheme.axisLine,
    title: {
      font: {
        size: 12,
        color: plotTheme.text,
      },
    },
  }

  const plotlyLayout = {
    margin: { t: 10, r: 10, b: 20, l: 20 },
    paper_bgcolor: plotTheme.background,
    plot_bgcolor: plotTheme.background,
    font: { color: plotTheme.text },
    xaxis: axisBase,
    yaxis: axisBase,
  }

  const plotlyLayout2 = {
    legend: isHorizontal
      ? { x: 1, y: 1, xanchor: "left", font: { color: plotTheme.text } }
      : {
          x: 1,
          xanchor: "right",
          y: 1,
          font: { color: plotTheme.text },
        },
    xaxis: {
      ...axisBase,
      range: [a0 - 0.0025 * av, a0 + 1.0025 * av],
      title: {
        ...axisBase.title,
        text: "a",
      },
    },
    yaxis: {
      ...axisBase,
      range: [b0 - 0.0025 * bv, b0 + 1.0025 * bv],
      title: {
        ...axisBase.title,
        text: "b",
      },
    },
    margin: { t: 10, r: 10, b: 20, l: 20 },
    paper_bgcolor: plotTheme.background,
    plot_bgcolor: plotTheme.background,
    font: { color: plotTheme.text },
  }

  const traces = [
    ...buildStrategyTraces(
      data,
      "A-consistent strategies",
      plotTheme.traceA,
      "Polynomial",
      showRefinedStrategies
    ),
    ...buildStrategyTraces(
      data2,
      "B-consistent strategies",
      plotTheme.traceB,
      "Polynomial 2",
      showRefinedStrategies
    ),
    {
      x: abline.x,
      y: abline.y,
      type: "scatter",
      name: "a=b",
      mode: "lines",
      line: { color: plotTheme.line, dash: "dash", width: 1 },
    },
  ]

  const benefitTrace = [
    {
      x: benefit.x,
      y: benefit.y,
      type: "scatter",
      name: "Benefit function",
      mode: "lines",
      marker: { size: 1, color: plotTheme.line },
      showlegend: false,
    },
  ]

  const costTrace = [
    {
      x: cost.x,
      y: cost.y,
      type: "scatter",
      name: "Cost function",
      mode: "lines",
      marker: { size: 1, color: plotTheme.line },
      showlegend: false,
    },
  ]

  const CDFTrace = [
    {
      x: CDF.x,
      y: CDF.y,
      type: "scatter",
      name: "CDF",
      mode: "lines",
      marker: { size: 1, color: plotTheme.line },
      showlegend: false,
    },
  ]

  return (
    <div style={verticalStyle}>
      <div style={containerStyle}>
        <div
          style={plotStyle}
          min-width="0"
          min-height="0"
          max-width="100%"
          max-height="100%"
        >
          <Plot
            data={traces}
            layout={plotlyLayout2}
            useResizeHandler={true}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
        <div style={controlsStyle}>
          <div>
            <h3>Adjust Parameters: </h3>
            <div className="slider-control">
              <div className="slider-label">
                <label htmlFor="m">
                  <Latex>$m$</Latex>:
                </label>
                <span className="slider-value">{m.toFixed(2)}</span>
              </div>
              <input
                type="range"
                id="m"
                min="0.01"
                max="100"
                step="0.01"
                value={m}
                style={rangeStyle(m, 0.01, 100)}
                onChange={handleSliderChange(setM)}
              />
            </div>
            <div className="slider-control">
              <div className="slider-label">
                <label htmlFor="k">
                  <Latex>$k$</Latex>:
                </label>
                <span className="slider-value">{k.toFixed(0)}</span>
              </div>
              <input
                type="range"
                id="k"
                min="1"
                max="10"
                step="1"
                value={k}
                style={rangeStyle(k, 1, 10)}
                onChange={handleSliderChange(setK)}
              />
            </div>
            <div className="slider-control">
              <div className="slider-label">
                <label htmlFor="kap">
                  <Latex>$\kappa$</Latex>:
                </label>
                <span className="slider-value">{kap.toFixed(2)}</span>
              </div>
              <input
                type="range"
                id="kap"
                min="0.01"
                max="1"
                step="0.01"
                value={kap}
                style={rangeStyle(kap, 0.01, 1)}
                onChange={handleSliderChange(setKap)}
              />
            </div>
            <div className="slider-control">
              <div className="slider-label">
                <label htmlFor="rho">
                  <Latex>$\rho$</Latex>:
                </label>
                <span className="slider-value">{rho.toFixed(2)}</span>
              </div>
              <input
                type="range"
                id="rho"
                min="0.01"
                max="10"
                step="0.01"
                value={rho}
                style={rangeStyle(rho, 0.01, 10)}
                onChange={handleSliderChange(setRho)}
              />
            </div>
            <div className="slider-control">
              <div className="slider-label">
                <label htmlFor="theA">
                  <Latex>$\theta_A$</Latex>:
                </label>
                <span className="slider-value">{theA.toFixed(2)}</span>
              </div>
              <input
                type="range"
                id="theA"
                min="0.01"
                max="10"
                step="0.01"
                value={theA}
                style={rangeStyle(theA, 0.01, 10)}
                onChange={handleSliderChange(setTheA)}
              />
            </div>
            <div className="slider-control">
              <div className="slider-label">
                <label htmlFor="theB">
                  <Latex>$\theta_B$</Latex>:
                </label>
                <span className="slider-value">{theB.toFixed(2)}</span>
              </div>
              <input
                type="range"
                id="theB"
                min="0.01"
                max="10"
                step="0.01"
                value={theB}
                style={rangeStyle(theB, 0.01, 10)}
                onChange={handleSliderChange(setTheB)}
              />
            </div>
            <div className="slider-control">
              <div className="slider-label">
                <label htmlFor="a0">
                  <Latex>$a_0$</Latex>:
                </label>
                <span className="slider-value">{a0.toFixed(2)}</span>
              </div>
              <input
                type="range"
                id="a0"
                min="0.01"
                max="2.0"
                step="0.01"
                value={a0}
                style={rangeStyle(a0, 0.01, 2.0)}
                onChange={handleSliderChange(setA0)}
              />
            </div>
            <div className="slider-control">
              <div className="slider-label">
                <label htmlFor="av">
                  <Latex>$a_v$</Latex>:
                </label>
                <span className="slider-value">{av.toFixed(2)}</span>
              </div>
              <input
                type="range"
                id="av"
                min="0.1"
                max="10"
                step="0.01"
                value={av}
                style={rangeStyle(av, 0.1, 10)}
                onChange={handleSliderChange(setAv)}
              />
            </div>
            <div className="slider-control">
              <div className="slider-label">
                <label htmlFor="b0">
                  <Latex>$b_0$</Latex>:
                </label>
                <span className="slider-value">{b0.toFixed(2)}</span>
              </div>
              <input
                type="range"
                id="b0"
                min="0.01"
                max="2.0"
                step="0.01"
                value={b0}
                style={rangeStyle(b0, 0.01, 2.0)}
                onChange={handleSliderChange(setB0)}
              />
            </div>
            <div className="slider-control">
              <div className="slider-label">
                <label htmlFor="bv">
                  <Latex>$b_v$</Latex>:
                </label>
                <span className="slider-value">{bv.toFixed(2)}</span>
              </div>
              <input
                type="range"
                id="bv"
                min="0.1"
                max="10"
                step="0.01"
                value={bv}
                style={rangeStyle(bv, 0.1, 10)}
                onChange={handleSliderChange(setBv)}
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        <h2>Explanations</h2>
        <p>
          <Latex>{`We plot $A$-consistent and $B$-consistent strategies for a range of parameters. The cost is described by the cumulative distribution functions \\[ F_A(x) = \\left(\\frac{x}{\\theta_A}\\right)^{1/k}\\quad \\text{ and }\\quad  F_B(x) = \\left(\\frac{x}{\\theta_B}\\right)^{1/k}. \\] Especially, for $k =1$, the cost is uniformly distributed on $[0, \\theta_A]$ and $[0,\\theta_B]$, respectively.`}</Latex>
        </p>
      </div>
      <div style={plotTitles}>
        <div style={plotTitle}>
          <h3>
            Benefit Function <Latex>$h(\alpha)$</Latex>
          </h3>
        </div>
        <div style={plotTitle}>
          <h3>
            Cost function <Latex>$C_A(a^i)$</Latex>{" "}
          </h3>
        </div>
        <div style={plotTitle}>
          <h3>
            CDF <Latex>$F_A(x)$</Latex>
          </h3>
        </div>
      </div>
      <div style={threePlots}>
        <div
          style={thirdStyle}
          min-width="0"
          min-height="0"
          max-width="100%"
          max-height="100%"
        >
          <Plot
            data={benefitTrace}
            layout={plotlyLayout}
            useResizeHandler={true}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
        <div
          style={thirdStyle}
          min-width="0"
          min-height="0"
          max-width="100%"
          max-height="100%"
        >
          <Plot
            data={costTrace}
            layout={plotlyLayout}
            useResizeHandler={true}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
        <div
          style={thirdStyle}
          min-width="0"
          min-height="0"
          max-width="100%"
          max-height="100%"
        >
          <Plot
            data={CDFTrace}
            layout={plotlyLayout}
            useResizeHandler={true}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </div>
    </div>
  )
}

export default ConsistentStrategies
