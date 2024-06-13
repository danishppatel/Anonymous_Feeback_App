import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/model/User";
import { use } from "react";

export async function POST(request :Request) {
    await dbConnect();

    const {username, content} = await request.json();

    try {
        const  user =   await UserModel.findOne({username});

        if(!user){
            return  Response.json({
                success : false,
                message : 'User not found'
            },{status: 404})
        }

        //is User Accepting Messages or not
        if(!user.isAcceptingMessage){
            return  Response.json({
                success : false,
                message : 'User is not accepting messages'
            },{status: 403})
        }

        const newMessage = {content , createdAt: new Date()}
        user.messages.push(newMessage as Message)

        await user.save();

        return  Response.json({
            success : true,
            message : 'Message send Successfully'
        },{status: 401})

    } catch (error) {
        console.error('Error adding messages', error);
        return  Response.json({
            success : false,
            message : 'Internal server error'
        },{status: 500})
    }
}