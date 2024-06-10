import { Router } from "express";
import { getAllReceipts, getReceiptsByUserId} from "../controllers/receipts.controller.js";

const router =Router();

router.get("/receipts", getAllReceipts);
router.get("/receipts/:userId", getReceiptsByUserId);

export default router;