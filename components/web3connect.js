import { pinata, nftContractAddr, userContract, userDbConAddress } from "./config";
import Web3Modal from 'web3modal';
import { ethers } from "ethers";
import nftAbi from './nftAbi.json';
import userDbAbi from './userDbAbi.json';





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
    const userDbCon = new ethers.Contract(userDbConAddress, userDbAbi, signer);
    const addressRaw = await signer.getAddress();  // to get hex value of the address
    const addressStr = addressRaw.valueOf(); // to get str value of the address
    return { addressStr, nftContract, userDbCon };
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

let i = -1;
export async function changePicture(file) {
    i++;
    const options = {
        pinataMetadata: {
            name: "picu#"+ i.toString(),
        },
    };

    const result = await pinata.pinJSONToIPFS(file, options);
    const picuCid = result.IpfsHash;
    return picuCid;
}

export async function addPicture(picuCid) {
    const userWallet = await ethConnect();
    const walletAddr = userWallet.addressStr;
    const sendPicuCid = await userContract.updatePicture(picuCid, walletAddr);
    const receipt = await sendPicuCid.wait();
    if (receipt) {
        return 'Complete';
    }
}

export async function getAccount() {
    const userData = await ethConnect();
    const userDbCon = userData.userDbCon;
    const userWalletAddr = userData.addressStr;
    // const nftCon = userData.nftContract;
    const userCid = await userDbCon._account(userWalletAddr);
    return userCid;

    // if(usercid[1] == '0x0000000000000000000000000000000000000000'){
    //     return 'no user';
    // }
    // else {
    //     const userurl = 'http://10.10.20.32:8080/ipfs/' + usercid[0];
    //     const piccid = await userctr._picture(userwallet);
    //     const picurl = 'http://10.10.20.32:8080/ipfs/' + piccid;
    //     const paywallet = usercid[2];
    //     const balance = await tokenctr.balanceOf(paywallet);
    //     return {userurl, picurl, balance};
    // }
}