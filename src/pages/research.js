import * as React from "react"

import SiteLayout from "../components/siteLayout"
import Seo from "../components/seo"
import {
  JobMarketPaperAbstract,
  TurnoutPaperAbstract,
} from "../components/abstracts"

const ResearchPage = () => (
  <SiteLayout>
    <section>
      <h1>Research</h1>
    </section>
    <section className="research-list">
      <article className="research-item">
        <h2>Is a 100% renewable electricity mix cost-efficient under weather uncertainty?</h2>
        <h3><i>Job Market Paper</i></h3>
        <JobMarketPaperAbstract />
        <p>
          <b>Draft available on request.</b>
          <br />
          <b>Presented at (selection):</b>
          <br />
          2025: EAERE conference (Bergen), FAERE conference (Nantes), ENTER Jamboree (Stockholm), UAB (Barcelona, ENTER exchange seminar), University of Leipzig lunchtime seminar.
          <br />
          2026: EDF (Paris), Doctorissimes (Paris), HYRCE (Liège), EEA-ESEM Congress (Dublin), IAEE European Conference (Munich), IAEE COP Symposium (Antalya, upcoming)
        </p>
        <p className="research-funding">
          This work was supported by two French government grants managed by the Agence Nationale de la Recherche under the "Investissements d'avenir" program (references "ANR-18-EURE-0021", "ANR-21-ESRE-0051"). Under the latter, this work was granted access to the MesoNET resources center and the MesoNET Project under the allocation m26158. This work was also supported by the Agence Nationale de la Recherche through the project AVINEQ.
        </p>
      </article>
      <article className="research-item">
        <h2>Does universalization ethics justify participation in large elections?</h2>
        <h3>
          With Ingela Alger and Jean-François Laslier
          <br />
          <i>Under review at Theoretical Economics</i>
        </h3>
        <TurnoutPaperAbstract />
        <p>
          <b>Links:</b> <a href="/turnout-paper/">Bonus content</a> ·{" "}
          <a href="https://github.com/konrad-dierks/homo-moralis-turnout">
            GitHub repository
          </a>{" "}
          ·{" "}
          <a href="https://www.tse-fr.eu/publications/working-paper/does-universalization-ethics-justify-participation-large-elections-0">
            TSE working paper (2026)
          </a>
          <br />
          <b>Presented at:</b>
          <br />
          2025: QMUL Economics and Finance PhD workshop (London).
          <br />
          2024: EEA-ESEM Congress (Rotterdam), ESA European Meeting (Helsinki).
        </p>
        <p className="research-funding">
          This work was supported by a French government grant managed by the Agence Nationale de la Recherche under the "Investissements d'avenir" program (reference "ANR-18-EURE-0021").
        </p>
      </article>
    </section>
  </SiteLayout>
)

export const Head = () => <Seo title="Research" />

export default ResearchPage
