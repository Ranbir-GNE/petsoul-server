const {
  addReport,
  updateReports,
  deleteReport,
  viewPetReport,
} = require("../Controllers/ReportController");
const express = require("express");
const router = express.Router();

router.post("/", addReport);
router.put("/:id", updateReports);
router.delete("/:id", deleteReport);
router.get("/:id", viewPetReport);

module.exports = router;
