let label = document.createElement("label");
label.setAttribute("for", "searchField");
label.innerText="Type a meal name and hit enter: ";
document.getElementById("labelContainer").appendChild(label);
let searchField = document.getElementById("searchField");
let parentElement = searchField.parentElement;
parentElement.insertBefore(label, searchField);
let ol = document.createElement("ol");



function printMeals(mealName){
    fetch("https://www.themealdb.com/api/json/v1/1/search.php?s="+mealName)
.then(res => res.json())
.then(data => {
  
  const meal = data.meals[0];
  if(meal){
    const mealRecipe = meal.strInstructions;
    let li = document.createElement("li");
    li.innerText = meal.strMeal;
    let ul = document.createElement("ul");
    ul.innerText = meal.strInstructions;
    li.appendChild(ul);   
    ol.appendChild(li);
    document.body.appendChild(ol); 
    console.log("Recipe: ", mealRecipe);
  }else{
    console.log("No meal found with given name.")
  }
    console.log("data", data);
    searchField.value = "";  
});

}


function keyBoardEnter(event){
    if(event.key === "Enter"){
        let mealName = searchField.value;
        printMeals(mealName);
    }
}
searchField.addEventListener("keydown", keyBoardEnter);
