// npx prettier --write .

import algosdk from "algosdk";

const sha512 = require("js-sha512");
const hibase32 = require("hi-base32");
import {
  importCoreWasm,
  importTokenWasm,
  setDefaultWasm,
} from "../solana/wasm";
setDefaultWasm("node");

const ALGORAND_ADDRESS_SIZE = 58;

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
function addressFromByteBuffer(addr: any) {
  const bytes = Buffer.from(addr, "base64");

  // compute checksum
  const checksum = sha512.sha512_256.array(bytes).slice(28, 32);

  const c = new Uint8Array(bytes.length + checksum.length);
  c.set(bytes);
  c.set(checksum, bytes.length);

  const v = hibase32.encode(c);

  return v.toString().slice(0, ALGORAND_ADDRESS_SIZE);
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

function appValueState(stateValue: any): string {
  let text = "";

  if (stateValue.type == 1) {
    const addr = addressFromByteBuffer(stateValue.bytes);
    if (addr.length == ALGORAND_ADDRESS_SIZE) {
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
async function readAppGlobalState(
  algodClient: any,
  appId: any,
  accountAddr: any
) {
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

function globalStateLookupKey(stateArray: any, key: string) {
  for (let j = 0; j < stateArray.length; j++) {
    const text = Buffer.from(stateArray[j].key, "base64").toString();

    if (key === text) {
      return appValueState(stateArray[j].value);
    }
  }
  throw new Error("key not found");
}

async function readAppGlobalStateByKey(
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
          return appValueState(stateArray[j].value);
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

async function publish(
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

  // console.log(parsedVAA);

  const globalState = await readAppGlobalState(
    provider,
    vaaProcessorAppId,
    vaaProcessorOwner
  );

  const guardianCount = parseInt(globalStateLookupKey(globalState, "gscount"));
  const stepSize = parseInt(globalStateLookupKey(globalState, "vssize"));
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

  //    try {
  const guardianKeys = [];
  const buf = Buffer.alloc(8);
  for (let i = 0; i < guardianCount; i++) {
    buf.writeBigUInt64BE(BigInt(i++));
    const gk = globalStateLookupKey(globalState, buf.toString());

    guardianKeys.push(gk);
  }

  //const gid = this.pclib.beginTxGroup()
  //const sigSubsets = []

  //      for (let i = 0; i < this.numOfVerifySteps; i++) {
  //        const st = this.stepSize * i
  //        const sigSetLen = 132 * this.stepSize
  //
  //        const keySubset = guardianKeys.slice(st, i < this.numOfVerifySteps - 1 ? st + this.stepSize : undefined)
  //        sigSubsets.push(data.signatures.slice(i * sigSetLen, i < this.numOfVerifySteps - 1 ? ((i * sigSetLen) + sigSetLen) : undefined))
  //        this.pclib.addVerifyTx(gid, this.compiledVerifyProgram.hash, txParams, data.vaaBody, keySubset, this.guardianCount)
  //      }
  //      this.pclib.addPriceStoreTx(gid, this.vaaProcessorOwner, txParams, data.symbol, data.vaaBody.slice(51))
  //      const txId = await this.pclib.commitVerifyTxGroup(gid, this.compiledVerifyProgram.bytes, sigSubsets, this.vaaProcessorOwner, this.signCallback.bind(this))
  //      publishInfo.txid = txId
  //    } catch (e: any) {
  //      publishInfo.status = StatusCode.ERROR_SUBMIT_MESSAGE
  //      publishInfo.reason = e.response.text ? e.response.text : e.toString()
  //      return publishInfo
  //    }
  //
  //    return publishInfo
  return {};
}

export async function createWrappedOnAlgorandTxn(
  tokenBridgeAddress: string,
  provider: algosdk.Algodv2,
  signer: algosdk.Account,
  vaaBody: Uint8Array
) {
  console.log("You suck");
  return publish(tokenBridgeAddress, provider, signer, vaaBody);
}
