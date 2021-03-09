import {BlockChain} from "../blockchain";
import {verify} from "bitcoinjs-message"

class StarBlockchain extends BlockChain {
  defaultMessageForSig = 'aaa333';

  constructor(genesisText?: string) {
    super(genesisText);
  }

  submitStar = async (
    legacyAddress: string,
    message: string = this.defaultMessageForSig,
    signature: string,
    star: object
  ) => {
    if (!verify(message, legacyAddress, signature)) {
      return false
    }
    const data = {}
    data[legacyAddress] = star

    return await this.addBlock(data)
  }

  // getBlockByHash = (hash) => {
  //
  // }


  getBlockByHeight = async (height: string) => {
    return this.blocks[parseInt(height)]
  }

  getStarsByWalletAddress = async (address) => {
    const output = []
    for (let i = 1; i < this.blocks.length; i++) {
      const currentBody = await this.blocks[i].getBody();

      if (currentBody[address]) {
        output.push(currentBody[address])
      }
    }

    return output
  }
}

export default StarBlockchain;
