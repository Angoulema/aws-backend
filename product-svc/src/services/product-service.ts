import { StockRepository } from "../persistence/stock-repository";
import { ProductsRepository } from "../persistence/products-repository";
import { ProductInput, ProductRepresentation } from "../types";
import { randomUUID } from "crypto";
import logger from '../service-logger';

export class ProductService {
  private productRepository: ProductsRepository;
  private stockRepository: StockRepository;

  constructor() {
    this.productRepository = new ProductsRepository();
    this.stockRepository = new StockRepository();
  }

  public async getProductById(id: string): Promise<ProductRepresentation> {
    const product = await this.productRepository.getProductById(id);
    const stock = await this.stockRepository.getStockById(id);
    if (!product) {
      logger.warn(id, 'No product with such id');
      return null;
    }
    if (!stock) {
      logger.warn(id, 'No stock with such id');
      return null;
    }

    return {
      ...product,
      count: stock.count
    };
  }

  public async getAllProducts(): Promise<ProductRepresentation[]> {
    const products = await this.productRepository.getAllProducts();
    const productsRepresentation: ProductRepresentation[] = [];
    for (const product of products) {
      const stock = await this.stockRepository.getStockById(product.productId);
      const fullProduct = {
        ...product,
        count: stock.count
      };
      productsRepresentation.push(fullProduct);
    }
    return productsRepresentation;
  }

  public async addProductRepresentation(productInput: ProductInput) {
    const uniqueId = randomUUID();
    const { productName, productType, price , description, currency, quantity } = productInput;
    await this.productRepository.addProduct({
      productId: uniqueId, productName, productType, price, description, currency
    });
    await this.stockRepository.addStock({ id: uniqueId, count: quantity });
    return true;
  }
}
