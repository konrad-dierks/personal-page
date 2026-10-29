import * as React from "react"
import { Link, withPrefix } from "gatsby"

import SiteLayout from "../components/siteLayout"
import Seo from "../components/seo"

const IndexPage = () => (
  <SiteLayout>
    <section className="home-intro">
      <div className="home-text">
        <h1>Konrad Dierks</h1>
        <p>
          Hi, I am a fifth-year PhD student in the Environmental Group at
          Toulouse School of Economics.
          <br></br>
          My advisor is Christian Gollier.
        </p>
        <h2>Research interests</h2>
        <p>
          <b>Main: </b>Environmental and Energy Economics
          <br></br>
          <b>Secondary: </b>Political economics, optimization, and numerical
          methods
        </p>
        <p>
          My main <Link to="/research/">research</Link> project and upcoming{" "}
          <a
            href={withPrefix("/jmp.pdf")}
            target="_blank"
            rel="noopener noreferrer"
          >
            job market paper
          </a>{" "}
          is about the cost efficiency of a fully renewable electricity mix
          under weather uncertainty in Germany.
        </p>
        <p>
          <b>Email: </b>
          <a href="mailto:konrad.dierks@tse-fr.eu">konrad.dierks@tse-fr.eu</a>
        </p>
      </div>
      <figure className="home-figure">
        <img
          className="home-photo"
          src={withPrefix("/photo_cropped.webp")}
          alt="Portrait of Konrad Dierks"
          width="800"
          height="1066"
        />
        <figcaption className="home-photo-credit">
          Photo: Loïc Bourniquel
        </figcaption>
      </figure>
    </section>
  </SiteLayout>
)

export const Head = () => <Seo title="Home" />

export default IndexPage
