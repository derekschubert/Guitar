/**
 * Util/Music provides foundational music related
 * constants (notes, scales, etc)
 */

// apfTuning = [2, 9, 4, 9, 1, 4];
// standardTuning = [4, 9, 2, 7, 11, 4];

const notes = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];
const sharps = [0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0];

const scales = {
  'major': {
    name: 'major', 
    short: 'maj', 
    pattern: [2, 2, 1, 2, 2, 2, 1],
    notes: [0, 2, 4, 5, 7, 9, 11],
  },
  'minor': {
    name: 'minor', 
    short: 'm', 
    pattern: [2, 1, 2, 2, 1, 2, 2],
    notes: [0, 2, 3, 5, 7, 8, 10],
  },
};

const allScales = (() => {
  let as = {};
  Object.getOwnPropertyNames(scales).forEach(s => {
    as[s] = {};

    for (let i = 0; i < notes.length; i++) {
      let scale = [];
      for (let j = 0; j < scales[s].notes.length; j++) {
        scale.push((scales[s].notes[j] + i) % 12);
      }
      as[s][i] = {
        note: notes[i],
        noteIndex: i,
        scale,
        scaleType: s,
        full: `${notes[i].toUpperCase()}${scales[s].short}`,
      };
    }

  });
  return as;
})();

const displayTuning = (tuning) => tuning.map(ni => notes[ni].toUpperCase()).join(' ');

export {
  notes,
  sharps,
  displayTuning,
  scales,
  allScales,
}