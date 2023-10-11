import * as yup from "yup";

export const userSchema = yup.object().shape({
  email: yup
    .string("Email must be string")
    .required("Email is required")
    .email("This must be email"),
  password: yup.string().required().max(18, "Max 18").min(6, "Min 6"),
  // url: yup.string().url("Url must be url"),
  // age: yup.number().positive(),
});
