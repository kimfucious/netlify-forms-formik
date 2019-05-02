import React, { useState } from "react";
import axios from "axios";
import qs from "qs";

export default props => {
  const initialFormState = {
    statefulUsername: "",
    statefulEmail: "",
    "stateful-bot-field": "",
    "form-name": "stateful-form"
  };
  const [message, setMessage] = useState(false);
  const [form, setForm] = useState(initialFormState);
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async e => {
    console.log(form);
    const data = {
      ...form
    };
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      data: qs.stringify(data),
      url: "/"
    };
    try {
      await axios(options);
      setMessage("Message Sent");
    } catch (e) {
      setMessage(e.message);
      console.log(e);
    }
  };
  return (
    <div className="d-flex flex-column align-items-center">
      <h3 className="mb-3">{props.type}</h3>
      <form
        className="d-flex flex-column align-items-center"
        data-netlify="true"
        name="stateful-form"
        netlify-honeypot="stateful-bot-field"
        onSubmit={handleSubmit}
      >
        <div className="form-group">
          <label
            className="col-form-label col-form-label-lg"
            htmlFor="statefulUsername"
          >
            Name
          </label>
          <input
            className="form-control form-control-lg"
            value={form.statefulUsername}
            onChange={e => handleChange(e)}
            type="text"
            name="statefulUsername"
          />
        </div>
        <div className="form-group">
          <label
            className="col-form-label col-form-label-lg"
            htmlFor="statefulEmail"
          >
            Email
          </label>
          <input
            className="form-control form-control-lg"
            value={form.statefulEmail}
            onChange={e => handleChange(e)}
            type="email"
            name="statefulEmail"
          />
        </div>
        <input
          name="stateful-bot-field"
          onChange={e => handleChange()}
          type="hidden"
          value={form["stateful-bot-field"]}
        />
        <button className="btn btn-lg btn-outline-primary m-3">Submit</button>
        {message ? <div className="text-danger">{message}</div> : null}
      </form>
    </div>
  );
};
