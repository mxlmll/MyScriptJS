'use strict';

describe('MyScriptJS: output/music/musicTie.js', function () {

    it('MusicTie object exist', function () {
        expect(MyScript.MusicTie).to.exist;
        expect(MyScript.MusicTie).not.to.be.null;
        expect(MyScript.MusicTie).to.not.be.undefined;
    });

});