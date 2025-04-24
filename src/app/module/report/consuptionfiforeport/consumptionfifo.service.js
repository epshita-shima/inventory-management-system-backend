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

    console.log("prevPurchaseData", prevPurchaseData);
    const prevConsumptionIssue = await ConsumptionModel.aggregate([
      {
        $match: {
          itemId: itemId,
          productionDate: { $lt: fromDate },
        },
      },
    ]);

    console.log("fromDate", fromDate);
    const consumptionIssue = await ConsumptionModel.aggregate([
      {
        $match: {
          itemId: itemId,
          productionDate: { $gte: fromDate, $lte: toDate },
        },
      },
    ]);
    console.log("consumptionIssue", consumptionIssue);
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

    console.log('prevPurchaseData',prevPurchaseData)
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

    console.log("prevConsumptionIssue", prevConsumptionIssue);
    console.log(
      "prevPurchaseData",
      totalPrevPurchaseQuantity,
      totalPrevPurchaseAmount
    );
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

    console.log('openingQuantity=',openingQuantity,'openingAmount=',openingAmount)
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

    const processStockData = (
      purchaseGroupData,
      consumptionIssue,
      fromDate,
      toDate
    ) => {
      const dateRange = getDateRange(fromDate, toDate);

      const groupedIssues = {};
      consumptionIssue.forEach((item) => {
        const dateStr = new Date(item.productionDate)
          .toISOString()
          .split("T")[0];
        const rate = item.rate || 0; // Ensure rate is not undefined
        const key = `${dateStr}-${rate}`;
        if (!groupedIssues[key]) {
          groupedIssues[key] = {
            date: dateStr,
            rate: rate,
            itemId: item.itemId,
            totalQuantity: 0,
            totalAmount: 0,
            closingStock: 0,
          };
        }

        groupedIssues[key].totalQuantity += item.materialUsed || 0;
        groupedIssues[key].totalAmount += item.amount || 0;
        groupedIssues[key].closingStock += item.closingStock || 0;
      });

      const issueGroup = Object.values(groupedIssues);

      const result = [];
      let prevOpening = {
        quantity: openingQuantity,
        amount: openingAmount,
        rate: avgOpeningRate,
      };
      for (const [index, date] of dateRange.entries()) {
        const purchasesOnDate = purchaseGroupData.filter(
          (p) => p.date === date
        );
        const issuesOnDate = issueGroup.filter((i) => i.date === date);

        const maxLen =
          Math.max(purchasesOnDate.length, issuesOnDate.length) || 1;
        let currentOpening = { ...prevOpening };
        for (let i = 0; i < maxLen; i++) {
          const purchase = purchasesOnDate[i]
            ? {
                quantity: purchasesOnDate[i].totalQuantity,
                rate: purchasesOnDate[i].avgRate,
                amount: purchasesOnDate[i].totalAmount,
              }
            : { quantity: 0, rate: 0, amount: 0 };

          const issue = issuesOnDate[i]
            ? {
                quantity: issuesOnDate[i].totalQuantity,
                rate: issuesOnDate[i].rate,
                amount: issuesOnDate[i].totalAmount,
              }
            : { quantity: 0, rate: 0, amount: 0 };

          const hadMovement = purchase.quantity !== 0 || issue.quantity !== 0;

          const closingQuantity = purchase.quantity - issue.quantity;

            let closingRate = purchase.rate;      // default

            if (hadMovement) {
              if (closingQuantity !== 0) {
                closingRate = purchase.rate !== 0 && purchase.rate ;
              }
            }
          const closingAmount = closingQuantity * closingRate;
          console.log(
            "closingQuantity=",
            currentOpening.quantity,
            purchase.quantity,
            issue.quantity
          );

          result.push({
            date,
            opening: { ...currentOpening },
            purchase,
            issue, // FIFO logic can go here

            closing: {
              quantity: closingQuantity,
              rate: closingRate,
              amount: closingAmount,
            },
          });

          // currentOpening = {
          //   quantity: closingQuantity,
          //   rate: closingRate,
          //   amount: closingAmount,
          // };
        }

        // prevOpening = { ...currentOpening };
      }
      // console.log("result", result);
      return result;
    };

    const processDateDefine = processStockData(
      purchaseGroupData,
      consumptionIssue,
      fromDate,
      toDate
    );
    console.log( 'processDateDefine',processDateDefine)
    return processDateDefine
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
