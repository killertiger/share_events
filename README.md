# share_events_rest_api

Based on course (AI For Developers With GitHub Copilot, Cursor AI & ChatGPT)[https://www.udemy.com/course/ai-for-developers-with-github-copilot-cursor-ai-chatgpt/]

## Development

Dependencies:
- better-sqlite3 - Store data in sqlite
- bcryptjs - Encrypt data, e.g. password
- jsonwebtoken - JWT

VsCode Extensions:
- SQLite Viewer - https://marketplace.cursorapi.com/items/?itemName=qwtel.sqlite-viewer

## Running

Installing packages
```bash
npm i
```

Running
```
npm dev
```

### Making request

Signup
```
POST /users/signup HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
    "email": "test@example.com",
    "password": "test123abc",
    "name": "my test"
}
```

Login
```
POST /users/login HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Content-Length: 65

{
    "email": "test@example.com",
    "password": "test123abc"
}
```

Create an event
```
POST /events HTTP/1.1
Host: localhost:3000
Authorization: Bearer {TOKEN}
Content-Type: application/json
Content-Length: 144

{
    "title": "A test event",
    "description": "Testing...",
    "address": "Test street 5, Test City 5",
    "date": "2025-07-05T17:00:00"
}
```

Get events:

```
GET /events HTTP/1.1
Host: localhost:3000
```

Update event:
```
PUT /events/1760697764826 HTTP/1.1
Host: localhost:3000
Authorization: Bearer {TOKEN}
Content-Type: application/json
Content-Length: 146

{
    "title": "A test event 2",
    "description": "Testing...",
    "address": "Test street 5, Test City 5",
    "date": "2025-07-05T17:00:00"
}
```

Delete event:
```
DELETE /events/1760697764826 HTTP/1.1
Host: localhost:3000
Authorization: Bearer {TOKEN}
```


## Prompts

### Planning

On chatgpt:

> You are a professional Node.js / Express developer.
> 
> Give me the structure and key building blocks for a Node + Express REST API that offers the following features:
> 
> User authentication
> Authenticated users can create, edit & delete events
> Authenticated users can register for events and unregister
> Users can only edit or delete the events they created
> Events are made up of a title, description, date, location and image (which is uploaded during creation)
> 
> Don't generate any code, just give me the key building blocks and structure.


### Coding - Cursor

#### Add authentication

Using the agent mode

> This REST API needs user authentication.
> 
> User must be able to register (signup) and login.
> 
> Don't add any JWT code or anything like that, just generate User model (without using classes) in the models folder.
> Also generate signup and login routes (e.g., /users/signup) in the routes folder.
> Last but not least add the code for linking route and model to a users controller (controllers folder).
> Don't add any code for storing user data in a database yet.

#### Adding SQLite database

Using the chat

> @web I want to store all data in a SQLite database. How do I add one to this application?

#### Improve validation in signup method

Using the inline chat in signup method

> Apply better validation for both the email and password.
> The email must be valid email address and it must not be taken yet (i.e., not exist in the database yet).
> The password must be at least 6 characters long. Both fields must not be empty strings or just a bunch of blanks.

#### Adding cryptography to password


Inline chat users.js - Select createUser method after installing the package `bcryptjs`

> Hash the password before storing it. @package.json 

following up request in the createUser method

> Use the async version of hash instead of hashSync

Inline chat in users.js - Add password validation

> Add a function I can use to verify user crendentials

Inline chat in user-controllers.js - Select the login method

> User the @verifyUserCredentials() function.


In chat - Fixing the json response after signup

> When testing the signup route, I got back a success message but the user data (user object) was an empty object.
> 
> See below:
> {
>     "success": true,
>     "message": "User created successfully",
>     "data": {}
> }
> 
> Why do I get this response? @user.js  @users.js 

#### Add methods for JWT

Inline chat in utils/auth.js - After installing jsonwebtoken

> Add functions for generating JWTs (with the jsonwebtoken package) and for verifying.
> The JWT should include the user id and email of the user to whom it belongs.

#### Make usage of JWT

- Inline chat in controllers/user-controllers.js - Select the entire file

> Use the @generateJWT() function to generate JWTs which are sent back with the response after successful signup or login.

### Coding - Copilot

#### Add events routes

Inline chat in routes/events.js 

> Add some event-specific routes which can be used to create events, edit an event (identified by id) or delete an event.
> Use ESM imports / exports.

Ps.: It didn't work very well, due to the lack of content regarding to the workspace, it mocked the database

#### Add events model

Regular Chat 

> @workspace Edit the #file:event.js file to contain and export functions that will create a new event (with title, description, address and date), edit an event, delete an event or get all or a single event (by id).

#### Add events controller

Inline chat - controllers/events-controllers.js

> Insert and export functions for creating an event, editing an event, deleting an event and for getting one event by id or all events. Consider #file:event.js 

#### Update events-controllers

Inline chat - routes/events.js

> update the routes to use the appropriate controller functions from #file:events-controllers.js 

#### Add validation to create events

Inline chat - controllers/events-controllers.js - Select create event

> Add validation to ensure title, description, address and date are all not empty (also not just a bunch of blanks) and valid values.

#### Add validation to update events

Inline chat - controllers/events-controllers.js - Select update event

> Add validation here

#### Add validation to update events

Inline chat - util/auth.js at the end

> add authenticate method to validate the token

#### Add user id in DB

Inline chat - models/event.js method createEvent

> store user id

#### Check if it is the same user to Edit and Delete

Inline chat - models/event.js method update

> check that user id (in req.user) is the same as the user id stored for the event that's about to be edited

Inline chat - models/event.js method delete

> also check user id