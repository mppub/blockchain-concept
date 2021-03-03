const Blockchain = require("./blockchain");


const bch = new Blockchain()
bch.addBlock(['abc']);
bch.addBlock([{ahoj: 123}]);
console.log('bch.blocks', bch.blocks)
console.log('bch.validate', bch.validate())