const inkPlayer = require('../../lib/inkPlayer');
const config = require('../../../lib/configuration').getConfiguration('MUSIC', 'REST', 'V3');

function runInkTests(ink) {
  module.exports[config.header + ' checkUndoRedo ' + ink.name] = function checkUndoRedo(browser) {
    inkPlayer.checkUndoRedo(browser, config, ink.exports.MUSICXML, ink.labels, '#editor', '[data-key=MUSICXML]');
  };
}

config.inks
   .forEach(ink => runInkTests(ink));
