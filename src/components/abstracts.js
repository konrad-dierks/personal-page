import * as React from "react"

// Shared by the research page and the per-paper pages

export const JobMarketPaperAbstract = () => (
  <p>
    Renewables (wind and solar) do not emit greenhouse gases, but their output is highly uncertain and intermittent. This raises the question of how costly a 100% renewable electricity mix would be, and how this cost depends on the cost and efficiency of the available storage technologies. I study these questions in a dynamic stochastic model of wind and solar power generation and storage. The model is calibrated on German data and accounts for both flexible consumption and demand curtailment. I first solve numerically for the optimal operation of given generation and storage capacities, using a semi-Lagrangian scheme with relative value iteration. I then optimize over renewable and storage capacities to obtain the efficient electricity mix. With battery storage only and a 5% discount rate, the optimal 100% renewable mix requires multiplying the 2025 wind and solar capacities about sevenfold, at a welfare-adjusted levelized cost of 285&nbsp;€/MWh. Allowing for lossy, yet inexpensive, hydrogen storage reduces the optimal renewable capacities sharply and lowers this cost to 142&nbsp;€/MWh. Relative to perfect foresight over the observed decade, weather uncertainty mainly raises the optimal hydrogen storage capacity, from 23 to 35 TWh. With a fossil backup, a non-negligible storage capacity becomes optimal only at a positive carbon price, and marginal abatement costs rise sharply close to zero emissions if there are no other low-carbon alternatives.
  </p>
)

export const TurnoutPaperAbstract = () => (
  <>
    <p>
      Why would voters incur costs to cast votes they believe are inconsequential? We show that a form of universalization ethics can help explain this "paradox of costly voting." The political model has two candidates, a continuum of voters, a known underdog, and two novel elements: core voters (who always vote), and distinct election stakes for the partisan groups. Elections are modeled as power-sharing institutions, winner-take-all being a limit case. Cost-sensitive voters, whose turnout behavior we analyze, consider the election outcome, should their decision be universalized to other voters. The "others" can be limited to co-partisans ("partisan ethics") or not ("nonpartisan ethics"). In contrast to most of the literature, we do not impose conditions ensuring existence and uniqueness.
    </p>
    <p>
      The universalization ethics often fosters participation, but coordination problems remain. Equilibrium can fail to exist under partisan ethics, and equilibrium multiplicity can arise under both partisan and nonpartisan ethics. Equilibria where the underdog wins may coexist with equilibria where the topdog wins. The former are sustained because of a boost of cost-sensitive voters' willingness to vote, stemming either from a large core constituency or from a high stake. In this case, the core constituency is a complement rather than a substitute for the cost-sensitive voters.
    </p>
  </>
)
