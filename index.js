"use strict";

var url  = require('url'),
    fs   = require('fs'),
    path = require('path'),
    mime = require('mime');

module.exports = function (tasks, stylecow) {

    tasks.addTask({
        filter: {
            type: 'Declaration',
            name: [
                'background',
                'background-image'
            ]
        },
        fn: function (declaration) {
            declaration
                .getAll({
                    type: 'Function',
                    name: 'url'
                })
                .forEach(fn => embed(fn));
        }
    });

    function embed (fn) {
        var string = fn.get('String');
        var file   = string.name;

        //is absolute?
        if (url.parse(file).hostname || (file[0] === '/')) {
            return;
        }

        //get the root file
        var rootFile = fn.getAncestor('Root').getData('file');

        if (!rootFile) {
            return;
        }

        file = path.join(path.dirname(rootFile), file);
        var stat = fs.statSync(file);

        if (stat.size > (1024 * 3)) { //3Kb
            return;
        }

        var mimetype = mime.lookup(file);

        switch (mimetype) {
            case 'image/jpeg':
            case 'image/jpg':
            case 'image/png':
            case 'image/gif':
                string.name = 'data:' + mimetype + ';base64,' + fs.readFileSync(file).toString('base64');
                break;
        }
    }
};
