const VaccinationModel = require("../Models/VaccinationSchema");
const RecordModel = require("../Models/HealthRecordSchema");

const addVaccination = async (req, res) => {
  const {
    petId,
    vaccinationType,
    vaccinationName,
    vaccinationDate,
    nextVaccinationDate,
    vaccineStatus,
  } = req.body;
  if (!petId) {
    return res.status(400).json({ message: "Pet ID is required" });
  }
  if (
    !vaccinationType ||
    !vaccinationDate ||
    !nextVaccinationDate ||
    !vaccineStatus ||
    !vaccinationName
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const newVaccination = new VaccinationModel({
      petId,
      vaccinationType,
      vaccinationDate,
      nextVaccinationDate,
      vaccineStatus,
      vaccinationName,
    });
    const savedVaccination = await newVaccination.save();
    if (!savedVaccination) {
      return res.status(400).json({ message: "Could Not Add Vaccination" });
    }
    const record = await RecordModel.findOneAndUpdate(
      { petId: petId },
      {
        $push: {
          "medicalHistory.vaccinations": savedVaccination.vaccinationName,
        },
      },
      { new: true, runValidators: true }
    );
    if (!record) {
      return res
        .status(404)
        .json({ message: "Could Not Update Vaccination in Record" });
    }
    return res
      .status(200)
      .json({ message: "Vaccination added successfully", savedVaccination });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error adding vaccination",
      error: error.message,
    });
  }
};

const updateVaccination = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ message: "Vaccination ID is required" });
  }
  const existVaccination = await VaccinationModel.findOne({ _id: id });
  if (!existVaccination) {
    return res.status(404).json({ message: "No Vaccination Found" });
  }
  try {
    const vaccination = await VaccinationModel.findByIdAndUpdate(
      id,
      {
        ...req.body,
      },
      { new: true, runValidators: true }
    );
    if (!vaccination) {
      return res.status(404).json({ message: "Could Not Update Vaccination" });
    }
    return res.status(200).json(vaccination);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error updating vaccination",
      error: error.message,
    });
  }
};

const viewVaccinations = async (req, res) => {
  const petId = req.params.id;
  if (!petId) {
    return res.status(400).json({ message: "Pet ID is required" });
  }
  try {
    const vaccinations = await VaccinationModel.find({ petId });
    if (!vaccinations || vaccinations.length === 0) {
      return res.status(404).json({ message: "No Vaccinations Found" });
    }
    return res
      .status(200)
      .json({ message: "Vaccinations Found", vaccinations });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error viewing vaccinations",
      error: error.message,
    });
  }
};

const vaccinationStatus = async (req, res) => {
  const vaccinationId = req.params.id;
  if (!vaccinationId) {
    return res.status(400).json({ message: "Vaccination ID is required" });
  }
  try {
    const vaccination = await VaccinationModel.findOne({ _id: vaccinationId });
    if (!vaccination) {
      return res.status(404).json({ message: "No Vaccination Found" });
    }
    const newStatus =
      vaccination.vaccineStatus === "completed" ? "pending" : "completed";
    const status = await VaccinationModel.findOneAndUpdate(
      { _id: vaccinationId },
      {
        vaccineStatus: newStatus,
      },
      { new: true, runValidators: true }
    );
    if (!status) {
      return res.status(404).json({ message: "Could Not Update Status" });
    }
    return res
      .status(200)
      .json({ message: "Vaccination Status Updated", status });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error updating vaccination status",
      error: error.message,
    });
  }
};

const updateNextVaccinationDate = async (req, res) => {
  const vaccinationId = req.params.id;

  if (!vaccinationId) {
    return res.status(400).json({ message: "Vaccination ID is required." });
  }

  try {
    const vaccination = await VaccinationModel.findById(vaccinationId);
    if (!vaccination) {
      return res.status(404).json({ message: "Vaccination not found." });
    }

    const { vaccinationType, nextVaccinationDate } = vaccination;
    const currentNextDate = new Date(nextVaccinationDate);
    let newNextVaccinationDate;

    switch (vaccinationType) {
      case "annual":
        newNextVaccinationDate = new Date(
          currentNextDate.setFullYear(currentNextDate.getFullYear() + 1)
        );
        break;
      case "bi-annual":
        newNextVaccinationDate = new Date(
          currentNextDate.setMonth(currentNextDate.getMonth() + 6)
        );
        break;
      case "tri-annual":
        newNextVaccinationDate = new Date(
          currentNextDate.setMonth(currentNextDate.getMonth() + 4)
        );
        break;
      case "one-time":
        return res.status(400).json({
          message:
            "No further vaccinations required for one-time vaccinations.",
        });
      default:
        return res.status(400).json({ message: "Invalid vaccination type." });
    }

    const updatedVaccination = await VaccinationModel.findByIdAndUpdate(
      vaccinationId,
      { nextVaccinationDate: newNextVaccinationDate },
      { new: true, runValidators: true }
    );

    if (!updatedVaccination) {
      return res
        .status(404)
        .json({ message: "Could not update next vaccination date." });
    }

    return res.status(200).json({
      message: "Next vaccination date updated successfully.",
      updatedVaccination,
    });
  } catch (error) {
    console.error("Error updating next vaccination date:", error);
    return res.status(500).json({
      message: "Server error while updating next vaccination date.",
      error: error.message,
    });
  }
};

const getNextVaccinationDate = async (req, res) => {
  const vaccinationId = req.params.id;
  if (!vaccinationId) {
    return res.status(400).json({ message: "Vaccination ID is required." });
  }
  try {
    const vaccination = await VaccinationModel.findById(vaccinationId);
    if (!vaccination) {
      return res.status(404).json({ message: "Vaccination not found." });
    }
    return res.status(200).json({
      message: "Next vaccination date retrieved successfully.",
      nextVaccinationDate: vaccination.nextVaccinationDate,
    });
  } catch (err) {
    console.error("Error retrieving next vaccination date:", err);
    return res.status(500).json({
      message: "Server error while retrieving next vaccination date.",
      error: err.message,
    });
  }
};

const deleteVaccination = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ message: "Vaccination ID is required" });
  }
  try {
    const existVaccination = await VaccinationModel.findByIdAndDelete(id);
    if (!existVaccination) {
      return res.status(404).json({ message: "No Vaccination Found" });
    }
    const record = await RecordModel.findByIdAndUpdate(
      { petId: existVaccination.petId },
      {
        $pull: {
          "medicalHistory.vaccinations": existVaccination.vaccinationType,
        },
      },
      { new: true, runValidators: true }
    );
    if (!record) {
      return res.status(404).json({ message: "Could Not Update Record" });
    }
    return res
      .status(200)
      .json({ message: "Vaccination deleted successfully", record });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error deleting vaccination",
      error: error.message,
    });
  }
};

module.exports = {
  addVaccination,
  updateVaccination,
  viewVaccinations,
  vaccinationStatus,
  deleteVaccination,
  updateNextVaccinationDate,
  getNextVaccinationDate,
};
