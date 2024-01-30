let label = document.createElement("label");
label.setAttribute("for", "searchField");
label.innerText="Type a meal name and hit enter: ";
document.getElementById("labelContainer").appendChild(label);
let searchField = document.getElementById("searchField");
let parentElement = searchField.parentElement;
parentElement.insertBefore(label, searchField);
let ol = document.createElement("ol");
let failMessage = document.createElement("p");

function postData(data){
  const url = 'http://localhost:8080/';
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
    const mealId = document.createElement("p");
    mealId.innerText = meal.idMeal;

    const mealIdText = document.createTextNode("Meal Id: ");
    document.body.appendChild(mealIdText);
    document.body.appendChild(mealId);
    
    failMessage.innerText = "";
    const mealRecipe = meal.strInstructions;
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
    let li = document.createElement("li");
    li.appendChild(textarea1);
    let ul = document.createElement("ul");
    ul.appendChild(textarea2);
    ul.appendChild(textarea3);
    li.appendChild(ul);   
    ol.appendChild(li);
    document.body.appendChild(ol); 
    
    console.log("Recipe: ", mealRecipe);
    let postButton = document.createElement("button");
  postButton.innerText = "Post the recipe";
  document.body.appendChild(postButton);
  postButton.addEventListener("click", ()=>{
    const postDataObject = {
      mealId: meal.idMeal,
      textarea1: textarea1.value,
      textarea2: textarea2.value,
      textarea3: textarea3.value
    };
    postData(postDataObject);
  });
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
    }
}
searchField.addEventListener("keydown", keyBoardEnter);

