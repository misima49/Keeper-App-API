
# Keeper App

A task scheduling and note keeping app.\
The API can be accessed at: https://git.heroku.com/misima-keeper-app.git \
Front end for this app is still work in progress. The link will be update here once it's done.

To use the app you can either send the documented requests to the deployed link or set the app locally as explained below:


## Run Locally

First fork and then clone the project

```bash
  git clone https://github.com/misima49/Keeper-App-API
```

Go to the project directory

```bash
  cd Keeper-App-API
```

Install dependencies

```bash
  npm install
```
Before starting the server `dev.env` file is needed in config directory. \
Run the following commands:
```
mkdir config
touch dev.env
```

In dev.env file provide the following key values:
```
MONGODB_CONNECTION_URL=<Your mongodb connection string>
SIB_API_KEY=<Your send in blue API key>
PORT=3000
JWT_ENCRYPT_KEY=<JWT signing string>
```

Start the server

```bash
  npm run dev
```


## Usage/Examples

### Create new user

To create a new user, make a post request at,
```
https://git.heroku.com/misima-keeper-app.git/users

```
The request body must contain `name`, `email` and `password` fields. `age` is optional and default value if not provided is 0.
```
{
    "name": "Mrinal",
    "password": "astrongpassword",
    "email": "sample@test.com",
    "age":"22"
}
```
The response body will contain the newly created user and a token that has to be used to access other resources of the web page. An email is also send to the provided email id welcoming the user to the app.
```
{
    "user": {
        "_id": "62d16cb5756f865bf6100acc",
        "name": "Mrinal",
        "email": "sample@test.com",
        "age": 22,
        "__v": 1
    },
    "token": "this.isASampleJWTtoken.thatYouWillGetAsAResponse"
}
```

### Login a user

To login, make a post request at,
```
https://git.heroku.com/misima-keeper-app.git/users/login

```
The request body must contain `email` and `password` fields.
```
{
    "email": "sample@test.com",
    "password": "astrongpassword",
}
```
The response body will contain the logged in user and a token that has to be used to access other resources of the web page.
```
{
    "user": {
        "_id": "62d16cb5756f865bf6100acc",
        "name": "Mrinal",
        "email": "sample@test.com",
        "age": 22,
        "__v": 1
    },
    "token": "this.isASampleJWTtoken.thatYouWillGetAsAResponse"
}
```
Now that you have a token you can use all the other requests. For starters you can make new task:

### Create new task

To create a new task, make a post request at,
```
https://git.heroku.com/misima-keeper-app.git/tasks

```
The request body must contain a `description`. `completed` is optional and default value if not provided is false.
```
{
    "description": "First task",
    "completed": true
}
```
The header of the request must contain the `Authorization` field with value being `Bearer this.isASampleJWTtoken.thatYouWillGetAsAResponse` i.e. the token you recieved when logged in.
The response body will contain the newly created task with it's owner and timestamps.
```
{
    "description": "First task.",
    "completed": true,
    "owner": "62d16cb5756f865bf6100acc",
    "_id": "62d17a71756f865bf6100aed",
    "createdAt": "2022-07-15T14:32:17.407Z",
    "updatedAt": "2022-07-15T14:32:17.407Z",
    "__v": 0
}
```
The list contains all available routes and resources.
## API Reference

#### Sign Up

```http
  POST /users
```

| Request Body | Required/Not Required | Note |
| :-------- | :------- | :------- |
| `name` | `required` | |
| `email` | `required` | |
| `password` | `required` | should not contain the  word 'password' and length should be greater than 6
| `age` | `not required` | |

#### Log In

```http
  POST /users/login
```

| Request Body | Required/Not Required | Note |
| :-------- | :------- | :------- |
| `email` | `required` | |
| `password` | `required` | |

#### View Profile

```http
  GET /users/me
```
Header should contain `Authorization` token to access this. No content is needed in body.

#### Update Profile

```http
  PATCH /users/me
```
Header should contain `Authorization` token to access this. Cannot modify email. Body should contain fields to be updated.

| Request Body | Required/Not Required | Note |
| :-------- | :------- | :------- |
| `name` | `required` | |
| `email` | `not required` | |
| `age` | `not required` | |

#### Logout from current device

```http
  POST /users/logout
```
Header should contain `Authorization` token to access this. No content is needed in body.

#### Logout from all devices

```http
  POST /users/logoutAll
```
Header should contain `Authorization` token to access this. No content is needed in body.

#### Delete user

```http
  DELETE /users/me
```
Header should contain `Authorization` token to access this. No content is needed in body.

#### Create a new task

```http
  POST /tasks
```
Header should contain `Authorization` token to access this.

| Request Body | Required/Optional | Note |
| :-------- | :------- | :------- |
| `description` | `required` | |
| `completed` | `optional` | Default: `false`|

#### Find task

```http
  GET /tasks/:id
```
Header should contain `Authorization` token to access this. Task id should be provided as parameter. Body should be empty.

#### Show all tasks for current user

```http
  GET /tasks
```
Header should contain `Authorization` token to access this. Body should be empty.
Following queries are supported for pagination, sorting and filtering:


| Query Key | Valid Values | Note |
| :-------- | :------- | :------- |
| `sortBy` | `createdAt:desc` , `createdAt:asc` | Sorts result by its cretation time.|
| `completed` | `true` , `false` | Filters task by completed field |
| `skip` | `Number` | Skip the first `skip` results |
| `limit` | `Number` | Show only `limit` results |

#### Update task

```http
  PATCH /tasks/:id
```
Header should contain `Authorization` token to access this. Task id should be provided as parameter. Body should contain fields to be updated.

| Request Body | Required/Optional | Note |
| :-------- | :------- | :------- |
| `description` | `optional` | |
| `completed` | `optional` | |

#### Delte task

```http
  DELETE /tasks/:id
```
Header should contain `Authorization` token to access this. Task id should be provided as parameter. Body should be empty.


