import * as React from "react"
import { withPrefix } from "gatsby"
import { DocumentPdfIcon } from "@sanity/icons"

import SiteLayout from "../components/siteLayout"
import Seo from "../components/seo"
import { JobMarketPaperAbstract } from "../components/abstracts"

const JMP_FAVICON_LIGHT = "/favicon-jmp-light-v4.svg"
const JMP_FAVICON_DARK = "/favicon-jmp-dark-v4.svg"

const JobMarketPaperPage = () => (
  <SiteLayout pageIcon="jmp">
    <header className="appendix-header">
      <h1>Is a 100% renewable electricity mix cost-efficient under weather uncertainty?</h1>
      <h2 className="appendix-subtitle">Job Market Paper</h2>
    </header>
    <p>
      <a
        className="cv-download-link"
        href={withPrefix("/jmp.pdf")}
        target="_blank"
        rel="noopener noreferrer"
      >
        <DocumentPdfIcon className="cv-download-icon" aria-hidden="true" />
        <span>Paper (PDF)</span>
      </a>
    </p>
    <JobMarketPaperAbstract />
    <p className="research-funding">
      This work was supported by two French government grants managed by the Agence Nationale de la Recherche under the "Investissements d'avenir" program (references "ANR-18-EURE-0021", "ANR-21-ESRE-0051"). Under the latter, this work was granted access to the MesoNET resources center and the MesoNET Project under the allocation m26158. This work was also supported by the Agence Nationale de la Recherche through the project AVINEQ.
    </p>
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
