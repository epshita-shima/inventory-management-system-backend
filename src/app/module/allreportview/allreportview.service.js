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
      //   const filteredData = data.flatMap((detail) => {
      //     const matchedDetails = detail.detailsData.filter(
      //       (item) => item.itemId === itemId
      //     );

      //     if (matchedDetails.length > 0) {
      //       return [{ ...detail, detailsData: matchedDetails }];
      //     }
      //   });
      //   const summaryData = filteredData.reduce((acc, detail) => {
      //     detail.detailsData.forEach((item) => {
      //       const itemDate = new Date(detail.piDate);
      //       const dateString = itemDate.toISOString().split("T")[0];
      //       const paymentId = detail.paymentId || "";
      //       if (!acc[dateString]) {
      //         acc[dateString] = {};
      //       }

      //       if (!acc[dateString][paymentId]) {
      //         acc[dateString][paymentId] = {
      //           grandQuantity: 0,
      //           grandTotal: 0,
      //         };
      //       }

      //       acc[dateString][paymentId].grandQuantity += item.quantity
      //         ? Number(item.quantity)
      //         : 0;
      //       acc[dateString][paymentId].grandTotal += item.totalAmount
      //         ? Number(item.totalAmount)
      //         : 0;
      //       acc[dateString].paymentId = detail.paymentId || "";
      //     });
      //     return acc;
      //   }, {});
      //   console.log("summaryData", summaryData);
      //   const resultSummaryData = Object.entries(summaryData).flatMap(
      //     ([date, paymentTypes]) =>
      //       Object.entries(paymentTypes)
      //         .filter(([paymentId]) => paymentId && paymentId !== "paymentId") // Exclude invalid paymentTypes
      //         .map(([paymentId, { grandQuantity, grandTotal }]) => {
      //           const averageRate =
      //             grandQuantity > 0 ? grandTotal / grandQuantity : 0;

      //           return {
      //             date,
      //             paymentId,
      //             grandQuantity: grandQuantity || 0,
      //             grandAmount: grandTotal || 0,
      //             averageRate,
      //           };
      //         })
      //   );
      //   console.log("resultSummaryData", resultSummaryData);
      //   return resultSummaryData;
      // } else {
      //   const filteredData = data.flatMap((detail) => {
      //     const matchedDetails = detail.detailsData.filter(
      //       (item) => item.itemId === itemId
      //     );

      //     if (matchedDetails.length > 0) {
      //       return [{ ...detail, detailsData: matchedDetails }];
      //     }
      //     const groupedDetails = detail.detailsData.reduce((acc, item) => {
      //       const key = `${detail.piDate}`;

      //       if (!acc[key]) {
      //         acc[key] = {
      //           piDate: detail.piDate,
      //           paymentId: detail.paymentId,
      //           detailsData: [],
      //         };
      //       }

      //       acc[key].detailsData.push(item);

      //       return acc;
      //     }, {});

      //     // Convert the grouped details into an array
      //     const groupedArray = Object.values(groupedDetails);

      //     const totalDeliverQtyByPaymentId = groupedArray.reduce((acc, group) => {
      //       const { paymentId, detailsData } = group;

      //       // Sum deliverQty for the current group
      //       const totalQty = detailsData.reduce(
      //         (sum, item) => sum + item.quantity,
      //         0
      //       );
      //       const totalAmount = detailsData.reduce(
      //         (sum, item) => sum + item.totalAmount,
      //         0
      //       );
      //       const averageRate = Math.round(totalAmount / totalQty);
      //       // Add the result to the accumulator by paymentId
      //       const existingEntry = acc.find(
      //         (entry) => entry.paymentId === paymentId
      //       );

      //       if (existingEntry) {
      //         // If it exists, add the values to the existing totals
      //         existingEntry.grandQuantity += totalQty;
      //         existingEntry.grandAmount += totalAmount;
      //       } else {
      //         // If it doesn't exist, create a new entry for this paymentId
      //         acc.push({
      //           date: group.piDate,
      //           paymentId: group.paymentId,
      //           grandQuantity: totalQty,
      //           grandAmount: totalAmount,
      //           averageRate,
      //         });
      //       }

      //       return acc;
      //     }, []);

      //     return totalDeliverQtyByPaymentId;
      //   });
      //   return filteredData;

      const summaryData = await OrderManagementModel.aggregate([
        // Step 1: Match documents based on the provided filter if necessary
        {
          $match: {
            /* Add any initial filters here */
          },
        },

        // Step 2: Filter detailsData based on itemId if provided
        {
          $project: {
            piDate: 1,
            paymentId: 1,
            detailsData: {
              $cond: {
                if: itemId, // Only filter if itemId is provided
                then: {
                  $filter: {
                    input: "$detailsData",
                    as: "item",
                    cond: { $eq: ["$$item.itemId", itemId] },
                  },
                },
                else: "$detailsData", // Keep all detailsData if itemId is not provided
              },
            },
          },
        },

        // Step 3: Only keep documents with non-empty detailsData
        { $match: { "detailsData.0": { $exists: true } } },

        // Step 4: Unwind detailsData to handle each item individually
        { $unwind: "$detailsData" },

        // Step 5: Group by piDate and paymentId to accumulate quantities and totals
        {
          $group: {
            _id: {
              dateString: {
                $dateToString: { format: "%Y-%m-%d", date: "$piDate" },
              },
              paymentId: "$paymentId",
            },
            grandQuantity: { $sum: { $ifNull: ["$detailsData.quantity", 0] } },
            grandTotal: { $sum: { $ifNull: ["$detailsData.totalAmount", 0] } },
          },
        },

        // Step 6: Calculate the average rate and format the output
        {
          $project: {
            date: "$_id.dateString",
            paymentId: "$_id.paymentId",
            grandQuantity: 1,
            grandAmount: "$grandTotal",
            averageRate: {
              $cond: {
                if: { $gt: ["$grandQuantity", 0] },
                then: { $divide: ["$grandTotal", "$grandQuantity"] },
                else: 0,
              },
            },
          },
        },
      ]);
      console.log("summaryData", summaryData);
      return summaryData;
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
    const matchConditions = [];

    if (itemId) {
      matchConditions.push({ "detailsData.itemId": itemId });
    }

    if (clientId) {
      matchConditions.push({ clientId: clientId });
    }

    if (piId) {
      matchConditions.push({ piId: piId });
    }

    if (fromDate && toDate) {
      matchConditions.push({
        finishGoodsDeliveryDate: {
          $gte: new Date(fromDate),
          $lte: new Date(toDate),
        },
      });
    }
    const matchedData = await SalesManagementModel.aggregate([
      { $match: filter },
      {
        $unwind: "$detailsData",
      },

      {
        $match: {
          $and: matchConditions,
        },
      },
      {
        $lookup: {
          from: "invoiceinformations",
          let: {
            piDetailsId: {
              $cond: {
                if: {
                  $eq: [{ $type: "$detailsData.piDetailsId" }, "string"],
                },
                then: { $toObjectId: "$detailsData.piDetailsId" },
                else: "$detailsData.piDetailsId",
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
                finishGoodsDeliveryDate: "$finishGoodsDeliveryDate",
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
          matchedOrderData: 1,
          finishGoodsDeliveryDate: 1,
        },
      },
      {
        $project: {
          itemId: "$matchedOrderData.itemId",
          paymentId: "$matchedOrderData.paymentId",
          deliverQty: { $toInt: "$matchedOrderData.deliverQty" }, // Convert deliverQty to an integer if it's a string
          unitPrice: "$matchedOrderData.unitPrice",
          finishGoodsDeliveryDate: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$finishGoodsDeliveryDate",
            }, // Format date as YYYY-MM-DD
          },
        },
      },
      // Step 2: Group by itemId, paymentId, and finishGoodsDeliveryDate
      {
        $group: {
          _id: {
            itemId: "$itemId",
            paymentId: "$paymentId",
            finishGoodsDeliveryDate: "$finishGoodsDeliveryDate",
          },
          totalDeliverQty: { $sum: "$deliverQty" }, // Sum of deliverQty
          unitPrice: { $first: "$unitPrice" }, // Keep unit price, assuming it's the same for grouped items
        },
      },

      // Step 3: Project the output fields
      {
        $project: {
          _id: 0,
          itemId: "$_id.itemId",
          paymentId: "$_id.paymentId",
          date: "$_id.finishGoodsDeliveryDate",
          totalDeliverQty: 1,
          unitPrice: 1,
          totalAmount: { $multiply: ["$totalDeliverQty", "$unitPrice"] }, // Calculate total amount
        },
      },
    ]);
    console.log("matchedData", matchedData);

    return matchedData;
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

    // if (clientId) {
    //   filter.clientId = clientId;
    // }

    // if (piId) {
    //   filter.piId = piId;
    // }

    if (Object.keys(filter).length === 0) {
      return [];
    }
    if (fromDate && toDate && itemId && clientId && piId) {
      const data = await SalesReturnManagementModel.find(filter).lean();
      const groupedData = {};

      for (const item of data) {
        for (const detail of item.detailsData) {
          // Parse returnQty and filter by itemId, clientId, and piId if provided
          const returnQty = parseInt(detail.returnQty, 10);
          if (
            !isNaN(returnQty) &&
            (!itemId || detail.itemId === itemId) &&
            (!clientId || item.clientId === clientId) &&
            (!piId || item.piId === piId)
          ) {
            // Create a unique key based on returnDate, itemId, clientId, and piId
            const dateKey = new Date(item.returnDate)
              .toISOString()
              .split("T")[0];
            const key = `${dateKey}-${detail.itemId}-${item.clientId}-${item.piId}`;

            // Fetch unitPrice from invoiceinformations collection
            const invoiceInfo = await OrderManagementModel.findOne(
              {
                _id: item.piId,
                "detailsData.itemId": detail.itemId,
              },
              { "detailsData.$": 1 }
            ).lean();

            // Extract unitPrice if it exists
            const unitPrice = invoiceInfo?.detailsData?.[0]?.unitPrice || 0;

            // Initialize the entry if it doesn't exist
            if (!groupedData[key]) {
              groupedData[key] = {
                returnDate: dateKey,
                itemId: detail.itemId,
                clientId: item.clientId,
                piId: item.piId,
                totalReturnQty: 0,
                totalReturnAmount: 0,
                unitPrice: unitPrice, // Store unitPrice for reference
              };
            }

            // Accumulate total return quantity and amount for each unique date, item, client, and piId combination
            groupedData[key].totalReturnQty += returnQty;
            groupedData[key].totalReturnAmount += returnQty * unitPrice;
          }
        }
      }

      // Convert the grouped data to an array format
      const groupedArray = Object.values(groupedData);
      console.log(
        "Grouped data by date, item, client, and piId:",
        groupedArray
      );

      // Return the grouped array as the final result
      return groupedArray;
    } else if (fromDate && toDate && itemId && clientId) {
      const data = await SalesReturnManagementModel.find(filter).lean();
      const groupedData = {};

      for (const item of data) {
        for (const detail of item.detailsData) {
          // Parse returnQty and filter by itemId and clientId if provided
          const returnQty = parseInt(detail.returnQty, 10);
          if (
            !isNaN(returnQty) &&
            (!itemId || detail.itemId === itemId) &&
            (!clientId || item.clientId === clientId)
          ) {
            // Create a unique key based on returnDate, itemId, and clientId
            const dateKey = new Date(item.returnDate)
              .toISOString()
              .split("T")[0];
            const key = `${dateKey}-${detail.itemId}-${item.clientId}`;

            // Fetch unitPrice from invoiceinformations collection
            const invoiceInfo = await OrderManagementModel.findOne(
              {
                _id: item.piId,
                "detailsData.itemId": detail.itemId,
              },
              { "detailsData.$": 1 }
            ).lean();

            // Extract unitPrice if it exists
            const unitPrice = invoiceInfo?.detailsData?.[0]?.unitPrice || 0;

            // Initialize the entry if it doesn't exist
            if (!groupedData[key]) {
              groupedData[key] = {
                returnDate: dateKey,
                itemId: detail.itemId,
                clientId: item.clientId,
                totalReturnQty: 0,
                totalReturnAmount: 0,
                unitPrice: unitPrice, // Store unitPrice for reference
              };
            }

            // Accumulate total return quantity and amount for each unique date, item, and client combination
            groupedData[key].totalReturnQty += returnQty;
            groupedData[key].totalReturnAmount += returnQty * unitPrice;
          }
        }
      }

      // Convert the grouped data to an array format
      const groupedArray = Object.values(groupedData);
      return groupedArray;
    } else if (fromDate && toDate && itemId) {
      // Fetch data from SalesReturnManagementModel with applied date and itemId filters
      const data = await SalesReturnManagementModel.find(filter).lean();
      const groupedData = {};

      for (const item of data) {
        for (const detail of item.detailsData) {
          // Parse returnQty and check if it should be included based on the itemId parameter
          const returnQty = parseInt(detail.returnQty, 10);
          if (!isNaN(returnQty) && (!itemId || detail.itemId === itemId)) {
            // Construct a key based on both returnDate and itemId
            const dateKey = new Date(item.returnDate)
              .toISOString()
              .split("T")[0];
            const key = `${dateKey}-${detail.itemId}`;

            // Fetch unitPrice from invoiceinformations collection
            const invoiceInfo = await OrderManagementModel.findOne(
              {
                _id: item.piId,
                "detailsData.itemId": detail.itemId,
              },
              { "detailsData.$": 1 }
            ).lean();

            // Extract unitPrice if it exists
            const unitPrice = invoiceInfo?.detailsData?.[0]?.unitPrice || 0;

            // Initialize the entry if it doesn't exist
            if (!groupedData[key]) {
              groupedData[key] = {
                returnDate: dateKey,
                itemId: detail.itemId,
                totalReturnQty: 0,
                totalReturnAmount: 0,
                unitPrice: unitPrice, // Store unitPrice for reference
              };
            }

            // Accumulate total return quantity and amount for each date and item
            groupedData[key].totalReturnQty += returnQty;
            groupedData[key].totalReturnAmount += returnQty * unitPrice;
          }
        }
      }

      // Convert the grouped data to an array format
      const groupedArray = Object.values(groupedData);
      console.log("Grouped data by date and item:", groupedArray);

      // Return the grouped array as the final result
      return groupedArray;
    } else if (fromDate && toDate) {
      const data = await SalesReturnManagementModel.find(filter).lean();
      const groupedData = {};

      for (const item of data) {
        for (const detail of item.detailsData) {
          const returnQty = parseInt(detail.returnQty, 10);
          const dateKey = new Date(item.returnDate).toISOString().split("T")[0];
          const invoiceInfo = await OrderManagementModel.findOne(
            {
              _id: item.piId,
              "detailsData.itemId": detail.itemId,
            },
            { "detailsData.$": 1 }
          ).lean();
          const unitPrice = invoiceInfo?.detailsData?.[0]?.unitPrice || 0;

          if (!groupedData[dateKey]) {
            groupedData[dateKey] = {
              returnDate: dateKey,
              totalReturnQty: 0,
              totalReturnAmount: 0,
            };
          }

          // Accumulate total return quantity and amount
          groupedData[dateKey].totalReturnQty += returnQty;
          groupedData[dateKey].totalReturnAmount += returnQty * unitPrice;
        }
      }

      // Convert grouped data to an array
      const groupedArray = Object.values(groupedData);
      return groupedArray;
    } else {
      return [];
    }
    // if (itemId) {
    //   const filteredData = data.flatMap((detail) => {
    //     // Filter detailsData within each object based on itemId
    //     const matchedDetails = detail.detailsData.filter(
    //       (item) => item.itemId === itemId
    //     );

    //     if (matchedDetails.length > 0) {
    //       // Replace detailsData with matchedDetails
    //       return [{ ...detail, detailsData: matchedDetails }];
    //     }
    //     return [];
    //   });
    //   console.log(filteredData);
    //   return filteredData;
    // } else {
    //   console.log("report sales retun detailsreport data", data);
    //   return data;
    // }
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
