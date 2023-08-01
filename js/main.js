let registerBtn = document.querySelector("#registerBtn");
let loginBtn = document.querySelector("#logInBtn");

let logInmodal = document.getElementById("loginModal");
let registerModal = document.getElementById("registerModal");
let registerInModalBtn = document.querySelector("#registerInModalBtn");
let LogInModalBtn = document.querySelector("#LogInModalBtn");

let openProductModalBtn = document.querySelector("#open_Product_Modal_Btn");
let addProductModal = document.querySelector("#addProductModal");

let addProductModalBtn = document.querySelector("#addProductModalBtn");
let profilModal = document.querySelector(".profilModal");
// let ProductModal = document.querySelector("#ProductModal");
let content = document.querySelector(".content");
let logOut = document.querySelector("#logOut");
let profil = document.querySelector("#profil");
let openSearchModal = document.querySelector("#open_search_modal");
//inputs
let productTitleInp = document.querySelector("#productTitle");
let productUrl = document.querySelector("#productUrl");
let productPrice = document.querySelector("#productPrice");
let productDesk = document.querySelector("#productDesk");

let registerAvatar = document.querySelector("#register-avatar");
let registerUsername = document.querySelector("#register-username");
let registerPassword = document.querySelector("#register-password");
let registerPassConfirm = document.querySelector("#register-pass_confirm");

let loginUserNameInput = document.querySelector("#loginUserNameInput");
let loginPasswordInput = document.querySelector("#loginPasswordInput");

let user_api = "http://localhost:8000/user";
let closeBtn = document.getElementsByClassName("close")[0];

loginBtn.addEventListener("click", () => {
    logInmodal.style.display = "block";
});

closeBtn.addEventListener("click", () => {
    logInmodal.style.display = "none";
});

window.addEventListener("click", (event) => {
    if (event.target == logInmodal) {
        logInmodal.style.display = "none";
    }
});

registerBtn.addEventListener("click", () => {
    registerModal.style.display = "block";
});
closeBtn.addEventListener("click", () => {
    registerModal.style.display = "none";
});

window.addEventListener("click", (event) => {
    if (event.target == registerModal) {
        registerModal.style.display = "none";
    }
});
openProductModalBtn.addEventListener("click", () => {
    addProductModal.style.display = "block";
});
closeBtn.addEventListener("click", () => {
    addProductModal.style.display = "none";
});

window.addEventListener("click", (event) => {
    if (event.target == addProductModal) {
        addProductModal.style.display = "none";
    }
});
//register logic
async function checkUserOnLine(userName) {
    let res = await fetch(user_api);
    let data = await res.json();
    return data.some((item) => item.name == userName);
}
async function register() {
    if (
        !registerAvatar.value ||
        !registerUsername.value ||
        !registerPassword.value ||
        !registerPassConfirm.value
    ) {
        alert("some inputs are empty");
        return;
    }

    let checkUser = await checkUserOnLine(registerUsername);
    console.log(checkUser);
    if (checkUser) {
        alert("there is no people onLine");
        return;
    }
    if (registerPassword.value != registerPassConfirm.value) {
        alert("password don't match");
        return;
    }
    let userObj = {
        avatar: registerAvatar.value,
        name: registerUsername.value,
        password: registerPassword.value,
    };
    fetch(user_api, {
        method: "POST",
        body: JSON.stringify(userObj),
        headers: { "Content-Type": "application/json;charset=utf-8" },
    });
}
registerInModalBtn.addEventListener("click", register);
//log in logic

async function checkUserObj(UserPass) {
    try {
        let res = await fetch(user_api);
        let data = await res.json();
        let matchedUser = data.find((element) => element.name === UserPass);

        if (matchedUser) {
            return matchedUser;
        } else {
            throw new Error("User not found");
        }
    } catch (error) {
        console.error("Erro fetching data:", error);
        return null;
    }
}

async function logInFunc() {
    if (!loginUserNameInput.value || !loginPasswordInput.value) {
        alert("some inputs are empty");
        return;
    }
    let userObj = await checkUserObj(loginUserNameInput.value);

    // let checkingUserToLogIn = await checkTodbLogIn(inputslogInUserName.value);

    if (!userObj) {
        alert("there is no people online");
        return;
    }

    if (userObj.password != loginPasswordInput.value) {
        alert("password wrong");
        return;
    }

    let LogInuserObj = {
        name: loginUserNameInput.value,
        password: loginPasswordInput.value,
        isAdmin: true,
    };

    localStorage.setItem("user", JSON.stringify(LogInuserObj));
    loginUserNameInput.value = "";
    loginPasswordInput.value = "";
}
LogInModalBtn.addEventListener("click", logInFunc);

//logOut
function checkPeopleOnLine() {
    let user = localStorage.getItem("user");
    if (!user) {
        logOut.style.display = "none";
        profil.style.display = "none";
        return;
    }
    logOut.style.display = "block";
    profil.style.display = "block";
    return;
}

logOut.addEventListener("click", () => {
    localStorage.removeItem("user");
    return;
});
checkPeopleOnLine();
//profil show
async function showProfil() {
    let user = localStorage.getItem("user");
    let userInfo = JSON.parse(user);
    let userObj = await checkUserObj(userInfo.name);

    profilModal.innerHTML = `
    <div id="profil_modal_win" class="modal">
    <div class="modal-content">
        <span class="close">&times;</span>

        <div class="addProduct-container">
            <div class="modal-form">
                <h2>profil</h2>
                <div style="display:flex;">
                <img src="${userObj.avatar}" alt="" width="200px">
                <h2>name:${userObj.name}</h2>
                </div>
            </div>
        </div>
    </div>
</div>
    `;
    let profilInfoShow = document.querySelector("#profil_modal_win");
    profilInfoShow.style.display = "block";

    closeBtn.addEventListener("click", () => {
        profilInfoShow.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target == profilInfoShow) {
            profilInfoShow.style.display = "none";
        }
    });
}
profil.addEventListener("click", showProfil);
//add product func
let product_api = "http://localhost:8000/products";
let search = "";
let currentPage = 1;
async function render() {
    let reguestApi = `${product_api}?_page=${currentPage}&q=${search}&_limit=2`;

    let res = await fetch(reguestApi);
    let data = await res.json();
    content.innerHTML = "";
    data.forEach((products) => {
        content.innerHTML += `
        <div class="container" style ="width: 300px;
        height: 500px;
        margin: 50px;">
                     <img
                    src="${products.url}"
                        alt="erro:("
                            width="100%" />
                        <h3 class="title">${products.title}</h3>
                        <p class="desk">${products.desk}
                        </p>
                        <div class="block_end">
                            <h3 class="price">${products.Price}$</h3>
                            <button class="orderBtn">
                                <a href="#" type="button" class = "productInfoBtn" id ="info-${products.id}">info</a>
                            </button>
                        </div>
                    </div>
        `;
    });
}

render();

async function deleteFunc(e) {
    let productId = e.target.id.split("-")[1];

    await fetch(`${product_api}/${productId}`, { method: "DELETE" });
}
let productModal = document.querySelector(".productModal");

let changeModal = document.querySelector(".changeModal");
async function editFunc(e) {
    let productId = e.target.id.split("-")[1];
    let res = await fetch(`${product_api}/${productId}`);
    let data = await res.json();

    changeModal.innerHTML = `
    <div id="ProductModal" class="modal" style="display:block">
        <div class="product-modal-content">
            <span class="close">&times;</span>
                <div class="addProduct-container">
                    <div class="modal-form">
                    <input type="url" placeholder="image url" id="changeModalUrl">
                    <input type="text" placeholder="title" id="changeModalTitle">
                    <input type="text" placeholder="desk" id="changeModalDesk">
                    <input type="number" placeholder="price" id="changeModalPrice"> 

                        <button type="button" class ="saveChangeBtn">Save</button>
                                          
                        </div>
                    </div>
            </div>
     </div>
    `;
    let changeModalUrl = document.querySelector("#changeModalUrl");
    let changeModalTitle = document.querySelector("#changeModalTitle");
    let changeModalDesk = document.querySelector("#changeModalDesk");
    let changeModalPrice = document.querySelector("#changeModalPrice");
    let saveChangeBtn = document.querySelector(".saveChangeBtn");
    changeModalUrl.value = data.url;
    changeModalTitle.value = data.title;
    changeModalDesk.value = data.desk;
    changeModalPrice.value = data.Price;

    async function saveChange() {
        let updatedProductObj = {
            title: changeModalTitle.value,
            url: changeModalUrl.value,
            Price: changeModalPrice.value,
            desk: changeModalDesk.value,
        };
        await fetch(`${product_api}/${productId}`, {
            method: "PUT",
            body: JSON.stringify(updatedProductObj),
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
        });

        render();
    }
    saveChangeBtn.addEventListener("click", saveChange);
}
async function infoRender(e) {
    let productID = e.target.id.split("-")[1];
    let res = await fetch(`${product_api}/${productID}`);
    let data = await res.json();
    productModal.innerHTML = `
    <div id="ProductModal" class="modal">
                <div class="product-modal-content">
                    <span class="close">&times;</span>
                    <div class="addProduct-container">
                        <div class="modal-form">
                            <h2>info</h2>
                            <div class="Product_info-main_block">
                                <div class="left_block">
                                    <img
                                        src="${data.url}"
                                        alt=""
                                        width="200px" />
                                </div>
                                <div class="right_block">
                                    <h2 class="title">${data.title}</h2>
                                    <p class="desk">
                                        ${data.desk}
                                    </p>
                                    <p class="desk">
                                        ${data.Price}
                                    </p>
                                    <button type="submit" id="ProductModalBtn">
                                        order now
                                    </button>
                                    ${
                                        checkIsAdmin()
                                            ? `
                                            <div class ="mt-5" style ="display:flex;">
                                            <button type="submit"class="delete_btn" id="delete-${data.id}">
                                                    delete
                                                </button>
                                            <button type="submit"class="ml-2 edit_btn" id="edit-${data.id}">
                                                edit
                                            </button>
                                            </div>`
                                            : ""
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    `;
    let productContainerModal = document.querySelector("#ProductModal");
    productContainerModal.style.display = "block";

    closeBtn.addEventListener("click", () => {
        productContainerModal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target == productContainerModal) {
            productContainerModal.style.display = "none";
        }
    });
    let deleteBtn = document.querySelector(".delete_btn");
    deleteBtn.addEventListener("click", deleteFunc);

    let editBtn = document.querySelector(".edit_btn");
    editBtn.addEventListener("click", editFunc);

    editBtn.addEventListener("click", () => {
        productContainerModal.style.display = "none";
    });
}
content.addEventListener("click", (event) => {
    if (event.target.matches(".productInfoBtn")) {
        infoRender(event);
    }
});

let PreviousPageBtn = document.querySelector("#prev_btn");
let NextPageBtn = document.querySelector("#next_Btn");
console.log(PreviousPageBtn);
async function getPageCount() {
    let res = await fetch(product_api);
    let products = await res.json();
    let pagesCount = Math.ceil(products.length / 2); //округление в большую сторону ceil
    return pagesCount;
}
async function checkPages() {
    let maxPagesNum = await getPageCount();
    if (currentPage === 1) {
        PreviousPageBtn.setAttribute("style", "display:none;");
        NextPageBtn.setAttribute("style", "display:block;");
    } else if (currentPage === maxPagesNum) {
        PreviousPageBtn.setAttribute("style", "display:block;");
        NextPageBtn.setAttribute("style", "display:none;");
    } else {
        PreviousPageBtn.setAttribute("style", "display:block;");
        NextPageBtn.setAttribute("style", "display:block;");
    }
}
checkPages();

PreviousPageBtn.addEventListener("click", () => {
    currentPage--;
    checkPages();
    render();
});
NextPageBtn.addEventListener("click", () => {
    currentPage++;
    checkPages();
    render();
});

async function addProductFunc() {
    if (
        !productTitleInp.value ||
        !productUrl.value ||
        !productPrice.value ||
        !productDesk.value
    ) {
        alert("some input are empty");
        return;
    }
    let productObj = {
        title: productTitleInp.value,
        url: productUrl.value,
        Price: productPrice.value,
        desk: productDesk.value,
    };
    await fetch(product_api, {
        method: "POST",
        body: JSON.stringify(productObj),
        headers: { "Content-Type": "application/json;charset=utf-8" },
    });
    // render();
}
addProductModalBtn.addEventListener("click", addProductFunc);

function checkIsAdmin() {
    let user = JSON.parse(localStorage.getItem("user"));
    if (user) return user.isAdmin;
    return false;
    // openProductModalBtn.style.display = "block";

    // openProductModalBtn.style.display = "none";
}
checkIsAdmin();
function showAddProduct() {
    if (checkIsAdmin()) {
        openProductModalBtn.style.display = "block";
    }
    openProductModalBtn.style.display = "none";
}
//search func
let searchModal = document.querySelector(".searchModal");
function searchFunc() {
    searchModal.innerHTML = `

    <div id="ProductModal" class="modal" style="display:block">
         <div class="product-modal-content">
            <span class="close">&times;</span>
                <div class="addProduct-container">
                    <div class="modal-form">
                    <input type="usr" placeholder="image url" id="searchInp">
                    

                        <button type="button" class ="searchBtn">Save</button>

                        </div>
                    </div>
            </div>
    </div>
    `;
    let searchInp = document.querySelector("#searchInp");
    let searchBtn = document.querySelector(".searchBtn");
    let ProductModal = document.querySelector("#ProductModal");

    searchBtn.addEventListener("click", () => {
        ProductModal.style.display = "none";
        search = searchInp.value;
        console.log(search);
        render();
    });
}
openSearchModal.addEventListener("click", searchFunc);
