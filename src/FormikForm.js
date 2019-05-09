import React, { useRef, useEffect, useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Reaptcha from "reaptcha";
import axios from "axios";
import qs from "qs";

export default () => {
  const [errMsg, setErrMsg] = useState("");
  const [executing, setExecuting] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [formReset, setFormReset] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [msgSent, setMsgSent] = useState(false);
  const [rcError, setRcError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);

  const rcRef = useRef(null);

  useEffect(() => {
    const handleSubmit = async (formValues, token) => {
      const data = {
        ...formValues,
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
        formReset();
      } catch (e) {
        setErrMsg(e.message);
      }
    };
    if (token) {
      handleSubmit(formValues, token);
    }
  }, [formReset, formValues, token]);

  const onError = () => {
    console.log("error...");
    setRcError(true);
  };

  const onExpire = async () => {
    console.log("expired...");
    console.log("resetting...");
    resetReCaptcha();
  };

  const onLoad = resetForm => {
    console.log("loaded...");
    setLoaded(true);
    setFormReset(resetForm);
  };

  const onVerify = token => {
    console.log("verified...");
    setToken(token);
    setVerified(true);
    setExecuting(false);
  };

  const renderButton = (executing, isSubmitting) => {
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
          disabled={isSubmitting || executing}
        >
          Submit
        </button>
      );
    }
  };

  const resetEverything = resetForm => {
    if (rcError) {
      setRcError(false);
    }
    if (resetForm) {
      setMsgSent(false);
      setErrMsg(false);
      resetForm();
    }
    resetReCaptcha();
  };

  const resetReCaptcha = async () => {
    console.log("resetting...");
    await rcRef.current.reset();
    setVerified(false);
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
        onSubmit={async values => {
          setIsSubmitting(true);
          setFormValues({ ...values });
          setExecuting(true);
          rcRef.current.execute();
        }}
      >
        {({ resetForm }) => (
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
              data-netlify-recaptcha="true"
              onError={onError}
              onExpire={onExpire}
              onVerify={onVerify}
              onLoad={() => onLoad(() => resetForm)}
              size="invisible"
            />
            <div className="m-2 col-form-label col-form-label-lg">
              <span className="mr-1">ReCaptcha status:</span>
              <br className="d-block d-sm-none mt-1" />
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
              {executing && (
                <span className={`badge badge-primary mx-2 p-2`}>
                  executing
                </span>
              )}
              {rcError && (
                <span className={`badge badge-primary mx-2 p-2`}>error</span>
              )}
              {rcError && (
                <button
                  className="btn btn-link text-dark"
                  onClick={() => resetEverything(resetForm)}
                >
                  reset
                </button>
              )}
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
