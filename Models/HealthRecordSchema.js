const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const healthRecordSchema = new Schema({
  petId: { type: String, index: true, trim: true, ref: "Pet" },
  ownerInformation: {
    name: { type: String, trim: true },
    contactInformation: { type: String, trim: true },
  },
  presentReports: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Report",
    },
  ],
  medicalHistory: {
    allergies: [{ type: String, trim: true }],
    medications: [{ type: String, trim: true }],
    vaccinations: [{ type: String, ref: "Vaccination" }],
    surgeries: [{ type: String, trim: true }],
    illnesses: [{ type: String, trim: true }],
    behavioralIssues: [{ type: String, trim: true }],
    dietaryRestrictions: [{ type: String, trim: true }],
  },
  checkupInformation: {
    dateOfCheckup: [{ type: Date }],
    vitalSigns: {
      temperature: [{ type: Number }],
      heartRate: [{ type: Number }],
      respiratoryRate: [{ type: Number }],
      weight: [{ type: Number }],
      bodyConditionScore: [{ type: String }],
      hydrationStatus: [{ type: String }],
    },
    physicalExamFindings: { type: String, trim: true },
    laboratoryResults: { type: String, trim: true },
    diagnosticTests: { type: String, trim: true },
    treatmentPlan: { type: String, trim: true },
  },
  additionalFields: {
    behavioralNotes: [{ type: String, trim: true }],
  },
});

healthRecordSchema.index({
  petId: 1,
  vaccinations: 1,
  presentReports: 1,
  dateOfCheckup: 1,
});

module.exports = mongoose.model("HealthRecord", healthRecordSchema);
