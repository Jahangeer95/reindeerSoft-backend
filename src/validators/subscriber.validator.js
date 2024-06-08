import Joi from "joi";

export function validateSubscriber(req, res, next) {
  const subscriberSchema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
  });

  const { error } = subscriberSchema.validate(req.body);
  if (error) {
    const validationError = new Error(error.details[0].message);
    validationError.statusCode = 400;
    return next(validationError);
  }

  next();
}

export function validateSubscriberEmail(req, res, next) {
  const subscriberSchema = Joi.object({
    email: Joi.string().email().required(),
  });
  const email = req?.params?.email;

  const { error } = subscriberSchema.validate({ email });
  if (error) {
    const validationError = new Error(error.details[0].message);
    validationError.statusCode = 400;
    return next(validationError);
  }

  next();
}
