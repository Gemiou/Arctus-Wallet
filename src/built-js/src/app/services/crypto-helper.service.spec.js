"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var crypto_helper_service_1 = require("./crypto-helper.service");
describe('CryptoHelperService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [crypto_helper_service_1.CryptoHelperService]
        });
    });
    it('should be created', testing_1.inject([crypto_helper_service_1.CryptoHelperService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=crypto-helper.service.spec.js.map