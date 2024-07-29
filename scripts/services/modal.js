import * as DomElements from '../utils/elements.js';

//Hide Modal Window
export const closeModal = () => {
  DomElements.modal.classList.add('hidden');
  DomElements.overlay.classList.add('hidden');
};

//Show Modal Window
export const openModal = (input1, input2, text) => {
  DomElements.modalHeader.textContent = `${text}`;

  //Check valid username + PIN
  DomElements.modal.classList.remove('hidden');
  DomElements.overlay.classList.remove('hidden');

  // Clear input fields
  input1.value = input2.value = '';
  input2.blur();
};

// INIT MODAL DEFAULT ACTIONS
DomElements.btnCloseModal.addEventListener('click', closeModal);
DomElements.overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !DomElements.modal.classList.contains('hidden')) {
    closeModal();
  }
});
