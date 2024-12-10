const dotenv = require("dotenv");
const { shopifyClient, wcClient } = require("./lib");
const {
  collectionsSlug,
  handledCollections,
} = require("./constants/categories");

dotenv.config();

async function fetchShopifyProducts() {
  const { data } = await shopifyClient.get("products.json");
  return data.products;
}

async function fetchSingleShopifyProduct(productId) {
  const { data } = await shopifyClient.get(`products/${productId}.json`);

  return data.product;
}

async function fetchShopifyCollections() {
  const { data } = await shopifyClient.get("smart_collections.json");
  return data.smart_collections;
}

async function createWooCategory(payload) {
  const { data } = await wcClient.post("products/categories", payload);
  return data;
}

async function fetchShopifyCollectionProducts(collectionId) {
  const { data } = await shopifyClient.get(
    `collections/${collectionId}/products.json`
  );

  return data.products;
}

async function fetchWooProductBySlug(slug) {
  const { data } = await wcClient.get("products", { params: { slug } });

  if (data.length > 0) return data[0];

  return null;
}

async function fetchWooCategoryBySlug(slug) {
  const { data } = await wcClient.get("products/categories", {
    params: { slug },
  });

  return data;
}

async function createWooProduct(payload) {
  const { data } = await wcClient.post("products", payload);

  return data;
}

async function linkWooProductWithVariants(productId, payload) {
  const { data } = await wcClient.post(
    `products/${productId}/variations`,
    payload
  );

  return data;
}

async function linkWooProductWithCategory(productId, payload) {
  const { data } = await wcClient.put(`products/${productId}`, payload);

  return data;
}

async function transferShopifyVariantsToWoo(
  variants,
  productId,
  productOptions
) {
  for (const variant of variants) {
    const variantPayload = {
      regular_price: variant.price,
      description: variant.title,
      sku: variant.sku,
      attributes: productOptions.map((option, index) => ({
        name: option.name,
        option: variant[`option${index + 1}`],
      })),
    };

    await linkWooProductWithVariants(productId, variantPayload);
  }
}

async function transferShopifyProductsToWoo() {
  const handledCollectionsIds = Object.keys(handledCollections);

  for (const collectionId of handledCollectionsIds) {
    const products = await fetchShopifyCollectionProducts(collectionId);

    for (const product of products) {
      if (product.status !== "active") {
        continue;
      }
      const wooCategories = await fetchWooCategoryBySlug(
        handledCollections[collectionId]
      );

      const wooCategory = wooCategories[0];

      const wooProduct = await fetchWooProductBySlug(product.handle);

      if (wooProduct) {
        const payload = {
          categories: [
            {
              id: wooCategory.id,
            },
          ],
        };

        await linkWooProductWithCategory(wooProduct.id, payload);

        console.log("Product linked with category");
      } else {
        const shopifyProduct = await fetchSingleShopifyProduct(product.id);
        const payload = {
          name: shopifyProduct.title,
          slug: shopifyProduct.handle,
          type: "variable",
          description: shopifyProduct.body_html,
          price: shopifyProduct.variants[0].price,
          images: shopifyProduct.images.map(({ src, alt }) => ({ src, alt: alt || 'Moroccan Carpets' })),
          categories: [
            {
              id: wooCategory.id,
            },
          ],
          attributes: shopifyProduct.options.map((option) => ({
            name: option.name,
            visible: true,
            variation: true,
            options: option.values,
          })),
        };

        const createdProduct = await createWooProduct(payload);

        await transferShopifyVariantsToWoo(
          shopifyProduct.variants,
          createdProduct.id,
          shopifyProduct.options
        );

        console.log("Product created and linked with category");
      }
    }
  }
}

(async () => {
  await transferShopifyProductsToWoo();
})();

// async function transferShopifyCollectionsToWoo() {
//   const shopifyCollections = await fetchShopifyCollections();

//   for (const collection of shopifyCollections) {
//     if (!collectionsSlug.includes(collection.handle)) {
//       continue;
//     }

//     const payload = {
//       name: collection.title,
//       slug: collection.handle,
//       description: collection.body_html,
//     };

//     if (Object.keys(collection).includes("image")) {
//       payload.image = {
//         src: collection.image.src,
//         alt: collection.image.alt,
//       };
//     }

//     const data = await createWooCategory(payload);

//     console.log(data);
//   }
// }
