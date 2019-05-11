# Netlify Forms with Formik

[![Netlify Status](https://api.netlify.com/api/v1/badges/46e39f1e-ce26-4619-89d2-6f2969856581/deploy-status)](https://app.netlify.com/sites/admiring-visvesvaraya-e4f018/deploys)

This repo was created to test and document how to get Netlify Forms working with Formik in a Create React App build and add ReCaptcha if desired.

Netlify Forms is a super cool (and free) feature for sites hosted on the [Netlify](https://netlify.com) platform.

[Formik](https://www.npmjs.com/package/formik) is a great library that "removes the tears" :sob: from form creation in React.

The problem is that forms rendered via React don't work out of the box with Netlify forms.

## tl;dr

You need to add a hidden HTML form that mimics the fields in your Formik form to the `/public/index.html` file in the public directory, or Netlify forms won't work.

> :point_up: Note that static site generators like Gatsby and Hugo are different beasts and require a different solution (they pretty much just work) than would a Create React App build. Documentation here is soley pertinent to CRA.

## Reading material

[This](https://www.netlify.com/blog/2017/07/20/how-to-integrate-netlifys-form-handling-in-a-react-app/) is a very informative article; however--for me, at least--it took a while to realize that there needs to be a mirror HTML form in `/public/index.html` of the Formik form being rendered by React. And the info surrounding reCaptcha is a bit lean.

Reading [this](https://community.netlify.com/t/common-issue-how-to-debug-your-form/92) can be helpful or send you off on a wild goose-chase or three.

## Initial Setup (doesn't work out of the box)

- [Create React App](https://github.com/facebook/create-react-app)
- [Axios](https://www.npmjs.com/package/axios) ( with [ qs ](https://www.npmjs.com/package/qs) ) for the post
- [Formik](https://www.npmjs.com/package/formik)

Without extra setup, submitting a React form when hosted on Netlify will return a 404 error.

This error can be a bit misleading because, when you look at the code, the form is there. It should be found. So what's happening?!

The reason is that Netlify's form-bots can't see JavaScript rendered form code. It's not that they're doing anything wrong, it's just kinda how things are. Thankfully, they're nice enough to have given us a way to work around this issue.

So in order to get this working, there's a few more steps to be done.

## Steps to Get Things Working

### 1) Add a static HTML version of the form

Add the following form block just below the initial `<body>` element tag in `/public/index.html`:

```html
<form data-netlify="true" hidden name="contact" netlify-honeypot="bot-field">
  <input type="text" name="username" />
  <input type="email" name="email" />
  <input name="bot-field" type="hidden" />
</form>
```

According to the maesters, you can--rather than add this code block to `/public/index.html`--create a separate HTML file that includes your form code block somewhere in the build, and it will get picked up. I, haven't tried this, personally, but the maesters said it is so.

> :point_up: This is obviously just an example. Your form will most likely have differing fields. So make sure that there is one-to-one match here, whereby each input corresponds with a respective input element/Field component in your Formik form.

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

While the honeypot is a novel concept, it's not super-effective against spam bots, so check out the section on adding reCaptcha, which is a more robust solution.

> :newspaper: In February 2019, Netflify [announced](https://www.netlify.com/blog/2019/02/12/improved-netlify-forms-spam-filtering-using-akismet/) that all form submissions will be filtered for spam, using Akismet. Huzzah huzzah! :tada:

b) Add those (hidden) fields to the Formik form itself:

```html
<Field type="hidden" name="form-name" />
<Field type="hidden" name="bot-field" />
```

> :floppy_disk: The relevant code to see how this works can be found in `/public/index.html` and `FormikForm.js` within this repo.

## Adding ReCaptcha

### tl;dr

Use a library to add Recaptcha (e.g. [reaptcha](https://www.npmjs.com/package/reaptcha)) and be sure to send the reCaptcha response along with your form submission.

> :scream: reCaptcha is notoriously easy to mistype, and `reaptcha` adds another nuance to the pot. I've used abbreviations in variable declarations to help avoid issues around that.

### Setup

There are a lot of libraries out there for adding reCaptcha to a React site. And most reCaptcha libraries are not especially clear in their documentation, IMHO, with to how to get the end-to-end solution working, esp. getting at the reCaptcha response token.

After a bit of trial and error, I settled on [reaptcha](https://www.npmjs.com/package/reaptcha). It's clean and documented well.

There's actually only one key step to get reCaptcha working with Netlify Forms, which is to send the reCaptcha response token with your form data. The main work here is to get a hold of the Recaptcha response.

The steps are:

1. Load reCaptcha
2. Execute reCaptcha onSubmit (for reCaptcha v2 invisible)
3. Retrieve the reCaptcha response
4. Submit the reCaptcha response along with the form data.

To do that, this example leverages the built-in callback functions of `reaptcha` along with some React Hooks.

The `Reaptcha` block looks like this:

```jsx
<Reaptcha
  ref={rcRef}
  sitekey="your site key goes here"
  data-netlify-recaptcha="true"
  onError={onError}
  onExpire={onExpire}
  onVerify={onVerify}
  onLoad={() => onLoad(() => resetForm)}
  size="invisible"
/>
```

#### onLoad

`onLoad` is set as an attribute on the `Reaptcha` element in the `FormikForm.js` file.

In this example, the `onLoad` callback function is used to load the `clearForm` action into a [React State Hook](https://reactjs.org/docs/hooks-reference.html#usestate):

```jsx
const onLoad = resetForm => {
  console.log("loaded...");
  setLoaded(true);
  setFormReset(resetForm);
};
```

This is kinda hacky, but in order to clear the form after a successful form submission (or for some other reason), I wanted access to that action, which is passed down as a prop but not accessible outside of the Formik block scope.

There may be a better way to do this, but I got bored thinking about it and moved on.

At this point, nothing happens until the user fills out and submits the form.

#### useRef

Once reCaptcha is loaded, reCaptcha needs gets executed. The reason for running `execute()` is for the support of reCaptcha v2 invisible, which is set via the `size` attribute on the `Reaptcha` element.

> :robot: Only reCaptcha v2 invisible is documented here, but with a few tweaks you should be able to get other reCaptcha types (e.g. "I am not a robot") working.

In order to execute reCaptcha, a [React Ref Hook](https://reactjs.org/docs/hooks-reference.html#useref) has been setup for the `Reaptcha` element.

```jsx
const rcRef = useRef(null);
```

This, plus the ref attribute on the `Reaptcha` element, allows execute() to be called on `rcRef.current`, which is done when the form is submitted in the Formik `onSubmit` function.

```jsx
onSubmit={values => {
  setIsSubmitting(true);
  setFormValues({ ...values });
  setExecuting(true);
  rcRef.current.execute();
}}
```

If you're familiar with Formik, this is where all the action usually happens; however, I've moved some of the action out of this function and into a separate function, `handleSubmit`, which gets triggered by a [React Effect Hook](https://reactjs.org/docs/hooks-reference.html#useeffect).

The reason for separating this out is that there is a delay between executing reCaptcha, receiving the reCaptcha response, and putting it somewhere (e.g. state) where it can be accessed to inject into the form data. And I got tired of shooting blanks when submitting my form.

#### onVerify

`onVerify` is set as an attribute on the `Reaptcha` element in the `FormikForm.js` file.

The onVerify callback runs after `rcRef.current.execute()` and returns the reCaptcha response (in the form of a token).

This token is stored in the `React Hook State` value `token`.

#### handleSubmit

In this example, a React Effect Hook, has been setup to look for `token` changes in state.

```jsx
useEffect(() => {
  const handleSubmit = async (formValues, token) => {
    const data = {
      ...formValues,
      "g-recaptcha-response": token
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
      formReset();
    } catch (e) {
      setErrMsg(e.message);
    }
  };
  if (token) {
    handleSubmit(formValues, token);
  }
}, [formReset, formValues, token]);
```

> 🧙 If there were magic, this is where it might happen.

After the onVerify callback returns the token and places it in state, the effect hook will trigger the `handleSubmit` function.

`handleSubmit` builds the `axios` configuration (note the content type!) and submits the form.

The reCaptcha response, `token`, gets injected into `data` just prior to form submission, and its value is assigned to the key, `g-recaptcha-response`.

If axios is successful, the form gets reset with `formReset()`, which is actually Formik's `resetForm` that was populated into state at onLoad.

:rainbow: And Bob's your uncle! :unicorn:
