const express = require("express");
const userCreateRoute = require("../module/user/user.route");
const userRoleRoutes = require("../module/userrole/userrole.route");
const menuItemRoutes = require("../module/menus/menu.route");
const serialGenerate = require("../module/serialnogenerate/serialnogenerate.route");
const companyRoute = require("../module/companyinformation/companyinfo.route");
const itemsizeRoute = require("../module/itemsize/itemsize.route");
const itemunitRoute = require("../module/itemunitinfo/itemunit.route");
const finishgoodsinfoRoute = require("../module/finishgoodsinformation/finishgoods.route");
const rawmaterialRoute = require("../module/rawmaterialinformation/rawmaterialinfo.route");
const categoryInfoRoute = require("../module/categoryinformation/categoryinfo.route");
const cftInfoRoute = require("../module/cftinformation/cft.route");
const supplierInfoRoute = require("../module/supplierinformation/supplier.route");
const clientInfoRoute = require("../module/clientinformation/client.route");
const paymentInfoRoute = require("../module/paymentinformation/paymentinfo.route");
const bankInfoRoute = require("../module/bankinformation/bankinfo.route");
const purchaseOrderInfoRoute = require("../module/purchaseorderinformation/purchaseorderinfo.route");
const goodsReceiveNoteRoute = require("../module/goodsreceivenoteinformation/grninfo.route");
const productionRoute = require("../module/productioninformation/productioninfo.route");
const salesManagementRoute = require("../module/salesmanagement/salesmanagementinfo.route");
const paymentMethodInfoRoute = require("../module/paymentmethodinformation/paymentmethodinformation.route");
const deliveryOrderInfo = require("../module/deliveryorderinformation/deliveryorderinfo.route");
const finishGoodsDelivery = require("../module/finishgoodsdeliveryinfo/finishgoodsdeliveryinfo.route");
const returnDeliveredRoute = require("../module/deliveredreturninformation/deliveredreturninformation.route");
const salesReportViewRoute = require("../module/report/salesreportview/allreportview.route");
const productionReportViewRoute = require("../module/report/productionreportview/productionreport.route");
const combineReportRoute = require("../module/report/combinereport/combinereport.route");
const purchaseReportRoute = require("../module/report/purchasereport/purchasereport.route");
const stockReportRoute = require("../module/report/stockreport/stockreport.route");
const tokenCreate = require("../module/auth/auth.route");
const salesChart=require('../module/report/chartreport/chart.route')
const router = express.Router();

const moduleRoutes = [
  {
    path: "/users",
    route: userCreateRoute,
  },
  {
    path: "/jwt",
    route: tokenCreate,
  },
  {
    path: "/userrole",
    route: userRoleRoutes,
  },
  {
    path: "/menuitems",
    route: menuItemRoutes,
  },
  {
    path: "/serial",
    route: serialGenerate,
  },
  {
    path: "/company",
    route: companyRoute,
  },
  {
    path: "/itemsize",
    route: itemsizeRoute,
  },
  {
    path: "/itemunit",
    route: itemunitRoute,
  },
  {
    path: "/finishgoodsinfo",
    route: finishgoodsinfoRoute,
  },
  {
    path: "/rawmaterialinfo",
    route: rawmaterialRoute,
  },
  {
    path: "/categoryinfo",
    route: categoryInfoRoute,
  },
  {
    path: "/cftinfo",
    route: cftInfoRoute,
  },
  {
    path: "/supplierinfo",
    route: supplierInfoRoute,
  },
  {
    path: "/clientinfo",
    route: clientInfoRoute,
  },
  {
    path: "/paymentinfo",
    route: paymentInfoRoute,
  },
  {
    path: "/bankinfo",
    route: bankInfoRoute,
  },
  {
    path: "/purchaseorderinfo",
    route: purchaseOrderInfoRoute,
  },
  {
    path: "/grninfo",
    route: goodsReceiveNoteRoute,
  },
  {
    path: "/production",
    route: productionRoute,
  },
  {
    path: "/invoiceinfo",
    route: salesManagementRoute,
  },
  {
    path: "/payment-receive",
    route: paymentMethodInfoRoute,
  },
  {
    path: "/delivery-order",
    route: deliveryOrderInfo,
  },
  {
    path: "/finish-goods-delivery",
    route: finishGoodsDelivery,
  },
  {
    path: "/return-deliver",
    route: returnDeliveredRoute,
  },
  {
    path: "/report",
    route: salesReportViewRoute,
  },
  {
    path: "/production-report",
    route: productionReportViewRoute,
  },
  {
    path: "/combine-report",
    route: combineReportRoute,
  },
  {
    path: "/purchase-report",
    route: purchaseReportRoute,
  },
  {
    path: "/sales-chart",
    route: salesChart,
  },
  {
    path: "/stock-report",
    route: stockReportRoute,
  },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
module.exports = router;
