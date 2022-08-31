export class TokenDefinition {
  address: string;
  symbol: string;
  name: string;
  decimals: bigint;

  // Initialize a Token Definition with its attributes
  constructor(address: string, symbol: string, name: string, decimals: bigint) {
    this.address = address;
    this.symbol = symbol;
    this.name = name;
    this.decimals = decimals;
  }

  // Get all tokens with a static defintion
  // todo:
  static getStaticDefinitions(): Array<TokenDefinition> {
    let staticDefinitions = new Array<TokenDefinition>();

    // Add Note
    let tokenNote = new TokenDefinition(
      "0x4e71A2E537B7f9D9413D3991D37958c0b5e1e503",
      "NOTE",
      "Note",
      BigInt(18)
    );
    staticDefinitions.push(tokenNote);

    // Add USDC
    let tokenUsdc = new TokenDefinition(
      "0x80b5a32E4F032B2a058b4F29EC95EEfEEB87aDcd",
      "USDC",
      "USDC",
      BigInt(6)
    );
    staticDefinitions.push(tokenUsdc);

    // Add USDT
    let tokenUsdt = new TokenDefinition(
      "0xd567B3d7B8FE3C79a1AD8dA978812cfC4Fa05e75",
      "USDT",
      "USDT",
      BigInt(6)
    );
    staticDefinitions.push(tokenUsdt);

    // Add ATOM
    let tokenAtom = new TokenDefinition(
      "0xecEEEfCEE421D8062EF8d6b4D814efe4dc898265",
      "ATOM",
      "ATOM",
      BigInt(6)
    );
    staticDefinitions.push(tokenAtom);

    // Add ETH
    let tokenEth = new TokenDefinition(
      "0x5FD55A1B9FC24967C4dB09C513C3BA0DFa7FF687",
      "ETH",
      "ETH",
      BigInt(18)
    );
    staticDefinitions.push(tokenEth);

    // Add WETH
    let tokenWeth = new TokenDefinition(
      "0x826551890Dc65655a0Aceca109aB11AbDbD7a07B",
      "wCANTO",
      "wCANTO",
      BigInt(18)
    );
    staticDefinitions.push(tokenWeth);

    return staticDefinitions;
  }

  // Helper for hardcoded tokens
  static fromAddress(tokenAddress: string): TokenDefinition | null {
    let staticDefinitions = this.getStaticDefinitions();

    // Search the definition using the address
    for (let i = 0; i < staticDefinitions.length; i++) {
      let staticDefinition = staticDefinitions[i];
      if (staticDefinition.address == tokenAddress) {
        return staticDefinition;
      }
    }

    // If not found, return null
    return null;
  }
}
