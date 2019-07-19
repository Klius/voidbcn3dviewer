//Basic Variable Declaration
var scene,camera,renderer,controls,ambientLight,gridHelper,spotLight,light,directionalLight,loader,Object,mirror;
var screen;
var group;
var tv = {on:false}
var vhsPlayer = {hasVHS:false,vhs:"none",playing:false,ejecting:false,stopped:false,rewind:false,forward:false};
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
//MESHES
var meshEnterVHS;
var droppingObjects = [];
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
    var spriteMaterial = new THREE.SpriteMaterial( { map: spriteMap, color: 0xffffff ,opacity:0.5} );
    crosshair = new THREE.Sprite( spriteMaterial );
    crosshair.scale.set(0.005,0.005,1)
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
        showHighlighted();
        animateDrop(delta);
    }
}

function loadScene(){
    loader.load(
        "models/vhs-test-01.glb", //models/monitor-test.glb",
        function(gltf){
            //gltf.scene.name = objects[obj].name;
            gltf.scene.traverse( ( o ) => {
                if( o.isMesh){
                    console.log("adding shadows");
                    o.castShadow = true;
                    o.receiveShadow = true;
                    o.material.fog = false;
                }
            });
            object = gltf.scene
            group.add(object);
            meshEnterVHS = object.getObjectByName("vhs_enter");

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
var HIGHLIGHTED = null;
var GRABBED = null;
var objVelocityY = 0;
var objDroping = false;
var INTERSECTED = null;
var raycaster = new THREE.Raycaster();
raycaster.near = 0;
raycaster.far = 4.0;
function onDocumentMouseClick( event ) {
    console.log(event);
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
                    else if(INTERSECTED.name=="playbutton"){
                        startVideo();
                    }
                    else if(INTERSECTED.name=="stopbutton"){
                        stopVideo();
                    }
                    else if(INTERSECTED.name =="video-ashes" ){
                        if (event.buttons == 1){
                            grab(INTERSECTED);
                        }
                    }
                    else if((INTERSECTED.name =="vhs_enter") &&(event.buttons == 1)){
                        enterVHS();
                    }
                    else if(INTERSECTED.name =="ejectbutton"){
                        ejectVHS();
                    }
        }
        if (GRABBED != null && event.buttons != 1){
            drop();
        }

}
function showHighlighted(){
    var intersects = getIntersects( );
    if ( intersects.length > 0 ) {
            if (intersects[0].object.name != "display"){
                if (HIGHLIGHTED == null){
                    HIGHLIGHTED = intersects[0].object;
                    HIGHLIGHTED.material.emissive = new THREE.Color( 0xffffff );
                    HIGHLIGHTED.material.emissiveIntensity = 0.02;
                }
                if(HIGHLIGHTED != intersects[0].object){
                    HIGHLIGHTED.material.emissive = new THREE.Color( 0x000000 );
                    HIGHLIGHTED.material.emissiveIntensity = 1;
                    HIGHLIGHTED = intersects[0].object;
                    HIGHLIGHTED.material.emissive = new THREE.Color( 0xffffff );
                    HIGHLIGHTED.material.emissiveIntensity = 0.02;
                }
            }
    }
    else if(HIGHLIGHTED != null){
        HIGHLIGHTED.material.emissive = new THREE.Color( 0x000000 );
        HIGHLIGHTED.material.emissiveIntensity = 1;
        HIGHLIGHTED = null;
    }
}
function getIntersects() {
    var pos = THREE.Vector3();
    var dir = THREE.Vector3();
    raycaster.set(     camera.getWorldPosition(pos), camera.getWorldDirection(dir) );
	return raycaster.intersectObjects( group.children,true);
}
function getVideoFromId(id){
    var videoId = 0;
    for(i=0;i<videos.length;i++){
        if (videos[i].id == id)
        {
            videoId = i;
            break;
        }
    }
    return videoId
}
/***************************
 * ACTIONS
 ***************************/
function showDisplay(){
    if (tv.on ==false){
        if (vhsPlayer.hasVHS && vhsPlayer.playing){
            var vid = getVideoFromId(vhsPlayer.vhs.name);
            videos[vid].volume = 1;
        }
        else{
            var mat = new THREE.MeshBasicMaterial( {map:vtexs[0]} );
            screen.material = mat;
            screen.scale.z = 1;
            videos[0].play();
        }
        tv.on =true;
        screen.scale.set(1,1,1);
    }else{
        tv.on = false;
        if (vhsPlayer.hasVHS && vhsPlayer.playing){
            var vid = getVideoFromId(vhsPlayer.vhs.name);
            videos[vid].volume = 0;
        }
        else{
            videos[0].pause();
        
        }
        screen.scale.set(1,1,0.1);
    }
}
function startVideo(){
    if (vhsPlayer.hasVHS){
        videos[0].pause();
        var vid = getVideoFromId(vhsPlayer.vhs.name);
        var mat = new THREE.MeshBasicMaterial( {map:vtexs[vid]} );
        screen.material = mat;
        if(tv.on){
            videos[vid].volume = 1;
        }else{
            videos[vid].volume = 0;
        }
        videos[vid].play();
        vhsPlayer.playing = true;
    }
}
function stopVideo(){
    if (vhsPlayer.hasVHS && vhsPlayer.playing){
        var vid = getVideoFromId(vhsPlayer.vhs.name);
        videos[vid].pause();
        videos[vid].volume = 0;
        var mat = new THREE.MeshBasicMaterial({map:vtexs[0]});
        screen.material = mat;
        videos[0].volume = 1;
        videos[0].play();
        vhsPlayer.playing = false;
        vhsPlayer.stopped = true;
    }
}
function enterVHS(){
    if ((GRABBED != null)&& (vhsPlayer.hasVHS ==false )){
        vhsPlayer.hasVHS = true;
        vhsPlayer.vhs = GRABBED ;
        camera.remove(GRABBED);
        GRABBED.position.copy(meshEnterVHS.position);
        group.remove(meshEnterVHS);
        GRABBED.material.opacity = 1;
        GRABBED.material.transparent = false;
        GRABBED.rotateX(90 * (Math.PI / 180));
        scene.add(GRABBED);
        GRABBED = null;
    }
}
function ejectVHS(){
    if(vhsPlayer.hasVHS ){
        var vid = getVideoFromId(vhsPlayer.vhs.name);
        if (vhsPlayer.playing){
            videos[vid].pause();
        }
        vhsPlayer.stopped = false;
        vhsPlayer.playing = false;
        vhsPlayer.rewind  = false;
        vhsPlayer.forward = false;
        vhsPlayer.vhs.position.z = -1.4;
        group.add(vhsPlayer.vhs)
        droppingObjects.push(vhsPlayer.vhs);
        vhsPlayer.vhs = null;
        vhsPlayer.hasVHS = false;        

        var mat = new THREE.MeshBasicMaterial( {map:vtexs[0]} );
        screen.material = mat;
        if ( tv.on ){
            videos[0].play();
            videos[0].volume = 1;
        }


    }
}
function grab(object){
    if((GRABBED == null)){
        //removeFromDropping(object);
        GRABBED = object;
        var objPercentX = 70;
        var objPercentY = 35;
        var objPositionX = (objPercentX / 100) * 2 - 1;
        var objPositionY = (objPercentY / 100) * 2 - 1;

        GRABBED.position.x = objPositionX * camera.aspect;
        GRABBED.position.y = objPositionY;
        GRABBED.position.z = -0.9;
        GRABBED.rotateX(-90 * (Math.PI / 180));
        GRABBED.material.opacity = 0.9;
        GRABBED.material.transparent = true;
        camera.add( GRABBED );
        //Add overlay to enter vhs
        group.add(meshEnterVHS);
    }
}
function drop(){
    camera.remove(GRABBED);
    GRABBED.rotateX(90 * (Math.PI / 180));

    GRABBED.position.set(camera.getWorldPosition().x,camera.getWorldPosition().y,camera.getWorldPosition().z);// + camera.getWorldDirection().x)/2;
    GRABBED.position.x += camera.getWorldDirection().x;
    GRABBED.position.y += camera.getWorldDirection().y;
    GRABBED.position.z += camera.getWorldDirection().z;
    GRABBED.material.opacity = 1;
    GRABBED.material.transparent = false;
    group.add(GRABBED);
    objDroping = true;
    droppingObjects.push(GRABBED);
    GRABBED = null;
    group.remove(meshEnterVHS);
}
function animateDrop(delta){
    if (droppingObjects.length > 0){
        objVelocityY -= 9.8 * 10.0 * delta;
        for (i=0;i<droppingObjects.length;i++){
            droppingObjects[i].position.y += ( objVelocityY * delta );
            if ( droppingObjects[i].position.y < 0.1 ) {
                //objVelocityY = 0;
                droppingObjects[i].position.y = 0.1;
                droppingObjects.splice(i,1);
            }
        }
    }
    else{
        objVelocityY = 0;
    }
}
function removeFromDropping(obj){
    for (i=0;i<droppingObjects.length;i++){
        if (obj === droppingObjects[i]){
            droppingObjects.splice(i,1);
        }
    }
}
function uniformScale(obj,inc){
    obj.scale.x += inc;
    obj.scale.y += inc;
    //obj.scale.z += inc;
}
init();
animate();