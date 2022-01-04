// (cd src/algorand; npx prettier --write .)
// npm ci --prefix sdk/js
// npm test

import algosdk from "algosdk";

const sha512 = require("js-sha512");
const hibase32 = require("hi-base32");
import {
  importCoreWasm,
  importTokenWasm,
  setDefaultWasm,
} from "../solana/wasm";
setDefaultWasm("node");
const crypto = require("crypto");

class AlgorandLib {
  ALGORAND_ADDRESS_SIZE: number;
  ALGO_VERIFY_HASH: string;
  ALGO_VERIFY: Uint8Array;
  ALGO_NOP_HASH: string;
  ALGO_NOP: Uint8Array;

  constructor() {
    this.ALGORAND_ADDRESS_SIZE = 58;

this.ALGO_VERIFY_HASH = "B77RU63EJ5MLSMTKD5IGTTBU3KBVUWR2G6LFSUM5VZZ4TVXOJAX6GFTCNY"
this.ALGO_VERIFY = new Uint8Array([5, 32, 3, 6, 1, 0, 49, 27, 129, 3, 18, 68, 45, 21, 49, 22, 35, 9, 54, 26, 2, 23, 136, 0, 44, 129, 66, 11, 18, 68, 35, 67, 53, 4, 53, 3, 52, 3, 52, 4, 24, 36, 19, 64, 0, 6, 52, 3, 52, 4, 10, 137, 52, 3, 52, 4, 10, 35, 8, 137, 53, 2, 52, 2, 34, 136, 255, 220, 137, 53, 1, 53, 0, 52, 1, 34, 24, 36, 18, 64, 0, 20, 52, 0, 52, 1, 136, 255, 227, 35, 9, 12, 64, 0, 5, 52, 1, 34, 24, 137, 34, 137, 34, 137, ])

this.ALGO_NOP_HASH = "BJATCHES5YJZJ7JITYMVLSSIQAVAWBQRVGPQUDT5AZ2QSLDSXWWM46THOY"
this.ALGO_NOP = new Uint8Array([5, 129, 1, 67, ])

  }

  //function timeoutPromise (ms, promise) {
  //  return new Promise((resolve, reject) => {
  //    const timeoutId = setTimeout(() => {
  //      reject(new Error('promise timeout'))
  //    }, ms)
  //    promise.then(
  //      (res) => {
  //        clearTimeout(timeoutId)
  //        resolve(res)
  //      },
  //      (err) => {
  //        clearTimeout(timeoutId)
  //        reject(err)
  //      }
  //    )
  //  })
  //}
  //
  //function getInt64Bytes (x, len) {
  //  if (!len) {
  //    len = 8
  //  }
  //  const bytes = new Uint8Array(len)
  //  do {
  //    len -= 1
  //    // eslint-disable-next-line no-bitwise
  //    bytes[len] = x & (255)
  //    // eslint-disable-next-line no-bitwise
  //    x >>= 8
  //  } while (len)
  //  return bytes
  //}
  //

  addressFromByteBuffer(addr: string): string {
    const bytes = Buffer.from(addr, "base64");

    // compute checksum
    const checksum = sha512.sha512_256.array(bytes).slice(28, 32);

    const c = new Uint8Array(bytes.length + checksum.length);
    c.set(bytes);
    c.set(checksum, bytes.length);

    const v = hibase32.encode(c);

    return v.toString().slice(0, this.ALGORAND_ADDRESS_SIZE);
  }

  //
  //function printAppCallDeltaArray (deltaArray) {
  //  for (let i = 0; i < deltaArray.length; i++) {
  //    if (deltaArray[i].address) {
  //      console.log('Local state change address: ' + deltaArray[i].address)
  //      for (let j = 0; j < deltaArray[i].delta.length; j++) {
  //        printAppCallDelta(deltaArray[i].delta[j])
  //      }
  //    } else {
  //      console.log('Global state change')
  //      printAppCallDelta(deltaArray[i])
  //    }
  //  }
  //}
  //
  //function printAppStateArray (stateArray) {
  //  for (let n = 0; n < stateArray.length; n++) {
  //    printAppState(stateArray[n])
  //  }
  //}
  //

  appValueState(stateValue: any): string {
    let text = "";

    if (stateValue.type == 1) {
      const addr = this.addressFromByteBuffer(stateValue.bytes);
      if (addr.length == this.ALGORAND_ADDRESS_SIZE) {
        text += addr;
      } else {
        text += stateValue.bytes;
      }
    } else if (stateValue.type == 2) {
      text = stateValue.uint;
    } else {
      text += stateValue.bytes;
    }

    return text;
  }
  //
  //function appValueStateString (stateValue) {
  //  let text = ''
  //
  //  if (stateValue.type == 1) {
  //    const addr = addressFromByteBuffer(stateValue.bytes)
  //    if (addr.length == ALGORAND_ADDRESS_SIZE) {
  //      text += addr
  //    } else {
  //      text += stateValue.bytes
  //    }
  //  } else if (stateValue.type == 2) {
  //    text += stateValue.uint
  //  } else {
  //    text += stateValue.bytes
  //  }
  //
  //  return text
  //}
  //
  //function printAppState (state) {
  //  let text = Buffer.from(state.key, 'base64').toString() + ': '
  //
  //  text += appValueStateString(state.value)
  //
  //  console.log(text)
  //}
  //
  //async function printAppLocalState (algodClient, appId, accountAddr) {
  //  const ret = await readAppLocalState(algodClient, appId, accountAddr)
  //  if (ret) {
  //    console.log('Application %d local state for account %s:', appId, accountAddr)
  //    printAppStateArray(ret)
  //  }
  //}
  //
  //async function printAppGlobalState (algodClient, appId, accountAddr) {
  //  const ret = await readAppGlobalState(algodClient, appId, accountAddr)
  //  if (ret) {
  //    console.log('Application %d global state:', appId)
  //    printAppStateArray(ret)
  //  }
  //}
  //
  //async function readCreatedApps (algodClient, accountAddr) {
  //  const accountInfoResponse = await algodClient.accountInformation(accountAddr).do()
  //  return accountInfoResponse['created-apps']
  //}
  //
  //async function readOptedInApps (algodClient, accountAddr) {
  //  const accountInfoResponse = await algodClient.accountInformation(accountAddr).do()
  //  return accountInfoResponse['apps-local-state']
  //}
  //

  // read global state of application
  async readAppGlobalState(algodClient: any, appId: any, accountAddr: any) {
    const accountInfoResponse = await algodClient
      .accountInformation(accountAddr)
      .do();
    for (let i = 0; i < accountInfoResponse["created-apps"].length; i++) {
      if (accountInfoResponse["created-apps"][i].id === appId) {
        const globalState =
          accountInfoResponse["created-apps"][i].params["global-state"];

        return globalState;
      }
    }
  }

  globalStateLookupKey(stateArray: any, key: string): any {
    for (let j = 0; j < stateArray.length; j++) {
      const text = Buffer.from(stateArray[j].key, "base64").toString();

      if (key === text) {
        return this.appValueState(stateArray[j].value);
      }
    }
    throw new Error("key not found");
  }

  async readAppGlobalStateByKey(
    algodClient: any,
    appId: any,
    accountAddr: any,
    key: any
  ) {
    const accountInfoResponse = await algodClient
      .accountInformation(accountAddr)
      .do();
    for (let i = 0; i < accountInfoResponse["created-apps"].length; i++) {
      if (accountInfoResponse["created-apps"][i].id === appId) {
        // console.log("Application's global state:")
        const stateArray =
          accountInfoResponse["created-apps"][i].params["global-state"];
        for (let j = 0; j < stateArray.length; j++) {
          const text = Buffer.from(stateArray[j].key, "base64").toString();

          if (key === text) {
            return this.appValueState(stateArray[j].value);
          }
        }
      }
    }
    throw new Error("key not found");
  }

  //
  //// read local state of application from user account
  //async function readAppLocalState (algodClient, appId, accountAddr) {
  //  const accountInfoResponse = await algodClient.accountInformation(accountAddr).do()
  //  for (let i = 0; i < accountInfoResponse['apps-local-state'].length; i++) {
  //    if (accountInfoResponse['apps-local-state'][i].id === appId) {
  //      // console.log(accountAddr + " opted in, local state:")
  //
  //      if (accountInfoResponse['apps-local-state'][i]['key-value']) {
  //        return accountInfoResponse['apps-local-state'][i]['key-value']
  //      }
  //    }
  //  }
  //}
  //
  //async function readAppLocalStateByKey (algodClient, appId, accountAddr, key) {
  //  const accountInfoResponse = await algodClient.accountInformation(accountAddr).do()
  //  for (let i = 0; i < accountInfoResponse['apps-local-state'].length; i++) {
  //    if (accountInfoResponse['apps-local-state'][i].id === appId) {
  //      const stateArray = accountInfoResponse['apps-local-state'][i]['key-value']
  //
  //      if (!stateArray) {
  //        return null
  //      }
  //      for (let j = 0; j < stateArray.length; j++) {
  //        const text = Buffer.from(stateArray[j].key, 'base64').toString()
  //
  //        if (key === text) {
  //          return appValueState(stateArray[j].value)
  //        }
  //      }
  //      // not found assume 0
  //      return 0
  //    }
  //  }
  //}
  //
  //function uintArray8ToString (byteArray) {
  //  return Array.from(byteArray, function (byte) {
  //    // eslint-disable-next-line no-bitwise
  //    return ('0' + (byte & 0xFF).toString(16)).slice(-2)
  //  }).join('')
  //}
  //
  ///**
  // * Verify if transactionResponse has any information about a transaction local or global state change.
  // * @param  {Object} transactionResponse object containing the transaction response of an application call
  // * @return {Boolean} returns true if there is a local or global delta meanining that
  // * the transaction made a change in the local or global state
  // */
  //function anyAppCallDelta (transactionResponse) {
  //  return (transactionResponse['global-state-delta'] || transactionResponse['local-state-delta'])
  //}
  //
  ///**
  // * Print to stdout the changes introduced by the transaction that generated the transactionResponse if any.
  // * @param  {Object} transactionResponse object containing the transaction response of an application call
  // * @return {void}
  // */
  //function printAppCallDelta (transactionResponse) {
  //  if (transactionResponse['global-state-delta'] !== undefined) {
  //    console.log('Global State updated:')
  //    printAppCallDeltaArray(transactionResponse['global-state-delta'])
  //  }
  //  if (transactionResponse['local-state-delta'] !== undefined) {
  //    console.log('Local State updated:')
  //    printAppCallDeltaArray(transactionResponse['local-state-delta'])
  //  }
  //}

  /**
   * Helper function to wait until transaction txId is included in a block/round.
   * @param  {String} txId transaction id to wait for
   * @return {VOID} VOID
   */
  async waitForConfirmation(txId: string, algodClient: algosdk.Algodv2) {
    const status = await algodClient.status().do();
    let lastRound = status["last-round"];
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const pendingInfo = await algodClient
        .pendingTransactionInformation(txId)
        .do();
      if (
        pendingInfo["confirmed-round"] !== null &&
        pendingInfo["confirmed-round"] > 0
      ) {
        // Got the completed Transaction

        return pendingInfo;
      }
      lastRound += 1;
      await algodClient.statusAfterBlock(lastRound).do();
    }
  }

  async publish(
    action: string,
    tokenBridgeAddress: string,
    provider: algosdk.Algodv2,
    signer: algosdk.Account,
    signedVAA: Uint8Array
  ) {
    const txParams = await provider.getTransactionParams().do();
    txParams.fee = 1000;
    txParams.flatFee = true;

    const p = tokenBridgeAddress.split(":");
    const vaaProcessorAppId = parseInt(p[1]);
    const vaaProcessorOwner = p[0];

    const { parse_vaa } = await importCoreWasm();

    const parsedVAA = parse_vaa(signedVAA);

    console.log(parsedVAA);

    const globalState = await this.readAppGlobalState(
      provider,
      vaaProcessorAppId,
      vaaProcessorOwner
    );

    const guardianCount = parseInt(
      this.globalStateLookupKey(globalState, "gscount")
    );
    const stepSize = parseInt(this.globalStateLookupKey(globalState, "vssize"));
    const numOfVerifySteps = Math.ceil(guardianCount / stepSize);
    if (guardianCount === 0 || stepSize === 0) {
      throw new Error(
        "cannot get guardian count and/or step-size from global state"
      );
    }

    console.log(1);

    // (!)
    // Stateless programs cannot access state nor stack from stateful programs, so
    // for the VAA Verify program to use the guardian set, we pass the global state as TX argument,
    // (and check it against the current global list to be sure it's ok). This way it can be read by
    // VAA verifier as a stateless program CAN DO READS of call transaction arguments in a group.
    // The same technique is used for the note field, where the payload is set.
    //

    const guardianKeys = [];
    const buf = Buffer.alloc(8);
    for (let i = 0; i < guardianCount; i++) {
      buf.writeBigUInt64BE(BigInt(i++));
      guardianKeys.push(this.globalStateLookupKey(globalState, buf.toString()));
    }

    const gid = crypto.randomBytes(16).toString("hex");
    const groupTxSet = [];

    const sigSubsets = [];

    // We need to fund this critter...
    groupTxSet.push(algosdk.makePaymentTxnWithSuggestedParams(signer.addr, this.ALGO_VERIFY_HASH, numOfVerifySteps * txParams.fee, undefined, undefined, txParams));

    for (let i = 0; i < numOfVerifySteps; i++) {
      const st = stepSize * i;
      const sigSetLen = 132 * stepSize;
      //
      const keySubset = guardianKeys.slice(
        st,
        i < numOfVerifySteps - 1 ? st + stepSize : undefined
      );

 //     const signatures = signedVAA.slice(6);

      sigSubsets.push(
          parsedVAA.signatures.slice(
          i * sigSetLen,
          i < numOfVerifySteps - 1 ? i * sigSetLen + sigSetLen : undefined
        )
      );

      const tx = algosdk.makeApplicationNoOpTxn(
        this.ALGO_VERIFY_HASH,
        txParams,
        vaaProcessorAppId,
        [
//            new Uint8Array(Buffer.from("parseAndVerifyVM")),
          new Uint8Array(Buffer.from("nop")),
          new Uint8Array(Buffer.from(keySubset.join(""), "hex")),
          algosdk.encodeUint64(guardianCount),
        ],
        undefined,
        undefined,
        undefined,
        new Uint8Array(parsedVAA.payload)
      );

      console.log(keySubset);

      groupTxSet.push(tx);
    }

    console.log(guardianCount); // 1
    console.log(numOfVerifySteps); // 1
    console.log(stepSize) // 6
    console.log(sigSubsets);
    console.log(sigSubsets[0][0].signature.length);


    const tx = algosdk.makeApplicationNoOpTxn(
      signer.addr,
      txParams,
      vaaProcessorAppId,
      [new Uint8Array(Buffer.from(action))],
      undefined,
      undefined,
      undefined,
      new Uint8Array(parsedVAA.payload)
    );

    groupTxSet.push(tx);

    algosdk.assignGroupID(groupTxSet);

    const signedGroup = [];
    let i = 0;
    for (const tx of groupTxSet) {

      // All transactions except the first and last must be signed by stateless code.

      if ((i === groupTxSet.length - 1) || (i == 0)) {
        const txSigned = tx.signTxn(signer.sk);
        signedGroup.push(txSigned);
      } else {
        const ls = Buffer.from(String(sigSubsets[i-1]), "hex");
          console.log('Buffer at %d results in sig of len %d', (i - 1), ls.length)
        const lsig = new algosdk.LogicSigAccount(this.ALGO_VERIFY, [ls]);
        const stxn = algosdk.signLogicSigTransaction(tx, lsig);
        signedGroup.push(stxn.blob);
      }
      i++;
    }

    console.log(4);

    console.log(signedGroup);

    try {
      // Submit the transaction
      const rawTx = await provider.sendRawTransaction(signedGroup).do();

      console.log(5);

      console.log(rawTx);
      console.log(signedGroup);

      console.log("waitForConfirmation");
      console.log(await this.waitForConfirmation(rawTx["txId"], provider));
      console.log("waitForConfirmationDone");
    } catch (e) {
      console.log("exception");
      console.log(e);
    } finally {
      console.log("finally");
    }

    return {};
  }
}

const alib = new AlgorandLib();

export async function createWrappedOnAlgorandTxn(
  tokenBridgeAddress: string,
  provider: algosdk.Algodv2,
  signer: algosdk.Account,
  vaaBody: Uint8Array
) {
  console.log("you suck");
  return await alib.publish(
//    "parseAndVerifyVM",
    "nop",
    tokenBridgeAddress,
    provider,
    signer,
    vaaBody
  );
}
