import { ethers } from "ethers";
import pinataSDK from "@pinata/sdk";
import userDbAbi from './userDbAbi.json';

const data_api_key_one = process.env.NEXT_PUBLIC_DATA_API_KEY_ONE;
const data_api_key_two = process.env.NEXT_PUBLIC_DATA_API_KEY_TWO;
const updater_wallet = process.env.NEXT_PUBLIC_BSC_UPDATER_WALLET;
const userdb_con_addr = process.env.NEXT_PUBLIC_USERDB_CON_ADDRESS;
const nft_con_addr = process.env.NEXT_PUBLIC_NFT_CON_ADDRESS;

export const pinata = new pinataSDK(data_api_key_one,data_api_key_two)

export const userDbConAddress = userdb_con_addr;

const rpc = 'https://data-seed-prebsc-1-s1.binance.org:8545';
const provider = new ethers.providers.JsonRpcProvider(rpc);
const updater = new ethers.Wallet(updater_wallet, provider);

export const userContract = new ethers.Contract(userDbConAddress, userDbAbi, updater);

export const nftContractAddr = nft_con_addr;
