const crypto = require("crypto");

const prisma = require("../../config/prisma");

const generateTransactionId = () => {
  return `DEMO-${Date.now()}-${crypto
    .randomBytes(4)
    .toString("hex")
    .toUpperCase()}`;
};

const processDemoPayment = async (buyerId, orderId, outcome) => {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findFirst({
      where: {
        id: orderId,
        buyerId,
      },
      include: {
        items: true,
        payment: true,
      },
    });

    if (!order) {
      const error = new Error("Order not found");
      error.statusCode = 404;
      throw error;
    }

    /*
     * Payment is idempotent.
     *
     * If the order has already been successfully paid,
     * do not reduce inventory again.
     */
    if (
      order.paymentStatus === "SUCCESS" &&
      order.status === "CONFIRMED" &&
      order.payment
    ) {
      return order.payment;
    }

    if (order.status !== "PENDING_PAYMENT") {
      const error = new Error(
        "This order is no longer awaiting payment"
      );
      error.statusCode = 409;
      throw error;
    }

    const transactionId = generateTransactionId();

    /*
     * Failed and cancelled demo payments do not touch inventory.
     */
    if (outcome === "FAILED" || outcome === "CANCELLED") {
      const payment = order.payment
        ? await tx.payment.update({
            where: {
              orderId: order.id,
            },
            data: {
              amount: order.total,
              status: outcome,
              transactionId,
            },
          })
        : await tx.payment.create({
            data: {
              orderId: order.id,
              amount: order.total,
              status: outcome,
              transactionId,
            },
          });

      await tx.order.update({
        where: {
          id: order.id,
        },
        data: {
          status: outcome,
          paymentStatus: outcome,
        },
      });

      return payment;
    }

    /*
     * SUCCESS
     *
     * Inventory is reduced inside the same database transaction.
     */
    for (const item of order.items) {
      const inventoryUpdate = await tx.product.updateMany({
        where: {
          id: item.productId,
          quantity: {
            gte: item.quantity,
          },
        },
        data: {
          quantity: {
            decrement: item.quantity,
          },
        },
      });

      if (inventoryUpdate.count !== 1) {
        const error = new Error(
          `Insufficient inventory for product "${item.productName}"`
        );
        error.statusCode = 409;
        throw error;
      }
    }

    const payment = order.payment
      ? await tx.payment.update({
          where: {
            orderId: order.id,
          },
          data: {
            amount: order.total,
            status: "SUCCESS",
            transactionId,
          },
        })
      : await tx.payment.create({
          data: {
            orderId: order.id,
            amount: order.total,
            status: "SUCCESS",
            transactionId,
          },
        });

    await tx.order.update({
      where: {
        id: order.id,
      },
      data: {
        status: "CONFIRMED",
        paymentStatus: "SUCCESS",
      },
    });

    return payment;
  });
};

const getBuyerPaymentByOrderId = async (buyerId, orderId) => {
  const payment = await prisma.payment.findFirst({
    where: {
      orderId,
      order: {
        buyerId,
      },
    },
    include: {
      order: {
        select: {
          id: true,
          status: true,
          paymentStatus: true,
          total: true,
          createdAt: true,
        },
      },
    },
  });

  if (!payment) {
    const error = new Error("Payment not found");
    error.statusCode = 404;
    throw error;
  }

  return payment;
};

module.exports = {
  processDemoPayment,
  getBuyerPaymentByOrderId,
};