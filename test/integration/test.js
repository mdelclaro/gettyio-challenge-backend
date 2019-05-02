const app = require("../../app");
const request = require("supertest")(app);
const sinon = require("sinon");

const User = require("../../src/models/user");
const Project = require("../../src/models/project");

const project = {
  title: "project's title",
  content: "project's content"
};

let token;
let refreshToken;
let projectId;
let userId;
let _stub;

describe("User", () => {
  describe("POST /v1/signup", () => {
    it("should create a new user", done => {
      request
        .post("/v1/signup")
        .set("Accept", "application/json")
        .send({
          firstName: "John",
          lastName: "Doe",
          email: "email@email.com",
          password: "123456"
        })
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);
          userId = res.body._id;
          return done();
        });
    });

    it("should respond with 422 email already taken", done => {
      request
        .post("/v1/signup")
        .set("Accept", "application/json")
        .send({
          firstName: "John",
          lastName: "Doe",
          email: "email@email.com",
          password: "123456"
        })
        .expect(422)
        .expect({ message: "Email already taken." }, done);
    });
  });
});

describe("Auth", () => {
  describe("POST /v1/auth/signin", () => {
    it("should log the user in", done => {
      // _stub = sinon.stub(User, "findOne").returns({
      //   select: sinon.stub().returns(user)
      // });

      request
        .post("/v1/auth/signin")
        .set("Accept", "application/json")
        .send({ email: "email@email.com", password: "123456" })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          token = res.body.token;
          refreshToken = res.body.refreshToken;
          done();
        });
    });

    it("should respond with invalid password", done => {
      // _stub = sinon.stub(User, "findOne").returns({
      //   select: sinon.stub().returns(user)
      // });

      request
        .post("/v1/auth/signin")
        .set("Accept", "application/json")
        .send({ email: "email@email.com", password: "1234567" })
        .expect(401)
        .expect({ message: "Invalid password." }, done);
    });

    it("should respond with email not found", done => {
      request
        .post("/v1/auth/signin")
        .set("Accept", "application/json")
        .send({ email: "email@email.co", password: "123456" })
        .expect(401)
        .expect({ message: "Email not found." }, done);
    });
  });

  describe("POST /v1/auth/refreshToken", () => {
    it("should refresh the token", done => {
      // _stub = sinon.stub(User, "findOne").returns(user);

      request
        .post("/v1/auth/refreshToken")
        .set("Accept", "application/json")
        .send({ token, refreshToken })
        .expect(200, done);
    });

    it("should respond with invalid token", done => {
      request
        .post("/v1/auth/refreshToken")
        .set("Accept", "application/json")
        .send({ token, refreshToken: "123" })
        .expect(401)
        .expect({ message: "Invalid Token." }, done);
    });
  });
});

describe("Projects", () => {
  describe("POST /v1/projects", () => {
    it("should create project", done => {
      request
        .post("/v1/projects")
        .set("Accept", "application/json")
        .set("Authorization", "Bearer " + token)
        .send({ ...project, createdBy: userId })
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);
          projectId = res.body._id;
          return done();
        });
    });
  });

  describe("GET /v1/projects", () => {
    it("should return list of projects", done => {
      // _stub = sinon.stub(Project, "find").returns({
      //   populate: sinon.stub().returns([project])
      // });
      request
        .get("/v1/projects")
        .set("Authorization", "Bearer " + token)
        .expect(200, done);
    });

    it("should respond with 404 no project found", done => {
      _stub = sinon.stub(Project, "find").returns({
        populate: sinon.stub().returns([])
      });
      request
        .get("/v1/projects")
        .set("Authorization", "Bearer " + token)
        .expect(404, done);
    });
  });

  describe("GET /v1/projects/:id", () => {
    it("should return project by id", done => {
      // _stub = sinon.stub(Project, "findById").returns({
      //   populate: sinon.stub().returns(project)
      // });
      request
        .get("/v1/projects/" + projectId)
        .set("Authorization", "Bearer " + token)
        .expect(200, done);
    });

    it("should respond with 404 no project found by id", done => {
      _stub = sinon.stub(Project, "findById").returns({
        populate: sinon.stub().returns(null)
      });
      request
        .get("/v1/projects/" + projectId)
        .set("Authorization", "Bearer " + token)
        .expect(404)
        .end(() => {
          _stub.restore();
          done();
        });
    });
  });

  describe("PUT /v1/projects/:id", () => {
    it("should update project", done => {
      request
        .put("/v1/projects/" + projectId)
        .set("Accept", "application/json")
        .set("Authorization", "Bearer " + token)
        .send({ title: "title test" })
        .expect(200, done);
    });
  });

  describe("DELETE /v1/projects/:id", () => {
    it("should delete project", done => {
      request
        .delete("/v1/projects/" + projectId)
        .set("Accept", "application/json")
        .set("Authorization", "Bearer " + token)
        .expect(200, done);
    });
  });
});

after(done => {
  User.deleteMany({}).then(() => done());
});
