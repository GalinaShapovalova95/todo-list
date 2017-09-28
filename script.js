/**
 * Created by Galina Shapovalova on 14.08.17.
 */
'use strict';


var list = [
  {id: 0, text: 'Купить хлеб', checked: false},
  {id: 1, text: 'Помыть посуду', checked: false},
  {id: 2, text: 'Проверить почту', checked: false},
];

var mode = 'all';

var page = 1;

function print(showLast) {       //Print lists
  $('#list').html("");
  var filteredList = list.filter(function (item) {   // list[item] - element list
    if (mode == 'all') {
      $('#all').addClass('active-mode');
      $('#done').removeClass('active-mode');
      $('#undone').removeClass('active-mode');
      return item
    }
    if (mode == 'done') {
      $('#done').addClass('active-mode');
      $('#all').removeClass('active-mode');
      $('#undone').removeClass('active-mode');
      return item.checked == true
    }
    if (mode == 'undone') {
      $('#undone').addClass('active-mode');
      $('#all').removeClass('active-mode');
      $('#done').removeClass('active-mode');
      return item.checked == false
    }
  });

  var amountTasks = filteredList.length;
  var amountPages = Math.ceil(amountTasks / 5);

  if (showLast) page = amountPages;

  var stringTask = '';
  if (amountPages < page) {
    page = amountPages
  }

  for (var i = page * 5 - 5; i < page * 5; i++) {// рисуем задачи

    if (filteredList[i] === undefined) continue;

    else if (filteredList[i].text.trim() !== '') {
      stringTask += `<li id="item${filteredList[i].id}" class="list__item ${filteredList[i].checked ? ' checked ' : ''}">
                        <input type="checkbox" id="checkbox${filteredList[i].id}" class="checkbox"/>
                        <input type="text" readonly id="text${filteredList[i].id}" value="${filteredList[i].text}" class="text"/>
                       <button id="del${filteredList[i].id}" class="del">X</button></li>`;

    }
  }
  $('#list').append(stringTask);

  $('#pages').empty();
  for (var i = 0; i < amountPages; i++) {                          // рисуем страницы
    $('#pages').append(`<li id="pages${i}" class="page-item">
                         <a id="${i}" class="page-link">${i + 1}</a></li>`);
  }

  $(`.page-item:nth-child(${page})`).addClass('active');

  processEvents();
}


function addNewTask() {   // Create a new list item
  var input = $('#task');
  var newTask = input.val();

  var newTaskNull = +newTask;

  if (!newTask) return;

  var lastElementId = (list.length == 0) ? 0 : list[list.length - 1].id + 1;
  if (newTaskNull !== 0) {
    list.push({id: lastElementId, text: newTask, checked: false});
  }
  print(true);
  changePage();
  input.val('');
  count();
}


function processEvents() {         //Processing all events
  $('.del').click(function (event) {                       //list.id
    for (var i = 0; i < list.length; i++) {
      if ('del' + list[i].id === event.target.id && list[i].checked === false) {
        list.splice(i, 1);
      } else if ('del' + list[i].id === event.target.id && list[i].checked === true) {
        list.splice(i, 1);
      }
    }
    changePage();
    count();
  });


  $('.checkbox').click(function (event) {          //list.checked

    for (var i = 0; i < list.length; i++) {
      if ('checkbox' + list[i].id !== event.target.id) {
        continue;
      } else if (list[i].checked == false) {
        list[i].checked = true;
      } else {
        list[i].checked = false;
      }

    }
    changePage();
    count();
  });

  $('.text').dblclick(function (event) {               //edit
    for (var i = 0; i < list.length; i++) {
      if ('text' + list[i].id === event.target.id) {
        $(`#${event.target.id}`).removeAttr('readonly');
      }

    }
  });

  $('.text').blur(function (event) {                //blur
    for (var i = list.length - 1; i >= 0; i--) {

      var value = $(`#${event.target.id}`).val();

      if ('text' + list[i].id === event.target.id && value.trim() !== '') {
        // изменить массив
        list[i].text = $(`#${event.target.id}`).val().trim();
      }
      else if ('text' + list[i].id === event.target.id && value.trim() === '') {
        list.splice(i, 1);
      }
    }
    changePage();
    count();
  });

  $('.page-link').click(changePage);
}


function deleteAllChecked() {
  for (var i = list.length - 1; i >= 0; i--) {
    if (list[i].checked) {
      list.splice(i, 1);
    }
  }
  changePage();
  count();
}

function checkAll() {
  for (var i = 0; i < list.length; i++) {
    if ($('#checkbox').prop('checked')) {
      list[i].checked = true;
    } else {
      list[i].checked = false;
    }
  }
  print(true);
  count();
  changePage();
}


function count() {
  $('#done-count').empty();
  $('#not-done-count').empty();
  var listDone = list.filter(function (i) {
    return i.checked === true;
  }).length;
  var listNotDone = list.length - listDone;
  $('#done-count').append('Done: ' + listDone);
  $('#not-done-count').append('Not Done: ' + listNotDone);
}

function changeMode(e) {
  mode = e.target.id;
  print(true);
  changePage();
}

function changePage(e) {
  if (e) {
    page = parseInt(e.target.id) + 1;
  }
  print();
}


$(document).ready(function () {

  print();

  $('#add').click(addNewTask);

  $('#del-all').click(deleteAllChecked);

  $('#checkbox').click(checkAll);

  $('#all').click(changeMode);
  $('#done').click(changeMode);
  $('#undone').click(changeMode);

  $('#task').keydown(function (event) {                // Add on Enter
    if (event.keyCode == 13) {
      event.preventDefault();      // отмена действий по умолчанию
      addNewTask();
    }
  });

  $('.page-link').click(changePage);

  count();
});