import React from "react";
import "./App.css";
import netlifyLogo from "./images/netlify-logo-alt.png";
import formikLogo from "./images/formik.png";
import octocat from "./images/octocat.jpg";
import StatefulForm from "./StatefulForm";
import FormikForm from "./FormikForm";
import PlainHTMLForm from "./PlainHTMLForm";

const App = () => {
  return (
    <div className="container d-flex flex-column align-items-center justify-content-center w-100 vh-100">
      <div className="d-flex align-items-center justify-content-center text-muted">
        <img src={netlifyLogo} alt="netlify logo" />
        <span className="display-4 mx-4">+</span>
        <img src={formikLogo} alt="formik logo" />
      </div>
      <div className="display-4 m-5">Netlify Forms with Formik</div>
      <div className="d-flex justify-content-around w-100 mt-3">
        <PlainHTMLForm type="HTML Form" />
        <StatefulForm type="Stateful React Form" />
        <FormikForm type="Formik Form" />
      </div>
      <img src={octocat} alt="Octocat" height="30px" width="30px" />
    </div>
  );
};

export default App;
