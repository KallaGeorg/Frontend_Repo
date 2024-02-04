Hur programmet byggs

-Gå på sidan: https://www.themealdb.com/api.php 
(håll fönstret öppet)

-Öppna MAMP PHPMYADMIN och öppna skapade listan:  "recipe_table"
(håll fönstret öppet)



-Öppna Frontend_Repot och använd live-server för att öppna     programmet

-Observera url:n på sidan och klistra in url:n i adressfältet i Backend_Repots controller:
@CrossOrigin(origins = "http://Din url/")

- Gör de nödvändiga ändringar i appliction.properties av Backend_Repot för: 
datasource.url,
datasource.username,
datasource.password

Mina appliction.properties ser ut så här:

spring.jpa.hibernate.ddl-auto=update
spring.datasource.url=jdbc:mysql://${MYSQL_HOST:localhost}:3306/myRecipes
spring.datasource.username=myRecipes
spring.datasource.password=myRecipes
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
#spring.jpa.show-sql: true

-Starta BackendApiApplication.java

-Kör Frontend_Repots program