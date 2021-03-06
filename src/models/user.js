const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  projects: [
    {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: false
    }
  ]
});

module.exports = mongoose.model("User", userSchema);
