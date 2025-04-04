import {
  addressSchema,
  Agreement,
  PipeMethod,
  PipeResponseCode,
  validateBodyOrParams,
} from "@forest-protocols/sdk";
import { AbstractProvider } from "@/abstract/AbstractProvider";
import { Resource, ResourceDetails } from "@/types";
import { z } from "zod";
import { Address } from "viem";
import { DB } from "@/database/Database";
import { PipeErrorNotFound } from "@/errors/pipe/PipeErrorNotFound";

/**
 * The details gathered by the Provider from the resource source.
 * This is the "details" type of each resource and it is stored in the database.
 * @responsible Protocol Owner
 */
export type VectorDBDetails = ResourceDetails & {
  _credentials: any;
};

const conditionValueSchema = z
  .string()
  .or(z.number())
  .or(z.boolean())
  .or(
    z.object({
      operator: z.enum([
        "=",
        ">",
        "<",
        ">=",
        "<=",
        "!=",
        "LIKE",
        "like",
        "in",
        "IN",
      ]),
      value: z.any(),
    })
  );

const fieldSchema = z.object({
  name: z.string().min(1),
  type: z.enum([
    "String",
    "Integer32",
    "Integer64",
    "Float",
    "Vector",
    "Boolean",
    "Image",
  ]),
  properties: z
    .object({
      isPrimary: z.boolean().optional(),
      default: z.any().optional(),
      dimension: z.number().optional(),
      autoIncrement: z.boolean().optional(),
    })
    .optional(),
});

export type Field = z.infer<typeof fieldSchema>;
export type ConditionValue = z.infer<typeof conditionValueSchema>;

const metricTypeSchema = z.union([
  z.literal("l2"),
  z.literal("ip"),
  z.literal("cosine"),
  z.literal("jaccard"),
  z.literal("hamming"),
]);
export type MetricType = z.infer<typeof metricTypeSchema>;

/**
 * Base Provider that defines what kind of actions needs to be implemented for the Protocol.
 * @responsible Protocol Owner
 */
export abstract class BaseVectorDBProvider extends AbstractProvider<VectorDBDetails> {
  /**
   * Retrieves the nearest neighbors for the given embeddings or content.
   * @param agreement On-chain agreement data.
   * @param resource Resource record of the agreement.
   * @param collection Collection name.
   * @param vectorField Vector field/column name.
   * @param query Search query - can be either embeddings array or text content
   * @param options Additional options for search process.
   */
  abstract searchInCollection(
    agreement: Agreement,
    resource: Resource,
    collection: string,
    vectorField: string,
    query: any[] | string,
    options?: {
      /**
       * Total result count.
       */
      limit?: number;

      /**
       * Distance metric type.
       */
      metricType?: MetricType;

      /**
       * Fields to search in when using content search
       */
      searchFields?: string[];
    }
  ): Promise<any[]>;

  /**
   * Searches for nearest neighbors across all available collections.
   * @param agreement On-chain agreement data.
   * @param resource Resource record of the agreement.
   * @param vectorField Vector field/column name.
   * @param query Search query - can be either embeddings array or text content
   * @param options Additional options for search process.
   */
  abstract search(
    agreement: Agreement,
    resource: Resource,
    vectorField: string,
    query: any[] | string,
    options?: {
      /**
       * Total result count per collection.
       */
      limit?: number;

      /**
       * Distance metric type.
       */
      metricType?: MetricType;

      /**
       * Fields to search in when using content search
       */
      searchFields?: string[];
    }
  ): Promise<{ [collection: string]: any[] }>;

  /**
   * Insert data into a collection
   * @param agreement On-chain agreement data.
   * @param resource Resource record of the agreement
   * @param collection Collection name.
   * @param data
   */
  abstract insertData(
    agreement: Agreement,
    resource: Resource,
    collection: string,
    data: { [field: string]: any }[]
  ): Promise<void>;

  /**
   * Deletes data from a collection
   * @param agreement On-chain agreement data.
   * @param resource Resource record of the agreement
   * @param collection Collection name.
   * @param conditions Conditions will be used to filter which records are going to be deleted.
   */
  abstract deleteData(
    agreement: Agreement,
    resource: Resource,
    collection: string,
    conditions: { [field: string]: ConditionValue }
  ): Promise<void>;

  /**
   * Creates a new collection.
   * @param agreement On-chain agreement data.
   * @param resource Resource record of the agreement.
   * @param name Name of the collection.
   * @param fields Columns of the collection.
   * @param options Additional option for the creation process
   */
  abstract createCollection(
    agreement: Agreement,
    resource: Resource,
    name: string,
    fields: Field[]
  ): Promise<void>;

  /**
   * Deletes a collection.
   * @param agreement On-chain agreement data.
   * @param resource Resource record of the agreement
   * @param name Name of the collection
   */
  abstract deleteCollection(
    agreement: Agreement,
    resource: Resource,
    name: string
  ): Promise<void>;

  async init(providerTag: string) {
    // Base class' `init` function must be called.
    await super.init(providerTag);

    /**
     * Creates a new collection.
     */
    this.route(PipeMethod.POST, "/collection", async (req) => {
      const body = validateBodyOrParams(
        req.body,
        z.object({
          /** ID of the resource. */
          id: z.number(),

          /** Protocol address. */
          pt: addressSchema,

          /** Name of the collection. */
          name: z.string(),

          /** Fields/columns of the collection. */
          fields: z.array(fieldSchema).min(1),
        })
      );
      const { resource, agreement } = await this.getResource(
        body.id,
        body.pt as Address,
        req.requester
      );

      await this.createCollection(agreement, resource, body.name, body.fields);

      return {
        code: PipeResponseCode.OK,
      };
    });

    /**
     * Deletes a collection.
     */
    this.route(PipeMethod.DELETE, "/collection", async (req) => {
      const body = validateBodyOrParams(
        req.body,
        z.object({
          /** ID of the resource. */
          id: z.number(),

          /** Protocol address. */
          pt: addressSchema,

          /** Name of the collection. */
          name: z.string(),
        })
      );
      const { resource, agreement } = await this.getResource(
        body.id,
        body.pt as Address,
        req.requester
      );

      await this.deleteCollection(agreement, resource, body.name);

      return {
        code: PipeResponseCode.OK,
      };
    });

    /**
     * Gets the nearest neighbors for the given embeddings or content.
     */
    this.route(PipeMethod.POST, "/searchInCollection", async (req) => {
      const body = validateBodyOrParams(
        req.body,
        z.object({
          /** ID of the resource. */
          id: z.number(),

          /** Protocol address. */
          pt: addressSchema,

          /** Name of the collection. */
          collection: z.string(),

          /** Name of the vector column. */
          vectorField: z.string(),

          /** Search query - either embeddings array or text content */
          query: z.union([z.array(z.any()), z.string()]),

          /** Additional options. */
          options: z
            .object({
              /** Total result count. */
              limit: z.number().optional(),

              /** Metric type of the distance calculation. */
              metricType: metricTypeSchema.optional(),

              /** Fields to search in when using content search */
              searchFields: z.array(z.string()).optional(),
            })
            .optional(),
        })
      );
      const { resource, agreement } = await this.getResource(
        body.id,
        body.pt as Address,
        req.requester
      );

      const result = await this.searchInCollection(
        agreement,
        resource,
        body.collection,
        body.vectorField,
        body.query,
        body.options
      );

      return {
        code: PipeResponseCode.OK,
        body: result,
      };
    });

    /**
     * Searches for nearest neighbors across all available collections.
     */
    this.route(PipeMethod.POST, "/search", async (req) => {
      const body = validateBodyOrParams(
        req.body,
        z.object({
          /** ID of the resource. */
          id: z.number(),

          /** Protocol address. */
          pt: addressSchema,

          /** Name of the vector column. */
          vectorField: z.string(),

          /** Search query - either embeddings array or text content */
          query: z.union([z.array(z.any()), z.string()]),

          /** Additional options. */
          options: z
            .object({
              /** Total result count per collection. */
              limit: z.number().optional(),

              /** Metric type of the distance calculation. */
              metricType: metricTypeSchema.optional(),

              /** Fields to search in when using content search */
              searchFields: z.array(z.string()).optional(),
            })
            .optional(),
        })
      );
      const { resource, agreement } = await this.getResource(
        body.id,
        body.pt as Address,
        req.requester
      );

      const result = await this.search(
        agreement,
        resource,
        body.vectorField,
        body.query,
        body.options
      );

      return {
        code: PipeResponseCode.OK,
        body: result,
      };
    });

    /**
     * Insert data into a collection.
     */
    this.route(PipeMethod.POST, "/data", async (req) => {
      const body = validateBodyOrParams(
        req.body,
        z.object({
          /** ID of the resource. */
          id: z.number(),

          /** Protocol address. */
          pt: addressSchema,

          /** Name of the collection. */
          collection: z.string(),

          /** Data to be inserted. */
          data: z.array(z.record(z.string(), z.any())).min(1),
        })
      );
      const { resource, agreement } = await this.getResource(
        body.id,
        body.pt as Address,
        req.requester
      );

      await this.insertData(agreement, resource, body.collection, body.data);

      return {
        code: PipeResponseCode.OK,
      };
    });

    /**
     * Delete data from a collection.
     */
    this.route(PipeMethod.DELETE, "/data", async (req) => {
      const body = validateBodyOrParams(
        req.body,
        z.object({
          /** ID of the resource. */
          id: z.number(),

          /** Protocol address. */
          pt: addressSchema,

          /** Name of the collection. */
          collection: z.string(),

          /** Conditions for selecting the records that is going to be deleted. */
          conditions: z.record(z.string(), conditionValueSchema),
        })
      );
      const { resource, agreement } = await this.getResource(
        body.id,
        body.pt as Address,
        req.requester
      );

      await this.deleteData(
        agreement,
        resource,
        body.collection,
        body.conditions
      );

      // Return the response with the results.
      return {
        code: PipeResponseCode.OK,
      };
    });
  }
}
