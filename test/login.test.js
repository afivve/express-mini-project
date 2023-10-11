const assert = require("assert");
const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../index");
const { User } = require("../src/database/models");

chai.use(chaiHttp);
chai.should();

describe("POST /login", () => {
  it("should return a 400 Bad Request status if email is missing", (done) => {
    const register = {
      password: "password123",
    };
    chai
      .request(app)
      .post("/register")
      .send(register)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have.property("error", true);
        done();
      });
  });

  it("should return a 400 Bad Request status if password is missing", (done) => {
    chai
      .request(app)
      .post("/login")
      .send({ email: "email@mail.com" })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have.property("error", true);
        done();
      });
  });

  it("should return a 400 with message account not verified", (done) => {
    chai
      .request(app)
      .post("/login")
      .send({
        email: "testuser@example.com",
        password: "testpassword",
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have.property("error", true);
        done();
      });
  });

  it("should return a 404 with message email not found", (done) => {
    chai
      .request(app)
      .post("/login")
      .send({
        email: "testuse@example.com",
        password: "testpassword",
      })
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a("object");
        res.body.should.have.property("error", true);
        done();
      });
  });

  it("should return a 200 OK status with user data on successful login", (done) => {
    User.update(
      { verified: true },
      {
        where: {
          email: "testuser@example.com",
        },
      }
    )
      .then((result) => {
        chai
          .request(app)
          .post("/login")
          .send({
            email: "testuser@example.com",
            password: "testpassword",
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("error", false);
            done();
          });
      })
      .catch((err) => {
        console.log(err);
      });
  });

  it("should return a 404 with message wrong password", (done) => {
    chai
      .request(app)
      .post("/login")
      .send({
        email: "testuser@example.com",
        password: "testpassword1",
      })
      .end((err, res) => {
        res.should.have.status(403);
        res.body.should.be.a("object");
        res.body.should.have.property("error", true);
        done();
      });
  });
});
