const hre = require("hardhat");

const { encryptDataField, decryptNodeResponse } = require("@swisstronik/utils");

const sendShieldedTransaction = async (signer, destination, data, value) => {
  const rpcLink = hre.network.config.url;
  const [encryptedData] = await encryptDataField(rpcLink, data);
  return await signer.sendTransaction({
    from: signer.address,
    to: destination,
    data: encryptedData,
    value,
  });
};

async function main() {
  const contractAddress = "0x18877b1E26342eFBc230B8A3D22398f0A2c5F119"
  const [signer] = await hre.ethers.getSigners();
  const contractFactory = await hre.ethers.getContractFactory("PERC20Sample");
  const contract = contractFactory.attach(contractAddress);
  const functionName = "mint100tokens";
  const mint100TokensTx = await sendShieldedTransaction(
    signer,
    contractAddress,
    contract.interface.encodeFunctionData(functionName),
    0
  );
  await mint100TokensTx.wait();
  console.log(`Transaction URL of Mint: https://explorer-evm.testnet.swisstronik.com/tx/${mint100TokensTx.hash}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
