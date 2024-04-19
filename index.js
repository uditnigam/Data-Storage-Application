const detailsContainer = document.querySelector(".details-submitted");
const query = document.querySelector(".query");
const submitButton = document.querySelector(".submit");
const imageFile = document.getElementById("formFile");
const nameInput = document.getElementById("name");
const ageInput = document.getElementById("age");
const addressInput = document.getElementById("address");
const formControl = document.querySelectorAll(".form-control");

let edit = {
    isEdit: false,
    activeId: null
};

//Function calling to get and display all the data from the database in the UI.
setTimeout(function () {
    getCardInfoFromDatabase();
}, 200);

//Getting data from Database
function getCardInfoFromDatabase() {
    cardsInfo.forEach((data) => {
        displayCard(data.name, data.age, data.address, data.imageName, data.imageSrc, data.id);
    })
};

submitButton.addEventListener("click", (e) => {
    let name = nameInput.value;
    let age = ageInput.value;
    let address = addressInput.value;
    if (name == "" || age == "" || address == "" || (!edit.isEdit && imageFile.files.length === 0)) {
        alert('Please fill out all fields');
    } else if (edit.isEdit && imageFile.files.length === 0) {
        editInformation(name, age, address);
        edit.isEdit = false;
    } else {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(imageFile.files[0]);
        fileReader.addEventListener("load", function (e) {
            if (edit.isEdit) {
                editInformation(name, age, address, imageFile.files[0].name, e.target.result);
            } else {
                createInformationCard(name, age, address, imageFile.files[0].name, e.target.result);
            }
        })
    }
});

//To edit the information of the card
function editInformation(updatedName, updatedAge, updatedAddress, imageName, imageSrc) {
    const infoCard = document.querySelectorAll(".cards");
    infoCard.forEach((card) => {
        if (edit.activeId == card.getAttribute("id")) {
            card.children[2].children[0].innerText = " Name : " + updatedName;
            card.children[2].children[1].innerText = " Age : " + updatedAge;
            card.children[2].children[2].innerText = " Address : " + updatedAddress;
            if (imageName && imageSrc) {
                card.children[1].children[0].name = imageName;
                card.children[1].children[0].src = imageSrc;
            }
        }
    })
    updateData(edit.activeId, updatedName, updatedAge, updatedAddress, imageName, imageSrc);
    clearInputValues();
};


//Function to create a card
function createInformationCard(name, age, address, imageName, imageSrc) {
    const id = generateUID();
    const infoCard = displayCard(name, age, address, imageName, imageSrc, id);
    addData(id, name, age, address, imageName, imageSrc);
    clearInputValues();


    // let closeDiv = document.querySelector(".cross"); 
    // closeDiv.forEach((obj) =>{
    //     obj.addEventListener("click", (e)=>{
    //         console.log("click")
    //     })
    // })
    //  Error:- AEL pehle element pe baar baar lgega esliye ye nhi lgayenge
};

//Creating a Card on UI
function displayCard(name, age, address, imageName, imageSrc, id) {
    const infoCard = document.createElement("div");
    infoCard.setAttribute("class", "cards");
    infoCard.setAttribute("id", id);
    infoCard.classList.add("row");
    infoCard.innerHTML = `
            <div class="card-button">
                <i class="bi bi-pencil-fill edit-button"></i>
                <i class="bi bi-x-circle-fill cross"></i>
            </div>
            <div class="col-6 left-side">
                <img name="${imageName}" src="${imageSrc}" />
            </div>
            <div class="col-6 right-side">
                <div class="col-12 name">Name : ${name}</div>
                <div class="col-12 age">Age : ${age}</div>
                <div class="col-12 address">Address : ${address}</div>
            </div>
        `;
    query.appendChild(infoCard);
    infoCard.addEventListener("click", (e) => {
        if (e.target.classList.contains('cross')) {
            deleteCardFromCardContainer(e);
            infoCard.remove();
        }
        if (e.target.classList.contains("edit-button")) {
            edit.isEdit = true;
            edit.activeId = id;
            displayInformationOnInput(id, name, age, address, imageName, imageSrc);
        }
    })
    return infoCard;
};

//To generate random unique id
function generateUID() {
    // I generate the UID from two parts here 
    // to ensure the random number provide enough bits.
    var firstPart = (Math.random() * 46656) | 0;
    var secondPart = (Math.random() * 46656) | 0;
    firstPart = ("000" + firstPart.toString(36)).slice(-3);
    secondPart = ("000" + secondPart.toString(36)).slice(-3);
    return firstPart + secondPart;
};

//To display the info on input bar
function displayInformationOnInput(id, name, age, address, imageName, imageSrc) {
    nameInput.value = name;
    ageInput.value = age;
    addressInput.value = address;
};

//to clear the input values of the form after submission
function clearInputValues() {
    formControl.forEach((e) => {
        e.value = "";
    })
};