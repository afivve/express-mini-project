const assert = require("assert");
const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../../../../index");
const { User } = require("../../../../src/database/models");

chai.use(chaiHttp);
chai.should();

describe("POST /register", () => {
  // Menghapus semua data tabel User sebelum setiap pengujian
  before(async () => {
    await User.destroy({ where: {} });
  });

  it("should return a 400 Bad Request status if email is missing", (done) => {
    const register = {
      password: "password123",
      confPassword: "password123",
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
      .post("/register")
      .send({ email: "email@mail.com", confPassword: "password123" })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have.property("error", true);
        done();
      });
  });

  it("should return a 400 Bad Request status if confirmPassword is missing", (done) => {
    chai
      .request(app)
      .post("/register")
      .send({ email: "email@mail.com", password: "password123" })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have.property("error", true);
        done();
      });
  });

  it("should return a 400 Bad Request status if password and confirmPassword do not match", (done) => {
    chai
      .request(app)
      .post("/register")
      .send({
        email: "email@mail.com",
        password: "password123",
        confPassword: "password456",
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have.property("error", true);
        done();
      });
  });

  it("should return a 201 status code with user data", (done) => {
    chai
      .request(app)
      .post("/register")
      .send({
        email: "testuser@example.com",
        password: "testpassword",
        confPassword: "testpassword",
      })
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a("object");
        res.body.should.have.property("error", false);
        done();
      });
  });

  it("should return a 409 status code if user already registered", (done) => {
    chai
      .request(app)
      .post("/register")
      .send({
        email: "testuser@example.com",
        password: "testpassword",
        confPassword: "testpassword",
      })
      .end((err, res) => {
        res.should.have.status(409);
        res.body.should.be.a("object");
        res.body.should.have.property("error", true);
        done();
      });
  });

  /*   it("should return a 409 status code if user already registered", (done) => {
    // Cari data pengguna dengan email tertentu sebelum menjalankan pengujian
    User.findOne({ where: { email: "emaa@mail.com" } }).then((existingUser) => {
      if (existingUser) {
        // Jika pengguna sudah ada, jalankan pengujian
        chai
          .request(app)
          .post("/register")
          .send({
            email: "emaa@mail.com",
            password: "password123",
            confPassword: "password123",
          })
          .end((err, res) => {
            res.should.have.status(409);
            res.body.should.be.a("object");
            res.body.should.have.property("error", true);
            done();
          });
      }
    });
  }); */
});
