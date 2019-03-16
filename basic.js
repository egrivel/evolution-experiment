'use strict';

const framework = require('./framework');

function acceptMate() {
  // 20% chance that you mate with the person
  let chance = 0.2;
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
