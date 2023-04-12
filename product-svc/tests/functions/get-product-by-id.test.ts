import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { main as getProductById } from '../../src/functions/get-product-by-id/handler';
import { mockProducts } from '../../src/services/product-service-mock';
import { JsonValue } from 'type-fest'

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

const mockProduct = {
  productId: 'test-id',
  productName: 'test-name',
  productType: 'test-type',
  price: 50,
  currency: 'GBP'
}

const spyGetProductById = jest.spyOn(mockProducts, 'getProductById');

describe('getProductById lambda', () => {
  it('GET 200 OK with right path param', async () => {
    spyGetProductById.mockImplementationOnce(() => Promise.resolve(mockProduct));
    const result = await getProductById(testEvent as unknown as MiddyHandler, {} as Context, () => {});
    expect(result?.statusCode).toBe(200);
    const { body } = result;
    expect(JSON.parse(body).productName).toBe('test-name');
  });
  it('GET 404 with wrong path param', async () => {
    spyGetProductById.mockImplementationOnce(() => Promise.resolve(null));
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
