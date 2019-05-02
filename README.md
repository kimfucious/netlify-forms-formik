# Netlify Forms with Formik Test

This repo is to test and document how to get Netlify Forms working with Formik in a Create React App build.

> :point_up: This readme is a work in progress as I work toward a solution. Don't take anyting literally until this comment is removed.

## tl;dr

Don't use Formik's `Form`, `Field`, and `ErrorMessage` components. Use HTML elements and use Formik's props in element attributes.

## Why?

Because setting up Netlify Forms with React is not always as simple as it may seem.

[This](https://www.netlify.com/blog/2017/07/20/how-to-integrate-netlifys-form-handling-in-a-react-app/) is a very informative article; however, after poring over it several times, I still had trouble getting everything to work.

Reading [this](https://community.netlify.com/t/common-issue-how-to-debug-your-form/92) send me on many wild goose-chases.

## Initial Setup (doesn't work out of the box)

- [Create React App](https://github.com/facebook/create-react-app)
- [Axios](https://www.npmjs.com/package/axios) ( with [ qs ](https://www.npmjs.com/package/qs) ) for the post
- Bootswatch ([ Simplex ](https://bootswatch.com/simplex/)) for CSS
- [Formik](https://www.npmjs.com/package/formik)

With the initial setup (below), submitting the form when hosted on Netlify will return a 404 error.

```jsx
const App = () => {
  const [errMsg, setErrMsg] = useState(false);
  return (
    <div className="d-flex flex-column align-items-center justify-content-center w-100 vh-100">
      <div className="d-flex align-items-center justify-content-center text-muted">
        <img src={netlifyLogo} alt="netlify logo" />
        <span className="display-4 mx-3">+</span>
        <img src={formikLogo} alt="formik logo" />
      </div>
      <div className="display-4 m-5">Netlify Forms with Formik</div>
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
          <Form className="d-flex flex-column align-items-center">
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
    </div>
  );
};
```

## Steps to Get it Working

### 1) Add a static HTML version of the form

Add the following just below the `</Formik>` tag:

```html
<form name="contact" data-netlify="true" netlify-honeypot="bot-field" hidden>
  <input type="text" name="name" />
  <input type="email" name="email" />
</form>
```

### 2) Add a hidden input field to the Formik Form

Add the following just below the Formik `<Form>` tag:

```html
<input type="hidden" name="form-name" value="contact" />
```

### 3) Change Formik Form to HTML form

Change Formik `<Form>` tag to `<form>` and add the onSubmit attribute:

```jsx
{({ isSubmitting, handleSubmit }) => (
  <form
    onSubmit={handleSubmit}
    name="contact"
  >
```

### 3) Change Formik Field to HTML input

1. Add the following props to the form function: errors, handleBlur, handleChange, touched, and values.

```jsx
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
    onSubmit={handleSubmit}
    name="contact"
  >
```

2. Change the Formik `<Field>` tag to an HTML `<input>` and add attributes for the props in #1 above.

```html
<input
  name="username"
  onBlur="{handleBlur}"
  onChange="{handleChange}"
  type="text"
  value="{values.username}"
/>
```

3. Display errors using conditional rendering
   Add this snippet under the appropriate input element:

```jsx
{
  errors.username && touched.username ? (
    <div className="text-danger">{errors.username}</div>
  ) : null;
}
```
