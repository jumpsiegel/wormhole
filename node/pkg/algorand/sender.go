package algorand

import (
	"context"
//	"encoding/json"
	"io/ioutil"
//	"time"
//	"github.com/algorand/go-algorand-sdk/client/algod"
//	"github.com/algorand/go-algorand-sdk/client/kmd"
	"github.com/certusone/wormhole/node/pkg/vaa"
)

// SubmitVAA prepares transaction with signed VAA and sends it to the Algorand blockchain
func SubmitVAA(ctx context.Context, urlLCD string, chainID string, contractAddress string, feePayer string, signed *vaa.VAA) (string, error) {

	// Serialize VAA
//	vaaBytes, err := signed.Marshal()
//	if err != nil {
//		return nil, err
//	}

        return "", nil

//
//	// Derive Raw Private Key
//	privKey, err := key.DerivePrivKey(feePayer, key.CreateHDPath(0, 0))
//	if err != nil {
//		return nil, err
//	}
//
//	// Generate StdPrivKey
//	tmKey, err := key.StdPrivKeyGen(privKey)
//	if err != nil {
//		return nil, err
//	}
//
//	// Generate Address from Public Key
//	addr := msg.AccAddress(tmKey.PubKey().Address())


//	algodClient, err := algod.MakeClient(algodAddress, algodToken)
//	if err != nil {
//		fmt.Printf("failed to make algod client: %s\n", err)
//                return "", nil
//	}

//	// Create LCDClient
//	LCDClient := client.NewLCDClient(
//		urlLCD,
//		chainID,
//		msg.NewDecCoinFromDec("uusd", msg.NewDecFromIntWithPrec(msg.NewInt(15), 2)), // 0.15uusd
//		msg.NewDecFromIntWithPrec(msg.NewInt(15), 1), tmKey, time.Second*15,
//	)
//
//	contract, err := msg.AccAddressFromBech32(contractAddress)
//	if err != nil {
//		return nil, err
//	}
//
//	// Create tx
//	contractCall, err := json.Marshal(submitVAAMsg{
//		Params: submitVAAParams{
//			VAA: vaaBytes,
//		}})
//
//	if err != nil {
//		return nil, err
//	}
//
//	executeContract := msg.NewExecuteContract(addr, contract, contractCall, msg.NewCoins())
//
//	transaction, err := LCDClient.CreateAndSignTx(ctx, client.CreateTxOptions{
//		Msgs: []msg.Msg{
//			executeContract,
//		},
//		Fee: tx.StdFee{
//			Gas:    msg.NewInt(0),
//			Amount: msg.NewCoins(),
//		},
//	})
//	if err != nil {
//		return nil, err
//	}
//
//	// Broadcast
//	return LCDClient.Broadcast(ctx, transaction)
}

// ReadKey reads file and returns its content as a string
func ReadKey(path string) (string, error) {
	b, err := ioutil.ReadFile(path)
	if err != nil {
		return "", err
	}
	return string(b), nil
}
