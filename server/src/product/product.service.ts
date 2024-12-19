import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Collection, GetResponse } from 'chromadb';
import { Product } from '@commercetools/platform-sdk';
import { getChromaCollection } from '../chroma';
import { CtClientService } from '../ct/ct.service';
import { ApiRoot, Response } from '../interfaces/ct.interface';
import { getProducts } from '../graphql/product'
import { createId } from '../utils/common';

@Injectable()
export class ProductService {
    apiRoot: ApiRoot;
    constructor(private readonly ctClientService: CtClientService) {
        this.apiRoot = this.ctClientService.createApiClient(ctClientService.ctpClient);
    }

    async getAllProductDetails(): Promise<Response> {
        const collection: Collection = await getChromaCollection(process.env.CHROMA_PRODUCT_COLLECTION_NAME);
        const products: GetResponse = await collection.get();
        if (products?.ids?.length) return {
            statusCode: 200,
            message: "All Product Details fetched from chroma Successfully.",
            data: products
        }
        throw new HttpException("Products not found.", HttpStatus.NOT_FOUND);
    }

    async deleteAllProducts(): Promise<Response> {
        const collection: Collection = await getChromaCollection(process.env.CHROMA_PRODUCT_COLLECTION_NAME);
        const products: GetResponse = await collection.get();
        const ids = products.ids;
        if (!ids.length) throw new HttpException("No data to delete.", HttpStatus.NOT_FOUND);
        await collection.delete({ ids });
        return {
            statusCode: 200,
            message: "All Product Details deleted from chroma Successfully.",
            data: null
        }
    }

    async productDetails(offset: number): Promise<Response> {
        const totalProduct = (await this.apiRoot.products().get().execute()).body.total;
        let limit = offset + 500;
        let tempLimit = 50;
        let tempOffset = 0;
        const promise = [];
        let count = 0;
        while (offset < totalProduct) {
            if (offset > 10000) {
                if (totalProduct - count < tempLimit) tempLimit = totalProduct - count;
                promise.push(
                    this.apiRoot
                        .graphql()
                        .post({
                            body: {
                                query: getProducts(),
                                variables: {
                                    limit: tempLimit,
                                    offset: tempOffset,
                                    sort: "createdAt desc"
                                },
                            },
                        })
                        .execute(),
                );
                count += 50;
                tempOffset += 50;
                if (offset >= limit) break;
            } else {
                promise.push(
                    this.apiRoot
                        .graphql()
                        .post({
                            body: {
                                query: getProducts(),
                                variables: {
                                    limit: tempLimit,
                                    offset: offset,
                                    sort: "createdAt asc"
                                },
                            },
                        })
                        .execute(),
                );
                count += 50;
            }
            offset += 50;
            if (offset >= limit) break;
        }
        const response = await Promise.all(promise);
        const products: Product[] = [];
        response.forEach((res: any) => {
            products.push(...res.body.data.products.results);
        });

        const collection: Collection = await getChromaCollection(process.env.CHROMA_PRODUCT_COLLECTION_NAME);

        const data = await this.addToChromaDb(products, collection);
        if (data) return {
            statusCode: 201,
            message: "Product Details saved in chroma",
            data
        }
        throw new HttpException("Something went wrong", HttpStatus.BAD_REQUEST);
    }

    async addToChromaDb(productDetails: Product[], collection: Collection): Promise<any> {
        const ids: string[] = [];
        const documents: any[] = [];
        const metadatas: any[] = [];
        productDetails.forEach((product: Product) => {
            ids.push(createId());
            documents.push(JSON.stringify(product));
            metadatas.push({
                key: product?.key,
                id: product?.id,
                name: product?.masterData?.current?.name,
                slug: product?.masterData?.current?.slug
            });
        });
        const data = await collection.add({
            ids,
            documents,
            metadatas,
        });
        return data;
    }
}
