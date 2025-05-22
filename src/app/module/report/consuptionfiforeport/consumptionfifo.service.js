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

    const processPrevPurchaseData = (purchaseData) => {
      return purchaseData.flatMap((purchase) => {
        return purchase.detailsData.map((detail) => ({
          date: purchase.receiveDate,
          detailsId: detail._id.toString(),
          quantity: detail.quantity,
          rate: detail.unitPrice,
          amount: detail.amount,
        }));
      });
    };

    const processPrevConsumptionData = (consumptionData) => {
      return consumptionData.map((issue) => ({
        date: new Date(issue.productionDate).toISOString().split("T")[0],
        detailsId: issue.grnDetailsId,
        quantity: issue.materialUsed,
        rate: issue.rate,
        amount: issue.amount,
      }));
    };

    const issues = processPrevConsumptionData(prevConsumptionIssue);

    const purchases = processPrevPurchaseData(prevPurchaseData);

    const calculatePrevOpening = (purchases, issues, fromDate) => {
      const storePrevStock = [];

      // Get all unique detailsIds from both purchases and issues
      const allDetailsIds = new Set([
        ...purchases.map((p) => p.detailsId),
        ...issues.map((i) => i.detailsId),
      ]);

      allDetailsIds.forEach((detailsId) => {
        const purchase = purchases.find((p) => p.detailsId === detailsId);
        const issue = issues.find((i) => i.detailsId === detailsId);

        const purchaseQty = purchase?.quantity || 0;
        const issueQty = issue?.quantity || 0;

        const remainingQuantity = purchaseQty - issueQty;

        if (remainingQuantity !== 0) {
          const rate = issue?.rate || purchase?.rate || 0;
          const amount = remainingQuantity * rate;
          const date = issue?.date || purchase?.date;
          storePrevStock.push({
            date: date,
            detailsId: purchase?.detailsId,
            quantity: remainingQuantity,
            rate,
            amount,
          });
        }
      });

      return storePrevStock;
    };

    const prevOpening = calculatePrevOpening(purchases, issues, fromDate);

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

    const getDateRange = (fromDate, toDate) => {
      const dates = [];
      let current = new Date(fromDate);

      while (current <= new Date(toDate)) {
        dates.push(new Date(current).toISOString().split("T")[0]);
        current.setDate(current.getDate() + 1);
      }
      return dates;
    };

    // console.log("purchaseGroupData", purchaseGroupData);
    // console.log("consumptionIssue", consumptionIssue);

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
    //     groupedIssues[key].totalAmount += item.materialUsed * item.rate || 0;
    //     groupedIssues[key].closingStock += item.closingStock || 0;
    //   });

    //   const issueGroup = Object.values(groupedIssues);

    //   const result = [];

    //   let prevOpenings =
    //     prevOpening.length > 0
    //       ? prevOpening.map((item) => ({
    //           quantity: item.quantity,
    //           rate: item.rate,
    //           amount: item.amount,
    //           date: item.date,
    //           detailsId: item.detailsId,
    //         }))
    //       : [
    //           {
    //             quantity: 0,
    //             rate: 0,
    //             amount: 0,
    //             date: 0,
    //             detailsId: 0,
    //           },
    //         ];

    //   for (const [index, date] of dateRange.entries()) {
    //     const purchasesOnDate = purchaseGroupData.filter(
    //       (p) => p.date === date
    //     );
    //     const issuesOnDate = issueGroup.filter((i) => i.date === date);
    //     const openingsOnDate = prevOpenings.filter((o) => o.date === date);

    //     const maxLen = Math.max(
    //       openingsOnDate.length,
    //       purchasesOnDate.length,
    //       issuesOnDate.length,
    //       1
    //     );

    //     const dayClosings = [];
    //     console.log("prevOpenings", prevOpenings);
    //     for (let i = 0; i < maxLen; i++) {
    //       const opening = prevOpenings[i] || {
    //         quantity: 0,
    //         rate: 0,
    //         amount: 0,
    //         detailsId: 0,
    //         date: 0,
    //       };
    //       const purchase = purchasesOnDate[i]
    //         ? {
    //             quantity: purchasesOnDate[i].totalQuantity,
    //             rate: purchasesOnDate[i].avgRate,
    //             amount: purchasesOnDate[i].totalAmount,
    //             detailsId: purchasesOnDate[i].detailsId,
    //             date: purchasesOnDate[i]?.date,
    //           }
    //         : {
    //             quantity: 0,
    //             rate: 0,
    //             amount: 0,
    //             detailsId: prevOpenings[i]?.detailsId || 0,
    //             date: purchasesOnDate[i]?.date || 0,
    //           };

    //       const issue = issuesOnDate[i]
    //         ? {
    //             quantity: issuesOnDate[i].totalQuantity,
    //             rate: issuesOnDate[i].rate,
    //             amount:
    //               issuesOnDate[i].totalQuantity > 0 &&
    //               issuesOnDate[i].totalQuantity * issuesOnDate[i].rate,
    //             detailsId: issuesOnDate[i].grnDetailsId,
    //             date: issuesOnDate[i]?.date,
    //           }
    //         : {
    //             quantity: 0,
    //             rate: 0,
    //             amount: 0,
    //             detailsId: prevOpenings[i]?.grnDetailsId || 0,
    //             date: issuesOnDate[i]?.date || 0,
    //           };

    //       let closingRate =
    //         purchase.quantity > 0 && purchase.rate !== 0
    //           ? purchase.rate
    //           : opening.rate;
    //       let closingStockEntry;

    //       if (purchase.quantity === 0 && issue.quantity === 0 ) {
    //         console.log('date, opening',date,opening.date)

    //         // console.log('purchase and issue quantity is 0')
    //         closingStockEntry = {
    //           quantity: opening.quantity,
    //           rate: opening.rate,
    //           amount: opening.quantity * opening.rate,
    //           detailsId: opening.detailsId,
    //           date: opening.date,
    //         };
    //         // console.log("closingStockEntry p and i =0", closingStockEntry);
    //       } else if (
    //         issue.quantity > 0 &&
    //         purchase.quantity === 0 &&
    //         opening.detailsId.toString() === issue.detailsId.toString()
    //       ) {
    //         const newQuantity = Math.max(opening.quantity - issue.quantity, 0);
    //         const closingAmount = newQuantity * opening.rate;

    //         closingStockEntry = {
    //           quantity: newQuantity,
    //           rate: opening.rate,
    //           amount: closingAmount,
    //           detailsId: opening.detailsId,
    //           date: date,
    //         };
    //         // console.log("closingStockEntry p =0 and i >0", closingStockEntry);
    //       } else {
    //         const matchingIssues = issuesOnDate.filter(
    //           (iss) =>
    //             iss.grnDetailsId?.toString() ===
    //               purchase.detailsId?.toString() &&
    //             new Date(iss.date).toISOString().slice(0, 10) === date
    //         );
    //         // console.log("matchingIssues.length", matchingIssues.length);
    //         if (matchingIssues.length > 0) {
    //           const issuedQuantity = matchingIssues.reduce(
    //             (sum, iss) => sum + (iss.totalQuantity || 0),
    //             0
    //           );
    //           // console.log("matchingIssues", matchingIssues);
    //           const closingQuantity =
    //             (purchase.quantity || 0) - (issuedQuantity || 0);
    //           const closingAmount = closingQuantity * purchase.rate;

    //           closingStockEntry = {
    //             quantity: closingQuantity,
    //             rate: closingQuantity > 0 ? closingRate : 0,
    //             amount: closingAmount,
    //             detailsId: purchase.detailsId,
    //             date: purchase.date,
    //           };
              
    //         } else if (purchase.quantity > 0) {
    //           closingStockEntry = {
    //             quantity: purchase.quantity,
    //             rate: purchase.rate,
    //             amount: purchase.quantity * purchase.rate,
    //             detailsId: purchase.detailsId,
    //             date: purchase.date,
    //           };
    //         } else {
    //           closingStockEntry = {
    //             quantity: opening.quantity,
    //             rate: opening.rate,
    //             amount: opening.amount,
    //             detailsId: opening.detailsId,
    //             date: opening.date,
    //           };
    //         }
    //       }

    //       dayClosings.push(closingStockEntry);

    //       result.push({
    //         date,
    //         opening: {
    //           quantity: prevOpenings[i]?.quantity || 0,
    //           rate: prevOpenings[i]?.rate || 0,
    //           amount: prevOpenings[i]?.amount || 0,
    //           detailsId: prevOpenings[i]?.detailsId || 0,
    //           date: prevOpenings[i]?.date || 0,
    //         },

    //         purchase,
    //         issue,
    //         closing: closingStockEntry,
    //       });
    //     }
    //     const nextDayOpenings = [];

    //     for (const entry of result.filter(
    //       (item) =>
    //         item.date === date && item.closing && item.closing.quantity > 0
    //     )) {
    //       nextDayOpenings.push({
    //         ...entry.closing,
    //         date: getNextDate(date), 
    //       });
    //     }
    //     function getNextDate(currentDate) {
    //       const dateObj = new Date(currentDate);
    //       dateObj.setDate(dateObj.getDate() + 1);
    //       return dateObj.toISOString().split("T")[0];
    //     }
    //     prevOpenings = nextDayOpenings;
    //   }
    //   // console.log("result", result);
    //   const grouped = {};

    //   result.forEach((row) => {
    //     const getStringId = (id) => (id && id.toString ? id.toString() : "0");

    //     const purchaseId = getStringId(row.purchase?.detailsId);
    //     const issueId = getStringId(row.issue?.detailsId);
    //     const openingId = getStringId(row.opening?.detailsId);
    //     const closingId = getStringId(row.closing?.detailsId);

    //     if (purchaseId && purchaseId !== "0") {
    //       const key = `${row.date}_${purchaseId}`;

    //       if (!grouped[key]) {
    //         grouped[key] = { date: row.date, detailsId: purchaseId, rows: [] };
    //       }

    //       const existingRow = grouped[key].rows.find(
    //         (r) => r.date === row.date
    //       );

    //       if (existingRow) {
    //         // Merge purchase into existing row
    //         existingRow.purchase = {
    //           quantity: row.purchase?.quantity || 0,
    //           rate: row.purchase?.rate || 0,
    //           amount: row.purchase?.amount || 0,
    //           detailsId: purchaseId,
    //           date: row.date,
    //         };
    //       } else {
    //         // Create a new row
    //         const newRow = {
    //           date: row.date,
    //           purchase:
    //             row.purchase?.detailsId?.toString() === purchaseId
    //               ? row.purchase
    //               : zeroRow(),
    //           opening:
    //             row.opening?.detailsId?.toString() === purchaseId
    //               ? row.opening
    //               : zeroRow(),
    //           issue:
    //             row.issue?.detailsId?.toString() === purchaseId
    //               ? row.issue
    //               : zeroRow(),
    //           closing:
    //             row.closing?.detailsId?.toString() === purchaseId
    //               ? row.closing
    //               : zeroRow(),
    //         };

    //         grouped[key].rows.push(newRow);
    //       }
    //     }

    //     if (issueId !== "0" && issueId !== purchaseId) {
    //       const key = `${row.date}_${issueId}`;

    //       if (!grouped[key]) {
    //         grouped[key] = { date: row.date, detailsId: issueId, rows: [] };
    //       }

    //       // Try to find existing row by date
    //       const existingRow = grouped[key].rows.find(
    //         (r) => r.date === row.date
    //       );

    //       if (existingRow) {
    //         // Merge issue into existing row
    //         existingRow.issue = {
    //           quantity: row.issue?.quantity || 0,
    //           rate: row.issue?.rate || 0,
    //           amount: row.issue?.amount || 0,
    //           detailsId: issueId,
    //           date: row.date,
    //         };
    //       } else {
    //         // Create new row with purchase/issue/opening/closing
    //         const newRow = {
    //           date: row.date,
    //           opening:
    //             row.opening?.detailsId?.toString() === issueId
    //               ? row.opening
    //               : zeroRow(),
    //           purchase:
    //             row.purchase?.detailsId?.toString() === issueId
    //               ? row.purchase
    //               : zeroRow(),
    //           issue:
    //             row.issue?.detailsId?.toString() === issueId
    //               ? row.issue
    //               : zeroRow(),
    //           closing:
    //             row.closing?.detailsId?.toString() === issueId
    //               ? row.closing
    //               : zeroRow(),
    //         };

    //         grouped[key].rows.push(newRow);
    //       }
    //     }

    //     if (
    //       openingId &&
    //       openingId !== "0" &&
    //       openingId !== purchaseId &&
    //       openingId !== issueId
    //     ) {
    //       const key = `${row.date}_${openingId}`;

    //       if (!grouped[key]) {
    //         grouped[key] = { date: row.date, detailsId: openingId, rows: [] };
    //       }

    //       // Check if a row for this date already exists
    //       const existingRow = grouped[key].rows.find(
    //         (r) => r.date === row.date
    //       );

    //       if (existingRow) {
    //         // Merge opening into existing row
    //         existingRow.opening = {
    //           quantity: row.opening?.quantity || 0,
    //           rate: row.opening?.rate || 0,
    //           amount: row.opening?.amount || 0,
    //           detailsId: openingId,
    //           date: row.date,
    //         };
    //       } else {
    //         const newRow = {
    //           date: row.date,
    //           opening:
    //             row.opening?.detailsId?.toString() === openingId
    //               ? row.opening
    //               : zeroRow(),
    //           purchase: zeroRow(),
    //           issue: zeroRow(),
    //           closing:
    //             row.closing?.detailsId?.toString() === openingId
    //               ? row.closing
    //               : zeroRow(),
    //         };

    //         grouped[key].rows.push(newRow);
    //       }
    //     }

    //     if (
    //       closingId &&
    //       closingId !== "0" &&
    //       closingId !== purchaseId &&
    //       closingId !== issueId &&
    //       closingId !== openingId
    //     ) {
    //       const key = `${row.date}_${closingId}`;

    //       if (!grouped[key]) {
    //         grouped[key] = { date: row.date, detailsId: closingId, rows: [] };
    //       }

    //       const existingRow = grouped[key].rows.find(
    //         (r) => r.date === row.date
    //       );

    //       if (existingRow) {
    //         existingRow.closing = {
    //           quantity: row.closing?.quantity || 0,
    //           rate: row.closing?.rate || 0,
    //           amount: row.closing?.amount || 0,
    //           detailsId: closingId,
    //           date: row.date,
    //         };
    //       } else {
    //         const newRow = {
    //           date: row.date,
    //           opening: zeroRow(),
    //           purchase: zeroRow(),
    //           issue: zeroRow(),
    //           closing:
    //             row.closing?.detailsId?.toString() === closingId
    //               ? row.closing
    //               : zeroRow(),
    //         };

    //         grouped[key].rows.push(newRow);
    //       }
    //     }

    //     if (
    //       (!purchaseId || purchaseId === "0") &&
    //       (!issueId || issueId === "0") &&
    //       (!openingId || openingId === "0") &&
    //       (!closingId || closingId === "0")
    //     ) {
    //       const key = `${row.date}_dummy`;
    //       if (!grouped[key]) {
    //         grouped[key] = {
    //           date: row.date,
    //           detailsId: "dummy",
    //           rows: [
    //             {
    //               date: row.date,
    //               opening: zeroRow(),
    //               purchase: zeroRow(),
    //               issue: zeroRow(),
    //               closing: zeroRow(),
    //             },
    //           ],
    //         };
    //       }
    //     }
    //   });

    //   function zeroRow() {
    //     return {
    //       quantity: 0,
    //       rate: 0,
    //       amount: 0,
    //       detailsId: 0,
    //       date: 0,
    //     };
    //   }

    //   const finalResult = Object.values(grouped);
    //   // console.log(JSON.stringify(finalResult, null, 2));
    //   const allRows = finalResult.flatMap((item) => item.rows);
    //   // console.log("allRows", allRows);
    //   return allRows;
    // };

    // const processDateDefine = processStockData(
    //   purchaseGroupData,
    //   consumptionIssue,
    //   fromDate,
    //   toDate
    // );
    // // console.log("processDateDefine", processDateDefine);
    // return processDateDefine;
    // return consumptionIssue;
    // console.log(processDateDefine);
 
 const moment = require('moment');

function generateStockReport(fromDate, toDate, purchaseGroupData, consumptionIssue) {
  const dateRange = [];
  const start = moment(fromDate);
  const end = moment(toDate);
  while (start <= end) {
    dateRange.push(start.format('YYYY-MM-DD'));
    start.add(1, 'days');
  }

  const allDetailsIds = [
    ...new Set([
      ...purchaseGroupData.map(p => p.detailsId.toString()),
      ...consumptionIssue.map(c => c.grnDetailsId.toString()),
    ])
  ];

  const closingMap = {}; // key: detailsId, value: { quantity, rate, amount }

  const report = [];

  for (const date of dateRange) {
    for (const detailsId of allDetailsIds) {
      const id = detailsId.toString();

      const opening = closingMap[id] || { quantity: 0, rate: 0, amount: 0 };

      const purchaseItems = purchaseGroupData.filter(
        p => p.date === date && p.detailsId.toString() === id
      );

      const issueItems = consumptionIssue.filter(
        i => i.productionDate === date && i.grnDetailsId.toString() === id
      );

      const purchaseQty = purchaseItems.reduce((sum, p) => sum + p.totalQuantity, 0);
      const purchaseAmount = purchaseItems.reduce((sum, p) => sum + p.totalAmount, 0);
      const purchaseRate = purchaseQty ? +(purchaseAmount / purchaseQty).toFixed(2) : 0;

      const issueQty = issueItems.reduce((sum, i) => sum + i.materialUsed, 0);
     
      const issueRate =
  issueItems.length > 0
    ? +(issueItems.reduce((sum, i) => sum + (i.rate || 0), 0) / issueItems.length).toFixed(2)
    : 0;
     const issueAmount = issueQty ? +(issueQty * issueRate).toFixed(2) : 0;

      const closingQty = opening.quantity + purchaseQty - issueQty;
      const closingRate = purchaseQty ? purchaseRate : opening.rate;
      const closingAmount = +(closingQty * closingRate).toFixed(2);

      // Save new closing for carry-forward
      closingMap[id] = {
        quantity: closingQty,
        rate: closingRate,
        amount: closingAmount,
      };

      // Only push rows that have any transaction (optional: remove this if you want to show all)
      if (
        opening.quantity || purchaseQty || issueQty || closingQty
      ) {
        report.push({
          date,
          detailsId: id,
          opening: { ...opening },
          purchase: {
            quantity: purchaseQty,
            rate: purchaseRate,
            amount: purchaseAmount
          },
          issue: {
            quantity: issueQty,
            rate: issueRate,
            amount: issueAmount
          },
          closing: {
            quantity: closingQty,
            rate: closingRate,
            amount: closingAmount
          }
        });
      }
    }
  }

  return report;
}

 const report = generateStockReport('2025-04-01', '2025-04-30', purchaseGroupData, consumptionIssue);
  return report

  } catch (error) {
    console.log(error);
    throw new Error("Error fetching payment method info");
  }
};

module.exports = {
  getConsumptionDB,
};
