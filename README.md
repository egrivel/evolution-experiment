# Evolution Experiment

This repo contains some experiments with evolution. After generating
an initial population, the process runs through a mating period, after
which the mated pairs produce offspring, which result in the new
population, which grows up until it's time for their mating period.

## Eye Color

Eye color is a genetically inherited attribute central to the simulation.
The eye color gene can either be GENE_1 or GENE_2. Every individual in
the population has two instances of the gene, one inherited from the
father, one inherited from the mother. The combination of gene values
determines the eye color:
 - Red: both instances are GENE_1.
 - Green: both instances are GENE_2.
 - Yellow: one instance of GENE_1 and one instance of GENE_2.

## Mating

Every generation starts out, when they grow up, with mating. The simulation of
the mating process is as follows:
 - Select a random male
    - Present the male with a random female
    - He accepts or rejects the female
       - if he accepts, they become a pair and are taken out of the pool of
         eligle individuals
       - if he rejects, repeat the process with the next female
    - If after a number of tries no female is accepted, the male gives up
      and becomes an old spinster (is taken out of the pool of eligible
      individuals)
 - Select a random female
    - Repeat the same process as above, but with genders reversed
 - Repeat until there are only a few individuals left in the pool, who all
   do not end up mating.

## Procreation

## `node basic.js`

Run the very basic simulator. It sets up a population whose eye color
is defined by genetics.

Expected results: on average, after each simulation runs, 25% of the population
will have red eye color, 25% will have green, and 50% will have yellow eye
colors.

Actual results: on a population of 1000 individuals, the expected results match
tries with up to about 100
generations. Once we get beyond 100 generations, however, the numbers start
to go towards 33% each. This may be because once one of the two gene values
is lost in the population, it won't be coming back. For instance, with
100 generations, around 25.6% of the population will have red or green
eyes. With 200 generations, around 26.5% of the population will have red or
green eye colors. By 1000 generations, the numbers are closer to 32% for red
or green eyes.


