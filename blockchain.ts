const {SHA256} = require('crypto-js');

type BlockBody = any[];

interface IBlockData {
  height?: number;
  timestamp?: number;
  previousHash?: string;
  hash?: string;
  body: BlockBody;
}

interface IBlock extends IBlockData {
  getDataForHash: () => string;
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

  getDataForHash = (): string => {
    return JSON.stringify({
      timestamp: this.timestamp,
      height: this.height,
      previousHash: this.previousHash,
      body: this.body
    });
  }
}

interface IBlockchain {
  blocks: IBlock[];
}

class BlockChain implements IBlockchain {
  blocks: IBlock[] = [];
  
  validate = (blocks?: IBlock[]): boolean => {
    blocks = blocks && blocks.length ? blocks : this.blocks as IBlock[]
    for (let i = 1; i < blocks.length; i++) {
      
      if (blocks[i-1].hash !== blocks[i].previousHash || SHA256(blocks[i-1].getDataForHash()).toString() !== blocks[i].previousHash) {
        return false
      }
    }

    return true
  }

  addBlock = (newBlockBody: BlockBody): number => {
    const newBlockData: IBlockData = {
      timestamp: Date.now(),
      height: this.blocks.length,
      previousHash: this.blocks[this.blocks.length - 1]?.hash,
      body: newBlockBody
    }
    newBlockData.hash = this.getHashOfBlock(newBlockData)
    const newBlock = new Block(newBlockData)

    return this.blocks.push(newBlock)
  }

  constructor(blocks?: IBlock[]) {
    if (blocks && blocks.length && this.validate(blocks)) {
      this.blocks = blocks;
    }
    else {
      this.addBlock(['hola caracola'])
    }
  }

  getHashOfBlock = (blockData: IBlockData): string => {
    return SHA256(JSON.stringify(blockData)).toString()
  }
}

module.exports = BlockChain