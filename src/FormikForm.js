import React, { useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import axios from "axios";
import qs from "qs";

export default () => {
  const [msgSent, setMsgSent] = useState(false);
  const [errMsg, setErrMsg] = useState(false);

  const renderButton = isSubmitting => {
    if (errMsg) {
      return (
        <button
          className="btn btn-lg btn-outline-danger m-3"
          type="submit"
          disabled
        >
          Error
        </button>
      );
    } else if (msgSent) {
      return (
        <button
          className="btn btn-lg btn-outline-success m-3"
          type="submit"
          disabled
        >
          Submitted
        </button>
      );
    } else {
      return (
        <button
          className="btn btn-lg btn-outline-info m-3"
          type="submit"
          disabled={isSubmitting}
        >
          Submit
        </button>
      );
    }
  };

  return (
    <div className="d-flex flex-column align-items-center">
      <Formik
        initialValues={{
          "formik-bot-field": "",
          "form-name": "formik-form",
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
            setMsgSent(true);
            resetForm();
          } catch (e) {
            setErrMsg(e.message);
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
          <Form
            data-netlify="true"
            data-netlify-honeypot="formik-bot-field"
            className="d-flex flex-column align-items-center"
            name="formik-form"
          >
            <Field type="hidden" name="formik-form-name" />
            <Field type="hidden" name="formik-bot-field" />
            <div className="form-group">
              <label
                className="col-form-label col-form-label-lg"
                htmlFor="formikUsername"
              >
                Name
              </label>
              <Field
                className="form-control form-control-lg"
                name="formikUsername"
                type="text"
              />
              <ErrorMessage
                className="invalid-feedback"
                name="formikUsername"
                component="div"
              />
            </div>
            <div className="form-group">
              <label
                className="col-form-label col-form-label-lg"
                htmlFor="formikEmail"
              >
                Email
              </label>
              <Field
                className="form-control form-control-lg"
                name="formikEmail"
                type="email"
              />
              <ErrorMessage
                className="invalid-feedback"
                name="formikEmail"
                component="div"
              />
            </div>
            {renderButton(isSubmitting)}
            {errMsg ? <div className="text-danger">{errMsg}</div> : null}
          </Form>
        )}
      </Formik>
    </div>
  );
};
