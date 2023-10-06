import createElement from '../../assets/lib/create-element.js';
import escapeHtml from '../../assets/lib/escape-html.js';

import Modal from '../../7-module/2-task/index.js';

export default class Cart {
  cartItems = []; // [product: {...}, count: N]

  constructor(cartIcon) {
    this.cartIcon = cartIcon;

    this.addEventListeners();
  }

  addProduct(product) {
    //сперва добавим проверку, которая заставит код работать, только если не null и если аргумент не пустой
    if(arguments.length > 0 && product != null) {
      this.productIsAdded = 0;
      //проверка, есть ли товар в корзине,если товара еще нет, то добавляем его, проверяем по Id
      for (let cartItem of this.cartItems) {
        //если айди продукта в корзине и айди текущего продукта совпали
        if (cartItem.product.id == product.id) {
          //то продукт добавлен
          this.productIsAdded = 1;
        }
      }
      //если продукт не добавлен, то добавим
      let productToAdd = {
        "product": product,
        "count": 1,
      };
      if (!this.productIsAdded) {
        this.cartItems.push(productToAdd);
        this.onProductUpdate(this.cartItems[this.cartItems.length-1]);
    } else {
      for (let cartItem of this.cartItems) {
        //если айди продукта в корзине и айди текущего продукта совпали
        if (cartItem.product.id == product.id) {
          //то увеличиваем количество
          cartItem.count++;
        }
        this.onProductUpdate(this.cartItems[this.cartItems.length-1]);
    }}
    console.log(this.cartItems)
  }
  }

  //меняет количество товара при клике на плюс
  updateProductCount(productId, amount) {
    //для каждого элемента проверяем
    for (let cartItem of this.cartItems) {
      //если айди товара совпало с тем, на которое кликнули
      if (cartItem.product.id == productId) {
        //если нажали на +, то увеличиваем число
        if (amount == 1) {
          cartItem.count++;
          //меняем верстку
          this.onProductUpdate(this.cartItems[this.cartItems.length-1]);
        } else {
          //если на -, то уменьшаем
          if (cartItem.count > 1) { cartItem.count--; 
            //меняем верстку
          this.onProductUpdate(this.cartItems[this.cartItems.length-1]);
          } else {
            //если количество достигло нуля, то удаляем этот объект
            let elemToDelete = this.cartItems.indexOf(cartItem);
            this.cartItems.splice(elemToDelete, 1);
            this.onProductUpdate(this.cartItems[this.cartItems.length-1]);
            //из модалки тоже удаляем
            this.modalBody.querySelector(`[data-product-id="${productId}"]`).remove();
          }
        }
      }
    }
  }
  //если корзина пустая
  isEmpty() {
    //если корзина пустая, вернуть тру
    if (this.cartItems.length) {return false} else {return true};
  }

  getTotalCount() {
    this.totalCount = 0;
    //для каждого элемента в корзине проверяем количество и суммируем с общим
    for (let cartItem of this.cartItems) {
      this.totalCount = cartItem.count + this.totalCount;

    }
    return this.totalCount
  }

  getTotalPrice() {
    this.totalPrice = 0;
    //для каждого товара в корзине смотрим цену, умножаем на количество и все суммируем
    for (let cartItem of this.cartItems) {
      this.totalPrice = cartItem.product.price*cartItem.count + this.totalPrice;
    }
    return this.totalPrice
  }

  renderProduct(product, count) {
    return createElement(`
    <div class="cart-product" data-product-id="${
      product.id
    }">
      <div class="cart-product__img">
        <img src="/assets/images/products/${product.image}" alt="product">
      </div>
      <div class="cart-product__info">
        <div class="cart-product__title">${escapeHtml(product.name)}</div>
        <div class="cart-product__price-wrap">
          <div class="cart-counter">
            <button type="button" class="cart-counter__button cart-counter__button_minus">
              <img src="/assets/images/icons/square-minus-icon.svg" alt="minus">
            </button>
            <span class="cart-counter__count">${count}</span>
            <button type="button" class="cart-counter__button cart-counter__button_plus">
              <img src="/assets/images/icons/square-plus-icon.svg" alt="plus">
            </button>
          </div>
          <div class="cart-product__price">€${product.price.toFixed(2)}</div>
        </div>
      </div>
    </div>`);
  }

  renderOrderForm() {
    return createElement(`<form class="cart-form">
      <h5 class="cart-form__title">Delivery</h5>
      <div class="cart-form__group cart-form__group_row">
        <input name="name" type="text" class="cart-form__input" placeholder="Name" required value="Santa Claus">
        <input name="email" type="email" class="cart-form__input" placeholder="Email" required value="john@gmail.com">
        <input name="tel" type="tel" class="cart-form__input" placeholder="Phone" required value="+1234567">
      </div>
      <div class="cart-form__group">
        <input name="address" type="text" class="cart-form__input" placeholder="Address" required value="North, Lapland, Snow Home">
      </div>
      <div class="cart-buttons">
        <div class="cart-buttons__buttons btn-group">
          <div class="cart-buttons__info">
            <span class="cart-buttons__info-text">total</span>
            <span class="cart-buttons__info-price">€${this.getTotalPrice().toFixed(
              2
            )}</span>
          </div>
          <button type="submit" class="cart-buttons__button btn-group__button button">order</button>
        </div>
      </div>
    </form>`);
  }

  renderModal() {
    this.modal = new Modal();
    this.modal.setTitle('Your order');
    //сначала в боди закинем разметку для каждого товара;
    this.modalBody = document.createElement('DIV');
    for (let cartItem of this.cartItems) {
      this.modalBody.append(this.renderProduct(cartItem.product, cartItem.count));
    }
    //теперь закинем форму
    this.modalBody.append(this.renderOrderForm());
    //а теперь вызываем метод модалки и вставляем боди
    this.modal.setBody(this.modalBody);
    this.modal.open();

    //при клике на кнопку надо менять количество
    document.addEventListener('click', (event) => {
      //если евент - это кнопка +
      if(event.target.closest('.cart-counter__button_plus')) {
        let amount = 1;
        let productId = event.target.closest('.cart-product').getAttribute('data-product-id');
        this.updateProductCount(productId, amount);
      } else if (event.target.closest('.cart-counter__button_minus')) {
        let amount = -1;
        console.log(-1)
        let productId = event.target.closest('.cart-product').getAttribute('data-product-id');
        this.updateProductCount(productId, amount);
      }
    } )

    //при событии сабмит вызывать метод сабмит
    this.form = document.querySelector('.cart-form');
    this.form.addEventListener('submit', (event) => {
      this.onSubmit(event);
    })

    //надо, чтобы на выключение модалки, данные там обновлялись
    document.querySelector('.modal__close').addEventListener('onclick', () => {
      this.modal = null;
    })

  }

    //меняет верстку, когда менятся количество товара
  onProductUpdate(cartItem) {
    this.cartIcon.update(this);
    //обновлять числа нужно, только если модальное окно открыто
    if (document.body.classList.contains('is-modal-open')) {
      //если в корзине ничего нет, то закрываем модалку
      if (this.cartItems.length == 0) {
        console.log(0)
        this.modal.close();
      } else {
        let productId = cartItem.product.id;
      //нам надо менять количество товара, его стоимость и общую стоимость
      let itemCount = this.modalBody.querySelector(`[data-product-id="${productId}"] .cart-counter__count`);
      let itemPrice = this.modalBody.querySelector(`[data-product-id="${productId}"] .cart-product__price`);
      let totalPrice = this.modalBody.querySelector('.cart-buttons__info-price');
      itemCount.innerHTML = `${cartItem.count}`;
      itemPrice.innerHTML = `€${(cartItem.product.price*cartItem.count).toFixed(2)}`;
      totalPrice.innerHTML = `€${this.getTotalPrice().toFixed(2)}`
      }
    }
  }

  async onSubmit(event) {
    //уберем базовое событие
    event.preventDefault();
    this.submitButton = this.form.querySelector('[type="submit"]');
    this.submitButton.classList.add('is-loading');
    
    //теперь надо отправить POST запрос c помощью fetch
    //сформируем formData из формы
    let fd = new FormData (this.form);
    //вызовем POST метод, отправим им наши данные из формы
    let response = await fetch('https://httpbin.org/post', {
      method: 'POST',
      body: fd
    })
    
    //надо проверить, была ли отправка данных успешной
    //для этого надо узнать статус
    //если окей, то заменим данные
    if (response.ok) {
      
      this.submitButton.classList.remove('is-loading');
      this.modal.setTitle('Success!');
      this.modalBody.innerHTML = `<div class="modal__body-inner">
      <p>
        Order successful! Your order is being cooked :) <br>
        We’ll notify you about delivery time shortly.<br>
        <img src="/assets/images/delivery.gif">
      </p>
    </div>`;
      this.cartItems.length = 0;
      this.onProductUpdate(this.cartItems);
    }

  };

  addEventListeners() {
    this.cartIcon.elem.onclick = () => this.renderModal();
  }
}

