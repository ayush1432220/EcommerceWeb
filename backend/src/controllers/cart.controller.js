import { Cart } from "../models/Cart.js";
import { Product } from "../models/Product.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const productSelect =
  "name description price oldPrice stock emoji cat brand stars badge isActive";

const roundToCents = (value) => Math.round((Number(value) + Number.EPSILON) * 100) / 100;

const getOrCreateCart = async (userId) =>
  Cart.findOneAndUpdate(
    { userId },
    { $setOnInsert: { userId, items: [] } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

const populateCart = async (cart) =>
  cart.populate({
    path: "items.productId",
    select: productSelect
  });

const serializeCart = (cart) => {
  const items = cart.items.map((item) => {
    const product = item.productId && item.productId._id ? item.productId : null;
    const price = Number(item.price ?? product?.price ?? 0);
    const quantity = Number(item.quantity ?? 0);

    return {
      id: item._id,
      productId: product?._id ?? item.productId,
      quantity,
      price,
      lineTotal: roundToCents(price * quantity),
      availableStock: product?.stock ?? null,
      product: product
        ? {
            id: product._id,
            name: product.name,
            description: product.description,
            price: product.price,
            oldPrice: product.oldPrice,
            stock: product.stock,
            emoji: product.emoji,
            cat: product.cat,
            brand: product.brand,
            stars: product.stars,
            badge: product.badge,
            isActive: product.isActive
          }
        : null
    };
  });

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = roundToCents(items.reduce((sum, item) => sum + item.lineTotal, 0));

  return {
    id: cart._id,
    userId: cart.userId,
    items,
    itemCount,
    subtotal,
    createdAt: cart.createdAt,
    updatedAt: cart.updatedAt
  };
};

const getValidatedProduct = async (productId) => {
  const product = await Product.findById(productId);

  if (!product || !product.isActive) {
    throw new ApiError(404, "Product not found");
  }

  return product;
};

const findCartItemIndex = (cart, productId) =>
  cart.items.findIndex((item) => item.productId?.toString() === productId.toString());

export const getCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  await populateCart(cart);

  res.json({
    success: true,
    data: {
      cart: serializeCart(cart)
    }
  });
});

export const addCartItem = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const product = await getValidatedProduct(productId);
  const cart = await getOrCreateCart(req.user._id);
  const existingIndex = findCartItemIndex(cart, product._id);
  const currentQuantity = existingIndex >= 0 ? cart.items[existingIndex].quantity : 0;
  const nextQuantity = currentQuantity + quantity;

  if (nextQuantity > product.stock) {
    throw new ApiError(
      400,
      `Only ${product.stock} unit${product.stock === 1 ? "" : "s"} available in stock`
    );
  }

  if (existingIndex >= 0) {
    cart.items[existingIndex].quantity = nextQuantity;
    if (cart.items[existingIndex].price == null) {
      cart.items[existingIndex].price = product.price;
    }
  } else {
    cart.items.push({
      productId: product._id,
      quantity,
      price: product.price
    });
  }

  await cart.save();
  await populateCart(cart);

  res.status(200).json({
    success: true,
    message: "Item added to cart",
    data: {
      cart: serializeCart(cart)
    }
  });
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const product = await getValidatedProduct(productId);
  const cart = await getOrCreateCart(req.user._id);
  const existingIndex = findCartItemIndex(cart, product._id);

  if (existingIndex < 0) {
    throw new ApiError(404, "Cart item not found");
  }

  if (quantity > product.stock) {
    throw new ApiError(
      400,
      `Only ${product.stock} unit${product.stock === 1 ? "" : "s"} available in stock`
    );
  }

  cart.items[existingIndex].quantity = quantity;
  if (cart.items[existingIndex].price == null) {
    cart.items[existingIndex].price = product.price;
  }

  await cart.save();
  await populateCart(cart);

  res.json({
    success: true,
    message: "Cart item updated",
    data: {
      cart: serializeCart(cart)
    }
  });
});

export const removeCartItem = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  const productId = req.params.id;
  const existingIndex = findCartItemIndex(cart, productId);

  if (existingIndex < 0) {
    throw new ApiError(404, "Cart item not found");
  }

  cart.items.splice(existingIndex, 1);
  await cart.save();
  await populateCart(cart);

  res.json({
    success: true,
    message: "Cart item removed",
    data: {
      cart: serializeCart(cart)
    }
  });
});

export const clearCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  cart.items = [];
  await cart.save();
  await populateCart(cart);

  res.json({
    success: true,
    message: "Cart cleared",
    data: {
      cart: serializeCart(cart)
    }
  });
});
