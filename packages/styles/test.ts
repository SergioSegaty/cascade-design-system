type Order = {
  amount: number;
};

type Result = {
  totalRevenue: number;
  orderCount: number;
  largestOrder: Order | null;
};

function analyzeOrders(orders: Order[]): Result {
  let totalRevenue = 0;
  let orderCount = 0;
  let largestOrder: Order | null = null;

  for (let i = 0; i < orders.length; i++) {
    totalRevenue += orders[i].amount;
    orderCount += 1;
    if (!largestOrder || orders[i].amount > largestOrder.amount) {
      largestOrder = orders[i];
    }
  }

  return { totalRevenue, orderCount, largestOrder };
}

function analyzeOrdersF(orders: Order[]): Result {
  return orders.reduce(
    (sum: Result, order) => {
      const updateLargestOrder =
        sum.largestOrder && sum.largestOrder.amount > order.amount ? sum.largestOrder : order;

      return {
        totalRevenue: sum.totalRevenue + order.amount,
        orderCount: sum.orderCount++,
        largestOrder: updateLargestOrder,
      };
    },
    {
      totalRevenue: 0,
      orderCount: 0,
      largestOrder: null,
    },
  );
}
