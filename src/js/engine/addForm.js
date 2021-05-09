export default function addForm(params) {
  let data = {
    name: '',
    price: '',
  };
  if (params.name && params.price) {
    data = params;
  }

  const element = document.createElement('div');
  element.classList.add('form-holder');
  element.innerHTML = `
  <form id="goodsForm" novalidate class="form">
    <h3 class="form__input-header">Название</h3>
    <div class="form-control">
      <input class="form__input-input" type="text" id="name" name="name" value="${data.name}" required placeholder="Введите название" >
    </div>
    <h3 class="form__input-header">Стоимость</h3>
    <div class="form-control">
      <input class="form__input-input" type="text" id="price" name="price" value="${data.price}" required placeholder="Введите стоимость (123.45)" >
    </div>
    <div class="form__input-button-holder">
      <button type="submit" class="btn" id="save">Сохранить</button>
      <button type="button" class="btn" id="cancel">Отмена</button>
    </div>
  </form>
  `;

  return element;
}
