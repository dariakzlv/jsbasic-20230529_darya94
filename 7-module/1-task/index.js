import createElement from '../../assets/lib/create-element.js';

export default class RibbonMenu {

  constructor(categories) {
    this.categories = categories;
    this.render();
  }

  render(){
    //сначала надо создать корневой элемент
    this.elem = document.createElement('DIV');
    //дальше навешиваем ему класс
    this.elem.classList.add('ribbon');
    //создаем всю разметку, но внутри nav ничего не описываем, потому что будем это через объект записывать
    this.elem.innerHTML = `
    <button class="ribbon__arrow ribbon__arrow_left ribbon__arrow_visible">
      <img src="/assets/images/icons/angle-icon.svg" alt="icon">
    </button>
    <nav class="ribbon__inner">
    </nav>
    <button class="ribbon__arrow ribbon__arrow_right ribbon__arrow_visible">
      <img src="/assets/images/icons/angle-icon.svg" alt="icon">
    </button>`
    //задаем то, что внутри nav, обращаемся по классу к nav
    let ribbonInner = this.elem.querySelector('.ribbon__inner');
    //теперь создаем саму разметку категорий, забираем из объекта
    ribbonInner.innerHTML = this.categories
      .map(({id, name}) => `
      <a href="#" class="ribbon__item" data-id="${id}">${name}</a>
      `)
      .join(' ');

    //сделаем первый пункт меню активным
    let currentRibbonItem = this.elem.querySelector('.ribbon__item');
    currentRibbonItem.classList.add('ribbon__item_active');

    //категории отрендерились, теперь надо сделать переключение стрелок
    //сначала определим стрелки
    let btnLeft = this.elem.querySelector('.ribbon__arrow_left');
    let btnRight = this.elem.querySelector('.ribbon__arrow_right');
    btnLeft.classList.remove('ribbon__arrow_visible');

    // вычислим, скролько пикселей осталось справа
    // let scrollWidth = ribbonInner.scrollWidth;
    // let scrollLeft = ribbonInner.scrollLeft;
    // let clientWidth = ribbonInner.clientWidth;
    // let scrollRight = scrollWidth - scrollLeft - clientWidth;
    // console.log(ribbonInner.scrollWidth)
    // console.log(scrollLeft)
    // console.log(clientWidth)

    //повесим событие на правую кнопку
    btnRight.addEventListener('click', () => {
      //листаем вправо, так что левую кнопку сразу включаем
      btnLeft.classList.add('ribbon__arrow_visible')
      //считаем, сколько места осталось справа
      let scrollWidth = ribbonInner.scrollWidth;
      let scrollLeft = ribbonInner.scrollLeft;
      let clientWidth = ribbonInner.clientWidth;
      let scrollRight = scrollWidth - scrollLeft - clientWidth;
      //если справа уже меньше или 350, то убираем правую кнопку, потому что кликать еще раз уже не надо
      if (scrollRight <= 350) {
        btnRight.classList.remove('ribbon__arrow_visible')
      } else btnRight.classList.add('ribbon__arrow_visible')
      //скроллим
      ribbonInner.scrollBy(350, 0);
    })
    
    //повесим событие на левую кнопку
    btnLeft.addEventListener('click', () => {
      //сразу подсвечиваем правую кнопку, потому что листаем влево
      btnRight.classList.add('ribbon__arrow_visible');

      if (ribbonInner.scrollLeft <= 350){
        btnLeft.classList.remove('ribbon__arrow_visible')
      } else btnLeft.classList.add('ribbon_arrow_visible')

      ribbonInner.scrollBy(-350, 0);
    }
    )
    
    //повесим классы на категорию, на которую кликнул человек
    //найдем все элементы
      let ribbonItems = this.elem.querySelectorAll('.ribbon__item');
      //для каждого по клику
      ribbonItems.forEach((ribbonItem) => {
        ribbonItem.addEventListener('click', (event) => {
          event.preventDefault();
          //найдем вообще все активные сейчас
          let  ribbonActive = this.elem.querySelectorAll('.ribbon__item_active');
          //если активных больше двух, то с первого удаляем активный класс
          if (ribbonActive.length) this.elem.querySelector('.ribbon__item_active').classList.remove('ribbon__item_active');
          //на тот, что кликнули, вешаем класс активный
          ribbonItem.classList.add('ribbon__item_active');
          //Теперь надо дать знать другим элементам, какой компонент у нас выбран, создадим пользовательское событие
          this.elem.dispatchEvent( new CustomEvent( "ribbon-select", { 
          detail: ribbonItem.dataset.id, 
          bubbles: true } ) );
          })
        })
    }
    
  }

