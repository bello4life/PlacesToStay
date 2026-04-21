# Contents {#contents .TOC-Heading}

[Part A -- REST API [3](#part-a-rest-api)](#part-a-rest-api)

[1. Retrieve accommodation by location
[3](#retrieve-accommodation-by-location)](#retrieve-accommodation-by-location)

[2. Retrieve accommodation by location and type
[3](#retrieve-accommodation-by-location-and-type)](#retrieve-accommodation-by-location-and-type)

[3. Book accommodation [3](#book-accommodation)](#book-accommodation)

[Part B -- Tasks 4 and 5: React Front-End
[4](#part-b-tasks-4-and-5-react-front-end)](#part-b-tasks-4-and-5-react-front-end)

[4. Search for accommodation by location
[4](#search-for-accommodation-by-location)](#search-for-accommodation-by-location)

[5. Booking from the front-end
[4](#booking-from-the-front-end)](#booking-from-the-front-end)

[Part C -- Task 6: Error Checking
[5](#part-c-task-6-error-checking)](#part-c-task-6-error-checking)

[Part D -- Task 7: Adding a Map
[5](#part-d-task-7-adding-a-map)](#part-d-task-7-adding-a-map)

[Part E -- Task 8 and 9: Login, sessions, Middleware
[6](#part-e-task-8-and-9-login-sessions-middleware)](#part-e-task-8-and-9-login-sessions-middleware)

[8.Login and sessions [6](#login-and-sessions)](#login-and-sessions)

[9.Middleware [6](#middleware)](#middleware)

[Part G \-- Task 10 &11: Availability, Date Checking and Booking Form
[7](#part-g----task-10-11-availability-date-checking-and-booking-form)](#part-g----task-10-11-availability-date-checking-and-booking-form)

[10. Availability And Date Checking
[7](#availability-and-date-checking)](#availability-and-date-checking)

[11. Booking Form per Result
[7](#booking-form-per-result)](#booking-form-per-result)

[Part H -- Extensive Use of Middleware, DAOs, Controllers and Routers
[8](#part-h-middleware-daos-controllers-and-routers)](#part-h-middleware-daos-controllers-and-routers)

# Part A -- REST API

## 1. Retrieve accommodation by location

This requires retrieving accommodation based on a location. As this task
only reads data, I will use a **GET request**, following the REST
principles discussed in Topic 2.

I will create an endpoint /accommodation/:location, where the location
will be passed as a route parameter, The implementation will involve
writing a database query that selects accommodation records matching the
given location. The results will then be returned to the client as
**JSON**.

## 2. Retrieve accommodation by location and type

This requirement is very similar to the previous task. It also retrieves
accommodation data, so the same **GET request approach** will be used.

The main difference is that this endpoint will filter results using
**two parameters instead of one**. I will design the endpoint
/accommodation/:location/:type, where both values are passed through the
URL.

The implementation will follow the same process as the first task, but
the SQL query will include **both location and type** in the selection
condition so that the results match both values.

## 3. Book accommodation

This requires creating a booking. Since this operation will insert new
data into the database, I will use a POST request.

I will implement the endpoint **/accommodation/book**. The booking
information will be sent in the request body as JSON. The request must
include the booking data and the apiID parameter.

The server will first check whether the apiID value matches
**\"0x574144\"**. If the value is incorrect, the server will return a
403 status code indicating that the request is not authorized.

If the apiID is valid, the server will then check the acc_dates table to
confirm that availability exists for the selected accommodation and
date. It will also verify that the number of people requested does not
exceed the available spaces. If the request passes these checks, the
server will insert a new booking record into the acc_bookings table.
After the booking is created, the system will update the acc_dates table
to reduce the availability for that accommodation on the selected date.

Each route will be wrapped in a try/catch block to handle unexpected
errors. If a failure occurs, a 500 status code is returned to indicate a
server-side issue. Successful operations return JSON responses,
including the ID of the newly created booking.

# Part B -- Tasks 4 and 5: React Front-End

## 4. Search for accommodation by location

For this task I need to think about how to structure the components. I
will split the UI into a search component for the input and button, and
a results component for displaying the data, with a parent App component
managing the shared state. I am lifting the state up to App because both
components need access to the same results data. this is the approach
covered in week 6.

Since the search is triggered by a button click rather than on component
load, I will call fetch directly inside a click handler rather than
using useEffect. I will use the then-based promise syntax from week 3 to
call my /accommodation/:location route, and update the results state
with the setter function when the data comes back, which will cause the
results component to re-render automatically.

To display the results, I will use the map() pattern from week 5 to
convert the results array into JSX list items, using each
accommodation\'s id as the unique key.

## 5. Booking from the front-end

The Book button will sit inside the existing map() so each result gets
its own button. I will pass the accommodation id into the booking
function using an arrow function on the onClick handler from week 5, so
each button knows which accommodation it belongs to.

The booking fetch will be a POST request with a JSON body sent to my
/accommodation/book route, following the approach from week 3. The
number of people and date will be hard-coded for now as the brief allows
at this stage.

For feedback I will use a state variable to hold a booking confirmation
message and display it inline on the page. I think this is cleaner than
a browser alert as it keeps the user on the page without any
interruption.

**\**

# Part C -- Task 6: Error Checking

**Server side**

For the server side of this task, I need to add validation to the
booking route so that if any of the required fields --- accID, people,
or date are missing or blank, the server returns an appropriate HTTP
error code rather than attempting to run the query.

From week 2 I learned that REST APIs should use HTTP status codes to
signal different types of error rather than inventing custom ones. The
appropriate code here is **400 Bad Request**, which from the week 2
notes is used when the HTTP request is invalid in some way, for example
containing invalid or missing data. I will add a check at the start of
the booking route before any database interaction takes place, if any of
the required fields are missing, I will return a 400 status with a JSON
error message explaining what went wrong.

**Client side**

For the front end I need to check the HTTP status code coming back from
the server after a booking attempt and display a user-friendly message
depending on whether it succeeded or failed.

From week 3 I learned that the response object returned by fetch has a
status property that holds the HTTP status code. I will use this in the
booking function in ResultsComponent to check whether the response was
successful or not. If the status is not 200, I will display a friendly
message to the user that does not expose any technical detail, something
a non-technical user would understand. If the booking was successful, I
will display a confirmation message as I was already doing in Task 5.

# Part D -- Task 7: Adding a Map

For this task I need to add a Leaflet map to the search results so that
each accommodation is displayed as a marker, and when a user clicks a
marker the accommodation name and type appear as a popup.

I will create a separate MapComponent and pass the results array down to
it as a prop from App, keeping the map logic clean and separate from the
list display. This follows the same component structure I have been
using throughout; App holds the state and passes what each component
needs down as props.

Inside the component I will store the Leaflet map instance in a **ref**
using useRef from week 7. I will use a single **useEffect** with the
results array as the dependency, so it runs every time new search
results come in. Inside the effect I will check if(map.current == null)
before initialising the map so it only sets up once on first load. The
setView call and marker logic will sit outside that if block, so they
update every time the results change.

For each accommodation I will loop through the results and create a
Leaflet marker using its latitude and longitude, binding a popup with
bindPopup() to show the name and type when clicked. Before adding new
markers each time the results update, I will need to clear any existing
markers from the map first, so old results don\'t stay on the map when
the user does a new search.

# Part E -- Task 8 and 9: Login, sessions, Middleware

## 8.Login and sessions

For this task I need to think about two things, how to keep track of
whether a user is logged in on the server, and how to reflect that on
the front end without losing the login status on page reload.

To handle sessions, I will use express-session with
express-session-better-sqlite3 to store session data in SQLite, as
covered in week 8. I will set up the session middleware using
app.use(expressSession({\...})) so it runs on every request. I will also
create the necessary type declarations for TypeScript as covered in week
8.

On the server side I will create three routes, a POST /login route that
checks the username and password against the acc_users table, a GET
/login route that returns the currently logged in user, and a POST
/logout route that destroys the session. If the login details are
incorrect, I will return a 401 status code.

For the front end I will add a login form to App. When the component
first loads, I will use useEffect to hit the GET /login route and check
if a user is already logged in. This is what handles the page reload
case, the front end checks the server on load and updates accordingly. I
will store the username in state and use it to decide whether to show
the login form or the \"Logged in as\" message.

# 9.Middleware

For this task I need to restrict the booking route so that only logged
in users can make a booking. On the front end I also need to handle the
case where a user tries to book without being logged in and show them a
friendly message.

On the server side I will add middleware before the booking route,
following the same pattern covered in week 8. The middleware checks all
POST requests, if req.session.username exists, it calls next() to allow
the request through. If not, it returns a 401 status code. I will place
this middleware after the login and logout routes so those remain
accessible without being logged in, otherwise the login POST route
itself would be blocked.

On the front end I already handle different status codes in
ResultsComponent from Task 6. I just need to add a check for the 401
status code and display a message telling the user they need to log in
before they can book.

# Part G \-- Task 10 &11: Availability, Date Checking and Booking Form

## 10. Availability And Date Checking

For this task I want to make the booking route more robust by checking
that there is availability for the requested number of people on the
specified date, and that the date is not in the past.

Looking at my server, I already added availability checking back in Part
A when I built the booking route, I checked the acc_dates table to
confirm availability exists and that the number of people does not
exceed it. So, the main thing to add here is the **date in the past**
check. I will compare the booking date against today\'s date and return
a 400 status code with a specific error message in the JSON if the date
has already passed.

The brief also says the specific error should be included within the
JSON message sent back, so rather than just sending a generic error I
will make sure each error case returns a descriptive message so the
front end can tell the user exactly what went wrong.

On the front end I will update the booking function in ResultsComponent
to read the specific error message from the JSON response and display it
to the user, rather than showing a generic message for all 400 errors.
This way the user knows whether the booking failed because there was no
availability, the date was in the past, or something else.

## 11. Booking Form per Result

For this task the idea is to let the user enter a date and number of
people for each booking, rather than using the hard coded values from
earlier tasks.

Since each result in ResultsComponent already has a Book button, I will
add a date input and a number input next to each button. I will use an
HTML date picker (type=\"date\") and a number input with a minimum of 1
for the people count. Each result needs its own inputs so the user can
pick different dates and people counts per accommodation.

Before sending the fetch, I will convert the date from the YYYY-MM-DD
format the date picker returns into the YYMMDD format the database
expects. I also need to make sure the date is filled in before sending,
otherwise the server will return a 400 error for missing fields.

All the error handling from Task 10 will still apply here since the
booking function already reads the specific error from the JSON
response.

# Part H --Middleware, DAOs, Controllers and Routers

To improve the structure of my Express server I will refactor it to use
the MVC pattern covered in week 9. Right now everything sits inside
server.ts which works but is not very modular or reusable.

The first thing I will do is move the database connection into its own
module db.ts so it can be shared across the server without being
initialised multiple times. Then I will create a dao folder containing
classes for each table I need to interact with, including
AccommodationDao, UserDao, and BookingDao. Each DAO handles all the SQL
for its table, keeping the messy queries in one place.

On top of the DAOs I will add a controllers folder with controller
classes that sit between the routes and the DAOs. The controllers call
the DAO methods and format the results for the client, handling things
like HTTP status codes and JSON responses.

For the routes I will split them up into separate routers inside a
routes folder. One router for accommodation, one for authentication, and
one for bookings. Each router imports its controller and calls the
appropriate method for each route, using bind() as covered in week 9 to
preserve the this context.

I will also move the login middleware into its own middleware folder so
it can be reused and imported into server.ts cleanly. After all this
server.ts will be much shorter and just handle wiring everything
together.
