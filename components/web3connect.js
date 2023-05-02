import { pinata } from "./config";
import Web3Modal from 'web3modal';
import { ethers } from "ethers";


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
    const addressRaw = await signer.getAddress();  // to get hex value of the address
    const addressStr = addressRaw.valueOf(); // to get str value of the address
    return addressStr;
}