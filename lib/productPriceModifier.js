import pLimit from "p-limit";
import {
  fetchProductsWithResponse,
  fetchWooProductsByCategoryId,
  fetchWooProductVariantById,
  updateWooProduct,
  updateWooProductVariantById,
} from "./wooProduct.js";

const limit = pLimit(5);

const PRICE_MULTIPLIER = 2;

export async function modifyProductVariantPrice(variantId, productId) {
  let salePrice = 0;
  let regularPrice = 0;
  try {
    const variant = await fetchWooProductVariantById(variantId, productId);

    if (variant.sale_price === "") {
      console.log(
        `Variant ${variantId} of product ${productId} has no sale price`
      );
      return;
    }

    salePrice = parseFloat(variant.sale_price) || 0;
    regularPrice = (salePrice * PRICE_MULTIPLIER).toFixed(2);
    console.log(`Processing variant ${variantId} of product ${productId}`, {
      sale_price: salePrice,
      regular_price: regularPrice,
    });
    await updateWooProductVariantById(variantId, productId, {
      regular_price: regularPrice,
    });
    console.log(`Updated variant ${variantId} of product ${productId}`);
    console.log("====================================");
  } catch (error) {
    console.error(
      `Error updating variant ${variantId} of product ${productId}:`,
      {
        regular_price: regularPrice,
        sale_price: salePrice,
      },
      error
    );
    throw new Error(`Failed to modify variant ${variantId}`);
  }
}

async function ProductPriceModifier() {
  try {
    const allProducts = await fetchWooProductsByCategoryId(574, 100);

    allProducts.forEach(async (product) => {
      if (product.type === "simple") {
        console.log("Skip simple product");
      } else if (product.type === "variable") {
        console.log(`Processing variable product ${product.id}`);
        let variantsPromise = product.variations.map((variationId) =>
          limit(
            async () => await modifyProductVariantPrice(variationId, product.id)
          )
        );
        console.log(`Updated variable product ${product.id}`);
        console.log("====================================");
        await Promise.all(variantsPromise);
      }
    });
  } catch (error) {
    console.error("Error updating product prices:", error);
    throw new Error("Failed to modify product prices");
  }
}

export default ProductPriceModifier;

//   const regular_price = (salePrice * PRICE_MULTIPLIER).toFixed(2);
//   console.log(`Updating simple product ${product.id}`);
//   await updateWooProduct(product.id, { regular_price });

// let allProducts = [];
// let page = 1;

// while (true) {
//   const response = await fetchProductsWithResponse(page);
//   const products = response.data || [];
//   if (!products.length) break;

//   allProducts.push(...products);
//   const totalPages = parseInt(response.headers["x-wp-totalpages"], 10);
//   if (page >= totalPages) break;
//   page++;
// }
