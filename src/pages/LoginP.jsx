import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";

const LoginP = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: (values) => {
      const { email, password } = values;
      if (email === "saloxiddin2302@gmail.com" && password === "Creed2302") {
        navigate("/categories");
      } else {
        console.log("Login failed");
      }
    },
  });

  return (
    <div className="container d-flex vh-100 align-items-center justify-content-center body-bacground">
      <form className="form-login" onSubmit={formik.handleSubmit} autoComplete='off'>
        <input
        id="form-input"
          name="email"
          className="form-control  mb-3"
          type="text"
          placeholder="Email"
          onChange={formik.handleChange}
          value={formik.values.email}
        />
        <input
          name="password"
          className="form-control mb-3"
          type="password"
          placeholder="Password"
          onChange={formik.handleChange}
          value={formik.values.password}
        />
        <input  className="form-control " type="submit" value="Send" />

        
      </form>
    </div>
  );
};

export default LoginP;
