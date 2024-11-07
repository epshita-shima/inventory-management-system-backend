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

    console.log("reportStatus sumary", reportStatus);
    if (itemId) {
      const filteredData = data.flatMap((detail) => {
        const matchedDetails = detail.detailsData.filter(
          (item) => item.itemId === itemId
        );

        if (matchedDetails.length > 0) {
          return [{ ...detail, detailsData: matchedDetails }];
        }
      });
      const summaryData = filteredData.reduce((acc, detail) => {
        detail.detailsData.forEach((item) => {
          const itemDate = new Date(detail.piDate);
          const dateString = itemDate.toISOString().split("T")[0];
          const paymentId = detail.paymentId || "";
          if (!acc[dateString]) {
            acc[dateString] = {};
          }

          if (!acc[dateString][paymentId]) {
            acc[dateString][paymentId] = {
              grandQuantity: 0,
              grandTotal: 0,
            };
          }

          acc[dateString][paymentId].grandQuantity += item.quantity
            ? Number(item.quantity)
            : 0;
          acc[dateString][paymentId].grandTotal += item.totalAmount
            ? Number(item.totalAmount)
            : 0;
          acc[dateString].paymentId = detail.paymentId || "";
        });
        return acc;
      }, {});
      console.log("summaryData", summaryData);
      const resultSummaryData = Object.entries(summaryData).flatMap(
        ([date, paymentTypes]) =>
          Object.entries(paymentTypes)
            .filter(
              ([paymentId]) => paymentId && paymentId !== "paymentId"
            ) // Exclude invalid paymentTypes
            .map(([paymentId, { grandQuantity, grandTotal }]) => {
              const averageRate =
                grandQuantity > 0 ? grandTotal / grandQuantity : 0;

              return {
                date,
                paymentId,
                grandQuantity: grandQuantity || 0,
                grandAmount: grandTotal || 0,
                averageRate,
              };
            })
      );
      console.log('resultSummaryData',resultSummaryData)
      return resultSummaryData;
    } else {
      const filteredData = data.flatMap((detail) => {
        const matchedDetails = detail.detailsData.filter(
          (item) => item.itemId === itemId
        );

        if (matchedDetails.length > 0) {
          return [{ ...detail, detailsData: matchedDetails }];
        }
        const groupedDetails = detail.detailsData.reduce((acc, item) => {
          const key = `${detail.piDate}`;

          if (!acc[key]) {
            acc[key] = {
              piDate: detail.piDate,
              paymentId: detail.paymentId,
              detailsData: [],
            };
          }

          acc[key].detailsData.push(item);

          return acc;
        }, {});

        // Convert the grouped details into an array
        const groupedArray = Object.values(groupedDetails);

        const totalDeliverQtyByPaymentId = groupedArray.reduce((acc, group) => {
          const { paymentId, detailsData } = group;

          // Sum deliverQty for the current group
          const totalQty = detailsData.reduce(
            (sum, item) => sum + item.quantity,
            0
          );
          const totalAmount = detailsData.reduce(
            (sum, item) => sum + item.totalAmount,
            0
          );
          const averageRate = Math.round(totalAmount / totalQty);
          // Add the result to the accumulator by paymentId
          const existingEntry = acc.find(
            (entry) => entry.paymentId === paymentId
          );

          if (existingEntry) {
            // If it exists, add the values to the existing totals
            existingEntry.grandQuantity += totalQty;
            existingEntry.grandAmount += totalAmount;
          } else {
            // If it doesn't exist, create a new entry for this paymentId
            acc.push({
              date: group.piDate,
              paymentId: group.paymentId,
              grandQuantity: totalQty,
              grandAmount: totalAmount,
              averageRate,
            });
          }

          return acc;
        }, []);

        return totalDeliverQtyByPaymentId;
      });
      return filteredData;
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
      filter.finishGoodsDeliveryDate = {
        $gte: new Date(fromDate),
        $lte: new Date(toDate),
      };
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
    if (itemId) {
      const matchedData = await SalesManagementModel.aggregate([
        { $match: filter },
        {
          $unwind: "$detailsData", // Unwind detailsData to process each entry individually
        },
        {
          $match: { "detailsData.itemId": itemId }, // Match specific itemId
        },
        {
          $lookup: {
            from: "invoiceinformations", // Replace with the actual collection name of OrderManagementModel
            let: {
              piDetailsId: {
                $cond: {
                  if: {
                    $eq: [{ $type: "$detailsData.piDetailsId" }, "string"],
                  },
                  then: { $toObjectId: "$detailsData.piDetailsId" }, // Only convert if it's a string
                  else: "$detailsData.piDetailsId", // Keep as is if it's already an ObjectId
                },
              },
              itemId: "$detailsData.itemId",
              deliverQuantity: "$detailsData.deliverQty",
            },
            pipeline: [
              { $unwind: "$detailsData" },
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$detailsData._id", "$$piDetailsId"] },
                      { $eq: ["$detailsData.itemId", "$$itemId"] },
                    ],
                  },
                },
              },
              {
                $project: {
                  unitPrice: "$detailsData.unitPrice",
                  itemId: "$detailsData.itemId",
                  deliverQty: "$$deliverQuantity",
                  paymentId: 1,
                },
              },
            ],
            as: "matchedOrderData",
          },
        },

        {
          $unwind: "$matchedOrderData",
        },
        {
          $project: {
            matchedOrderData: 1, // Include matchedOrderData for logging
            // other fields...
          },
        },
        // {
        //   $group: {
        //     _id: {
        //       finishGoodsDeliveryDate: "$finishGoodsDeliveryDate",
        //       paymentType: "$matchedOrderData.paymentType" // Include paymentType in _id for grouping
        //     },
        //     grandDeliverQuantity: {
        //       $sum: {
        //         $toDouble: { $ifNull: ["$matchedOrderData.deliverQty", 0] },
        //       },
        //     },
        //     grandAmount: {
        //       $sum: {
        //         $multiply: [
        //           {
        //             $toDouble: { $ifNull: ["$matchedOrderData.unitPrice", 0] },
        //           },
        //           {
        //             $toDouble: { $ifNull: ["$matchedOrderData.deliverQty", 0] },
        //           },
        //         ],
        //       },
        //     },
        //     // avarageUnitPrice:{$divide :[ "grandAmount", "grandDeliverQuantity"]}
        //   },
        // },
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
      console.log("matchedData", matchedData);
      // matchedData.forEach(data => {
      //   console.log("Matched Order Data (Full):", JSON.stringify(data.matchedOrderData, null, 2));
      // });
      return matchedData;
    } else {
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
