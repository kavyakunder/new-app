import { ChromaClient, Collection, OpenAIEmbeddingFunction } from 'chromadb';

export const getChromaCollection = async (collectionName: string): Promise<Collection> => {
    const headers = new Headers();
    headers.set("Authorization", "Bearer " + process.env.CHROMA_TOKEN);
    headers.set("Content-Type", "application/json");
    const client = new ChromaClient({
        path: process.env.CHROMA_CLIENT_URL,
        fetchOptions: {
            headers: headers
        }
    });
    const embedder = new OpenAIEmbeddingFunction({
        openai_api_key: process.env.OPENAI_API_KEY,
    });
    const collection: Collection = await client.getOrCreateCollection({
        name: collectionName,
        embeddingFunction: embedder,
    });
    return collection;
};