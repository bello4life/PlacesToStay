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
