import { Joi, celebrate, Segments, errors } from "celebrate";

const PostSignupValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().not().empty().required(),
    name: Joi.string().not().empty().required(),
    password: Joi.string().not().empty().required(),
  }),
});
const PutProfileValidator = celebrate({
  [Segments.COOKIES]: Joi.object().keys({
    token: Joi.string().not().empty().required(),
  }),
  [Segments.BODY]: Joi.object().keys({
    id: Joi.string().not().empty().required(),
    email: Joi.string().email().not().empty().optional(),
    name: Joi.string().not().empty().optional(),
    password: Joi.string().not().empty().optional(),
  }),
});

const PostReviewValidator = celebrate({
  [Segments.COOKIES]: Joi.object().keys({
    token: Joi.string().not().empty().required(),
  }),
  [Segments.BODY]: Joi.object().keys({
    id: Joi.string().not().empty().required(),
    rate: Joi.number().not().empty().required(),
    comment: Joi.string().not().empty().required(),
    doctor_id: Joi.string().not().empty().required(),
    time: Joi.number().not().empty().required(),
  }),
});
export { PostSignupValidator, PutProfileValidator, PostReviewValidator };
