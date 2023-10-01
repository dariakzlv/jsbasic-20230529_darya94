import createElement from '../../assets/lib/create-element.js';

export default class CartIcon {
  constructor() {
    this.render();

    this.addEventListeners();
  }

  render() {
    this.elem = createElement('<div class="cart-icon"></div>');
  }

  update(cart) {
    if (!cart.isEmpty()) {
      this.elem.classList.add('cart-icon_visible');

      this.elem.innerHTML = `
        <div class="cart-icon__inner">
          <span class="cart-icon__count">${cart.getTotalCount()}</span>
          <span class="cart-icon__price">€${cart.getTotalPrice().toFixed(2)}</span>
        </div>`;

      this.updatePosition();

      this.elem.classList.add('shake');
      this.elem.addEventListener('transitionend', () => {
        this.elem.classList.remove('shake');
      }, {once: true});

    } else {
      this.elem.classList.remove('cart-icon_visible');
    }
  }

  addEventListeners() {
    document.addEventListener('scroll', () => this.updatePosition());
    window.addEventListener('resize', () => this.updatePosition());
  }

  updatePosition() {
    //если элемент выведен, потому что товары добавлены в корзину
    if (!this.elem.offsetWidth == 0) {
      //если корзина ушла за пределы окна по вертикали
      if ((this.elem.getBoundingClientRect().top < window.scrollY) && (document.documentElement.clientWidth > 767)) {
        this.elem.style.position = "fixed";
        this.elem.style.top = "50px";
        this.elem.style.zIndex = "1000";
        //должна отстоять на 20px от контейнера
        let container = document.querySelector(".container");
        //выберем меньшее из двух условий позиционирования
        this.elem.style.left = Math.min(
          container.getBoundingClientRect().left + container.offsetWidth + 20,
          document.documentElement.clientWidth - this.elem.offsetWidth - 10
        ) + "px"
      } else {
        //как только пользователь поднялся вверх,сбросим все условия
        this.elem.style.position = "";
        this.elem.style.top = "";
        this.elem.style.left = "";
      }
    }
  }
}
