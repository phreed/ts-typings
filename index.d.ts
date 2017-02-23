// Type definitions for jsedn v0.1.0 
// Project: https://github.com/shawnxcode/jsedn
// Definitions by: Fred Eisele <https://github.com/phreed>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

/// <reference types="node" />

/**
### 0.1.0 Changelog (https://github.com/<SAMPLE>)

*/

import * as fs from "fs";

declare namespace JSEDN {
    
   function parse(ednString: string): EDN;

   class Vector {
     new (indexed: any);
   }

   class KW {
     new (name: string);
   }

   interface EDN {
       at(vector: Vector): EDN;
       at(kw: KW): EDN;
   }

}
export = JSEDN;


