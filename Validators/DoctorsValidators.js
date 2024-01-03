import { Joi, celebrate, Segments, errors } from "celebrate";

const PostSignupValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().not().empty().required(),
    name: Joi.string().not().empty().required(),
    bio: Joi.string().not().empty().required(),
    proficiency: Joi.string().not().empty().required(),
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
    bio: Joi.string().not().empty().optional(),
    proficiency: Joi.string().not().empty().optional(),
    password: Joi.string().not().empty().optional(),
  }),
});

const GetDoctorsValidator = celebrate({
  [Segments.QUERY]: Joi.object().keys({
    page: Joi.number().not().empty().required().min(1),
  }),
});

const GetReviewsValidator = celebrate({
  [Segments.QUERY]: Joi.object().keys({
    id: Joi.string().not().empty().required(),
    page: Joi.number().not().empty().required().min(1),
  }),
});

const PostAvailableTimeValidator = celebrate({
  [Segments.COOKIES]: Joi.object().keys({
    token: Joi.string().not().empty().required(),
  }),
  [Segments.BODY]: Joi.object().keys({
    id: Joi.string().not().empty().required(),
    startTime: Joi.number()
      .not()
      .empty()
      .required()
      .min(
        new Date(new Date().setMinutes(0, 0, 0)).setHours(
          new Date().getHours() + 3
        )
      ),
    endTime: Joi.number()
      .not()
      .empty()
      .required()
      .min(
        new Date(new Date().setMinutes(0, 0, 0)).setHours(
          new Date().getHours() + 4
        )
      ),
  }),
});

const GetAvailableTimesValidator = celebrate({
  [Segments.QUERY]: Joi.object().keys({
    id: Joi.string().not().empty().required(),
    page: Joi.number().not().empty().required().min(1),
  }),
});
export {
  PostSignupValidator,
  PutProfileValidator,
  GetDoctorsValidator,
  GetReviewsValidator,
  PostAvailableTimeValidator,
  GetAvailableTimesValidator,
};
