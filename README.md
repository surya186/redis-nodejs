A express server to fetch data from the github api and set that data to a redis cache.

**Requirements**<br>

Install Redis server in your machine and server should run in the backgroud.
 - Redis runs dafault on the port 6379

Install app by running `npm install` in the `package.json` directory
 - It fetches all the dependencies into node_modules directory

Run the command `npm start` to start the express server
 - By default, the server listens on port 5000 
   (unless, there is no PORT set in the environment) 

Goto the route : `localhost:5000/repos/<github_username>` 

**Explantion**<br>
That route calls the method `getRepos` 
- It uses `node-fetch` to fetch data from the github api and gets the public_repos of the given user. 
- Also, sets the data fetched from the api to the redis server using setex() which sets key and value as well as expiration.
- Finally, sends the response back to the user. (used setResponse function for template)

After intial fetch, we are setting the data to the redis cache. Now, we can fetch the data from redis cache by using get functionality. For that, we used cache functionality which gets data from the redis server and returns to the user with very minimal time. 

We can observe the same via network menu in the developer tools.
observation: 
`Initial fetch - 180ms`<br>
`Redis fetch - 2ms`
