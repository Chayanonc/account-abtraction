import { ethers } from "hardhat";

const ENTRYPOINT = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

async function main() {
  const acountAddress = "0xa16E02E87b7454126E5E10d957A927A7F5B5d2be";
  const account = (await ethers.getContractAt("Account", acountAddress)) as any;

  const count = await account.count();
  console.log("count", count);

  // const code = await ethers.provider.getCode(ENTRYPOINT);
  // console.log(code);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
