/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
import drawWidget from './drawWidget';
import addForm from './addForm';
import setInputFilter from './setInputFilter';

export default class GoodsList {
  constructor() {
    drawWidget();
    this.container__list = document.querySelector('.container__list');
    this.elementAddItem = document.querySelector('.container__header-plus');
  }

  init() {
    this.addListeners();
    this.addTableRow({ name: 'iPhone XR', price: 60000 });
    this.addTableRow({ name: 'Samsung Galaxy S10+', price: 80000 });
    this.addTableRow({ name: 'Huawei View', price: 50000 });
  }

  /**
   * Adds listeners for the widget
   */
  addListeners() {
    this.elementAddItem.addEventListener(
      'click',
      (event) => {
        event.preventDefault();
        this.showForm(event.target, false);
      },
      false
    );
  }

  /**
   * Draws new table row and adds listeners for its buttons
   * @param {Object} data : name and price for new entry
   */
  addTableRow(data) {
    const newRow = GoodsList.getNewTableRowElement(data);
    newRow.querySelector('.icon-edit').addEventListener(
      'click',
      (event) => {
        event.preventDefault();
        this.showForm(event.target.closest('tr'), true);
      },
      false
    );
    newRow.querySelector('.icon-delete').addEventListener(
      'click',
      (event) => {
        event.preventDefault();
        event.target.closest('tr').remove();
      },
      false
    );
    this.container__list.append(newRow);
  }

  /**
   * Returns <tr> element
   * @param {object} data { name, price } of entry
   * @returns Element TR for the table
   */
  static getNewTableRowElement({ name, price }) {
    const tr = document.createElement('tr');
    tr.setAttribute('data-name', name);
    tr.setAttribute('data-price', price);
    tr.innerHTML = `
    <td class="table__cell" data-id="name">${name}</td>
    <td class="table__cell" data-id="price">${new Intl.NumberFormat('ru-RU').format(price)}</td>
    <td class="table__cell">
      <span class="icon-edit">✎</span>&nbsp;
      <span class="icon-delete">𐢫</span>
    </td>
    `;
    return tr;
  }

  /**
   * Shows the form modal vindow
   * @param {Element} targetElement - element, caused action
   * @param {Boolean} action : true - edit existed // false - new entry
   */
  showForm(targetElement, action) {
    const params = { name: targetElement.dataset.name, price: targetElement.dataset.price };
    this.form = addForm(params);
    const defaultPositionElement = this.container__list;
    document.body.appendChild(this.form);
    this.form.style.width = `${this.container__list.offsetWidth - 10}px`;
    const { top, left } = defaultPositionElement.getBoundingClientRect();
    this.form.style.top = `${window.scrollY + top - 10}px`;
    this.form.style.left = `${window.scrollX + left + 5}px`;
    this.addFormListeners(targetElement, action);
  }

  /**
   * Adds listeners to all form elements
   * @param {Element} target : target element
   * @param {Boolean} action : true - edit existed // false - new entry
   */
  addFormListeners(target, action) {
    document.forms.goodsForm.price.addEventListener(
      'input',
      (event) => {
        event.preventDefault();
        setInputFilter(
          event.target,
          (value) => /^\d*.{0,1}\d{0,2}$/.test(value) // Allow money format
        );
      },
      false
    );
    document.forms.goodsForm.addEventListener(
      'submit',
      (event) => {
        event.preventDefault();
        this.forceEntryChanges(target, action);
      },
      false
    );
    document.getElementById('save').addEventListener(
      'click',
      (event) => {
        event.preventDefault();
        this.forceEntryChanges(target, action);
      },
      false
    );
    document.getElementById('cancel').addEventListener(
      'click',
      (event) => {
        event.preventDefault();
        this.closeForm(event.target.closest('.form'));
      },
      false
    );
  }

  /**
   * Adds or edit entry
   * @param {Element} target : target element
   * @param {Boolean} action : true - edit existed // false - new entry
   */
  forceEntryChanges(target, action) {
    const name = document.forms.goodsForm.name.value;
    const price = document.forms.goodsForm.price.value;
    if (!action) {
      this.addTableRow({ name, price });
    } else {
      this.editTableRow({ name, price }, target);
    }
    this.closeForm(this.form);
  }

  /**
   * Push changes to the target element
   * @param {Object} data : name and price of the entry
   * @param {Element} target element
   */
  editTableRow({ name, price }, target) {
    target.dataset.name = name;
    target.dataset.price = price;
    [...target.querySelectorAll('td')].forEach((el) => {
      if (el.dataset.id === 'name') {
        el.textContent = name;
      }
      if (el.dataset.id === 'price') {
        el.textContent = new Intl.NumberFormat('ru-RU').format(price);
      }
    });
  }

  /**
   * Removes target element from DOM
   * @param {Element} target
   */
  closeForm(target) {
    target.remove();
    this.form = null;
  }
}
