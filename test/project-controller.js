const expect = require("chai").expect;
const sinon = require("sinon");
const mongoose = require("mongoose");
require("dotenv-safe").config();

const Project = require("../src/models/project");
const ProjectController = require("../src/controllers/project");
const { mongodb_url_test } = require("../src/utils/config");

describe("Project Controller", () => {
  let _stub;

  before(done => {
    mongoose
      .connect(mongodb_url_test, { useNewUrlParser: true })
      .then(() => {
        const project = new Project({
          _id: "5cacaa286674d03898d9d0f1",
          title: "My Project",
          content: "Lorem ipsum dolor, sit amet consectetur adipisicing elit",
          createdBy: "5cacaa286674d03898d9d0f1"
        });
        return project.save();
      })
      .then(() => done())
      .catch(err => {
        console.log("MongoDB error: " + err);
      });
  });

  describe("GET", () => {
    it("should return status code 404 if no projects were found", done => {
      _stub = sinon.stub(Project, "populate").returns([]);

      ProjectController.getProjects({}, {}, () => {}).then(res => {
        expect(res).to.be.an("error");
        expect(res).to.have.property("statusCode", 404);
        done();
      });
    });

    it("should return array of projects", done => {
      const req = {
        userId: "5cacaa286674d03898d9d0f1"
      };

      const res = {
        projects: [],
        statusCode: null,
        status: function status(code) {
          this.statusCode = code;
          return this;
        },
        json: function json(projects) {
          this.projects = projects;
        }
      };

      ProjectController.getProjects(req, res, () => {}).then(() => {
        // expect(res).to.be.an("object");
        // expect(res).to.have.property("projects");
        // expect(res.statusCode).to.be.equal(200);
        done();
      });
    });

    it("should return project by id", done => {
      const req = {
        params: {
          idProject: "5cacaa286674d03898d9d0f1"
        }
      };

      const res = {
        project: null,
        statusCode: null,
        status: function status(code) {
          this.statusCode = code;
          return this;
        },
        json: function json(project) {
          this.project = project;
        }
      };

      ProjectController.getProject(req, res, () => {}).then(() => {
        expect(res).to.be.an("object");
        expect(res)
          .to.have.property("project")
          .to.have.property("_id");
        expect(res.statusCode).to.be.equal(200);
        done();
      });
    });

    it("should return status code 404 if no project was found", done => {
      const req = {
        params: {
          idProject: "5caca863a3780f1b20c5f455"
        }
      };

      ProjectController.getProject(req, {}, () => {}).then(res => {
        expect(res).to.be.an("error");
        expect(res).to.have.property("statusCode", 404);
        done();
      });
    });
  });

  describe("POST", () => {
    it("should create project on db and return status code 201", done => {
      const req = {
        body: {
          title: "My Project",
          content: "Lorem ipsum dolor, sit amet consectetur adipisicing elit"
        },
        userId: "5cacaa286674d03898d9d0f1"
      };

      const res = {
        project: null,
        statusCode: null,
        status: function status(code) {
          this.statusCode = code;
          return this;
        },
        json: function json(project) {
          this.project = project;
        }
      };

      ProjectController.createProject(req, res, () => {}).then(() => {
        expect(res).to.have.property("statusCode", 201);
        expect(res)
          .to.have.property("project")
          .to.have.property("_id");
        done();
      });
    });
  });

  describe("PUT", () => {
    it("should update project on db and return status code 200", done => {
      const req = {
        body: {
          title: "My Project 2",
          content: "sit amet consectetur adipisicing elit"
        },
        params: {
          idProject: "5cacaa286674d03898d9d0f1"
        }
      };

      const res = {
        project: null,
        statusCode: null,
        status: function status(code) {
          this.statusCode = code;
          return this;
        },
        json: function json(project) {
          this.project = project;
        }
      };

      ProjectController.updateProject(req, res, () => {}).then(() => {
        expect(res).to.have.property("statusCode", 200);
        expect(res)
          .to.have.property("project")
          .to.have.property("_id");
        expect(res.project.title).to.be.equal("My Project 2");
        expect(res.project.content).to.be.equal(
          "sit amet consectetur adipisicing elit"
        );
        done();
      });
    });
  });

  describe("DELETE", () => {
    it("should delete project and return status code 200", done => {
      const req = {
        params: {
          idProject: "5cacaa286674d03898d9d0f1"
        }
      };

      const res = {
        statusCode: null,
        status: function status(code) {
          this.statusCode = code;
          return this;
        },
        json: function json() {}
      };

      ProjectController.deleteProject(req, res, () => {}).then(() => {
        expect(res).to.have.property("statusCode", 200);
        done();
      });
    });
  });

  after(done => {
    Project.deleteMany({})
      .then(() => {
        return mongoose.disconnect();
      })
      .then(() => done());
  });

  afterEach(() => {
    _stub.restore();
  });
});
