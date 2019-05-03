import React, { useRef, useEffect, useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Reaptcha from "reaptcha";
import axios from "axios";
import qs from "qs";

export default () => {
  const [errMsg, setErrMsg] = useState(false);
  const [msgSent, setMsgSent] = useState(false);
  const [rcLoaded, setRcLoaded] = useState(false);
  const [rcResponse, setRcResponse] = useState(false);

  const rcRef = useRef(null);

  useEffect(() => {
    console.log("Effect!");
    if (rcLoaded) {
      rcRef.current.execute();
    }
  }, [rcLoaded]);

  const onLoad = () => {
    setRcLoaded(true);
    console.log("recaptcha rcLoaded...");
  };

  const onVerify = token => {
    console.log("recaptcha verified...");
    setRcResponse(token);
  };

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
          "bot-field": "",
          "form-name": "contact",
          email: "",
          username: ""
        }}
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
          const data = {
            ...values,
            "g-recaptcha-response": rcResponse
          };
          console.log(data);
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
        {({ isSubmitting }) => (
          <Form
            data-netlify="true"
            data-netlify-honeypot="bot-field"
            data-netlify-recaptcha="true"
            className="d-flex flex-column align-items-center"
            name="contact"
            noValidate
          >
            <Field type="hidden" name="contact" />
            <Field type="hidden" name="bot-field" />
            <div className="form-group">
              <label
                className="col-form-label col-form-label-lg"
                htmlFor="username"
              >
                Name
              </label>
              <Field
                className="form-control form-control-lg"
                name="username"
                type="text"
              />
              <ErrorMessage
                className="invalid-feedback"
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
                name="email"
                type="email"
              />
              <ErrorMessage
                className="invalid-feedback"
                name="email"
                component="div"
              />
            </div>
            <Reaptcha
              ref={rcRef}
              sitekey="6Le_laEUAAAAACRNoby3_NLejhu0lCqb4_WeSotQ"
              onVerify={onVerify}
              on
              onLoad={onLoad}
              size="invisible"
            />
            {renderButton(isSubmitting)}
            {errMsg ? <div className="text-danger">{errMsg}</div> : null}
          </Form>
        )}
      </Formik>
    </div>
  );
};
