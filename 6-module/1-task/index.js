/**
 * Компонент, который реализует таблицу
 * с возможностью удаления строк
 *
 * Пример одного элемента, описывающего строку таблицы
 *
 *      {
 *          name: 'Ilia',
 *          age: 25,
 *          salary: '1000',
 *          city: 'Petrozavodsk'
 *      }
 *
 */
export default class UserTable {
  constructor(rows) {
    this.rows = rows;
    this.render();
  }
  //создаем свой метод, который будет рендерить таблицу
  render() {
    this.elem = document.createElement('TABLE');
    this.elem.innerHTML = `<thead><tr><th>Имя</th><th>Возраст</th><th>Зарплата</th><th>Город</th><th></th></tr></thead><tbody></tbody>`;
    this.elem.innerHTML = this.rows
      .map(({name, age, salary, city}) => `<tr>
      <td>${name}</td>
      <td>${age}</td>
      <td>${salary}</td>
      <td>${city}</td>
      <td><button>X</button></td>
  </tr>`)
      .join ('');
    let btn = this.elem.querySelectorAll('button');
    btn.forEach((element) => element.addEventListener('click', (event) => {event.target.closest('TR').remove()} ))
  }
}
