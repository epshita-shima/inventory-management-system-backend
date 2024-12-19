const express =require('express');
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
// const cftInfoRoute = require("./app/module/cftinformation/cft.route");
// const supplierInfoRoute = require("./app/module/supplierinformation/supplier.route");
// const clientInfoRoute = require("./app/module/clientinformation/client.route");
// const paymentInfoRoute = require("./app/module/paymentinformation/paymentinfo.route");
// const bankInfoRoute = require("./app/module/bankinformation/bankinfo.route");
// const purchaseOrderInfoRoute = require("./app/module/purchaseorderinformation/purchaseorderinfo.route");
// const goodsReceiveNoteRoute = require("./app/module/goodsreceivenoteinformation/grninfo.route");
// const productionRoute = require("./app/module/productioninformation/productioninfo.route");
// const salesManagementRoute = require("./app/module/salesmanagement/salesmanagementinfo.route");
// const paymentMethodInfoRoute = require("./app/module/paymentmethodinformation/paymentmethodinformation.route");
// const deliveryOrderInfo = require("./app/module/deliveryorderinformation/deliveryorderinfo.route");
// const finishGoodsDelivery = require("./app/module/finishgoodsdeliveryinfo/finishgoodsdeliveryinfo.route");
// const returnDeliveredRoute = require("./app/module/deliveredreturninformation/deliveredreturninformation.route");
// const salesReportViewRoute = require("./app/module/salesreportview/allreportview.route");
// const productionReportViewRoute = require("./app/module/productionreportview/productionreport.route");
// const combineReportRoute = require("./app/module/combinereport/combinereport.route");
// const purchaseReportRoute = require("./app/module/purchasereport/purchasereport.route");
const router = express.Router();

const moduleRoutes = [
  {
    path: '/users',
    route: userCreateRoute,
  },
  {
    path: '/userrole',
    route: userRoleRoutes,
  },
  {
    path: '/menuitems',
    route: menuItemRoutes,
  },
  {
    path: '/serial',
    route: serialGenerate,
  },
  {
    path: '/company',
    route: companyRoute,
  },
  {
    path: '/itemsize',
    route: itemsizeRoute,
  },
  {
    path: '/itemunit',
    route: itemunitRoute,
  },
  {
    path: '/finishgoodsinfo',
    route: finishgoodsinfoRoute,
  },
  {
    path: '/rawmaterialinfo',
    route: rawmaterialRoute,
  },
  {
    path: '/categoryinfo',
    route: categoryInfoRoute,
  },

];
moduleRoutes.forEach(route => router.use(route.path, route.route));
module.exports=router