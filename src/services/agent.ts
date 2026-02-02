
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
            priorityLvl: {
              type: "number",
              description: "The priority level of the to-do item",
            },
          },
          required: ["title", "description", "priorityLvl"],
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
              description: "The ID of the to-do item to be removed",
            },
          },
          required: ["id"],
        }
      }
      }
    ];

    getSystemPrompt() { 
      return `
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

        Tools you can use:
        1. CreateTodo:
            - Creates a to-do list item
            - Arguments:
                - title: string (title of the to-do item)
                - description: string (description of the to-do item)
        2. CompleteTodo:
            - Updates a to-do list item as completed
            - Arguments:
                - id: number (ID of the to-do item to be marked as completed)
        3. DeleteTodo:
            - Removes a to-do list item
            - Arguments:
                - id: number (ID of the to-do item to be removed)
        4. UpdateTodo:
            - Updates the information about a to-do list item
            - Arguments:
                - id: number (ID of the to-do item to be updated)
                - title: string (title of the to-do item)
                - description: string (description of the to-do item)
                - priorityLvl: number (priority level of the to-do item)
                - isDone: boolean (the property that indicates whether the task has been completed or not)
        Current to-do list (source of truth):
        ${JSON.stringify(Array.from(todoList.tasks.values()))}

        Important:
        - Use the ID exactly as provided
        - Use just the ID number when getting something from the to-do list
        - If the requested task does not exist, do nothing
        - Try as much as possible to use the tools provided

        Guidelines for creating a to-do item:
        - Title should be concise and descriptive
        - Description should provide additional details about the task
        - Provide priority level for each task
        - Priority level goes from 1 (lowest) to 5 (highest)

        Example user requests and tool calls:
        - User request: "I need to buy groceries"
          Tool call: CreateTodo with title "Buy groceries", description "Buy milk, eggs, and bread" and priority level 5
        - User request: "I have bought the groceries"
        - User request: "I have already bought the groceries"
          Tool call: CompleteTodo with id 1627891234567 (was the ID of the "Buy groceries" task)
    `};


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
                { role: "system", content: this.getSystemPrompt() },
                { role: "user", content: prompt }
            ],
            model: this.Model || "openai/gpt-oss-120b",
            tools: this.tools,
            tool_choice: "auto",
        });
        const message = response.choices[0].message;
        console.log('RAW RESPONSE:', JSON.stringify(response, null, 2));
        console.log('MESSAGE:', JSON.stringify(message, null, 2));

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
                    args.priorityLvl,
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