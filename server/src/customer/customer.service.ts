import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Collection, GetResponse } from 'chromadb';
import { Customer } from '@commercetools/platform-sdk';
import { CtClientService } from '../ct/ct.service';
import { ApiRoot, Response } from '../interfaces/ct.interface';
import { getCustomers } from '../graphql/customer';
import { createId } from '../utils/common';
import { getChromaCollection } from '../chroma';

@Injectable()
export class CustomerService {
    apiRoot: ApiRoot;
    constructor(private readonly ctClientService: CtClientService) {
        this.apiRoot = this.ctClientService.createApiClient(ctClientService.ctpClient);
    }

    async getAllCustomersDetails(): Promise<Response> {
        const collection: Collection = await getChromaCollection(process.env.CHROMA_CUSTOMER_COLLECTION_NAME);
        const customers: GetResponse = await collection.get();
        if (customers?.ids?.length) return {
            statusCode: 201,
            message: "All Product Details fetched from chroma Successfully",
            data: customers
        }
        throw new HttpException("Customers not found.", HttpStatus.NOT_FOUND);
    }

    async deleteAllCustomersDetails(): Promise<Response> {
        const collection: Collection = await getChromaCollection(process.env.CHROMA_CUSTOMER_COLLECTION_NAME);
        const customers: GetResponse = await collection.get();
        const ids = customers.ids;
        console.log(ids.length);
        if (!ids.length) throw new HttpException("No data to delete", HttpStatus.NOT_FOUND);
        await collection.delete({ ids });
        return {
            statusCode: 200,
            message: "All Customers Details deleted from chroma Successfully",
            data: null
        };
    }

    async customerDetails(offset: number): Promise<Response> {
        const totalCustomers = (await this.apiRoot.customers().get().execute()).body.total;
        let limit = offset + 500;
        let tempLimit = 50;
        let tempOffset = 0;
        const promise = [];
        let count = 0;
        while (offset < totalCustomers) {
            if (offset > 10000) {
                if (totalCustomers - count < tempLimit) tempLimit = totalCustomers - count;
                promise.push(
                    this.apiRoot
                        .graphql()
                        .post({
                            body: {
                                query: getCustomers(),
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
                                query: getCustomers(),
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
        const customers: Customer[] = [];
        response.forEach((res: any) => {
            customers.push(...res.body.data.customers.results);
        });

        const collection: Collection = await getChromaCollection(process.env.CHROMA_CUSTOMER_COLLECTION_NAME);

        const data = await this.addToChromaDb(customers, collection);
        if (data) return {
            statusCode: 200,
            message: "Customer Details saved in chroma",
            data
        }
        throw new HttpException("Something went wrong", HttpStatus.BAD_REQUEST);
    }

    async addToChromaDb(customers: Customer[], collection: Collection): Promise<any> {
        const ids: string[] = [];
        const documents: any[] = [];
        const metadatas: any[] = [];
        customers.forEach((customer: Customer) => {
            ids.push(createId());
            documents.push(JSON.stringify(customer));
            metadatas.push({
                key: customer?.key,
                id: customer?.id,
                firstName: customer?.firstName,
                lastName: customer?.lastName,
                email: customer?.email,
                customerNumber: customer?.customerNumber
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
