const express = require("express");
const bodyParser = require("body-parser"); 
const request = require("request");
const https = require("https");

const app = express();

//use express app to use static files like css and images providing path to static folder
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true})); // to get the data from the form in the post request

// get route to the signup page
app.get("/" , function(req, res) {
    res.sendFile(__dirname + "/signup.html");
})

// set action and method in the form in signup.html so that we can get the data from the form

app.post("/" , function(req, res) {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;
    console.log(firstName , lastName , email); 
    
    const data = {
        members : [
            {
                email_address : email,
                status : "subscribed",
                merge_fields : {
                    FNAME : firstName,
                    LNAME : lastName 
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us21.api.mailchimp.com/3.0/lists/c2673154fc";

    const options = {
        method : "POST",
        auth : "prince1:77fc56fbdf3283be4e13d55e32cdc35a-us21",
    }

    const request =  https.request(url, options , function(response) {

        if(response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");  
        }   

        response.on("data", function(data){
            console.log(JSON.parse(data));
        });
    })

    request.write(jsonData); 

    request.end();

})

app.post("/failure" , function(req, res) {
    res.redirect("/");
});


app.listen(3008 , function() {
    console.log("server is live at port 3008");
})


///    77fc56fbdf3283be4e13d55e32cdc35a-us21 - mailchimp api key
///
///   c2673154fc -- list id


