# yup-hypothesis

![CI](https://github.com/hiigami/yup-hypothesis/actions/workflows/main.yml/badge.svg?branch=main)
[![Test Coverage](https://api.codeclimate.com/v1/badges/9290db12ea8831e07c89/test_coverage)](https://codeclimate.com/github/hiigami/yup-hypothesis/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/9290db12ea8831e07c89/maintainability)](https://codeclimate.com/github/hiigami/yup-hypothesis/maintainability)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat)](https://github.com/prettier/prettier)
![GitHub](https://img.shields.io/github/license/hiigami/yup-hypothesis)

Create random data from a Yup schema.
You can use the project's [roadmap](https://github.com/hiigami/yup-hypothesis/wiki/Roadmap-v1.x.x) to see the current supported features.

## Install

```bash
npm i yup-hypothesis --save-dev
```

## Usage

### Simple

```js
import * as yup from "yup";
import yh from "yup-hypothesis";

/**
 * const yup = require('yup');
 * const yh = require('yup-hypothesis').default;
 */

// -- Objects --
const TestObjectSchema = yup.object({
  bool: yup.boolean().required(),
});
const objExample = yh.example(TestObjectSchema);
console.log(objExample);

// -- Arrays --
const TestArraySchema = yup.array(TestObjectSchema);
const arrayExample = yh.example(TestArraySchema);
console.log(arrayExample);

// -- Tuple --
const TestTupleSchema = yup.tuple([yup.string().label("name").required()]);
const tupleExample = yh.example(TestTupleSchema);
console.log(tupleExample);

// -- mixed, string, number, boolean, date --
const TestSchema = yup.string().required();
const anyExample = yh.example(TestSchema);
console.log(anyExample);
```

> **_WARNING_** &nbsp; If _strict is not set to true in your yup schema_ you might not get the exact type returned from the `yh.example` function.
>
> e.g. `yh.example(yup.boolean())` will return a valid value for the schema, but can be one of the following types: boolean, number or string.

### With context

```js
const TestConditionalSchema = yup.string().when("$t", {
  is: true,
  then: (_schema) => yup.string().nullable(),
  otherwise: (_schema) => yup.string().oneOf(["a", "b"]),
});
const context = { t: true };
const exampleWithContext = yh.example(TestConditionalSchema, context);
console.log(exampleWithContext);
```

## Test

```bash
npm test
```
