let label = document.createElement("label");
label.setAttribute("for", "searchField");
label.innerText="Type a meal name and hit enter: ";
document.getElementById("labelContainer").appendChild(label);
let searchField = document.getElementById("searchField");
let parentElement = searchField.parentElement;
parentElement.insertBefore(label, searchField);
let ol = document.createElement("ol");
let failMessage = document.createElement("p");

function createMealListItem(meal){
  
  let li = document.createElement("li");

  const mealId = document.createElement("p");
  mealId.innerText = "Meal Id: "+meal.idMeal;
  
  let textarea1 = document.createElement("textarea");
  textarea1.value = meal.strMeal;
  textarea1.rows = 2;
  textarea1.cols = 30;
  textarea1.addEventListener("input", function(){
    meal.strMeal = this.value;
  });

  let textarea2 = document.createElement("textarea");
  textarea2.value = meal.strInstructions;
  textarea2.rows = 20;
  textarea2.cols = 60;
  textarea2.addEventListener("input", function(){
    meal.strInstructions = this.value;
  });

  let textarea3 = document.createElement("textarea");
  textarea3.placeholder = "Add comment";
  textarea3.rows = 5;
  textarea3.cols = 30;
  textarea3.addEventListener("input", function(){
  textarea3.value = this.value;
  });
  let ul = document.createElement("ul");
  ul.appendChild(textarea2);
  ul.appendChild(textarea3);
  li.appendChild(mealId);
  li.appendChild(textarea1);
  li.appendChild(ul);
  
  let postButton = document.createElement("button");
  postButton.innerText = "Post the recipe";
  li.appendChild(postButton);

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
  
  return li;
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
fetch("https://www.themealdb.com/api/json/v1/1/search.php?s="+mealName)
.then(res => res.json())
.then(data => {
  console.log("data", data);
  const meal = data.meals ? data.meals[0]: null;
  if(meal){
    failMessage.innerText = "";
    const mealRecipe = meal.strInstructions;
    const li = createMealListItem(meal);
    ol.appendChild(li);
    document.body.appendChild(ol); 
    
  console.log("Recipe: ", mealRecipe);
  
  }else{
    failMessage.innerText = "No meal found with given name."
    document.body.appendChild(failMessage);
    searchField.value = "";
  }
  
});

}

function keyBoardEnter(event){
    if(event.key === "Enter"){
        let mealName = searchField.value;
        printMeals(mealName);
        searchField.value = "";
    }
}
searchField.addEventListener("keydown", keyBoardEnter);

 function printAllMealNames(){
  fetch("http://localhost:8080/mealNames")
  .then((res)=> res.json())
  .then((data)=>{
    ol.innerHTML ="";
    data.forEach((mealName)=>{
      const li = document.createElement("li");
      li.innerText = mealName;
      const deleteButton = document.createElement("button");
      deleteButton.innerText = "Delete";
      deleteButton.addEventListener("click", ()=>{
        deleteMeal(mealName, li);
      });
      li.appendChild(deleteButton);
      const getButton = document.createElement("button");
      getButton.innerText = "Get table data!";
      getButton.addEventListener("click", ()=>{
        getTableData(mealName);
      });
      li.appendChild(getButton);
      ol.appendChild(li);
    });
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
 document.body.appendChild(ol2);
 function displayTableData(data){
  const mealId = data.id;
  const mealName = data.mealName;
  const recipe = data.recipe;
  const comment = data.comment;

  const li = document.createElement("li");
  const mealIDParagraph = document.createElement("p");
  mealIDParagraph.innerText = "Meal ID: "+mealId;
 
  const textarea1 = document.createElement("textarea");
  textarea1.value = mealName;
  textarea1.placeholder ="Meal Name";
  textarea1.rows = 2;
  textarea1.cols = 30;

  const textarea2 = document.createElement("textarea");
  textarea2.value = recipe;
  textarea2.placeholder ="Recipe";
  textarea2.rows = 20;
  textarea2.cols = 60;

  const textarea3 = document.createElement("textarea");
  textarea3.value = comment;
  textarea3.placeholder ="Comment";
  textarea3.rows = 5;
  textarea3.cols = 30;

  li.appendChild(mealIDParagraph);
  li.appendChild(textarea1);
  li.appendChild(textarea2);
  li.appendChild(textarea3);

  

  const postUpdateBtn = document.createElement("button");
  postUpdateBtn.innerText = "Post Update";
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
  li.appendChild(postUpdateBtn);
  
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

    const mealIDParagraph = listItem.querySelector("textarea:nth-of-type(1)");
    mealIDParagraph.innerText = "Meal Id: "+updatedRecipe.idMeal;

    const textarea1 = listItem.querySelector("textarea:nth-of-type(2");
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
 document.getElementById("printListBtn").addEventListener("click", printAllMealNames);
