//Basic Variable Declaration
var scene,camera,renderer,controls,ambientLight,gridHelper,spotLight,light,directionalLight,loader,Object,mirror;
var screen;
var group;
var computer = {on:false}
var videos = [];
var vtexs = [];
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
    var size = 20;
    var divisions = 20;
    gridHelper = new THREE.GridHelper( size, divisions );
    scene.add( gridHelper );
    //CONTROLS
    document.getElementById("viewport").appendChild( renderer.domElement );
    controls = new THREE.OrbitControls(camera,renderer.domElement);
    controls.autoRotate = false;
    controls.enablePan = false;
    //controls.maxDistance = 25;
    //controls.minDistance = 15;
    //controls.maxPolarAngle = 1.5;
    controls.update();
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
    controls.update();
    directionalLight.position.copy( camera.position );
    renderer.render( scene, camera );
}
function loadScene(){
    loader.load(
        "models/monitor-test.glb",
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
    var intersects = getIntersects(event.layerX, event.layerY );
		if ( intersects.length > 0 ) {
				//if ( INTERSECTED ) INTERSECTED.material.color.setHex( 0xffffff  );//reset older intersected
                INTERSECTED = intersects[ 0 ].object;
			    //INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
                console.log(INTERSECTED)
                //INTERSECTED.material.color.setHex( 0xffff00 );
                if (INTERSECTED.name == "powerbutton"){
                    showDisplay();
                }
                else if(INTERSECTED.name=="display"){
                    startVideo();
                }
            }

}
function getIntersects( x, y ) {
	x = ( x / window.innerWidth ) * 2 - 1;
	y = - ( y / window.innerHeight ) * 2 + 1;
	mouseVector.set( x, y, 0.5 );
	raycaster.setFromCamera( mouseVector, camera );
	return raycaster.intersectObjects( group.children,true);
}
function showDisplay(){
    if (computer.on ==false){
        var mat = new THREE.MeshBasicMaterial( {map:vtexs[0]} );
        screen.material = mat;
        screen.scale.z = 1;
        videos[0].play()
        computer.on =true;
    }else{
        computer.on = false;
        screen.scale.z= 0.1;
    }
}
function startVideo(){
    if (computer.on){
        var mat = new THREE.MeshBasicMaterial( {map:vtexs[1]} );
        screen.material = mat;
        videos[1].play();
    }
}
init();
animate();