import { Agreement } from "@forest-protocols/sdk";
import {
  BaseVectorDBProvider,
  ConditionValue,
  Field,
  MetricType,
  VectorDBDetails,
} from "./base-provider";
import { DetailedOffer, Resource } from "@/types";

/**
 * The main class that implements provider specific actions.
 * @responsible Provider
 */
export class VectorDBProvider extends BaseVectorDBProvider {
  async searchInCollection(
    agreement: Agreement,
    resource: Resource,
    collection: string,
    vectorField: string,
    query: any[] | string,
    options?: {
      limit?: number;
      metricType?: MetricType;
      searchFields?: string[];
    }
  ): Promise<any[]> {
    if (typeof query === 'string') {
      // Implement content search logic using the description
      // Include logic to find and return similar images
      // Example: return searchResultsIncludingImages;
    } else if (Array.isArray(query)) {
      // Implement embeddings search logic
      // Example: return searchResultsIncludingImages;
    } else {
      throw new Error("Invalid query type.");
    }
    throw new Error("Method not implemented.");
  }

  async search(
    agreement: Agreement,
    resource: Resource,
    vectorField: string,
    query: any[] | string,
    options?: {
      limit?: number;
      metricType?: MetricType;
      searchFields?: string[];
    }
  ): Promise<{ [collection: string]: any[] }> {
    // TODO: Implement getting all collections
    const collections: string[] = [];
    return this.searchAcrossCollections(
      agreement,
      resource,
      collections,
      vectorField,
      query,
      options
    );
  }

  async searchAcrossCollections(
    agreement: Agreement,
    resource: Resource,
    collections: string[],
    vectorField: string,
    query: any[] | string,
    options?: {
      limit?: number;
      metricType?: MetricType;
      searchFields?: string[];
    }
  ): Promise<{ [collection: string]: any[] }> {
    const results: { [collection: string]: any[] } = {};
    for (const collection of collections) {
      try {
        results[collection] = await this.searchInCollection(
          agreement,
          resource,
          collection,
          vectorField,
          query,
          options
        );
      } catch (error) {
        results[collection] = [];
      }
    }
    return results;
  }

  async insertData(
    agreement: Agreement,
    resource: Resource,
    collection: string,
    data: { [field: string]: any }[]
  ): Promise<void> {
    /**
     * TODO: Implement how to insert data into a collection.
     */
    throw new Error("Method not implemented.");
  }

  async deleteData(
    agreement: Agreement,
    resource: Resource,
    collection: string,
    conditions: { [field: string]: ConditionValue }
  ): Promise<void> {
    /**
     * TODO: Implement how to delete data from a collection.
     */
    throw new Error("Method not implemented.");
  }

  async createCollection(
    agreement: Agreement,
    resource: Resource,
    name: string,
    fields: Field[]
  ): Promise<void> {
    /**
     * TODO: Implement how to create a collection.
     */
    throw new Error("Method not implemented.");
  }

  async deleteCollection(
    agreement: Agreement,
    resource: Resource,
    name: string
  ): Promise<void> {
    /**
     * TODO: Implement how to delete a collection.
     */
    throw new Error("Method not implemented.");
  }

  async create(
    agreement: Agreement,
    offer: DetailedOffer
  ): Promise<VectorDBDetails> {
    /**
     * TODO: Implement how the resource will be created.
     */
    // If there is no additional action need for creation, you can
    // just leave this method as empty and return mandatory details:
    /*  return {
      status: DeploymentStatus.Running,
      _examplePrivateDetailWontSentToUser: "string data",
      Example_Detail: 42,
    }; */

    throw new Error("Method not implemented.");
  }

  async getDetails(
    agreement: Agreement,
    offer: DetailedOffer,
    resource: Resource
  ): Promise<VectorDBDetails> {
    /**
     * TODO: Implement how the details retrieved from the resource source.
     */
    // If there is no details, you can just return the existing ones;
    /* return {
      ...resource.details,
      status: resource.deploymentStatus,
    }; */
    throw new Error("Method not implemented.");
  }

  async delete(
    agreement: Agreement,
    offer: DetailedOffer,
    resource: Resource
  ): Promise<void> {
    /**
     * TODO: Implement how the resource will be deleted.
     */
    throw new Error("Method not implemented.");
  }
}
