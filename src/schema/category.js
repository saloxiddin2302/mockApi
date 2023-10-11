import * as yup from "yup";

export const categorySchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  image: yup.string().url("Image must be url").required(),
});
