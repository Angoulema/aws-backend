import { getRandomNumber } from '../utils/generate-number-from-range';
import { Product } from '../types';

const generateRandomPrice = () => getRandomNumber(10, 60);
const generateMockData = (): Product[] => {
  const mapsNames = [
    { name: 'Ankh-Morpork Map', id: 'M-DCW001'},
    { name: 'Discworld Map', id: 'M-DCW002' },
    { name: 'Sto Plains Map', id: 'M-DCW003' }
  ];
  const booksNames = [
    { name: 'The Truth', id: 'B-DCW001'},
    { name: 'Guards! Guards!', id: 'B-DCW002' },
    { name: 'Feet of Clay', id: 'B-DCW003' },
    { name: 'Night Watch', id: 'B-DCW004' },
    { name: 'Thud!', id: 'B-DCW005' },
    { name: 'Making Money', id: 'B-DCW006' },
    { name: 'Going Postal', id: 'B-DCW007'}
  ];

  const mapData = mapsNames.map((item) => ({
    productId: item.id,
    productName: item.name,
    productType: 'Map',
    price: generateRandomPrice(),
    currency: 'GBP'
  }));
  const bookData = booksNames.map((item) => ({
    productId: item.id,
    productName: item.name,
    productType: 'Book',
    price: generateRandomPrice(),
    currency: 'GBP'
  }))

  return [...mapData, ...bookData];
}

class Products {
  private productData: Product[];

  constructor() {
    this.productData = generateMockData();
  }

  public async getAllProducts(): Promise<Product[]> {
    return this.productData;
  }

  public async getProductById(id: string) {
    const item = this.productData.find(({ productId }) => productId === id);
    return item || null;
  }
}

export const mockProducts = new Products();
