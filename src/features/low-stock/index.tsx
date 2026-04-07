// "use client";

// import { AlertCircle, TrendingDown } from "lucide-react";
// import { Card } from "@/components/ui/card";

// interface LowStockProduct {
//   id: string;
//   name: string;
//   sku: string;
//   current_quantity: number;
//   reorder_level: number;
//   unit: string;
// }

// // Mock data
// const MOCK_LOW_STOCK_PRODUCTS: LowStockProduct[] = [
//   {
//     id: "1",
//     name: "Tomatoes",
//     sku: "TMAT001",
//     current_quantity: 10,
//     reorder_level: 50,
//     unit: "kg",
//   },
//   {
//     id: "3",
//     name: "Chicken Breast",
//     sku: "CHKB001",
//     current_quantity: 5,
//     reorder_level: 20,
//     unit: "kg",
//   },
//   {
//     id: "5",
//     name: "Olive Oil",
//     sku: "OILO001",
//     current_quantity: 3,
//     reorder_level: 10,
//     unit: "L",
//   },
// ];

// const LowStock = () => {
//   const criticalCount = MOCK_LOW_STOCK_PRODUCTS.filter(
//     (p) => p.current_quantity <= p.reorder_level * 0.25,
//   ).length;
//   const warningCount = MOCK_LOW_STOCK_PRODUCTS.filter(
//     (p) =>
//       p.current_quantity > p.reorder_level * 0.25 &&
//       p.current_quantity <= p.reorder_level,
//   ).length;

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold mb-2">Low Stock Alerts</h1>
//         <p className="text-muted-foreground">
//           Monitor products below reorder levels
//         </p>
//       </div>

//       {/* Alert Summary */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <Card className="p-6 border-red-900 bg-red-900/10">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-muted-foreground mb-1">Critical Stock</p>
//               <p className="text-3xl font-bold text-red-500">{criticalCount}</p>
//               <p className="text-sm text-muted-foreground mt-1">
//                 Below 25% of reorder level
//               </p>
//             </div>
//             <AlertCircle className="w-10 h-10 text-red-500 opacity-20" />
//           </div>
//         </Card>

//         <Card className="p-6 border-yellow-900 bg-yellow-900/10">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-muted-foreground mb-1">Low Stock</p>
//               <p className="text-3xl font-bold text-yellow-500">
//                 {warningCount}
//               </p>
//               <p className="text-sm text-muted-foreground mt-1">
//                 Below reorder level
//               </p>
//             </div>
//             <TrendingDown className="w-10 h-10 text-yellow-500 opacity-20" />
//           </div>
//         </Card>

//         <Card className="p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-muted-foreground mb-1">Total Items</p>
//               <p className="text-3xl font-bold">
//                 {MOCK_LOW_STOCK_PRODUCTS.length}
//               </p>
//               <p className="text-sm text-muted-foreground mt-1">
//                 Requiring attention
//               </p>
//             </div>
//             <AlertCircle className="w-10 h-10 text-primary opacity-20" />
//           </div>
//         </Card>
//       </div>

//       {/* Low Stock Products Table */}
//       <Card className="p-6">
//         <h3 className="text-xl font-semibold mb-4">
//           Products Requiring Reorder
//         </h3>
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-secondary">
//               <tr>
//                 <th className="px-6 py-3 text-left font-semibold">Product</th>
//                 <th className="px-6 py-3 text-left font-semibold">SKU</th>
//                 <th className="px-6 py-3 text-left font-semibold">
//                   Current Qty
//                 </th>
//                 <th className="px-6 py-3 text-left font-semibold">
//                   Reorder Level
//                 </th>
//                 <th className="px-6 py-3 text-left font-semibold">Unit</th>
//                 <th className="px-6 py-3 text-left font-semibold">Status</th>
//                 <th className="px-6 py-3 text-left font-semibold">Shortage</th>
//               </tr>
//             </thead>
//             <tbody>
//               {MOCK_LOW_STOCK_PRODUCTS.map((product) => {
//                 const shortage =
//                   product.reorder_level - product.current_quantity;
//                 const isCritical =
//                   product.current_quantity <= product.reorder_level * 0.25;
//                 const statusColor = isCritical
//                   ? "bg-red-900 text-red-200"
//                   : "bg-yellow-900 text-yellow-200";
//                 const statusLabel = isCritical ? "Critical" : "Low";

//                 return (
//                   <tr
//                     key={product.id}
//                     className="border-t border-border hover:bg-secondary/50"
//                   >
//                     <td className="px-6 py-4 font-medium">{product.name}</td>
//                     <td className="px-6 py-4">{product.sku}</td>
//                     <td className="px-6 py-4 font-semibold text-red-500">
//                       {product.current_quantity}
//                     </td>
//                     <td className="px-6 py-4">{product.reorder_level}</td>
//                     <td className="px-6 py-4">{product.unit}</td>
//                     <td className="px-6 py-4">
//                       <span
//                         className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}
//                       >
//                         {statusLabel}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 text-red-500 font-semibold">
//                       +{shortage} {product.unit}
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       </Card>

//       {/* Information Card */}
//       <Card className="p-6 bg-blue-900/10 border-blue-900">
//         <div className="flex gap-4">
//           <AlertCircle className="w-6 h-6 text-blue-500 mt-1" />
//           <div>
//             <h4 className="font-semibold mb-2">Reorder Instructions</h4>
//             <p className="text-sm text-muted-foreground">
//               Items listed above are below their reorder levels. Review
//               quantities and place orders with your suppliers to maintain
//               optimal inventory levels. Critical items (highlighted in red)
//               should be prioritized.
//             </p>
//           </div>
//         </div>
//       </Card>
//     </div>
//   );
// };

// export default LowStock;
