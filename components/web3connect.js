import { pinata, nftContractAddr } from "./config";
import Web3Modal from 'web3modal';
import { ethers } from "ethers";
import nftAbi from './nftAbi.json';





export const pinJSONToIPFS = async (jsonData, fileName) => {
    const options = {
        pinataMetadata: {
            name: fileName,
        },
    }
    const result = await pinata.pinJSONToIPFS(jsonData, options);
    const path = result.IpfsHash;
    return path;
}

export async function ethConnect() {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const nftContract = new ethers.Contract(nftContractAddr, nftAbi, signer);
    const addressRaw = await signer.getAddress();  // to get hex value of the address
    const addressStr = addressRaw.valueOf(); // to get str value of the address
    return { addressStr, nftContract, connection };
}



// check if nft from the specific collection exists
export async function checkNfts() {
    if (window.ethereum.selectedAddress !== null) {
        const walletData = await ethConnect();
        const nftCon = walletData.nftContract;
        const walletAddr = walletData.addressStr;
        const checkBalance = Number((await nftCon.balanceOf(walletAddr)).valueOf());

        if (checkBalance > 0) {
            return checkBalance;
        }
        else {
            return 0;
        }
    }
}

export async function signInUser() {
    if (window.ethereum.selectedAddress !== null) {
        const walletData = await ethConnect();
        const nftCon = walletData.nftContract;
        const walletAddr = walletData.addressStr;
        const getNftId = await nftCon.walletOfOwner(walletAddr);
        return { getNftId, walletAddr };
    }
}