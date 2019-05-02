const expect = require("chai").expect;
const mongoose = require("mongoose");
require("dotenv-safe").config();

const { mongodb_url_test } = require("../../src/utils/config");
const User = require("../../src/models/user");
const UserController = require("../../src/controllers/user");

describe("User controller", () => {
  before(done => {
    mongoose
      .connect(mongodb_url_test, { useNewUrlParser: true })
      .then(() => {
        const user = new User({
          firstName: "test",
          lastName: "user",
          email: "test@email.com",
          password: "test"
        });
        return user.save();
      })
      .then(() => done())
      .catch(err => {
        console.log("MongoDB error: " + err);
      });
  });

  describe("POST", () => {
    it("should create user and return status code 201", done => {
      const req = {
        body: {
          firstName: "test",
          lastName: "user",
          email: "test2@email.com",
          password: "test"
        }
      };

      const res = {
        statusCode: null,
        _id: null,
        firstName: null,
        lastName: null,
        email: null,
        status: function status(code) {
          this.statusCode = code;
          return this;
        },
        json: function json(data) {
          this._id = data._id;
          this.firstName = data.firstName;
          this.lastName = data.lastName;
          this.email = data.email;
        }
      };

      UserController.createUser(req, res, () => {}).then(response => {
        expect(res).to.be.an("object");
        expect(res).to.have.property("statusCode", 201);
        expect(res).to.have.property("email", "test2@email.com");
        done();
      });
    });
  });

  after(done => {
    User.deleteMany({})
      .then(() => {
        return mongoose.disconnect();
      })
      .then(() => done())
      .catch(err => {
        console.log(err);
        done();
      });
  });
});
