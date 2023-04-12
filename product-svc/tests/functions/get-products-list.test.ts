import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { main as getProductsList } from '../../src/functions/get-products-list/handler';
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
  resource: 'test'
};

const products = [
  {
    productId: 'test-id-1',
    productName: 'test-name-1',
    productType: 'test-type-1',
    price: 50,
    currency: 'GBP'
  },
  {
    productId: 'test-id-2',
    productName: 'test-name-2',
    productType: 'test-type-2',
    price: 50,
    currency: 'GBP'
  }
];

const spyGetProductsList = jest.spyOn(mockProducts, 'getAllProducts');

describe('getProductsList lambda', () => {
  it('GET 200 OK', async () => {
    spyGetProductsList.mockImplementationOnce(() => Promise.resolve(products));

    const result = await getProductsList(testEvent as unknown as MiddyHandler, {} as Context, () => {});
    expect(result?.statusCode).toBe(200);
    const { body } = result;
    const bodyObject = JSON.parse(body);
    expect(bodyObject.length).toBe(2);
  });
});
