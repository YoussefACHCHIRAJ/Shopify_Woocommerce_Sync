const dotenv = require("dotenv");
const { shopifyClient, wcClient } = require("./lib");
const {
  collectionsSlug,
  handledCollections,
} = require("./constants/categories");

dotenv.config();

async function fetchShopifyProducts() {
  const { data } = await shopifyClient.get(
    "products.json?limit=250&status=active"
  );
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
    `collections/${collectionId}/products.json?limit=250&status=active`
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

  if (data.length > 0) return data[0];

  return null;
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

async function updateWooProduct(productId, payload) {
  const { data } = await wcClient.put(`products/${productId}`, payload);

  return data;
}

async function transferShopifyVariantsToWoo(
  variants,
  productId,
  productOptions
) {
  await Promise.all(
    variants.map((variant) => {
      const variantPayload = {
        regular_price: variant.price,
        description: variant.title,
        attributes: productOptions.map((option, index) => ({
          name: option.name,
          option: variant[`option${index + 1}`],
        })),
      };

      return linkWooProductWithVariants(productId, variantPayload);
    })
  );
}

async function createFringesVariants(productId) {
  const fringesVariants = [
    { option: "No Fringes" },
    { option: "One Side" },
    { option: "Both Sides" },
  ];

  await Promise.all(
    fringesVariants.map((fringe) => {
      const fringePayload = {
        regular_price: "0.00",
        description: fringe.option,
        attributes: [
          {
            name: "Fringes",
            option: fringe.option,
          },
        ],
      };

      return linkWooProductWithVariants(productId, fringePayload);
    })
  );
}

async function transferShopifyProductsToWoo() {
  const handledCollectionsIds = Object.keys(handledCollections);

  for (const collectionId of handledCollectionsIds) {
    const products = await fetchShopifyCollectionProducts(collectionId);

    for (const product of products) {
      if (product.status !== "active") {
        console.log("================ Inactive product. Skip ================");
        continue;
      }

      const wooCategory = await fetchWooCategoryBySlug(
        handledCollections[collectionId]
      );

      if (!wooCategory) {
        console.log(
          "================ This Category not exist on woo. Skip ================"
        );
        continue;
      }

      const wooProduct = await fetchWooProductBySlug(product.handle);

      if (wooProduct) {
        if (wooProduct.categories.find((cat) => cat.id === wooCategory.id)) {
          if (wooCategory.slug === "custom-moroccan-rugs-size") {
            const attributesPayload = {
              attributes: [
                ...wooProduct.attributes,
                {
                  name: "Fringes",
                  visible: true,
                  variation: true,
                  options: ["One side", "Both side", "No Fringes"],
                },
              ],
            };
            await Promise.all([
              updateWooProduct(wooProduct, attributesPayload),
              createFringesVariants(wooProduct.id),
            ]);

            console.log(
              "================ This belongs to custom size, add fringes variant. ================"
            );
          }
          console.log(
            `${wooProduct.name} already saved on category: ${wooCategory.name}`
          );
          continue;
        }

        const payload = {
          categories: [
            {
              id: wooCategory.id,
            },
          ],
        };

        if (wooCategory.slug === "custom-moroccan-rugs-size") {
          const existingAttributes = wooProduct.attributes.map(
            (attr) => attr.name
          );

          if (!existingAttributes.includes("Fringes")) {
            payload.attributes = [
              ...wooProduct.attributes,
              {
                name: "Fringes",
                visible: true,
                variation: true,
                options: ["One side", "Both side", "No Fringes"],
              },
            ];
            await createFringesVariants(wooProduct.id);
          }
        }

        await updateWooProduct(wooProduct.id, payload);

        console.log(
          `Product ${wooProduct.name} linked with category ${wooCategory.name}`
        );
      } else {
        const shopifyProduct = await fetchSingleShopifyProduct(product.id);
        const payload = {
          name: shopifyProduct.title,
          slug: shopifyProduct.handle,
          type: "variable",
          description: shopifyProduct.body_html,
          price: shopifyProduct.variants[0].price,
          images:
            shopifyProduct.images.map(({ src, alt }) => ({
              src,
              alt: alt || "Moroccan Carpets",
            })) || [],
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

        if (wooCategory.slug === "custom-moroccan-rugs-size") {
          payload.attributes.push({
            name: "Fringes",
            visible: true,
            variation: true,
            options: ["One side", "Both side", "No Fringes"],
          });
        }

        const createdProduct = await createWooProduct(payload);

        await transferShopifyVariantsToWoo(
          shopifyProduct.variants,
          createdProduct.id,
          shopifyProduct.options
        );

        if (wooCategory.slug === "custom-moroccan-rugs-size") {
          await createFringesVariants(createdProduct.id);
        }

        console.log(
          `Product ${createdProduct.name} created and linked with category ${wooCategory.name}`
        );
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
