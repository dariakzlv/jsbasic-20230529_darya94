export default class StepSlider {
  constructor({ steps, value = 0 }) {
    this.steps = steps;
    this.render();
  }

  render() {
    //заберем себе разметку слайдера
    this.elem = document.createElement('DIV');
    this.elem.classList.add('slider');
    this.elem.innerHTML = `
    <!--Ползунок слайдера с активным значением-->
    <div class="slider__thumb" style="left: 0%;">
      <span class="slider__value">0</span>
    </div>

    <!--Заполненная часть слайдера-->
    <div class="slider__progress" style="width: 0%;"></div>

    <!--Шаги слайдера-->
    <div class="slider__steps">
    </div>
    `
    //нам надо положить столько спанов, сколько шагов передали
    //выберем элемент, в котором будут лежать шаги
    this.stepsContainer = this.elem.querySelector('.slider__steps');
    //дальше будем его наполнять, пройдемся столько раз, сколько у нас шагов
    for( let i = 0; i < this.steps; i++) {
      //создаем спан
      let span = document.createElement('span');
      //вставляем спан
      this.stepsContainer.append(span);
    }
    this.stepsContainer.querySelector('span').classList.add('slider__step-active');

    //пропишем событие по клику на слайдер
    this.elem.addEventListener('click', (event) => {
      //вычислим ближайшее целое число, к которому кликнули
      //для этого вычтем из точки клика clientX координату левого конца слайдера и получим координату клика
      let left = event.clientX - this.elem.getBoundingClientRect().left;
      //посчитаем относительную ширину до места клика
      let leftRelative = left / this.elem.offsetWidth;
      //и умножим на количество сегментов, получим координату нашего клика уже в наших значениях
      let fractionalValue = leftRelative * (this.steps - 1);
      //по математическим правилам округлим и получим ближайшее целое
      let value = Math.round(fractionalValue);
      //чтобы понять, сколько закрашивать в процентах, возьмем относит ширину и умножим на 100
      let valuePercents = value/(this.steps-1)*100;

      //теперь запишем новое значение в slider value
      let sliderValue = this.elem.querySelector('.slider__value');
      sliderValue.innerHTML = `${value}`;
      
      //старый активный надо стереть, для этого будем записывать все активные, и если коллекция что-то содержит, то стираем
      let stepsActiveItems = this.stepsContainer.querySelectorAll('.slider__step-active');
      if(stepsActiveItems.length > 0) { this.elem.querySelector('.slider__step-active').classList.remove('slider__step-active') }
      //надо сделаем активный шаг, выделим все спаны
      let stepItems = this.stepsContainer.querySelectorAll('span');
      //теперь спану, номер которого в коллекции совпадает с валью, присвоим активный класс
      stepItems[value].classList.add('slider__step-active');

      //теперь надо переместить ползунок, найдем его и изменим левое положение в стилях
      let thumb = this.elem.querySelector('.slider__thumb');
      thumb.style.left = `${valuePercents}%`;
      //аналогично изменим ширину закраски
      let progress = this.elem.querySelector('.slider__progress');
      progress.style.width = `${valuePercents}%`;

      //теперь надо повесить пользовательское событие, чтобы весь код знал, какое число мы выбрали
      this.elem.dispatchEvent( new CustomEvent( "slider-change", { 
        detail: value, 
        bubbles: true } ) );
    })
    
  }
}
