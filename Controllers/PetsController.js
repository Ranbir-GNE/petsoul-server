const HealthRecordModel = require("../Models/HealthRecordSchema");
const PetModel = require("../Models/PetSchema");
const ReportModel = require("../Models/ReportSchema");
const UserModel = require("../Models/UserSchema");

const createPet = async (req, res) => {
  const { name, breed, species, profilePicture, age, ownerId } = req.body;
  if (!name || !breed || !age || !species || !ownerId) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const pet = await PetModel.create({
      name,
      breed,
      age,
      species,
      profilePicture,
      ownerId,
    });
    if (!pet) {
      return res.status(400).json({ message: "Failed to Add Pet" });
    }
    res.status(201).json({ pet, message: "Pet Created" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updatePet = async (req, res) => {
  const id = req.params.id;
  const { name, breed, species, profilePicture, age } = req.body;
  try {
    const pet = await PetModel.findByIdAndUpdate(
      id,
      {
        name,
        breed,
        age,
        species,
        profilePicture,
      },
      { new: true }
    );
    if (!pet) {
      return res.status(400).json({ message: "Failed to Update Pet" });
    }
    res.status(200).json({ pet, message: "Pet Updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deletePet = async (req, res) => {
  const id = req.params.id;
  try {
    const pet = await PetModel.findByIdAndDelete(id);
    if (!pet) {
      return res.status(400).json({ message: "Failed to Delete Pet" });
    }
    res.status(200).json({ message: "Pet Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getPetsByOwnerId = async (req, res) => {
  const id = req.id;
  if (!id) {
    return res.status(400).json({ message: "User ID is required" });
  }
  try {
    const pets = await PetModel.find({ ownerId: id });
    if (!pets) {
      return res.status(400).json({ message: "No Pets Found" });
    }
    res.status(200).json(pets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getPetDetails = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ message: "Pet ID is required" });
  }
  try {
    const pet = await PetModel.findById(id);
    if (!pet) {
      return res.status(400).json({ message: "Pet Not Found" });
    }
    res.status(200).json({ pet, message: "Pet Found" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getReports = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ message: "Pet ID is required" });
  }
  try {
    const pet = await PetModel.findById(id);
    if (!pet) {
      return res.status(400).json({ message: "Pet Not Found" });
    }
    const reports = await ReportModel.find({ petId: id });
    if (!reports) {
      return res.status(400).json({ message: "No Reports Found" });
    }
    res.status(200).json({ reports, message: "Reports Found" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getRecords = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ message: "Pet ID is required" });
  }
  try {
    const pet = await PetModel.findById(id);
    if (!pet) {
      return res.status(400).json({ message: "Pet Not Found" });
    }
    const records = await HealthRecordModel.find({ petId: id });
    if (!records) {
      return res.status(400).json({ message: "No Records Found" });
    }
    res.status(200).json({ records, message: "Records Found" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const contact = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ message: "Pet ID is required" });
  }
  try {
    const pet = await PetModel.findById(id);
    if (!pet) {
      return res.status(400).json({ message: "Pet Not Found" });
    }
    const owner = await UserModel.findById(pet.ownerId).select("-password");
    if (!owner) {
      return res.status(400).json({ message: "Owner Not Found" });
    }
    res.status(200).json({ owner, message: "Owner Contact Found" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createPet,
  updatePet,
  deletePet,
  getPetsByOwnerId,
  getPetDetails,
  getReports,
  getRecords,
  contact,
};
