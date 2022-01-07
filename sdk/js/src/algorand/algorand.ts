// (cd src/algorand; npx prettier --write .)
// npm ci --prefix sdk/js
// npm test

import algosdk from "algosdk";

const util = require("util");

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

    this.ALGO_VERIFY_HASH =
      "I76O2N7WRFHTAOT3HLVFMOOBISYU7M3C4ZQJMQCAX66NYKR4PPXJOJDH4M";
    this.ALGO_VERIFY = new Uint8Array([
      5, 32, 6, 1, 6, 0, 32, 66, 20, 38, 1, 0, 49, 27, 129, 3, 18, 68, 45, 21,
      49, 22, 34, 9, 54, 26, 2, 23, 136, 0, 79, 33, 4, 11, 18, 68, 49, 32, 50,
      3, 18, 68, 49, 16, 35, 18, 68, 50, 4, 129, 2, 9, 54, 26, 2, 23, 136, 0,
      42, 18, 68, 45, 49, 5, 54, 26, 1, 136, 0, 75, 68, 34, 67, 53, 2, 53, 1,
      52, 1, 52, 2, 24, 36, 19, 64, 0, 6, 52, 1, 52, 2, 10, 137, 52, 1, 52, 2,
      10, 34, 8, 137, 53, 0, 52, 0, 35, 136, 255, 220, 137, 53, 4, 53, 3, 52, 4,
      35, 24, 36, 18, 64, 0, 20, 52, 3, 52, 4, 136, 255, 227, 34, 9, 12, 64, 0,
      5, 52, 4, 35, 24, 137, 35, 137, 35, 137, 53, 7, 53, 6, 53, 5, 40, 53, 240,
      40, 53, 241, 36, 53, 10, 36, 53, 8, 36, 53, 9, 52, 8, 52, 5, 21, 12, 65,
      0, 97, 52, 5, 52, 8, 34, 88, 23, 52, 10, 49, 22, 34, 9, 35, 11, 8, 18, 68,
      52, 6, 2, 2, 52, 5, 52, 8, 129, 65, 8, 34, 88, 23, 52, 5, 52, 8, 34, 8,
      37, 88, 52, 5, 52, 8, 129, 33, 8, 37, 88, 7, 0, 53, 241, 53, 240, 52, 7,
      52, 9, 33, 5, 88, 52, 240, 52, 241, 80, 2, 129, 12, 37, 82, 18, 68, 52, 8,
      33, 4, 8, 53, 8, 52, 9, 33, 5, 8, 53, 9, 52, 10, 34, 8, 53, 10, 66, 255,
      150, 34, 137,
    ]);

    this.ALGO_NOP_HASH =
      "BJATCHES5YJZJ7JITYMVLSSIQAVAWBQRVGPQUDT5AZ2QSLDSXWWM46THOY";
    this.ALGO_NOP = new Uint8Array([5, 129, 1, 67]);
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

  async readAccountBalance(algodClient: any, accountAddr: any) {
    const accountInfoResponse = await algodClient
      .accountInformation(accountAddr)
      .do();
    return accountInfoResponse["amount"];
  }

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


      console.log(util.inspect(signedVAA, { maxArrayLength: null }));

      // const { parse_vaa } = await importCoreWasm();
      //console.log(Buffer.from(signedVAA).toString('hex'))
      //const parsedVAA = parse_vaa(signedVAA);
      //console.log(parsedVAA);

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
      const gk = this.globalStateLookupKey(globalState, buf.toString());
      guardianKeys.push(Buffer.from(gk, "base64").toString("hex"));
    }

    const gid = crypto.randomBytes(16).toString("hex");
    const groupTxSet = [];

    const sigSubsets = [];

      // const bal = await this.readAccountBalance(provider, this.ALGO_VERIFY_HASH);

    // We need to fund this critter...
    groupTxSet.push(
      algosdk.makePaymentTxnWithSuggestedParams(
        signer.addr,
        this.ALGO_VERIFY_HASH,
        numOfVerifySteps * txParams.fee,
        undefined,
        undefined,
        txParams
      )
    );

    const siglen = signedVAA.slice(5, 6);
    const payload = signedVAA.slice(6 + siglen[0] * 66);
    const signatures = signedVAA.slice(6, 6 + siglen[0] * 66);
    const sigSetLen = 132 * stepSize;

    for (let i = 0; i < numOfVerifySteps; i++) {
      const st = stepSize * i;
      //
      const keySubset = guardianKeys.slice(
        st,
        i < numOfVerifySteps - 1 ? st + stepSize : undefined
      );

      sigSubsets.push(
        signatures.slice(
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
        new Uint8Array(payload)
      );

      groupTxSet.push(tx);
    }

    const tx = algosdk.makeApplicationNoOpTxn(
      signer.addr,
      txParams,
      vaaProcessorAppId,
      [new Uint8Array(Buffer.from(action))],
      undefined,
      undefined,
      undefined,
      new Uint8Array(payload)
    );

    groupTxSet.push(tx);

    algosdk.assignGroupID(groupTxSet);

    const signedGroup = [];
    let i = 0;
    for (const tx of groupTxSet) {
      // All transactions except the first and last must be signed by stateless code.

      if (i === groupTxSet.length - 1 || i == 0) {
        const txSigned = tx.signTxn(signer.sk);
        signedGroup.push(txSigned);
      } else {
        //          console.log(sigSubsets[i-1])
        //        const ls = Buffer.from(String(sigSubsets[i-1]), "hex");
        const lsig = new algosdk.LogicSigAccount(this.ALGO_VERIFY, [
          sigSubsets[i - 1],
        ]);
        const stxn = algosdk.signLogicSigTransaction(tx, lsig);
        signedGroup.push(stxn.blob);
      }
      i++;
    }

    try {
      // Submit the transaction
      const rawTx = await provider.sendRawTransaction(signedGroup).do();

      await this.waitForConfirmation(rawTx["txId"], provider);
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
