/**
 * Development-only sample data for the Inventory Management system.
 *
 * Usage (from inventroy-management-server):
 *   npm run seed:dev
 *
 * Duplicate-safe: skips records that already match business keys.
 * Does not create/update users, roles, menus, or overwrite existing company.
 */
const mongoose = require("mongoose");
const config = require("../src/config");

const Company = require("../src/app/module/companyinformation/companyinfo.model");
const CategoryModel = require("../src/app/module/categoryinformation/categoryinfo.model");
const UnitModel = require("../src/app/module/itemunitinfo/itemunit.model");
const SizeModel = require("../src/app/module/itemsize/itemsize.model");
const PaymentInfoModel = require("../src/app/module/paymentinformation/paymentinfo.model");
const BankInfoModel = require("../src/app/module/bankinformation/bankinfo.model");
const SupplierModel = require("../src/app/module/supplierinformation/supplier.model");
const ClientModel = require("../src/app/module/clientinformation/client.model");
const RMItemInfoModel = require("../src/app/module/rawmaterialinformation/rawmaterialinfo.model");
const FGItemInfoModel = require("../src/app/module/finishgoodsinformation/finishgoods.model");
const CFTInfoModel = require("../src/app/module/cftinformation/cft.model");
const PurchaseOrderInfoModel = require("../src/app/module/purchaseorderinformation/purchaseorderinfo.model");
const GoodsReceiveNoteInfoModel = require("../src/app/module/goodsreceivenoteinformation/grninfo.model");
const ProductionInfoModel = require("../src/app/module/productioninformation/productioninfo.model");
const RMConsumptionDetailModel = require("../src/app/module/rmconsumptiondetailbynetworth/rmconsumptiondetail.model");
const SalesManagementModel = require("../src/app/module/salesmanagement/salesmanagementinfo.model");
const PaymentReceiveInfoModel = require("../src/app/module/paymentmethodinformation/paymentmethodinformation.model");
const DOInfoModel = require("../src/app/module/deliveryorderinformation/deliveryorderinfo.module");
const FinishGoodsDeliveryInfoModel = require("../src/app/module/finishgoodsdeliveryinfo/finishgoodsdeliveryinfo.model");
const User = require("../src/app/module/user/user.model");
const SerialNoGenerate = require("../src/app/module/serialnogenerate/serialnogenerate.model");

const MAKE_DATE = "2026-08-12";
const summary = {};

function record(collection, action) {
  if (!summary[collection]) {
    summary[collection] = { created: 0, skipped: 0 };
  }
  summary[collection][action] += 1;
}

async function upsertOne(Model, collection, filter, payload) {
  const existing = await Model.findOne(filter);
  if (existing) {
    record(collection, "skipped");
    return existing;
  }
  const created = await Model.create(payload);
  record(collection, "created");
  return created;
}

async function ensureSerial(type, serialNo, makeby) {
  const existing = await SerialNoGenerate.findOne({ type });
  if (existing) {
    if (existing.serialNo < serialNo) {
      existing.serialNo = serialNo;
      existing.updateby = makeby;
      await existing.save();
      record("serialnogenerates", "created");
      return existing;
    }
    record("serialnogenerates", "skipped");
    return existing;
  }
  const created = await SerialNoGenerate.create({
    serialNo,
    type,
    year: "2026",
    makeby,
    updateby: "",
  });
  record("serialnogenerates", "created");
  return created;
}

async function main() {
  if (!config.database_url) {
    throw new Error("DATABASE_URL is not set");
  }

  await mongoose.connect(config.database_url);
  console.log("Connected to MongoDB database:", mongoose.connection.name);

  const company = await Company.findOne();
  if (!company) {
    throw new Error("No company found. Create a company record before seeding.");
  }
  console.log("Reusing company:", company.companyName, String(company._id));

  const maker =
    (await User.findOne({ username: "Super-05" })) ||
    (await User.findOne({ isactive: true }));
  const makeBy = maker?.username || "Super-05";

  const clay = await upsertOne(
    CategoryModel,
    "categoryinformations",
    { categoryInfo: "Clay & Soil" },
    {
      categoryInfo: "Clay & Soil",
      makeBy,
      makeDate: MAKE_DATE,
    }
  );
  const fuel = await upsertOne(
    CategoryModel,
    "categoryinformations",
    { categoryInfo: "Fuel" },
    { categoryInfo: "Fuel", makeBy, makeDate: MAKE_DATE }
  );
  const sand = await upsertOne(
    CategoryModel,
    "categoryinformations",
    { categoryInfo: "Sand & Aggregate" },
    { categoryInfo: "Sand & Aggregate", makeBy, makeDate: MAKE_DATE }
  );
  await upsertOne(
    CategoryModel,
    "categoryinformations",
    { categoryInfo: "Chemical Additive" },
    { categoryInfo: "Chemical Additive", makeBy, makeDate: MAKE_DATE }
  );
  await upsertOne(
    CategoryModel,
    "categoryinformations",
    { categoryInfo: "Packaging" },
    { categoryInfo: "Packaging", makeBy, makeDate: MAKE_DATE }
  );

  const unitKg = await upsertOne(
    UnitModel,
    "itemunitinfos",
    { unitInfo: "Kg" },
    { unitInfo: "Kg", makeBy, makeDate: MAKE_DATE }
  );
  const unitMt = await upsertOne(
    UnitModel,
    "itemunitinfos",
    { unitInfo: "MT" },
    { unitInfo: "MT", makeBy, makeDate: MAKE_DATE }
  );
  const unitCft = await upsertOne(
    UnitModel,
    "itemunitinfos",
    { unitInfo: "CFT" },
    { unitInfo: "CFT", makeBy, makeDate: MAKE_DATE }
  );
  const unitPcs = await upsertOne(
    UnitModel,
    "itemunitinfos",
    { unitInfo: "Pcs" },
    { unitInfo: "Pcs", makeBy, makeDate: MAKE_DATE }
  );
  const unitLitre = await upsertOne(
    UnitModel,
    "itemunitinfos",
    { unitInfo: "Litre" },
    { unitInfo: "Litre", makeBy, makeDate: MAKE_DATE }
  );

  const size10 = await upsertOne(
    SizeModel,
    "itemsizes",
    { sizeInfo: "10 inch" },
    { sizeInfo: "10 inch", makeBy, makeDate: MAKE_DATE }
  );
  await upsertOne(
    SizeModel,
    "itemsizes",
    { sizeInfo: "5 inch" },
    { sizeInfo: "5 inch", makeBy, makeDate: MAKE_DATE }
  );
  const sizeHollow = await upsertOne(
    SizeModel,
    "itemsizes",
    { sizeInfo: "Hollow Block" },
    { sizeInfo: "Hollow Block", makeBy, makeDate: MAKE_DATE }
  );
  const sizePaver = await upsertOne(
    SizeModel,
    "itemsizes",
    { sizeInfo: "Paver" },
    { sizeInfo: "Paver", makeBy, makeDate: MAKE_DATE }
  );

  const payCash = await upsertOne(
    PaymentInfoModel,
    "paymentinformations",
    { paymentMode: "Cash", paymentType: "cash" },
    {
      paymentMode: "Cash",
      paymentType: "cash",
      makeBy,
      makeDate: MAKE_DATE,
    }
  );
  await upsertOne(
    PaymentInfoModel,
    "paymentinformations",
    { paymentMode: "LC At Sight", paymentType: "lcatsight" },
    {
      paymentMode: "LC At Sight",
      paymentType: "lcatsight",
      makeBy,
      makeDate: MAKE_DATE,
    }
  );

  const dbbl = await upsertOne(
    BankInfoModel,
    "bankinformations",
    { accountNumber: "150110123456" },
    {
      accountNumber: "150110123456",
      accountName: "ABC Bricks & Concrete Product",
      bankName: "Dutch-Bangla Bank PLC",
      branchName: "Motijheel",
      city: "Dhaka",
      address: "Motijheel C/A, Dhaka-1000",
      routingNumber: "090270325",
      swiftCode: "DBBLBDDH",
      makeBy,
      makeDate: MAKE_DATE,
    }
  );
  await upsertOne(
    BankInfoModel,
    "bankinformations",
    { accountNumber: "205120678901" },
    {
      accountNumber: "205120678901",
      accountName: "ABC Bricks & Concrete Product",
      bankName: "BRAC Bank PLC",
      branchName: "Gulshan",
      city: "Dhaka",
      address: "Gulshan Avenue, Dhaka-1212",
      routingNumber: "060261726",
      swiftCode: "BRAKBDDH",
      makeBy,
      makeDate: MAKE_DATE,
    }
  );

  const padma = await upsertOne(
    SupplierModel,
    "supplierinformations",
    { supplierShortName: "PADMA-CLAY" },
    {
      supplierName: "Padma Clay & Sand Traders",
      supplierShortName: "PADMA-CLAY",
      email: "sales@padmaclay.com.bd",
      mobileNo: "01711001122",
      contactPerson: "Md. Rafiqul Islam",
      binNo: "000123456-0101",
      tradeLicenceNo: "TRD-DHA-88421",
      tinNo: "112233445566",
      address: "Savar Bazar Road, Savar, Dhaka",
      isActive: true,
      supplierApproveStatus: true,
      supplierApproveDate: "2026-08-10",
      isAccountPostingStatus: false,
      makeBy,
      makeDate: MAKE_DATE,
    }
  );
  const jamuna = await upsertOne(
    SupplierModel,
    "supplierinformations",
    { supplierShortName: "JAMUNA-COAL" },
    {
      supplierName: "Jamuna Coal Supply Ltd",
      supplierShortName: "JAMUNA-COAL",
      email: "ops@jamunacoal.com.bd",
      mobileNo: "01812002233",
      contactPerson: "Shahidul Haque",
      binNo: "000234567-0202",
      tradeLicenceNo: "TRD-NAR-55102",
      tinNo: "223344556677",
      address: "Fatullah, Narayanganj",
      isActive: true,
      supplierApproveStatus: true,
      supplierApproveDate: "2026-08-10",
      isAccountPostingStatus: false,
      makeBy,
      makeDate: MAKE_DATE,
    }
  );
  await upsertOne(
    SupplierModel,
    "supplierinformations",
    { supplierShortName: "MEGHNA-FUEL" },
    {
      supplierName: "Meghna Fuel & Lubricants",
      supplierShortName: "MEGHNA-FUEL",
      email: "info@meghnafuel.com.bd",
      mobileNo: "01613003344",
      contactPerson: "Nasrin Akter",
      binNo: "000345678-0303",
      tradeLicenceNo: "TRD-CTG-33918",
      tinNo: "334455667788",
      address: "Agrabad, Chattogram",
      isActive: true,
      supplierApproveStatus: true,
      supplierApproveDate: "2026-08-11",
      isAccountPostingStatus: false,
      makeBy,
      makeDate: MAKE_DATE,
    }
  );

  const confidence = await upsertOne(
    ClientModel,
    "clientinformations",
    { clientShortName: "CONF-CEM" },
    {
      clientName: "Confidence Cement Construction Ltd",
      clientShortName: "CONF-CEM",
      email: "procurement@confidence.com.bd",
      mobileNo: "01714004455",
      contactPerson: "Engr. Tanvir Ahmed",
      binNo: "000456789-0404",
      tinNo: "445566778899",
      address: "Agrabad C/A, Chattogram",
      remarks: "Regular bulk brick buyer",
      isActive: true,
      clientApproveStatus: true,
      clientApproveDate: "2026-08-11",
      isAccountPostingStatus: false,
      makeBy,
      makeDate: MAKE_DATE,
    }
  );
  const sheltech = await upsertOne(
    ClientModel,
    "clientinformations",
    { clientShortName: "SHELTECH" },
    {
      clientName: "Sheltech Properties Ltd",
      clientShortName: "SHELTECH",
      email: "store@sheltech-bd.com",
      mobileNo: "01815005566",
      contactPerson: "Farhana Yasmin",
      binNo: "000567890-0505",
      tinNo: "556677889900",
      address: "Gulshan-2, Dhaka-1212",
      remarks: "Apartment project supply",
      isActive: true,
      clientApproveStatus: true,
      clientApproveDate: "2026-08-11",
      isAccountPostingStatus: false,
      makeBy,
      makeDate: MAKE_DATE,
    }
  );
  await upsertOne(
    ClientModel,
    "clientinformations",
    { clientShortName: "RANGS" },
    {
      clientName: "Rangs Properties Ltd",
      clientShortName: "RANGS",
      email: "purchase@rangs.com.bd",
      mobileNo: "01916006677",
      contactPerson: "Kamrul Hasan",
      binNo: "000678901-0606",
      tinNo: "667788990011",
      address: "Tejgaon I/A, Dhaka",
      remarks: "Site delivery required",
      isActive: true,
      clientApproveStatus: true,
      clientApproveDate: "2026-08-12",
      isAccountPostingStatus: false,
      makeBy,
      makeDate: MAKE_DATE,
    }
  );

  const ballClay = await upsertOne(
    RMItemInfoModel,
    "rmiteminformations",
    { itemName: "Ball Clay" },
    {
      itemName: "Ball Clay",
      categoryId: String(clay._id),
      unitId: String(unitMt._id),
      openingStock: "250",
      openingDate: "2026-07-01",
      cftDeclaration: false,
      description: "Local ball clay for brick body mix",
      itemStatus: true,
      ledgerApproveStatus: false,
      makeBy,
      makeDate: MAKE_DATE,
    }
  );
  const riverSand = await upsertOne(
    RMItemInfoModel,
    "rmiteminformations",
    { itemName: "River Sand" },
    {
      itemName: "River Sand",
      categoryId: String(sand._id),
      unitId: String(unitCft._id),
      openingStock: "1800",
      openingDate: "2026-07-01",
      cftDeclaration: true,
      description: "Washed river sand for mix ratio",
      itemStatus: true,
      ledgerApproveStatus: false,
      makeBy,
      makeDate: MAKE_DATE,
    }
  );
  const steamCoal = await upsertOne(
    RMItemInfoModel,
    "rmiteminformations",
    { itemName: "Steam Coal" },
    {
      itemName: "Steam Coal",
      categoryId: String(fuel._id),
      unitId: String(unitMt._id),
      openingStock: "80",
      openingDate: "2026-07-01",
      cftDeclaration: false,
      description: "Imported steam coal for kiln",
      itemStatus: true,
      ledgerApproveStatus: false,
      makeBy,
      makeDate: MAKE_DATE,
    }
  );
  await upsertOne(
    RMItemInfoModel,
    "rmiteminformations",
    { itemName: "Diesel" },
    {
      itemName: "Diesel",
      categoryId: String(fuel._id),
      unitId: String(unitLitre._id),
      openingStock: "5000",
      openingDate: "2026-07-01",
      cftDeclaration: false,
      description: "HSD for generator and loader",
      itemStatus: true,
      ledgerApproveStatus: false,
      makeBy,
      makeDate: MAKE_DATE,
    }
  );
  await upsertOne(
    RMItemInfoModel,
    "rmiteminformations",
    { itemName: "Rice Husk" },
    {
      itemName: "Rice Husk",
      categoryId: String(fuel._id),
      unitId: String(unitKg._id),
      openingStock: "12000",
      openingDate: "2026-07-01",
      cftDeclaration: false,
      description: "Rice husk blending fuel",
      itemStatus: true,
      ledgerApproveStatus: false,
      makeBy,
      makeDate: MAKE_DATE,
    }
  );

  const firstClass = await upsertOne(
    FGItemInfoModel,
    "fgiteminformations",
    { itemName: "1st Class Machine Brick" },
    {
      itemName: "1st Class Machine Brick",
      sizeId: String(size10._id),
      unitId: String(unitPcs._id),
      openingStock: "50000",
      openingDate: "2026-07-01",
      itemStatus: true,
      productionQtyPerBatch: "12000",
      ledgerApproveStatus: false,
      makeBy,
      makeDate: MAKE_DATE,
    }
  );
  await upsertOne(
    FGItemInfoModel,
    "fgiteminformations",
    { itemName: "2nd Class Brick" },
    {
      itemName: "2nd Class Brick",
      sizeId: String(size10._id),
      unitId: String(unitPcs._id),
      openingStock: "30000",
      openingDate: "2026-07-01",
      itemStatus: true,
      productionQtyPerBatch: "10000",
      ledgerApproveStatus: false,
      makeBy,
      makeDate: MAKE_DATE,
    }
  );
  const hollowBlock = await upsertOne(
    FGItemInfoModel,
    "fgiteminformations",
    { itemName: "Hollow Block 5 inch" },
    {
      itemName: "Hollow Block 5 inch",
      sizeId: String(sizeHollow._id),
      unitId: String(unitPcs._id),
      openingStock: "8000",
      openingDate: "2026-07-01",
      itemStatus: true,
      productionQtyPerBatch: "2000",
      ledgerApproveStatus: false,
      makeBy,
      makeDate: MAKE_DATE,
    }
  );
  await upsertOne(
    FGItemInfoModel,
    "fgiteminformations",
    { itemName: "Concrete Paver" },
    {
      itemName: "Concrete Paver",
      sizeId: String(sizePaver._id),
      unitId: String(unitPcs._id),
      openingStock: "4000",
      openingDate: "2026-07-01",
      itemStatus: true,
      productionQtyPerBatch: "1500",
      ledgerApproveStatus: false,
      makeBy,
      makeDate: MAKE_DATE,
    }
  );

  const existingCft = await CFTInfoModel.findOne({
    "detailsData.itemId": String(riverSand._id),
  });
  if (existingCft) {
    record("cftinformations", "skipped");
  } else {
    await CFTInfoModel.create({
      openingDate: "2026-07-01",
      detailsData: [
        { itemId: String(riverSand._id), cftPerKg: "0.035" },
      ],
      isActive: true,
      makeBy,
      makeDate: MAKE_DATE,
    });
    record("cftinformations", "created");
  }

  const po1 = await upsertOne(
    PurchaseOrderInfoModel,
    "purchaseorderinformations",
    { poNo: "PO-2026-SEED-001" },
    {
      poNo: "PO-2026-SEED-001",
      supplierId: String(padma._id),
      currencyId: "BDT",
      paymentId: String(payCash._id),
      bankId: String(dbbl._id),
      deliveryDate: "2026-08-20",
      grandTotalAmount: 121000,
      grandTotalQuantity: 240,
      approveStatus: true,
      approveBy: makeBy,
      approveDate: "2026-08-14",
      makeBy,
      makeDate: new Date("2026-08-13"),
      remarks: "Clay and sand for kiln mix - Valuka factory",
      detailsData: [
        {
          itemId: String(ballClay._id),
          itemDescription: "Ball clay, moisture < 12%",
          quantity: 40,
          unitPrice: 2800,
          totalAmount: 112000,
        },
        {
          itemId: String(riverSand._id),
          itemDescription: "Washed river sand",
          quantity: 200,
          unitPrice: 45,
          totalAmount: 9000,
        },
      ],
    }
  );

  const po2 = await upsertOne(
    PurchaseOrderInfoModel,
    "purchaseorderinformations",
    { poNo: "PO-2026-SEED-002" },
    {
      poNo: "PO-2026-SEED-002",
      supplierId: String(jamuna._id),
      currencyId: "BDT",
      paymentId: String(payCash._id),
      bankId: String(dbbl._id),
      deliveryDate: "2026-08-22",
      grandTotalAmount: 462500,
      grandTotalQuantity: 25,
      approveStatus: true,
      approveBy: makeBy,
      approveDate: "2026-08-15",
      makeBy,
      makeDate: new Date("2026-08-14"),
      remarks: "Steam coal for Hoffman kiln",
      detailsData: [
        {
          itemId: String(steamCoal._id),
          itemDescription: "Steam coal GCV 5500+",
          quantity: 25,
          unitPrice: 18500,
          totalAmount: 462500,
        },
      ],
    }
  );

  const po1ClayLine = po1.detailsData.find(
    (d) => d.itemId === String(ballClay._id)
  );
  const po1SandLine = po1.detailsData.find(
    (d) => d.itemId === String(riverSand._id)
  );
  const po2CoalLine = po2.detailsData.find(
    (d) => d.itemId === String(steamCoal._id)
  );

  if (!po1ClayLine || !po1SandLine || !po2CoalLine) {
    throw new Error("Purchase order detail lines missing; cannot seed GRN");
  }

  const grn1 = await upsertOne(
    GoodsReceiveNoteInfoModel,
    "goodsreceivenoteinfos",
    { grnSerialNo: "GRN-2026-SEED-001" },
    {
      pOSingleId: String(po1._id),
      grnSerialNo: "GRN-2026-SEED-001",
      supplierId: String(padma._id),
      supplierPoNo: "PO-2026-SEED-001",
      receiveDate: "2026-08-21",
      challanNo: "CH-PADMA-8821",
      grandTotalQuantity: "240",
      grandTotalReceivedQuantity: "240",
      grandTotalAmount: "121000",
      isAccountPostingStatus: false,
      makeBy,
      makeDate: "2026-08-21",
      detailsData: [
        {
          pOSingleId: String(po1ClayLine._id),
          itemId: String(ballClay._id),
          quantity: 40,
          previousReceivedQuantity: 0,
          unitPrice: 2800,
          amount: 112000,
        },
        {
          pOSingleId: String(po1SandLine._id),
          itemId: String(riverSand._id),
          quantity: 200,
          previousReceivedQuantity: 0,
          unitPrice: 45,
          amount: 9000,
        },
      ],
    }
  );

  const grn2 = await upsertOne(
    GoodsReceiveNoteInfoModel,
    "goodsreceivenoteinfos",
    { grnSerialNo: "GRN-2026-SEED-002" },
    {
      pOSingleId: String(po2._id),
      grnSerialNo: "GRN-2026-SEED-002",
      supplierId: String(jamuna._id),
      supplierPoNo: "PO-2026-SEED-002",
      receiveDate: "2026-08-23",
      challanNo: "CH-JAMUNA-7723",
      grandTotalQuantity: "25",
      grandTotalReceivedQuantity: "25",
      grandTotalAmount: "462500",
      isAccountPostingStatus: false,
      makeBy,
      makeDate: "2026-08-23",
      detailsData: [
        {
          pOSingleId: String(po2CoalLine._id),
          itemId: String(steamCoal._id),
          quantity: 25,
          previousReceivedQuantity: 0,
          unitPrice: 18500,
          amount: 462500,
        },
      ],
    }
  );

  const grnClay = grn1.detailsData.find((d) => d.itemId === String(ballClay._id));
  const grnSand = grn1.detailsData.find((d) => d.itemId === String(riverSand._id));
  const grnCoal = grn2.detailsData.find((d) => d.itemId === String(steamCoal._id));

  await upsertOne(
    ProductionInfoModel,
    "prodctioninformations",
    { batchNo: "BAT-SEED-001" },
    {
      productionDate: "2026-08-25",
      batchNo: "BAT-SEED-001",
      totalBatch: "1",
      receipeQtyRatio: "1",
      productionItemName: String(firstClass._id),
      productionQty: 11800,
      productionStart: new Date("2026-08-25T06:00:00.000Z"),
      productionEnd: new Date("2026-08-25T18:00:00.000Z"),
      totalHour: 12,
      wastageQty: 200,
      expectedProductionQtyPerBatch: 12000,
      expectedProductionQty: 12000,
      excessOrLessProductionQty: -200,
      productionStatus: "Less",
      makeBy,
      makeDate: new Date("2026-08-25"),
      detailsData: [
        {
          itemId: String(ballClay._id),
          receipe: 8,
          materialUsed: 8.2,
          asPerRatio: 8,
          excess: 0.2,
          less: 0,
          consumptionStatus: "Excess",
        },
        {
          itemId: String(riverSand._id),
          receipe: 30,
          materialUsed: 29.5,
          asPerRatio: 30,
          excess: 0,
          less: 0.5,
          consumptionStatus: "Less",
        },
        {
          itemId: String(steamCoal._id),
          receipe: 2.5,
          materialUsed: 2.5,
          asPerRatio: 2.5,
          excess: 0,
          less: 0,
          consumptionStatus: "No Change",
        },
      ],
    }
  );

  await upsertOne(
    ProductionInfoModel,
    "prodctioninformations",
    { batchNo: "BAT-SEED-002" },
    {
      productionDate: "2026-08-28",
      batchNo: "BAT-SEED-002",
      totalBatch: "1",
      receipeQtyRatio: "1",
      productionItemName: String(hollowBlock._id),
      productionQty: 2050,
      productionStart: new Date("2026-08-28T06:30:00.000Z"),
      productionEnd: new Date("2026-08-28T16:30:00.000Z"),
      totalHour: 10,
      wastageQty: 40,
      expectedProductionQtyPerBatch: 2000,
      expectedProductionQty: 2000,
      excessOrLessProductionQty: 50,
      productionStatus: "Excess",
      makeBy,
      makeDate: new Date("2026-08-28"),
      detailsData: [
        {
          itemId: String(ballClay._id),
          receipe: 3,
          materialUsed: 3,
          asPerRatio: 3,
          excess: 0,
          less: 0,
          consumptionStatus: "No Change",
        },
        {
          itemId: String(riverSand._id),
          receipe: 18,
          materialUsed: 18.4,
          asPerRatio: 18,
          excess: 0.4,
          less: 0,
          consumptionStatus: "Excess",
        },
      ],
    }
  );

  const consumptionRows = [
    {
      productionDate: "2026-08-25",
      itemId: String(ballClay._id),
      grnDetailsId: String(grnClay._id),
      quantity: 40,
      rate: 2800,
      amount: 22960,
      materialUsed: 8.2,
      closingStock: 31.8,
    },
    {
      productionDate: "2026-08-25",
      itemId: String(riverSand._id),
      grnDetailsId: String(grnSand._id),
      quantity: 200,
      rate: 45,
      amount: 1327.5,
      materialUsed: 29.5,
      closingStock: 170.5,
    },
    {
      productionDate: "2026-08-25",
      itemId: String(steamCoal._id),
      grnDetailsId: String(grnCoal._id),
      quantity: 25,
      rate: 18500,
      amount: 46250,
      materialUsed: 2.5,
      closingStock: 22.5,
    },
  ];

  for (const row of consumptionRows) {
    await upsertOne(
      RMConsumptionDetailModel,
      "rmconsumptiondetailbyfifos",
      {
        productionDate: row.productionDate,
        itemId: row.itemId,
        grnDetailsId: row.grnDetailsId,
      },
      {
        ...row,
        makeBy,
        makeDate: new Date(row.productionDate),
      }
    );
  }

  const pi1 = await upsertOne(
    SalesManagementModel,
    "invoiceinformations",
    { invoiceNo: "PI-2026-SEED-001" },
    {
      piDate: new Date("2026-09-01"),
      expireDate: new Date("2026-09-30"),
      invoiceNo: "PI-2026-SEED-001",
      customerID: String(confidence._id),
      paymentId: String(payCash._id),
      currency: "BDT",
      shipmentNo: 1,
      approveBy: makeBy,
      approveDate: new Date("2026-09-02"),
      isApproved: true,
      mktPerson: makeBy,
      makeBy,
      makeDate: new Date("2026-09-01"),
      detailsData: [
        {
          itemId: String(firstClass._id),
          description: "1st class machine brick, 10 inch",
          quantity: 20000,
          unitPrice: 12.5,
          totalAmount: 250000,
          specialApproveForDelivary: false,
          deliveredQty: 8000,
          returnQty: 0,
        },
      ],
    }
  );

  const pi2 = await upsertOne(
    SalesManagementModel,
    "invoiceinformations",
    { invoiceNo: "PI-2026-SEED-002" },
    {
      piDate: new Date("2026-09-05"),
      expireDate: new Date("2026-10-05"),
      invoiceNo: "PI-2026-SEED-002",
      customerID: String(sheltech._id),
      paymentId: String(payCash._id),
      currency: "BDT",
      shipmentNo: 1,
      approveBy: makeBy,
      approveDate: new Date("2026-09-06"),
      isApproved: true,
      mktPerson: makeBy,
      makeBy,
      makeDate: new Date("2026-09-05"),
      detailsData: [
        {
          itemId: String(hollowBlock._id),
          description: "Hollow block 5 inch",
          quantity: 5000,
          unitPrice: 38,
          totalAmount: 190000,
          specialApproveForDelivary: false,
          deliveredQty: 0,
          returnQty: 0,
        },
      ],
    }
  );

  const pi1Line = pi1.detailsData[0];

  await upsertOne(
    PaymentReceiveInfoModel,
    "paymentreceiveinformations",
    { piNumber: String(pi1._id) },
    {
      clientId: String(confidence._id),
      piNumber: String(pi1._id),
      makeBy,
      makeDate: new Date("2026-09-03"),
      detailsData: [
        {
          paymentReceiveDate: new Date("2026-09-03"),
          paymentMethod: "cash",
          paymentStatus: "cash",
          itemId: String(firstClass._id),
          piDetailsId: String(pi1Line._id),
          amount: 100000,
          unitPrice: 12.5,
          quantity: 8000,
          remarks: "Partial cash against PI-2026-SEED-001",
        },
      ],
    }
  );

  const do1 = await upsertOne(
    DOInfoModel,
    "deliveryorderinformations",
    { doNo: "DO-20260908-1" },
    {
      piId: String(pi1._id),
      doNo: "DO-20260908-1",
      clientId: String(confidence._id),
      mushokChallanNo: "MUSHOK-6.3-8821",
      deliveryChallanNo: "1",
      shipmentNo: "2",
      approveStatus: true,
      approveBy: makeBy,
      approveDate: new Date("2026-09-08"),
      deliveryStatus: true,
      makeBy,
      makeDate: new Date("2026-09-08"),
      detailsData: [
        {
          piDetailsId: String(pi1Line._id),
          itemId: String(firstClass._id),
          previousDelivaryQty: "0",
          returnQty: "0",
          deliverQty: "8000",
          piId: String(pi1._id),
        },
      ],
    }
  );

  await upsertOne(
    FinishGoodsDeliveryInfoModel,
    "finishgoodsdeliveryinformations",
    { deliveryChallanNo: "DC-SEED-001" },
    {
      finishGoodsDeliveryDate: new Date("2026-09-09"),
      piId: String(pi1._id),
      doId: String(do1._id),
      driverName: "Abdul Karim",
      driverContactNo: "01719887766",
      truckNo: "DHA-METRO-TH-11-4521",
      clientId: String(confidence._id),
      deliveryChallanNo: "DC-SEED-001",
      totalDelivarQty: 8000,
      approveStatus: true,
      approveBy: makeBy,
      approveDate: new Date("2026-09-09"),
      makeBy,
      makeDate: new Date("2026-09-09"),
      detailsData: [
        {
          piDetailsId: String(pi1Line._id),
          itemId: String(firstClass._id),
          deliverQty: "8000",
          piId: String(pi1._id),
          doId: String(do1._id),
          returnStatus: false,
          returnQty: 0,
        },
      ],
    }
  );

  await ensureSerial("po", 2, makeBy);
  await ensureSerial("grn", 2, makeBy);
  await ensureSerial("invoice", 2, makeBy);
  await ensureSerial("do", 1, makeBy);
  await ensureSerial("deliveryChallan", 1, makeBy);
  await ensureSerial("production", 2, makeBy);

  console.log("\nSeed summary (created / skipped):");
  Object.entries(summary)
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([name, counts]) => {
      console.log(
        `  ${name}: created=${counts.created} skipped=${counts.skipped}`
      );
    });

  const verify = {
    companies: await Company.countDocuments(),
    categoryinformations: await CategoryModel.countDocuments(),
    itemunitinfos: await UnitModel.countDocuments(),
    itemsizes: await SizeModel.countDocuments(),
    paymentinformations: await PaymentInfoModel.countDocuments(),
    bankinformations: await BankInfoModel.countDocuments(),
    supplierinformations: await SupplierModel.countDocuments(),
    clientinformations: await ClientModel.countDocuments(),
    rmiteminformations: await RMItemInfoModel.countDocuments(),
    fgiteminformations: await FGItemInfoModel.countDocuments(),
    cftinformations: await CFTInfoModel.countDocuments(),
    purchaseorderinformations: await PurchaseOrderInfoModel.countDocuments(),
    goodsreceivenoteinfos: await GoodsReceiveNoteInfoModel.countDocuments(),
    prodctioninformations: await ProductionInfoModel.countDocuments(),
    rmconsumptiondetailbyfifos: await RMConsumptionDetailModel.countDocuments(),
    invoiceinformations: await SalesManagementModel.countDocuments(),
    paymentreceiveinformations: await PaymentReceiveInfoModel.countDocuments(),
    deliveryorderinformations: await DOInfoModel.countDocuments(),
    finishgoodsdeliveryinformations:
      await FinishGoodsDeliveryInfoModel.countDocuments(),
  };

  console.log("\nCollection totals after seed:");
  Object.entries(verify).forEach(([name, count]) => {
    console.log(`  ${name}: ${count}`);
  });

  const requiredPo = await PurchaseOrderInfoModel.findOne({
    poNo: "PO-2026-SEED-001",
  });
  const requiredGrn = await GoodsReceiveNoteInfoModel.findOne({
    grnSerialNo: "GRN-2026-SEED-001",
  });
  const requiredPi = await SalesManagementModel.findOne({
    invoiceNo: "PI-2026-SEED-001",
  });
  if (!requiredPo || !requiredGrn || !requiredPi) {
    throw new Error("Verification failed: expected seed documents missing");
  }

  console.log("\nVerified key documents:");
  console.log("  PO", requiredPo.poNo, String(requiredPo._id));
  console.log("  GRN", requiredGrn.grnSerialNo, String(requiredGrn._id));
  console.log("  PI", requiredPi.invoiceNo, String(requiredPi._id));
  console.log("  PI customerID", requiredPi.customerID);
}

main()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
