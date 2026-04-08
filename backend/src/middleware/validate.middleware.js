import { ApiError } from "../utils/ApiError.js";

export const validate = (schema, property = "body") => (req, _res, next) => {
  const { value, error } = schema.validate(req[property], {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    return next(
      new ApiError(
        400,
        "Invalid request payload",
        error.details.map((detail) => detail.message)
      )
    );
  }

  req[property] = value;
  return next();
};
