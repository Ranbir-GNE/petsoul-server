const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reportSchema = new Schema(
  {
    petId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Pet",
    },
    reportType: { type: String, enum: ["regular", "consultation"] },
    vitalSigns: {
      temperature: { type: Number },
      heartRate: { type: Number },
      respiratoryRate: { type: Number },
      weight: { type: Number },
      bodyConditionScore: { type: String },
      hydrationStatus: { type: String },
    },
    physicalExamination: {
      eyes: { type: String },
      ears: { type: String },
      nose: { type: String },
      mouth: { type: String },
      lungs: { type: String },
      heart: { type: String },
      abdomen: { type: String },
      musculoskeletalSystem: { type: String },
      skinAndCoat: { type: String },
    },
    laboratoryTests: {
      completeBloodCount: { type: String },
      chemistryPanel: { type: String },
      urinalysis: { type: String },
      fecalExamination: { type: String },
    },
    additionalTests: {
      thyroidFunctionTest: { type: String },
      heartwormTest: { type: String },
      felvFivTest: { type: String },
      radiographs: { type: String },
      ultrasound: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Report", reportSchema);
