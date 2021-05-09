/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
import drawWidget from './drawWidget';
import addForm from './addForm';
import setInputFilter from './setInputFilter';
import FORM_ERRORS from '../data/formErrors';

export default class GoodsList {
  constructor() {
    drawWidget();
    this.container__list = document.querySelector('.container__list');
    this.elementAddItem = document.querySelector('.container__header-plus');
    this.entries = [];
    this.error = null;
  }

  init() {
    this.addListeners();
    this.entries.push(
      { name: 'iPhone XR', price: 60000 },
      { name: 'Samsung Galaxy S10+', price: 80000 },
      { name: 'Huawei View', price: 50000 }
    );
    this.render();
  }

  render() {
    this.container__list.innerHTML = '';
    this.entries.forEach((element, index) => {
      this.addTableRow({ element, index });
    });
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
        this.removeEntry(event.target);
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
  static getNewTableRowElement(data) {
    const { index } = data;
    const { name, price } = data.element;
    const tr = document.createElement('tr');
    tr.setAttribute('data-name', name);
    tr.setAttribute('data-price', price);
    tr.setAttribute('data-index', index);
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
   * Push changes to the target element
   * @param {Object} data : name and price of the entry
   * @param {Element} target element
   */
  editTableRow({ name, price }, target) {
    const targetElement = this.entries[target.dataset.index];
    targetElement.name = name;
    targetElement.price = price;
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
   * Shows the form modal vindow
   * @param {Element} targetElement - element, caused action
   * @param {Boolean} action : true - edit existed // false - new entry
   */
  showForm(targetElement, action) {
    const params = { name: targetElement.dataset.name, price: targetElement.dataset.price };
    this.form = addForm(params);
    const defaultPositionElement = this.container__list;
    document.body.appendChild(this.form);

    this.form.style.width = `${this.container__list.offsetWidth - 10}px`; // 10px less in width
    const { top, left } = defaultPositionElement.getBoundingClientRect();
    this.form.style.top = `${window.scrollY + top - 10}px`; // 10px - up from parent
    this.form.style.left = `${window.scrollX + left + 5}px`; // 5px inside the parent

    this.addFormListeners(targetElement, action);
    document.forms.goodsForm.name.focus();
  }

  /**
   * Adds listeners to all form elements
   * @param {Element} target : target element
   * @param {Boolean} action : true - edit existed // false - new entry
   */
  addFormListeners(target, action) {
    document.forms.goodsForm.name.addEventListener(
      'input',
      (event) => {
        event.preventDefault();
        event.target.classList.remove('invalid');
      },
      false
    );
    document.forms.goodsForm.price.addEventListener(
      'input',
      (event) => {
        event.preventDefault();
        event.target.classList.remove('invalid');
        setInputFilter(
          event.target,
          (value) => /^\d*\.{0,1}\d{0,2}$/.test(value) // Allow money format
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
        this.closeForm(event.target.closest('.form-holder'));
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
    const form = document.forms.goodsForm;
    let { error } = this;

    // old error removing
    if (error !== null) {
      error.remove();
      error = null;
    }
    // check validity code
    const isValid = form.checkValidity();

    if (!isValid) {
      // remove invalid class from all valid elements
      [...form.elements].find((o) => o.validity.valid).classList.remove('invalid');

      const first = [...form.elements].find((o) => !o.validity.valid);
      first.focus();
      first.classList.add('invalid');

      const ValidityState = first.validity;
      let errorKey = 'Неизвестная ошибка';

      for (const key in ValidityState) {
        if (ValidityState[key]) {
          errorKey = key;
        }
      }

      error = document.createElement('div');
      error.dataset.id = 'error';
      error.className = 'form-error';
      error.textContent = `${FORM_ERRORS.FORM_ERRORS[first.name][errorKey]}`;

      // for relative positioning inside container
      first.offsetParent.appendChild(error);
      error.style.top = `${first.offsetTop + first.offsetHeight / 2 - error.offsetHeight / 2}px`;
      error.style.left = `${first.offsetLeft + first.offsetWidth + 5}px`;
      this.error = error;
      return;
    }

    const name = form.name.value;
    const price = form.price.value;

    if (!action) {
      this.entries.push({ name, price });
    } else {
      this.editTableRow({ name, price }, target);
    }
    this.closeForm(this.form);
    this.render();
  }

  removeEntry(target) {
    this.entries.splice(target.closest('tr').dataset.index, 1);
    this.render();
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
