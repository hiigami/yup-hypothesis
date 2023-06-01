import { PresenceType } from "../../src/data/enumerations";
import { UnknownDict } from "../../src/data/types";
import { ReferenceStrategy } from "../../src/strategies";

const referenceTestItem = (args: {
  expected: unknown;
  path: string;
  isContext?: boolean;
  parent?: UnknownDict;
  context?: UnknownDict;
}) => ({
  input: { path: args.path, isContext: args.isContext ?? false },
  options: { parent: args.parent, context: args.context },
  expected: args.expected,
});

test.each([
  referenceTestItem({
    expected: true,
    path: "foo",
    parent: { foo: true, bar: 23 },
  }),
  referenceTestItem({
    expected: "ooo",
    path: "foo.bar",
    parent: { foo: { bar: "ooo" } },
  }),
  referenceTestItem({
    expected: "b",
    path: "foo[1]",
    parent: { foo: ["a", "b", "c"] },
  }),
  referenceTestItem({
    expected: 2,
    path: "foo.bar[2].s",
    parent: { foo: { bar: [{ s: 0 }, { s: 1 }, { s: 2 }] } },
  }),
  referenceTestItem({
    expected: 10.2,
    path: "foo.bar",
    isContext: true,
    parent: { foo: { bar: "ooo" } },
    context: { foo: { bar: 10.2 } },
  }),
])(
  "should be return $expected with (parent: $options.parent, context: $options.context, isContext: $input.isContext, path: $input.path)",
  ({ input, options, expected }) => {
    const val = new ReferenceStrategy(input).draw(options);
    expect(val).toEqual(expected);
  }
);

test.each([{ isContext: true }, { isContext: false }])(
  "should be defined and have defined presence with: (isContext: $isContext)",
  ({ isContext }) => {
    const strategy = new ReferenceStrategy({ path: "", isContext });
    expect(strategy.isDefined()).toBeTruthy();
    expect(strategy.getPresence()).toEqual(PresenceType.Defined);
  }
);
