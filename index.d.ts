// Type definitions for chai-deep-match v1.0.2 
// Project: https://github.com/JamesMGreene/chai-deep-match
// Definitions by: Fred Eisele <https://github.com/phreed>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

/// <reference types="chai" />

declare namespace Chai {

    interface DeepMatch extends Assertion {
        (value: any, message?: string): Assertion;
    }

    interface Deep {
        /**
         * Extends Chai with an assertion for deeply matching objects.
         * Perform subset equality checking.
         */
        match: DeepMatch;
    }
}

declare module "chai-deep-match" {
    function chaiDeepMatch(chai: any, utils: any): void;
    export = chaiDeepMatch;
}

