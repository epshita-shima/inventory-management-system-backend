const OrderManagementModel = require("../salesmanagement/salesmanagementinfo.model");
const SalesManagementModel = require("../finishgoodsdeliveryinfo/finishgoodsdeliveryinfo.model");
const SalesReturnManagementModel = require("../deliveredreturninformation/deliveredreturninformation.model");
const mongoose = require("mongoose");

async function getFilteredForOrderReportInfoDB(
  fromDate,
  toDate,
  itemId,
  clientId,
  piId,
  reportStatus
) {
  console.log(
    "report db 2",
    fromDate,
    toDate,
    itemId,
    clientId,
    piId,
    reportStatus
  );
  try {
    const filter = {};
    if (fromDate) {
      filter.piDate = fromDate;
    }
    if (toDate) {
      filter.piDate = toDate;
    }
    if (fromDate && toDate) {
      filter.piDate = { $gte: fromDate, $lte: toDate };
    }

    if (clientId) {
      filter.customerID = clientId;
    }

    if (piId) {
      filter._id = piId;
    }

    if (Object.keys(filter).length === 0) {
      return [];
    }

    const data = await OrderManagementModel.find(filter).lean();
    if (itemId) {
      console.log("reportStatus", reportStatus);
      const filteredData = data.flatMap((detail) => {
        const matchedDetails = detail.detailsData.filter(
          (item) => item.itemId === itemId
        );

        if (matchedDetails.length > 0) {
          return [{ ...detail, detailsData: matchedDetails }];
        }
        return [];
      });
      console.log("filteredData detaiks", filteredData);
      return filteredData;
    } else {
      console.log("report orderdetailsreport data", data);
      return data;
    }
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching payment method info");
  }
}

async function getFilteredForOrderSummaryReportInfoDB(
  fromDate,
  toDate,
  itemId,
  clientId,
  piId,
  reportStatus
) {
  console.log(
    "report db 2",
    fromDate,
    toDate,
    itemId,
    clientId,
    piId,
    reportStatus
  );
  try {
    const filter = {};
    if (fromDate) {
      filter.piDate = fromDate;
    }
    if (toDate) {
      filter.piDate = toDate;
    }
    if (fromDate && toDate) {
      filter.piDate = { $gte: fromDate, $lte: toDate };
    }

    if (clientId) {
      filter.customerID = clientId;
    }

    if (piId) {
      filter._id = piId;
    }

    if (Object.keys(filter).length === 0) {
      return [];
    }

    const data = await OrderManagementModel.find(filter).lean();
    if (itemId) {
      console.log("reportStatus sumary", reportStatus);
      const filteredData = data.flatMap((detail) => {
        const matchedDetails = detail.detailsData.filter(
          (item) => item.itemId === itemId
        );

        if (matchedDetails.length > 0) {
          return [{ ...detail, detailsData: matchedDetails }];
        }
        return [];
      });

      const summaryData = filteredData.reduce((acc, detail) => {
        detail.detailsData.forEach((item) => {
          const itemDate = new Date(detail.piDate);
          const dateString = itemDate.toISOString().split("T")[0];
          const paymentType = detail.paymentId || "";
          if (!acc[dateString]) {
            acc[dateString] = {};
          }
      
          if (!acc[dateString][paymentType]) {
            acc[dateString][paymentType] = {
              grandQuantity: 0,
              grandTotal: 0,
            };
          }
      
          acc[dateString][paymentType].grandQuantity += item.quantity || 0;
          acc[dateString][paymentType].grandTotal += item.totalAmount || 0;
          acc[dateString].paymentType = detail.paymentId || "";
        });
        return acc;
      }, {});

      const resultSummaryData = Object.entries(summaryData).map(
        ([date, totals]) => ({
          date,
          paymentType: totals.paymentType,
          grandQuantity: totals.grandQuantity,
          grandAmount: totals.grandAmount,
          averageRate: totals.grandQuantity
            ? Math.round(totals.grandAmount / totals.grandQuantity)
            : 0,
        })
      );
      console.log("resultSummaryData", resultSummaryData);
      return resultSummaryData;
    } else {
      console.log("summary error find");
      return data;
    }
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching payment method info");
  }
}

async function getFilteredForSalesReportInfoDB(
  fromDate,
  toDate,
  itemId,
  clientId,
  piId,
  reportStatus
) {
  console.log(
    "report db 2",
    fromDate,
    toDate,
    itemId,
    clientId,
    piId,
    reportStatus
  );
  try {
    const filter = {};
    if (fromDate) {
      filter.finishGoodsDeliveryDate = fromDate;
    }
    if (toDate) {
      filter.finishGoodsDeliveryDate = toDate;
    }
    if (fromDate && toDate) {
      filter.finishGoodsDeliveryDate = { $gte: fromDate, $lte: toDate };
    }

    if (clientId) {
      filter.clientId = clientId;
    }

    if (piId) {
      filter.piId = piId;
    }

    if (Object.keys(filter).length === 0) {
      return [];
    }

    const data = await SalesManagementModel.find(filter).lean();
    if (itemId) {
      const filteredData = data.flatMap((detail) => {
        // Filter detailsData within each object based on itemId
        const matchedDetails = detail.detailsData.filter(
          (item) => item.itemId === itemId
        );

        if (matchedDetails.length > 0) {
          // Replace detailsData with matchedDetails
          return [{ ...detail, detailsData: matchedDetails }];
        }

        return [];
      });
      return filteredData;
    } else {
      console.log("report salesdetailsreport data", data);
      return data;
    }
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching payment method info");
  }
}
async function getFilteredForSalesSummaryReportInfoDB(
  fromDate,
  toDate,
  itemId,
  clientId,
  piId,
  reportStatus
) {
  try {
    const filter = {};
    if (fromDate) {
      filter.finishGoodsDeliveryDate = fromDate;
    }
    if (toDate) {
      filter.finishGoodsDeliveryDate = toDate;
    }
    if (fromDate && toDate) {
      filter.finishGoodsDeliveryDate = { $gte: new Date(fromDate), $lte:new Date(toDate) };
    }

    if (clientId) {
      filter.clientId = clientId;
    }

    if (piId) {
      filter.piId = piId;
    }

    if (Object.keys(filter).length === 0) {
      return [];
    }

    const data = await SalesManagementModel.find(filter).lean();
    const orderData = await OrderManagementModel.find().lean();

//     if (itemId) {
//     const getMatchingData = (data, orderData, targetItemId) => {
//   const result = [];

//   // Step 1: Filter `data` to get entries with matching `itemId` in `detailsData`
//   const filteredData = data.flatMap((order) =>
//     order.detailsData.filter((orderItem) => orderItem.itemId === targetItemId)
//   );

//   // Step 2: Check `filteredData` entries with `orderData`
//   filteredData.forEach((orderItem) => {
//     orderData.forEach((invoice) => {
//       invoice.detailsData.forEach((invoiceItem) => {
//         // Ensure both `_id`s are strings for accurate comparison
//         if (
//           orderItem.itemId === invoiceItem.itemId &&
//           String(orderItem.piDetailsId) === String(invoiceItem._id.$oid)
//         ) {
//           // Push the matching data fields to the result array
//           result.push({
//             itemId: invoiceItem.itemId,
//             unitPrice: invoiceItem.unitPrice,
//             deliverQty: orderItem.deliverQty,
//           });
//         }
//       });
//     });
//   });

//   return result;
// };

// // Sample usage
// const targetItemId = "6688dcac39abfa49f83113a3";  // Replace with the actual itemId you're looking for
// const matchedData = getMatchingData(data, orderData, targetItemId);
// console.log('Matched data:', matchedData);


//       // const matchedData = await OrderManagementModel.aggregate([
//       //   {
//       //     $lookup: {
//       //       from: "finishgoodsdeliveryinformations",
//       //       localField: "detailsData._id",
//       //       foreignField: "detailsData.piDetailsId",
//       //       as: "customerDetails",
//       //     },
//       //   },
//       // ]);

//       const filteredData = data.flatMap((detail) => {
//         const matchedDetails = detail.detailsData.filter(
//           (item) => item.itemId === itemId
//         );

//         // const filterWithInvoice= orderData
//         // matchedDetails.map((item)=>{
//         //   console.log('item',item)
//         // })
//         if (matchedDetails.length > 0) {
//           return [{ ...detail, detailsData: matchedDetails }];
//         }
//         return [];
//       });

//       const summaryData = filteredData.reduce((acc, detail) => {
//         detail.detailsData.forEach((item) => {
//           const itemDate = new Date(detail.piDate);
//           const dateString = itemDate.toISOString().split("T")[0];

//           if (!acc[dateString]) {
//             acc[dateString] = {
//               grandDeliverQuantity: 0,
//               grandAmount: 0,
//             };
//           }

//           acc[dateString].grandDeliverQuantity += item.deliverQty || 0;
//           acc[dateString].grandAmount += item.totalAmount || 0;
//           acc[dateString].paymentType = detail.paymentId || "";
//         });
//         return acc;
//       }, {});

//       const resultSummaryData = Object.entries(summaryData).map(
//         ([date, totals]) => ({
//           date,
//           paymentType: totals.paymentType,
//           grandQuantity: totals.grandQuantity,
//           grandAmount: totals.grandAmount,
//           averageRate: totals.grandQuantity
//             ? Math.round(totals.grandAmount / totals.grandQuantity)
//             : 0,
//         })
//       );

//       console.log("resultSummaryData", resultSummaryData);
//       return resultSummaryData;
//     } 
    if(itemId){
      const matchedData = await SalesManagementModel.aggregate([
        { $match: filter },
        {
          $unwind: "$detailsData", // Unwind detailsData to process each entry individually
        },
        {
          $match: { "detailsData.itemId":itemId } // Match specific itemId
        },
        {
          $lookup: {
            from: "invoiceinformations", // Replace with the actual collection name of OrderManagementModel
            let: { 
              piDetailsId: { $cond: {
                  if: { $eq: [{ $type: "$detailsData.piDetailsId" }, "string"] },
                  then: { $toObjectId: "$detailsData.piDetailsId" },  // Only convert if it's a string
                  else: "$detailsData.piDetailsId"  // Keep as is if it's already an ObjectId
              }},
              itemId: "$detailsData.itemId",
              deliverQuantity:"$detailsData.deliverQty",
              deliveryDate:"" 
            },
            pipeline: [
              { $unwind: "$detailsData" },
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$detailsData._id", "$$piDetailsId"] },
                      { $eq: ["$detailsData.itemId", "$$itemId"] }
                    ]
                  }
                }
              },
              {
                $project: {
                  unitPrice: "$detailsData.unitPrice",
                  itemId: "$detailsData.itemId",
                  deliverQty: "$$deliverQuantity"
                }
              }
            ],
            as: "matchedOrderData"
          }
        },
        
          // $project: {
          //   finishGoodsDeliveryDate: 1, 
          //   piId: 1, 
          //   clientId: 1, 
          //   doId: 1, 
          //   driverName: 1, 
          //   driverContactNo: 1,
          //   truckNo: 1,
          //   deliveryChallanNo: 1,
          //   totalDelivarQty: 1,
          //   approveStatus: 1,
          //   makeBy: 1,
          //   updateBy: 1,
          //   makeDate: 1,
          //   updateDate: 1,
          //   detailsData: 1, 
          //   matchedOrderData: 1 
          // }
        {
          $unwind: "$matchedOrderData" // Flatten matchedOrderData array
        },
        {
          $group: {
            _id: "$finishGoodsDeliveryDate",
            // paymentType: { $first: "$paymentId" },
            grandDeliverQuantity: { 
              $sum: { $toDouble: { $ifNull: ["$matchedOrderData.deliverQty", 0] } } // Convert deliverQty to number
            },
            grandAmount: { 
              $sum: { 
                $multiply: [
                  { $toDouble: { $ifNull: ["$matchedOrderData.unitPrice", 0] } }, // Convert unitPrice to number
                  { $toDouble: { $ifNull: ["$matchedOrderData.deliverQty", 0] } }   // Convert deliverQty to number
                ] 
              }
            }
            // avarageUnitPrice:{$divide :[ "grandAmount", "grandDeliverQuantity"]}
          }
        },
        // {
        //   $addFields: {
        //     averageRate: {
        //       $cond: {
        //         if: { $gt: ["$grandDeliverQuantity", 0] },
        //         then: { $round: [{ $divide: ["$grandAmount", "$grandDeliverQuantity"] }, 0] },
        //         else: 0
        //       }
        //     }
        //   }
        // },
        // {
        //   $project: {
        //     date: "$_id",
        //     paymentType: 1,
        //     grandQuantity: "$grandDeliverQuantity",
        //     grandAmount: 1,
        //     averageRate: 1
        //   }
        // }
     
      ]);
      console.log('matchedData',matchedData)
      // matchedData.forEach(data => {
      //   console.log("Matched Order Data (Full):", JSON.stringify(data, null, 2));
      // });
      // return matchedData;
      
    }
    
    else {
      console.log("summary error find");
      return data;
    }
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching payment method info");
  }
}
async function getFilteredForSalesReturnReportInfoDB(
  fromDate,
  toDate,
  itemId,
  clientId,
  piId,
  reportStatus
) {
  console.log(
    "report db 2",
    fromDate,
    toDate,
    itemId,
    clientId,
    piId,
    reportStatus
  );
  try {
    const filter = {};
    if (fromDate) {
      filter.returnDate = fromDate;
    }
    if (toDate) {
      filter.returnDate = toDate;
    }
    if (fromDate && toDate) {
      filter.returnDate = { $gte: fromDate, $lte: toDate };
    }

    if (clientId) {
      filter.clientId = clientId;
    }

    if (piId) {
      filter.piId = piId;
    }

    if (Object.keys(filter).length === 0) {
      return [];
    }
    const data = await SalesReturnManagementModel.find(filter).lean();
    if (itemId) {
      const filteredData = data.flatMap((detail) => {
        // Filter detailsData within each object based on itemId
        const matchedDetails = detail.detailsData.filter(
          (item) => item.itemId === itemId
        );

        if (matchedDetails.length > 0) {
          // Replace detailsData with matchedDetails
          return [{ ...detail, detailsData: matchedDetails }];
        }
        return [];
      });
      return filteredData;
    } else {
      console.log("report sales retun detailsreport data", data);
      return data;
    }
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching payment method info");
  }
}
module.exports = {
  getFilteredForOrderReportInfoDB,
  getFilteredForOrderSummaryReportInfoDB,
  getFilteredForSalesReportInfoDB,
  getFilteredForSalesSummaryReportInfoDB,
  getFilteredForSalesReturnReportInfoDB,
};
