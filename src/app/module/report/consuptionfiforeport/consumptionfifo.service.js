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
    const prevPurchaseDate = await GRNModel.find({
      receiveDate: { $lt: fromDate },
    });
    const prevConsumptionIssue = await ConsumptionModel.find({
      productionDate: { $lt: new Date(fromDate) },
    });

    const consumptionIssue = await ConsumptionModel.aggregate([
      {
        $match: {
          itemId: itemId,
          productionDate: { $gte: fromDate, $lte: toDate },
        },
      },
    ]);
    console.log("consumptionIssue", consumptionIssue);
    // const purchaseData = await GRNModel.find(purchaseFilter);

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
    // console.log('purchaseData',purchaseData)

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

    const prevPurchaseGroup = {};
    prevPurchaseDate.forEach((items) => {
      items.detailsData.forEach((detail) => {
        let key;
        const dateKey = items.receiveDate;
        const itemKey = detail?.itemId;
        if (detail?.itemId) {
          key = `${itemKey}`;
        }

        if (!prevPurchaseGroup[key]) {
          prevPurchaseGroup[key] = {
            date: dateKey,
            itemId: detail?.itemId,
            totalQuantity: 0,
            avgRate: 0,
            totalAmount: 0,
          };
          prevPurchaseGroup[key].totalQuantity += detail?.quantity;
          prevPurchaseGroup[key].totalAmount += detail?.amount;
          prevPurchaseGroup[key].avgRate += prevPurchaseGroup[key]?.totalAmount
            ? prevPurchaseGroup[key]?.totalAmount /
              prevPurchaseGroup[key]?.totalQuantity
            : 0;
        }
      });
    });

    const prevConsumptionIssueGroup = {};
    prevConsumptionIssue.forEach((item) => {
      let key = `${item?.itemId}`;

      if (!prevConsumptionIssueGroup[key]) {
        prevConsumptionIssueGroup[key] = {
          date: new Date(item.productionDate).toLocaleDateString("en-CA"),
          itemId: item?.itemId,
          totalMaterialUsed: 0,
          totalAvgRate: 0,
          totalAmount: 0,
        };
        prevConsumptionIssueGroup[key].totalMaterialUsed += item?.materialUsed;
        prevConsumptionIssueGroup[key].totalAmount += item?.amount;
        prevConsumptionIssueGroup[key].totalAvgRate +=
          prevConsumptionIssueGroup[key]?.totalAmount
            ? prevConsumptionIssueGroup[key]?.totalAmount /
              prevConsumptionIssueGroup[key]?.totalMaterialUsed
            : 0;
      }
    });

    // console.log("prevConsumptionIssueGroup", prevConsumptionIssueGroup);
    const prevConsumptionIssueData = Object.values(prevConsumptionIssueGroup);
    const prevPurchaseData = Object.values(prevPurchaseGroup);
    const calculateOpeningBalance = prevPurchaseData.map((purchase, index) => {
      const prevConsumptionIssue = prevConsumptionIssueData.find(
        (issue) => issue?.itemId === purchase?.itemId
      );
      if (!prevConsumptionIssueData) return purchase;

      const updateAmount = purchase?.totalAmount
        ? purchase?.totalAmount - prevConsumptionIssue?.totalAmount
        : 0;
      const updateQuantity =
        purchase.totalQuantity - prevConsumptionIssue?.totalMaterialUsed;
      return {
        date: purchase.date,
        itemId: prevConsumptionIssue?.itemId
          ? prevConsumptionIssue?.itemId
          : "",
        amount: updateAmount ? updateAmount : 0,
        quantity: updateQuantity ? updateQuantity : 0,
        rate: updateQuantity ? updateAmount / updateQuantity : 0,
      };
    });

    // console.log("calculateOpeningBalance", calculateOpeningBalance);

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
      prevPurchaseData,
      consumptionIssue,
      fromDate,
      toDate
    ) => {
      const dateRange = getDateRange(fromDate, toDate);
      const formattedData = [];

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

      dateRange.forEach((dateStr, index) => {
        const openingQty = calculateOpeningBalance[index]?.quantity;
        const openingRate = calculateOpeningBalance[index]?.rate;
        const openingAmount =
          calculateOpeningBalance[index]?.quantity *
          calculateOpeningBalance[index]?.rate;

        const purchaseQty = purchaseGroupData[index]?.totalQuantity ?? "_";
        const purchaseRate = purchaseGroupData[index]?.avgRate ?? "_";
        const purchaseAmount =
          purchaseGroupData[index]?.totalQuantity *
            purchaseGroupData[index]?.avgRate ?? "-";

       const issueEntry = issueGroup.filter((item) => item.date === dateStr);
       let issueQuantity=0;
       let issueAmount =0;
       issueEntry.forEach((entry)=>{
        issueQuantity +=entry.totalQuantity || 0
        issueAmount +=entry.issueAmount || 0
       })
       const issueRate= issueQuantity ?  issueAmount / issueQuantity : 0;
      //  console.log('issueEntry',issueEntry)
        // const issueQuantity = issueGroup[index]?.totalQuantity;
        // const issueAmount = issueGroup[index]?.totalAmount;
        // const issueRate =
        //   issueGroup[index]?.totalAmount !== 0
        //     ? issueGroup[index]?.totalAmount / issueGroup[index]?.totalQuantity
        //     : 0;

        const closingQuantity = issueGroup[index]?.closingStock;
        const closingRate = issueGroup[index]?.rate;
        const closingAmount =
          issueGroup[index]?.closingStock !== 0
            ? issueGroup[index]?.closingStock * issueGroup[index]?.rate
            : 0;
       
            issueGroup.forEach((entry,index)=>{
              if(dateStr === entry?.date){
                formattedData.push({
                  date: dateStr ,
                  opening: {
                    quantity: openingQty,
                    rate: openingRate,
                    amount: openingAmount,
                  },
                  purchase: {
                    quantity: purchaseQty,
                    rate: purchaseRate,
                    amount: purchaseAmount,
                  },
                  issue: {
                    quantity: issueQuantity,
                    rate: issueRate,
                    amount: issueAmount,
                  },
                  closing: {
                    quantity: closingQuantity,
                    rate: closingRate,
                    amount: closingAmount,
                  },
                });
              }
              else{
                formattedData.push({
                  date: dateStr ,
                  opening: {
                    quantity: '',
                    rate: '',
                    amount: '',
                  },
                  purchase: {
                    quantity: '',
                    rate: '',
                    amount: '',
                  },
                  issue: {
                    quantity: '',
                    rate: '',
                    amount: '',
                  },
                  closing: {
                    quantity: '',
                    rate: '',
                    amount: '',
                  },
                });
              }
            })
            
      
      });
      console.log("formatedData", formattedData);
    };

    const processDateDefine = processStockData(
      prevPurchaseData,
      consumptionIssue,
      fromDate,
      toDate
    );
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
