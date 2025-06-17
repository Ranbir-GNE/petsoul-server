const mongoose = require("mongoose");

const VaccinationSchema = new mongoose.Schema(
  {
    petId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pet",
    },
    vaccinationType: {
      type: String,
      enum: ["one-time", "annual", "bi-annual", "tri-annual"],
    },
    vaccinationName: {
      type: String,
      enum: [
        "rabies",
        "dhpp",
        "corona",
        "leptospirosis",
        "lyme",
        "bordetella",
        "giardia",
        "lymphoma",
        "feline leukemia",
        "feline immunodeficiency",
        "feline distemper",
        "feline rabies",
        "feline herpes",
        "feline calicivirus",
        "feline chlamydia",
      ],
    },
    vaccinationDate: {
      type: Date,
    },
    VaccinationImmunity: {
      type: Number,
    },
    nextVaccinationDate: {
      type: Date,
    },
    vaccineStatus: {
      type: String,
      enum: ["Pending", "Completed"],
    },
  },
  {
    timestamps: true,
  }
);
VaccinationSchema.index({ petId: 1 });

module.exports = mongoose.model("Vaccination", VaccinationSchema);
