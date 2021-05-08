import GoodsList from './engine/goodsList';

export default function app() {
  const goodsList = new GoodsList();
  goodsList.init();
}

app();
