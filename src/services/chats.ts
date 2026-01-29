
export class ChatService {
    role: any;
    content: any;
    constructor(role: any, content: any) {
        this.role = role;
        this.content = content;
    }

    INDEX_KEY = "chat_index";

    getIndex() {
        return JSON.parse(localStorage.getItem(this.INDEX_KEY) || "[]");
    }

    saveIndex(index: any[]) {
        localStorage.setItem(this.INDEX_KEY, JSON.stringify(index));
    }

    createChat(name = "Novo chat") {
        const id = `chat_${Date.now()}`;
        const index = this.getIndex();

        index.push({ id, name, createdAt: Date.now() });
        this.saveIndex(index);

        localStorage.setItem(
            id,
            JSON.stringify({ summary: "", systemMemory: {}, messages: [] })
        );

        return id;
    }

    deleteChat(id: string) {
        const index = this.getIndex().filter((c: any) => c.id !== id);
        this.saveIndex(index);
        localStorage.removeItem(id);
    }

    renameChat(id: string, newName: string) {
        const index = this.getIndex();
        const chat = index.find((c: any) => c.id === id);
        if (chat) chat.name = newName;
            this.saveIndex(index);
    }

    // ---------- MESSAGES ----------

    saveMessage(chatId: string, role: string, content: string) {
        const chatData = localStorage.getItem(chatId);
        if (!chatData) {
            console.error(`Chat with id ${chatId} does not exist`);
            return;
        }
        const chat = JSON.parse(chatData);
        chat.messages.push({ role, content });
        localStorage.setItem(chatId, JSON.stringify(chat));
    }

    getRecentMessages(chatId: string, limit = 4) {
        const chatData = localStorage.getItem(chatId);
        if (!chatData) return [];
        const chat = JSON.parse(chatData);
        return chat.messages.slice(-limit);
    }

    getChat(chatId: string) {
        const chatData = localStorage.getItem(chatId);
        if (!chatData) return null;
        return JSON.parse(chatData);
    }

    buildPrompt(chatId: string, content: string) {
        const chatData = localStorage.getItem(chatId);
        if (!chatData) return [{ role: "user", content }];
        const chat = JSON.parse(chatData);
        const messages = [];

        if (chat.systemMemory) {
            messages.push({
            role: "system",
            content: `Contexto permanente do chat (factos, decisões e preferências): ${JSON.stringify(chat.systemMemory, null, 2)}`
            });
        }
        if (chat.messages?.length) {
            messages.push(...chat.messages.slice(-4));
            if (chat.messages.length > 4) {
                chat.messages = chat.messages.slice(-4);
                localStorage.setItem(chatId, JSON.stringify(chat));
            }
        }
        messages.push({
            role: "user",
            content: content,
        });
        return messages;
    }

}