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
    bool: yup.boolean().required(),
    date: yup.date().required(),
    date_min_max: yup.date().min(new Date(5)).max(new Date(10)).required(),
    email: yup.string().email().required(),
    float: yup.number().required(),
    float_positive: yup.number().positive().required(),
    float_min_max: yup.number().min(34.0001).max(120.5).optional(),
    int: yup.number().integer().required(),
    int_min_max: yup.number().integer().min(6).max(30).optional(),
    int_negative: yup.number().integer().negative().required(),
    nested: yup.object({ str: yup.string() }).oneOf([{ str: "b" }, { str: "c" }]),
    str: yup.string().required(),
    str_default: yup.string().default("abc"),
    str_ensure: yup.string().ensure(),
    str_min_upper: yup.string().min(4).uppercase().required(),
    str_max_lower: yup.string().max(145).lowercase().required(),
    str_not_req: yup.string().notRequired(),
    str_one_of: yup.string().oneOf(["a", "b", "c"]).required(),
    str_trim: yup.string().trim().optional(),
    str_null_def: yup.string().nullable().defined(),
    url: yup.string().url().required(),
    uuid: yup.string().uuid().required(),
});

const example = yh.example(TestSchema) as yup.InferType<typeof TestSchema>;
console.log(example);
```
