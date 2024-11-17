const OrderManagementModel = require("../salesmanagement/salesmanagementinfo.model");
const SalesManagementModel = require("../finishgoodsdeliveryinfo/finishgoodsdeliveryinfo.model");
const ReturnManagementModel = require("../deliveredreturninformation/deliveredreturninformation.model");

async function getFilteredForOrderReportInfoDB(
  fromDate,
  toDate,
  itemId,
  clientId,
  piId
) {
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
      const filteredData = data.flatMap((detail) => {
        const matchedDetails = detail.detailsData.filter(
          (item) => item.itemId === itemId
        );
        if (matchedDetails.length > 0) {
          return [{ ...detail, detailsData: matchedDetails }];
        }
        return [];
      });
      return filteredData;
    } else {
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
  piId
) {
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

      const resultSummaryData = Object.entries(summaryData).flatMap(
        ([date, paymentTypes]) =>
          Object.entries(paymentTypes)
            .filter(([paymentId]) => paymentId && paymentId !== "paymentId") // Exclude invalid paymentTypes
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
  piId
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
    if (!data.length) return [];

    const uniqueItemIds = [
      ...new Set(data.flatMap((item) => item.detailsData.map((d) => d.itemId))),
    ];
    const unitPrices = await OrderManagementModel.find(
      {
        _id: { $in: data.map((d) => d.piId) },
        "detailsData.itemId": { $in: uniqueItemIds },
      },
      { _id: 1, detailsData: 1 }
    ).lean();

    const unitPriceMap = unitPrices.reduce((acc, doc) => {
      doc.detailsData.forEach((detail) => {
        acc[`${doc._id}-${detail.itemId}`] = detail.unitPrice || 0;
      });
      return acc;
    }, {});

    const groupedData = {};

    // Process data and group by returnDate, itemId, clientId, and piId
    data.forEach((item) => {
      item.detailsData.forEach((detail) => {
        const deliverQty = parseInt(detail.deliverQty, 10);
        if (isNaN(deliverQty)) return;

        if (
          (!itemId || detail.itemId === itemId) &&
          (!clientId || item.clientId === clientId) &&
          (!piId || item.piId === piId)
        ) {
          const dateKey = new Date(item.finishGoodsDeliveryDate)
            .toISOString()
            .split("T")[0];
          let key;

          if (itemId && clientId && piId) {
            key = `${dateKey}-${detail.itemId}-${item.clientId}-${item.piId}`;
          } else if (itemId && clientId) {
            key = `${dateKey}-${detail.itemId}-${item.clientId}`;
          } else if (clientId && piId) {
            key = `${dateKey}-${item.clientId}-${item.piId}`;
          } else if (itemId) {
            key = `${dateKey}-${detail.itemId}`;
          } else if (clientId) {
            key = `${dateKey}-${item.clientId}`;
          } else if (piId) {
            key = `${dateKey}-${item.piId}`;
          } else {
            key = `${dateKey}`;
          }
          const unitPrice = unitPriceMap[`${item.piId}-${detail.itemId}`] || 0;
          if (!groupedData[key]) {
            groupedData[key] = {
              deliverDate: dateKey,
              itemId: detail.itemId,
              clientId: item.clientId,
              piId: item.piId,
              totalDeliverQty: 0,
              totalDeliverAmount: 0,
              unitPrice: unitPrice,
            };
          }

          groupedData[key].totalDeliverQty += deliverQty;
          groupedData[key].totalDeliverAmount += deliverQty * unitPrice;
        }
      });
    });

    return Object.values(groupedData);
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching payment method info");
  }
}

async function getFilteredForSalesReturnReportDetailsInfoDB(
  fromDate,
  toDate,
  itemId,
  clientId,
  piId,
  reportStatus
) {
  try {
    // Construct filter based on parameters
    const filter = {};
    if (fromDate && toDate) {
      filter.returnDate = { $gte: fromDate, $lte: toDate };
    } else if (fromDate) {
      filter.returnDate = { $gte: fromDate };
    } else if (toDate) {
      filter.returnDate = { $lte: toDate };
    }

    if (clientId) filter.clientId = clientId;
    if (piId) filter.piId = piId;

    const data = await ReturnManagementModel.find(filter).lean();
    if (!data.length) return [];

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
      return data;
    }
  } catch (error) {
    console.error(
      "Error in getFilteredForSalesReturnReportDetailsInfoDB:",
      error
    );
    throw error;
  }
}

async function getFilteredForSalesReturnSummaryReportInfoDB(
  fromDate,
  toDate,
  itemId,
  clientId,
  piId
) {
  try {
    // Construct filter based on parameters
    const filter = {};
    if (fromDate && toDate) {
      filter.returnDate = { $gte: fromDate, $lte: toDate };
    } else if (fromDate) {
      filter.returnDate = { $gte: fromDate };
    } else if (toDate) {
      filter.returnDate = { $lte: toDate };
    }

    if (clientId) filter.clientId = clientId;
    if (piId) filter.piId = piId;

    const data = await ReturnManagementModel.find(filter).lean();
    if (!data.length) return [];

    const uniqueItemIds = [
      ...new Set(data.flatMap((item) => item.detailsData.map((d) => d.itemId))),
    ];
    const unitPrices = await OrderManagementModel.find(
      {
        _id: { $in: data.map((d) => d.piId) },
        "detailsData.itemId": { $in: uniqueItemIds },
      },
      { _id: 1, detailsData: 1 }
    ).lean();

    const unitPriceMap = unitPrices.reduce((acc, doc) => {
      doc.detailsData.forEach((detail) => {
        acc[`${doc._id}-${detail.itemId}`] = detail.unitPrice || 0;
      });
      return acc;
    }, {});

    const groupedData = {};

    // Process data and group by returnDate, itemId, clientId, and piId
    data.forEach((item) => {
      item.detailsData.forEach((detail) => {
        const returnQty = parseInt(detail.returnQty, 10);
        if (isNaN(returnQty)) return;

        if (
          (!itemId || detail.itemId === itemId) &&
          (!clientId || item.clientId === clientId) &&
          (!piId || item.piId === piId)
        ) {
          const dateKey = new Date(item.returnDate).toISOString().split("T")[0];
          let key;

          if (itemId && clientId && piId) {
            key = `${dateKey}-${detail.itemId}-${item.clientId}-${item.piId}`;
          } else if (itemId && clientId) {
            key = `${dateKey}-${detail.itemId}-${item.clientId}`;
          } else if (clientId && piId) {
            key = `${dateKey}-${item.clientId}-${item.piId}`;
          } else if (itemId) {
            key = `${dateKey}-${detail.itemId}`;
          } else if (clientId) {
            key = `${dateKey}-${item.clientId}`;
          } else if (piId) {
            key = `${dateKey}-${item.piId}`;
          } else {
            key = `${dateKey}`;
          }

          const unitPrice = unitPriceMap[`${item.piId}-${detail.itemId}`] || 0;
          if (!groupedData[key]) {
            groupedData[key] = {
              returnDate: dateKey,
              itemId: detail.itemId,
              clientId: item.clientId,
              transferFromClientId: item.transferFromClientId,
              transferToCompanyId: item.transferToCompanyId,
              piId: item.piId,
              totalReturnQty: 0,
              totalReturnAmount: 0,
              unitPrice: unitPrice,
            };
          }

          groupedData[key].totalReturnQty += returnQty;
          groupedData[key].totalReturnAmount += returnQty * unitPrice;
        }
      });
    });

    return Object.values(groupedData);
  } catch (error) {
    console.error(
      "Error in getFilteredForSalesReturnSummaryReportInfoDB:",
      error
    );
    throw error;
  }
}

async function getFilteredForCombineReport(
  fromDate,
  toDate,
  itemId,
  clientId,
  piId
) {
  try {
    // Construct filter based on parameters
    const salesFilter = {};
    const orderFilter = {};
    const returnFilter = {};

    // Date range filter
    if (fromDate && toDate) {
      const dateRange = { $gte: new Date(fromDate), $lte: new Date(toDate) };

      salesFilter.finishGoodsDeliveryDate = dateRange; // Adjusted for Sales Management
      orderFilter.piDate = dateRange; // Assuming Order Management uses piDate
      returnFilter.returnDate = dateRange; // For Return Management
    } else if (fromDate) {
      const startDate = { $gte: new Date(fromDate) };

      salesFilter.finishGoodsDeliveryDate = startDate;
      orderFilter.piDate = startDate;
      returnFilter.returnDate = startDate;
    } else if (toDate) {
      const endDate = { $lte: new Date(toDate) };

      salesFilter.finishGoodsDeliveryDate = endDate;
      orderFilter.piDate = endDate;
      returnFilter.returnDate = endDate;
    }

    // Other filters
    if (clientId) {
      salesFilter.clientId = clientId;
      orderFilter.clientId = clientId;
      returnFilter.clientId = clientId;
    }

    if (piId) {
      orderFilter.piId = piId; // Specific to Order Management
    }

    const salesInfo = await SalesManagementModel.find(salesFilter).lean();
    const orderInfo = await OrderManagementModel.find(orderFilter).lean();
    const returnInfo = await ReturnManagementModel.find(returnFilter).lean();
    if (
      !Array.isArray(salesInfo) ||
      !Array.isArray(orderInfo) ||
      !Array.isArray(returnInfo)
    ) {
   console.log('error occured')
    }
    const combineByPiId = (salesInfo, orderInfo, returnInfo) => {
      const combinedData = {};
    
      const normalizedOrderInfo = orderInfo.map((item) => ({
        ...item,
        piId: item._id, 
        _id: item._id, 
      }));
    
      const addToCombinedData = (array, type) => {

        array?.forEach((item) => {
          console.log('item',item)
          const { piId, detailsData } = item;
          
    console.log('piId',piId);
    console.log("detailsData",detailsData)
          if (!piId) {
            console.log("Missing piId in item", item);
            return;
          }
    
          if (!detailsData) {
            console.log("Missing detailsData in item", item);
            return;
          }
    
          if (!combinedData[piId]) {
            combinedData[piId] = {};
          }
    
          detailsData.forEach((detail) => {
            const { item: itemId } = detail;
    
            if (!itemId) {
              console.log("Missing itemId in detail", detail);
              return;
            }
    
            if (!combinedData[piId][itemId]) {
              combinedData[piId][itemId] = {
                sales: [],
                orders: [],
                returns: [],
              };
            }
    
            console.log(`Adding ${type} for piId ${piId}, itemId ${itemId}`);
            combinedData[piId][itemId][type].push(item);
          });
        });
      };
    
      // Add data from all sources
      addToCombinedData(salesInfo, "sales");
      addToCombinedData(normalizedOrderInfo, "orders");
      addToCombinedData(returnInfo, "returns");
    
      return combinedData;
    };
    
    // Use the function with your data
    const combinedData = combineByPiId(salesInfo, orderInfo, returnInfo);
    
    console.log(JSON.stringify(combinedData, null, 2));
    
  } catch (error) {
    console.error("Error in getFilteredForCombineReport:", error);
    throw error;
  }
}

module.exports = {
  getFilteredForOrderReportInfoDB,
  getFilteredForOrderSummaryReportInfoDB,
  getFilteredForSalesReportInfoDB,
  getFilteredForSalesReturnReportDetailsInfoDB,
  getFilteredForSalesSummaryReportInfoDB,
  getFilteredForSalesReturnSummaryReportInfoDB,
  getFilteredForCombineReport,
};
