
import Groq from "groq-sdk";
import { ref } from 'vue';
import { todoList } from '@/services/todoList';

export class AgentService {
    APIkey: string;
    message: any;
    loading: any;
    prompt: any;
    htmlAnswer: any;
    groq: any;
    markdown2HtmlService: any;
    Model: any;

    constructor(APIkey: string) {
        this.APIkey = APIkey;
        this.message = ref('');
        this.loading = ref(false);
        this.prompt = ref('');
        this.groq = new Groq({ apiKey: this.APIkey, dangerouslyAllowBrowser: true });
    }

    tools = [
    {
      type: "function",
      function: {
        name: "CreateTodo",
        description: "Creates a to-do list item",
        parameters: {
          type: "object",
          properties: {
            title: {
              type: "string",
              description: "The title of the to-do item",
            },
            description: {
              type: "string",
              description: "The description of the to-do item",
            },
          },
          required: ["title", "description"],
        },
      },
    },
    {
      type: "function",
      function: {
        name: "CompleteTodo",
        description: "Updates a to-do list item as completed",
        parameters: {
          type: "object",
          properties: {
            id: {
              type: "number",
              description: "The ID of the to-do item to be marked as completed",
            },
          },
          required: ["id"],
        },
      },
    },
    {
      type: "function",
      function: {
        name: "UpdateTodo",
        description: "Updates the information about a to-do list item",
        parameters: {
          type: "object",
          properties: {
            id: { 
              type: "number", 
              description: "The ID of the to-do item to be updated" 
            },
            title: { 
              type: "string", 
              description: "The title of the to-do item" 
            },
            description: { 
              type: "string", 
              description: "The description of the to-do item" 
            },
            priorityLvl: { 
              type: "number", 
              description: "The priority level of the to-do item" 
            },
            isDone: { 
              type: "boolean", 
              description: "The property that indicates whether the task has been completed or not in the to-do list item" 
            }
          },
          required: ["id"]
        }
      }
    },
    {
      type: "function",
      function: {
        name: "DeleteTodo",
        description: "Removes a to-do list item",
        parameters: {
          type: "object",
          properties: {
            id: {
              type: "number",
              description: "The ID of the to-do item to be marked as completed",
            },
          },
          required: ["id"],
        },
      },
    },
    ];

    systemPrompt = `
        You are an AI decision engine.

        Your job:
        - Decide which tool to call
        - Extract CORRECT arguments
        - Understnad user requests and map them to tool calls

        Important

        Rules:
        - Do NOT respond with text
        - ONLY call tools
        - Do NOT make todos equal to each other
        - Use the to-do list as the source of truth for all operations

        Current to-do list (source of truth):
        ${JSON.stringify(Array.from(todoList.tasks.values()))}

        Important:
        - Use the ID exactly as provided
        - Use just the ID number when getting something from the to-do list
        - If the requested task does not exist, do nothing
    `;


    main = async (prompt: string) => {
        this.loading.value = true;
        try {
            await this.getGroqChatCompletion(prompt);
        } catch (error) {
            console.error('Error:', error);
            this.message.value = 'Error obtaining Groq\'s Answer';
        } finally {
            this.loading.value = false;
        }
    }

    getGroqChatCompletion = async (prompt: string) => {
        const response = await this.groq.chat.completions.create({
            messages: [
                { role: "system", content: this.systemPrompt },
                { role: "user", content: prompt }
            ],
            model: this.Model || "openai/gpt-oss-120b",
            tools: this.tools,
            tool_choice: "auto",
        });
        const message = response.choices[0].message;

        if (!message.tool_calls) {
            console.log("No tool call needed");
            return;
        }

        for (const toolCall of message.tool_calls) {
            const name = toolCall.function.name;
            const args = JSON.parse(toolCall.function.arguments);

            if (name === "CreateTodo") {
                todoList.createTask(
                    args.title,
                    args.description,
                    1,
                    new Date()
                );
            }

            if (name === "CompleteTodo") {
              const task = todoList.getTask(args.id);
              if (task) {
                todoList.checkTask(task);
              } else {
                console.warn(`CompleteTodo: task with id ${args.id} not found`);
              }
            }

            if (name === "UpdateTodo") {
              const task = todoList.getTask(args.id);
              if (task) {
                todoList.updateTask(
                  task,
                  args.title ?? task.title,
                  args.description ?? task.description,
                  args.priorityLvl ?? task.priorityLvl,
                  args.isDone ?? task.isDone
                );
              } else {
                console.warn(`UpdateTodo: task with id ${args.id} not found`);
              }
            }


            if (name === "DeleteTodo") {
              const task = todoList.getTask(args.id);
              if (task) {
                todoList.removeTask(task);
              } else {
                console.warn(`DeleteTodo: task with id ${args.id} not found`);
              }
            }
        }
    }
}