import GoodsList from '../engine/goodsList';
import app from '../app';

jest.mock('../engine/goodsList');

beforeEach(() => {
  GoodsList.mockClear();
});

test('new GoodsList wont be created automatically', () => {
  expect(GoodsList).not.toHaveBeenCalled();
});

test('app() should create new GoodsList', () => {
  app();
  expect(GoodsList).toHaveBeenCalledTimes(1);
});

test('app() should call method init', () => {
  expect(GoodsList).not.toHaveBeenCalled();
  app();
  expect(GoodsList).toHaveBeenCalledTimes(1);

  const goodsListInstance = GoodsList.mock.instances[0];
  const mockInit = goodsListInstance.init;

  expect(mockInit).toHaveBeenCalledTimes(1);
});
