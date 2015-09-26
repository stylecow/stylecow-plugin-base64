stylecow plugin base64
======================

[![Build Status](https://travis-ci.org/stylecow/stylecow-plugin-base64.svg)](https://travis-ci.org/stylecow/stylecow-plugin-base64)

Stylecow plugin to embed images in the css using base64 encode.
Only images lower than **5Kb** will be embedded.

You write:

```css
div {
	background: url('image.png');
}
```

And stylecow converts to:

```css
div {
    background: url("data:image/png;base64,iVBORw0KGg...");
}
```

More demos in [the tests folder](https://github.com/stylecow/stylecow-plugin-base64/tree/master/tests/cases)
