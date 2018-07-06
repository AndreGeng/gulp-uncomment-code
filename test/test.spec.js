const expect = require('chai').expect;
const File = require('vinyl');
const uncommentCode = require('../index');

describe('gulp-uncomment-code', function() {
  it('should work as expected in buffer mode', function() {
    const fakeFile = new File({
      contents: new Buffer(`
      // uncomment-in-development-start
      // contents in between1
      // contents in between2
      // uncomment-in-development-end


      /* uncomment-in-development-start
      contents in between3
      contents in between4
      uncomment-in-development-end */


      /* uncomment-in-development-start */
      // contents in between5
      // contents in between6
      /* uncomment-in-development-end */`
      ),
    });
    const myUncommentCode = uncommentCode();
    myUncommentCode.write(fakeFile);
    myUncommentCode.once('data', (file) => {
      const contents = file.contents.toString();
      expect(contents.replace(/\n[\t\ ]*/g, '\n')).to.equal(`
contents in between1
contents in between2


contents in between3
contents in between4


contents in between5
contents in between6
`);
    });
  });
});
