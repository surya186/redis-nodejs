const express = require('express');
const fetch = require('node-fetch');
const redis = require('redis');


const PORT = process.env.PORT || 5000;
const REDIS_PORT = process.env.PORT || 6379;


const client = redis.createClient(REDIS_PORT);

const app = express();

// just a respose template for re-use.
function setResponse(username, repos){
    return `<h2> ${username} has ${repos} github public repos </h2>`;
}


async function getRepos(req, res, next){
    try{
        console.log('fetching data . . .')
        
        const {username} = req.params;
        const response = await fetch(`https://api.github.com/users/${username}`) 
        // fetching data from github api to get some data
        const data = await response.json();
        // res.send(data); //To check - working

        const repos = data.public_repos;
        //public_repos is an item retuned by the github api - its just a user's public repo count.
        
        //Set data to Redis cache using setex - set data with some expiration
        client.setex(username, 3600, repos);

        res.send(setResponse(username, repos));

    }catch(err){
        console.log(err)
        res.status(500) //server error
    }

}


//Cache middleware
function cache(req, res, next){
    const {username} = req.params;

    client.get(username, (err, data) => {
        if(err) throw err;
        if(data !== null){
            res.send(setResponse(username, data));
        }else{
            next();
        }
    })
}

// route is repos/any_github_userid - for that route we are calling `getRepos` 
// After getting data, we are setting the data to redis inside the `getRepos` function itself.
// Inorder to get benifit from redis, we added `cache` function to get the data which was set eariler.
app.get('/repos/:username', cache, getRepos);


app.listen(PORT, () => {
    console.log(`Listenting on port ${PORT}`)
});

