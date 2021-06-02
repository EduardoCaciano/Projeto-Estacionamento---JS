'use strict'

const openModalPrices = () => document.querySelector('#modal-Prices')
    .classList.add('active');
const closeModalPrices = () => document.querySelector('#modal-Prices')
    .classList.remove('active');

const openModalReceipt = () => document.querySelector('#modal-receipt').classList.add('active');
const closeModalReceipt = () => document.querySelector('#modal-receipt').classList.remove('active');

const openModalEdit = () => document.querySelector('#modal-edit').classList.add('active');
const closeModalEdit = () => document.querySelector('#modal-edit').classList.remove('active');

const openModalExit = () => document.querySelector('#modal-exit').classList.add('active');
const closeModalExit = () => document.querySelector('#modal-exit').classList.remove('active');

const date = new Date();
const dateTime = {
    'day': date.getDate(),
    'mounth': date.getMonth() + 1,
    'year': date.getFullYear(),
    'hours': date.getHours(),
    'minutes': date.getMinutes()
}

const readDBPrice = () => JSON.parse(localStorage.getItem('price')) ?? [];
const setDBPrice = (dbPrice) => localStorage.setItem('price', JSON.stringify(dbPrice));

const readDB = () => JSON.parse(localStorage.getItem('db')) ?? []

const setDB = (db) => localStorage.setItem('db', JSON.stringify(db))

const insertDB = (cliente) => {
    const db = readDB()
    db.push(cliente)
    setDB(db)
}

const insertIntoDBPrices = (price) => {
    const dbPrice = readDBPrice()
    dbPrice.push(price)
    setDBPrice(dbPrice)
}

const getDateNow = () => {
    const dateNow = dateTime['mounth'] > 9 ?
        dateTime['day'] + '/' + dateTime['mounth'] + '/' + dateTime['year']
        :
        dateTime['day'] + '/0' + dateTime['mounth'] + '/' + dateTime['year'];

    return dateNow;
}

const getHoursNow = () => {
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
            <button data-index="${index}" id="button-receipt" class="button green" type="button">Comp.</button>
            <button data-index="${index}" id="button-edit" class="button blue" type="button">Editar</button>
            <button data-index="${index}" id="button-exit" class="button red" type="button">Saída</button>
        </td>
    `;
    tableCars.appendChild(novoTr);
}

const updateTable = () => {
    clearTable()
    const db = readDB();
    db.forEach(criaCliente)
}

const clearInputs = () => {
    const inputs = Array.from(document.querySelectorAll('input'));
    inputs.forEach(input => input.value = "");
}

const adicionar = () => {
    const adicionarCliente = {
        nome: document.querySelector('#nome').value,
        placa: document.querySelector('#placa').value,
        data: getDateNow(),
        hora: getHoursNow()
    }
    insertDB(adicionarCliente);
    updateTable();
}

const isValidFormPrice = () => document.querySelector('#form-price').reportValidity();

const savePrice = () => {
    if (isValidFormPrice()) {
        const newPrice = {
            primeiraHora: document.querySelector('#primeira-hora').value,
            demaisHoras: document.querySelector('#demais-horas').value
        }
        insertIntoDBPrices(newPrice);
        clearInputs();
        closeModalPrices();
    }
}

const setReceipt = (index) => {
    const db = readDB();
    const input = Array.from(document.querySelectorAll('#form-receipt input'));
    input[0].value = db[index].nome;
    input[1].value = db[index].placa;
    input[2].value = db[index].data;
    input[3].value = db[index].hora;
}

const calcExit = (index) => {
    const db = readDB();
    const dbPrices = readDBPrice();
    const lastIndex = dbPrices.length - 1;

    const valueOfFirsteHours = dbPrices[lastIndex]["primeiraHora"];
    const valueOfMoreHours = dbPrices[lastIndex]["demaisHoras"];

    const entryTime = db[index].hora.substr(0, 2);
    let exitTime = getHoursNow().substr(0, 2);
    let valueOfBePay = 0

    if (exitTime == '0:') {
        exitTime = 24;
        let totalHoursParked = parseInt(entryTime) - parseInt(exitTime);
        if (totalHoursParked < 0) {
            totalHoursParked *= -1;
        }
        if (totalHoursParked > 1) {
            const moreHours = totalHoursParked - 1;
            const valueOfBePayMoreHours = moreHours * valueOfMoreHours;
            const valueOfBePay = parseInt(valueOfBePayMoreHours) + parseInt(valueOfFirsteHours);
            console.log(valueOfBePay);
        } else {
            valueOfBePay = valueOfFirsteHours;
        }

    } else {
        let totalHoursParked = parseInt(entryTime) - parseInt(exitTime);
        if (totalHoursParked < 0) {
            totalHoursParked *= -1;
        }
        if (totalHoursParked > 1) {
            const moreHours = totalHoursParked - 1;
            const valueOfBePayMoreHours = moreHours * valueOfMoreHours;
            valueOfBePay = parseInt(valueOfBePayMoreHours) + parseInt(valueOfFirsteHours);
        } else {
            valueOfBePay = valueOfFirsteHours;
        }
    }
    return valueOfBePay;
}

const isValidFormEdit = () => document.querySelector('#form-edit').reportValidity();

const saveCarEdited = () => {
    if (isValidFormEdit()) {
        const newCar = {
            nome: document.querySelector('#nome-edited').value,
            placa: document.querySelector('#placa-edited').value,
            data: document.querySelector('#data').value,
            hora: document.querySelector('#hora').value
        }
        insertDB(newCar);
        clearInputs();
        closeModalEdit();
        updateTable();
    }
}

const editCar = (index) => {

    const db = readDB();
    document.querySelector('#nome-edited').value = db[index].nome;
    document.querySelector('#placa-edited').value = db[index].placa;
    document.querySelector('#data').value = db[index].data;
    document.querySelector('#hora').value = db[index].hora;
    deleteCar(index);
}

const deleteCar = (index) => {
    const db = readDB()
    const resp = confirm(`Ao confirmar os dado de ${db[index].nome} serão apagados`);

    if (resp) {
        db.splice(index, 1)
        setDB(db);
        updateTable();
    }
}

const setExit = (index) => {
    const db = readDB();
    const input = Array.from(document.querySelectorAll('#form-exit input'));
    input[0].value = db[index].nome;
    input[1].value = db[index].placa;
    input[2].value = db[index].hora;
    input[3].value = getHoursNow();
    input[4].value = calcExit(index);
    deleteCar(index);
}

const getButtons = (event) => {
    const button = event.target;
    if (button.id == "button-receipt") {
        const index = button.dataset.index;
        openModalReceipt();
        setReceipt(index);
    }  else if (button.id == "button-exit") {
         const index = button.dataset.index;
         openModalExit();
         setExit(index);
         }  else if (button.id == "button-edit") {
            const index = button.dataset.index;
            openModalEdit();
            editCar(index);
        }

}

document.querySelector('#adicionar')
    .addEventListener('click', adicionar)

document.querySelector('#precos').addEventListener('click', () => { openModalPrices(); clearInputs() });
document.querySelector('#close-prices').addEventListener('click', () => { closeModalPrices(); clearInputs() });
document.querySelector('#cancelar-prices').addEventListener('click', () => { closeModalPrices(); clearInputs() });
document.querySelector('#salvarPreco').addEventListener('click', savePrice);

document.querySelector('#close-receipt').addEventListener('click', () => { closeModalReceipt(); clearInputs() });
document.querySelector('#cancelar-receipt').addEventListener('click', () => { closeModalReceipt(); clearInputs() });

document.querySelector('#tableCars').addEventListener('click', getButtons);

document.querySelector('#close-exit').addEventListener('click', () => { closeModalExit(); clearInputs() });
document.querySelector('#cancelar-exit').addEventListener('click', () => { closeModalExit(); clearInputs() });

document.querySelector('#editar').addEventListener('click', saveCarEdited);

updateTable()