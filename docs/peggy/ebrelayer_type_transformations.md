From smart contracts:

```solidity
    /*
     * @dev: Event declarations
     */
    event LogBurn(
        address _from,
        bytes _to,
        address _token,
        string _symbol,
        uint256 _value,
        uint256 _nonce
    );

    event LogLock(
        address _from,
        bytes _to,
        address _token,
        string _symbol,
        uint256 _value,
        uint256 _nonce
    );
```

in ebrelayer:

```go
func (sub EthereumSub) logToEvent(clientChainID *big.Int, contractAddress common.Address,
	contractABI abi.ABI, cLog ctypes.Log) (types.EthereumEvent, bool, error)
```

```cLog ctypes.Log``` is a standard type for an Ethereum log message, not our custom type

```go
// EthereumEvent struct is used by LogLock and LogBurn
type EthereumEvent struct {
	To                    []byte
	Symbol                string
	EthereumChainID       *big.Int
	Value                 *big.Int
	Nonce                 *big.Int
	ClaimType             ethbridge.ClaimType
	ID                    [32]byte
	BridgeContractAddress common.Address
	From                  common.Address
	Token                 common.Address
}
```

Then 

```go
func (sub EthereumSub) handleEthereumEvent(txFactory tx.Factory, events []types.EthereumEvent) error
```

Converts a slice of EthereumEvent to

```go
func EthereumEventToEthBridgeClaim(valAddr sdk.ValAddress, event types.EthereumEvent) (ethbridge.EthBridgeClaim, error)
```

```go
// EthBridgeClaim is a structure that contains all the data for a particular
// bridge claim
type EthBridgeClaim struct {
	EthereumChainId int64 `protobuf:"varint,1,opt,name=ethereum_chain_id,json=ethereumChainId,proto3" json:"ethereum_chain_id,omitempty" yaml:"ethereum_chain_id"`
	// bridge_contract_address is an EthereumAddress
	BridgeContractAddress string `protobuf:"bytes,2,opt,name=bridge_contract_address,json=bridgeContractAddress,proto3" json:"bridge_contract_address,omitempty" yaml:"bridge_contract_address"`
	Nonce                 int64  `protobuf:"varint,3,opt,name=nonce,proto3" json:"nonce,omitempty" yaml:"nonce"`
	Symbol                string `protobuf:"bytes,4,opt,name=symbol,proto3" json:"symbol,omitempty" yaml:"symbol"`
	// token_contract_address is an EthereumAddress
	TokenContractAddress string `protobuf:"bytes,5,opt,name=token_contract_address,json=tokenContractAddress,proto3" json:"token_contract_address,omitempty" yaml:"token_contract_address"`
	// ethereum_sender is an EthereumAddress
	EthereumSender string `protobuf:"bytes,6,opt,name=ethereum_sender,json=ethereumSender,proto3" json:"ethereum_sender,omitempty" yaml:"ethereum_sender"`
	// cosmos_receiver is an sdk.AccAddress
	CosmosReceiver string `protobuf:"bytes,7,opt,name=cosmos_receiver,json=cosmosReceiver,proto3" json:"cosmos_receiver,omitempty" yaml:"cosmos_receiver"`
	// validator_address is an sdk.ValAddress
	ValidatorAddress string                                 `protobuf:"bytes,8,opt,name=validator_address,json=validatorAddress,proto3" json:"validator_address,omitempty" yaml:"validator_address"`
	Amount           github_com_cosmos_cosmos_sdk_types.Int `protobuf:"bytes,9,opt,name=amount,proto3,customtype=github.com/cosmos/cosmos-sdk/types.Int" json:"amount" yaml:"amount"`
	ClaimType        ClaimType                              `protobuf:"varint,10,opt,name=claim_type,json=claimType,proto3,enum=sifnode.ethbridge.v1.ClaimType" json:"claim_type,omitempty"`
}
```

Then

```go
func RelayToCosmos(factory tx.Factory, claims []*types.EthBridgeClaim, cliCtx client.Context, sugaredLogger *zap.SugaredLogger) error
```

```go
type MsgCreateEthBridgeClaim struct {
	EthBridgeClaim *EthBridgeClaim `protobuf:"bytes,1,opt,name=eth_bridge_claim,json=ethBridgeClaim,proto3" json:"eth_bridge_claim,omitempty" yaml:"eth_bridge_claim"`
}
```

# On the server:

```go
func (srv msgServer) CreateEthBridgeClaim(goCtx context.Context, msg *types.MsgCreateEthBridgeClaim) (*types.MsgCreateEthBridgeClaimResponse, error)
```

```go
func (k Keeper) ProcessClaim(ctx sdk.Context, claim *types.EthBridgeClaim) (oracletypes.Status, error)
```

```go
func CreateOracleClaimFromEthClaim(ethClaim *EthBridgeClaim) (oracletypes.Claim, error)
```

```go
// Claim contrains an arbitrary claim with arbitrary content made by a given
// validator
type Claim struct {
	Id               string `protobuf:"bytes,1,opt,name=id,proto3" json:"id,omitempty"`
	ValidatorAddress string `protobuf:"bytes,2,opt,name=validator_address,json=validatorAddress,proto3" json:"validator_address,omitempty"`
	Content          string `protobuf:"bytes,3,opt,name=content,proto3" json:"content,omitempty"`
}
```

```go
func (k Keeper) ProcessClaim(ctx sdk.Context, claim types.Claim) (types.Status, error)
```

This is the code that actually does the work:
```go
func (k Keeper) ProcessSuccessfulClaim(ctx sdk.Context, claim string) error
```