'use strict';

const framework = require('./framework');

// Have a preference for red eyed people
function acceptMate(member1, member2) {
  // 20% chance that you mate with the person
  let chance = 0.2;
  if (framework.getEyeColor(member2) == framework.EYE_RED) {
    // 25% chance that I like the person if they have red eyes
    chance = 0.25;
  }

  return (Math.random() <= chance);
}

function childSurvives(child) {
  return Math.random() > 0.25;
}

const options = {
  acceptMate,
  childSurvives
}
framework.runner(options);
