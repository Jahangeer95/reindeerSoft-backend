import Joi from "joi";

export function validateNewUser(req, res, next) {
  const joiSchema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(7).max(100).required(),
  });

  const { error, value } = joiSchema.validate(req.body);
  if (error) {
    const validationError = new Error(error.details[0].message);
    validationError.statusCode = 400;
    return next(validationError);
  }
  req.body = value;
  next();
}

export function validateUser(req, res, next) {
  const joiSchema = Joi.object({
    // name: Joi.string().min(5).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(7).max(100).required(),
  });

  const { error, value } = joiSchema.validate(req.body);
  if (error) {
    const validationError = new Error(error.details[0].message);
    validationError.statusCode = 400;
    return next(validationError);
  }
  req.body = value;
  next();
}
