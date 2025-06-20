import { backendClient } from '@/sanity/lib/backendClient';
import { GroupedBasketItem, Metadata } from '@/actions/createCheckoutSession';

/**
 * Creates a new order in Sanity
 */
export async function createOrder({
  items,
  metadata,
  totalPrice,
  currency = 'gbp',
  amountDiscount = 0,
  status = 'pending',
}: {
  items: GroupedBasketItem[];
  metadata: Metadata;
  totalPrice: number;
  currency?: string;
  amountDiscount?: number;
  status?: string;
}) {
  try {
    const orderDate = new Date().toISOString();

    const order = {
      _type: 'order',
      orderNumber: metadata.orderNumber,
      customerName: metadata.customerName,
      email: metadata.customerEmail,
      products: items.map((item) => ({
        _type: 'orderItem',
        product: {
          _type: 'reference',
          _ref: item.product._id,
        },
        quantity: item.quantity,
      })),
      totalPrice,
      currency,
      amountDiscount,
      status,
      orderDate,
      // These will be updated by the webhook when payment is confirmed
      stripeCustomerId: '',
      stripePaymentIntentId: '',
    };

    const result = await backendClient.create(order);
    return result;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

/**
 * Updates an existing order in Sanity
 */
export async function updateOrder({
  orderNumber,
  updates,
}: {
  orderNumber: string;
  updates: Record<string, any>;
}) {
  try {
    // Find the order by orderNumber
    const existingOrder = await backendClient.fetch(
      `*[_type == "order" && orderNumber == $orderNumber][0]`,
      { orderNumber }
    );

    if (!existingOrder) {
      console.error(`Order with number ${orderNumber} not found`);
      return null;
    }

    // Update the order
    const updatedOrder = await backendClient
      .patch(existingOrder._id)
      .set(updates)
      .commit();

    console.log(`Order ${orderNumber} updated`);
    return updatedOrder;
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
}

/**
 * Gets an order by its order number
 */
export async function getOrderByNumber(orderNumber: string) {
  try {
    const order = await backendClient.fetch(
      `*[_type == "order" && orderNumber == $orderNumber][0]`,
      { orderNumber }
    );
    return order;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
}