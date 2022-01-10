import { Algodv2, generateAccount, secretKeyToMnemonic, mnemonicToSecretKey } from "algosdk";
import { parseUnits } from "@ethersproject/units";
import { NodeHttpTransport } from "@improbable-eng/grpc-web-node-http-transport";
import { describe, expect, jest, test } from "@jest/globals";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { Connection, Keypair, PublicKey, Transaction } from "@solana/web3.js";
import {
  LCDClient,
  MnemonicKey,
  MsgExecuteContract,
} from "@terra-money/terra.js";
import axios from "axios";
import { ethers } from "ethers";
import {
  approveEth,
  attestFromEth,
  attestFromSolana,
  CHAIN_ID_ETH,
  CHAIN_ID_SOLANA,
  CHAIN_ID_TERRA,
  createWrappedOnEth,
  createWrappedOnAlgorand,
  createWrappedOnSolana,
  createWrappedOnTerra,
  getEmitterAddressEth,
  getEmitterAddressSolana,
  getForeignAssetSolana,
  getIsTransferCompletedEth,
  getIsTransferCompletedSolana,
  getIsTransferCompletedTerra,
  hexToUint8Array,
  nativeToHexString,
  parseSequenceFromLogEth,
  parseSequenceFromLogSolana,
  postVaaSolana,
  redeemOnEth,
  redeemOnSolana,
  redeemOnTerra,
  transferFromEth,
  transferFromSolana,
} from "../..";
import getSignedVAAWithRetry from "../../rpc/getSignedVAAWithRetry";
import { postVaaWithRetry } from "../../solana/postVaa";
import { setDefaultWasm } from "../../solana/wasm";
import {
  ETH_CORE_BRIDGE_ADDRESS,
  ETH_NODE_URL,
  ETH_PRIVATE_KEY,
  ETH_TOKEN_BRIDGE_ADDRESS,
  SOLANA_CORE_BRIDGE_ADDRESS,
  SOLANA_HOST,
  SOLANA_PRIVATE_KEY,
  SOLANA_TOKEN_BRIDGE_ADDRESS,
  TERRA_CHAIN_ID,
  TERRA_GAS_PRICES_URL,
  TERRA_NODE_URL,
  TERRA_PRIVATE_KEY,
  TERRA_TOKEN_BRIDGE_ADDRESS,
  TEST_ERC20,
  TEST_SOLANA_TOKEN,
  WORMHOLE_RPC_HOSTS,
  ALGOD_SERVER,
  ALGOD_TOKEN,
  ALGOD_PORT,
  ALGOD_USER_PK,
  ALGORAND_TOKEN_BRIDGE_ADDRESS
} from "./consts";
import { transferFromEthToSolana } from "./helpers";

setDefaultWasm("node");

jest.setTimeout(60000);

// TODO: setup keypair and provider/signer before, destroy provider after
// TODO: make the repeatable (can't attest an already attested token)

function hexStringToByteArray(hexString: string) {
    if (hexString.length % 2 !== 0) {
        throw "Must have an even number of hex digits to convert to bytes";
    }
    var numBytes = hexString.length / 2;
    var byteArray = new Uint8Array(numBytes);
    for (var i=0; i<numBytes; i++) {
        byteArray[i] = parseInt(hexString.substr(i*2, 2), 16);
    }
    return byteArray;
}

describe("Integration Tests", () => {
  describe("Solana to Algorand", () => {
    test.only("Attest Solana SPL to Algorand", (done) => {
      (async () => {
        try {
//          // create a keypair for Solana
//          const keypair = Keypair.fromSecretKey(SOLANA_PRIVATE_KEY);
//          const payerAddress = keypair.publicKey.toString();
//          // attest the test token
//          const connection = new Connection(SOLANA_HOST, "confirmed");
//          const transaction = await attestFromSolana(
//            connection,
//            SOLANA_CORE_BRIDGE_ADDRESS,
//            SOLANA_TOKEN_BRIDGE_ADDRESS,
//            payerAddress,
//            TEST_SOLANA_TOKEN
//          );
//          // sign, send, and confirm transaction
//          transaction.partialSign(keypair);
//          const txid = await connection.sendRawTransaction(
//            transaction.serialize()
//          );
//          await connection.confirmTransaction(txid);
//          const info = await connection.getTransaction(txid);
//          if (!info) {
//            throw new Error(
//              "An error occurred while fetching the transaction info"
//            );
//          }
//          // get the sequence from the logs (needed to fetch the vaa)
//          const sequence = parseSequenceFromLogSolana(info);
//          const emitterAddress = await getEmitterAddressSolana(
//            SOLANA_TOKEN_BRIDGE_ADDRESS
//          );
//          // poll until the guardian(s) witness and sign the vaa
//          const { vaaBytes: signedVAA } = await getSignedVAAWithRetry(
//            WORMHOLE_RPC_HOSTS,
//            CHAIN_ID_SOLANA,
//            emitterAddress,
//            sequence,
//            {
//              transport: NodeHttpTransport(),
//            }
//          );


            const signedVAA = hexStringToByteArray("0100000000010017fa5858d0e1c87641f5e0f477fd2dec17e1ae8db0c523e196ce87af21810f571315354a17c24c282808a3e72c8f1223b3cce9a35f41ff84d41f0f3e92d384f70061d74a200000e6d20001c69a1b1a65dd336bf1df6a77afb501fc25db7fc0938cb08595a9ef473265cb4f00000000000000472002165809739240a0ac03b98440fe8985548e3aa683cd0d4d9df5b5659669faa301000109534f4c5400000000000000000000000000000000000000000000000000000000536f6c616e61205465737420546f6b656e000000000000000000000000000000")

            
          const provider = new Algodv2(ALGOD_TOKEN, ALGOD_SERVER, ALGOD_PORT);
          const signer = mnemonicToSecretKey(ALGOD_USER_PK);
          try {
            await createWrappedOnAlgorand(
              ALGORAND_TOKEN_BRIDGE_ADDRESS,
              provider,
              signer,
                signedVAA
            );
          } catch (e) {
            // this could fail because the token is already attested (in an unclean env)
          }
          done();
        } catch (e) {
          console.error(e);
          done(
            "An error occurred while trying to attest from Solana to Algorand"
          );
        }
      })();
    });
//    // TODO: it is attested
//    test("Send Solana SPL to Ethereum", (done) => {
//      (async () => {
//        try {
//          // create a signer for Eth
//          const provider = new ethers.providers.WebSocketProvider(ETH_NODE_URL);
//          const signer = new ethers.Wallet(ETH_PRIVATE_KEY, provider);
//          const targetAddress = await signer.getAddress();
//          // create a keypair for Solana
//          const keypair = Keypair.fromSecretKey(SOLANA_PRIVATE_KEY);
//          const payerAddress = keypair.publicKey.toString();
//          // find the associated token account
//          const fromAddress = (
//            await Token.getAssociatedTokenAddress(
//              ASSOCIATED_TOKEN_PROGRAM_ID,
//              TOKEN_PROGRAM_ID,
//              new PublicKey(TEST_SOLANA_TOKEN),
//              keypair.publicKey
//            )
//          ).toString();
//          // transfer the test token
//          const connection = new Connection(SOLANA_HOST, "confirmed");
//          const amount = parseUnits("1", 9).toBigInt();
//          const transaction = await transferFromSolana(
//            connection,
//            SOLANA_CORE_BRIDGE_ADDRESS,
//            SOLANA_TOKEN_BRIDGE_ADDRESS,
//            payerAddress,
//            fromAddress,
//            TEST_SOLANA_TOKEN,
//            amount,
//            hexToUint8Array(
//              nativeToHexString(targetAddress, CHAIN_ID_ETH) || ""
//            ),
//            CHAIN_ID_ETH
//          );
//          // sign, send, and confirm transaction
//          transaction.partialSign(keypair);
//          const txid = await connection.sendRawTransaction(
//            transaction.serialize()
//          );
//          await connection.confirmTransaction(txid);
//          const info = await connection.getTransaction(txid);
//          if (!info) {
//            throw new Error(
//              "An error occurred while fetching the transaction info"
//            );
//          }
//          // get the sequence from the logs (needed to fetch the vaa)
//          const sequence = parseSequenceFromLogSolana(info);
//          const emitterAddress = await getEmitterAddressSolana(
//            SOLANA_TOKEN_BRIDGE_ADDRESS
//          );
//          // poll until the guardian(s) witness and sign the vaa
//          const { vaaBytes: signedVAA } = await getSignedVAAWithRetry(
//            WORMHOLE_RPC_HOSTS,
//            CHAIN_ID_SOLANA,
//            emitterAddress,
//            sequence,
//            {
//              transport: NodeHttpTransport(),
//            }
//          );
//          expect(
//            await getIsTransferCompletedEth(
//              ETH_TOKEN_BRIDGE_ADDRESS,
//              provider,
//              signedVAA
//            )
//          ).toBe(false);
//          await redeemOnEth(ETH_TOKEN_BRIDGE_ADDRESS, signer, signedVAA);
//          expect(
//            await getIsTransferCompletedEth(
//              ETH_TOKEN_BRIDGE_ADDRESS,
//              provider,
//              signedVAA
//            )
//          ).toBe(true);
//          provider.destroy();
//          done();
//        } catch (e) {
//          console.error(e);
//          done(
//            "An error occurred while trying to send from Solana to Ethereum"
//          );
//        }
//      })();
//    });
    // TODO: it has increased balance
  });
});
