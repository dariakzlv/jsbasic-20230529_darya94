import createElement from '../../assets/lib/create-element.js';

export default class Modal {
  constructor() {
    this.render();
    this.open(); //метод, который будет открывать модалку
    this.setTitle(); //метод, который будет вставлять заголовок
    this.setBody(); //метод, который будет вставлять тело модалки
    this.close(); //метод, который будет закрывать модалку
  }

  //сначала напишем разметку
  render() {
    this.modal = document.createElement('DIV');
    this.modal.classList.add('modal');
    //вставляем в него всю разметку
    this.modal.innerHTML= `
    <div class="modal__overlay"></div>

    <div class="modal__inner">
      <div class="modal__header">
        <!--Кнопка закрытия модального окна-->
        <button type="button" class="modal__close">
          <img src="/assets/images/icons/cross-icon.svg" alt="close-icon" />
        </button>

        <h3 class="modal__title">
          Вот сюда нужно добавлять заголовок
        </h3>
      </div>

      <div class="modal__body">
        A сюда нужно добавлять содержимое тела модального окна
      </div>
    </div>
    `
    //пропишем событие при клике на крестик, будем вызывать метод close
    let buttonClose = this.modal.querySelector('.modal__close');
    buttonClose.addEventListener('click', () => {this.close()});

    //пропишем, что при клике на esc тоже будем закрывать, повесим на весь документ
    //событие, что при нажатии клавиши, если это еск, то закрываем. причем пишем это
    //именно в рендере, потому что это должно работать, только если модалка отрендерена
    document.addEventListener('keydown', (event) => {
      if (event.code === 'Escape') this.close(); 
    })
  }

  //опишем, что делает метод open
  open() {
    //вставляем в body модалку
    document.body.append(this.modal);
    //навешиваем на body класс
    document.body.classList.add('is-modal-open');
  }

  setTitle(title) {
    //выбираем элемент с нужным классом и говорим, что его текст контент равен тому, что задали в переменной
    this.modal.querySelector('.modal__title').textContent = title;
  }

  setBody(body) {
    //сначала очищаем, что было в боди
    this.modal.querySelector('.modal__body').innerHTML = ' ';
    //теперь вставляем в боди то, что записали в переменную
    this.modal.querySelector('.modal__body').append(body);
  }

  close() {
    //убираем с body класс
    document.body.classList.remove('is-modal-open');
    //удаляем узел с модалкой
    this.modal.remove();
  }


}
