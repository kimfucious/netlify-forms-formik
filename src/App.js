import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import qs from "qs";
import "./App.css";
import netlifyLogo from "./images/netlify.png";
import formikLogo from "./images/formik.png";
import octocat from "./images/octocat.jpg";

const App = () => {
  const [errMsg, setErrMsg] = useState(false);
  return (
    <div className="d-flex flex-column align-items-center justify-content-center w-100 vh-100">
      <div className="d-flex align-items-center justify-content-center text-muted">
        <img src={netlifyLogo} alt="netlify logo" />
        <span className="display-4 mx-3">+</span>
        <img src={formikLogo} alt="formik logo" />
      </div>
      <div className="display-4 m-5">Netlify Forms with Formik Demo</div>
      <Formik
        initialValues={{ email: "", username: "" }}
        validate={values => {
          let errors = {};
          if (!values.email) {
            errors.email = "Required";
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          ) {
            errors.email = "Invalid email address";
          }
          if (!values.username) {
            errors.username = "Required";
          }
          return errors;
        }}
        onSubmit={async (values, { resetForm, setSubmitting }) => {
          setSubmitting(true);
          console.log(values);
          const data = {
            "form-name": "contact",
            ...values
          };
          const options = {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            data: qs.stringify(data),
            url: "/"
          };
          try {
            await axios(options);
            resetForm();
          } catch (e) {
            setErrMsg(e.message);
            console.log(e);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form
            name="contact"
            className="d-flex flex-column align-items-center"
          >
            <input type="hidden" name="form-name" value="contact" />
            <div className="form-group">
              <label
                className="col-form-label col-form-label-lg"
                htmlFor="username"
              >
                Name
              </label>
              <Field
                className="form-control form-control-lg"
                type="text"
                name="username"
              />
              <ErrorMessage
                className="text-danger"
                name="username"
                component="div"
              />
            </div>
            <div className="form-group">
              <label
                className="col-form-label col-form-label-lg"
                htmlFor="email"
              >
                Email
              </label>
              <Field
                className="form-control form-control-lg"
                type="email"
                name="email"
              />
              <ErrorMessage
                className="text-danger"
                name="email"
                component="div"
              />
            </div>
            <button
              className="btn btn-lg btn-outline-primary m-3"
              type="submit"
              disabled={isSubmitting}
            >
              Submit
            </button>
            {errMsg ? <div className="text-danger">{errMsg}</div> : null}
            <a
              className="m-3"
              rel="noopener noreferrer"
              href="https://github.com/kimfucious/netlify-forms-formik"
            >
              <img src={octocat} alt="octocat" height="30px" width="30px" />
            </a>
          </Form>
        )}
      </Formik>
      <form
        name="contact"
        data-netlify="true"
        netlify-honeypot="bot-field"
        hidden
      >
        <input type="text" name="name" />
        <input type="email" name="email" />
      </form>
    </div>
  );
};

export default App;
