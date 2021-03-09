const {SHA256} = require('crypto-js');

type BlockBody = any;

interface IBlockData {
  height?: number;
  timestamp?: number;
  previousHash?: string;
  hash?: string;
  body: BlockBody;
}

interface IBlock extends IBlockData {
  getDataForHash: () => string;
  validateBlocksHash: () => Promise<boolean>
  getBody: () => Promise<object>
}

class Block implements IBlock {
  timestamp: number;
  height: number;
  previousHash: string;
  hash: string;
  body: BlockBody;

  constructor(block: IBlockData){
    for (let key in block) {
      this[key] = block[key]
    }
  }

  validateBlocksHash = async (): Promise<boolean> => {
    return SHA256(this.getDataForHash()).toString() === this.hash;
  }

  getDataForHash = (): string => {
    return JSON.stringify({
      timestamp: this.timestamp,
      height: this.height,
      previousHash: this.previousHash,
      body: this.body
    });
  }

  getBody = async (decoded = true) => {
    try {
      return JSON.parse(Buffer.from(this.body, 'hex').toString())
    }
    catch (e) {
      console.log('Error while parsing the body:', e)
    }
  }
}

interface IBlockchain {
  blocks: IBlock[];
}

class BlockChain implements IBlockchain {
  blocks: IBlock[] = [];

  constructor(genesisMsg: string = 'c8486f507c304e5fc0b1a36cebfb92a0', blocks?: IBlock[]) {
    if (blocks && blocks.length && this.validate(blocks)) {
      this.blocks = blocks;
    }
    else {
      this.addBlock({genesis: genesisMsg}).then((res) => {
        console.log('success', res)
      },(err) => {
        throw new Error(JSON.stringify(err))
      })
    }
  }

  validate = async (blocks: IBlock[] = this.blocks): Promise<boolean> => {
    blocks = blocks && blocks.length ? blocks : this.blocks as IBlock[]
    for (let i = 1; i < blocks.length; i++) {

      if (blocks[i-1].hash !== blocks[i].previousHash || !(await blocks[i-1].validateBlocksHash())) {
        return false
      }
    }

    return true
  }

  addBlock = async (blockJsonData: BlockBody): Promise<number> => {
    const newBlockData: IBlockData = {
      timestamp: Date.now(),
      height: this.blocks.length,
      previousHash: this.blocks[this.blocks.length - 1]?.hash,
      body: Buffer.from(JSON.stringify(blockJsonData)).toString('hex')
    }
    newBlockData.hash = this.getHashOfBlock(newBlockData)
    const newBlock = new Block(newBlockData)

    return this.blocks.push(newBlock)
  }

  getHashOfBlock = (blockJsonData: IBlockData): string => {
    return SHA256(JSON.stringify(blockJsonData)).toString()
  }
}

export {
  BlockChain,
  Block
}
