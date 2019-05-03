# Netlify Forms with Formik

This repo is to test and document how to get Netlify Forms working with Formik in a Create React App build.

[Netflify](https://netlify.com) Forms is a super cool (and free) feature for sites hosted on their platform.

Formik is a great library that "removes the tears" from form creation in React.

The problem is that forms rendered via React don't work out of the box with Netlify forms.

> :point_up: This readme is a work in progress as I work toward a solution. Don't take anyting literally until this comment is removed.

## tl;dr

You need to add a hidden HTML form that mimics the fields in your Formik form to the `/public/index.html` file in the public directory, or Netlify forms won't work.

## Reading material

[This](https://www.netlify.com/blog/2017/07/20/how-to-integrate-netlifys-form-handling-in-a-react-app/) is a very informative article; however--for me, at least--it took a while to realize that there needs to be a mirror HTML form in `/public/index.html` of the form being rendered by React.

Reading [this](https://community.netlify.com/t/common-issue-how-to-debug-your-form/92) can be helpful or send you off on a wild goose-chase or two.

## Initial Setup (doesn't work out of the box)

- [Create React App](https://github.com/facebook/create-react-app)
- [Axios](https://www.npmjs.com/package/axios) ( with [ qs ](https://www.npmjs.com/package/qs) ) for the post
- Bootswatch ([ Simplex ](https://bootswatch.com/simplex/)) for CSS
- [Formik](https://www.npmjs.com/package/formik)

Without extra setup, submitting a form when hosted on Netlify will return a 404 error.

The reason for this is because Netlify's form-bots can't see JavaScript rendered form code.

So in order to get this working, you need to do a bit of extra work.

## Steps to Get it Working

### 1) Add a static HTML version of the form

Add the following form block just below the initial `<body>` element tag in `/public/index.html`:

```html
<form data-netlify="true" hidden name="contact" netlify-honeypot="bot-field">
  <input type="text" name="username" />
  <input type="email" name="email" />
  <input name="bot-field" type="hidden" />
</form>
```

> :point_up: This is obviously just an example, so make sure that there is one-to-one match here whereby each input corresponds with a respective input element/Field component in your Formik form.

### 2) Add additional `initial values` to the Formik form

a) Add a `bot-field` and `form-name` field to `initialValues` of the Formik form:

```jsx
      <Formik
        initialValues={{
          "bot-field": "",
          "form-name": "contact",
          email: "",
          username: ""
        }}
```

b) Add those (hidden) fields to the Formik form itself:

```html
<Field type="hidden" name="form-name" />
<Field type="hidden" name="bot-field" />
```

> :point_up: PRO TIP: the relevant code to see how this works can be found in `/public/index.html` and `FormikForm.js` within this repo.

## Adding ReCaptcha

### tl;dr

Use a library to add Recaptcha (e.g. [reaptcha](https://www.npmjs.com/package/reaptcha)) and don't add anything related to reCaptcha to the `/public/index.html` file.

> :point_up: reCaptcha is notoriously easy to mistype, and Reaptcha adds another nuance to the pot. I've used abbreviations in variables to help avoid issues around that.

### Setup

There are a lot of libraries out there for adding reCaptcha to a React site. After a bit of trial and error, I settled on [reaptcha](https://www.npmjs.com/package/reaptcha).

Most reCaptcha libraries are not especially clear, IMHO, with regards to how to get the end-to-end solution working.

There's s few steps involved to get things done with Netlify Forms.

#### onLoad

`Reaptcha` has a built in function, `onLoad`, which is set as an attribute on the `Reaptcha` in the `FormikForm.js` file

In this example, I use a React effect hook to watch for changes to a React state hook value (rcLoaded), which gets updated when reCaptcha eventually loads after mount.

Once reCaptcha is loaded, reCaptcha gets executed. The reason for running `execute()` is for the support of reCaptcha v2 invisible, which I have set via the `size` attribute on the `Reaptcha` component.

Once it's executed, it gets verified (or not), and the reCaptcha response (token) is placed into state in a React state hook, rcResponse.

This state value is injected into the `data` object, along with the other form field data in the onSubmit function of the Formik form.

#### onVerify

`Reaptcha` has a built in function, `onVerify`, which is set as an attribute on the `Reaptcha` component in the `FormikForm.js` file

Once reCaptcha has been loaden, onVerify() will run and return the reCaptcha response (in the form of a token).

The `onVerify` function in `FormikForm.js` (not the Reaptcha one) populates the React hook state value `rcResponse`.

rcResponse gets injected into `data` when the form is submitted and it's value is assigned to the key, `g-recaptcha-response`.

#### useRef
