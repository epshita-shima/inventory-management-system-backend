
const userRoleToDB=require("./userrole.service")

 const createUserRole=async(req, res,next) => {
    try {
        const data = req.body;
        const userrole = await userRoleToDB.createUserRoleToDB(data);
        res.status(200).json({
            status: 'success',
            data: userrole
        });
    } catch (error) {
        // if (error.message === "User roll with the same name already exists") {
        //     return res.status(400).json({
        //         status: 'error',
        //         message: 'User roll with the same name already exists'
        //     });
        // } else {
          next(error)
        // }

    }

};

const getUserrole=async(req,res,next)=>{
    const data = req.body;
    const userrole = await userRoleToDB.getUserRoleDB(data)
    res.json(userrole);
}
module.exports = {createUserRole,getUserrole}