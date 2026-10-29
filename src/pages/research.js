import * as React from "react"
import { Link, withPrefix } from "gatsby"

import SiteLayout from "../components/siteLayout"
import Seo from "../components/seo"

const ResearchPage = () => (
  <SiteLayout>
    <section>
      <h1>Research</h1>
    </section>
    <section className="research-list">
      <article className="research-item">
        <p>
          <b>
            Is a 100% renewable electricity mix cost-efficient under weather
            uncertainty?
          </b>
          <br />
          Job Market Paper
          <br />
          <Link to="/job-market-paper/">Abstract</Link> ·{" "}
          <a
            href={withPrefix("/jmp.pdf")}
            target="_blank"
            rel="noopener noreferrer"
          >
            Paper (PDF)
          </a>
        </p>
      </article>
      <article className="research-item">
        <p>
          <b>
            Does universalization ethics justify participation in large
            elections?
          </b>
          <br />
          With Ingela Alger and Jean-François Laslier, under review at
          Theoretical Economics
          <br />
          <Link to="/turnout-paper/">Abstract and bonus content</Link> ·{" "}
          <a
            href="https://github.com/konrad-dierks/homo-moralis-turnout"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub repository
          </a>{" "}
          ·{" "}
          <a
            href="https://www.tse-fr.eu/publications/working-paper/does-universalization-ethics-justify-participation-large-elections-0"
            target="_blank"
            rel="noopener noreferrer"
          >
            TSE working paper (2026)
          </a>
        </p>
      </article>
    </section>
  </SiteLayout>
)

export const Head = () => <Seo title="Research" />

export default ResearchPage
