'use strict'

const readDB = () => JSON.parse(localStorage.getItem('db')) ?? []

const setDB = (db) => localStorage.setItem('db', JSON.stringify(db))

const date = new Date();
const dateTime = {
    'day'    : date.getDate(),
    'mounth'  : date.getMonth() + 1,
    'year'   : date.getFullYear(),
    'hours'  : date.getHours(),
    'minutes': date.getMinutes()
}

const getDateNow = () => {
    const dateNow = dateTime['mounth'] > 9 ?
        dateTime['day'] + '/' + dateTime['mounth'] + '/' + dateTime['year']
        :
        dateTime['day'] + '/0' + dateTime['mounth'] + '/' + dateTime['year'];

    return dateNow;
}

const getHoursNow = () =>{
    const timeNow = dateTime['hours'] + ':' + dateTime['minutes'];

    return timeNow;
}

const insertDB = (client) => {
    const db = readDB()
    db.push(client)
    setDB(db)
}


const clearTable = () => {
    const recordCar = document.querySelector('#tableCars tbody');
    while (recordCar.firstChild) {
        recordCar.removeChild(recordCar.lastChild);
    }
}

const createRow = (client, index) => {
    const tabelaCarros = document.querySelector('#tabelaCarros tbody')
    const newTr = document.createElement('tr')
    newTr.innerHTML = `
        <td>${client.nome}</td>
        <td>${client.placa}</td>
        <td>${getDateNow()}</td>
        <td>${getHoursNow()}</td>
        <td id="botao">
            <button id="button-receipt" class="button green" type="button" onclick="javascript:window.location.href='./comprovanteEntrada.html'">Comp.</button>
            <button id="button-edit" class="button blue" type="button">Editar</button>
            <button id="button-exit" class="button red" type="button" onclick="javascript:window.location.href='./comprovanteSaida.html'">Saída</button>
        </td>
    `
    tabelaCarros.appendChild(newTr)
} 

const updateTable = () =>{
    clearTable()
    const db = readDB();
    db.forEach(createRow)
}

const salvar = () =>{
    const nweCar = {
        nome  : document.querySelector('#nome').value,
        placa : document.querySelector('#placa').value
    }
    insertDB(nweCar);
    clearInputs();
    updateTable();
}

const clearInputs = () =>{
    const inputs = Array.from(document.querySelectorAll('input'));
    inputs.forEach(input => input.value = "");
}


document.querySelector('#salvar')
    .addEventListener('click', salvar)
    

const printRecipt = () =>{
    window.print();
}
    
updateTable()