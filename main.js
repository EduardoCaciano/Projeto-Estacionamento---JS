'use strict'

const date = new Date();
const dateTime = {
    'day'    : date.getDate(),
    'mounth'  : date.getMonth() + 1,
    'year'   : date.getFullYear(),
    'hours'  : date.getHours(),
    'minutes': date.getMinutes()
}

const readDB = () => JSON.parse(localStorage.getItem('db')) ?? []

const setDB = (db) => localStorage.setItem('db', JSON.stringify(db))

const insertDB = (cliente) => {
    const db = readDB()
    db.push(cliente)
    setDB(db)
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

const clearTable = () => {
    const recordClient = document.querySelector('#tableCars tbody');
    while (recordClient.firstChild) {
        recordClient.removeChild(recordClient.lastChild)
    }
}

const criaCliente = (cliente, index) => {
    const tableCars = document.querySelector('#tableCars tbody');
    const novoTr = document.createElement('tr');
    novoTr.innerHTML = `
        <td>${cliente.nome}</td>
        <td>${cliente.placa}</td>
        <td>${cliente.data}</td>
        <td>${cliente.hora}</td>
        <td id="botao">
            <button data-index="${index}" id="button-receipt" class="button green" type="button" onclick="javascript:window.location.href='comprovanteEntrada.html'">Comp.</button>
            <button data-index="${index}" id="button-edit" class="button blue" type="button">Editar</button>
            <button data-index="${index}" id="button-exit" class="button red" type="button" onclick="javascript:window.location.href='comprovanteSaida.html'">Saída</button>
        </td>
    `;
    tableCars.appendChild(novoTr);
} 

const updateTable = () =>{
    clearTable()
    const db = readDB();
    db.forEach(criaCliente)
}

const adicionar = () =>{
    const adicionarCliente = {
        nome  : document.querySelector('#nome').value,
        placa : document.querySelector('#placa').value,
        data  : getDateNow(),
        hora  : getHoursNow()
    }
    insertDB(adicionarCliente);
    updateTable();
}

const openModal = () => document.querySelector('#modal')
    .classList.add('active')

const closeModal = () => document.querySelector('#modal')
    .classList.remove('active')

const editClient = (index) => {
    const db = readDB()
    document.querySelector('#nome').value = db[index].nome
    document.querySelector('#placa').value = db[index].placa
    openModal();
}

document.querySelector('#editar')
    .addEventListener('click', openModal)

document.querySelector('#adicionar')
            .addEventListener('click', adicionar)

updateTable()