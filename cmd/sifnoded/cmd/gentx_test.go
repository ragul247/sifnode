package cmd_test

import (
	"bytes"
	"encoding/json"
	"log"
	"testing"

	"github.com/cosmos/cosmos-sdk/server"
	svrcmd "github.com/cosmos/cosmos-sdk/server/cmd"
	sdk "github.com/cosmos/cosmos-sdk/types"
	genutiltypes "github.com/cosmos/cosmos-sdk/x/genutil/types"
	"github.com/stretchr/testify/require"
	tmproto "github.com/tendermint/tendermint/proto/tendermint/types"

	sifnodedcmd "github.com/Sifchain/sifnode/cmd/sifnoded/cmd"
	oracletypes "github.com/Sifchain/sifnode/x/oracle/types"

	"github.com/Sifchain/sifnode/app"
)

func TestGenTxCmd(t *testing.T) {
	rootCmd, _ := sifnodedcmd.NewRootCmd()
	buf := new(bytes.Buffer)
	rootCmd.SetOut(buf)
	rootCmd.SetErr(buf)
	rootCmd.SetArgs([]string{"add-genesis-validators", "sifvaloper1rwqp4q88ue83ag3kgnmxxypq0td59df4782tjn"})

	app.SetConfig(true)

	err := svrcmd.Execute(rootCmd, app.DefaultNodeHome);
	require.NoError(t, err)

	serverCtx := server.GetServerContextFromCmd(rootCmd)
	config := serverCtx.Config

	genFile := config.GenesisFile()
	appState, _, err := genutiltypes.GenesisStateFromGenFile(genFile)
	require.NoError(t, err)

	log.Print(appState)

	var oracleGenseisState oracletypes.GenesisState
	err = json.Unmarshal(appState[oracletypes.ModuleName], &oracleGenseisState)
	require.NoError(t, err)
	require.Equal(t, []string{"sifvaloper1rwqp4q88ue83ag3kgnmxxypq0td59df4782tjn"},
		oracleGenseisState.AddressWhitelist)

	sifapp := app.Setup(false)
	ctx := sifapp.BaseApp.NewContext(false, tmproto.Header{})

	expectedValidator, err := sdk.ValAddressFromBech32("sifvaloper1rwqp4q88ue83ag3kgnmxxypq0td59df4782tjn")
	require.NoError(t, err)
	validators := sifapp.OracleKeeper.GetOracleWhiteList(ctx)
	require.Equal(t, []sdk.ValAddress{expectedValidator}, validators)
}