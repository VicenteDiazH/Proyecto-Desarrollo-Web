import { Router } from "express";
import { getAllReceipts, getReceiptsByUserId} from "../controllers/receipts.controller.js";

const router =Router();

router.get("/", getAllReceipts);
router.get("/:userId", getReceiptsByUserId);

export default router;