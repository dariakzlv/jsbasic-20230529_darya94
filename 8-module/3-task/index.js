export default class Cart {
  cartItems = []; // [{product: {...}, count: N}]

  constructor(cartIcon) {
    this.cartIcon = cartIcon;
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

  updateProductCount(productId, amount) {
    for (let cartItem of this.cartItems) {
      if (cartItem.product.id == productId) {
        if (amount == 1) {
          cartItem.count++;
          this.onProductUpdate(this.cartItems[this.cartItems.length-1]);
        } else {
          if (cartItem.count > 1) { cartItem.count--; 
          this.onProductUpdate(this.cartItems[this.cartItems.length-1]);
          } else {
            let elemToDelete = this.cartItems.indexOf(cartItem);
            this.cartItems.splice(elemToDelete, 1);
            this.onProductUpdate(this.cartItems[this.cartItems.length-1]);
          }
        }
      }
    }
  }

  isEmpty() {
    //если корзина пустая, вернуть тру
    if (this.cartItems.length) {return false} else {return true};
  }

  getTotalCount() {
    this.totalCount = 0;
    for (let cartItem of this.cartItems) {
      this.totalCount = cartItem.count + this.totalCount;

    }
    return this.totalCount
  }

  getTotalPrice() {
    this.totalPrice = 0;
    for (let cartItem of this.cartItems) {
      this.totalPrice = cartItem.product.price*cartItem.count + this.totalPrice;
    }
    return this.totalPrice
  }

  onProductUpdate(cartItem) {
    // реализуем в следующей задаче

    this.cartIcon.update(this);
  }
}

