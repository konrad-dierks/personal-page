import * as React from "react"
import { GithubIcon } from "@sanity/icons"

const SiteFooter = ({ pageIcon = null }) => (
  <footer className="site-footer">
    <p>
      © {new Date().getFullYear()} Konrad Dierks &middot; Hosted on GitHub Pages
      &middot; Built with <a href="https://www.gatsbyjs.com">Gatsby</a>
    </p>
    <p>
      Source code:{" "}
      <span className="inline-link-with-icon">
        <GithubIcon className="link-icon" aria-hidden="true" />
        <a href="https://github.com/konrad-dierks/personal-page">
          https://github.com/konrad-dierks/personal-page
        </a>
      </span>
      <br></br>
      {pageIcon === "turnout" ? (
        <>
          The webpage icon "
          <a href="https://commons.wikimedia.org/w/index.php?curid=157180000">
            Arcticons-black emoji ballot box with ballot
          </a>
          " by Arcticons Team is licensed under{" "}
          <a
            rel="noopener noreferrer"
            href="https://creativecommons.org/licenses/by-sa/4.0/?ref=openverse"
          >
            CC BY-SA 4.0{" "}
          </a>
          . Modified for greater line width. On dark browser theme: further modified
          for color inversion.
          <br></br>
        </>
      ) : null}
      {pageIcon === "jmp" ? (
        <>
          The webpage icon "
          <a href="https://tabler.io/icons?icon=building-wind-turbine">
            building-wind-turbine
          </a>
          " from Tabler Icons by Paweł Kuna is licensed under the{" "}
          <a
            rel="noopener noreferrer"
            href="https://github.com/tabler/tabler-icons/blob/main/LICENSE"
          >
            MIT License
          </a>
          . Modified for reduced line width. On dark browser theme: further
          modified for color inversion.
          <br></br>
        </>
      ) : null}
      Third party packages: <a href="/notice">Notice</a>
    </p>
    <p>
      Contact: <a href="mailto:konrad.dierks@ecomail.fr">konrad.dierks@ecomail.fr</a>
    <br></br>
      I acknowledge funding from the French National Research Agency under the EUR grant ANR-18-EURE-0021, the grant ANR-21-ESRE-0051 (computing resources from the MesoNET resources center, allocation m26158), and the project AVINEQ.
    </p>
  </footer>
)

export default SiteFooter
