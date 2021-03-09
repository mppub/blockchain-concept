const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
import StarBlockchain from './starBlockchain';
import {mountStatefulMiddlewares} from "./middlewares";


const blockchainInstance = new StarBlockchain();

const server = express();
server.set("port", 9254);

server.use(morgan("dev"));
server.use(bodyParser.urlencoded({extended:true}));
server.use(bodyParser.json());
mountStatefulMiddlewares(server, blockchainInstance);

server.listen(server.get("port"), () => {
	console.log(`Server listening at http://localhost:${server.get("port")}`);
});
