import User from "../models/userModel.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getUserData = asyncHandler(async (req, res) => {
    const {userId} = req.body;

    const user = await User.findById(userId);

    if(!user){
        throw new ApiError(400, "User does not exist");
    }

  res.json(new ApiResponse(200, {

    userData: {
        _id: user._id,
        name: user.name,
        isAccountVerified: user.isAccountVerified
    }
}, "User data fetched successfully"));

})

export { getUserData };

