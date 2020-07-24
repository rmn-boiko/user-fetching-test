import { Request, Response, NextFunction } from 'express';
import fs from "fs";

import { User } from "src/models/user";
import { IsUserValid } from 'src/models/validation';

const allowedSymols = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q",
"r", "s", "t", "u" ,"v", "w", "x", "y", "z", ".", "@"];

const isEmailValid = (email: string) => {
  let isValid  = true;
  if (typeof email !== "string") {
    isValid = false;
    return isValid;
  }
  if (!email.includes("@")) {
    isValid = false;
    return isValid;
  }
  email.split("").forEach(symbol => {
    if (!allowedSymols.includes(symbol)) isValid = false;
  });
  return isValid;
};

export const ValidateUser = (req: Request, res: Response, next: NextFunction): void => {
  const user = req.body;
  const isUserValid: IsUserValid = {
    isValid: true,
    validationMessage: [],
    errorCode: 200
  };

  if (!user.email) {
    isUserValid.isValid = false;
    isUserValid.validationMessage.push("email is required");
    isUserValid.errorCode = 400;
  };
  if (!user.firstName) {
    isUserValid.isValid = false;
    isUserValid.validationMessage.push("firstName is required");
    isUserValid.errorCode = 400;
  };
  if (!user.lastName) {
    isUserValid.isValid = false;
    isUserValid.validationMessage.push("lastName is required");
    isUserValid.errorCode = 400;
  };
  if (!user.password) {
    isUserValid.isValid = false;
    isUserValid.validationMessage.push("password is required");
    isUserValid.errorCode = 400;
  };
  if (!user.phone) {
    isUserValid.isValid = false;
    isUserValid.validationMessage.push("phone is required");
    isUserValid.errorCode = 400;
  };

  if (user.email && !isEmailValid(user.email)) {
    isUserValid.isValid = false;
    isUserValid.validationMessage.push("email is invalid");
    isUserValid.errorCode = 400;
  };
  if (user.firstName && typeof user.firstName !== "string") {
    isUserValid.isValid = false;
    isUserValid.validationMessage.push("email is invalid");
    isUserValid.errorCode = 400;
  };
  if (user.lastName && typeof user.lastName !== "string") {
    isUserValid.isValid = false;
    isUserValid.validationMessage.push("email is invalid");
    isUserValid.errorCode = 400;
  };

  if (!isUserValid.isValid) {
    const { errorCode, validationMessage }  = isUserValid
    res.status(errorCode).send(validationMessage);
  }
  next();
};

export const isUserExist = (req: Request, res: Response, next: NextFunction) => {
  const users = fs.readFileSync("src/database/users.json", "utf8");
  const usersList = users ? JSON.parse(users) : [];
  const currentUser = usersList.find((user: User) => user.email === req.body.email);
  if (!currentUser) {
    return res.status(400).send("wrong email");
  };
  if (currentUser.password !== req.body.password) {
    return res.status(400).send("wrong password");
  }
  next();
}