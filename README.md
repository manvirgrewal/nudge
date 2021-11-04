# nudge
social group app - send nudges to your friends and family

![IMG_4493_iphone12black_portrait](https://user-images.githubusercontent.com/3681651/140435102-50735eee-0a3d-46c4-a2e1-4c623e35592a.png
![IMG_4495_iphone12black_portrait](https://user-images.githubusercontent.com/3681651/140435131-8cee9d28-c269-45e9-aec6-a85833db1113.png)
)

# instructions:

1. cd into backend and run the following:
 - npm init
 - npm start

2. open a new terminal and run the following: 
 - npm install ngrok -g
 - ngrok
 - copy the forwarding link and replace the one in ./frontend/api/linker.js

3. open a new terminal, cd into frontend, and run the following:
 - npm init
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
