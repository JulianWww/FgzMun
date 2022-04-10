# Event Editing

The software allows for creation, editing and displays of custom events using freebases fire-store database.  In order to create or edit events you must login to your Firebase database using the admin login. Once logged in got the Firestore Database. If there is no collection by the name of "events", Create one by clicking the "Start Collection" button and entering "events" as "Collection ID" when prompted. This will require you to create an event as described in the Add Event section, but without pressing "add document" first.

## Add Event

In order to add an event press the "add document" button. Than enter a name for your event. This name will only be used internally and not displayed on the website. You will have to define the following fields with the correct data type. 

| field    | data type | contents                                    |
|----------|-----------|---------------------------------------------|
| name     | string    | The title of your event.                    |
| text     | string    | A text describing your event in more detail |
| location | string    | where the event is supposed to take place   |
| time     | timestamp | when the event is supposed to take place    |

Make sure the names are correct and that there is no leading or trailing white space. click save and you are done.
## Edit Events
In order to edit events navigate to "events/your event", where "your event" is the internal name of your event. Than double click on the field you wish to modify and change the value as you wish.

## Delete Events

In order to delete events navigate to "events/your event", where "your event" is the internal name of your event. Than click the three dots on the top left and than "Delete document".
