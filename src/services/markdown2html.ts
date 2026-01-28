import MarkdownIt from 'markdown-it'

export class Markdown2HtmlService {
    md: MarkdownIt;

    constructor() {
        this.md = new MarkdownIt({
            html: false,
            linkify: true,
            typographer: true
        });
    }

    Markdown2Html(markdown: string): string {
        return this.md.render(markdown);
    }
}