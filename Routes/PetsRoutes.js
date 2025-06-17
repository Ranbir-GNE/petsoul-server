const {
  createPet,
  updatePet,
  deletePet,
  getPetsByOwnerId,
  getPetDetails,
  getReports,
  getRecords,
  contact,
} = require("../Controllers/PetsController");
const express = require("express");
const router = express.Router();

router.post("/", createPet);
router.put("/:id", updatePet);
router.delete("/:id", deletePet);
router.get("/owner/:id", getPetsByOwnerId);
router.get("/:id", getPetDetails);
router.get("/reports/:id", getReports);
router.get("/records/:id", getRecords);
router.get("/contact/:id", contact);

module.exports = router;
