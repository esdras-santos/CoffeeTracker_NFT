const MOY = artifacts.require("MOY");

module.exports = async function (deployer) {
  await deployer.deploy(MOY)
};
