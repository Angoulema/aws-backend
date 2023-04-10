import { StockRepository } from "../persistence/stock-repository";
import { ProductsRepository } from "../persistence/products-repository";
import { Product, ProductRepresentation, Stock } from "../types";
import { randomUUID } from "crypto";

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
    if (!product || !stock) {
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

  public async addProductRepresentation(productItem: Omit<Product, 'productId'>, stockItem: Omit<Stock, 'id'>) {
    const uniqueId = randomUUID();
    await this.productRepository.addProduct({ productId: uniqueId, ...productItem });
    await this.stockRepository.addStock({ id: uniqueId, ...stockItem });
  }
}
