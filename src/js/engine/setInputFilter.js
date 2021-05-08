/* eslint-disable no-param-reassign */
// Restricts input for the given textbox to the given inputFilter function.
/**
 * Restricts non-numeric input
 * @param {Element} textbox - target Element
 * @param {Function} inputFilter - filtering pattern
 */
export default function setInputFilter(textbox, inputFilter) {
  ['input', 'keydown', 'keyup', 'mousedown', 'mouseup', 'select', 'contextmenu', 'drop'].forEach(
    (event) => {
      textbox.addEventListener(event, () => {
        if (inputFilter(textbox.value)) {
          textbox.oldValue = textbox.value;
          textbox.oldSelectionStart = textbox.selectionStart;
          textbox.oldSelectionEnd = textbox.selectionEnd;
          // eslint-disable-next-line no-prototype-builtins
        } else if (textbox.hasOwnProperty('oldValue')) {
          textbox.value = textbox.oldValue;
          textbox.setSelectionRange(textbox.oldSelectionStart, textbox.oldSelectionEnd);
        } else {
          textbox.value = '';
        }
      });
    }
  );
}
