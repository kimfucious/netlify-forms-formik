import React, { useRef, useEffect, useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Reaptcha from "reaptcha";
import axios from "axios";
import qs from "qs";

export default () => {
  const [errMsg, setErrMsg] = useState(false);
  const [msgSent, setMsgSent] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [token, setToken] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [verified, setVerified] = useState(false);

  const rcRef = useRef(null);

  useEffect(() => {
    if (loaded) {
      rcRef.current.execute();
      setExecuting(true);
    }
  }, [loaded]);

  const onExpire = () => {
    setVerified(false);
    rcRef.current.reset();
    rcRef.current.execute();
  };
  const onLoad = () => {
    setLoaded(true);
  };

  const onVerify = token => {
    setToken(token);
    setVerified(true);
    setExecuting(false);
  };

  const renderButton = (executing, isSubmitting, verified) => {
    if (errMsg) {
      return (
        <button
          className="btn btn-lg btn-outline-primary mt-3"
          type="submit"
          disabled
        >
          Error
        </button>
      );
    } else if (msgSent) {
      return (
        <button
          className="btn btn-lg btn-outline-success mt-3"
          type="submit"
          disabled
        >
          Submitted
        </button>
      );
    } else {
      return (
        <button
          className="btn btn-lg btn-outline-info mt-3"
          type="submit"
          disabled={isSubmitting || executing || !verified}
        >
          Submit
        </button>
      );
    }
  };

  const resetEverything = resetForm => {
    resetForm();
    setMsgSent(false);
    setErrMsg(false);
    onExpire();
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
            "g-recaptcha-response": token
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
        {({ isSubmitting, resetForm }) => (
          <Form
            data-netlify="true"
            data-netlify-honeypot="bot-field"
            data-netlify-recaptcha="true"
            className="d-flex flex-column align-items-center"
            name="contact"
            noValidate
          >
            <Field type="hidden" name="form-name" />
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
              onExpire={onExpire}
              onVerify={onVerify}
              onLoad={onLoad}
              size="invisible"
            />
            <div className="m-2 col-form-label col-form-label-lg">
              <span className="mr-1">ReCaptcha status:</span>
              <span
                className={`badge badge-${
                  loaded ? "success" : "primary"
                } mx-2 p-2`}
              >
                loaded
              </span>
              <span
                className={`badge badge-${
                  verified ? "success" : "primary"
                } mx-2 p-2`}
              >
                verified
              </span>
            </div>
            {renderButton(isSubmitting, executing, verified)}
            {errMsg ? <div className="text-primary m-1">{errMsg}</div> : null}
            {(msgSent || errMsg) && (
              <button
                className="btn btn-lg btn-link text-dark"
                onClick={() => resetEverything(resetForm)}
              >
                reset form
              </button>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};
