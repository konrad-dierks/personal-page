import * as React from "react"

// Shared by the research page and the per-paper pages

export const JobMarketPaperAbstract = () => (
  <p>
    The generation of wind and solar power is intermittent and uncertain, posing challenges to decarbonizing the electricity mix. I propose a dynamic stochastic model of wind and solar generation and optimal storage operation at the national level. The model is calibrated on German data and accounts for both flexible consumption and demand curtailment. Uncertainty and constraints on storage levels preclude an analytical solution. Evaluating the optimal operation numerically, I optimize over renewable and storage capacities to obtain the efficient electricity mix. With battery storage only and a 5% discount rate, the optimal 100% renewable mix features a welfare-adjusted levelized cost of 252&nbsp;€/MWh. In spite of its large round-trip losses, allowing for hydrogen storage reduces the optimal renewable capacities sharply and lowers this cost to 119&nbsp;€/MWh: batteries are prohibitively costly for providing the large stockpile required. Relative to perfect foresight over the observed decade, weather uncertainty mainly raises this stockpile, from 22 to 35 TWh of hydrogen storage, with small effects on other capacities and the levelized cost. The efficient mix is such that large amounts of electricity are produced with near-zero marginal value in many states. With a fossil backup, a non-negligible storage capacity only becomes optimal at a positive carbon price, and marginal abatement costs rise sharply close to zero emissions if there are no other low-carbon alternatives.
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
