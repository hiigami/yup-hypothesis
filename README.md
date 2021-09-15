# yup-hypothesis

![CI](https://github.com/hiigami/yup-hypothesis/actions/workflows/main.yml/badge.svg?branch=main)
[![Test Coverage](https://api.codeclimate.com/v1/badges/9290db12ea8831e07c89/test_coverage)](https://codeclimate.com/github/hiigami/yup-hypothesis/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/9290db12ea8831e07c89/maintainability)](https://codeclimate.com/github/hiigami/yup-hypothesis/maintainability)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat)](https://github.com/prettier/prettier)

## Install

```bash
npm i yup-hypothesis --save-dev
```

## Usage

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
const objExample = yh.example(TestObjectSchema) as yup.InferType<typeof TestObjectSchema>;
console.log(objExample);

// -- Arrays --
const TestArraySchema = yup.array(TestObjectSchema);
const arrayExample = yh.example(TestArraySchema) as yup.InferType<typeof TestArraySchema>;
console.log(arrayExample);

// -- AnySchema --
const TestSchema = yup.string().required();
const arrayExample = yh.example(TestSchema) as yup.InferType<typeof TestSchema>;
console.log(TestSchema);
```
