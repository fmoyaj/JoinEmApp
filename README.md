# Join'Em

Join’em is a React web app where users can organize events and vote for their favorite events that other users have planned. Currently, the Join’em interface supports administrator-only use, and it has two main views: the administrator view and the member view.

Interested in trying the app? Visit: https://fmoyaj.github.io/JoinEmApp/ You can create users and events, as well as become any member using the bar navigation. Do you want to try loading a sample database (JSON file)? Download this sample JSON in this repository and upload it to the app!

## Navigation
Join’em has a navigation bar that features a dropdown button to switch between the admin and member views. An admin can become any member by clicking on their username in the dropdown menu. The currently selected user is highlighted in the member list to indicate what user profile (or admin view) is being displayed. 

## Admin View
The admin screen features a database management section on top where the admin can upload a JSON file that has information about the state of the global variables (maximum number of events that can be planned for a user, maximum number of coinem that users can use, etc.), the members list, and the events list. The admin can also use the database management panel to download the current database. 

In this testing version, we expect the administrator to upload the database every time they open the app, so we wanted to simplify that process by placing the panel at the top of the page. This way, the admin can easily load files into the app as a first step. 

We also included a table with the information on all members. Members can be removed by pressing the delete button. Both users and members can be sorted based on some criteria. We chose to use a dropdown button that highlights the criteria that is currently being used to sort. The events section is a series of cards. Aside from the event information, each card has a gray button that shows the total coinem allocated to the event. 


## Member View
The member view reflects the admin view with a few tweaks. For example, the top panel only includes how many events left that they can plan and how many coinem left that they can spend. These variables are not editable. In addition, the table to view all members is collapsable. Members can delete their own account, but to make it less likely for a member to accidentally delete their account, we placed the Delete Account button at the bottom of the page in red.  A popup also appears when the button is pressed so that the member must confirm their decision before following through with the action.

Members can give coinem to others events or edit/delete their own event. We made these actions accessible on the event cards. For events that the current member created themselves, the right side of the event card will have Edit and Delete buttons. But for events that they did not plan, they’ll see the amount of coinem they’ve given each event along with Plus and Minus buttons underneath to change the amount of coinem they’ve given.


## Future Features
If we had more time, we would have liked to add a user-readable creation timestamp to each event. Along with the creation timestamp, we would also give the option to add an event date. These two add-ons would improve the user experience because members would be able to gauge whether or not an event has expired. Events with event dates will have a clear expiration date, but for events that don’t have event dates, users can check the creation timestamp. If the event was made long ago, it probably is no longer active. One other feature on our wish list would be the capability to comment on events. This would encourage user interaction, and the communication will help users to bring their ideas to life.

