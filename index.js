var path = require('path'),
    xml2js = require('xml2js'),
    glob = require('glob'),
    exec = require('child_process').exec;

function getCmd() {
    var arch = process.arch.match(/64/) ? '64' : '32';

    switch (process.platform) {
        case 'darwin':
            return safeLocalPath(path.join(__dirname, '/lib/osx64/mediainfo'));
        case 'win32':
            return safeLocalPath(path.join(__dirname, '/lib/win32/mediainfo.exe'));
        case 'linux':
            return "LD_LIBRARY_PATH=" + safeLocalPath(path.join(__dirname, '/lib/linux' + arch)) + " " + safeLocalPath(path.join(__dirname, '/lib/linux' + arch, '/mediainfo'));
    }
}

function buildOutput(obj) {
    var out = {};
    var idVid = idAud = idTex = idOth = 0;

    for (var i in obj.track) {
        if (obj.track[i]['$']['type'] === 'General') {
            out.file = obj.track[i]['Complete_name'][0];
            out.general = {};
            for (var f in obj.track[i]) {
                if (f !== '$') out.general[f.toLowerCase()] = obj.track[i][f];
            }
        } else if (obj.track[i]['$']['type'] === 'Video') {
            if (!idVid) out.video = [];
            out.video[idVid] = {};
            for (var f in obj.track[i]) {
                if (f !== '$') out.video[idVid][f.toLowerCase()] = obj.track[i][f];
            }
            idVid++;
        } else if (obj.track[i]['$']['type'] === 'Audio') {
            if (!idAud) out.audio = [];
            out.audio[idAud] = {};
            for (var f in obj.track[i]) {
                if (f !== '$') out.audio[idAud][f.toLowerCase()] = obj.track[i][f];
            }
            idAud++;
        } else if (obj.track[i]['$']['type'] === 'Text') {
            if (!idTex) out.text = [];
            out.text[idTex] = {};
            for (var f in obj.track[i]) {
                if (f !== '$') out.text[idTex][f.toLowerCase()] = obj.track[i][f];
            }
            idTex++;
        } else {
            if (!idOth) out.other = [];
            out.other[idOth] = {};
            for (var f in obj.track[i]) {
                if (f !== '$') out.other[idOth][f.toLowerCase()] = obj.track[i][f];
            }
            idOth++;
        }
    }
    return out;
}

function buildJson(xml) {
    return new Promise(function (resolve, reject) {
        xml2js.parseString(xml, function (err, obj) {
            if (err) return reject(err);
            if (!obj['Mediainfo']) return reject('Something went wrong');

            obj = obj['Mediainfo'];

            var out = [];

            if (Array.isArray(obj.File)) {
                for (var i in obj.File) {
                    out.push(buildOutput(obj.File[i]));
                }
            } else {
                out.push(buildOutput(obj.File));
            }

            resolve(out);
        });
    });
}

/*
 Convert local file path to a more safe path for shell exec command use
 */
function safeLocalPath(path) {
    path = path.replace(/'/g, "'\"'\"'"); // escape single qoute
    path = "'" + path + "'";// wrap with single qoutes
    return path;
}

module.exports = function MediaInfo() {
    var args = [].slice.call(arguments);
    var cmd_options = typeof args[0] === "object" ? args.shift() : {};
    var cmd = [];

    cmd.push(getCmd()); // base command
    cmd.push('--Output=XML --Full'); // args
    Array.prototype.slice.apply(args).forEach(function (val, idx) {
        var files = glob.sync(val, {cwd: (cmd_options.cwd || process.cwd()), nonull: true});
        for (var i in files) {
            cmd.push(safeLocalPath(files[i])); // files
        }
    });

    return new Promise(function (resolve, reject) {
        exec(cmd.join(' '), cmd_options, function (error, stdout, stderr) {
            if (error !== null || stderr !== '') return reject(error || stderr);
            buildJson(stdout).then(resolve).catch(reject);
        });
    });
};
