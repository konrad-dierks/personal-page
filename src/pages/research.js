import * as React from "react"

import SiteLayout from "../components/siteLayout"
import Seo from "../components/seo"

const ResearchPage = () => (
  <SiteLayout>
    <section>
      <h1>Research</h1>
    </section>
    <section className="research-list">
      <article className="research-item">
        <h2>Is a 100% renewable electricity mix cost-efficient under weather uncertainty?</h2>
        <h3><i>Job Market Paper</i></h3>
        <p>
          The generation of wind and solar power is intermittent and uncertain, posing challenges to decarbonizing the electricity mix. I propose a dynamic stochastic model of wind and solar generation and optimal storage operation at the national level. The model is calibrated on German data and accounts for both flexible consumption and demand curtailment. Uncertainty and constraints on storage levels preclude an analytical solution. Evaluating the optimal operation numerically, I optimize over renewable and storage capacities to obtain the efficient electricity mix. With battery storage only and a 5% discount rate, the optimal 100% renewable mix features a welfare-adjusted levelized cost of 252&nbsp;€/MWh. In spite of its large round-trip losses, allowing for hydrogen storage reduces the optimal renewable capacities sharply and lowers this cost to 119&nbsp;€/MWh: batteries are prohibitively costly for providing the large stockpile required. Relative to perfect foresight over the observed decade, weather uncertainty mainly raises this stockpile, from 22 to 35 TWh of hydrogen storage, with small effects on other capacities and the levelized cost. The efficient mix is such that large amounts of electricity are produced with near-zero marginal value in many states. With a fossil backup, a non-negligible storage capacity only becomes optimal at a positive carbon price, and marginal abatement costs rise sharply close to zero emissions if there are no other low-carbon alternatives.
        </p>
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
        <p>
          Why would voters incur costs to cast votes they believe are inconsequential? We show that a form of universalization ethics can help explain this "paradox of costly voting." The political model has two candidates, a continuum of voters, a known underdog, and two novel elements: core voters (who always vote), and distinct election stakes for the partisan groups. Elections are modeled as power-sharing institutions, winner-take-all being a limit case. Cost-sensitive voters, whose turnout behavior we analyze, consider the election outcome, should their decision be universalized to other voters. The "others" can be limited to co-partisans ("partisan ethics") or not ("nonpartisan ethics"). In contrast to most of the literature, we do not impose conditions ensuring existence and uniqueness.
        </p>
        <p>
          The universalization ethics often fosters participation, but coordination problems remain. Equilibrium can fail to exist under partisan ethics, and equilibrium multiplicity can arise under both partisan and nonpartisan ethics. Equilibria where the underdog wins may coexist with equilibria where the topdog wins. The former are sustained because of a boost of cost-sensitive voters' willingness to vote, stemming either from a large core constituency or from a high stake. In this case, the core constituency is a complement rather than a substitute for the cost-sensitive voters.
        </p>
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
