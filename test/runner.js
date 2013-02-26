var Mocha = require('mocha')
var fs = require('fs')
var path = require('path')

var dir = process.argv[2]
var mocha = new Mocha({
    ui: 'qunit',
    reporter: 'list'
});


fs.readdirSync(dir).filter(function(file){
    // Only keep the .js files
    return file.substr(-3) === '.js';

}).forEach(function(file){
    // Use the method "addFile" to add the file to mocha
    mocha.addFile(
        path.join(dir, file)
    );
});

// Now, you can run the tests.
mocha.run(function(failures){
  process.exit(failures);
});
