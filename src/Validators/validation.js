const validator = require("validator");
const { isEmail, isStrongPassword } = validator;

const vaidateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name is not valid. Enter the correct Name");
  } else if (firstName.length < 3 || firstName.length > 50) {
    throw new Error(
      "FirstName either too big or too small. Must be 3 < firstName < 50"
    );
  } else if (!/^[a-zA-Z]+$/.test(firstName.trim())) {
    throw new Error("firstName must contain a-z or A-Z character only");
  } else if (!/^[a-zA-Z]+$/.test(lastName.trim())) {
    throw new Error("lastName must contain a-z or A-Z character only");
  } else if (lastName.length < 3 || lastName.length > 50) {
    throw new Error(
      "LastName either too big or too small. Must be 3 < lastName < 50"
    );
  } else if (!isEmail(emailId)) {
    throw new Error(
      "Enter correct emailId, EmailId must have @ and after something like .in, .com, .org, etc"
    );
  } else if (!isStrongPassword(password)) {
    throw new Error(
      "Password is not strong. Your password must contain atleast 1 Uppercase, 1 lowercase, 1 digit and special charcters such as @ # $ % & *"
    );
  }
};

module.exports = { vaidateSignUpData };
