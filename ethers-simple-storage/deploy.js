const ethers = require('ethers');
const fs = require('fs-extra');

async function main() {
    const provider = new ethers.providers.JsonRpcProvider(
        'http://127.0.0.1:7545'
    );
    const wallet = new ethers.Wallet(
        'a0dfb4968d767332bc8cd891220fe83db125eff6bb0bbbd428459d1b88d5ff9a',
        provider
    );
    const abi = fs.readFileSync(
        './SimpleStorage_sol_SimpleStorage.abi',
        'utf-8'
    );
    const binary = fs.readFileSync(
        './SimpleStorage_sol_SimpleStorage.bin',
        'utf-8'
    );
    const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
    console.log('Deploying contract...');
    const contract = await contractFactory.deploy();
    await contract.deployTransaction.wait(1);

    const currentFavouriteNumber = await contract.retrieve();
    console.log(
        `Current Favourite Number: ${currentFavouriteNumber.toString()}`
    );
    const transactionResponse = await contract.store('9');
    await transactionResponse.wait(1);

    const updatedFavouriteNumber = await contract.retrieve();
    console.log(
        `Updated Favourite Number: ${updatedFavouriteNumber.toString()}`
    );
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
