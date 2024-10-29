import { NextFunction, Request, Response } from "express";
import User from "../models/User.js";
import { configureOpenAI } from "../config/openai-config.js";
import { ChatCompletionRequestMessage, OpenAIApi } from "openai";

export const generateChatCompletion = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { message } = req.body;
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).json({message:"User not registered OR Token malfunctioned"});
        }
        // Prepare chat history
        const chats = user.chats.map(({ role, content }) => ({ 
            role, 
            content,
        })) as ChatCompletionRequestMessage[];
        chats.push({ content: message, role: "user" });
        user.chats.push({ content: message, role: "user" });

        // Initialize OpenAI with configuration
        const config = configureOpenAI();
        const openai = new OpenAIApi(config);

        // Create chat completion request
        const chatResponse = await openai.createChatCompletion({
            model: "gpt-3.5-turbo", // or "gpt-3.5-turbo" if you are using that model
            messages: chats,
        });

        // Handle response and save to user history
        //const responseMessage = chatResponse.data.choices[0].message;
        user.chats.push(chatResponse.data.choices[0].message);

        // Save updated user chat history
        await user.save();

        return res.status(200).json({ chats: user.chats });
    } catch (error) {
        console.error("Error details:", error.response ? error.response.data : error.message);
        return res.status(500).json({ message: "Something went wrong" });
    }
};
