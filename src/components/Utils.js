import { allRoots } from "flo-poly"

const EPSILON = 1e-9
const LINE_TOLERANCE = 1.75

const h = (x, m) => Math.atan(m * x) / Math.atan(m)

const h_gamma = (x, gamma) =>
  ((1 + x) ** gamma - (1 - x) ** gamma) / ((1 + x) ** gamma + (1 - x) ** gamma)

const CostFun = (cbar, a0, ai, av, k) => {
  return (cbar * (ai - a0) ** (k + 1)) / ((k + 1) * av ** (k + 1))
}

const utilityA = (m, cbar, kap, k, av, a, b, ai, a0) => {
  const akappa = (1 - kap) * a + kap * ai
  return (
    h((akappa - b) / (akappa + b), m) -
    (cbar * (ai - a0) ** (k + 1)) / ((k + 1) * av ** (k + 1))
  )
}

const getMinStep = vec => {
  if (vec.length < 2) {
    return 1
  }

  let minStep = Infinity
  for (let i = 1; i < vec.length; i++) {
    const step = Math.abs(vec[i] - vec[i - 1])
    if (step > EPSILON) {
      minStep = Math.min(minStep, step)
    }
  }

  return Number.isFinite(minStep) ? minStep : 1
}

const dedupeNumeric = values => {
  const sorted = [...values].sort((a, b) => a - b)
  return sorted.filter(
    (value, index) =>
      index === 0 || Math.abs(value - sorted[index - 1]) > EPSILON
  )
}

const solveQuadraticRealRoots = (quadA, quadB, quadC) => {
  if (Math.abs(quadA) < EPSILON) {
    if (Math.abs(quadB) < EPSILON) {
      return []
    }
    return [-quadC / quadB]
  }

  const discriminant = quadB ** 2 - 4 * quadA * quadC
  if (discriminant < -EPSILON) {
    return []
  }

  const sqrtDiscriminant = Math.sqrt(Math.max(discriminant, 0))
  return dedupeNumeric([
    (-quadB + sqrtDiscriminant) / (2 * quadA),
    (-quadB - sqrtDiscriminant) / (2 * quadA),
  ])
}

const rootsAuxAFixedA = (m, cbar, kap, k, av, a, a0) => {
  const aTilde = a - a0
  const aPower = Math.abs(aTilde) < EPSILON ? 0 : aTilde ** k
  const quadA = (1 + m ** 2) * cbar * aPower
  const quadB =
    2 * (1 - m ** 2) * a * cbar * aPower -
    (2 * kap * m * av ** (k + 1)) / Math.atan(m)
  const quadC = (1 + m ** 2) * cbar * aPower * a ** 2

  return solveQuadraticRealRoots(quadA, quadB, quadC)
}

const scaledDistance = (first, second, xStep, yStep) => {
  const dx = (first.x - second.x) / xStep
  const dy = (first.y - second.y) / yStep
  return Math.hypot(dx, dy)
}

const dedupePoints = (points, xStep, yStep) => {
  const seen = new Map()
  const dedupeX = Math.max(xStep / 2, 1e-12)
  const dedupeY = Math.max(yStep / 2, 1e-12)
  const minX = Math.min(...points.map(point => point.x))
  const minY = Math.min(...points.map(point => point.y))

  for (const point of points) {
    const gridX = Math.round((point.x - minX) / dedupeX)
    const gridY = Math.round((point.y - minY) / dedupeY)
    const key = `${gridX}:${gridY}`

    if (!seen.has(key)) {
      seen.set(key, { ...point, gridX, gridY })
    }
  }

  return [...seen.values()]
}

const buildAdjacency = (points, xStep, yStep, tolerance) => {
  const adjacency = points.map(() => [])
  if (points.length <= 1) {
    return adjacency
  }

  const xTolerance = tolerance * xStep
  const yTolerance = tolerance * yStep
  const sorted = points
    .map((point, index) => ({ point, index }))
    .sort((first, second) => first.point.x - second.point.x)

  for (let position = 0; position < sorted.length; position++) {
    const { point, index } = sorted[position]

    for (
      let nextPosition = position + 1;
      nextPosition < sorted.length;
      nextPosition++
    ) {
      const { point: neighborPoint, index: neighborIndex } =
        sorted[nextPosition]

      if (neighborPoint.x - point.x > xTolerance) {
        break
      }

      if (Math.abs(neighborPoint.y - point.y) > yTolerance) {
        continue
      }

      const xScaled = (neighborPoint.x - point.x) / Math.max(xStep, 1e-12)
      const yScaled =
        Math.abs(neighborPoint.y - point.y) / Math.max(yStep, 1e-12)
      if (xScaled ** 2 + yScaled ** 2 <= 7.5) {
        adjacency[index].push(neighborIndex)
        adjacency[neighborIndex].push(index)
      }
    }
  }

  return adjacency
}

const findConnectedComponents = adjacency => {
  const visited = new Array(adjacency.length).fill(false)
  const components = []

  for (let start = 0; start < adjacency.length; start++) {
    if (visited[start]) {
      continue
    }

    const stack = [start]
    const component = []
    visited[start] = true

    while (stack.length > 0) {
      const current = stack.pop()
      component.push(current)

      for (const neighbor of adjacency[current]) {
        if (!visited[neighbor]) {
          visited[neighbor] = true
          stack.push(neighbor)
        }
      }
    }

    components.push(component)
  }

  return components
}

const buildComponentAdjacency = (component, adjacency) => {
  const indexMap = new Map(component.map((value, index) => [value, index]))

  return component.map(pointIndex => {
    return adjacency[pointIndex]
      .filter(neighbor => indexMap.has(neighbor))
      .map(neighbor => indexMap.get(neighbor))
  })
}

const buildMinimumSpanningTree = (points, adjacency, xStep, yStep) => {
  if (points.length <= 1) {
    return []
  }

  const visited = new Set([0])
  const edges = []

  while (visited.size < points.length) {
    let bestEdge = null
    let bestWeight = Infinity

    for (const node of visited) {
      for (const neighbor of adjacency[node]) {
        if (visited.has(neighbor)) {
          continue
        }

        const weight = scaledDistance(
          points[node],
          points[neighbor],
          xStep,
          yStep
        )
        if (weight < bestWeight) {
          bestWeight = weight
          bestEdge = [node, neighbor]
        }
      }
    }

    if (bestEdge === null) {
      return []
    }

    edges.push(bestEdge)
    visited.add(bestEdge[1])
  }

  return edges
}

const orderLinePoints = (points, edges) => {
  if (points.length === 1) {
    return points
  }

  const adjacency = points.map(() => [])
  edges.forEach(([from, to]) => {
    adjacency[from].push(to)
    adjacency[to].push(from)
  })

  const endpoints = adjacency
    .map((neighbors, index) => ({ index, degree: neighbors.length }))
    .filter(node => node.degree === 1)

  if (endpoints.length !== 2) {
    return null
  }

  const ordered = []
  let current = endpoints[0].index
  let previous = -1

  while (current !== -1) {
    ordered.push(points[current])
    const from = previous
    const next = adjacency[current].find(neighbor => neighbor !== from)
    previous = current
    current = next ?? -1
  }

  return ordered.length === points.length ? ordered : null
}

const buildTreeAdjacency = (points, edges) => {
  const adjacency = points.map(() => [])
  edges.forEach(([from, to]) => {
    adjacency[from].push(to)
    adjacency[to].push(from)
  })
  return adjacency
}

const decomposeComponentPaths = (points, edges) => {
  if (points.length === 0) {
    return { lines: [], scatter: [] }
  }

  const treeAdjacency = buildTreeAdjacency(points, edges)
  const degrees = treeAdjacency.map(neighbors => neighbors.length)
  const ordered = orderLinePoints(points, edges)
  if (ordered !== null) {
    return {
      lines: [ordered],
      scatter: [],
    }
  }

  const specialNodes = degrees
    .map((degree, index) => ({ degree, index }))
    .filter(node => node.degree !== 2)
    .map(node => node.index)

  if (specialNodes.length === 0) {
    return { lines: [], scatter: points }
  }

  const lines = []
  const usedEdges = new Set()
  for (const start of specialNodes) {
    for (const neighbor of treeAdjacency[start]) {
      const edgeKey = [start, neighbor].sort((a, b) => a - b).join(":")
      if (usedEdges.has(edgeKey)) {
        continue
      }

      const path = [start, neighbor]
      usedEdges.add(edgeKey)
      let previous = start
      let current = neighbor

      while (degrees[current] === 2) {
        const from = previous
        const nextNodes = treeAdjacency[current].filter(node => node !== from)
        if (nextNodes.length !== 1) {
          break
        }

        const next = nextNodes[0]
        const nextEdgeKey = [current, next].sort((a, b) => a - b).join(":")
        if (usedEdges.has(nextEdgeKey)) {
          break
        }

        path.push(next)
        usedEdges.add(nextEdgeKey)
        previous = current
        current = next
      }

      if (path.length >= 2) {
        lines.push(path.map(index => points[index]))
      }
    }
  }

  const covered = new Set(lines.flatMap(line => line))
  const scatter = points.filter(
    (point, index) => degrees[index] > 2 || !covered.has(point)
  )

  return { lines, scatter }
}

const classifyPointCloud = (points, gridXStep, gridYStep) => {
  const xStep = Math.max(gridXStep, 1e-12)
  const yStep = Math.max(gridYStep, 1e-12)
  const deduped = dedupePoints(points, xStep, yStep)
  if (deduped.length === 0) {
    return { x: [], y: [], scatter: { x: [], y: [] }, lines: [] }
  }

  const adjacency = buildAdjacency(deduped, xStep, yStep, LINE_TOLERANCE)
  const components = findConnectedComponents(adjacency)
  const lines = []
  const scatter = []

  for (const component of components) {
    const componentPoints = component.map(index => deduped[index])
    if (componentPoints.length < 2) {
      scatter.push(...componentPoints)
      continue
    }

    const componentAdjacency = buildComponentAdjacency(component, adjacency)

    const edges = buildMinimumSpanningTree(
      componentPoints,
      componentAdjacency,
      xStep,
      yStep
    )

    if (edges.length === 0) {
      scatter.push(...componentPoints)
      continue
    }

    const { lines: componentLines, scatter: componentScatter } =
      decomposeComponentPaths(componentPoints, edges)

    for (const line of componentLines) {
      if (line.length >= 2) {
        lines.push({
          x: line.map(point => point.x),
          y: line.map(point => point.y),
        })
      }
    }
    scatter.push(...componentScatter)
  }

  return {
    x: deduped.map(point => point.x),
    y: deduped.map(point => point.y),
    scatter: {
      x: scatter.map(point => point.x),
      y: scatter.map(point => point.y),
    },
    lines,
  }
}

const findGroupBrAVecB = (m, cbar, kap, k, av, bVec, a0, reverseScan = {}) => {
  const points = []

  for (const b of bVec) {
    const brList = findGroupBrA(m, cbar, kap, k, av, b, a0)
    for (const a of brList) {
      points.push({ x: a, y: b })
    }
  }

  if (
    Array.isArray(reverseScan.aVec) &&
    reverseScan.aVec.length > 0 &&
    Number.isFinite(reverseScan.bMin) &&
    Number.isFinite(reverseScan.bMax)
  ) {
    for (let i = 1; i < reverseScan.aVec.length; i++) {
      const a = reverseScan.aVec[i]
      const brList = findGroupBrAFixedA(
        m,
        cbar,
        kap,
        k,
        av,
        a,
        a0,
        reverseScan.bMin,
        reverseScan.bMax
      )

      for (const b of brList) {
        points.push({ x: a, y: b })
      }
    }
  }

  const xStep = getMinStep(
    Array.isArray(reverseScan.aVec) && reverseScan.aVec.length > 1
      ? reverseScan.aVec
      : [a0, a0 + av]
  )
  const yStep = getMinStep(bVec)

  return classifyPointCloud(points, xStep, yStep)
}

const findGroupBrA = (m, cbar, kap, k, av, b, a0) => {
  let roots = rootsAuxA(m, cbar, kap, k, av, b, a0)
  roots = roots.filter(root => root < a0 + av) // only admissible
  roots = roots.filter(root => root > a0)
  roots.push(a0 + av) // append potential corner solutions
  roots.push(a0)

  const tfArray = isGroupBrA(roots, m, cbar, kap, k, av, b, a0)
  return roots.filter((_, index) => tfArray[index])
}

const isGroupBrA = (roots, m, cbar, kap, k, av, b, a0) => {
  const tfArray = new Array(roots.length).fill(false)
  for (let i = 0; i < roots.length; i++) {
    let rootsU = rootsUtilityA(m, cbar, kap, k, av, roots[i], b, a0)
    rootsU = rootsU.filter(root => root > a0) // only positive roots
    rootsU = rootsU.filter(root => root < a0 + av) // only roots in admissible range
    rootsU.push(a0 + av) // append potential corner solutions
    rootsU.push(a0)
    const indexRoot = rootsU.reduce(
      (minIndex, root, index) =>
        Math.abs(root - roots[i]) < Math.abs(rootsU[minIndex] - roots[i])
          ? index
          : minIndex,
      0
    )
    const indexMax = rootsU.reduce(
      (maxIndex, root, index) =>
        utilityA(m, cbar, kap, k, av, roots[i], b, root, a0) >
        utilityA(m, cbar, kap, k, av, roots[i], b, rootsU[maxIndex], a0)
          ? index
          : maxIndex,
      0
    )
    if (indexMax === indexRoot) {
      tfArray[i] = true
    }
  }
  return tfArray
}

const findGroupBrAFixedA = (m, cbar, kap, k, av, a, a0, bMin, bMax) => {
  let roots = rootsAuxAFixedA(m, cbar, kap, k, av, a, a0)
  roots = roots.filter(root => root >= bMin - EPSILON)
  roots = roots.filter(root => root <= bMax + EPSILON)

  return roots.filter(b => isGroupBrA([a], m, cbar, kap, k, av, b, a0)[0])
}

const rootsAuxA = (m, cbar, kap, k, av, b, a0) => {
  const coeffs = new Array(k + 3).fill(0)

  coeffs[0] = m ** 2 + 1
  coeffs[1] = 2 * a0 * m ** 2 + 2 * a0 - 2 * b * m ** 2 + 2 * b
  coeffs[2] =
    a0 ** 2 * m ** 2 +
    a0 ** 2 -
    2 * a0 * b * m ** 2 +
    2 * a0 * b +
    b ** 2 * m ** 2 +
    b ** 2
  coeffs[k + 2] = (-2 * kap * m * b * av ** (k + 1)) / (Math.atan(m) * cbar)

  return allRoots(coeffs).map(root => root + a0)
}

const rootsUtilityA = (m, cbar, kap, k, av, a, b, a0) => {
  const coeffs = new Array(k + 3).fill(0)

  coeffs[0] = kap ** 2 * m ** 2 + kap ** 2
  coeffs[1] =
    -2 * a * kap ** 2 * m ** 2 -
    2 * a * kap ** 2 +
    2 * a * kap * m ** 2 +
    2 * a * kap +
    2 * a0 * kap ** 2 * m ** 2 +
    2 * a0 * kap ** 2 -
    2 * b * kap * m ** 2 +
    2 * b * kap
  coeffs[2] =
    a ** 2 * kap ** 2 * m ** 2 +
    a ** 2 * kap ** 2 -
    2 * a ** 2 * kap * m ** 2 -
    2 * a ** 2 * kap +
    a ** 2 * m ** 2 +
    a ** 2 -
    2 * a * a0 * kap ** 2 * m ** 2 -
    2 * a * a0 * kap ** 2 +
    2 * a * a0 * kap * m ** 2 +
    2 * a * a0 * kap +
    2 * a * b * kap * m ** 2 -
    2 * a * b * kap -
    2 * a * b * m ** 2 +
    2 * a * b +
    a0 ** 2 * kap ** 2 * m ** 2 +
    a0 ** 2 * kap ** 2 -
    2 * a0 * b * kap * m ** 2 +
    2 * a0 * b * kap +
    b ** 2 * m ** 2 +
    b ** 2
  coeffs[k + 2] = (-2 * kap * m * b * av ** (k + 1)) / (Math.atan(m) * cbar)

  return allRoots(coeffs).map(root => root + a0)
}

const swapPlotData = plotData => ({
  x: plotData.y,
  y: plotData.x,
  scatter: {
    x: plotData.scatter.y,
    y: plotData.scatter.x,
  },
  lines: plotData.lines.map(line => ({ x: line.y, y: line.x })),
})

const computeConsistentStrategyData = params => {
  const { m, theA, theB, rho, kap, k, a0, av, b0, bv, resolution } = params

  const bVec = Array.from(
    { length: resolution },
    (_, i) => b0 + (i * bv) / Math.max(resolution - 1, 1)
  )
  const aVec = Array.from(
    { length: resolution },
    (_, i) => a0 + (i * av) / Math.max(resolution - 1, 1)
  )

  const data = findGroupBrAVecB(m, theA, kap, k, av, bVec, a0, {
    aVec,
    bMin: b0,
    bMax: b0 + bv,
  })
  const data2 = swapPlotData(
    findGroupBrAVecB(m, theB / rho, kap, k, bv, aVec, b0, {
      aVec: bVec,
      bMin: a0,
      bMax: a0 + av,
    })
  )

  return { data, data2 }
}

export { computeConsistentStrategyData, h, CostFun, h_gamma }
