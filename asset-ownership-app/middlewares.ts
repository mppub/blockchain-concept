import {Request, Response, NextFunction} from 'express'


// Endpoint to Get a Block by Height (GET Endpoint)
const getBlockByHeight = (blockchainInstance) => async(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response<any>> => {
    if(req.params.height) {
        const height = parseInt(req.params.height);
        console.log(blockchainInstance)
        console.dir(blockchainInstance, {depth: null})
        let block = await blockchainInstance.getBlockByHeight(height);
        if(block){
            return res.status(200).json(block);
        } else {
            return res.status(404).send("Block Not Found");
        }
    } else {
        return res.status(404).send("Block Not Found");
    }

}

// This endpoint allows you to retrieve the block by hash (GET endpoint)
const getBlockByHash = (blockchainInstance) => async(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response<any>> => {
    if(req.params.hash) {
        const hash = req.params.hash;
        let block = await blockchainInstance.getBlockByHash(hash);
        if(block){
            return res.status(200).json(block);
        } else {
            return res.status(404).send("Block Not Found");
        }
    } else {
        return res.status(404).send("Block Not Found Review the Parameters");
    }

}

// Endpoint that allow Submit a Star, yu need first to `requestOwnership` to have the message (POST endpoint)
const submitStar = (blockchainInstance) => async(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response<any>> => {
    if(req.body.address && req.body.signature && req.body.star) {
        const address = req.body.address;
        const message = req.body.message;
        const signature = req.body.signature;
        const star = req.body.star;
        try {
            let block = await blockchainInstance.submitStar(address, message, signature, star);
            if(block){
                return res.status(200).json(block);
            } else {
                return res.status(500).send("An error happened");
            }
        } catch (error) {
            return res.status(500).send(error);
        }
    } else {
        return res.status(500).send("Check the Body Parameter");
    }
}

// This endpoint allows you to request the list of Stars registered by an owner
const getStarsByOwner = (blockchainInstance) => async(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response<any>> => {
    if(req.params.address) {
        const address = req.params.address;
        try {
            let stars = await blockchainInstance.getStarsByWalletAddress(address);
            if(stars){
                return res.status(200).json(stars);
            } else {
                return res.status(404).send("Block Not Found");
            }
        } catch (error) {
            return res.status(500).send("An error happened");
        }
    } else {
        return res.status(500).send("Block Not Found Review the Parameters");
    }
}

const mountStatefulMiddlewares = (server, blockchainInstance) => {
  server.get('/block/height/:height', getBlockByHeight(blockchainInstance))
  server.get('/block/:hash', getBlockByHash(blockchainInstance))
  server.get('/blocks/:address', getStarsByOwner(blockchainInstance))
  server.post('/submitStar', submitStar(blockchainInstance))
}

export {mountStatefulMiddlewares};
