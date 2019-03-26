
    // setting each dot as object
    const Dot = function (xPos, yPos, color){
        // setting a variable to store "this"(the object in scope) to make it more easy to access along the code and make the code more readable
        const dot = this;
        // gravity for this dot
        // the positions, velocities and acceleration are calculated based on Kinetic Principles of Motion
        dot.gravity = 0.2;
        dot.time = 0;
        // when the dot bounce and change the direction it will conserve just a percentage of the last velocity
        dot.elasticity = 0.7;
        // the canvas edges collision detection will be turned on (true) as default, so when the dot hit the edges it will bounce
        dot.edgeCollisionStatus = true;
        // the color of the dot is set by the parameter "color" that come as an array of RGBA values
        // the join array method turn my array into a string with the values separated by a comma
        // i.e. the array [ 255, 255, 255, 255 ] become to be a string '255,255,255,255' that represents white with full opacity in RGBA spectrum
        dot.color = `rgba(${color.join()})`;
        // acceleration across the X axis, in this example it will be set as 0 because I dont want X changing
        dot.accX = 0;
        // acceleration across the Y axis, in this example it will have de same value of the gravity
        dot.accY = dot.gravity;
        // initial velocity across the X axis        
        dot.velX0 = 0;
        // velocity across the X axis, using average velocity formula
        dot.velX = (time = dot.time) => dot.velX0 + dot.accX * time;
        // initial velocity across the Y axis        
        dot.velY0 = 0;
        // velocity across the Y axis, using average velocity formula
        dot.velY = (time = dot.time) => dot.velY0 + dot.accY * time;
        // initial X position, will store the position set by the parameters
        dot.x0 = xPos;
        // X position, distance kinematic formula
        dot.x = (velX0 = dot.velX0, time = dot.time) => dot.x0 + (velX0 * time) + (dot.accX * Math.pow(time,2) / 2);
        // initial Y position, will store the position set by the parameters
        dot.y0 = yPos;
        // y position, distance kinematic formula
        dot.y = (velY0 = dot.velY0, time = dot.time) => dot.y0 + (velY0 * time) + (dot.accY * Math.pow(time,2) / 2);
        // the dot will be drawn as a arc so we need a radius
        dot.radius = 2;
        // in this example the arc will be a complete circle, so the starting angle is '0 radian' and the final will be '2PI radian'
        //if you want to learn more about drawing arcs on canvas access: https://www.w3schools.com/tags/canvas_arc.asp
        dot.startAngle = 0;
        dot.endAngle = Math.PI * 2;
        // stores the bounding coordinates for the dot
        dot.borders = {
            // as the dot moves the x and y coordinates will change and the bounding coordinates as well, so it is better if I have a method that get the actual coordinates and recalculate that for me
            top: () => dot.y() - dot.radius,
            bottom: () => dot.y() + dot.radius,
            left: () => dot.x() - dot.radius,
            right: () => dot.x() + dot.radius,
        };
        
        // this method can be called every time I want to check if some element collided with the dot.
        dot.checkCollision = obj => {
            // if the object do not have borders will need to set the borders as x and y coordinates
            const objLeft = (obj.border) ? obj.border.left : obj.x;
            const objRight = (obj.border) ? obj.border.right : obj.x;
            const objBottom = (obj.border) ? obj.border.bottom : obj.y;
            const objTop = (obj.border) ? obj.border.top : obj.y;

            // if all the following expressions are true it will return true, meaning that the object collided with the dot
            return (
                objRight >= dot.borders.left() &&
                objLeft <= dot.borders.right() &&
                objBottom >= dot.borders.top() &&
                objTop <= dot.borders.bottom()
            );
        };
        // this method calls the moving method and return true, meaning the movement was fired
        dot.startMoving = () => {
            RAF = window.requestAnimationFrame(dot.moving);
            return true;
        };
        // this method stops the Request Animation Frame (RAF) for moving, meaning that the movement stopped
        // notice that the movement stopped but all the proprieties are kept as the last time
        // to know more about RAF go to: https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
        dot.stopMoving = () => {
            window.cancelAnimationFrame(RAF);
        }
        // this method starts the dot movement
        dot.moving = () => {
            // the dot is always under acceleration effect, once we fire the time the dot will move according to the accelerations and velocities
            dot.time++;
            // the following logical operation recognizes if the dot hit the canvas edges, you can turn off this feature setting dot.edgeCollisionStatus to false
            (
                dot.edgeCollisionStatus &&
                (dot.borders.left() <= 0 || dot.borders.right() >= oCanvas.width) &&
                dot.bounce('x')
            );
            (
                dot.edgeCollisionStatus &&
                (dot.borders.top() <= 0 || dot.borders.bottom() >= oCanvas.height) &&
                dot.bounce('y')
            );
            // now I checked if the dot did not hit the canvas edge, I start the movement
            dot.startMoving();
            // the following logical operation check if the dot is moving too slow comparing the velocity when time is 6 and when time is 0, if it is too slow, we stop the movement
            (
                (Math.abs(dot.velY(6)) < 1 && Math.abs(dot.velY(0)) < 1) &&
                (Math.abs(dot.velX(6)) < 1 && Math.abs(dot.velX(0)) < 1) &&
                dot.stopMoving()
            );
        };
        // when the dot hits the canvas edges I need to invert the velocities and apply the elasticity
        dot.bounce = axis => {
            // I need to know across which axis to change the velocity it will be given to me by the moving method
            if(axis == 'y'){
                // invert the velocity across Y
                dot.velY0 = -dot.velY() * dot.elasticity;
                // we are resetting the movement so I need to store the last velocity to the remaining axis
                dot.velX0 = dot.velX();
                // to avoid errors based on floating numbers set the dot to be touching the edge as initial position
                dot.y0 = (
                    // if the new velocity is negative it means that the edge hit is the bottom one
                    (dot.velY0 < 0 && oCanvas.height - dot.radius) ||
                    // if the new velocity is positive it means that the edge hit is the top one
                    (dot.velY0 > 0 && dot.radius)
                );
            }
            if(axis == 'x'){
                // invert the velocity across X
                dot.velX0 = -dot.velX() * dot.elasticity;
                // we are resetting the movement so I need to store the last velocity to the remaining axis
                dot.velY0 = dot.velY();
                // to avoid errors based on floating numbers set the dot to be touching the edge as initial position
                dot.x0 = (
                    // if the new velocity is negative it means that the edge hit is the right one
                    (dot.velX0 < 0 && oCanvas.width - dot.radius) ||
                    // if the new velocity is positive it means that the edge hit is the left one
                    (dot.velX0 > 0 && dot.radius)
                );
            }
            // as we are resetting the movement we need to reset the time to 0 as well
            dot.time = 0;
        }

        return dot;
    };
    const Canvas = function(el) {
        // setting a variable to store "this"(the object in scope) to make it more easy to access along the code and make the code more readable
        const cv = this;
        cv.el = el;
        cv.ctx = cv.el.getContext("2d");
        cv.width = 300;
        cv.height = 300;
        cv.img = './imgs/preloader.svg';

        // the following method get the bounding rectangle around the canvas element to get its position on document
        // read more in: https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
        cv.setPos = () => {
            cv.pos = cv.el.getBoundingClientRect();
        }
        // the following method set the canvas element, applying the proprieties given above
        cv.setEl = () => {
            cv.el.width = cv.width;
            cv.el.height = cv.height;
        };
        // the following method clean all canvas
        cv.clear = () => {
            cv.ctx.clearRect(0, 0, cv.width, cv.height);
        };
        // the following method set the dots array to be used on the canvas
        cv.setDots = async () => {
            // create an empty array to push the new dots as soon they are created
            cv.dots = [];
            // to set the dots we need the imagedataURL so you need to use something like SVG images
            // notice that using the cv.setImageDataURL method you can use any format of image because the XMLHttpRequest will convert that to blob, in "responseType"
            const data = cv.ctx.getImageData(0, 0, cv.width, cv.height);
            // the following loop will "scan" the image data pixel by pixel
            // in this example I scanned the image each 6 pixels, but you can change the value to have more or less information
            for (let y = 0 ; y < data.height; y = y + 6) {
                for (let x = 0; x < data.width; x = x + 6) {
                    // each 4 data represents the RGBA for one pixel
                    // to learn more got to: https://www.w3schools.com/jsref/canvas_getimagedata.asp
                    // the following expression allow me to be sure that I am reading the RGBA of 1 pixel
                    let p = y * 4 * data.width + x * 4;
                    // the A in RGBA represents the opacity (0 to 255) of that pixel and I want any pixel that is not transparent (A > 0)
                    if (data.data[p + 3] > 0) {
                        const colorRGBA = [
                            data.data[p],
                            data.data[p + 1],
                            data.data[p + 2],
                            data.data[p + 3]
                        ];
                        // now that I have the color information I can create my dot object storing the x and y coordinates and the RGBA color
                        const particle = new Dot(x, y, colorRGBA )
                        // just for the canvas use I want the objects to have a clientCollided property and I will set to be false as default
                        particle.clientCollided = false;
                        // now I push the dot object to my array
                        cv.dots.push(particle);
                    }
                }
            }
        };
        cv.draw = () => { 
            cv.dots.forEach( dot => {
                cv.ctx.fillStyle = dot.color;
                cv.ctx.beginPath();
                cv.ctx.arc(dot.x(), dot.y(), dot.radius, dot.startAngle, dot.endAngle);
                cv.ctx.fill();
            });
        };
        // the following method will render the information of the canvas to start the animation
        cv.render = () => {
            // before we draw the next frame we need to clear the canvas
            cv.clear();
            // now we can draw the new frame
            cv.draw();
            window.requestAnimationFrame(cv.render);
        };
        cv.init = async () => {
            cv.setEl();           
            // to use images from URL paths you can comment the cv.placeImage method and use the method bellow it
            // using the URL method you can face CORS origin issues
            cv.placeImage();
            // cv.setImageDataURL( [place the image URL here] );

            // setting the timeout to execute the setDots to be sure that the image were placed before we try to read the data
            setTimeout(cv.setDots, 300);
            // with the dots set we can start to render
            setTimeout(cv.render, 310);
        };

        // the following method loop over each dot and ask the dot to check for collision based on client position
        checkClientCollision = client => {
            cv.dots.forEach( dot => {
                // to not run the checkCollision method unnecessarily I check if the clientCollided property still false
                if(!dot.clientCollided){
                    //now I check for collisions
                    if(dot.checkCollision(client)){
                        // If I have a collision the dot should start to move and the clientCollision now is true
                        dot.clientCollided = dot.startMoving(); // startMoving returns true when fired
                    }
                }
            });
        };

        cv.placeImage = (imageDATA = cv.img) => {
            var img = new Image();
            img.src = imageDATA;

            const drawImage = () => {
                const imgHeight = (
                    (img.height >= img.width && cv.height)||
                    ((cv.width/img.width) * img.height)
                );
                const imgWidth = (
                    (img.width >= img.height && cv.width)||
                    ((cv.height/img.height) * img.width)
                );
                const imgMarginX = (cv.width - imgWidth) / 2;
                const imgMarginY = (cv.height - imgHeight) / 2;
                
                cv.ctx.drawImage(img, imgMarginX, imgMarginY, imgWidth, imgHeight);
            };
            
            img.addEventListener( 'load', drawImage);
        }

        // this method allow me to get the images dataURL from their path
        cv.setImageDataURL = (path) => {
            // to learn more about how to use XMLHttpRequest go to https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
            const httpRequest = new XMLHttpRequest();
            httpRequest.open('GET', path);
            httpRequest.responseType = 'blob';
            httpRequest.onload = () => {
                const fileReader = new FileReader();
                fileReader.readAsDataURL(httpRequest.response);
                fileReader.onloadend = async function () {
                    try {
                        cv.img = fileReader.result.toString();
                        cv.placeImage();
                    }
                    catch (err) {
                        console.log(`Error: ${err}`);
                    }
                };
            };
            httpRequest.send();
        };
        // This method set the client X and Y coordinates
        cv.setClient = (clientX, clientY) => {
            // to set the client coordinates and compare with the canvas coordinates I set the canvas position again just to be sure that the coordinates didn't change
            cv.setPos();
            // now I return the client set
            return {
                x: clientX - cv.pos.left - scrollX,
                y: clientY - cv.pos.top - scrollY
            };
        };

        // EVENTS
        // when the client moves over the canvas I want to check for collisions
        cv.el.addEventListener('mousemove', e => {
            const client = cv.setClient( e.clientX, e.clientY);
            checkClientCollision(client);
        });
        cv.el.addEventListener('touchmove', e => {
            const client = cv.setClient( e.touches[0].clientX, e.touches[0].clientY);
            checkClientCollision(client);
        });

        return cv;
    };
    
    const canvas = document.getElementById("my-canvas");
    const oCanvas = new Canvas(canvas);
    oCanvas.init();
