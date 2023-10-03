import createElement from '../../assets/lib/create-element.js';
import ProductCard from '../../6-module/2-task/index.js';

export default class ProductGrid {
  constructor(products) {
    this.products = products;
    this.filters = {};
    this.renderWrapper();
  }

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

    render(productsList) {
       //дальше определим внутренний грид и положим туда карточки из объекта с продуктами
       let gridInner = this.elem.querySelector('.products-grid__inner');
       gridInner.innerHTML= "";
       //для каждого элемента будем отрисовывать карточку через класс ProductCard и класть внутрь
       for (let product of productsList) {
         this.card = new ProductCard(product);
         gridInner.append(this.card.elem);
       }


     }

    updateFilter(filters) {
      Object.assign(this.filters, filters);
      const filteredProducts = this.products.filter(product => this.isFiltered(product))
      // if (filteredProducts.length == 0) {Object.assign(filteredProducts, this.products);}
      console.log("filteredProducts", filteredProducts)
      this.render(filteredProducts);
    }

    
    // isFiltered(product) {
    //     if ((this.filters.noNuts && (!product.nuts))
    //       ||(this.filters.vegeterianOnly && (product.vegeterian))
    //       ||(this.filters.maxSpiciness >= product.spiciness)
    //       ||(this.filters.category === product.category)
    //     ) { console.log(1);
    //       return true} 
    //     else {return false}
    // }

    isFiltered(product) {
        if ((this.filters.noNuts ? !product.nuts : true)
          &&(this.filters.vegeterianOnly ? product.vegeterian : true)
          &&(this.filters.maxSpiciness >= 0 && this.filters.maxSpiciness <= 4 ? product.spiciness <= this.filters.maxSpiciness : true)
          &&(this.filters.category ? this.filters.category === product.category : true)
        ) { console.log(1);
          return true} 
        else {return false}
    }

  }