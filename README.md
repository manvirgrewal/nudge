# nudge
social group app - send nudges to your friends and family

![IMG_4493_iphone12black_portrait](https://user-images.githubusercontent.com/3681651/140435585-a9adda0f-1217-44f5-a296-9f5285130a2a.png)
![IMG_4495_iphone12black_portrait](https://user-images.githubusercontent.com/3681651/140435590-a47224a5-377a-4971-99f7-a5b03931ceab.png)


# instructions:

1. cd into backend and run the following:
 - npm init
 - npm install (grab the dependancies as per config; use sudo if OS perms arent already super)
 - npm start (may have to update the mongodb URI within index.js (the mongodb atlas free tier cluster gets paused after a certain amount of time))

2. open a new terminal and run the following: 
 - npm install ngrok -g (may have to run it as sudo npm ... if ur OS permissions are different)
 - signup/login for ngrok @ ngrok.com
 - follow the connect instructions shown on the website ie. ngrok config add-authtoken ...
 - run ngrok http 80
 - copy the forwarding link and replace the one in ./frontend/src/api/linker.js (ie. https://[...].ngrok-free.app)

3. open a new terminal, cd into frontend, and run the following:
 - npm init
 - npm install (grab the dependancies as per config) - may have to use sudo again depending on OS permissions
 - run npx expo init nudge
 - expo start
 - set the mode to tunnel (just in case you aren't connected to the same wifi)
 - install the expo go app on your phone
 - scan the qr code with your camera app and open the link with expo go
 - run and enjoy!

# Technologies used: 

Backend:
 bcrypt
 express 
 firebase 
 jsonwebtoken 
 lodash 
 mongoose 
 nodemon
 
Frontend:
 react native
 expo
