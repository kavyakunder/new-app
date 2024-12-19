import OpenAI from 'openai';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Collection } from 'chromadb';
import { Response } from '../interfaces/ct.interface';
import { getChromaCollection } from '../chroma';

@Injectable()
export class AiService {
    async getProductDetails(query: string): Promise<Response> {
        const collectionName = this.findChromaCollection(query);
        if (typeof collectionName === 'string' && collectionName.trim() !== '' && collectionName !== null) {
            const collection: Collection = await getChromaCollection(collectionName);
            const keywords: string = this.getKeywords(query);
            const dbData = await this.queryFromChromDb(keywords, query, collection);
            const data = await this.queryOpenAi(query, dbData.documents[0]);
            return {
                statusCode: 200,
                message: "The query has been executed successfully",
                data
            }
        } else {
            throw new HttpException("Please specify the data you want to fetch: products, customers, orders", HttpStatus.BAD_REQUEST)
        }
    }

    findChromaCollection(query: string): string {
        const dataType = query.includes(':') ? query.split(':')[0].toLowerCase().trim() : '';
        if (['product', 'products'].includes(dataType))
            return process.env.CHROMA_PRODUCT_COLLECTION_NAME;
        else if (['customer', 'customers'].includes(dataType))
            return process.env.CHROMA_CUSTOMER_COLLECTION_NAME;
        else if (['order', 'orders'].includes(dataType))
            return process.env.CHROMA_ORDER_COLLECTION_NAME;
        else
            return null;
    }

    getKeywords(query: string): string {
        const firstIndex = query.indexOf("#");
        const lastIndex = query.lastIndexOf("#");
        if (firstIndex >= 0 && lastIndex > 0) {
            return query.slice(firstIndex + 1, lastIndex)
        }
        return '';
    }

    async queryOpenAi(query: any, data: any): Promise<any> {
        const openAi = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
        const response = await openAi.chat.completions.create({
            model: "gpt-4-turbo-preview",
            temperature: 0.5,
            max_tokens: 3500,
            top_p: 1.0,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
            messages: [
                { role: "system", content: "Provide all data, based on the data shared with you about the product" },
                { role: "system", content: "Give all data from the product data provided, do not make up your own" },
                { role: "system", content: "Give the result in a proper HTML format and provide only the content inside the <body> tag" },
                { role: "system", content: "Remove strings like  ```html, ``` in response" },
                { role: "system", content: JSON.stringify(data) },
                { role: "user", content: query }
            ],
        });
        return response?.choices[0].message?.content;
    }

    async queryFromChromDb(keywords: string, query: string, collection: Collection): Promise<any> {
        const obj = {
            queryTexts: [query],
            nResults: 10,
        }
        if (keywords.length) obj["whereDocument"] = { "$contains": keywords }
        return collection.query(obj);
    }
}
