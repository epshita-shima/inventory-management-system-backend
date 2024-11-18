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
      orderFilter.piDate = dateRange;
    } else if (fromDate) {
      const startDate = { $gte: new Date(fromDate) };
      orderFilter.piDate = startDate;
    } else if (toDate) {
      const endDate = { $lte: new Date(toDate) };
      orderFilter.piDate = endDate;
    }

    // Other filters
    if (clientId) {
      orderFilter.customerID = clientId;
    }

    if (piId) {
      orderFilter._id = piId; // Specific to Order Management
    }
    const orderInfo = await OrderManagementModel.find(orderFilter).lean();

    // function groupByDateAndId(data) {
    //   const groupedData = {};
    
    //   data.forEach(record => {
    //     const { _id: parentId, piDate, invoiceNo, detailsData } = record;
    
    //     detailsData.forEach(detail => {
    //       const netQuantity = Number(detail.quantity) - Number(detail.deliveredQty) + Number(detail.returnQty);
          
    //       const groupKey = `${piDate || null}-${parentId}`; // Unique key for grouping
          
    //       if (!groupedData[groupKey]) {
    //         groupedData[groupKey] = {
    //           date: piDate || null,
    //           _id: parentId,
    //           piNo: invoiceNo,
    //           groupedDetails: []
    //         };
    //       }
    
    //       groupedData[groupKey].groupedDetails.push({
    //         quantity: detail.quantity,
    //         deliveredQty: detail.deliveredQty,
    //         returnQty: detail.returnQty,
    //         netQuantity: netQuantity
    //       });
    //     });
    //   });
    
    //   return Object.values(groupedData);
    // }
    
    // Example Usage
   
    function groupAndCalculateTotals(data) {
      const groupedData = {};
    
      data.forEach(record => {
        const { _id: parentId,customerID, piDate, invoiceNo, detailsData } = record;
    
        detailsData.forEach(detail => {
          let groupKey;
           if(fromDate && toDate && clientId && piId){
            groupKey = `${piDate}-${customerID}-${invoiceNo}`; 
          }
          else if(fromDate && toDate && itemId){
            groupKey = `${piDate}-${detail.itemId}`; 
          }
          else if(fromDate && toDate && clientId){
            groupKey = `${piDate}-${customerID}`; 
          }
          else if(fromDate && toDate){
            groupKey = `${piDate}`; 
          }
       
          if (!groupKey) return;

          if (!groupedData[groupKey]) {
            groupedData[groupKey] = {
              date: piDate || null,
              _id: parentId,
              piNo: invoiceNo,
              totalQuantity: 0,
              totalDeliveredQty: 0,
              totalReturnQty: 0,
              totalPiAmount:0,
              piUnitPrice:0,
              deliveredAvgUnitPrice:0,
              totalDeliveredAmount:0,
              returnAvgUnitPrice:0,
              totalReturnAmount:0,
            };
          }
    
          // Accumulate totals
          groupedData[groupKey].totalQuantity += Number(detail.quantity);
          groupedData[groupKey].totalDeliveredQty += Number(detail.deliveredQty);
          groupedData[groupKey].totalReturnQty += Number(detail.returnQty);
    
          groupedData[groupKey].piUnitPrice +=  Number(detail.unitPrice);
          groupedData[groupKey].totalPiAmount = groupedData[groupKey].totalQuantity * groupedData[groupKey].piUnitPrice;
          groupedData[groupKey].totalDeliveredAmount = groupedData[groupKey].totalDeliveredQty * groupedData[groupKey].piUnitPrice;
         
          groupedData[groupKey].deliveredAvgUnitPrice = groupedData[groupKey].totalDeliveredAmount / groupedData[groupKey].totalDeliveredQty;
          groupedData[groupKey].totalReturnAmount = groupedData[groupKey].totalReturnQty * groupedData[groupKey].piUnitPrice;
          groupedData[groupKey].returnAvgUnitPrice = groupedData[groupKey].totalReturnAmount / groupedData[groupKey].totalReturnQty;
        });
      });
    
      // Calculate netQuantity for each group and convert to array
      return Object.values(groupedData).map(group => {
        const netQuantity = group.totalQuantity - group.totalDeliveredQty + group.totalReturnQty;
        const totalNetAmount = netQuantity * group.piUnitPrice;
        const netAvgUnitPrice = totalNetAmount / netQuantity;
        return {
          ...group,
          netQuantity: netQuantity,
          totalNetAmount: totalNetAmount,
          netAvgUnitPrice: netAvgUnitPrice,
        };
      });
    }
    
    const groupedResult = groupAndCalculateTotals(orderInfo); 
    return groupedResult

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
