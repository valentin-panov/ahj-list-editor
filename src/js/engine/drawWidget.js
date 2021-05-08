import { containerHeader, tableHeader } from './template';

export default function drawWidget() {
  const element = document.createElement('div');
  element.classList.add('wrapper');
  element.innerHTML = `
  <div class="container">
    <h1 class="container__title">GOODS LIST for CRM</h1>
      ${containerHeader}
    <table class="container__list">
      ${tableHeader}
    </table>
    
  </div>`;

  document.body.append(element);
}
