const Hospital = artifacts.require("Hospital.sol");
const Merge = artifacts.require("Merge.sol");


module.exports = function(deployer) {
      deployer.deploy(Hospital);
      deployer.deploy(Merge);
};

