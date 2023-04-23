# Eurovisualiser
A web app for entering and displaying Eurovision results

## Usage

Visiting the root of the app will display the current results. To input and update the results visit /input

## Acknowledgements

- Background image by Wil Stewart (www.unsplash.com)
- Flag images from Wikipedia

## Installation (aka here's how to update this thing next year future Ryan)

1. Firstly you need to make sure you have [node](https://nodejs.org/en/download/) installed
2. Run `npm install` in both the main project folder and the client folder
    * If you get complaints about insecurities or dependencies run `npm audit fix`
    * If it's been a really long time you may just hit problems here and it could be easier to just set up a new version of the project and copy across the scripts. Instructions on how to do that below
3. To run the server run `npm run dev` in the main folder
    * If you get an error about not having nodemon, install it globally by running `npm install -g nodemon`
4. To test the client locally, you first need to change the following section in `client/src/App.vue`:

        if(this.$route.path === '/admin') {
          socket = io.connect()
        }
        else {
          socket = io.connect()
        }
    
    to
    
        if(this.$route.path === '/admin') {
          socket = io.connect("http://localhost:3000/admin")
        }
        else {
          socket = io.connect("http://localhost:3000")
        }
        
    * Remember to change this back before you want to deploy!
5. Run the client locally by running `npm run serve` in the client folder

### Recreating the client project
If you find that the client project is just too out of date when trying to update dependencies you may find it easier to just recreate the client project. These are the steps I took last time I needed to do this:

1. Firstly backup the contents of the `client/src` and `client/public` folders
2. Delete the client folder
3. Make sure the vue cli is installed: `npm install -g @vue/cli`
4. Run `vue create client` in the main project folder. This will create a new project in the client folder
    * The original project was a Vue 2 project so ideally set up this new one as a Vue 2 project too. The cli installer should give you this option
5. Run the following in the client folder to install the required dependencies:
    * `npm install bootstrap`
    * `npm install vue-router@3` (Version 3 of vue router was the last version to work with Vue 2 so change this if you've moved to a later version of vue)
6. Replace the `client/src` and `client/public` folders with your backed up versions from earlier
7. Run `npm run serve`.
    * You may need to fix any errors because of the new versions of vue, vue-router etc
    
 