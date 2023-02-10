// import { readFileSync } from "fs";
// import * as yaml from "js-yaml";
import { join } from "path";
// import enviroment from "./env/env.interface";

export default () => require(join(__dirname, `./env/${process.env.NODE_ENV}.env`)).default;