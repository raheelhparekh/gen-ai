import 'dotenv/config'
import { Agent, run, tool } from '@openai/agents';
import {z} from "zod"

// tool  
const getCurrentTime=tool({
    name:"get_current_time",
    description:"Returns the current time",
    parameters:z.object({}),
    async execute(){
        return new Date().toString()
    }
})

const getMenu=tool({
    name:"get_menu",
    description:"Fetches and Returns the menu",
    parameters:z.object({}),
    async execute(){
        return{
            'Drinks':{
                'Chai': "INR 500",
                'Coffee': "INR 1000"
            },
            'Veg':{
                'Biriyani': "INR 1000",
                'Pulao': "INR 1000"
            }
        }
    }
    
})

// cooking agent
const cookingAgent=new Agent({
    name:"cooking_agent",
    tools:[getCurrentTime, getMenu],
    instructions:`You are an helpful cooking assistant who is specialised in cooking food. You help users with food option and recipes and help them cook food. you provide all steps how to create the dish step by step`
})

async function chatWithAgent(query) {
    const result= await run(cookingAgent,query)
    console.log(result.finalOutput)    
}   

chatWithAgent("what are some good food option for me also list the recipe and items available")
