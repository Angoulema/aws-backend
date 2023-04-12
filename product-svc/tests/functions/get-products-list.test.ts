import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { main as getProductsList } from '../../src/functions/get-products-list/handler';
import { StockRepository } from '../../src/persistence/stock-repository';
import { ProductsRepository } from '../../src/persistence/products-repository';
import { JsonValue } from 'type-fest'
import { ProductRepresentation } from 'src/types';

type MiddyHandler = Omit<APIGatewayProxyEvent, "body"> & { body: JsonValue; rawBody: string; };

const testEvent = {
  headers: {
    "Accept": "text/html,application/json"
  },
  httpMethod: 'GET',
  isBase64Encoded: false,
  path: '/products',
  resource: 'test'
};

const testIdOne = 'test-id-1';
const testIdTwo = 'test-id-2';
const testCount = 2;
const testCountTwo = 15;
const testPrice = 50;

const testStockOne = {
  id: testIdOne,
  count: testCount
};
const testStockTwo = {
  id: testIdTwo,
  count: testCountTwo
};

const products = [
  {
    productId: testIdOne,
    productName: 'test-name-1',
    productType: 'test-type-1',
    price: testPrice,
    currency: 'GBP'
  },
  {
    productId: testIdTwo,
    productName: 'test-name-2',
    productType: 'test-type-2',
    price: testPrice,
    currency: 'GBP'
  }
];

const spyGetStock = jest.spyOn(StockRepository.prototype, 'getStockById');
const spyGetAllProducts = jest.spyOn(ProductsRepository.prototype, 'getAllProducts');

describe('getProductsList lambda', () => {
  it('GET 200 OK', async () => {
    spyGetAllProducts.mockImplementation(() => Promise.resolve(products));
    spyGetStock
      .mockImplementationOnce(() => Promise.resolve(testStockOne))
      .mockImplementationOnce(() => Promise.resolve(testStockTwo));

    const result = await getProductsList(testEvent as unknown as MiddyHandler, {} as Context, () => {});
    expect(result?.statusCode).toBe(200);
    const { body } = result;
    const bodyObject = JSON.parse(body);
    expect(bodyObject.length).toBe(2);
    const [productOne, productTwo] = bodyObject as ProductRepresentation[];
    expect(productOne.count).toBe(testCount);
    expect(productOne.productId).toBe(testIdOne);
    expect(productTwo.count).toBe(testCountTwo);
    expect(productTwo.productId).toBe(testIdTwo);
  });
});
