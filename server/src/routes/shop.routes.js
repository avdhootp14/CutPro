import { Router } from "express";
import { getShopIdentity, getShopDirectory } from "../controllers/shop.controller.js";

const router = Router();

// VERY IMPORTANT: /directory MUST come before /:shopSlug 
// otherwise "directory" will be treated as a shopSlug
router.route("/directory").get(getShopDirectory);
router.route("/:shopSlug").get(getShopIdentity);

export default router;
