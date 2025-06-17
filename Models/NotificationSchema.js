const mongoose = reqire("mongoose");

const NoificaionSchema = new Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    readStatus: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Notifications", NoificaionSchema);
