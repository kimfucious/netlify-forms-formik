import React, { useState } from "react";
import { Formik } from "formik";
import axios from "axios";
import qs from "qs";

export default props => {
  const [message, setMessage] = useState(false);

  return (
    <div className="d-flex flex-column align-items-center">
      <h3 className="mb-3">{props.type}</h3>
      <Formik
        initialValues={{
          "formik-bot-field": "",
          "formik-form-name": "formik-form",
          formikEmail: "",
          formikUsername: ""
        }}
        validate={values => {
          let errors = {};
          if (!values.formikEmail) {
            errors.formikEmail = "Required";
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.formikEmail)
          ) {
            errors.formikEmail = "Invalid email address";
          }
          if (!values.formikUsername) {
            errors.formikUsername = "Required";
          }
          return errors;
        }}
        onSubmit={async (values, { resetForm, setSubmitting }) => {
          setSubmitting(true);
          console.log(values);
          const data = {
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
            setMessage(e.message);
            console.log(e);
          }
        }}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          touched,
          values
        }) => (
          <form
            data-netlify="true"
            data-netlify-honeypot="formik-bot-field"
            className="d-flex flex-column align-items-center"
            name="formik-form"
            onSubmit={handleSubmit}
          >
            <input
              type="hidden"
              name="formik-form-name"
              value={values["formik-form-name"]}
            />
            <input
              type="hidden"
              name="formik-bot-field"
              value={values["formik-bot-field"]}
            />
            <div className="form-group">
              <label
                className="col-form-label col-form-label-lg"
                htmlFor="formikUsername"
              >
                Name
              </label>
              <input
                className="form-control form-control-lg"
                name="formikUsername"
                onBlur={handleBlur}
                onChange={handleChange}
                type="text"
                value={values.formikUsername}
              />
              {errors.formikUsername && touched.formikUsername ? (
                <div className="invalid-feedback">{errors.formikUsername}</div>
              ) : null}
            </div>
            <div className="form-group">
              <label
                className="col-form-label col-form-label-lg"
                htmlFor="formikEmail"
              >
                Email
              </label>
              <input
                className="form-control form-control-lg"
                name="formikEmail"
                onBlur={handleBlur}
                onChange={handleChange}
                type="email"
                value={values.formikEmail}
              />
              {errors.formikEmail && touched.formikEmail ? (
                <div className="invalid-feedback">{errors.formikEmail}</div>
              ) : null}
            </div>
            <button
              className="btn btn-lg btn-outline-primary m-3"
              type="submit"
              disabled={isSubmitting}
            >
              Submit
            </button>
            {message ? <div className="text-danger">{message}</div> : null}
          </form>
        )}
      </Formik>
    </div>
  );
};
