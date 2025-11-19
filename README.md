# 😭 I cried here!

## Contribute

Message me if you'd like to contribute

### TODO
[ ] Add new lines in stories (there are line breaks in the DB, they are just squashed by html)
[ ] Add a translation column and a "show translation" toggle for any story that has a translation
[ ] Design! Improve the design of the site
[ ] Add a cry counter (I cried today) - to the footer - store in db

### Install locally

* Create a pg database

* Create a `stories` table
```
CREATE TABLE stories 
COLUMN story , visible, name, age, email, created_at)
```

* Create a `.env` file containing your database URL in this format:
```
DATABASE_URL='postgresql://<db_user>:<db_password>@<db_host>?ssl=true'
```

* Install the project locally
```
npm install
```

* Run the server
```
npm start
```

#### Adding stories

* Use the form
* Connect to the db to change the visible flag to true to publish them



