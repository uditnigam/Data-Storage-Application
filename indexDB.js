let db;
let cardsInfo;

const request = indexedDB.open("form-data", 1);

request.onsuccess = function (event) {
    db = request.result;
    getAllCards();
}
request.onerror = function (event) {
}
request.onupgradeneeded = function (event) {
    db = request.result;

    db.createObjectStore("forms", { keyPath: "id" });
}

//Add the data to the database
function addData(id, name, age, address, imageName, imageSrc) {
    const transaction = db.transaction("forms", "readwrite");
    const forms = transaction.objectStore("forms");
    const data = {
        id: id,
        name: name,
        age: age,
        address: address,
        imageName: imageName,
        imageSrc: imageSrc
    }
    forms.add(data);
};

//Delete the form data from the database
function deleteCardFromCardContainer(event) {
    const deleteCard = db.transaction("forms", 'readwrite');
    const request = deleteCard.objectStore("forms").delete(event.target.parentNode.parentNode.id);
};

//Update the data in the database after edit the card
function updateData(key, updatedName, updatedAge, updatedAddress, imageName, imageSrc) {
    const objectStore = db.transaction("forms", "readwrite").objectStore("forms");
    const request = objectStore.get(key);
    request.onsuccess = () => {
        const cards = request.result;
        cards.name = updatedName;
        cards.age = updatedAge;
        cards.address = updatedAddress;
        if (imageName != null && imageSrc != null) {
            cards.imageName = imageName;
            cards.imageSrc = imageSrc
        };
        objectStore.put(cards).then;
    }
};

//Get all of the cards in the card container
function getAllCards() {
    const dbTransaction = db.transaction('forms', "readonly");
    const cardsStore = dbTransaction.objectStore('forms').getAll();
    cardsStore.onsuccess = () => {
        const cards = cardsStore.result;
        cardsInfo = cards;
        return cards;
    }
    cardsStore.onerror = (err) => {
        console.error(`Error to get all cards: ${err}`)
    }
};

