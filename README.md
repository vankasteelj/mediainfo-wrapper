# mediainfo-wrapper

node wrapper for mediainfo.

This product uses [MediaInfo](http://mediaarea.net/MediaInfo) library, Copyright (c) 2002-2014 [MediaArea.net SARL](mailto:Info@MediaArea.net)

_Warning: contains 24MiB of binaries for osx, linux, windows. You can delete the platforms you don't need_

### Usage

    npm install mediainfo-wrapper

then:

```js
var mi = require('mediainfo-wrapper');
mi('foo/bar.mkv', 'foo/bar2.avi').then(function(data) {
  for (var i in data) {
    console.log('%s parsed', data[i].file);
    console.log('MediaInfo data:', data[i]);
  }
}).catch(function (e){console.error(e)});
```

### Cleaning unneccesary binaries

You can clean unneeded binaries, with gulp for example:

```js
var del = require('del');
var path = require('path');

// clean mediainfo-wrapper
gulp.task('clean:mediainfo', () => {
    return Promise.all(nw.options.platforms.map((platform) => {
        const sources = path.join('build', pkJson.name, platform);
        return del([
            path.join(sources, 'node_modules/mediainfo-wrapper/lib/*'),
            '!'+path.join(sources, 'node_modules/mediainfo-wrapper/lib/'+platform)
        ]);
    }));
});
```

### License
The MIT License

- Copyright (c) 2016 vankasteelj

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.