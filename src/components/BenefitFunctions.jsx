import Plot, { toPoints } from "./LoadablePlot"
import { useMemo, useState } from "react"
import { h, h_gamma } from "./Utils.js"
import Latex from "react-latex-next"
import "katex/dist/katex.min.css"
import usePlotTheme from "./usePlotTheme"
import SliderControl from "./SliderControl"

const xValues = Array.from({ length: 300 }, (_, i) => -1 + (i * 2) / 299)

const BenefitFunctions = () => {
  const [m, setM] = useState(1)
  const [gamma, setGamma] = useState(1)
  const { colors, axis, legend } = usePlotTheme()

  const mPoints = useMemo(
    () =>
      toPoints(
        xValues,
        xValues.map(x => h(x, m))
      ),
    [m]
  )
  const gammaPoints = useMemo(
    () =>
      toPoints(
        xValues,
        xValues.map(x => h_gamma(x, gamma))
      ),
    [gamma]
  )

  const chartOptions = {
    plugins: { legend },
    scales: { x: axis(), y: axis() },
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
      lineDataset("h₁(x,m)", mPoints, colors.traceA),
      lineDataset("h₂(x,γ)", gammaPoints, colors.traceB),
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
            label="Plot comparing the benefit functions h₁(x, m) and h₂(x, γ) for x from −1 to 1"
          />
        </div>
        <div className="plot-controls">
          <div>
            <h3>Adjust Parameters:</h3>
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
              id="gamma"
              label="\gamma"
              value={gamma}
              min={1}
              max={10}
              step={0.01}
              onChange={setGamma}
            />
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

export default BenefitFunctions
