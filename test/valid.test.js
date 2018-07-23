import { validateData } from "../index";

const isEmail = { name: "isEmail", options: { allow_utf8_local_part: false } };
const isEmpty = { name: "isEmpty", options: {} };
const isNotEmpty = { name: "!isEmpty", options: {} };

test("valid data", () => {
  const validData = [
    {
      name: "fromEmail",
      value: "email@email.es",
      validate: [isEmail, isNotEmpty]
    },
    {
      name: "fromName",
      value: "Mister User",
      validate: [isNotEmpty]
    }
  ];
  expect(validateData(validData)).toEqual({ success: true, error: [] });
});

test("invalid email", () => {
  const invalidEmail = [
    {
      name: "fromEmail",
      value: "email.es",
      validate: [isEmail, isNotEmpty]
    },
    {
      name: "fromName",
      value: "Mister User",
      validate: [isNotEmpty]
    }
  ];
  expect(validateData(invalidEmail)).toEqual({
    success: false,
    error: [{ fromEmail: ["El email no es válido"] }]
  });
});

test("empty data when required", () => {
  const emptyDataRequired = [
    {
      name: "fromEmail",
      value: "email@email.es",
      validate: [isEmail, isNotEmpty]
    },
    {
      name: "fromName",
      value: "",
      validate: [isNotEmpty]
    }
  ];
  expect(validateData(emptyDataRequired)).toEqual({
    success: false,
    error: [{ fromName: ["El campo está vacío"] }]
  });
});
test("empty data not required", () => {
  const emptyData = [
    {
      name: "fromEmail",
      value: "email@email.es",
      validate: [isEmail, isNotEmpty]
    },
    {
      name: "fromName",
      value: "",
      validate: [isEmpty]
    }
  ];
  expect(validateData(emptyData)).toEqual({ success: true, error: [] });
});
