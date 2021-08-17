# ShareShabbat

#### Video Demo:  https://www.youtube.com/watch?v=00EB7Ft9Fbc&feature=youtu.be

#### Live Demo:  https://shareshabbat.herokuapp.com/

#### Description: This is a website that can help you host and customize your own jewish holiday dinners and share your traditions with friends and family. You can customize your blessings to suite your needs. You can create a private room to host your events, and share your generated room code with your friends and family so they can follow along in the ceremony.

## How it works

### This web app works using a PostgreSQL db for its database, Flask for its server side, it uses ajax calls to load dynamic asynchronous HTTP requests by sending and recieving JSON files. It also makes use of Flask SocketIO to get websocket functionality, and it also uses a Jquery validation library for dynamic validation of forms and also uses the Flatpickr library as a workaround for the lack of datetime local html tag support in Safari.

### Ajax calls:

#### The app makes several ajax calls throughout its code: the first of which appearing when you register as a new user. There is a remote email validation checker that sends in your email input as you type it to the server. From there it checks your email with the emails registered in the database and if your email already exists, it will return false back to the validation.js file.

There is also an ajax call when you go into the blocks tab of the website, once you click on one of the 'bless block' cards in the 'blocks' section the website will send an ajax call with a JSON including the 'bless block' id to the server. From there the server will gather that information and create a JSON object with all of the 'bless block' information back to the client. Once the ajax function is complete, it will pull up a modal with all of the newly loaded information.

On that same section there is a separate ajax call made for deletion of a 'bless block'. The client ajax call sends the id of the selected 'bless block' and the server deletes it off the database.

There is a final ajax call in the 'Blocks' for creating a new 'bless block'. A user creates a custom 'Bless Block' in a multistep form in a modal, and once he or she clicks 'create' the information is sent over to the server with an ajax call where it is processed into the database and registered as a new block on that user's account.

The next ajax calls exist in the Rooms tab. Very similar to the Blocks section, in the Room section there is an ajax call for viewing room information on selection, deleting a selected room, and creating a room. There is one additional ajax call used to gather up all of the 'bless blocks' that exist under the user's account and load them into a form.

### Websockets:

#### The app makes use of websockets when hosting and joining a room. Based on whether a user is acting as a host or a guest he/she will recieve different information. Hosts control what section their guests see at any given time. They are the ones triggering most of the information throughout the hosting session. The guests can only recieve information and click on buttons that only affect themselves.

The first websocket information sent is when any user connects to the room. Each person will see the name of the new connected user flash on their screen for a few seconds.

When the host clicks the 'Start' button the 'start' information is emitted to the host and guests.

The next and subsequent websocket information sent is that from the host, whenever the host selects one of their registered 'bless block' all of the information is dynamically loaded into everyone's views replacing what they were previously viewing and reseting their selection back to 'Hebrew' from wherever they were.

Once the host presses the 'End' button, websocket information is emitted to all connected expressing that the session has ended, every guest who is logged in also recieves information about the host's custom used 'Bless Blocks' and from there they can choose to copy the blessings from the host into their own database. Finally an ajax call is sent to the server from the host, deleting the current room off of their database.

### Files and Folders:

#### The important files and folders for this app are:

The static folder (where image folder and script folder are kept), the templates folder (where all website views are kept), an application.py file, that houses the main Flask server application, and a helpers.py folder that does small things like the apology page from CS50 Finance, and a random code generator for creating unique codes for the custom rooms.

### Design Choices:

#### Initially I had the 'create room' and 'create bless' running in their own html file, but I realized that this made the website feel clunky and disjointed. I believe in trying to make a design that is coherent and has as little friction as possible. That's why I went with a modal multistep function for those two functionalities in the end as I believe that still keeps the user in the same context allowing them to feel more connected to what they're doing.

I knew for the `join_room.html` file that I would have to use websockets, after researching into that, long polling, short polling, and some other solutions. For me Flask socket IO was the best decision because it allowed me to make very fast requests and update users immediately. I learned a lot about websockets and I feel a lot more comfortable because of it.

I initially had heavily relied on bootstrap styling when first creating this web app, but as I got the functionality down closer and closer to what I had initially imagined, the bootstrap design started getting in the way of how I wanted the website to look. That's when I redesigned the website outline in Figma and from there, I attempted to translate the static figma work back into a responsive website.

I'm mostly happy with how it turned out, it looks and functions very close to what I had initially imagined for it when I first planned out this web app.

Knowing what I know now, if there's anything I would have done differently about this, I would have planned the CSS in advanced to make it more friendly with mobile (maybe by relying only on flexbox or grid), I would have used cleaner ajax calls, and I would have seperated the application.py files into multiple parts (ie: db models, main functionality, etc).
