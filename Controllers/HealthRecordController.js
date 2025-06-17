const HealthRecordModel = require("../Models/HealthRecordSchema");
const VaccinationModel = require("../Models/VaccinationSchema");
const PetModel = require("../Models/PetSchema");

const addRecord = async (req, res) => {
  const {
    petId,
    ownerInformation,
    presentReports,
    medicalHistory,
    checkupInformation,
    additionalFields,
  } = req.body;

  if (!petId) {
    return res.status(400).json({ message: "Pet ID is required" });
  }
  const existingRecord = await HealthRecordModel.findOne({ petId: petId });
  if (existingRecord) {
    return res
      .status(400)
      .json({ message: "Record already exists for this pet" });
  }
  try {
    const newRecord = new HealthRecordModel({
      petId,
      ownerInformation: {
        name: ownerInformation.name,
        contactInformation: ownerInformation.contactInformation,
      },
      presentReports,
      medicalHistory: {
        allergies: medicalHistory.allergies,
        medications: medicalHistory.medications,
        vaccinations: medicalHistory.vaccinations,
        surgeries: medicalHistory.surgeries,
        illnesses: medicalHistory.illnesses,
        behavioralIssues: medicalHistory.behavioralIssues,
        dietaryRestrictions: medicalHistory.dietaryRestrictions,
      },
      checkupInformation: {
        dateOfCheckup: checkupInformation.dateOfCheckup,
        vitalSigns: {
          temperature: checkupInformation.vitalSigns.temperature,
          heartRate: checkupInformation.vitalSigns.heartRate,
          respiratoryRate: checkupInformation.vitalSigns.respiratoryRate,
          weight: checkupInformation.vitalSigns.weight,
          bodyConditionScore: checkupInformation.vitalSigns.bodyConditionScore,
          hydrationStatus: checkupInformation.vitalSigns.hydrationStatus,
        },
        physicalExamFindings: checkupInformation.physicalExamFindings,
        laboratoryResults: checkupInformation.laboratoryResults,
        diagnosticTests: checkupInformation.diagnosticTests,
        treatmentPlan: checkupInformation.treatmentPlan,
      },
      additionalFields: {
        behavioralNotes: additionalFields.behavioralNotes,
      },
    });

    const savedRecord = await newRecord.save();

    res.status(201).json({
      message: "Record added successfully",
      record: savedRecord,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error adding record",
      error: error.message,
    });
  }
};

const updateRecord = async (req, res) => {
  try {
    const {
      petId,
      ownerInformation,
      medicalHistory,
      checkupInformation,
      additionalFields,
    } = req.body;

    const updateRecordData = {
      petId,
      ownerInformation: {
        name: ownerInformation.name,
        contactInformation: ownerInformation.contactInformation,
      },
      medicalHistory: {
        allergies: medicalHistory.allergies,
        medications: medicalHistory.medications,
        vaccinations: medicalHistory.vaccinations,
        surgeries: medicalHistory.surgeries,
        illnesses: medicalHistory.illnesses,
        behavioralIssues: medicalHistory.behavioralIssues,
        dietaryRestrictions: medicalHistory.dietaryRestrictions,
      },
      checkupInformation: {
        dateOfCheckup: checkupInformation.dateOfCheckup,
        weight: checkupInformation.weight,
        bodyConditionScore: checkupInformation.bodyConditionScore,
        vitalSigns: {
          temperature: checkupInformation.vitalSigns.temperature,
          heartRate: checkupInformation.vitalSigns.heartRate,
          respiratoryRate: checkupInformation.vitalSigns.respiratoryRate,
        },
        physicalExamFindings: checkupInformation.physicalExamFindings,
        laboratoryResults: checkupInformation.laboratoryResults,
        diagnosticTests: checkupInformation.diagnosticTests,
        treatmentPlan: checkupInformation.treatmentPlan,
      },
      additionalFields: {
        behavioralNotes: additionalFields.behavioralNotes,
      },
    };

    const updatedRecord = await HealthRecordModel.findByIdAndUpdate(
      req.params.id,
      updateRecordData,
      { new: true }
    );

    res.status(200).json({
      message: "Record updated successfully",
      record: updatedRecord,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error updating record",
      error: error.message,
    });
  }
};

const deleteRecord = async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({
      message: "Invalid or missing ID parameter",
    });
  }

  try {
    const deletedRecord = await HealthRecordModel.findByIdAndDelete(id);

    if (!deletedRecord) {
      return res.status(404).json({
        message: "Record not found",
      });
    }

    res.status(200).json({
      message: "Record deleted successfully",
      record: deletedRecord,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error deleting record",
      error: error.message,
    });
  }
};

const getMedicalHistory = async (req, res) => {
  try {
    const petId = req.params.id;

    if (!petId) {
      return res.status(400).json({
        message: "petId is required to retrieve medical history",
      });
    }

    const medicalHistory = await HealthRecordModel.find(
      { petId },
      { medicalHistory: 1, reportType: 1, dateOfCheckup: 1 }
    );

    res.status(200).json({
      message: "Medical history retrieved successfully",
      medicalHistory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error retrieving medical history",
      error: error.message,
    });
  }
};

const getCheckupInformation = async (req, res) => {
  try {
    const petId = req.params.id;

    if (!petId) {
      return res.status(400).json({
        message: "petId is required to retrieve checkup information",
      });
    }
    const petInfo = await PetModel.findById(petId);

    if (!petInfo) {
      return res.status(400).json({
        message: "Pet not found",
      });
    }

    const checkupInformation = await HealthRecordModel.find(
      { petId },
      { checkupInformation: 1, reportType: 1 }
    );

    res.status(200).json({
      message: "Checkup information retrieved successfully",
      checkupInformation,
      petInfo: petInfo.name,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error retrieving checkup information",
      error: error.message,
    });
  }
};

const getVaccinationRecord = async (req, res) => {
  try {
    const petId = req.params.id;

    if (!petId) {
      return res.status(400).json({
        message: "petId is required to retrieve vaccination record",
      });
    }

    const vaccinationRecord = await VaccinationModel.find(
      { petId },
      {
        vaccinationName: 1,
        vaccinationDate: 1,
        nextVaccinationDate: 1,
        vaccineStatus: 1,
      }
    );
    if (!vaccinationRecord) {
      return res.status(400).json({
        message: "No vaccination record found",
      });
    }

    res.status(200).json({
      message: "Vaccination record retrieved successfully",
      vaccinationRecord,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error retrieving vaccination record",
      error: error.message,
    });
  }
};

module.exports = {
  addRecord,
  updateRecord,
  deleteRecord,
  getMedicalHistory,
  getCheckupInformation,
  getVaccinationRecord,
};
