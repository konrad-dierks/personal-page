import * as React from "react"

import SiteLayout from "../components/siteLayout"
import Seo from "../components/seo"
import AppendixTabs from "../components/AppendixTabs"

const TURNOUT_FAVICON_LIGHT = "/favicon-turnout-light-v2.svg"
const TURNOUT_FAVICON_DARK = "/favicon-turnout-dark-v2.svg"

const AppendixPage = () => (
  <SiteLayout pageIcon="turnout">
    <header className="appendix-header">
      <h1>
        Does universalization ethics justify participation in large elections?
      </h1>
      <h2 className="appendix-subtitle">Bonus content</h2>
    </header>
    <AppendixTabs defaultTab={0} />
  </SiteLayout>
)

export const Head = () => (
  <Seo
    title="Turnout Paper"
    faviconLight={TURNOUT_FAVICON_LIGHT}
    faviconDark={TURNOUT_FAVICON_DARK}
  />
)

export default AppendixPage
