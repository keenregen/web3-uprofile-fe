import { ethers } from "ethers";
import pinataSDK from "@pinata/sdk";
import userDbAbi from './userDbAbi.json';

const data_api_key_one = process.env.DATA_API_KEY_ONE;
const data_api_key_two = process.env.DATA_API_KEY_TWO;
const updater_wallet = process.env.BSC_UPDATER_WALLET;


export const pinata = new pinataSDK(data_api_key_one,data_api_key_two)

export const userDbConAddress = '0xAD86C7331df02EC5D16dd3391Bf00c1E8c47D692';

const rpc = 'https://data-seed-prebsc-1-s1.binance.org:8545';
const provider = new ethers.providers.JsonRpcProvider(rpc);
const updater = new ethers.Wallet(updater_wallet, provider);

export const userContract = new ethers.Contract(userDbConAddress, userDbAbi, updater);