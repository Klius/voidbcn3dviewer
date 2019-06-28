//Basic Variable Declaration
var scene,camera,renderer,controls,ambientLight,gridHelper,spotLight,light,directionalLight,loader,Object,mirror;
var screen;
var group;
var computer = {on:false}
var videos = [];
var vtexs = [];
//Controls
var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var prevTime = performance.now();
var velocity = new THREE.Vector3();
var direction = new THREE.Vector3();
var vertex = new THREE.Vector3();
var crosshair;
function init(){
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x000000 );
    scene.fog = new THREE.FogExp2( 0x000000, 0.0055)//0.0050 );
    camera = new THREE.PerspectiveCamera(75,window.innerWidth/ window.innerHeight,0.1,1000);
    camera.position.set(-0.057766778068525766,0.845400243664275,-5.389125287906793 );// Set position like this
    camera.lookAt(new THREE.Vector3(0,0,0)); // Set look at coordinate like this
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    var size = 100;
    var divisions = 200;
    gridHelper = new THREE.GridHelper( size, divisions );
    scene.add( gridHelper );
    //CONTROLS
    document.getElementById("viewport").appendChild( renderer.domElement );
    controls = new THREE.PointerLockControls( camera );//new THREE.OrbitControls(camera,renderer.domElement);
    document.getElementById("viewport").addEventListener( 'click', function () {
        controls.lock();
    }, false );
    controls.addEventListener( 'lock', function () {
        prevTime = performance.now();
    } );
    controls.addEventListener( 'unlock', function () {
        
    } );
    scene.add(controls.getObject());
    var onKeyDown = function ( event ) {
        switch ( event.keyCode ) {
            case 38: // up
            case 87: // w
                moveForward = true;
                break;
            case 37: // left
            case 65: // a
                moveLeft = true;
                break;
            case 40: // down
            case 83: // s
                moveBackward = true;
                break;
            case 39: // right
            case 68: // d
                moveRight = true;
                break;
            case 32: // space
                if ( canJump === true ) velocity.y += 350;
                canJump = false;
                break;
        }
    };
    var onKeyUp = function ( event ) {
        switch ( event.keyCode ) {
            case 38: // up
            case 87: // w
                moveForward = false;
                break;
            case 37: // left
            case 65: // a
                moveLeft = false;
                break;
            case 40: // down
            case 83: // s
                moveBackward = false;
                break;
            case 39: // right
            case 68: // d
                moveRight = false;
                break;
        }
    };
    document.addEventListener( 'keydown', onKeyDown, false );
    document.addEventListener( 'keyup', onKeyUp, false );

    // controls.autoRotate = false;
    //controls.enablePan = false;
    //controls.maxDistance = 25;
    //controls.minDistance = 15;
    //controls.maxPolarAngle = 1.5;
    //controls.update();
    //VIDEOTEXTURE
    loadVideoTextures()
    /*LIGHTS*/
    ambientLight = new THREE.AmbientLight( 0x404040, 0.5 );
    scene.add( ambientLight );
    
    light = new THREE.PointLight( 0xffffff, 1, 100 );
    light.position.set( 10, 50, 0 );
    scene.add( light );
    scene.castShadow = true;
    /*
    spotLight = new THREE.SpotLight( 0xffffff ,1);
    spotLight.position.set( 0, 50, 0 );
    spotLight.intensity = 1;
    spotLight.angle = 0.50;
    spotLight.decay = 2;
    spotLight.penumbra = 0.75;
    spotLight.castShadow = true;
    */
    light.shadow.mapSize.width = 512;
    light.shadow.mapSize.height = 512;
    light.shadow = new THREE.LightShadow(new THREE.PerspectiveCamera(60, 1, 1, 2500));//without this there are no shadows\\*0 /
    scene.add( light );
    lightHelper = new THREE.PointLightHelper( light );
    scene.add( lightHelper );

    /*
    Directional Light
    */
    directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
    directionalLight.position = camera.position;
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    /*
        MIRROR
    */
    var geometry = new THREE.CircleBufferGeometry( 40, 64 );
 /*   mirror = new THREE.Reflector( geometry, {
        clipBias: 0.003,
        textureWidth:  window.innerWidth * window.devicePixelRatio,
        textureHeight: window.innerHeight * window.devicePixelRatio,
        color: 0x777777,
        recursion: 1
    } );
    mirror.position.y = -0.01;
    mirror.rotateX( - Math.PI / 2 );
    scene.add( mirror );
    *///ambientLight = new THREE.AmbientLight( 0x404040 ); // soft white light
    //scene.add( ambientLight );
    //NESTOR DEBUGS, NESTOR FIXES
    var spriteMap = new THREE.TextureLoader().load( "textures/uspotter.png" );
    var spriteMaterial = new THREE.SpriteMaterial( { map: spriteMap, color: 0xffffff } );
    crosshair = new THREE.Sprite( spriteMaterial );
    crosshair.scale.set(0.02,0.02,1)
    var crosshairPercentX = 50;
    var crosshairPercentY = 50;
    var crosshairPositionX = (crosshairPercentX / 100) * 2 - 1;
    var crosshairPositionY = (crosshairPercentY / 100) * 2 - 1;

    crosshair.position.x = crosshairPositionX * camera.aspect;
    crosshair.position.y = crosshairPositionY;
    crosshair.position.z = -0.3;
    camera.add( crosshair );
    
    loader = new THREE.GLTFLoader();
    loadScene();
    /*
    Monitor Screen
    */
   var geometry = new THREE.BoxGeometry( 1.7, 1.7, 1 );
   var material = new THREE.MeshBasicMaterial( {map:vtex} );
   screen = new THREE.Mesh( geometry, material );
   screen.position.set(0, 1.4, -0.3);
   screen.scale.z=0.1
   screen.name="display";
   //group
   group = new THREE.Group();
   group.add(screen);
   scene.add( group );
    window.addEventListener( 'resize', onWindowResize, false );
    window.addEventListener( "mousedown", onDocumentMouseClick, false );
}
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
}
function animate() {
    requestAnimationFrame( animate );
    //animation stuff goes here
    move();
    directionalLight.position.copy( camera.position );
    renderer.render( scene, camera );
}
function move(){
    if ( controls.isLocked === true ) {
        var objects = [];
        raycaster.ray.origin.copy( controls.getObject().position );
         var intersections = raycaster.intersectObjects( objects );
        var onObject = intersections.length > 0;
        var time = performance.now();
        var delta = ( time - prevTime ) / 1000;
        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;
        velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
        direction.z = Number( moveForward ) - Number( moveBackward );
        direction.x = Number( moveLeft ) - Number( moveRight );
        direction.normalize(); // this ensures consistent movements in all directions
        if ( moveForward || moveBackward ) velocity.z -= direction.z * 100.0 * delta;
        if ( moveLeft || moveRight ) velocity.x -= direction.x * 100.0 * delta;
        if ( onObject === true ) {
            velocity.z = Math.max(0,velocity.z);
            velocity.x = Math.max(0,velocity.x);
            canJump = true;
        }
        controls.getObject().translateX( velocity.x * delta );
        controls.getObject().position.y += ( velocity.y * delta ); // new behavior
        controls.getObject().translateZ( velocity.z * delta );
        if ( controls.getObject().position.y < 1 ) {
            velocity.y = 0;
            controls.getObject().position.y = 1;
            canJump = true;
        }
        prevTime = time;
    }
}
function loadScene(){
    loader.load(
        "http://127.0.0.1:8000/models/monitor-test.glb", //models/monitor-test.glb",
        function(gltf){
            //gltf.scene.name = objects[obj].name;
            gltf.scene.traverse( ( o ) => {
                if( o.isMesh){
                    console.log("adding shadows");
                    o.castShadow = true;
                    o.receiveShadow = false;
                    o.material.fog = false;
                }
            });
            object = gltf.scene
            group.add(object);
        },
        function ( xhr ) {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },function(error){
        console.error(error);
        }
    );
}
function loadVideoTextures(){
    videoNames = ["video-boot","video-ashes"]
    for(i=0;i<videoNames.length;i++){
        video = document.getElementById( videoNames[i] );
        vtex = new THREE.VideoTexture( video );
        vtex.wrapS = THREE.ClampToEdgeWrapping;
        vtex.wrapT = THREE.ClampToEdgeWrapping;
        vtex.center = new THREE.Vector2( 0.5, 0.5 );
        videos.push(video);
        vtexs.push(vtex);
    }
}
//raycasting

var INTERSECTED = null;
var raycaster = new THREE.Raycaster();
var mouseVector = new THREE.Vector3();
function onDocumentMouseClick( event ) {
    event.preventDefault();    
    var intersects = getIntersects( );
		if ( intersects.length > 0 ) {
				//if ( INTERSECTED ) INTERSECTED.material.color.setHex( 0xffffff  );//reset older intersected
                INTERSECTED = intersects[ 0 ].object;
                console.log(INTERSECTED);
			    //INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();

                //INTERSECTED.material.color.setHex( 0xffff00 );
                if (INTERSECTED.name == "powerbutton"){
                    showDisplay();
                }
                else if(INTERSECTED.name=="display"){
                    startVideo();
                }
                else if(INTERSECTED.name =="mouse" ){
                    grab(INTERSECTED);
                }
            }

}
function getIntersects() {
    var pos = THREE.Vector3();
    var dir = THREE.Vector3();
    raycaster.set(     camera.getWorldPosition(pos), camera.getWorldDirection(dir) );
	return raycaster.intersectObjects( group.children,true);
}
function showDisplay(){
    if (computer.on ==false){
        var mat = new THREE.MeshBasicMaterial( {map:vtexs[0]} );
        screen.material = mat;
        screen.scale.z = 1;
        videos[0].play();
        computer.on =true;
    }else{
        computer.on = false;
        videos[1].pause();
        screen.scale.set(1,1,0.1);
    }
}
function startVideo(){
    if (computer.on){
        var mat = new THREE.MeshBasicMaterial( {map:vtexs[1]} );
        screen.material = mat;
        videos[1].play();
    }
}
function grab(object){

}
init();
animate();