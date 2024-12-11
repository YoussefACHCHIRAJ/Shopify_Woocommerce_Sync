const dotenv = require("dotenv");
const { shopifyClient, wcClient } = require("./lib");
const {
  collectionsSlug,
  handledCollections,
} = require("./constants/categories");
const { getNextPageUrlFromHeader } = require("./utils/functions");
const { default: axios } = require("axios");

dotenv.config();

const colorsOptions = [
  "Light Beige",
  "Taupe",
  "Tan",
  "Caramel",
  "Burnt Orange",
  "Mahogany",
];
const colorsVariants = [
  { option: "Light Beige" },
  { option: "Taupe" },
  { option: "Tan" },
  { option: "Caramel" },
  { option: "Burnt Orange" },
  { option: "Mahogany" },
];

const newSwatchValue = {
  f7bd60b75b29d79b660a2859395c1a24: {
    display_type: "dropdown",
    display_label: "default",
    display_size: "default",
  },
  "7b0e1e680a0528cf6a4250aa8aabe6ed": {
    display_type: "default",
    display_label: "default",
    display_size: "default",
  },
};

const fringesOptions = ["No Fringes", "One Side", "Both Sides"];

const fringesVariants = [
  { option: "No Fringes" },
  { option: "One Side" },
  { option: "Both Sides" },
];
const shopifyStore = process.env.SHOPIFY_URL;
const access_token = process.env.APP_KEY;

async function fetchShopifyProducts() {
  try {
    const { data } = await shopifyClient.get(
      "products.json?limit=250&status=active"
    );
    return data.products;
  } catch (error) {
    console.error("Error fetching Shopify products:", error);
    throw new Error("failed to 'fetchShopifyProducts'");
  }
}

async function fetchSingleShopifyProduct(productId) {
  try {
    const { data } = await shopifyClient.get(`products/${productId}.json`);
    return data.product;
  } catch (error) {
    console.error("Error fetching single Shopify product:", error);
    throw new Error("failed to 'fetchSingleShopifyProduct'");
  }
}

async function fetchShopifyCollections() {
  try {
    const { data } = await shopifyClient.get("smart_collections.json");
    return data.smart_collections;
  } catch (error) {
    console.error("Error fetching Shopify collections:", error);
    throw new Error("failed to 'fetchShopifyCollections'");
  }
}

async function createWooCategory(payload) {
  try {
    const { data } = await wcClient.post("products/categories", payload);
    return data;
  } catch (error) {
    console.error("Error creating WooCommerce category:", error);
    throw new Error("failed to 'createWooCategory'");
  }
}

async function fetchShopifyCollectionProducts(collectionId) {
  try {
    const { data } = await shopifyClient.get(
      `collections/${collectionId}/products.json?limit=250&status=active`
    );
    return data.products;
  } catch (error) {
    console.error("Error fetching Shopify collection products:", error);
    throw new Error("failed to 'fetchShopifyCollectionProducts'");
  }
}

async function fetchWooProductBySlug(slug) {
  try {
    const { data } = await wcClient.get("products", { params: { slug } });
    if (data.length > 0) return data[0];
    return null;
  } catch (error) {
    console.error("Error fetching WooCommerce product by slug:", error);
    throw new Error("failed to 'fetchWooProductBySlug'");
  }
}

async function fetchWooCategoryBySlug(slug) {
  try {
    const { data } = await wcClient.get("products/categories", {
      params: { slug },
    });
    if (data.length > 0) return data[0];
    return null;
  } catch (error) {
    console.error("Error fetching WooCommerce category by slug:", error);
    throw new Error("failed to 'fetchWooCategoryBySlug'");
  }
}

async function createWooProduct(payload) {
  try {
    const { data } = await wcClient.post("products", payload);
    return data;
  } catch (error) {
    console.error("Error creating WooCommerce product:", error);
    throw new Error("failed to 'createWooProduct'");
  }
}

async function linkWooProductWithVariants(productId, payload) {
  try {
    const { data } = await wcClient.post(
      `products/${productId}/variations`,
      payload
    );
    return data;
  } catch (error) {
    console.error("Error linking WooCommerce product with variants:", error);
    throw new Error("failed to 'linkWooProductWithVariants'");
  }
}

async function updateWooProduct(productId, payload) {
  try {
    const { data } = await wcClient.put(`products/${productId}`, payload);
    return data;
  } catch (error) {
    console.error("Error updating WooCommerce product:", error.response);
    throw new Error("failed to 'updateWooProduct'");
  }
}

async function fetchWooProductsByCategoryId(category) {
  try {
    const { data } = await wcClient.get(`products`, { params: { category } });
    return data;
  } catch (error) {
    console.error("Error getting category:", error.response);
    throw new Error("failed to 'fetchWooCategoryById'");
  }
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

async function fetchShopifyCollectionProductsAndHeader(url) {
  const response = await axios.get(url, {
    headers: { "X-Shopify-Access-Token": access_token },
  });

  return response;
}

async function visualShopifyProducts() {
  const handledCollectionsIds = Object.keys(handledCollections);
  let total = 0;
  for (const collectionId of handledCollectionsIds) {
    let allProducts = [];
    let nextPageUrl = `${shopifyStore}/admin/api/2023-04/collections/${collectionId}/products.json?limit=250`;
    do {
      const response = await fetchShopifyCollectionProductsAndHeader(
        nextPageUrl
      );
      const activeProducts = response.data.products.filter(
        (prod) => prod.status === "active"
      );
      allProducts.push(...activeProducts);
      const linkHeader = response.headers["link"];
      nextPageUrl = getNextPageUrlFromHeader(linkHeader);
    } while (nextPageUrl);

    const count = allProducts.length;
    total += count;
    console.log(`Category ${handledCollections[collectionId]} => ${count}`);
    console.log("=========================================");
  }
  console.log("Total: ", total);
}

async function setDefaultVariantAndType(productHandle) {
  //* update the attributes type to dropdown

  const product = await fetchWooProductBySlug(productHandle);

  const default_attributes = product.attributes.map((attr) => ({
    name: attr.name,
    option: attr.options[0],
  }));

  let variationSwatchMeta = product.meta_data.find(
    (meta) => meta.key === "_bt_variation_swatch_type"
  );

  if (variationSwatchMeta) {
    variationSwatchMeta.value = newSwatchValue;
  } else {
    variationSwatchMeta = {
      key: "_bt_variation_swatch_type",
      value: newSwatchValue,
    };
  }

  const payload = {
    default_attributes,
    meta_data: [...product.meta_data, variationSwatchMeta],
  };
  await updateWooProduct(product.id, payload);
  console.log(
    `######## add default attribute and type of dropdown to the product ${product.name} #####`
  );
}

async function transferShopifyProductsToWoo() {
  const handledCollectionsIds = Object.keys(handledCollections);

  for (const collectionId of handledCollectionsIds) {
    let allProducts = [];
    let nextPageUrl = `${shopifyStore}/admin/api/2023-04/collections/${collectionId}/products.json?limit=250`;
    do {
      const response = await fetchShopifyCollectionProductsAndHeader(
        nextPageUrl
      );
      const activeProducts = response.data.products.filter(
        (prod) => prod.status === "active"
      );
      allProducts.push(...activeProducts);
      const linkHeader = response.headers["link"];
      nextPageUrl = getNextPageUrlFromHeader(linkHeader);
    } while (nextPageUrl);

    for (const product of allProducts) {
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
                  options: fringesOptions,
                },
              ],
            };
            await Promise.all([
              updateWooProduct(wooProduct.id, attributesPayload),
              createFringesVariants(wooProduct.id),
            ]);

            console.log(
              "================ This belongs to custom size, fringes variant has been added. ================"
            );
          }
          console.log(
            `${wooProduct.name} already saved on category: ${wooCategory.name}`
          );
          await setDefaultVariantAndType(wooProduct.slug);

          continue;
        }

        const payload = {
          categories: [
            ...wooProduct.categories,
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
                type: "dropdown",
                visible: true,
                variation: true,
                options: fringesOptions,
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
            options: fringesOptions,
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

      await setDefaultVariantAndType(product.handle);
    }

    console.log("##########################");
    console.log(
      `processing ${allProducts.length} products in category: ${handledCollections[collectionId]}.`
    );
    console.log("##########################");
  }
}

async function addColorsVariantToCustomSizeProducts() {
  const customSizeCategoryId = 574;
  const wooProducts = await fetchWooProductsByCategoryId(customSizeCategoryId);

  const products = wooProducts.slice(0, 3);

  await Promise.all(
    products.map((product) => {
      const attributes = [
        ...product.attributes,
        {
          name: "Color",
          visible: true,
          variation: true,
          options: colorsOptions,
        },
      ];

      return updateWooProduct(product.id, { attributes });
    })
  );

  console.log("Color attributes has been added");

  for (const product of products) {
    await Promise.all(
      colorsVariants.map((variant) => {
        const payload = {
          regular_price: "0.00",
          description: variant.option,
          attributes: [
            {
              name: "Color",
              option: variant.option,
            },
          ],
        };

        return linkWooProductWithVariants(product.id, payload);
      })
    );

    console.log("Color variant has been added to ", product.name, " product");
  }
}



async function transferShopifyCollectionsToWoo() {
  const shopifyCollections = await fetchShopifyCollections();

  for (const collection of shopifyCollections) {
    if (!collectionsSlug.includes(collection.handle)) {
      continue;
    }

    const payload = {
      name: collection.title,
      slug: collection.handle,
      description: collection.body_html,
    };

    if (Object.keys(collection).includes("image")) {
      payload.image = {
        src: collection.image.src,
        alt: collection.image.alt,
      };
    }

    const data = await createWooCategory(payload);

    console.log(data);
  }
}

(async () => {
  // await transferShopifyProductsToWoo();
})();