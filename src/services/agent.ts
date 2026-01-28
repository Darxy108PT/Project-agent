
import Groq from "groq-sdk";
import { ref } from 'vue';

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

    main = async (prompt: string) => {
        this.loading.value = true;
        try {
            const chatCompletion = await this.getGroqChatCompletion(prompt);
            this.message.value = chatCompletion.choices[0]?.message?.content || "";
            console.log(this.message.value);
              console.log(this);
              console.log("---------------------------------------------------------");
              console.log(chatCompletion.choices);
        } catch (error) {
            console.error('Error:', error);
            this.message.value = 'Error obtaining Groq\'s Answer';
        } finally {
            this.loading.value = false;
        }
    }

    getGroqChatCompletion = async (prompt: string) => {
        return this.groq.chat.completions.create({
            messages: this.prompt.value,
            model: this.Model || "openai/gpt-oss-120b",
        });
    }
}