import * as React from "react"

import SiteLayout from "../components/siteLayout"
import Seo from "../components/seo"

const IndexPage = () => (
  <SiteLayout>
    <section className="home-intro">
      <div className="home-text">
        <h1>Konrad Dierks</h1>
        <p>
          Hi, I am a fifth-year PhD student in the Environmental Group at Toulouse School of Economics.
          <br></br>
          My advisor is Christian Gollier.
        </p>
        <h2>Research interests</h2>
        <p>
          <b>Main: </b>Energy economics
          <br></br>
          <b>Secondary: </b>Political economics, optimization, and numerical methods
        </p>
        <p>
          My <a href="/research">main project</a> and upcoming job market paper is about the cost efficiency of a fully renewable electricity mix under weather uncertainty in Germany.
        </p>
      </div>
      <div className="home-photo" role="img" aria-label="Portrait placeholder">
        Photo coming soon
      </div>
    </section>
  </SiteLayout>
)

export const Head = () => <Seo title="Home" />

export default IndexPage
