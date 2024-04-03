// migrations/1_deploy_contract.js
const YourContract = artifacts.require("main");

module.exports = function(deployer) {
  deployer.deploy(YourContract);
};
