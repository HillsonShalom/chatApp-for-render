import { app, server } from "../app";
import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import { conectToMongo } from "../config/db";
import registerDTO from "../DTO/registerDTO";
import loginDTO from "../DTO/loginDTO";

declare global {
  var token: string;
  var app: express.Application;
}

beforeAll(async () => {
  await conectToMongo()
  globalThis.app = app

  const user: registerDTO = {
    name: "Tester",
    password: "1a2b3c4d",
    phone_number: "0123456789",
  };
  const register = await request(globalThis.app)
    .post("/api/users/register")
    .send(user);

  const data: loginDTO = {
    name: "Tester",
    password: "1a2b3c4d",
  };
  const login = await request(globalThis.app).post("/api/users/login").send(data);

  globalThis.token = login.headers["authorization"]
  console.log(globalThis.token);
});

afterAll(async () => {
  await mongoose.connection.db!.dropDatabase();
  await mongoose.disconnect();
  server.close();
});
