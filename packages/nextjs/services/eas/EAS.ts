/* eslint-disable @typescript-eslint/no-unused-vars */
import { EAS, Offchain, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";

const EASContractAddress = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e"; // Sepolia v0.26
const CHAINID = 11155111; // Sepolia

// Initialize Offchain class with EAS configuration
const EAS_CONFIG = {
  address: EASContractAddress,
  version: "0.26", // 0.26
  chainId: CHAINID,
};

export const offchain = new Offchain(EAS_CONFIG, 0.26);

// Initialize SchemaEncoder with the schema string
const schemaEncoder = new SchemaEncoder("uint256 eventId, uint8 voteIndex");
const encodedData = schemaEncoder.encodeData([
  { name: "eventId", value: 1, type: "uint256" },
  { name: "voteIndex", value: 1, type: "uint8" },
]);

// Signer is an ethers.js Signer instance
// const signer = new ethers.Wallet(privateKey, provider);

// const offchainAttestation = offchain.signOffchainAttestation({
//   recipient: '0xFD50b031E778fAb33DfD2Fc3Ca66a1EeF0652165',
//   // Unix timestamp of when attestation expires. (0 for no expiration)
//   expirationTime: 0,
//   // Unix timestamp of current time
//   time: 1671219636,
//   revocable: true,
//   nonce: 0,
//   schema: "0xb16fa048b0d597f5a821747eba64efa4762ee5143e9a80600d0005386edfc995",
//   refUID: '0x0000000000000000000000000000000000000000000000000000000000000000',
//   data: encodedData,
// }, signer);

const eas = new EAS(EASContractAddress);

const provider = ethers.providers.getDefaultProvider("sepolia");

export const connectEAS = () => {
  eas.connect(provider);
};

export const createOffChainAttestation = () => {
  // todo: implement this
};
