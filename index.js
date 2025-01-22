import dotenv from "dotenv";
import ProductPriceModifier, { modifyProductVariantPrice } from "./lib/productPriceModifier.js";

dotenv.config();
ProductPriceModifier();

// modifyProductVariantPrice(17747, 17408);
