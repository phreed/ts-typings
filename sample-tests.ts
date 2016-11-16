/// <reference path="./index.d.ts" />
/// <reference types="node" />
/// <reference types="chai" />


/**

*/

import { expect, config } from "chai";
import { chaiDeepMatch } from "chai-deep-match";
chai.use(chaiDeepMatch);

function test_it() {
    expect([{ "1": [2, 3, { "5": 6 }] }]).to.deep.match([]);
}

