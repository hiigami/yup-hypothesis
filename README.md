# yup-hypothesis

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![Test Coverage](https://api.codeclimate.com/v1/badges/9290db12ea8831e07c89/test_coverage)](https://codeclimate.com/github/hiigami/yup-hypothesis/test_coverage)

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
  debt: yup.number().required(),
  age: yup.number().integer().positive().min(18).max(99).required(),
  name: yup.string().length(10).optional(),
  lastName: yup.string().length(20).trim(),
  description: yup.string().nullable().required(),
  uuid: yup.string().uuid().required(),
  url: yup.string().url().required(),
});

console.log(yh.example(TestSchema));
```
