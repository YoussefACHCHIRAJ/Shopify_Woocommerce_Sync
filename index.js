import dotenv from "dotenv";
import ProductPriceModifier, { fetchProductsNotIncludeOnAllMoroccanCategory, modifyProductVariantPrice } from "./lib/productPriceModifier.js";

dotenv.config();

fetchProductsNotIncludeOnAllMoroccanCategory()
