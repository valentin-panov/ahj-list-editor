export default function addForm(params) {
  let data = {
    name: '',
    price: '',
  };
  if (params.name && params.price) {
    data = params;
  }

  const element = document.createElement('div');
  element.classList.add('form');
  element.innerHTML = `
  <form id="goodsForm">
    <h3 class="form__input-header">Название</h3>
    <input class="form__input-input" type="text" name="name" value="${data.name}">
    <h3 class="form__input-header">Стоимость</h3>
    <input class="form__input-input" type="text" name="price" value="${data.price}">
    <div class="form__input-button-holder">
      <button type="submit" class="btn" id="save">Сохранить</button>
      <button type="button" class="btn" id="cancel">Отмена</button>
    </div>
  </form>
  `;

  return element;
}
