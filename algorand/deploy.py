from algosdk.v2client.algod import AlgodClient
from algosdk.kmd import KMDClient
from algosdk import account, mnemonic
from algosdk.future import transaction
from pyteal import compileTeal, Mode, Expr
from pyteal import *
from algosdk.logic import get_application_address

ALGOD_ADDRESS = "http://localhost:4001"
ALGOD_TOKEN = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"

client = AlgodClient(ALGOD_TOKEN, ALGOD_ADDRESS)

vaa_processor_approval = client.compile(open("vaa-processor-approval.teal").read())
vaa_processor_clear = client.compile(open("vaa-processor-clear.teal").read())
vaa_verify = client.compile(open("vaa-verify.teal").read())

globalSchema = transaction.StateSchema(num_uints=2, num_byte_slices=6)
localSchema = transaction.StateSchema(num_uints=0, num_byte_slices=0)

txn = transaction.ApplicationCreateTxn(
    sender=sender.getAddress(),
    on_complete=transaction.OnComplete.NoOpOC,
    approval_program=vaa_processor_approval,
    clear_program=vaa_processor_clear,
    global_schema=globalSchema,
    local_schema=localSchema,
    app_args=app_args,
    sp=client.suggested_params(),
)

signedTxn = txn.sign(sender.getPrivateKey())
        
client.send_transaction(signedTxn)
        
response = self.waitForTransaction(client, signedTxn.get_txid())

