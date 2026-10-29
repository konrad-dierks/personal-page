import * as React from "react"
import { navigate, withPrefix } from "gatsby"
import { DocumentPdfIcon } from "@sanity/icons"
import "@fontsource/libertinus-serif/400.css"
import "@fontsource/libertinus-serif/700.css"

import SiteLayout from "../components/siteLayout"
import Seo from "../components/seo"

const normalizeHeading = text => text.replace(/\s+/g, " ").trim().toLowerCase()

const injectResearchLink = (cvRoot, researchHref) => {
  const headings = cvRoot.querySelectorAll("h1, h2, h3, h4, h5, h6")
  const researchHeading = Array.from(headings).find(
    heading =>
      normalizeHeading(heading.textContent || "") === "research interests"
  )

  if (!researchHeading) {
    return
  }

  const existingLink = researchHeading.querySelector("a")
  if (existingLink && /research/i.test(existingLink.textContent || "")) {
    existingLink.setAttribute("href", researchHref)
    return
  }

  const rawText = researchHeading.textContent || ""
  const match = rawText.match(/\bresearch\b/i)
  if (!match || match.index === undefined) {
    return
  }

  const startIndex = match.index
  const endIndex = startIndex + match[0].length
  const nodes = []

  if (startIndex > 0) {
    nodes.push(document.createTextNode(rawText.slice(0, startIndex)))
  }

  const researchLink = document.createElement("a")
  researchLink.setAttribute("href", researchHref)
  researchLink.textContent = rawText.slice(startIndex, endIndex)
  nodes.push(researchLink)

  if (endIndex < rawText.length) {
    nodes.push(document.createTextNode(rawText.slice(endIndex)))
  }

  researchHeading.replaceChildren(...nodes)
}

const isOwnSiteLink = link =>
  link.hostname === window.location.hostname ||
  /(^|\.)konraddierks\.eu$/.test(link.hostname)

// Links to other sites open in a new tab; links back to this site do not
const openExternalLinksInNewTab = cvRoot => {
  cvRoot.querySelectorAll("a[href^='http']").forEach(link => {
    if (isOwnSiteLink(link)) {
      return
    }
    link.setAttribute("target", "_blank")
    link.setAttribute("rel", "noopener noreferrer")
  })
}

// The CV is raw HTML, so its links to this site are plain anchors.
// Route plain left-clicks on them through Gatsby, like a <Link>.
const handleOwnSiteLinkClick = event => {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return
  }

  const link = event.target.closest("a[href]")
  if (!link || link.target === "_blank" || !/^https?:$/.test(link.protocol)) {
    return
  }
  if (!isOwnSiteLink(link)) {
    return
  }

  event.preventDefault()
  navigate(`${link.pathname}${link.search}${link.hash}`)
}

const CvPage = ({ pageContext }) => {
  const pdfHref = withPrefix("/cv_konrad_dierks.pdf")
  const researchHref = withPrefix("/research/")
  const cvHtml = pageContext?.cvHtml || ""
  const cvContentRef = React.useRef(null)

  React.useEffect(() => {
    const cvRoot = cvContentRef.current
    if (!cvHtml || !cvRoot) {
      return undefined
    }

    injectResearchLink(cvRoot, researchHref)
    openExternalLinksInNewTab(cvRoot)
    cvRoot.addEventListener("click", handleOwnSiteLinkClick)
    return () => cvRoot.removeEventListener("click", handleOwnSiteLinkClick)
  }, [cvHtml, researchHref])

  return (
    <SiteLayout>
      <section className="cv-section">
        <header className="cv-header">
          <h1>Curriculum Vitae</h1>
          <a className="pdf-button" href={pdfHref} download>
            <DocumentPdfIcon className="pdf-button-icon" aria-hidden="true" />
            <span>Download PDF</span>
          </a>
        </header>
        {cvHtml ? (
          <section
            ref={cvContentRef}
            className="cv-html-content"
            dangerouslySetInnerHTML={{ __html: cvHtml }}
          />
        ) : (
          <p>
            The HTML CV could not be loaded. You can still use{" "}
            <a href={pdfHref} download>
              Download PDF
            </a>
            .
          </p>
        )}
      </section>
    </SiteLayout>
  )
}

export const Head = () => <Seo title="CV" />

export default CvPage
