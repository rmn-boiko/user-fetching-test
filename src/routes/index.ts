import { Router, NextFunction, Request, Response } from "express";
import fs from "fs";
const jwt = require("jsonwebtoken");

import { ValidateUser, isUserExist } from "../middleware/validation";
import { User } from 'src/models/user';

const router: Router = Router();

router.post("/registration", ValidateUser, (req: Request, res: Response, next: NextFunction) => {
  const users = fs.readFileSync("src/database/users.json", "utf8");
  const usersList = users ? JSON.parse(users) : [];
  const newUser: User = {
    ...req.body,
    id: usersList.length + 1
  };
  usersList.push(newUser);
  try {
    fs.writeFileSync("src/database/users.json", JSON.stringify(usersList))
    res.send("");
  } catch (err) {
    res.status(500).send("Oops something went wrong");
  };
});

router.put("/login", (req: Request, res: Response, next: NextFunction) => {
  const users = fs.readFileSync("src/database/users.json", "utf8");
  const usersList = users ? JSON.parse(users) : [];
  const currentUser = usersList.find((user: User) => user.email === req.body.email);
  if (!currentUser) {
    return res.status(400).send("wrong email");
  };
  if (currentUser.password !== req.body.password) {
    return res.status(400).send("wrong password");
  }
  const userJWT = jwt.sign(JSON.stringify(currentUser), "secret");
  res.cookie("auth", userJWT, { maxAge: 900000 }).send();
});

router.get("/logout", (req: Request, res: Response, next: NextFunction) => {
  res.clearCookie("auth").send();
});

router.get("/users/:id", (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = Number(req.params.id);
    const users = fs.readFileSync("src/database/users.json", "utf8");
    const usersList: [User] = users ? JSON.parse(users) : [];
    const selectedUser = usersList.find((user: User) => user.id === userId);
    if (!selectedUser) {
      return res.status(404).send("User does not exist");
    }
    res.send(selectedUser);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/users", (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = fs.readFileSync("src/database/users.json", "utf8");
    const usersList = users ? JSON.parse(users) : [];
    res.send(usersList);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete("/users/:id", (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = Number(req.params.id);
    const users = fs.readFileSync("src/database/users.json", "utf8");
    const usersList: [User] = users ? JSON.parse(users) : [];
    const selectedUserId = usersList.findIndex((user: User) => user.id === userId);
    if (!Number.isInteger(selectedUserId)) {
      return res.status(404).send("User does not exist");
    }
    usersList.splice(selectedUserId, 1);
    fs.writeFileSync("src/database/users.json", JSON.stringify(usersList))
    res.send();
  } catch (err) {
    res.status(500).send(err);
  }
});

router.patch("/users/:id", ValidateUser, (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = Number(req.params.id);
    const users = fs.readFileSync("src/database/users.json", "utf8");
    const usersList: [User] = users ? JSON.parse(users) : [];
    const selectedUserId = usersList.findIndex((user: User) => user.id === userId);
    if (!Number.isInteger(selectedUserId)) {
      return res.status(404).send("User does not exist");
    }
    usersList[selectedUserId] = {
      ...usersList[selectedUserId],
      ...req.body
    }
    fs.writeFileSync("src/database/users.json", JSON.stringify(usersList))
    res.send(usersList[selectedUserId]);
  } catch (err) {
    res.status(500).send(err);
  }
});

export default router;
