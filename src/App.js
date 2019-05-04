import React from "react";
import "./App.css";
import netlifyLogo from "./images/netlify-logo-alt.png";
import formikLogo from "./images/formik.png";
import octocat from "./images/octocat.jpg";
import FormikForm from "./FormikForm";

const App = () => {
  return (
    <div className="container d-flex flex-column align-items-center justify-content-center w-100 mt-5">
      <div className="d-flex d-sm-none align-items-center justify-content-center text-muted">
        <img src={netlifyLogo} alt="netlify logo" height="30%" width="30%" />
        <span className="display-4 mx-4" style={{ fontSize: "36px" }}>
          +
        </span>
        <img src={formikLogo} alt="formik logo" height="20%" width="20%" />
      </div>
      <div className="d-none d-sm-flex align-items-center justify-content-center text-muted">
        <img src={netlifyLogo} alt="netlify logo" />
        <span className="display-4 mx-4">+</span>
        <img src={formikLogo} alt="formik logo" />
      </div>
      <div
        className="d-none d-sm-block display-4 m-5"
        style={{ fontSize: "48px" }}
      >
        Netlify Forms with Formik
      </div>
      <div className="d-flex justify-content-around w-100">
        <FormikForm />
      </div>
      <a href="https://github.com/kimfucious/netlify-forms-formik">
        <img
          alt="Octocat"
          className="m-5"
          height="30px"
          src={octocat}
          width="30px"
        />
      </a>
    </div>
  );
};

export default App;
