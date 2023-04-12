import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { main as getProductById } from '../../src/functions/get-product-by-id/handler';
import { JsonValue } from 'type-fest'
import { ProductsRepository } from '../../src/persistence/products-repository';
import { StockRepository } from '../../src/persistence/stock-repository';
import { ProductRepresentation } from 'src/types';

type MiddyHandler = Omit<APIGatewayProxyEvent, "body"> & { body: JsonValue; rawBody: string; };

const testEvent = {
  headers: {
    "Accept": "text/html,application/json"
  },
  httpMethod: 'GET',
  isBase64Encoded: false,
  path: '/products',
  pathParameters: {
    productId: 'test-id'
  },
  resource: 'test'
};

const mockId = 'test-id';
const mockCount = 5;
const testName = 'test-name';

const mockProduct = {
  productId: mockId,
  productName: testName,
  productType: 'test-type',
  price: 50,
  currency: 'GBP'
};

const mockStock = {
  id: mockId,
  count: mockCount
};

const spyGetProduct = jest.spyOn(ProductsRepository.prototype, 'getProductById');
const spyGetStock = jest.spyOn(StockRepository.prototype, 'getStockById');

describe('getProductById lambda', () => {
  it('GET 200 OK with right path param', async () => {
    spyGetProduct.mockImplementationOnce(() => Promise.resolve(mockProduct));
    spyGetStock.mockImplementationOnce(() => Promise.resolve(mockStock));

    const result = await getProductById(testEvent as unknown as MiddyHandler, {} as Context, () => {});
    expect(result?.statusCode).toBe(200);
    const { body } = result;
    const parsedBody = JSON.parse(body) as ProductRepresentation;
    expect(parsedBody.productName).toBe(testName);
    expect(parsedBody.count).toBe(mockCount);
    expect(parsedBody.productId).toBe(mockId);
  });
  it('GET 404 with wrong path param', async () => {
    spyGetProduct.mockImplementationOnce(() => Promise.resolve(null));
    spyGetStock.mockImplementationOnce(() => Promise.resolve(null));

    const testEventWrong = {
      ...testEvent,
      pathParameters: {
        productId: 'wrong-id'
      }
    } as unknown as MiddyHandler;
    const result = await getProductById(testEventWrong, {} as Context, () => {});
    expect(result?.statusCode).toBe(404);
  })
});
