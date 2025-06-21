import { Request, Response, NextFunction } from 'express';
import { validate, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';

export function validationMiddleware(
    type: any,
    skipMissingProperties = false,
) {
    return (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const dtoObj = plainToInstance(type, req.body);

        validate(dtoObj, { skipMissingProperties }).then(
            (errors: ValidationError[]) => {
                if (errors.length > 0) {
                    const dtErrors = errors.map(
                        (error: ValidationError) => {
                            return {
                                field: error.property,
                                errors: (
                                    Object as any
                                ).values(error.constraints),
                            };
                        },
                    );

                    res.status(400).json({
                        errors: dtErrors,
                    });
                } else {
                    req.body = dtoObj;
                    next();
                }
            },
        );
    };
}
