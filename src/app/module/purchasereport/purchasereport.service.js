const { errorlogger } = require("../../../shared/logger");
const PurchaseManagementModel = require("../goodsreceivenoteinformation/grninfo.model");

async function getFilteredForPurchaseReporDB(
  fromDate,
  toDate,
  itemId,
  supplierId,
  poId
) {
  try {
    console.log("purchase service", fromDate, toDate, itemId, supplierId, poId);
    const filter = {};
    if (fromDate) {
      filter.receiveDate = fromDate;
    }
    if (toDate) {
      filter.receiveDate = toDate;
    }
    if (fromDate && toDate) {
      filter.receiveDate = { $gte: fromDate, $lte: toDate };
    }

    if (supplierId) {
      filter.supplierId = supplierId;
    }

    if (poId) {
      filter.pOSingleId = poId;
    }

    if (Object.keys(filter).length === 0) {
      return [];
    }

    const data = await PurchaseManagementModel.find(filter).lean();

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
    console.log(error);
    throw new Error("Error fetching payment method info");
  }
}

async function getFilteredForSalesSummaryReportInfoDB(
  fromDate,
  toDate,
  itemId,
  supplierId,
  poId
) {
  try {
    console.log('summary service',fromDate,
      toDate,
      itemId,
      supplierId,
      poId)
    const filter = {};
    if (fromDate) {
      filter.receiveDate = fromDate;
    }
    if (toDate) {
      filter.receiveDate = toDate;
    }
    if (fromDate && toDate) {
      filter.receiveDate = {
        $gte: fromDate,
        $lte: toDate,
      };
    }

    if (supplierId) {
      filter.supplierId = supplierId;
    }

    if (poId) {
      filter.poId = poId;
    }

    if (Object.keys(filter).length === 0) {
      return [];
    }

    console.log('filters',filter)
    const data = await PurchaseManagementModel.find(filter).lean();
    console.log('data',data)
    if (!data.length) return [];

    const groupedData = {};

    // Process data and group by returnDate, itemId, supplierId, and poId
    data.forEach((item) => {
      item.detailsData.forEach((detail) => {
        const purchaseQty = parseInt(detail.quantity, 10);
        if (isNaN(purchaseQty)) return;
        const purchaseAmount = parseInt(detail.amount, 10);
        if (isNaN(purchaseAmount)) return;

        if (
          (!itemId || detail.itemId === itemId) &&
          (!supplierId || item.supplierId === supplierId) &&
          (!poId || item.pOSingleId === poId)
        ) {
          const dateKey = new Date(item.receiveDate)
            .toISOString()
            .split("T")[0];
          let key;

          if (itemId && supplierId && poId) {
            key = `${dateKey}-${detail.itemId}-${item.supplierId}-${item.pOSingleId}`;
          } else if (itemId && supplierId) {
            key = `${dateKey}-${detail.itemId}-${item.supplierId}`;
          } else if (supplierId && poId) {
            key = `${dateKey}-${item.supplierId}-${item.pOSingleId}`;
          } else if (itemId) {
            key = `${dateKey}-${detail.itemId}`;
          } else if (supplierId) {
            key = `${dateKey}-${item.supplierId}`;
          } else if (poId) {
            key = `${dateKey}-${item.pOSingleId}`;
          } else {
            key = `${dateKey}`;
          }

          if (!groupedData[key]) {
            groupedData[key] = {
              receiveDate: dateKey,
              itemId: detail.itemId,
              supplierId: item.supplierId,
              poId: item.pOSingleId,
              totalPurchaseQty: 0,
              totalPurchaseAmount: 0,
              unitPrice: detail.unitPrice,
            };
          }

          groupedData[key].totalPurchaseQty += purchaseQty;
          groupedData[key].totalPurchaseAmount += purchaseAmount;
        }
      });
    });

    return Object.values(groupedData);
  } catch (error) {
    console.log(error);
    throw new Error("Error fetching payment method info");
  }
}

module.exports = {
  getFilteredForPurchaseReporDB,
  getFilteredForSalesSummaryReportInfoDB,
};
