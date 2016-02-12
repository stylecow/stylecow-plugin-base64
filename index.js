"use strict";

const url  = require('url'),
      fs   = require('fs'),
      path = require('path'),
      mime = require('mime');

module.exports = function (tasks) {

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
        let string = fn.get('String'),
            file   = string.name;

        //is absolute?
        if (url.parse(file).hostname || (file[0] === '/')) {
            return;
        }

        //get the root file
        let rootFile = fn.getAncestor('Root').getData('file');

        if (!rootFile) {
            return;
        }

        file = path.join(path.dirname(rootFile), file);
        let stat = fs.statSync(file);

        if (stat.size > (1024 * 5)) { //5Kb
            return;
        }

        let mimetype = mime.lookup(file);

        if (mimetype.indexOf('image/') === 0) {
            let buffer;

            if (mimetype === 'image/svg+xml') {
                buffer = fs.readFileSync(file).toString();
                let pos = buffer.indexOf('<svg');

                if (pos === -1) {
                    return;
                }

                buffer = new Buffer(buffer.substr(pos));
            } else {
                buffer = fs.readFileSync(file);
            }

            string.name = 'data:' + mimetype + ';base64,' + buffer.toString('base64');
        }
    }
};
