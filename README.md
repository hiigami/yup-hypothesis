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

const TestSchema = yup.object({
  accept: yup.boolean().required(),
  created: yup.date().required(),
  email: yup.string().email().required(),
  amount: yup.number().required(),
  debt: yup.number().negative().required(),
  age: yup.number().integer().positive().min(18).max(99).required(),
  name: yup.string().length(10).optional(),
  lastName: yup.string().length(20).trim(),
  description: yup.string().nullable().required(),
  uuid: yup.string().uuid().required(),
  url: yup.string().url().required(),
});

const example = yh.example(TestSchema) as yup.InferType<typeof TestSchema>;
console.log(example);
```
