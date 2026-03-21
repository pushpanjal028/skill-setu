import jwt from 'jsonwebtoken';
import  { User } from '../models/userModel.js';

export const isAuthenticated = async(req, res, next)=>{
    try {
        const authHeader = req.header.authorization;

        if (!authHeader || !authHeader.startWith('Bearer')) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            })
        }
        const token = authHeader.split(" ")[1];

        // eslint-disable-next-line no-undef
        jwt.verify(token, process.env.SECRET_KEY, async (err, decoded)=>{
            if (err) {
                if(err.name === "TokenExpiredError"){
                    return res.status(400).json({
                        success: false,
                        message: "Token expired"
                    })
                }
                return res.status(400).json({
                    success: false,
                    message: "Access token is invalid"
                })
                
            }
            const {id} = decoded;

            const user = await User.findById(id)
            if(!user){
                return res.status(400).json({
                    success: false,
                    message: "User not found"
                })
            }
            req.userId = user._id;
            next();



        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}