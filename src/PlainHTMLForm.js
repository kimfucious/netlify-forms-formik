import React from "react";

export default props => {
  return (
    <div className="d-flex flex-column align-items-center">
      <h3 className="mb-3">{props.type}</h3>
      <form
        className="d-flex flex-column align-items-center"
        method="POST"
        data-netlify="true"
        name="html-form"
        netlify-honeypot="html-bot-field"
      >
        <div className="form-group">
          <label
            className="col-form-label col-form-label-lg"
            htmlFor="html-username"
          >
            Name
          </label>
          <input
            className="form-control form-control-lg"
            type="text"
            name="html-username"
          />
        </div>
        <div className="form-group">
          <label
            className="col-form-label col-form-label-lg"
            htmlFor="html-email"
          >
            Email
          </label>
          <input
            className="form-control form-control-lg"
            type="email"
            name="html-email"
          />
        </div>
        <input name="html-bot-field" type="hidden" />
        <button className="btn btn-lg btn-outline-primary m-3" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};
