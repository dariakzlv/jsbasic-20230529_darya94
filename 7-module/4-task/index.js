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
    this.thumb = this.elem.querySelector('.slider__thumb');
    this.thumb.ondragstart = () => false;
    //отследим, что происходит при клике мышки на ползунок
    this.thumb.addEventListener('pointerdown', (event) => {
      //передвигаем ползунок при событии на движения на документе
      document.addEventListener('pointermove', this.onPointerMove);
      //надо корневому элементу повесить класс
      this.elem.classList.add('slider_dragging');
      document.addEventListener('pointerup', () => {
        document.removeEventListener('pointermove', this.onPointerMove);
        this.thumb.onpointerup = null;
        this.elem.classList.remove('slider_dragging');
      })

      
      
    })
    
    }
    
    onPointerMove = (event) => {
      let left = event.clientX - this.elem.getBoundingClientRect().left;
      //дальше вычислим относительную ширину
      let leftRelative = left / this.elem.offsetWidth;
      //и умножим на количество сегментов, получим координату нашего клика уже в наших значениях
      let fractionalValue = leftRelative * (this.steps - 1);
      //по математическим правилам округлим и получим ближайшее целое
      let value = Math.round(fractionalValue);
      if (value < 0) value = 0;
      if (value > 4) value = 4;
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
      this.thumb.style.left = `${valuePercents}%`;
      //аналогично изменим ширину закраски
      let progress = this.elem.querySelector('.slider__progress');
      progress.style.width = `${valuePercents}%`;

      //теперь надо повесить пользовательское событие, чтобы весь код знал, какое число мы выбрали
      this.elem.dispatchEvent( new CustomEvent( "slider-change", { 
        detail: value, 
        bubbles: true } ) );
    } 
}
