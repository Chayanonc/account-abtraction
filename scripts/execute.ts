import { ethers } from "hardhat";

async function main() {
  const ACOUNT_NONCE = 1;
  const ACOUNT_FACTORY = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const ENTRYPOINT = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const PM_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

  const [signer0] = await ethers.getSigners();
  const address0 = await signer0.getAddress();

  console.log({ signer0, address0 });

  const entryPoint = await ethers.getContractAt("EntryPoint", ENTRYPOINT);

  const sender = await ethers.getCreateAddress({
    from: ACOUNT_FACTORY,
    nonce: ACOUNT_NONCE,
  });

  const AccountFactory = await ethers.getContractFactory("AccountFactory");

  console.log({ sender });

  //* for initial account (new account)
  const initialCode = // "0x";
    ACOUNT_FACTORY +
    AccountFactory.interface
      .encodeFunctionData("createAccount", [address0])
      .slice(2);

  // * deposit gas to entrypoint for tx
  await entryPoint.depositTo(PM_ADDRESS, {
    value: ethers.parseEther("100"),
  });

  const Account = await ethers.getContractFactory("Account");
  console.log("address0", address0);

  const userOp = {
    sender: sender,
    nonce: await entryPoint.getNonce(sender, 0),
    initCode: initialCode,
    callData: Account.interface.encodeFunctionData("execute"),
    callGasLimit: 200000,
    verificationGasLimit: 200000,
    preVerificationGas: 50000,
    maxFeePerGas: ethers.parseUnits("10", "gwei"),
    maxPriorityFeePerGas: ethers.parseUnits("10", "gwei"),
    paymasterAndData: PM_ADDRESS,
    signature: "0x",
  };

  console.log(userOp);

  const tx = await entryPoint.handleOps([userOp], address0);
  const receipt = await tx.wait();
  console.log(receipt);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
