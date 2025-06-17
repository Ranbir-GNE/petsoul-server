const {
  addRecord,
  updateRecord,
  deleteRecord,
  getMedicalHistory,
  getCheckupInformation,
  getVaccinationRecord,
} = require("../Controllers/HealthRecordController");
const express = require("express");
const router = express.Router();

router.post("/", addRecord);
router.put("/:id", updateRecord);
router.delete("/:id", deleteRecord);
router.get("/:id", getMedicalHistory);
router.get("/checkup/:id", getCheckupInformation);
router.get("/vaccination/:id", getVaccinationRecord);

module.exports = router;
