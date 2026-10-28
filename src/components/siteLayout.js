import * as React from "react"
import SiteNav from "./siteNav"
import SiteFooter from "./siteFooter"

const SiteLayout = ({ children, pageIcon = null }) => {
  return (
    <>
      <SiteNav />
      <div className="site-shell">
        <main>{children}</main>
        <SiteFooter pageIcon={pageIcon} />
      </div>
    </>
  )
}

export default SiteLayout
