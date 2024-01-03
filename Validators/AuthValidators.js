import { Joi, celebrate, Segments, errors } from "celebrate";

const PostAuthValidator = celebrate({
  [Segments.COOKIES]: Joi.object().keys({
    token: Joi.string().not().empty().required(),
  }),
});

const PostLoginValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().not().empty().required(),
    password: Joi.string().not().empty().required(),
  }),
});

export { PostAuthValidator, PostLoginValidator };
