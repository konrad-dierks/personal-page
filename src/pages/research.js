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
        <h2>Is a 100% renewable electricity mix viable and cost-efficient under weather uncertainty?</h2>
        <h3><i>Work in progress</i></h3>
        <p>
          I propose a dynamic stochastic model to characterize the socially efficient mix of solar and wind electric generation and battery and hydrogen storage capacities under weather uncertainty, with and without the possibility of a fossil fuel backup. The welfare function accounts for both flexible consumption and demand curtailment. I solve a two-stage problem: the optimal management of the mix under weather uncertainty allows me to quantify the social value of its components. Performing this numerically complex measure for a wide variety of mixes, this then allows me to determine the efficient electricity mix. Without hydrogen, a 100% renewable mix is expensive (185 €/MWh). In spite of its low energy efficiency, allowing for hydrogen reduces the optimal renewable capacities sharply and reduces the levelized cost of electricity to 109 €/MWh. However, without fossil backup, the efficient mix is such that large amounts of electricity are produced with near-zero marginal value in many states. With a fossil backup, a non-negligible storage capacity only becomes optimal at a positive carbon price and marginal abatement costs rise sharply close to zero emissions.
        </p>
        <p>
          <b>Draft available on request.</b>
          <br />
          <b>Presented at (selection):</b>
          <br />
          2025: EAERE conference (Bergen), FAERE conference (Nantes), ENTER Jamboree (Stockholm), UAB (Barcelona, ENTER exchange seminar), University of Leipzig lunchtime seminar.
          <br />
          2026: EDF (Paris), Doctorissimes (Paris), HYRCE (Liège), EEA-ESEM Conference (Dublin), IAEE European Conference (Munich)
        </p>
        <p className="research-funding">
          This work was supported by two French government grants managed by the Agence Nationale de la Recherche under the "Investissements d'avenir" program (references "ANR-18-EURE-0021", "ANR-21-ESRE-0051"). Under the latter, this work was granted access to the MesoNET resources center and the MesoNET Project under the allocation m26158. This work was also supported by the Agence Nationale de la Recherche through the project AVINEQ.
        </p>
      </article>
      <article className="research-item">
        <h2>Does universalization ethics justify participation in large elections?</h2>
        <h3>
          With Ingela Alger and Jean-François Laslier
        </h3>
        <p>
          We analyze the turnout decisions of ethical voters, equipped with (semi-)Kantian preferences: a voter considers the election outcome that would arise if other voters behaved like him. The “others” can be limited to co-partisans (“partisan ethics”) or not (“non-partisan ethics”). In a standard model with two candidates, a known underdog, a continuum of voters, and a continuous power-sharing rule, we introduce two novel elements: core constituent groups, and distinct election stakes for the two partisan groups. Under partisan ethics, when an equilibrium exists, turnout is positive for both sides if the election is not of the winner-take-all kind. Under non-partisan ethics an equilibrium always exists and turnout is positive for one side only. There sometimes exist equilibria where the underdog wins. Moreover, multiple equilibria sometimes arise, possibly with different winners. Voters further face a coordination problem under equilibrium multiplicity in the non-partisan case.
        </p>
        <p>
          <b>Links:</b> <a href="/turnout-paper/">Bonus content</a> ·{" "}
          <a href="https://github.com/konrad-dierks/homo-moralis-turnout">
            GitHub repository
          </a>{" "}
          ·{" "}
          <a href="https://www.tse-fr.eu/publications/does-universalization-ethics-justify-participation-large-elections-0">
            Paper
          </a>
          <br />
          <b>Presented at:</b>
          <br />
          2025: QMUL Economics and Finance PhD workshop (London).
          <br />
          2024: EEA-ESEM Congress (Rotterdam), ESA European Meeting (Helsinki).
        </p>
        <p className="research-funding">
          This work was by a French government grants managed by the Agence Nationale de la Recherche under the "Investissements d'avenir" program (reference "ANR-18-EURE-0021").
        </p>
      </article>
    </section>
  </SiteLayout>
)

export const Head = () => <Seo title="Research" />

export default ResearchPage
