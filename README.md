# Protocol: `Vector Engine`

## Description

**Vector Engine** is a high-performance, multi-modal vector storage protocol designed for intelligent and AI-powered search across structured, unstructured, and visual data.

It provides providers with a standardized interface for creating, managing, and querying vector collections, and empowers validators to enforce quality and fairness through automated performance evaluation.

## Basic Info

| Name                      | Value                                                           |
| ------------------------- | --------------------------------------------------------------- |
| PT Smart Contract Address | `0x7069D0F75198d99df4F640C6fFC1f33FBA3e6EF0`                    |
| PT Registration Date      | `10 February`                                                   |
| PT Owner Wallet Address   | `0x765765F597222b524F0412a143094E118ddAB5Fd`                    |
| PT Owner Details File CID | `bagaaieragqajouwstkk2abb2ofiutun3tf5ba5dt7gnbo6kkx5o7qucc5jia` |

## Supported Actions (Endpoints)

| Method-Path              | Params/Body                                                                                                                                                                                                                                                      | Response                                | Description                                                                                                                                                                    |
|-------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `GET /details`          | `body: string[]`                                                                                                                                                                                                                                                 | `string[]`                              | Retrieves the contents of detail files for the given CIDs. If one CID is given and corresponding file is not found, returns 404/Not Found. Otherwise returns an array of contents of the files |
| `GET /resources`        | `params: { id?: number, pt?: Address }`                                                                                                                                                                                                                          | `Resource[] \| Resource`                | If `id` and `pt` is given, retrieves one resource information. Otherwise returns all resources of the requester                                                                |
| `POST /collection`      | `body: { id: number, pt: Address, name: string, fields: { name: string, type: "String" \| "Integer32" \| "Integer64" \| "Float" \| "Vector" \| "Boolean" \| "Image", properties?: { isPrimary?: boolean, default?: any, dimension?: number, autoIncrement?: boolean }}[] }` | `None`                                  | Creates a new collection in the resource.                                                                                                                                      |
| `DELETE /collection`    | `body: { id: number, pt: Address, name: string }`                                                                                                                                                                                                                | `None`                                  | Deletes a collection from the resource.                                                                                                                                        |
| `POST /searchInCollection` | `body: { id: number, pt: Address, collection: string, vectorField: string, query: any[] \| string, options?: { limit?: number, metricType?: "l2" \| "ip" \| "cosine" \| "jaccard" \| "hamming", searchFields?: string[] } }`                                      | `any[]`                                 | Searches for nearest neighbors within a specific collection. Automatically detects if the query is content or embeddings and includes images in the results if applicable.       |
| `POST /search`         | `body: { id: number, pt: Address, vectorField: string, query: any[] \| string, options?: { limit?: number, metricType?: "l2" \| "ip" \| "cosine" \| "jaccard" \| "hamming", searchFields?: string[] } }`                                                         | `{ [collection: string]: any[] }`       | Searches for nearest neighbors across all available collections. Automatically detects if the query is content or embeddings and includes images in the results if applicable.  |
| `POST /data`           | `body: { id: number, pt: Address, collection: string, data: { [fieldName: string]: any }[] }`                                                                                                                                                                    | `None`                                  | Inserts the given data into a collection.                                                                                                                                      |
| `DELETE /data`         | `body: { id: number, pt: Address, collection: string, conditions: { [fieldName: string]: string \| number \| boolean \| { operator: "=" \| ">" \| "<" \| ">=" \| "<=" \| "!=" \| "LIKE" \| "like" \| "in" \| "IN", value: any } }`                               | `None`                                  | Deletes the records from a collection that matches with the given conditions.                                                                                                  |

## Configuration Parameters

This Product Category has the following configuration. Some of them are enforced by the logic of the on-chain smart contracts and the others are part of the Validator code hence enforced by the Validator consensus.

| Config                                   | Value                                                           | Enforced by    |
| ---------------------------------------- | --------------------------------------------------------------- | -------------- |
| Maximum Number of Validators             | `2`                                                             | Smart Contract |
| Maximum Number of Providers              | `5`                                                             | Smart Contract |
| Minimum Collateral                       | `15`                                                            | Smart Contract |
| Validator Registration Fee               | `2`                                                             | Smart Contract |
| Provider Registration Fee                | `5`                                                             | Smart Contract |
| Offer Registration Fee                   | `10`                                                            | Smart Contract |
| Update Delay for Terms Change            | `300`                                                           | Smart Contract |
| Validators Share of Emissions            | `35`                                                            | Smart Contract |
| Providers Share of Emissions             | `55`                                                            | Smart Contract |
| PT Owner Share of Emissions              | `10`                                                            | Smart Contract |
| CID of the Details File                  | `bagaaieraodbmqldh4yekhoail7pswc475kknmptrhrm5cqluweud2j4ym22q` | Smart Contract |
| Performance Optimization Weight          | `[WIP]`                                                         | Validator      |
| Price Optimization Weight                | `[WIP]`                                                         | Validator      |
| Price-to-Performance Optimization Weight | `[WIP]`                                                         | Validator      |
| Popularity Optimization Weight           | `[WIP]`                                                         | Validator      |

You can always double-check the on-chain values e.g. [here](https://sepolia-optimism.etherscan.io/address/0x7069D0F75198d99df4F640C6fFC1f33FBA3e6EF0#readContract)

## Performance Requirements [WIP]

The Validators are performing a number of tests on Resources to ensure quality across the board. Below is a list of checked Benchmarks:

| Name            | Units     | Threshold Value | Min / Max     |
| --------------- | --------- | --------------- | ------------- |
| `{Test Name 1}` | `{Units}` | `{Value}`       | `{Min / Max}` |
| `{Test Name 2}` | `{Units}` | `{Value}`       | `{Min / Max}` |
| `{Test Name 3}` | `{Units}` | `{Value}`       | `{Min / Max}` |

More in-depth descriptions of the Tests (optional):

| Name          | Description             |
| ------------- | ----------------------- |
| {Test Name 1} | {Long form description} |
| {Test Name 2} | {Long form description} |
| {Test Name 3} | {Long form description} |

## Become a Provider in this Protocol

If you want to start providing services in this Protocol follow this tutorial: [link](README_Become_a_Provider.md)
