import Plot from "./LoadablePlot.js"
import React, { useState, useEffect } from "react"
import { h, h_gamma } from "./Utils.js"
import Latex from "react-latex-next"
import "katex/dist/katex.min.css"
import usePrefersDark from "./usePrefersDark"

const ConsistentStrategies = () => {
  const [m, setM] = useState(1)
  const [gamma, setGamma] = useState(1)
  const [isHorizontal, setIsHorizontal] = useState(
    typeof window === "undefined"
      ? true
      : window.innerWidth > window.innerHeight
  )
  const [mData, setmData] = useState({ x: [], y: [] })
  const [gammaData, setGammaData] = useState({ x: [], y: [] })
  const prefersDark = usePrefersDark()

  useEffect(() => {
    const make_h_m = () => {
      const x_vec = Array.from({ length: 300 }, (_, i) => -1 + (i * 2) / 299)
      const y_vec = x_vec.map(x => h(x, m))
      setmData({ x: x_vec, y: y_vec })
    }
    make_h_m()
  }, [m])

  useEffect(() => {
    const make_h_gamma = () => {
      const x_vec = Array.from({ length: 300 }, (_, i) => -1 + (i * 2) / 299)
      const y_vec = x_vec.map(x => h_gamma(x, gamma))
      setGammaData({ x: x_vec, y: y_vec })
    }
    make_h_gamma()
  }, [gamma])

  const handleSliderChange = setter => e => {
    setter(parseFloat(e.target.value))
  }

  const rangeStyle = (value, min, max) => ({
    "--range-value": `${((value - min) / (max - min)) * 100}%`,
  })

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

  const verticalContainerStyle = {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "100%",
    padding: "0px",
  }
  const containerStyle = {
    display: "flex",
    flexDirection: isHorizontal ? "row" : "column",
    height: "100%",
    width: "100%",
    padding: "0px",
  }

  const plotStyle = {
    display: "flex",
    flexDirection: "row",
    width: isHorizontal ? "70%" : "100%",
    height: isHorizontal ? "100%" : "70%",
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
      }
    : {
        background: "#ffffff",
        text: "#333333",
        axisLine: "rgba(0, 0, 0, 0.25)",
        grid: "rgba(0, 0, 0, 0.12)",
        traceA: "#440154",
        traceB: "#2e8f7a",
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
    margin: { t: 10, r: 10, b: 20, l: 30 },
    legend: isHorizontal
      ? { x: 1, y: 1, xanchor: "left", font: { color: plotTheme.text } }
      : {
          x: 1,
          xanchor: "right",
          y: 1,
          font: { color: plotTheme.text },
        },
    paper_bgcolor: plotTheme.background,
    plot_bgcolor: plotTheme.background,
    font: { color: plotTheme.text },
    xaxis: axisBase,
    yaxis: axisBase,
  }

  const traces = [
    {
      x: mData.x,
      y: mData.y,
      type: "scatter",
      name: "h₁(x,m)",
      mode: "lines",
      marker: { size: 1, color: plotTheme.traceA },
    },
    {
      x: gammaData.x,
      y: gammaData.y,
      type: "scatter",
      name: "h₂(x,γ)",
      mode: "lines",
      marker: { size: 1, color: plotTheme.traceB },
    },
  ]

  return (
    <div style={verticalContainerStyle}>
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
            layout={plotlyLayout}
            useResizeHandler={true}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
        <div style={controlsStyle}>
          <div>
            <h3>Adjust Parameters:</h3>
            <div className="slider-control">
              <div className="slider-label">
                <label htmlFor="m">
                  <Latex>$m$</Latex>:
                </label>
                <span className="slider-value">{m.toFixed(1)}</span>
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
                <label htmlFor="gamma">
                  <Latex>$\gamma$</Latex>:
                </label>
                <span className="slider-value">{gamma.toFixed(2)}</span>
              </div>
              <input
                type="range"
                id="gamma"
                min="1.0"
                max="10.0"
                step="0.01"
                value={gamma}
                style={rangeStyle(gamma, 1.0, 10.0)}
                onChange={handleSliderChange(setGamma)}
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        <p>
          <Latex>
            Here, we compare our parametric family of benefit functions \[
            {"h_1(x,m) = \\frac{1}{\\arctan(m)} \\arctan(mx),"}\] with the one
            from Herrera, Morelli and Nunnari (2016) [1], \[
            {
              "h_2(x,\\gamma) = \\frac{(1+x)^\\gamma - (1-x)^\\gamma}{(1+x)^\\gamma + (1-x)^\\gamma}."
            }
            \]
          </Latex>
        </p>
        <p>
          [1] Herrera, H., Morelli, M. and Nunnari, S. (2016), Turnout Across
          Democracies. American Journal of Political Science, 60: 607-624.{" "}
          <a
            href="https://doi.org/10.1111/ajps.12215"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://doi.org/10.1111/ajps.12215
          </a>
        </p>
      </div>
    </div>
  )
}

export default ConsistentStrategies
