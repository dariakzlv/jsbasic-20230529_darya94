import createElement from '../../assets/lib/create-element.js';
import ProductCard from '../../6-module/2-task/index.js';

export default class ProductGrid {
  constructor(products) {
    this.products = products;
    this.filters = {};
    this.renderWrapper();
  }
    //этот метод отрисовывает обертку для карточек
    renderWrapper() {
      //создадим грид, куда положим карточки
      this.elem = document.createElement('DIV');
      //положим его в контейнер
      document.querySelector('#container').append(this.elem);
      //дальше навесим класс и положим внутрь разметку внутреннюю
      this.elem.classList.add('products-grid');
      this.elem.innerHTML = `
      <div class="products-grid__inner">
      </div>
      `
      this.render(this.products);
    }

    //этот метод рендерит карточки продуктов
    render(productsList) {
       //дальше определим внутренний грид и положим туда карточки из объекта с продуктами
       let gridInner = this.elem.querySelector('.products-grid__inner');
       //при каждом рендере мы очищаем внутренности
       gridInner.innerHTML= "";
       //для каждого элемента будем отрисовывать карточку через класс ProductCard и класть внутрь, отрисовываем мы ее,беря данные из объекта массива productsList, который мы передаем, изначально это this.products
       for (let product of productsList) {
         this.card = new ProductCard(product);
         gridInner.append(this.card.elem);
       }
     }
//этот метод выдает список отфильтрованных продуктов
    updateFilter(filters) {
      //здесь мы записываем в нашу переменную фильтры, которые пришли
      Object.assign(this.filters, filters);
      //в новую переменную закладываем массив this.products, Отфильтрованный, 
      //метод filter Проходится по каждому элементу массива this.product и смотрит,
      //если он isFiltered true, то он записывается в массив
      //то есть тут мы передаем элемент массива this.products и смотрим, проходит ли он все фильтры в isFiltered
      const filteredProducts = this.products.filter(product => this.isFiltered(product));
      console.log("filteredProducts", filteredProducts)
      //метод рендерит только отфильтрованные продукты
      this.render(filteredProducts);
    }


  //этот метод фильтрует
    isFiltered(product) {
      //нам надо, чтобы при выборе двух фильтров выбралось общееЮ поэтому тут надо &&
      //если фильтр не выбран вообще и условие фолс, то нам все равно возвращается тру и продукт выводится даже если фильтры не выбраны
      //а если фильтр выбран, а продукт не соответствует критерию, то фолс и ретерн фолс и в updateFilter продукт не выводится
        if ((this.filters.noNuts ? !product.nuts : true)
          &&(this.filters.vegeterianOnly ? product.vegeterian : true)
          &&(this.filters.maxSpiciness >= 0 && this.filters.maxSpiciness <= 4 ? product.spiciness <= this.filters.maxSpiciness : true)
          &&(this.filters.category ? this.filters.category === product.category : true)
        ) { console.log(1);
          return true} 
        else {return false}
    }

  }