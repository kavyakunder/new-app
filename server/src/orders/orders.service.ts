import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Collection, GetResponse } from 'chromadb';
import { CtClientService } from '../ct/ct.service';
import { ApiRoot, Response } from '../interfaces/ct.interface';
import { Order } from '@commercetools/platform-sdk';
import { createId } from '../utils/common';
import { getOrders } from '../graphql/orders';
import { getChromaCollection } from '../chroma';

@Injectable()
export class OrdersService {
    apiRoot: ApiRoot;

    constructor(private readonly ctClientService: CtClientService) {
        this.apiRoot = this.ctClientService.createApiClient(ctClientService.ctpClient);
    }

    async getAllOrderDetails(): Promise<Response> {
        const collection: Collection = await getChromaCollection(process.env.CHROMA_ORDER_COLLECTION_NAME);
        const orders: GetResponse = await collection.get();
        if (orders) return {
            statusCode: 200,
            message: "All Order Details fetched from chroma Successfully",
            data: orders
        }
        throw new HttpException("Something went wrong", HttpStatus.BAD_REQUEST);
    };

    async deleteAllOrderDetails(): Promise<Response> {
        const collection: Collection = await getChromaCollection(process.env.CHROMA_ORDER_COLLECTION_NAME);
        const orders: GetResponse = await collection.get();
        const ids = orders.ids;
        if (!ids.length) throw new HttpException("No data to delete", HttpStatus.NOT_FOUND);
        await collection.delete({ ids });
        return {
            statusCode: 200,
            message: "All Orders Details deleted from chroma Successfully",
            data: null
        };
    };

    async orderDetails(offset: number): Promise<Response> {
        const totalOrders = (await this.apiRoot.orders().get().execute()).body.total;
        let limit = offset + 500;
        let tempLimit = 50;
        let tempOffset = 0;
        const promise = [];
        let count = 0;
        while (offset < totalOrders) {
            if (offset > 10000) {
                if (totalOrders - count < tempLimit) tempLimit = totalOrders - count;
                promise.push(
                    this.apiRoot
                        .graphql()
                        .post({
                            body: {
                                query: getOrders(),
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
                                query: getOrders(),
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
        const orders: Order[] = [];
        response.forEach((res: any) => {
            orders.push(...res.body.data.orders.results);
        });

        const collection: Collection = await getChromaCollection(process.env.CHROMA_ORDER_COLLECTION_NAME);

        const data = await this.addToChromaDb(orders, collection);
        if (data) {
            return {
                statusCode: 200,
                message: "Order Details saved in chroma",
                data: null
            }
        }
        throw new HttpException("Something went wrong", HttpStatus.BAD_REQUEST);
    };


    async addToChromaDb(orders: Order[], collection: Collection): Promise<any> {
        const ids: string[] = [];
        const documents: any[] = [];
        const metadatas: any[] = [];
        orders.forEach((order: Order) => {
            ids.push(createId());
            documents.push(JSON.stringify(order));
            metadatas.push({
                id: order?.id,
                customerId: order?.customerId,
                customerEmail: order?.customerEmail,
                totalPrice: order?.totalPrice?.centAmount,
                orderNumber: order?.orderNumber,
                orderState: order?.orderState,
                origin: order?.origin,
                cartId: order?.cart?.id,
                country: order?.country
            });
        });
        const data = await collection.add({
            ids,
            documents,
            metadatas,
        });
        return data;
    };

}
