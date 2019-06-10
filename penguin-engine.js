//Basic Variable Declaration
var scene,camera,renderer,controls,ambientLight,gridHelper,spotLight,light,directionalLight,loader,Object,mirror;
var screen;
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
    video = document.getElementById( 'video' );
    video.play();
    vtex = new THREE.VideoTexture( video );
    vtex.wrapS = THREE.RepeatWrapping;
    vtex.wrapT = THREE.RepeatWrapping;
    //vtex.flipY = false
    vtex.center = new THREE.Vector2( 0.5, 0.5 );
    //vtex.rotation= 1.5708
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
    mirror = new THREE.Reflector( geometry, {
        clipBias: 0.003,
        textureWidth:  window.innerWidth * window.devicePixelRatio,
        textureHeight: window.innerHeight * window.devicePixelRatio,
        color: 0x777777,
        recursion: 1
    } );
    mirror.position.y = -0.01;
    mirror.rotateX( - Math.PI / 2 );
   // scene.add( mirror );
    //ambientLight = new THREE.AmbientLight( 0x404040 ); // soft white light
    //scene.add( ambientLight );
    var size = 500;
    var divisions = 400;
    gridHelper = new THREE.GridHelper( size, divisions );
    scene.add( gridHelper );
    loader = new THREE.GLTFLoader();
    loadScene();
        /*
    debug box
    */
   var geometry = new THREE.BoxGeometry( 1.7, 1.7, 1.7 );
   var material = new THREE.MeshBasicMaterial( {map:vtex} );
   screen = new THREE.Mesh( geometry, material );
   screen.position.set(0, 1, 0);
   scene.add( screen );
    window.addEventListener( 'resize', onWindowResize, false );
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
            scene.add(object);
        },
        function ( xhr ) {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },function(error){
        console.error(error);
        }
    );
}
init();
animate();