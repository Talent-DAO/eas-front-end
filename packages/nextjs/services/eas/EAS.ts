/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  EAS,
  Offchain,
  SchemaEncoder,
  SchemaRecord,
  SchemaRegistry,
  SignedOffchainAttestation,
} from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";

const EASContractAddressSepolia = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e"; // Sepolia v0.26
const EASContractAddressGoerli = "0x0"; // Goerli
const CHAINID = 11155111; // Sepolia

// Initialize Offchain class with EAS configuration
const EAS_CONFIG = {
  address: EASContractAddressSepolia,
  version: "0.26", // 0.26
  chainId: CHAINID,
};

export const offchain = new Offchain(EAS_CONFIG, 0.26);

const eas = new EAS(EASContractAddressSepolia);

const provider = ethers.providers.getDefaultProvider("sepolia");

export const connectEAS = (): void => {
  eas.connect(provider);
};

export const getEASContract = (chainId: number): string => {
  switch (chainId) {
    case 11155111: // Sepolia
      return EASContractAddressSepolia;
    case 5: // Goerli
      return EASContractAddressGoerli;
    default:
      return EASContractAddressSepolia;
  }
};

export const registerEASSchema = async (signer: any): Promise<string> => {
  const schemaRegistryContractAddress = "0xA7b39296258348C78294F95B872b282326A97BDF";
  const schemaRegistry = new SchemaRegistry(schemaRegistryContractAddress);

  schemaRegistry.connect(signer);

  // NOTE: peer review schema
  // "PeerReview": {
  //   "reviewerId": address,
  //   "paperId": "string",
  //   "score": "number",
  //   "comments": "string",
  //   "timestamp": "number"
  // }
  const schema = "address reviewerId, string pubId, uint256 score, string comment, uint256 timestamp";
  const resolverAddress = "0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0"; // Sepolia v0.26
  const revocable = true;

  const transaction = await schemaRegistry.register({ schema, resolverAddress, revocable });

  const receipt = await transaction.wait();

  return receipt;
};

export const getEASSchema = async (): Promise<SchemaRecord> => {
  const schemaRegistryContractAddress = "0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0"; // Sepolia 0.26
  const schemaRegistry = new SchemaRegistry(schemaRegistryContractAddress);
  schemaRegistry.connect(provider);

  const schemaUID = "UID";
  const schemaRecord = await schemaRegistry.getSchema({ uid: schemaUID });

  return schemaRecord;
};

// todo: add fetch to get a file pointer from Arweave/IPFS/URL
// 1. upload file and get the pointer
// 2. add the pointer to the attestation
export const createOnChainAttestation = async (recipient: string): Promise<string> => {
  // Initialize SchemaEncoder with the schema string
  const schemaEncoder = new SchemaEncoder("uint256 eventId, uint8 voteIndex");
  const encodedData = schemaEncoder.encodeData([
    { name: "eventId", value: 1, type: "uint256" },
    { name: "voteIndex", value: 1, type: "uint8" },
  ]);

  const schemaUID = "UID";

  const tx = await eas.attest({
    schema: schemaUID,
    data: {
      recipient,
      expirationTime: 0,
      revocable: true,
      data: encodedData,
    },
  });

  const newAttestationUID = await tx.wait();

  return newAttestationUID;
};

export const createOffChainAttestation = async (): Promise<SignedOffchainAttestation> => {
  // Initialize SchemaEncoder with the schema string
  const schemaEncoder = new SchemaEncoder("uint256 eventId, uint8 voteIndex");
  const encodedData = schemaEncoder.encodeData([
    { name: "eventId", value: 1, type: "uint256" },
    { name: "voteIndex", value: 1, type: "uint8" },
  ]);

  const privateKey = "";

  // Signer is an ethers.js Signer instance
  const signer = new ethers.Wallet(privateKey, provider);

  const offchainAttestation = await offchain.signOffchainAttestation(
    {
      recipient: "0xFD50b031E778fAb33DfD2Fc3Ca66a1EeF0652165",
      // Unix timestamp of when attestation expires. (0 for no expiration)
      expirationTime: 0,
      // Unix timestamp of current time
      time: 1671219636,
      revocable: true,
      nonce: 0,
      schema: "0xb16fa048b0d597f5a821747eba64efa4762ee5143e9a80600d0005386edfc995",
      refUID: "0x0000000000000000000000000000000000000000000000000000000000000000",
      data: encodedData,
      version: 0.26,
    },
    signer,
  );

  return offchainAttestation;
};

export const revokeOnChainAttestation = async (): Promise<void> => {
  const transaction = await eas.revoke({
    schema: "0xb16fa048b0d597f5a821747eba64efa4762ee5143e9a80600d0005386edfc995",
    data: {
      uid: "0x6776de8122c352b4d671003e58ca112aedb99f34c629a1d1fe3b332504e2943a",
    },
  });

  // Wait for transaction to be validated
  const receipt = await transaction.wait();

  return receipt;
};

export const revokeOffChainAttestation = async (): Promise<ethers.BigNumberish> => {
  const data = ethers.utils.formatBytes32String("0x6776de8122c352b4d671003e58ca112aedb99f34c629a1d1fe3b332504e2943a");

  const transaction = await eas.revokeOffchain(data);

  // Wait for transaction to be validated
  const receipt = await transaction.wait();

  return receipt;
};

export const revokeMultiOffChainAttestation = async (): Promise<ethers.BigNumberish[]> => {
  const data1 = ethers.utils.formatBytes32String("0x6776de8122c352b4d671003e58ca112aedb99f34c629a1d1fe3b332504e2943a");
  const data2 = ethers.utils.formatBytes32String("0x3e23b395b2bd2d37dd0f6e4148ac6b9e7ed22f2215107958f95cc1489e4e6289");

  const transaction = await eas.multiRevokeOffchain([data1, data2]);

  // Wait for transaction to be validated
  const receipt = await transaction.wait();

  return receipt;
};
