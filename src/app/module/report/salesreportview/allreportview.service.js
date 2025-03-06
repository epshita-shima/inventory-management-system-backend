const OrderManagementModel = require("../../salesmanagement/salesmanagementinfo.model");
const SalesManagementModel = require("../../finishgoodsdeliveryinfo/finishgoodsdeliveryinfo.model");
const ReturnManagementModel = require("../../deliveredreturninformation/deliveredreturninformation.model");

async function getFilteredForOrderReportInfoDB(
  fromDate,
  toDate,
  itemId,
  clientId,
  piId
) {
  try {
    const filter = {};
    if (fromDate && toDate) {
      filter.piDate = {
        $gte: new Date(fromDate),
        $lte: new Date(new Date(toDate).setHours(23, 59, 59, 999)),
      };
    } else if (fromDate) {
      filter.piDate = { $gte: new Date(fromDate) };
    } else if (toDate) {
      filter.piDate = {
        $lte: new Date(new Date(toDate).setHours(23, 59, 59, 999)),
      };
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
    if (fromDate && toDate) {
      filter.piDate = {
        $gte: new Date(fromDate),
        $lte: new Date(new Date(toDate).setHours(23, 59, 59, 999)),
      };
    } else if (fromDate) {
      filter.piDate = { $gte: new Date(fromDate) };
    } else if (toDate) {
      filter.piDate = {
        $lte: new Date(new Date(toDate).setHours(23, 59, 59, 999)),
      };
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
    console.log("itemid in delivered", itemId);
    const filter = {};
    if (fromDate && toDate) {
      filter.finishGoodsDeliveryDate = {
        $gte: new Date(fromDate),
        $lte: new Date(new Date(toDate).setHours(23, 59, 59, 999)),
      };
    } else if (fromDate) {
      filter.finishGoodsDeliveryDate = { $gte: new Date(fromDate) };
    } else if (toDate) {
      filter.finishGoodsDeliveryDate = {
        $lte: new Date(new Date(toDate).setHours(23, 59, 59, 999)),
      };
    }
    if (itemId) {
      filter["detailsData.itemId"] = itemId;
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
  piId
) {
  try {
    const filter = {};
    if (fromDate && toDate) {
      filter.finishGoodsDeliveryDate = {
        $gte: new Date(fromDate),
        $lte: new Date(new Date(toDate).setHours(23, 59, 59, 999)),
      };
    } else if (fromDate) {
      filter.finishGoodsDeliveryDate = { $gte: new Date(fromDate) };
    } else if (toDate) {
      filter.finishGoodsDeliveryDate = {
        $lte: new Date(new Date(toDate).setHours(23, 59, 59, 999)),
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
    const dataSales = Object.values(groupedData);

    const getGrandTotalDeliverQtyByMonth = (data) => {
      if (data.length === 0) return [];
    
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
      // Initialize all months with default value
      const monthlyTotals = monthNames.map((month) => ({
        month,
        totalMonthlyQty: 0,
      }));
    
      // Process data and update the corresponding month
      data.forEach((item) => {
        const date = new Date(item.deliverDate);
        const monthIndex = date.getMonth();
        monthlyTotals[monthIndex].totalMonthlyQty += item.totalDeliverQty;
      });
    
      return monthlyTotals;
    };
    
    const monthlySalesData = getGrandTotalDeliverQtyByMonth(dataSales);

    return {dataSales,monthlySalesData}
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
  piId
) {
  try {
    // Construct filter based on parameters
    const filter = {};
    if (fromDate && toDate) {
      filter.returnDate = {
        $gte: new Date(fromDate),
        $lte: new Date(new Date(toDate).setHours(23, 59, 59, 999)),
      };
    } else if (fromDate) {
      filter.returnDate = { $gte: new Date(fromDate) };
    } else if (toDate) {
      filter.returnDate = {
        $lte: new Date(new Date(toDate).setHours(23, 59, 59, 999)),
      };
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
      filter.returnDate = {
        $gte: new Date(fromDate),
        $lte: new Date(new Date(toDate).setHours(23, 59, 59, 999)),
      };
    } else if (fromDate) {
      filter.returnDate = { $gte: new Date(fromDate) };
    } else if (toDate) {
      filter.returnDate = {
        $lte: new Date(new Date(toDate).setHours(23, 59, 59, 999)),
      };
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
    const orderFilter = {};
    if (fromDate && toDate) {
      const dateRange = {
        $gte: new Date(fromDate),
        $lte: new Date(new Date(toDate).setHours(23, 59, 59, 999)),
      };
      orderFilter.piDate = dateRange;
    } else if (fromDate) {
      const startDate = { $gte: new Date(fromDate) };
      orderFilter.piDate = startDate;
    } else if (toDate) {
      const endDate = {
        $lte: new Date(new Date(toDate).setHours(23, 59, 59, 999)),
      };
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

    function groupAndCalculateTotals(
      data,
      fromDate,
      toDate,
      clientId,
      piId,
      itemId
    ) {
      const groupedData = {};

      // Filter data if itemId is provided
      const filteredData = itemId
        ? data.flatMap((detail) => {
            if (detail?.detailsData) {
              const matchedDetails = detail.detailsData.filter(
                (item) => item.itemId === itemId
              );
              if (matchedDetails.length > 0) {
                return [{ ...detail, detailsData: matchedDetails }];
              }
            }
            return [];
          })
        : data;

      // Iterate over filtered data to group and calculate totals
      filteredData.forEach((record) => {
        const { customerID, piDate, invoiceNo, detailsData } = record;
        const dateOnly = new Date(piDate).toISOString().split("T")[0]; // Extract YYYY-MM-DD

        detailsData.forEach((detail) => {
          // Construct the grouping key
          let groupKey;
          if (fromDate && toDate && clientId && piId) {
            groupKey = `${dateOnly}-${customerID}-${invoiceNo}`;
          } else if (fromDate && toDate && itemId) {
            groupKey = `${dateOnly}-${detail.itemId}`;
          } else if (fromDate && toDate && clientId) {
            groupKey = `${dateOnly}-${customerID}`;
          } else if (fromDate && toDate) {
            groupKey = `${dateOnly}`;
          }

          if (!groupKey) return;

          // Initialize group if it doesn't exist
          if (!groupedData[groupKey]) {
            groupedData[groupKey] = {
              date: piDate || null,
              totalPIQuantity: 0,
              totalDeliveredQty: 0,
              totalReturnQty: 0,
              totalPiAmount: 0,
              piUnitPrice: 0,
              deliveredAvgUnitPrice: 0,
              totalDeliveredAmount: 0,
              returnAvgUnitPrice: 0,
              totalReturnAmount: 0,
            };
          }

          // Accumulate totals
          groupedData[groupKey].totalPIQuantity += Number(detail.quantity || 0);
          groupedData[groupKey].totalDeliveredQty += Number(
            detail.deliveredQty || 0
          );
          groupedData[groupKey].totalReturnQty += Number(detail.returnQty || 0);
          groupedData[groupKey].totalPiAmount += Number(detail.totalAmount);
          const unitPrice = Number(detail.unitPrice || 0);
          groupedData[groupKey].piUnitPrice = Math.round(
            groupedData[groupKey].totalPiAmount /
              groupedData[groupKey].totalPIQuantity
          );

          groupedData[groupKey].totalDeliveredAmount +=
            detail.deliveredQty * unitPrice;

          groupedData[groupKey].deliveredAvgUnitPrice =
            groupedData[groupKey].totalDeliveredQty > 0
              ? Math.round(
                  groupedData[groupKey].totalDeliveredAmount /
                    groupedData[groupKey].totalDeliveredQty
                )
              : 0;

          groupedData[groupKey].totalReturnAmount +=
            detail.returnQty * unitPrice;

          groupedData[groupKey].returnAvgUnitPrice =
            groupedData[groupKey].totalReturnQty > 0
              ? Math.round(
                  groupedData[groupKey].totalReturnAmount /
                    groupedData[groupKey].totalReturnQty
                )
              : 0;
        });
      });

      // Calculate net totals and convert grouped data to an array
      return Object.values(groupedData).map((group) => {
        const netQuantity =
          group.totalPIQuantity -
          group.totalDeliveredQty +
          group.totalReturnQty;
        const totalNetAmount = netQuantity * group.piUnitPrice;
        const netAvgUnitPrice = Math.round(totalNetAmount / netQuantity);

        return {
          ...group,
          netQuantity,
          totalNetAmount,
          netAvgUnitPrice,
        };
      });
    }

    const groupedResult = groupAndCalculateTotals(
      orderInfo,
      fromDate,
      toDate,
      clientId,
      piId,
      itemId
    );
    return { groupedResult, orderInfo };
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
