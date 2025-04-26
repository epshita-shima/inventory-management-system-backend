const ConsumptionModel = require("../../rmconsumptiondetailbynetworth/rmconsumptiondetail.model");
const GRNModel = require("../../goodsreceivenoteinformation/grninfo.model");
const { Types } = require("mongoose");

const getConsumptionDB = async (fromDate, toDate, itemId) => {
  try {
    const consumptionFilter = {};
    const purchaseFilter = {};
    if (fromDate) {
      consumptionFilter.productionDate = new Date(fromDate);
      purchaseFilter.receiveDate = fromDate;
    }
    if (toDate) {
      consumptionFilter.productionDate = new Date(toDate);
      purchaseFilter.receiveDate = toDate;
    }
    if (fromDate && toDate) {
      consumptionFilter.productionDate = {
        $gte: new Date(fromDate),
        $lte: new Date(toDate),
      };
      purchaseFilter.receiveDate = { $gte: fromDate, $lte: toDate };
    }
    if (itemId) {
      consumptionFilter.itemId = itemId;
      purchaseFilter["detailsData.itemId"] = itemId;
    }
    const prevPurchaseData = await GRNModel.aggregate([
      { $match: { receiveDate: { $lt: fromDate } } }, // Find documents that contain the matching itemId
      {
        $project: {
          receiveDate: 1,
          detailsData: {
            $filter: {
              input: "$detailsData",
              as: "item",
              cond: { $eq: ["$$item.itemId", itemId] },
            },
          },
        },
      },
    ]);

    const prevConsumptionIssue = await ConsumptionModel.aggregate([
      {
        $match: {
          itemId: itemId,
          productionDate: { $lt: fromDate },
        },
      },
    ]);

    const consumptionIssue = await ConsumptionModel.aggregate([
      {
        $match: {
          itemId: itemId,
          productionDate: { $gte: fromDate, $lte: toDate },
        },
      },
    ]);

    const purchaseData = await GRNModel.aggregate([
      { $match: purchaseFilter }, // Find documents that contain the matching itemId
      {
        $project: {
          receiveDate: 1,
          detailsData: {
            $filter: {
              input: "$detailsData",
              as: "item",
              cond: { $eq: ["$$item.itemId", itemId] },
            },
          },
        },
      },
      // { $match: { "detailsData.0": { $exists: true } } },
    ]);

    const purchaseGroup = {};
    purchaseData.forEach((items) => {
      items.detailsData.forEach((detail) => {
        let key;
        const dateKey = items.receiveDate;
        const rateKey = detail.unitPrice;
        key = `${dateKey}-${rateKey}`;

        if (!purchaseGroup[key]) {
          purchaseGroup[key] = {
            date: dateKey,
            itemId: detail?.itemId,
            totalQuantity: 0,
            avgRate: 0,
            totalAmount: 0,
            detailsId: detail._id,
          };
          purchaseGroup[key].totalQuantity += detail?.quantity;
          purchaseGroup[key].totalAmount += detail?.amount;
          purchaseGroup[key].avgRate += purchaseGroup[key]?.totalAmount
            ? purchaseGroup[key]?.totalAmount /
              purchaseGroup[key]?.totalQuantity
            : 0;
        }
      });
    });
    const purchaseGroupData = Object.values(purchaseGroup);

    const { totalPrevPurchaseQuantity, totalPrevPurchaseAmount } =
      prevPurchaseData.reduce(
        (acc, items) => {
          items.detailsData.forEach((detail) => {
            acc.totalPrevPurchaseQuantity += detail.quantity || 0;
            acc.totalPrevPurchaseAmount += detail.amount || 0;
          });
          return acc;
        },
        { totalPrevPurchaseQuantity: 0, totalPrevPurchaseAmount: 0 }
      );

    const avgPrevPurchaseRate = totalPrevPurchaseQuantity
      ? totalPrevPurchaseAmount / totalPrevPurchaseQuantity
      : 0;

    const { totalPrevIssueQuantity, totalPrevIssueAmount } =
      prevConsumptionIssue.reduce(
        (acc, issue) => {
          acc.totalPrevIssueAmount += issue.amount || 0;
          acc.totalPrevIssueQuantity += issue.materialUsed || 0;
          return acc;
        },
        { totalPrevIssueQuantity: 0, totalPrevIssueAmount: 0 }
      );

    const avgPrevIssueRate = totalPrevIssueQuantity
      ? totalPrevIssueAmount / totalPrevIssueQuantity
      : 0;

    let openingQuantity = totalPrevPurchaseQuantity - totalPrevIssueQuantity;
    let openingAmount = totalPrevPurchaseAmount - totalPrevIssueAmount;

    let avgOpeningRate = openingQuantity
      ? parseFloat((openingAmount / openingQuantity).toFixed(2))
      : 0;

    const getDateRange = (fromDate, toDate) => {
      const dates = [];
      let current = new Date(fromDate);

      while (current <= new Date(toDate)) {
        dates.push(new Date(current).toISOString().split("T")[0]);
        current.setDate(current.getDate() + 1);
      }
      return dates;
    };

    // const processStockData = (
    //   purchaseGroupData,
    //   consumptionIssue,
    //   fromDate,
    //   toDate
    // ) => {
    //   const dateRange = getDateRange(fromDate, toDate);

    //   const groupedIssues = {};

    //   consumptionIssue.forEach((item) => {
    //     const dateStr = new Date(item.productionDate)
    //       .toISOString()
    //       .split("T")[0];
    //     const rate = item.rate || 0; // Ensure rate is not undefined
    //     const key = `${dateStr}-${item.itemId}-${item.grnDetailsId}-${item.rate}`;
    //     if (!groupedIssues[key]) {
    //       groupedIssues[key] = {
    //         date: dateStr,
    //         rate: rate,
    //         itemId: item.itemId,
    //         totalQuantity: 0,
    //         totalAmount: 0,
    //         closingStock: 0,
    //         grnDetailsId: item.grnDetailsId,
    //       };
    //     }
    //     groupedIssues[key].totalQuantity += item.materialUsed || 0;
    //     groupedIssues[key].totalAmount += item.amount || 0;
    //     groupedIssues[key].closingStock += item.closingStock || 0;
    //   });

    //   const issueGroup = Object.values(groupedIssues);

    //   const result = [];
    //   let prevOpenings = {
    //     quantity: openingQuantity,
    //     rate: avgOpeningRate,
    //     amount: openingAmount,
    //   };
    //   for (const [index, date] of dateRange.entries()) {
    //     const purchasesOnDate = purchaseGroupData.filter(
    //       (p) => p.date === date
    //     );
    //     const issuesOnDate = issueGroup.filter((i) => i.date === date);

    //     console.log("purchasesOnDate", purchasesOnDate);
    //     console.log("issuesOnDate", issuesOnDate);

    //     const maxLen =
    //       Math.max(purchasesOnDate.length, issuesOnDate.length) || 1;
    //     let isFirstEntryOfDate = true;
    //     const dayClosings = [];

    //     for (let i = 0; i < maxLen; i++) {
    //       const opening = isFirstEntryOfDate
    //         ? prevOpenings[i] || { quantity: 0, rate: 0, amount: 0 }
    //         : {
    //             quantity: prevOpenings[i]?.quantity || 0,
    //             rate: prevOpenings[i]?.rate || 0,
    //             amount: prevOpenings[i]?.amount || 0,
    //           };

    //       const purchase = purchasesOnDate[i]
    //         ? {
    //             quantity: purchasesOnDate[i].totalQuantity,
    //             rate: purchasesOnDate[i].avgRate,
    //             amount: purchasesOnDate[i].totalAmount,
    //           }
    //         : { quantity: 0, rate: 0, amount: 0 };

    //       const issue = issuesOnDate[i]
    //         ? {
    //             quantity: issuesOnDate[i].totalQuantity,
    //             rate: issuesOnDate[i].rate,
    //             amount: issuesOnDate[i].totalAmount,
    //           }
    //         : { quantity: 0, rate: 0, amount: 0 };

    //       const hadMovement = purchase.quantity !== 0 || issue.quantity !== 0;
    //       let closingRate = opening.rate;

    //       if (hadMovement) {
    //         if (purchase.quantity > 0 && purchase.rate !== 0) {
    //           closingRate = purchase.rate;
    //         }
    //       }

    //       const closingQuantity =
    //         opening.quantity + purchase.quantity - issue.quantity;
    //       const closingAmount = closingQuantity * closingRate;

    //       result.push({
    //         date,
    //         opening: isFirstEntryOfDate
    //           ? opening
    //           : {
    //               quantity: opening.quantity,
    //               rate: opening.rate,
    //               amount: opening.amount,
    //             },
    //         purchase,
    //         issue,

    //         closing: {
    //           quantity: closingQuantity,
    //           rate: closingRate,
    //           amount: closingAmount,
    //         },
    //       });

    //       if (closingQuantity > 0) {
    //         dayClosings.push({
    //           quantity: closingQuantity,
    //           rate: closingRate,
    //           amount: closingAmount,
    //         });
    //       }

    //       isFirstEntryOfDate = false;
    //     }

    //     prevOpenings = dayClosings.filter((c) => c.quantity > 0);
    //   }
    //   console.log("result", result);
    //   return result;
    // };

    const processStockData = (purchaseGroupData, consumptionIssue, fromDate, toDate) => {
      const stockReport = [];
      let stock = [];
    
      const dateRange = getDateRange(fromDate, toDate);

      for (const date of dateRange) {
        const todayPurchases = purchaseGroupData.filter(p => p.date === date);
        const todayIssues = consumptionIssue.filter(i => i. productionDate === date);

        if (stock.length > 0) {
          for (const s of stock) {
            stockReport.push({
              date,
              opening: { quantity: s.quantity, rate: s.rate, amount: s.quantity * s.rate },
              purchase: { quantity: 0, rate: 0, amount: 0 },
              issue: { quantity: 0, rate: 0, amount: 0 },
              closing: { quantity: s.quantity, rate: s.rate, amount: s.quantity * s.rate },
              detailsId: s.detailsId
            });
          }
        }
    
        // 2. Purchase add hoye stock update
        for (const purchase of todayPurchases) {
          const newStock = {
            quantity: purchase.totalQuantity,
            rate: purchase.avgRate,
            amount: purchase.totalAmount,
            detailsId:purchase.detailsId
          };
    
          stock.push(newStock);
    
          stockReport.push({
            date,
            opening: { quantity: 0, rate: 0, amount: 0 },
            purchase: { quantity: purchase.totalQuantity, rate: purchase.avgRate, amount: purchase.totalAmount },
            issue: { quantity: 0, rate: 0, amount: 0 },
            closing: { quantity: purchase.totalQuantity, rate: purchase.avgRate, amount: purchase.totalAmount },
            detailsId: purchase.detailsId.toString()
          });
        }
    
        // 3. Issue hoye stock theke quantity kombe
        for (const issue of todayIssues) {
          const stockItem = stock.find(s => s.detailsId.toString() === issue.grnDetailsId );

          if (stockItem) {
            const beforeQty = stockItem.quantity;
    
            stockItem.quantity -= issue.quantity;
            stockItem.amount = stockItem.quantity * stockItem.rate;
    
            stockReport.push({
              date,
              opening: { quantity: beforeQty, rate: stockItem.rate, amount: beforeQty * stockItem.rate },
              purchase: { quantity: 0, rate: 0, amount: 0 },
              issue: { quantity: issue.quantity, rate: stockItem.rate, amount: issue.quantity * stockItem.rate },
              closing: { quantity: stockItem.quantity, rate: stockItem.rate, amount: stockItem.amount },
              detailsId: stockItem.detailsId
            });
          }
        }
    
        // 4. Remove fully issued stock
        stock = stock.filter(s => s.quantity > 0);
      }

      return stockReport;
    };
    
    const processDateDefine = processStockData(
      purchaseGroupData,
      consumptionIssue,
      fromDate,
      toDate
    );
    // console.log("processDateDefine", processDateDefine);
    return processDateDefine;
    // return consumptionIssue;
    // console.log(processDateDefine);
  } catch (error) {
    console.log(error);
    throw new Error("Error fetching payment method info");
  }
};

module.exports = {
  getConsumptionDB,
};
