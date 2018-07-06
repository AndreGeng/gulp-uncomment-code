const through = require('through2');
const PluginError = require('plugin-error');

const PLUGIN_NAME = 'gulp-uncomment-code';

/**
 * 在开发环境下, uncomment用于测试目的的代码块
 *
 * @param options
 * @param options.startComment [uncomment-in-develop-start] 代码块开始标识
 * @param options.endComment [uncomment-in-develop-end] 代码块结束标识
 *
 **/

module.exports = function(options) {
  const defaultOptions = {
    startComment: 'uncomment-in-development-start',
    endComment: 'uncomment-in-development-end',
  };
  const opts = Object.assign({}, defaultOptions, options);
  const {
    startComment,
    endComment,
  } = opts;
  const reg = new RegExp(`(?:[\\t\\ ]*)(?:\\/\\/|\\/\\*)(?:[\\t\\ ]*)${startComment}(?:[\\t\\ ]*)(?:\\*\\/)*\n([\\s\\S]*?)(?:[\\t\\ ]*)(?:\\/\\/|\\/\\*)*(?:[\\t\\ ]*)${endComment}(?:[\\t\\ ]*)(?:\\*\\/)*\\n?`, 'g');
  return through.obj(function (file, encoding, callback) {
    if (file.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streams not supported!'));
      callback();
    } else if (file.isBuffer()) {
      const contents = file.contents.toString();
      let contentsProcessed = file.contents.toString();
      let match;
      let processed = false;
      while (match = reg.exec(contents)) {
        const uncommentCode = match[1].replace(/\/\/|\\\*|\*\//g, '');
        contentsProcessed = contentsProcessed.replace(match[0], uncommentCode);
        processed = true;
      }
      if (processed) {
        file.contents = Buffer.from(contentsProcessed);
      }
      this.push(file);
      callback();
    }
  });
}
