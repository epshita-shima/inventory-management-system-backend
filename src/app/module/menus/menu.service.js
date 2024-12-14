const { errorlogger, logger } = require("../../../shared/logger");
const MenuItem = require("./menu.model");
const { ObjectId } = require("mongodb");

const getMenuItemDB = async () => {
  try {
    const menuitem = await MenuItem.MenuItem.find();

    return menuitem;
  } catch (error) {
    errorlogger.error("Error fetching menu:", error);
  }
};

const updateMenuDB = async (newItem) => {
  try {
    let parentMenu;
    parentMenu = await MenuItem.MenuItem.findOne({ _id: newItem._id });

    if (!parentMenu) {
    const  parentMenuData = await MenuItem.MenuItem.findOne({
        "items._id": newItem._id,
      });
   
      if (parentMenuData == null) {
        const parentNestedMenu = await MenuItem.MenuItem.findOne({
          "items.items._id": new ObjectId(newItem._id),
        });
       
        if (parentNestedMenu == null) {
        } else {
          const childMenu = parentNestedMenu.items.find(
            (item) => item._id.toString() === newItem.trackId
          );
          const childNestedMenu = childMenu.items.find(
            (item) => item._id.toString() === newItem._id
          );

          for (const item of newItem.items) {
            // Check if the item already exists in the child menu
            const existingItemIndex = childNestedMenu.items.findIndex(
              (existingItem) => existingItem._id.toString() === item._id
            );

            // If the item exists, isUpdated it; otherwise, create a new document for it
            if (existingItemIndex !== -1) {
              // Update existing item
              childNestedMenu.items[existingItemIndex].label = item.label; // Update other properties as needed
            } else {
              // Create a new document for the item
              const newItemDoc = new MenuItem.Item(item);
              await newItemDoc.save({ suppressWarning: true });
              childNestedMenu.items.push(newItemDoc);
              // parentNestedMenu.items.push(newItemDoc);
            }
          }

          await MenuItem.MenuItem.findByIdAndUpdate(
            parentNestedMenu._id,
            parentNestedMenu,
            {
              new: true,
            }
          );
          return parentNestedMenu;
        }
      } else {
        const childMenu = parentMenuData.items.find(
          (item) => item._id.toString() === newItem._id
        );
        for (const item of newItem.items) {
          // Check if the item already exists in the child menu
          const existingItemIndex = childMenu.items.findIndex(
            (existingItem) => existingItem._id.toString() === item._id
          );
          // If the item exists, isUpdated it; otherwise, create a new document for it
          if (existingItemIndex !== -1) {
            // Update existing item
            childMenu.items[existingItemIndex].label = item.label; // Update other properties as needed
          } else {
            // Create a new document for the item
            const newItemDoc = new MenuItem.Item(item);
     
            await newItemDoc.save({ suppressWarning: true });
            childMenu.items.push(newItemDoc);
          }
        }
        await MenuItem.MenuItem.findByIdAndUpdate(parentMenuData._id, parentMenuData, {
          new: true,
        });
      
        return parentMenu;
      }
    } else {
      for (const item of newItem.items) {
        const existingItemIndex = parentMenu.items.findIndex(
          (existingItem) => existingItem._id.toString() === item._id
        );
        if (existingItemIndex !== -1) {
          parentMenu.items[existingItemIndex].label = item.label;
        } else {
          const newItemDoc = new MenuItem.Item(item);
          await newItemDoc.save({ suppressWarning: true });
          parentMenu.items.push(newItemDoc);
        }
      }

      await parentMenu.save({ suppressWarning: true });
      return parentMenu;
    }
  } catch (error) {
    throw new Error("Error inserting menu item: " + error.message);
  }
};

async function insertMenuItems(menuItems) {

  try {
    return await MenuItem.MenuItem.insertMany(menuItems);
  } catch (error) {
    throw new Error("Error inserting menu items: " + error.message);
  }
}

const getMenuByIdDB = async (id) => {
  try {
    const parentMenu = await MenuItem.MenuItem.findById(id);

    if (parentMenu == null) {
      const parentNestedMenu = await MenuItem.MenuItem.findOne({
        "items._id": id,
      });

      if (parentNestedMenu == null) {
        const childNestedMenu = await MenuItem.MenuItem.findOne({
          "items.items._id":id
        });

        if (!childNestedMenu) {
          const childNestedChildMenu = await MenuItem.MenuItem.findOne({
            "items.items.items._id":new ObjectId(id)
          });
   
          if(!childNestedChildMenu){
            throw new Error("Menu not found");
          }
          return childNestedChildMenu
        }
        else{
        return childNestedMenu
        }
      } else {
        return parentNestedMenu;
      }
    } else {
      return parentMenu;
    }
  } catch (error) {
    errorlogger.error(error);
    throw new Error("Internal server error from service");
  }
};

const getMenuChangingParentByIdDB = async (id) => {

  try {
    const parentMenu = await MenuItem.MenuItem.findById(id);
    if (parentMenu == null) {
      const parentNestedMenu = await MenuItem.MenuItem.findOne({
        "items._id": id,
      });
    
      if (parentNestedMenu == null) {
        const childNestedMenu = await MenuItem.MenuItem.findOne({
          "items.items._id": new ObjectId(id)
        });

        if (!childNestedMenu) {
          throw new Error("Menu not found");
        }
        return childNestedMenu;
      } else {
        return parentNestedMenu;
      }
    } else {
      return parentMenu;
    }
  } catch (error) {
    throw new Error("Internal server error from service");
  }
};

const updateSingleMenuDB = async (dataToUpdate) => {
  try {
    // Destructure the dataToUpdate object to extract individual fields
    const {
      _id,
      label,
      url,
      permissions,
      trackId,
      items,
      isParent,
      isChecked,
      isInserted,
      isRemoved,
      isUpdated,
      isPDF,
    } = dataToUpdate;

    // Construct the isUpdated object
    const updateData = {
      label,
      url,
      permissions,
      trackId,
      items,
      isParent,
      isChecked,
      isInserted,
      isRemoved,
      isUpdated,
      isPDF,
      updatedAt: Date.now(),
    };
   
    // Update the user
    const updatedUser = await MenuItem.MenuItem.findByIdAndUpdate(
      _id,
      updateData,
      {
        new: true,
      }
    );

    return updatedUser;
  } catch (error) {
    errorlogger.error("Error updating multiple users:", error);
    throw new Error("Failed to isUpdated multiple data");
  }
};

const updateSingleMenuDataDB = async (id, data) => {
  try {
    let parentMenu;
    parentMenu = await MenuItem.MenuItem.findOne({ _id: id });
    if (!parentMenu) {
      const parentNestedMenu = await MenuItem.MenuItem.findOne({
        "items._id": new ObjectId(id),
      });

      if (!parentNestedMenu) {
        const childNestedMenu = await MenuItem.MenuItem.findOne({
          "items.items._id": new ObjectId(id) ,
        });

        if (!childNestedMenu) {
          throw new Error("Error inserting menu item: " + error.message);
        } else {
          const updatedItem = await MenuItem.MenuItem.findByIdAndUpdate(
            id,
           {$set:data},
            { new: true }
          );
          if (updatedItem) {
            return updatedItem;
          } else {
            logger.info("No matching document found for ID:", id);
            return new Error("Error inserting menu item: " + error.message);;
          }
        }
      } else {
        const updatedItem = await MenuItem.MenuItem.findByIdAndUpdate(
          id,
          {$set:data},
          { new: true }
        );

        if (updatedItem) {
          return updatedItem;
        } else {
          logger.info("No matching document found for ID:", id);
          return null;
        }
      }
    } else {
      const updatedItem = await MenuItem.MenuItem.findByIdAndUpdate(id, 
        {$set:data},
        {
        new: true,
      });
      if (updatedItem) {
        return updatedItem;
      } else {
        logger.info("No matching document found for ID:", id);
        return null;
      }
    }
  } catch (error) {
    errorlogger.error("Error updating multiple users:", error);
    throw new Error("Failed to isUpdated multiple data");
  }
};
const updateMenuNestedItemsDB = async (data) => {
  try {
    // Remove the item from the previous array
    let parentMenu;
    parentMenu = await MenuItem.MenuItem.findOne({ _id: data.masterMenuData._id });
    if (!parentMenu) {
      const parentNestedMenu = await MenuItem.MenuItem.findOne({
        "items._id": data.masterMenuData._id,
      });
      if (!parentNestedMenu) {
        const childNestedMenu = await MenuItem.MenuItem.findOne({
          "items.items_id":new ObjectId(data.masterMenuData._id),
        });
        if (!childNestedMenu) {
          throw new Error("Error inserting menu item: " + error.message);
        } else {
          const data1 = await MenuItem.MenuItem.findOneAndUpdate(
            { _id: data.singleMenu._id },
            // Find the document containing the item to remove
            { $pull: { items: { _id: data.masterMenuData._id } } }, // Pull the item from the array
            // // Pass the session to the operation
            // { returnOriginal: false }
            { new: true }
          );
          const data2 = await MenuItem.MenuItem.findOneAndUpdate(
            { _id: data.masterMenuData._id }, // Find the document by its _id
            { $set: data.masterMenuData }, // Update the document with the new data
            // Pass the session to the operation
            { returnOriginal: false }
          );
          return {data1,data2}
        }
      } else {
        const data1 = await MenuItem.MenuItem.findOneAndUpdate(
          { _id: data.singleMenu._id },
          // Find the document containing the item to remove
          { $pull: { items: { _id: data.masterMenuData.items.filter((item)=>item._id) } } }, // Pull the item from the array
          // // Pass the session to the operation
          // { returnOriginal: false }
          { new: true }
        );
        const data2 = await MenuItem.MenuItem.findOneAndUpdate(
          { _id: data.masterMenuData._id }, // Find the document by its _id
          { $set: data.masterMenuData.items }, // Update the document with the new data
          // Pass the session to the operation
          { returnOriginal: false }
        );
        return {data1,data2}
      }
    } else {
      const data1 = await MenuItem.MenuItem.findOneAndUpdate(
        { _id: data.singleMenu._id },
        // Find the document containing the item to remove
        { $pull: { items: { _id: data.masterMenuData.items.filter((item)=>item._id) } } }, // Pull the item from the array
        // // Pass the session to the operation
        // { returnOriginal: false }
        { new: true }
      );
      
     
      const data2 = await MenuItem.MenuItem.findOneAndUpdate(
        { _id: data.masterMenuData._id }, // Find the document by its _id
        { $push: { items:  data.masterMenuData.items  } }, // Update the document with the new data
        // Pass the session to the operation
        { returnOriginal: false }
      );
   
      return {data1,data2}
    }
  } catch (error) {
    throw new Error("Error updating menu item: " + error.message);
  }
};
const deleteMenuDB = async (id) => {
  try {
    const deletedParentMenu = await MenuItem.MenuItem.findByIdAndDelete(id);
    if(deletedParentMenu==null){
      const deletedNestedParentMenu = await MenuItem.MenuItem.updateOne({ 'items._id': id }, { $pull: { items: { _id: id } } });

      if(!deletedNestedParentMenu){
        const deletedNestedChildMenu = await MenuItem.MenuItem.updateOne({ 'items.items._id': new ObjectId(id) }, { $pull: { 'items.items': { _id: id } } });

        if(!deletedNestedChildMenu){
          throw new Error("User not found");
        }
        else{
          return deletedNestedChildMenu
        }
      }
      else{
        return deletedNestedParentMenu
      }
    }
    else{
      return deletedParentMenu;
    }
   
  } catch (error) {
    throw new Error("Internal server error");
  }
};
module.exports = {
  getMenuItemDB,
  insertMenuItems,
  updateMenuDB,
  getMenuByIdDB,
  updateSingleMenuDB,
  updateSingleMenuDataDB,
  getMenuChangingParentByIdDB,
  updateMenuNestedItemsDB,
  deleteMenuDB
};
