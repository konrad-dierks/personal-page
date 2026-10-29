import * as React from "react"

// Content shown on the per-paper pages

export const JobMarketPaperAbstract = () => (
  <p className="paper-abstract">
    Renewables (wind and solar) do not emit greenhouse gases, but their output
    is highly uncertain and intermittent. This raises the question of how costly
    a 100% renewable electricity mix would be, and how this cost depends on the
    cost and efficiency of the available storage technologies. I study these
    questions in a dynamic stochastic model of wind and solar power generation
    and storage. The model is calibrated on German data and accounts for both
    flexible consumption and demand curtailment. I first solve numerically for
    the optimal operation of given generation and storage capacities, using a
    semi-Lagrangian scheme with relative value iteration. I then optimize over
    renewable and storage capacities to obtain the efficient electricity mix.
    With battery storage only and a 5% discount rate, the optimal 100% renewable
    mix requires multiplying the 2025 wind and solar capacities about sevenfold,
    at a welfare-adjusted levelized cost of 285&nbsp;€/MWh. Allowing for lossy,
    yet inexpensive, hydrogen storage reduces the optimal renewable capacities
    sharply and lowers this cost to 142&nbsp;€/MWh. Relative to perfect
    foresight over the observed decade, weather uncertainty mainly raises the
    optimal hydrogen storage capacity, from 23 to 35 TWh. With a fossil backup,
    a non-negligible storage capacity becomes optimal only at a positive carbon
    price, and marginal abatement costs rise sharply close to zero emissions if
    there are no other low-carbon alternatives.
  </p>
)

export const TurnoutPaperAbstract = () => (
  <div className="paper-abstract">
    <p>
      Why would voters incur costs to cast votes they believe are
      inconsequential? We show that a form of universalization ethics can help
      explain this "paradox of costly voting." The political model has two
      candidates, a continuum of voters, a known underdog, and two novel
      elements: core voters (who always vote), and distinct election stakes for
      the partisan groups. Elections are modeled as power-sharing institutions,
      winner-take-all being a limit case. Cost-sensitive voters, whose turnout
      behavior we analyze, consider the election outcome, should their decision
      be universalized to other voters. The "others" can be limited to
      co-partisans ("partisan ethics") or not ("nonpartisan ethics"). In
      contrast to most of the literature, we do not impose conditions ensuring
      existence and uniqueness.
    </p>
    <p>
      The universalization ethics often fosters participation, but coordination
      problems remain. Equilibrium can fail to exist under partisan ethics, and
      equilibrium multiplicity can arise under both partisan and nonpartisan
      ethics. Equilibria where the underdog wins may coexist with equilibria
      where the topdog wins. The former are sustained because of a boost of
      cost-sensitive voters' willingness to vote, stemming either from a large
      core constituency or from a high stake. In this case, the core
      constituency is a complement rather than a substitute for the
      cost-sensitive voters.
    </p>
  </div>
)

// List years in ascending order, so the list ends with the most recent year
export const JobMarketPaperPresentations = () => (
  <p>
    <b>Presented at (selection):</b>
    <br />
    2025: EAERE conference (Bergen), FAERE conference (Nantes), ENTER Jamboree
    (Stockholm), UAB (Barcelona, ENTER exchange seminar), University of Leipzig
    lunchtime seminar.
    <br />
    2026: EDF (Paris), Doctorissimes (Paris), HYRCE (Liège), EEA-ESEM Congress
    (Dublin), IAEE European Conference (Munich), IAEE COP Symposium (Antalya,
    upcoming)
  </p>
)

export const TurnoutPaperPresentations = () => (
  <p>
    <b>Presented at:</b>
    <br />
    2024: EEA-ESEM Congress (Rotterdam), ESA European Meeting (Helsinki).
    <br />
    2025: QMUL Economics and Finance PhD workshop (London).
  </p>
)

export const JobMarketPaperFunding = () => (
  <p className="research-funding">
    This work was supported by two French government grants managed by the
    Agence Nationale de la Recherche under the "Investissements d'avenir"
    program (references "ANR-18-EURE-0021", "ANR-21-ESRE-0051"). Under the
    latter, this work was granted access to the MesoNET resources center and the
    MesoNET Project under the allocation m26158. This work was also supported by
    the Agence Nationale de la Recherche through the project AVINEQ.
  </p>
)

export const TurnoutPaperFunding = () => (
  <p className="research-funding">
    This work was supported by a French government grant managed by the Agence
    Nationale de la Recherche under the "Investissements d'avenir" program
    (reference "ANR-18-EURE-0021").
  </p>
)
