import  { wcClient } from "./index.js";
export async function createWooCategory(payload) {
  try {
    const { data } = await wcClient.post("products/categories", payload);
    return data;
  } catch (error) {
    console.error("Error creating WooCommerce category:", error);
    throw new Error("failed to 'createWooCategory'");
  }
}

export async function fetchWooProductBySlug(slug) {
  try {
    const { data } = await wcClient.get("products", { params: { slug } });
    if (data.length > 0) return data[0];
    return null;
  } catch (error) {
    console.error("Error fetching WooCommerce product by slug:", error);
    throw new Error("failed to 'fetchWooProductBySlug'");
  }
}

export async function fetchWooCategoryBySlug(slug) {
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

export async function createWooProduct(payload) {
  try {
    const { data } = await wcClient.post("products", payload);
    return data;
  } catch (error) {
    console.error("Error creating WooCommerce product:", error);
    throw new Error("failed to 'createWooProduct'");
  }
}

export async function linkWooProductWithVariants(productId, payload) {
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

export async function updateWooProduct(productId, payload) {
  try {
    const { data } = await wcClient.put(`products/${productId}`, payload);
    return data;
  } catch (error) {
    console.error("Error updating WooCommerce product:", error.response);
    throw new Error("failed to 'updateWooProduct'");
  }
}

export async function fetchWooProductsByCategoryId(
  category,
  per_page = 5,
  offset = 0
) {
  try {
    const { data } = await wcClient.get(`products`, {
      params: { category, per_page, offset },
    });
    return data;
  } catch (error) {
    console.error("Error getting category:", error.response);
    throw new Error("failed to 'fetchWooCategoryById'");
  }
}

export async function fetchWooProductVariantById(variantId, productId) {
  const { data } = await wcClient.get(
    `products/${productId}/variations/${variantId}`
  );

  return data;
}

export async function updateWooProductVariantById(variantId, productId, payload) {
  const { data } = await wcClient.post(
    `products/${productId}/variations/${variantId}`,
    payload
  );

  return data;
}

export async function updateWooProductVariant(productId, variantId) {
  const { data } = await wcClient.post("", payload);

  return data;
}

export async function fetchProductById(id) {
  const { data } = await wcClient.get(`products/${id}`);

  return data;
}

export async function fetchProducts(offset, per_page = 100) {
  const { data } = await wcClient("products", { params: { per_page, offset } });

  return data;
}

export async function fetchProductsWithResponse(page) {
  const response = await wcClient("products", {
    params: { per_page: 100, page },
  });

  return response;
}