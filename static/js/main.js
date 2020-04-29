window.onload = () => {
  'use strict';

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('./sw.js');
  }
}

/**
 * Uniq id
 */
const uuid = () => {
  var dt = new Date().getTime();
  var _uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (dt + Math.random()*16)%16 | 0;
      dt = Math.floor(dt/16);
      return (c=='x' ? r :(r&0x3|0x8)).toString(8);
  });
  return _uuid;
}

class OfflineForm {
  instance = null;

  constructor(form) {
    this.instance = form;
    this.id = form.id;
    this.action = form.action;
    this.data = {};
    
    form.addEventListener('submit', e => this.handleSubmit(e));
  }

  /**
   * Retrieve form data
   */
  getFormData = () => {
    const data = {};
    const testInput = document.getElementById('test-input');

    if (testInput && testInput.value) {
      data.inputVal = testInput.value;
    }

    return data;
  }

  /**
   * Reset form field
   */
  resetFormField = () => {
    const input = document.getElementById('test-input');

    if (input && input.value)
      input.value = "";
  }

  handleSubmit(e) {
    e.preventDefault();

    // parse form inputs into data object.
    const formData = this.getFormData();
    this.resetFormField();
    
    if (!navigator.onLine) {
      // user is offline, store data on device.
      this.storeData(formData);
    } else {
      // user is online, send data via ajax.
      // this.sendData();
      this.storeData(formData); // for testing purpose save always in indexedDB
    }
  }

  /**
   * Save data into indexedDB.form1
   * @param {*} formData 
   */
  storeData(formData = {}) {
    if (!indexedDB)
      return false; // silently exit if indexedDB is not available.
    
    const formDB = indexedDB.open('FORM_DATA', 1);

    formDB.onsuccess = function(event) {
      const db = event.target.result;      
      const transaction = db.transaction('form1', 'readwrite');
      const form1ObjectStore = transaction.objectStore('form1');
      form1ObjectStore.add(formData, uuid());
    }

    return true;
  }
}

const form = document.getElementById('test-form');
new OfflineForm(form);
