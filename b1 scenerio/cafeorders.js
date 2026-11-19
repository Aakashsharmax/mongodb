db.orders.drop();

db.orders.insertMany([
  { _id: 1, customer: "Meena",   item: "Coffee",   qty: 2, price: 120, status: "delivered" },
  { _id: 2, customer: "Ravi",    item: "Sandwich", qty: 1, price: 180, status: "delivered" },
  { _id: 3, customer: "Meena",   item: "Sandwich", qty: 2, price: 180, status: "cancelled" },
  { _id: 4, customer: "Karthik", item: "Coffee",   qty: 3, price: 120, status: "delivered" },
  { _id: 5, customer: "Ravi",    item: "Coffee",   qty: 1, price: 120, status: "delivered" },
  { _id: 6, customer: "Meena",   item: "Cake",     qty: 1, price: 250, status: "delivered" },
  { _id: 7, customer: "Karthik", item: "Cake",     qty: 2, price: 250, status: "pending"   }
]);

print("--- Task 1: Count orders by status ---");
db.orders.aggregate([
  { $group: { _id: "$status", count: { $sum: 1 } } },
  { $sort: { count: -1 } }
]).toArray();

print("--- Task 2: Delivered orders (customer, item, qty) ---");
db.orders.aggregate([
  { $match: { status: "delivered" } },
  { $project: { _id: 0, customer: 1, item: 1, qty: 1 } }
]).toArray();

print("--- Task 3: Revenue per item ---");
db.orders.aggregate([
  { $match: { status: "delivered" } },
  {
    $group: {
      _id: "$item",
      totalQty: { $sum: "$qty" },
      revenue: { $sum: { $multiply: ["$qty", "$price"] } }
    }
  },
  { $sort: { revenue: -1 } }
]).toArray();

print("--- Task 4: Spend per customer ---");
db.orders.aggregate([
  { $match: { status: "delivered" } },
  {
    $group: {
      _id: "$customer",
      orders: { $sum: 1 },
      totalSpend: { $sum: { $multiply: ["$qty", "$price"] } }
    }
  },
  { $sort: { totalSpend: -1 } },
  { $project: { _id: 0, customer: "$_id", orders: 1, totalSpend: 1 } }
]).toArray();

print("--- Task 5: Best customer ---");
db.orders.aggregate([
  { $match: { status: "delivered" } },
  {
    $group: {
      _id: "$customer",
      orders: { $sum: 1 },
      totalSpend: { $sum: { $multiply: ["$qty", "$price"] } }
    }
  },
  { $sort: { totalSpend: -1 } },
  { $limit: 1 },
  { $project: { _id: 0, customer: "$_id", orders: 1, totalSpend: 1 } }
]).toArray();