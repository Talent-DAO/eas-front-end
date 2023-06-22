import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const deployPublicationReview: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const sepoliaEASAddress = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e";

  await deploy("PublicationReview", {
    from: deployer,
    args: [sepoliaEASAddress, "0xE849b2a694184B8739a04C915518330757cDB18B"],
    log: true,
    autoMine: true,
  });
};

export default deployPublicationReview;

deployPublicationReview.tags = ["PublicationReview"];
