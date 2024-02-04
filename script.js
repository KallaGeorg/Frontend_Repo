let ol = document.createElement("ol");
let failMessageSearch = document.createElement("div");
let searchContainer = document.createElement("div");
searchContainer.id = "searchContainer";

let header1 = document.createElement("h3");
header1.id = "headerField";
header1.innerText = "Search dish by first letter";
searchContainer.appendChild(header1);


let searchLabel1 = document.createElement("label");
let searchField1 = document.createElement("input");

function keyBoardEnter(event){
  if(event.key === "Enter"){
      let mealName = searchField.value;
      printMeals(mealName);
      searchField.value = "";
  }
}


searchLabel1.setAttribute("for", "searchByFirstLetter");
searchLabel1.innerText = "Add a letter and hit enter: ";
searchField1.id = "searchByFirstLetter";
searchField1.type = "text";
searchField1.size = 1;

searchField1.addEventListener("keydown", function(event) {
  failMessageSearch.remove();
    if (event.key === "Enter") {
        let firstLetter = searchField1.value.trim().toLowerCase();
        if (firstLetter.length !== 1 || !/[a-zA-Z]/.test(firstLetter)) {
            alert("Please enter a single letter.");
            return;
        }
        searchField1.value ="";
        printMealsByLetter(firstLetter);
    }
});
searchContainer.appendChild(searchLabel1);
searchContainer.appendChild(searchField1);

let header2 = document.createElement("h3");
header2.id = "headerField";
header2.innerText = "Show the recipe";
searchContainer.appendChild(header2);

let searchLabel = document.createElement("label");
searchLabel.setAttribute("for", "searchField");
searchLabel.innerText="Add meal name and hit enter: ";

let searchField = document.createElement("input");
searchField.id = "searchByName";
searchField.type = "text";
searchField.addEventListener("keydown", keyBoardEnter);


let printFavoritesBtn = document.createElement("button");
printFavoritesBtn.innerText ="Show saved dishes";
printFavoritesBtn.id = "printFavoritesBtn";
printFavoritesBtn.addEventListener("click", ()=>{
  printAllMealNames();
});



searchContainer.appendChild(searchLabel);
searchContainer.appendChild(searchField);
searchContainer.appendChild(printFavoritesBtn);
document.body.appendChild(searchContainer);

let failMessage = document.createElement("div");
failMessage.id = "failMessageByLetter";
function printMealsByLetter(letter){
  removeFailMessageSearch();

  const olContainer = document.createElement("div");
      olContainer.style.textAlign = "center";
      olContainer.id = "letterSearchContainer";
  const headerForLetterSearch = document.createElement("h3");
  headerForLetterSearch.id = "headerForLetterSearch";
  headerForLetterSearch.innerText = "Your Search:";
  olContainer.appendChild(headerForLetterSearch);    
      const ol = document.createElement("ol");
      ol.id = "letterSearch";
  fetch("https://www.themealdb.com/api/json/v1/1/search.php?f="+letter)
  .then(res => res.json())
  .then(data =>{
    if(data.meals){
      ol.innerHTML="";
      
      data.meals.forEach(meal =>{
        const li = document.createElement("li");
        li.innerText = meal.strMeal;
        ol.appendChild(li);
      });
      
      olContainer.appendChild(ol);
      document.body.appendChild(olContainer);
      
    }else{
      failMessage.innerText = "No meals found!";
      document.body.appendChild(failMessage);
      olContainer.removeChild(headerForLetterSearch);
    }
  })
  .catch(error => {
    console.log("Error fetching meals: ", error);
    failMessage.innerText = "Error fetching meals.";
    document.body.appendChild(failMessage);
  });
}
 function removeOlContainer(){
  const container = document.getElementById("letterSearchContainer");
  if(container){
    container.parentNode.removeChild(container);
  }
}
  setTimeout(removeOlContainer, 0);


function createMealListItem(meal){
  removeOlContainer();
  failMessageSearch.remove();
  
  const li = document.createElement("li");
  li.style.textAlign = "center";

   const mealId = document.createElement("p");
   mealId.innerText = "Meal Id: " +meal.idMeal;
   li.appendChild(mealId);
  

  const textarea1Container = document.createElement("div");
  let textarea1 = document.createElement("textarea");
  textarea1.id = "textarea";
  textarea1.value = meal.strMeal;
  textarea1.rows = 2;
  textarea1.cols = 30;
  textarea1.addEventListener("input", function(){
    meal.strMeal = this.value;
  });
  textarea1Container.appendChild(textarea1);
  li.appendChild(textarea1Container);
  
  const textarea2Container = document.createElement("div");
  let textarea2 = document.createElement("textarea");
  textarea2.id = "textarea";
  textarea2.value = meal.strInstructions;
  textarea2.rows = 20;
  textarea2.cols = 60;
  textarea2.addEventListener("input", function(){
    meal.strInstructions = this.value;
  });
  textarea2Container.appendChild(textarea2);
  li.appendChild(textarea2Container);

  const textarea3Container = document.createElement("div");
  let textarea3 = document.createElement("textarea");
  textarea3.id = "textarea";
  textarea3.placeholder = "Add comment";
  textarea3.rows = 5;
  textarea3.cols = 30;
  textarea3.addEventListener("input", function(){
  textarea3.value = this.value;
  });
  textarea3Container.appendChild(textarea3);
  li.appendChild(textarea3Container);
 
  let postButton = document.createElement("button");
  postButton.innerText = "Save";
  postButton.id = "buttonDisplayed";
  postButton.addEventListener("click", ()=>{
    const postDataObject = {
      id: meal.idMeal,
      mealName: textarea1.value,
      recipe: textarea2.value,
      comment: textarea3.value
    };
    
    postData(postDataObject);
    ol.removeChild(li);
 
  });
  li.appendChild(postButton);

  let exitButton = document.createElement("button");
  exitButton.innerText = "Exit";
  exitButton.id = "buttonDisplayed";
  exitButton.addEventListener("click", () => {
    
      exitFunction(li);
  });
  li.appendChild(exitButton);


  return li;
}

function exitFunction(li){
  ol.removeChild(li);
  window.history.back();
}
function removeFailMessageSearch(){
  if(failMessageSearch && failMessageSearch.parentNode){
    failMessageSearch.parentNode.removeChild(failMessageSearch);
  }
  const failMessageByLetterElement = document.getElementById("failMessageByLetter");
  if(failMessageByLetterElement && failMessageByLetterElement.parentNode){
    failMessageByLetterElement.parentNode.removeChild(failMessageByLetterElement);
  }
}
function postData(data){
  const url = 'http://localhost:8080/recipes';
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }, 
    body: JSON.stringify(data)
  };

fetch(url,options)
.then(res => {
  if(!res.ok){
    throw new Error('Network response was not ok');
  }
  return res.json();
})
.then(data => console.log('data was posted successfully:', data))
.catch(error => console.log('Error posting data:',error))
}
function printMeals(mealName){
removeOlContainer();
removeFailMessageSearch();
fetch("https://www.themealdb.com/api/json/v1/1/search.php?s="+mealName)
.then(res => res.json())
.then(data => {
  console.log("data", data);
  const meal = data.meals ? data.meals[0]: null;
  if(meal){
    failMessageSearch.remove();
    const mealRecipe = meal.strInstructions;
    const li = createMealListItem(meal);
    ol.appendChild(li);
    document.body.appendChild(ol); 
    
  console.log("Recipe: ", mealRecipe);
  
  }else{
    failMessageSearch.innerText = "No meal found with given name."
    failMessageSearch.id = "failMessageSearch";
    document.body.appendChild(failMessageSearch);
    searchField.value = "";
  }
  
});

}

 function printAllMealNames(){
  let favoritesHeader = document.getElementById("favoritesHeader");
  if (favoritesHeader) {
    favoritesHeader.parentNode.removeChild(favoritesHeader);
  }
  favoritesHeader = document.createElement("h2");
  favoritesHeader.id = "favoritesHeader";
  favoritesHeader.innerText = "Your Favorites:";

  removeOlContainer();
  removeFailMessageSearch();

  fetch("http://localhost:8080/mealNames")
  .then((res)=> res.json())
  .then((data)=>{
    ol.id = "letterSearch";
    ol.innerHTML ="";
    if(data.length === 0){
      const message = document.createElement("p");
      message.innerText = "No dishes saved";
      ol.appendChild(message);

      setTimeout(() => {
        ol.removeChild(message);
      }, 3000);
     
    }else{
    data.forEach((mealName)=>{
      const li = document.createElement("li");
      li.innerText = mealName;
      li.id = "printAllMeals";
      const deleteButton = document.createElement("button");
      deleteButton.innerText = "Delete";
      deleteButton.id = "buttonDisplayed1";
      deleteButton.addEventListener("click", ()=>{
        deleteMeal(mealName, li);
      });
      li.appendChild(deleteButton);
      const getButton = document.createElement("button");
      getButton.innerText = "Get Saved Recipe";
      getButton.id = "buttonDisplayed1";
      getButton.addEventListener("click", ()=>{
        document.body.removeChild(ol);
        const liElements = ol.getElementsByTagName("li");
        while (liElements.length > 0){
          ol.removeChild(liElements[0]);
        }
        
        getTableData(mealName);
        if(favoritesHeader){
          favoritesHeader.style.display = "none";
        }
        
      });
      li.appendChild(getButton);
      ol.appendChild(li);
    });
   
  }
    ol.style.textAlign = "center";
    document.body.appendChild(favoritesHeader);
    document.body.appendChild(ol);
  })
  .catch((error)=> console.log("Error fetching meal names", error));
 }
 
 
 function getTableData(mealName){
  fetch(`http://localhost:8080/mealNames/${mealName}`)
  .then((res)=> res.json())
  .then((data)=>{
    displayTableData(data);
  })
  .catch((error)=>console.log('error fetching table data',error));
 }
 
 const ol2 = document.createElement("ol");
 ol2.id = "letterSearch";
 document.body.appendChild(ol2);
 function displayTableData(data){
  removeOlContainer();
  ol2.style.textAlign = "center";
  const mealId = data.id;
  const mealName = data.mealName;
  const recipe = data.recipe;
  const comment = data.comment;

  const li = document.createElement("li");
  const mealIDParagraph = document.createElement("p");
  mealIDParagraph.innerText = "Meal ID: "+mealId;
  
  const textarea1Container = document.createElement("div");
  const textarea1 = document.createElement("textarea");
  textarea1.id = "textarea";
  textarea1.value = mealName;
  textarea1.placeholder ="Meal Name";
  textarea1.rows = 2;
  textarea1.cols = 30;
  textarea1Container.appendChild(textarea1);
  li.appendChild(textarea1Container);

  const textarea2Container = document.createElement("div");
  const textarea2 = document.createElement("textarea");
  textarea2.id = "textarea";
  textarea2.value = recipe;
  textarea2.placeholder ="Recipe";
  textarea2.rows = 20;
  textarea2.cols = 60;
  textarea2Container.appendChild(textarea2);
  li.appendChild(textarea2Container);

  const textarea3Container = document.createElement("div");
  const textarea3 = document.createElement("textarea");
  textarea3.id = "textarea";
  textarea3.value = comment;
  textarea3.placeholder ="Comment";
  textarea3.rows = 5;
  textarea3.cols = 30;
  textarea3Container.appendChild(textarea3);
  li.appendChild(textarea3Container);

  const postUpdateBtn = document.createElement("button");
  postUpdateBtn.innerText = "Save Update";
  postUpdateBtn.id = "buttonDisplayed";
  postUpdateBtn.addEventListener("click", ()=>{
    const updatedData ={
      id: mealId,
      mealName: textarea1.value,
      recipe: textarea2.value,
      comment: textarea3.value
    };
    updateRecipe(mealName,updatedData,li);
    ol2.removeChild(li);
  });
  const exitBtn2 = document.createElement("button");
  exitBtn2.innerText = "Exit";
  exitBtn2.id = "buttonDisplayed";
  exitBtn2.addEventListener("click", ()=>{
    window.history.back();
    ol2.removeChild(li);
  })
  li.appendChild(postUpdateBtn);
  li.appendChild(exitBtn2);
  ol2.appendChild(li);
  
 }
 
 function updateRecipe(mealName, mealData, listItem){
  const url = `http://localhost:8080/mealNames/${mealName}`;
  
  const options ={
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body:JSON.stringify(mealData)
  };
  fetch(url, options)
  .then((res)=>{
     if(!res.ok){
       throw new Error(`Failed to update the recipe: ${res.status} ${res.statusText}`);
      
     }
 
     return res.json(); 
    
  }) 
  .then((updatedRecipe)=>{
    if(updatedRecipe.success){ 
      listItem.remove();
      console.log("Uppdated successfully");
  } else{

    const mealIDParagraph = listItem.querySelector("p");
    mealIDParagraph.innerText = "Meal Id: " + updatedRecipe.idMeal;

    const textarea1 = listItem.querySelector("textarea:nth-of-type(1)");
    textarea1.value = updatedRecipe.mealName;

    const textarea2 = listItem.querySelector("textarea:nth-of-type(2)");
    textarea2.value = updatedRecipe.recipe;
    
    const textarea3 = listItem.querySelector("textarea:nth-of-type(3)");
    textarea3.value = updatedRecipe.comment;
  } 
 })
 .catch((error)=> console.log("Error updating recipe: ", error)); 
}

 function deleteMeal(mealName, listItem){
  const url = `http://localhost:8080/mealNames/${mealName}`;
  const options = {
    method: "DELETE",
  };
  fetch(url,options)
  .then((res)=>{
    if(res.ok){
      console.log('Meal deleted successfully');
      listItem.remove();
    }else{
      throw new Error('Failed to delete the meal: ${res.status} ${res.statusText}');
    }
    
  })
  .catch((error)=> console.log('Error deleting meal: ',error));
 }
 
