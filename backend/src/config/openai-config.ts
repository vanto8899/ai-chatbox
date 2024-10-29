import { Configuration } from "openai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

export const configureOpenAI  = () => {
    const config = new Configuration({
        apiKey: process.env.OPEN_AI_SECRET,
        organization: process.env.OPENAI_ORGANIZATION_ID,
    })
    return config;
}