import Carousel from '../../6-module/3-task/index.js';
import slides from '../../6-module/3-task/slides.js';

import RibbonMenu from '../../7-module/1-task/index.js';
import categories from '../../7-module/1-task/categories.js';

import StepSlider from '../../7-module/4-task/index.js';
import ProductsGrid from '../../8-module/2-task/index.js';

import CartIcon from '../../8-module/1-task/index.js';
import Cart from '../../8-module/4-task/index.js';

export default class Main {

  constructor() {
  }

  //рендерим простые компоненты
  renderSimpleComponents() {
    this.carousel = new Carousel(slides);
    document.querySelector('[data-carousel-holder]').append(this.carousel.elem);

    this.ribbonMenu = new RibbonMenu(categories);
    document.querySelector('[data-ribbon-holder]').append(this.ribbonMenu.elem);

    this.stepSlider = new StepSlider({
      steps: 5,
      value: 3
    });
    document.querySelector('[data-slider-holder]').append(this.stepSlider.elem);

    this.cartIcon = new CartIcon();
    document.querySelector('[data-cart-icon-holder]').append(this.cartIcon.elem);

    this.cart = new Cart(this.cartIcon);
  }

  async renderProductList() {
    this.productContainer = document.querySelector('[data-products-grid-holder]');
    this.productContainer.innerHTML = ' ';

    await fetch('../2-task/products.json')
      .then(response => {
        return response.json(); //тут я читаю данные
      })
      .then(data => {
        this.products = [];
        for (let product of data) { //тут я их получаю
          this.products.push(product); 
        }
        console.log(this.products)
      })
      
    this.productsGrid = new ProductsGrid(this.products);
    this.productContainer.append(this.productsGrid.elem);

    //первоначальная фильтрация по выставленным параметрам
    this.productsGrid.updateFilter({
      noNuts: document.getElementById('nuts-checkbox').checked,
      vegeterianOnly: document.getElementById('vegeterian-checkbox').checked,
      maxSpiciness: this.stepSlider.value,
      category: this.ribbonMenu.value
    });

    //дальше будем отслеживать пользовательские события
    this.cart = new Cart(this.cartIcon)
    //если добавили продукт в корзину, то появляется иконка корзины
    document.body.addEventListener('product-add', (event) => {
      let productIdEvent = event.detail;
      let product = this.products.find(product => product.id == productIdEvent);
      this.cart.addProduct(product);
    })

    //фильтруем по остроте
    this.stepSlider.elem.addEventListener('slider-change', ({ detail: value }) => {
      this.productsGrid.updateFilter({
        maxSpiciness: value
      })
    })

    //фильтруем по категории
    this.ribbonMenu.elem.addEventListener('ribbon-select', ({detail: categoryId}) =>{
      this.productsGrid.updateFilter({
        category: categoryId
      })
    }
    )

    //фильтрация при изменении чекбоксов
    let noNutsCheckbox = document.getElementById('nuts-checkbox');
    let vegeterianCheckbox = document.getElementById('vegeterian-checkbox');
    noNutsCheckbox.addEventListener('change', (event) =>{
      this.productsGrid.updateFilter({
        noNuts: event.target.checked
      })
    }
    )

    vegeterianCheckbox.addEventListener('change', (event) =>{
      this.productsGrid.updateFilter({
        vegeterianOnly: event.target.checked
      })
    }
    )

  }

  async render() {
    this.renderSimpleComponents();
    this.renderProductList();
    
  }
}
