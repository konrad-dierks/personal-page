import { useEffect, useState } from "react"
import Latex from "react-latex-next"

const decimalsOf = step => (String(step).split(".")[1] ?? "").length

// A slider with a number field. Typed numbers within the range apply right
// away, and the arrow keys move in coarse steps. A second after typing stops,
// the number is clamped to the range and rounded to the step. On leaving the
// field, anything else reverts to the current value.
const SliderControl = ({
  id,
  label,
  value,
  min,
  max,
  step,
  log1pArrowSteps = false,
  onChange,
}) => {
  const decimals = decimalsOf(step)
  const format = number => number.toFixed(decimals)
  const [text, setText] = useState(format(value))
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    if (!editing) {
      setText(format(value))
    }
  }, [value, editing])

  const normalize = number =>
    Number(
      (Math.round(Math.min(max, Math.max(min, number)) / step) * step).toFixed(
        decimals
      )
    )

  const handleTextChange = event => {
    setText(event.target.value)
    const number = Number.parseFloat(event.target.value)
    if (number >= min && number <= max) {
      onChange(normalize(number))
    }
  }

  useEffect(() => {
    if (!editing) {
      return undefined
    }
    const timeoutId = setTimeout(() => {
      const number = Number.parseFloat(text)
      const normalized = normalize(number)
      if (Number.isFinite(number) && normalized !== number) {
        onChange(normalized)
        setText(format(normalized))
      }
    }, 1000)
    return () => clearTimeout(timeoutId)
  }, [text, editing])

  // The arrow keys move by a tenth of the range, or by the step for integers.
  // With log1pArrowSteps, they move between eleven points from min to max
  // instead, evenly spaced in log(1 + x) and rounded to the step.
  const arrowTarget = (current, direction) => {
    if (log1pArrowSteps) {
      const from = Math.log1p(min)
      const to = Math.log1p(max)
      const points = Array.from({ length: 11 }, (_, i) =>
        normalize(Math.expm1(from + ((to - from) * i) / 10))
      )
      return direction > 0
        ? (points.find(point => point > current) ?? max)
        : (points.findLast(point => point < current) ?? min)
    }
    return normalize(
      current + direction * (step >= 1 ? step : (max - min) / 10)
    )
  }

  const handleKeyDown = event => {
    if (event.key === "Enter") {
      event.currentTarget.blur()
      return
    }
    const direction = { ArrowUp: 1, ArrowDown: -1 }[event.key]
    if (!direction) {
      return
    }
    event.preventDefault()
    const number = Number.parseFloat(text)
    const current = Number.isFinite(number) ? number : value
    const next = arrowTarget(current, direction)
    onChange(next)
    setText(format(next))
  }

  const handleBlur = () => {
    const number = Number.parseFloat(text)
    if (Number.isFinite(number)) {
      onChange(normalize(number))
    }
    setEditing(false)
  }

  return (
    <div className="slider-control">
      <div className="slider-label">
        <label htmlFor={id} id={`${id}-label`}>
          <Latex>{`$${label}$`}</Latex>:
        </label>
        <input
          type="number"
          className="slider-value"
          inputMode="decimal"
          aria-labelledby={`${id}-label`}
          min={min}
          max={max}
          step={step}
          value={text}
          onFocus={() => setEditing(true)}
          onChange={handleTextChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
      </div>
      <input
        type="range"
        id={id}
        min={min}
        max={max}
        step={step}
        value={value}
        style={{ "--range-value": `${((value - min) / (max - min)) * 100}%` }}
        onChange={event => onChange(Number.parseFloat(event.target.value))}
      />
    </div>
  )
}

export default SliderControl
