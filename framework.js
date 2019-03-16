'use strict';

const POPULATION_SIZE = 1000;
const NR_GENERATIONS = 100;
const NR_RUNS = 100;

const MALE = 'Male';
const FEMALE = 'Female';
const MATE_TRIES = 10;

const GENE_1 = 'g1';
const GENE_2 = 'g2';

const EYE_GREEN = 'Green';
const EYE_RED = 'Red';
const EYE_YELLOW = 'Yellow';

function runner(options) {
  let redTotal = 0;
  let greenTotal = 0;
  let yellowTotal = 0;

  console.log('=======================================');
  console.log('Parameters:');
  console.log('   Population size      : ' + POPULATION_SIZE);
  console.log('   Generations per run  : ' + NR_GENERATIONS);
  console.log('   Number of simulations: ' + NR_RUNS);
  // console.log('   Blue-eye disadvantage: ' + blueDisadvantage);

  for (let i = 1; i <= NR_RUNS; i++) {
    process.stdout.write('Run #' + i + '\r');
    const { percRed, percGreen, percYellow, avgPref } = doRun(options);
    redTotal += percRed;
    greenTotal += percGreen;
    yellowTotal += percYellow;
  }

  console.log('Run results:');
  console.log('   Average percentage of red eyes    : ' + Math.floor(100 * redTotal / NR_RUNS) / 100);
  console.log('   Average percentage of green eyes  : ' + Math.floor(100 * greenTotal / NR_RUNS) / 100);
  console.log('   Average percentage of yellow eyes : ' + Math.floor(100 * yellowTotal / NR_RUNS) / 100);
}

function doRun(options) {
  let population = createPopulation();

  for (let i = 1; i <= NR_GENERATIONS; i++) {
    const matedPairs = doMating(options, population);
    const children = doProcreation(options, matedPairs);
    population = doCull(children);
  }

  return calculateRunResult(population);
}

function createPopulation() {
  const population = [];

  for (let i = 0; i < POPULATION_SIZE; i++) {
    population.push(generateMember());
  }

  return population;
}

function generateMember() {
  const member = {};

  if (Math.random() < 0.5) {
    member.gender = MALE;
  } else {
    member.gender = FEMALE;
  }

  member.eyeGenes = [];
  for (let i = 0; i < 2; i++) {
    const gene = (Math.random() < 0.5) ? GENE_1 : GENE_2;
    member.eyeGenes.push(gene);
  }

  member.prefs = [];
  for (let i = 0; i < 2; i++) {
    // value between 0.25 inclusive and 0.75 exclusive
    member.prefs.push(0.25 + Math.random() / 2);
  }

  return member;
}

function calculateRunResult(population) {
  let numRed = 0;
  let numYellow = 0;
  let numGreen = 0;
  let totalPref = 0;
  let count = 0;

  population.forEach(item => {
    switch (getEyeColor(item)) {
      case EYE_GREEN:
        numGreen++;
        break;
      case EYE_YELLOW:
        numYellow++;
        break;
      case EYE_RED:
        numRed++;
        break;
    }
    totalPref += item.prefs[0] + item.prefs[1];
    count++;
  });

  const percRed = 100 * numRed / count;
  const percYellow = 100 * numYellow / count;
  const percGreen = 100 * numGreen / count;
  const avgPref = totalPref / (2 * count);
  return { percRed, percYellow, percGreen, avgPref };
}

function getEyeColor(member) {
  if (member.eyeGenes[0] === GENE_1 && member.eyeGenes[1] === GENE_1) {
    return EYE_RED;
  }
  if (member.eyeGenes[0] === GENE_2 && member.eyeGenes[1] === GENE_2) {
    return EYE_GREEN;
  }
  return EYE_YELLOW;
}

function doMating(options, population) {
  const matedPairs = [];

  const males = [];
  const females = [];

  population.forEach(item => {
    if (item.gender === MALE) {
      males.push(item);
    } else {
      females.push(item);
    }
  })

  while (males.length > MATE_TRIES && females.length > MATE_TRIES) {
    let maleCandidateNr = Math.floor(males.length * Math.random());
    let femaleCandidateNr = findMate(options, males[maleCandidateNr], females);
    if (femaleCandidateNr >= 0) {
      const matedPair = {
        male: males[maleCandidateNr],
        female: females[femaleCandidateNr]
      }
      matedPairs.push(matedPair);
      males.splice(maleCandidateNr, 1);
      females.splice(femaleCandidateNr, 1);
    }

    femaleCandidateNr = Math.floor(females.length * Math.random());
    maleCandidateNr = findMate(options, females[femaleCandidateNr], males);
    if (maleCandidateNr >= 0) {
      const matedPair = {
        male: males[maleCandidateNr],
        female: females[femaleCandidateNr]
      }
      matedPairs.push(matedPair);
      males.splice(maleCandidateNr, 1);
      females.splice(femaleCandidateNr, 1);
    }

    // console.log('males: ' + males.length + ', females: ' + females.length);
  }
  return matedPairs;
}

function findMate(options, candidate, list) {
  for (let i = 0; i < MATE_TRIES; i++) {
    let otherCandidateNr = Math.floor(list.length * Math.random());

    if (options.acceptMate(candidate, list[otherCandidateNr])) {
      return otherCandidateNr;
    }
  }
  return -1;
}


function doProcreation(options, matedPairs) {
  const children = [];

  while (children.length <= POPULATION_SIZE) {
    matedPairs.forEach(pair => {
      const child = createChild(options, pair);
      if (child) {
        // If the potential child survives to adulthood
        children.push(child);
      }
    });
  }

  return children;
}

function createChild(options, pair) {
  const child = {};

  if (Math.random() < 0.5) {
    child.gender = MALE;
  } else {
    child.gender = FEMALE;
  }

  child.eyeGenes = [];
  let nr = Math.floor(2 * Math.random());
  child.eyeGenes[0] = pair.male.eyeGenes[nr];
  nr = Math.floor(2 * Math.random());
  child.eyeGenes[1] = pair.female.eyeGenes[nr];

  child.prefs = [];
  nr = Math.floor(2 * Math.random());
  child.prefs[0] = pair.male.prefs[nr];
  nr = Math.floor(2 * Math.random());
  child.prefs[1] = pair.female.prefs[nr];

  if (options.childSurvives(child)) {
    return child;
  }

  return null;
}

function doCull(list) {
  while (list.length > POPULATION_SIZE) {
    const nrToCull = Math.floor(list.length * Math.random());
    list.splice(nrToCull, 1);
  }
  return list;
}

const framework = {
  EYE_GREEN,
  EYE_RED,
  EYE_YELLOW,
  getEyeColor,
  runner: runner
};

module.exports = framework;
