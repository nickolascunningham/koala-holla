console.log('js');

$(document).ready(function () {
  console.log('JQ');
  // Establish Click Listeners
  setupClickListeners()
  // load existing koalas on page load
  getKoalas();
  $('#viewKoalas').on('click', '.deleteButton', deleteKoala);
  $('#viewKoalas').on('click', '.transferButton', transferKoala);
}); // end doc ready



function setupClickListeners() {
  $('#addButton').on('click', function () {
    console.log('in addButton on click');
    // get user input and put in an object
    // NOT WORKING YET :(
    // using a test object
    let koalaToSend = {
      name: $('#nameIn').val(),
      age: $('#ageIn').val(),
      ready_for_transfer: $('#readyForTransferIn').val(),
      sex: $('#genderIn').val(),
      notes: $('#notesIn').val(),
    };
    //console.log( koalaToSend )
    // call saveKoala with the new obejct
    saveKoala(koalaToSend);
  });
}

function getKoalas() {
  console.log('in getKoalas');
  // ajax call to server to get koalas
  $.ajax({
    method: 'GET',
    url: '/koalas'
  }).then(function (response) {
    console.log('back from GET:', response);
    //empty output el 
    let el = $('#viewKoalas');
    el.empty();
    //append each koala to DOM 
    for (let i = 0; i < response.length; i++) {
      el.append(`<tr>
                      <td>${response[i].name}</td>
                      <td>${response[i].age}</td>
                      <td>${response[i].sex}</td>
                      <td>${response[i].ready_for_transfer}</td>
                      <td>${response[i].notes}</td>
                      <td><input type="button" class="transferButton" value="Transfer" data-id="${response[i].id}"></td>
                      <td><input type="button" class="deleteButton" value="Delete" data-id="${response[i].id}"></td> 
                    </tr>`)
    }
  })
} // end getKoalas

function saveKoala(newKoala) {
  console.log('in saveKoala', newKoala);
  if (newKoala.name ==''){
    alert ('Please fill out name of koala.');
    return;
  }//end if
  if (newKoala.age =='' ){
    alert ('Please fill out the age of koala.');
  }//end if
  if (newKoala.sex =='' ){
    alert ('Please fill out the age of koala.');
    return;
  }//end if
  

  $.ajax({
    method: "POST",
    url: '/koalas',
    data: newKoala
  }).then(function (response) {
    getKoalas()
  }).catch(function (err) {
    alert('could not add koala');
    console.log(err);
  })
  // ajax call to server to get koalas
}

function deleteKoala() {
  console.log('in deleteKoala!', $(this).data('id'));
  const koalaId = $(this).data('id');

  $.ajax({
    method: 'DELETE',
    url: `/koalas?id=` + koalaId
  }).then(function (response) {
    getKoalas();
  }).catch(function (err) {
    console.log(err);
    alert('error deleting message');
  })
}

function transferKoala() {
  console.log('in transferKoala!', $(this).data('id'));
  const koalaId = $(this).data('id');

  $.ajax({
    method: 'PUT',
    url: `/koalas?id=` + koalaId
  }).then(function (response) {
    getKoalas();
  }).catch(function (err) {
    console.log(err);
    alert('error transferring message');
  })
}