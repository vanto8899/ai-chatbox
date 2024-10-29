import { Request, Response, NextFunction } from 'express';
import { body, ValidationChain, validationResult } from "express-validator";

export const validate = (validations: ValidationChain[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      // Run all validations
      for (let validation of validations) {
        await validation.run(req);
      }
  
      // Check for validation errors
      const errors = validationResult(req);
      if (errors.isEmpty()) {
        return next();
      }
  
      // Send validation errors if any
      return res.status(422).json({ errors: errors.array() });
    };
  };

export const loginValidator = [
    body("email").trim().isEmail().withMessage("Email is required and correct format!"),
    body("password").trim().isLength({ min:6 }).withMessage("Password should contain at least 6 characters!")
]

export const signupValidator = [
    body("name").notEmpty().withMessage("Name is required!"),
    ...loginValidator,
]

export const chatCompletionValidator = [
  body("message").notEmpty().withMessage("Message is required!"),
]