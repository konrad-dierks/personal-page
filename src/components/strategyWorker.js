import { computeConsistentStrategyData } from "./Utils.js"

// Computes the refined consistent strategies off the main thread
self.onmessage = ({ data: { id, params } }) => {
  self.postMessage({ id, ...computeConsistentStrategyData(params) })
}
