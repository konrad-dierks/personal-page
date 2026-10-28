import * as React from "react"
import SiteNav from "./siteNav"
import SiteFooter from "./siteFooter"

const SiteLayout = ({ children, usesTurnoutFavicon = false }) => {
  return (
    <>
      <SiteNav />
      <div className="site-shell">
        <main>{children}</main>
        <SiteFooter usesTurnoutFavicon={usesTurnoutFavicon} />
      </div>
    </>
  )
}

export default SiteLayout
