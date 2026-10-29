import * as React from "react"
import { Tabs, TabList, Tab, TabPanel } from "react-tabs"
import { GithubIcon } from "@sanity/icons"
import "react-tabs/style/react-tabs.css"
import ConsistentStrategies from "./ConsistentStrategies"
import BenefitFunctions from "./BenefitFunctions"
import {
  TurnoutPaperAbstract,
  TurnoutPaperFunding,
  TurnoutPaperPresentations,
} from "./papers"

const tabHashes = ["overview", "tab1", "tab2"]
const hashToIndex = hash => {
  const index = tabHashes.indexOf(hash)
  return index === -1 ? null : index
}

const AppendixTabs = ({ defaultTab = 0 }) => {
  const [tabIndex, setTabIndex] = React.useState(defaultTab)

  React.useEffect(() => {
    if (typeof window === "undefined") {
      return undefined
    }

    const syncFromHash = () => {
      const hash = window.location.hash.substring(1)
      const mapped = hashToIndex(hash)
      if (mapped !== null) {
        setTabIndex(mapped)
        return
      }

      setTabIndex(defaultTab)
      if (!hash && defaultTab !== 0) {
        window.location.hash = tabHashes[defaultTab]
      }
    }

    syncFromHash()
    window.addEventListener("hashchange", syncFromHash)
    return () => window.removeEventListener("hashchange", syncFromHash)
  }, [defaultTab])

  const handleTabSelect = index => {
    setTabIndex(index)
    if (typeof window !== "undefined") {
      window.location.hash = tabHashes[index]
    }
  }

  return (
    <Tabs
      selectedIndex={tabIndex}
      onSelect={handleTabSelect}
      className="appendix-tabs"
    >
      <TabList>
        <Tab>Overview</Tab>
        <Tab>Consistent Strategies</Tab>
        <Tab>Benefit Functions</Tab>
      </TabList>

      <TabPanel>
        <div>
          <p>
            With <a href="https://ingelaalger.weebly.com/" target="_blank" rel="noopener noreferrer">Ingela Alger</a> and{" "}
            <a href="https://sites.google.com/site/jflaslierhomepage/" target="_blank" rel="noopener noreferrer">
              Jean-François Laslier
            </a>
          </p>
          <p>
            <b>Paper:</b>{" "}
            <a href="https://www.tse-fr.eu/publications/working-paper/does-universalization-ethics-justify-participation-large-elections-0" target="_blank" rel="noopener noreferrer">
              TSE working paper (2026)
            </a>
          </p>
          <b>Abstract:</b>
          <TurnoutPaperAbstract />
          <TurnoutPaperPresentations />
          <b>Code for the graphics:</b>
          <p>
            The code for generating the graphics in the paper can be found here:{" "}
            <br />
            <span className="inline-link-with-icon">
              <GithubIcon className="link-icon" aria-hidden="true" />
              <a href="https://github.com/konrad-dierks/homo-moralis-turnout" target="_blank" rel="noopener noreferrer">
                GitHub repository
              </a>
            </span>
          </p>
          <b>Interactive plots:</b>
          <p>
            We provide <a href="#tab1">an interactive plot</a> showing
            consistent strategies for a wide range of model parameters in our
            partisan case.
          </p>
          <p>
            Moreover, we provide <a href="#tab2">an interactive plot</a> that
            compares our choice of the power-sharing function with the one used
            by Herrera, Morelli and Nunnari (2016) [1].
          </p>
          <b>References:</b>
          <p>
            1. Herrera, H., Morelli, M. and Nunnari, S. (2016), Turnout Across
            Democracies. American Journal of Political Science, 60: 607-624.
            <span className="reference-link-line">
              <a href="https://doi.org/10.1111/ajps.12215" target="_blank" rel="noopener noreferrer">
                https://doi.org/10.1111/ajps.12215
              </a>
            </span>
          </p>
          <TurnoutPaperFunding />
        </div>
      </TabPanel>
      <TabPanel>
        <ConsistentStrategies />
      </TabPanel>
      <TabPanel>
        <BenefitFunctions />
      </TabPanel>
    </Tabs>
  )
}

export default AppendixTabs
