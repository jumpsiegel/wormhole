
from algosdk.logic import get_application_address
from algosdk.future import transaction

import sys

sys.path.append("..")

from setup import Setup

class TEST2(Setup):
    def __init__(self) -> None:
        super().__init__()

    def test(self, args):
        appAddr = get_application_address(args.appid)
        suggestedParams = self.client.suggested_params()
        appCallTxn = transaction.ApplicationCallTxn(
            sender=self.target.getAddress(),
            index=args.appid,
            on_complete=transaction.OnComplete.NoOpOC,
            app_args=[b"parseAndVerifyVM"],
            sp=suggestedParams,
        )

        signedAppCallTxn = appCallTxn.sign(self.target.getPrivateKey())
        self.client.send_transactions([signedAppCallTxn])
        response = self.waitForTransaction(self.client, appCallTxn.get_txid())
        pprint.pprint(response.__dict__)

if __name__ == "__main__":
    test2 = TEST2()
    test2.main()

#   async publish (data: PythData): Promise<PublishInfo> {
#     const publishInfo: PublishInfo = { status: StatusCode.OK }
# 
#     const txParams = await this.algodClient.getTransactionParams().do()
#     txParams.fee = 1000
#     txParams.flatFee = true
# 
#     this.guardianCount = await tools.readAppGlobalStateByKey(this.algodClient, this.vaaProcessorAppId, this.vaaProcessorOwner, 'gscount')
#     this.stepSize = await tools.readAppGlobalStateByKey(this.algodClient, this.vaaProcessorAppId, this.vaaProcessorOwner, 'vssize')
#     this.numOfVerifySteps = Math.ceil(this.guardianCount / this.stepSize)
#     if (this.guardianCount === 0 || this.stepSize === 0) {
#       throw new Error('cannot get guardian count and/or step-size from global state')
#     }
#     //
#     // (!)
#     // Stateless programs cannot access state nor stack from stateful programs, so
#     // for the VAA Verify program to use the guardian set, we pass the global state as TX argument,
#     // (and check it against the current global list to be sure it's ok). This way it can be read by
#     // VAA verifier as a stateless program CAN DO READS of call transaction arguments in a group.
#     // The same technique is used for the note field, where the payload is set.
#     //
# 
#     try {
#       const guardianKeys = []
#       const buf = Buffer.alloc(8)
#       for (let i = 0; i < this.guardianCount; i++) {
#         buf.writeBigUInt64BE(BigInt(i++))
#         const gk = await tools.readAppGlobalStateByKey(this.algodClient, this.vaaProcessorAppId, this.vaaProcessorAppId, buf.toString())
#         guardianKeys.push(gk)
#       }
# 
#       const gid = this.pclib.beginTxGroup()
#       const sigSubsets = []
#       for (let i = 0; i < this.numOfVerifySteps; i++) {
#         const st = this.stepSize * i
#         const sigSetLen = 132 * this.stepSize
# 
#         const keySubset = guardianKeys.slice(st, i < this.numOfVerifySteps - 1 ? st + this.stepSize : undefined)
#         sigSubsets.push(data.signatures.slice(i * sigSetLen, i < this.numOfVerifySteps - 1 ? ((i * sigSetLen) + sigSetLen) : undefined))
#         this.pclib.addVerifyTx(gid, this.compiledVerifyProgram.hash, txParams, data.vaaBody, keySubset, this.guardianCount)
#       }
#       this.pclib.addPriceStoreTx(gid, this.vaaProcessorOwner, txParams, data.symbol, data.vaaBody.slice(51))
#       const txId = await this.pclib.commitVerifyTxGroup(gid, this.compiledVerifyProgram.bytes, sigSubsets, this.vaaProcessorOwner, this.signCallback.bind(this))
#       publishInfo.txid = txId
#     } catch (e: any) {
#       publishInfo.status = StatusCode.ERROR_SUBMIT_MESSAGE
#       publishInfo.reason = e.response.text ? e.response.text : e.toString()
#       return publishInfo
#     }
# 
#     return publishInfo
#   }


#    this.commitVerifyTxGroup = async function (programBytes, sigSubsets) {
#      algosdk.assignGroupID(this.groupTx)
#      const signedGroup = []
#      let i = 0
#      for (const tx of this.groupTx) {
#        const lsig = new algosdk.LogicSigAccount(programBytes, [Buffer.from(sigSubsets[i++], 'hex')])
#        const stxn = algosdk.signLogicSigTransaction(tx, lsig)
#        signedGroup.push(stxn.blob)
#      }
#
#      // Save transaction for debugging.
#
#      // fs.unlinkSync('signedgroup.stxn')
#
#      // for (let i = 0; i < signedGroup.length; ++i) {
#      //   fs.appendFileSync('signedgroup.stxn', signedGroup[i])
#      // }
#
#      // const dr = await algosdk.createDryrun({
#      //   client: algodClient,
#      //   txns: drtxns,
#      //   sources: [new algosdk.modelsv2.DryrunSource('lsig', fs.readFileSync(vaaVerifyStatelessProgramFilename).toString('utf8'))]
#      // })
#      // // const drobj = await algodClient.dryrun(dr).do()
#      // fs.writeFileSync('dump.dr', algosdk.encodeObj(dr.get_obj_for_encoding(true)))
#
#      // Submit the transaction
#      const tx = await this.algodClient.sendRawTransaction(signedGroup).do()
#      this.groupTx = []
#      return tx.txId
#    }
#
#    this.addVerifyTx = function (sender, params, payload, gksubset, totalguardians) {
#      const appArgs = []
#      appArgs.push(new Uint8Array(Buffer.from('verify')),
#        new Uint8Array(Buffer.from(gksubset.join(''), 'hex')),
#        algosdk.encodeUint64(parseInt(totalguardians)))
#
#      const tx = algosdk.makeApplicationNoOpTxn(sender,
#        params,
#        this.appId,
#        appArgs, undefined, undefined, undefined,
#        new Uint8Array(payload))
#      this.groupTx.push(tx)
#
#      return tx.txID()
#    }
#  }
