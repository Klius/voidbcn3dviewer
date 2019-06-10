var objects ={
				'table':{
					'name':'table',
					'src':'assets/models/03/table/scene.gltf',
					'addGround':true,
					'groundPos':  new THREE.Vector3( 0, -1, 5 ),
					'castShadow': true,
					'colorMaterial':'Wood',
					'materials':{
						wood:{
							'src':'assets/models/03/table/textures/Wood_baseColor.jpeg'
						},
						zebra:{
							'src':'assets/models/03/table/textures/Wood_zebraColor.jpeg'
						},
						'void':{
							'src':'assets/models/03/table/textures/tile-void.png'
						},
						weird:{
							'src':'assets/models/03/table/textures/weird-wood.png'
						},
						granite:{
							'src':'assets/models/03/table/textures/granite.png'
						}
					}
				},
				'car':{
					'name':'car',
					'src':'assets/models/03/car/scene.gltf',
					'addGround':true,
					'castShadow': true,
					'groundPos' :  new THREE.Vector3( 0, 0, 5 ),
					'objectScale': new THREE.Vector3( 2, 2, 2 ),
					'colorMaterial':'Carro1',
					'secondMaterial':'Superior',
					'materials':{
						'none':{
							'src':'assets/models/03/car/textures/none.png'
						},
						'void':{
							'src':'assets/models/03/car/textures/tile-void.png'
						},
						zebra:{
							'src':'assets/models/03/table/textures/Wood_zebraColor.jpeg'
						},
					},
					'secondaryMaterials':{
						'none':{
							'src':'assets/models/03/car/textures/none.png',
							'roughnessMap':'assets/models/03/car/textures/black_matte_metallicRoughness.png'
						},
						metallic:{
							'src':'assets/models/03/marbleTable/textures/metallic.png',
							'roughnessMap':'assets/models/03/marbleTable/textures/metallic_metallicRoughness.png'
						}
					}
				},
				marbleTable:{
					'name':'marbleTable',
					'src':'assets/models/03/marbleTable/scene.gltf',
					'addGround':true,
					'castShadow': true,
					'groundPos' :  new THREE.Vector3( 0, -4, 0 ),
					'objectScale': new THREE.Vector3( 0.04, 0.04, 0.04 ),
					'colorMaterial':'marble',
					'secondMaterial':'wood',
					'materials':{
						'marble':{
							'src':'assets/models/03/marbleTable/textures/marble_baseColor.jpeg',
							'roughnessMap':'assets/models/03/marbleTable/textures/marble_metallicRoughness.png',
							'normalMap':'assets/models/03/marbleTable/textures/marble_normal.png'
						},
						metallic:{
							'src':'assets/models/03/marbleTable/textures/metallic.png',
							'roughnessMap':'assets/models/03/marbleTable/textures/metallic_metallicRoughness.png',
							'normalMap':'assets/models/03/marbleTable/textures/metallic_normal.png'
						},
						granite:{
							'src':'assets/models/03/marbleTable/textures/granite.png',
							'roughnessMap':'assets/models/03/marbleTable/textures/granite_roughnessMap.png',
							'normalMap':'assets/models/03/marbleTable/textures/granite_normal.png'
						}
					},
					'secondaryMaterials':{
						'wood':{
							'src':'assets/models/03/marbleTable/textures/wood_baseColor.jpeg',
							'roughnessMap':'assets/models/03/marbleTable/textures/wood_metallicRoughness.png',
							'normalMap':'assets/models/03/marbleTable/textures/wood_normal.png'
						},
						'stones':{
							'src':'assets/models/03/marbleTable/textures/stones.png',
							'roughnessMap':'assets/models/03/marbleTable/textures/stones_roughnessMap.png',
							'normalMap':'assets/models/03/marbleTable/textures/stones_normal.png'
						},
						metallic:{
							'src':'assets/models/03/marbleTable/textures/metallic.png',
							'roughnessMap':'assets/models/03/marbleTable/textures/metallic_metallicRoughness.png',
							'normalMap':'assets/models/03/marbleTable/textures/metallic_normal.png'
						}
					}
				},
				amplifier:{
					'name':'amplifier',
					'src':'assets/models/03/amplifier/scene.gltf',
					'addGround':true,
					'castShadow': true,
					'groundPos' :  new THREE.Vector3( 0, -7, 0 ),
					'objectScale': new THREE.Vector3( 50, 50, 50 ),
					'colorMaterial':'skin',
					'secondMaterial':'Tela',
					'materials':{
						'stones':{
							'src':'assets/models/03/marbleTable/textures/stones.png',
							'roughnessMap':'assets/models/03/marbleTable/textures/stones_roughnessMap.png',
							'normalMap':'assets/models/03/marbleTable/textures/stones_normal.png'
						},
						'none':{
							'src':'assets/models/03/car/textures/none.png',
							'roughnessMap':'assets/models/03/car/textures/black_matte_metallicRoughness.png'
						}
					},
					'secondaryMaterials':{}
				},
				room:{
					'name':'room',
					'src':'assets/models/03/room/scene.gltf',
					'addGround':true,
					'castShadow': true,
					'groundPos' :  new THREE.Vector3( 0, -0.5, 0 ),
					'colorMaterial':'fireRed_material',
					'secondMaterial':'Tela',
					'materials':{
						'stones':{
							'src':'assets/models/03/marbleTable/textures/stones.png',
							'roughnessMap':'assets/models/03/marbleTable/textures/stones_roughnessMap.png',
							'normalMap':'assets/models/03/marbleTable/textures/stones_normal.png'
						},
						'none':{
							'src':'assets/models/03/car/textures/none.png',
							'roughnessMap':'assets/models/03/car/textures/black_matte_metallicRoughness.png'
						}
					},
					'secondaryMaterials':{}
				}
			};