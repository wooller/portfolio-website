var canvas = document.querySelector('#scene');
var width = canvas.offsetWidth,
    height = canvas.offsetHeight;

var renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.setSize(width, height);
renderer.setClearColor(0x1EA4E0);

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(100, width / height, 0.1, 10000);
camera.position.set(120, 0, 300);

var light = new THREE.HemisphereLight(0xffffff, 0x47b209, 0.6);
scene.add(light);

var light = new THREE.DirectionalLight(0x590D82, 0.5);
light.position.set(200, 300, 400); 
scene.add(light);
var light2 = light.clone();
light2.position.set(-200, 300, 400); 
scene.add(light2);

var geometry = new THREE.IcosahedronGeometry(120, 4);
for(var i = 0; i < geometry.vertices.length; i++) {
    var vector = geometry.vertices[i];
    vector._o = vector.clone();  
}
var material = new THREE.MeshPhongMaterial({
    emissive: 0xf42570, 
    emissiveIntensity: 0.4,
    shininess: 0
});
var shape = new THREE.Mesh(geometry, material);
shape.position.z = 100;
scene.add(shape);

var newShape = shape.clone();
newShape.position.x = 350;
newShape.position.y = 150;
newShape.position.z = 50;
newShape.scale = 0.5;
scene.add(newShape);

function updateVertices (a) {
    for(var i = 0; i < geometry.vertices.length; i++) {
        var vector = geometry.vertices[i];
        vector.copy(vector._o);
        var perlin = noise.simplex3(
            (vector.x * 0.006) + (a * 0.0002),
            (vector.y * 0.006) + (a * 0.0003),
            (vector.z * 0.006)
        );
        var ratio = ((perlin*0.4 * (scroll.y+0.1)) + 0.8);
        vector.multiplyScalar(ratio);
    }
    geometry.verticesNeedUpdate = true;
}

function render(a) {
    requestAnimationFrame(render);
    updateVertices(a);
    renderer.render(scene, camera);
}

function onResize() {
    canvas.style.width = '';
    canvas.style.height = '';
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();  
    renderer.setSize(width, height);
}

var scroll = new THREE.Vector2(0.8, 0.5);
function onScroll(e) {
  console.log(window.scrollY);
  var scrollY;
  if (window.scrollY > 1000){
    scrollY = 1000
  }else {
    scrollY = window.scrollY
  }
    TweenMax.to(scroll, 0.8, {
        y: (scrollY / height),
        x : (scrollY / width),
        ease: Power1.easeOut
    });
}

requestAnimationFrame(render);
window.addEventListener("scroll", onScroll);
var resizeTm;
window.addEventListener("resize", function(){
    resizeTm = clearTimeout(resizeTm);
    resizeTm = setTimeout(onResize, 200);
});