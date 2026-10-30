import Plot, { toPoints } from "./LoadablePlot"
import React, { useState, useEffect } from "react"
import { h, h_gamma } from "./Utils.js"
import Latex from "react-latex-next"
import "katex/dist/katex.min.css"
import usePrefersDark from "./usePrefersDark"

const ConsistentStrategies = () => {
  const [m, setM] = useState(1)
  const [gamma, setGamma] = useState(1)
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

  const plotTheme = prefersDark
    ? {
        text: "#f2f2f2",
        axisLine: "rgba(255, 255, 255, 0.35)",
        grid: "rgba(255, 255, 255, 0.12)",
        traceA: "#c77dff",
        traceB: "#7fd6c6",
      }
    : {
        text: "#333333",
        axisLine: "rgba(0, 0, 0, 0.25)",
        grid: "rgba(0, 0, 0, 0.12)",
        traceA: "#440154",
        traceB: "#2e8f7a",
      }

  const axisOptions = {
    ticks: { color: plotTheme.text },
    border: { color: plotTheme.axisLine },
    grid: {
      color: context =>
        context.tick?.value === 0 ? plotTheme.axisLine : plotTheme.grid,
    },
  }

  const chartOptions = {
    plugins: {
      legend: { position: "top", labels: { color: plotTheme.text } },
    },
    scales: { x: axisOptions, y: axisOptions },
  }

  const lineDataset = (label, points, color) => ({
    label,
    data: points,
    borderColor: color,
    backgroundColor: color,
    borderWidth: 2,
    pointRadius: 0,
  })

  const chartData = {
    datasets: [
      lineDataset("h₁(x,m)", toPoints(mData.x, mData.y), plotTheme.traceA),
      lineDataset(
        "h₂(x,γ)",
        toPoints(gammaData.x, gammaData.y),
        plotTheme.traceB
      ),
    ],
  }

  return (
    <div className="plot-page">
      <div className="plot-layout">
        <div className="plot-main">
          <Plot
            data={chartData}
            options={chartOptions}
            className="plot-main-chart"
          />
        </div>
        <div className="plot-controls">
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
