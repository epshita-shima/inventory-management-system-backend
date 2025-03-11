const ProductionModel = require("../../productioninformation/productioninfo.model");
const RawMaterialItemModel = require("../../rawmaterialinformation/rawmaterialinfo.model");
const FinishGoodsItemModel=require("../../finishgoodsinformation/finishgoods.model")
async function getFilteredForProductionDatewiseDetailsReportInfoDB(
  fromDate,
  toDate,
  productionItemName,
  batchNo
) {
  try {
    console.log("click", productionItemName);
    const filter = {};
    if (fromDate) {
      filter.productionDate = fromDate;
    }
    if (toDate) {
      filter.productionDate = toDate;
    }
    if (fromDate && toDate) {
      filter.productionDate = { $gte: fromDate, $lte: toDate };
    }
    if (productionItemName) {
      filter.productionItemName = productionItemName;
    }

    if (batchNo) {
      filter._id = batchNo;
    }

    if (Object.keys(filter).length === 0) {
      return [];
    }

    const data = await ProductionModel.find(filter).lean();
    console.log("data", data);
    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Error fetching payment method info");
  }
}

async function getFilteredForProductionDatewiseSummaryReportInfoDB(
  fromDate,
  toDate,
  productionItemName,
  batchNo
) {
  try {

    const filter = {};
   
    if (fromDate) {
      filter.productionDate = fromDate;
    }
    if (toDate) {
      filter.productionDate = toDate;
    }
    if (fromDate && toDate) {
      filter.productionDate = { $gte: fromDate, $lte: toDate };
    }
    if (productionItemName) {
      filter.productionItemName = productionItemName;
    }

    if (batchNo) {
      filter._id = batchNo;
    }

    if (Object.keys(filter).length === 0) {
      return [];
    }

    const data = await ProductionModel.find(filter).lean();
    if (!data.length) return [];

    const groupedData = {};

    // Process data and group by returnDate, productionItemName, clientId, and piId
    data.forEach((item) => {
      if (
        !productionItemName ||
        item.productionItemName === productionItemName
      ) {
        const dateKey = new Date(item.productionDate)
          .toISOString()
          .split("T")[0];
        let key;

        if (productionItemName && batchNo) {
          key = `${dateKey}-${item.productionItemName}-${item.batchNo}`;
        } else if (productionItemName) {
          key = `${dateKey}-${item.productionItemName}`;
        } else if (batchNo) {
          key = `${dateKey}-${item.batchNo}`;
        } else {
          key = `${dateKey}`;
        }

        if (!groupedData[key]) {
          groupedData[key] = {
            date: dateKey,
            productionItemName: item.productionItemName,
            totalProductionQty: 0,
          };
        }

        groupedData[key].totalProductionQty += item.productionQty;
      }
    });
    const getGrandTotalDeliverQtyByMonth = async (data) => {
      if (data.length === 0) return [];
    
      const finishGoodsItem = await FinishGoodsItemModel.find();
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      
      // Initialize all months with default value, without itemName
      const monthlyTotals = monthNames.map((month) => ({
        month,
        totalMonthlyQty: 0,
        itemName: "", // We'll dynamically set itemName later
      }));
    
      // Process data and update the corresponding month
      data.forEach((item) => {
        const date = new Date(item.date);
        const monthIndex = date.getMonth();
        
        // Find itemName for the current item
        const finishItem = finishGoodsItem.find(
          (itemData) => itemData._id.toString() === item.productionItemName.toString()
        );
        const finishItemName = finishItem ? finishItem.itemName : "Unknown"; 
    
        console.log(`Item: ${finishItemName}, Month: ${monthNames[monthIndex]}, Quantity: ${item.totalProductionQty}`);
    
        // Set the itemName if it's the first time for that month
        if (!monthlyTotals[monthIndex].itemName) {
          monthlyTotals[monthIndex].itemName = finishItemName;
        }
    
        // Update total quantity for the month
        monthlyTotals[monthIndex].totalMonthlyQty += item.totalProductionQty;
      });
    
      return monthlyTotals;
    };
    
    const finishGoodsProduction = Object.values(groupedData);
    console.log('finishGoodsProduction',finishGoodsProduction)
    const monthlyFinishGoodsProductionData = await getGrandTotalDeliverQtyByMonth(finishGoodsProduction);

    
    return {monthlyFinishGoodsProductionData,finishGoodsProduction};
  } catch (error) {
    console.log(error);
    throw new Error("Error fetching payment method info");
  }
}

async function getFilteredForProductionItemwiseDetailsReportInfoDB(
  fromDate,
  toDate,
  productionItemName,
  batchNo
) {
  try {
    const filter = {};
    if (fromDate) {
      filter.productionDate = fromDate;
    }
    if (toDate) {
      filter.productionDate = toDate;
    }
    if (fromDate && toDate) {
      filter.productionDate = { $gte: fromDate, $lte: toDate };
    }
    if (productionItemName) {
      filter.productionItemName = productionItemName;
    }

    if (batchNo) {
      filter._id = batchNo;
    }

    if (Object.keys(filter).length === 0) {
      return [];
    }

    const data = await ProductionModel.find(filter).lean();

    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Error fetching payment method info");
  }
}

async function getFilteredForRawMaterialConsumptionDetailsReportInfoDB(
  fromDate,
  toDate,
  itemId
) {
  console.log("production", fromDate, toDate, itemId);
  try {
    const filter = {};
    if (fromDate) {
      filter.productionDate = fromDate;
    }
    if (toDate) {
      filter.productionDate = toDate;
    }
    if (fromDate && toDate) {
      filter.productionDate = { $gte: fromDate, $lte: toDate };
    }
    if (itemId) {
      filter["detailsData.itemId"] = itemId;
    }

    if (Object.keys(filter).length === 0) {
      return [];
    }
    if (itemId) {
      const data = await ProductionModel.aggregate([
        { $match: filter }, // Find documents that contain the matching itemId
        {
          $project: {
            productionDate: 1,
            batchNo: 1,
            totalBatch: 1,
            receipeQtyRatio: 1,
            productionItemName: 1,
            productionQty: 1,
            productionStart: 1,
            productionEnd: 1,
            totalHour: 1,
            wastageQty: 1,
            expectedProductionQtyPerBatch: 1,
            expectedProductionQty: 1,
            excessOrLessProductionQty: 1,
            productionStatus: 1,
            makeBy: 1,
            updateBy: 1,
            makeDate: 1,
            updateDate: 1,
            detailsData: {
              $filter: {
                input: "$detailsData",
                as: "item",
                cond: { $eq: ["$$item.itemId", itemId] }, // Only return items that match itemId
              },
            },
          },
        },
      ]);
      return data;
    }
    if (fromDate && toDate) {
      console.log("fromDate && toDate", fromDate, toDate);
      const data = await ProductionModel.aggregate([
        { $match: filter }, // Filter by date range
        {
          $project: {
            productionDate: 1,
            batchNo: 1,
            totalBatch: 1,
            receipeQtyRatio: 1,
            productionItemName: 1,
            productionQty: 1,
            productionStart: 1,
            productionEnd: 1,
            totalHour: 1,
            wastageQty: 1,
            expectedProductionQtyPerBatch: 1,
            expectedProductionQty: 1,
            excessOrLessProductionQty: 1,
            productionStatus: 1,
            makeBy: 1,
            updateBy: 1,
            makeDate: 1,
            updateDate: 1,
            detailsData: 1,
          },
        },
      ]);
      return data;
    }
  } catch (error) {
    console.log(error);
    throw new Error("Error fetching payment method info");
  }
}

async function getFilteredForRawMaterialConsumptionSummaryReportInfoDB(
  fromDate,
  toDate,
  itemId
) {
  try {
    const filter = {};
    if (fromDate) {
      filter.productionDate = fromDate;
    }
    if (toDate) {
      filter.productionDate = toDate;
    }
    if (fromDate && toDate) {
      filter.productionDate = { $gte: fromDate, $lte: toDate };
    }

    if (Object.keys(filter).length === 0) {
      return [];
    }

    const data = await ProductionModel.find(filter).lean();
    if (!data.length) return [];

    const groupedData = {};

    // Process data and group by returnDate, productionItemName, clientId, and piId
    data.forEach((item) => {
      item.detailsData.forEach((detail) => {
        const materialUsed = parseInt(detail.materialUsed, 10);
        if (isNaN(materialUsed)) return;

        if (!itemId || detail.itemId === itemId) {
          const dateKey = new Date(item.productionDate)
            .toISOString()
            .split("T")[0];
          let key;

          if (detail.itemId) {
            key = `${dateKey}-${detail.itemId}`;
          }

          if (!groupedData[key]) {
            groupedData[key] = {
              date: dateKey,
              itemId: detail.itemId,
              totalMaterialUsed: 0,
            };
          }

          groupedData[key].totalMaterialUsed += materialUsed;
        }
      });
    });

    const getGrandTotalMaterialUsedByMonth = async (data) => {
      if (data.length === 0) return [];
      const rawItem = await RawMaterialItemModel.find();

      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      // Using an object to group data by month and itemId
      const monthlyTotals = data.reduce((acc, item) => {
        const date = new Date(item.date);
        const monthIndex = date.getMonth();
        const monthKey = monthNames[monthIndex];

        const itemName = rawItem.find(
          (itemData) => itemData._id == item.itemId
        );
        const itemKey = `${monthKey}-${item.itemId}`; // Unique key combining month and itemId

        if (!acc[itemKey]) {
          acc[itemKey] = {
            month: monthKey,
            itemId: item.itemId,
            itemName: itemName ? itemName.itemName : "Unknown",
            totalMaterialUsed: 0,
          };
        }
        acc[itemKey].totalMaterialUsed += item.totalMaterialUsed;

        return acc;
      }, {});

      console.log("monthlyTotals", Object.values(monthlyTotals));

      // Convert object to array and sort by month
      return Object.values(monthlyTotals).sort(
        (a, b) => monthNames.indexOf(a.month) - monthNames.indexOf(b.month)
      );
    };

    const rawConsumptionData = Object.values(groupedData);
    const monthlyRawConsumption = await getGrandTotalMaterialUsedByMonth(
      rawConsumptionData
    );
    const monthlyRawConsumptionData = Object.values(monthlyRawConsumption);
    return { monthlyRawConsumptionData, rawConsumptionData };
  } catch (error) {
    console.log(error);
    throw new Error("Error fetching payment method info");
  }
}

module.exports = {
  getFilteredForProductionDatewiseDetailsReportInfoDB,
  getFilteredForProductionDatewiseSummaryReportInfoDB,
  getFilteredForProductionItemwiseDetailsReportInfoDB,
  getFilteredForRawMaterialConsumptionDetailsReportInfoDB,
  getFilteredForRawMaterialConsumptionSummaryReportInfoDB,
};
