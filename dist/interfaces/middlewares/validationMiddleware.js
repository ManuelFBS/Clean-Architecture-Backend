"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationMiddleware = validationMiddleware;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
function validationMiddleware(type, skipMissingProperties = false) {
    return (req, res, next) => {
        const dtoObj = (0, class_transformer_1.plainToInstance)(type, req.body);
        (0, class_validator_1.validate)(dtoObj, { skipMissingProperties }).then((errors) => {
            if (errors.length > 0) {
                const dtErrors = errors.map((error) => {
                    return {
                        field: error.property,
                        errors: Object.values(error.constraints),
                    };
                });
                res.status(400).json({
                    errors: dtErrors,
                });
            }
            else {
                req.body = dtoObj;
                next();
            }
        });
    };
}
