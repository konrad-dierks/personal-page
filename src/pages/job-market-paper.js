import * as React from "react"
import { withPrefix } from "gatsby"
import { DocumentPdfIcon } from "@sanity/icons"

import SiteLayout from "../components/siteLayout"
import Seo from "../components/seo"
import {
  JobMarketPaperAbstract,
  JobMarketPaperFunding,
  JobMarketPaperPresentations,
} from "../components/papers"

const JMP_FAVICON_LIGHT = "/favicon-jmp-light-v4.svg"
const JMP_FAVICON_DARK = "/favicon-jmp-dark-v4.svg"

const JobMarketPaperPage = () => (
  <SiteLayout pageIcon="jmp">
    <header className="appendix-header">
      <h1>
        Is a 100% renewable electricity mix cost-efficient under weather
        uncertainty?
      </h1>
      <h2 className="appendix-subtitle">Job Market Paper</h2>
    </header>
    <p>
      <a
        className="pdf-button"
        href={withPrefix("/jmp.pdf")}
        target="_blank"
        rel="noopener noreferrer"
      >
        <DocumentPdfIcon className="pdf-button-icon" aria-hidden="true" />
        <span>Paper (PDF)</span>
      </a>
    </p>
    <JobMarketPaperAbstract />
    <JobMarketPaperPresentations />
    <JobMarketPaperFunding />
  </SiteLayout>
)

export const Head = () => (
  <Seo
    title="Job Market Paper"
    faviconLight={JMP_FAVICON_LIGHT}
    faviconDark={JMP_FAVICON_DARK}
  />
)

export default JobMarketPaperPage
