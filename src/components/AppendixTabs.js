import * as React from "react"
import { Tabs, TabList, Tab, TabPanel } from "react-tabs"
import { GithubIcon } from "@sanity/icons"
import "react-tabs/style/react-tabs.css"
import ConsistentStrategies from "./ConsistentStrategies"
import BenefitFunctions from "./BenefitFunctions"

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
          Welcome to the bonus content page for our paper{" "}
          <cite>
            Does universalization ethics justify participation in large
            elections?
          </cite>{" "}
          [1]
          <h2>Code for the graphics</h2>
          <p>
            The code for generating the graphics in the paper can be found here:{" "}
            <br />
            <span className="inline-link-with-icon">
              <GithubIcon className="link-icon" aria-hidden="true" />
              <a href="https://github.com/konrad-dierks/homo-moralis-turnout">
                GitHub repository
              </a>
            </span>
          </p>
          <h2>Interactive plots</h2>
          <p>
            We provide <a href="#tab1">an interactive plot</a> showing
            consistent strategies for a wide range of model parameters in our
            partisan case.
          </p>
          <p>
            Moreover, we provide <a href="#tab2">an interactive plot</a> that
            compares our choice of the power-sharing function with the one used
            by Herrera, Morelli and Nunnari (2016) [2].
          </p>
          <h2>Authors</h2>
          <p>
            <a href="https://ingelaalger.weebly.com/">Ingela Alger</a>,{" "}
            <a href="https://www.konraddierks.eu/">Konrad Dierks</a>,{" "}
            <a href="https://sites.google.com/site/jflaslierhomepage/">
              Jean-François Laslier
            </a>
          </p>
          <h2>References</h2>
          <p>
            1. Konrad Dierks, Ingela Alger, and Jean-François Laslier, Does
            universalization ethics justify participation in large elections?,
            TSE Working Paper, n. 21-1193, February 2021, revised May 2026.
            <span className="reference-link-line">
              <a href="https://www.tse-fr.eu/publications/working-paper/does-universalization-ethics-justify-participation-large-elections-0">
                https://www.tse-fr.eu/publications/working-paper/does-universalization-ethics-justify-participation-large-elections-0
              </a>
            </span>
          </p>
          <p>
            2. Herrera, H., Morelli, M. and Nunnari, S. (2016), Turnout Across
            Democracies. American Journal of Political Science, 60: 607-624.
            <span className="reference-link-line">
              <a href="https://doi.org/10.1111/ajps.12215">
                https://doi.org/10.1111/ajps.12215
              </a>
            </span>
          </p>
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
