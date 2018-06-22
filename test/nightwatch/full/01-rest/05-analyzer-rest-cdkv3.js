const inkPlayer = require('../../lib/inkPlayer');
const config = require('../../../lib/configuration').getConfiguration('ANALYZER', 'REST', 'V3');

function runInkTests(ink) {
  module.exports[config.header + ' checkUndoRedo ' + ink.name] = function checkUndoRedo(browser) {
    inkPlayer.checkUndoRedo(browser, config, ink.exports.ANALYSIS, ink.labels, '#editor', '[data-key=ANALYSIS]');
  };
}

config.inks
   .forEach(ink => runInkTests(ink));
