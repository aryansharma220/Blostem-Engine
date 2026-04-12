import { Router } from "express";
import {
  explainProduct,
  getProducts,
  recommendProducts,
} from "../controllers/recommendationController.js";

const router = Router();

router.get("/products", getProducts);
router.post("/recommend", recommendProducts);
router.post("/explain", explainProduct);

export default router;
