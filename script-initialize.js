(function(){
  import('./scripts/mouse-input.js')
  import('./scripts/orbit-camera.js')
})();

const app = pc.Application.getApplication();

const assets = {
  cubemap: new pc.Asset(
    'cubemap',
    'cubemap',
    { url: './skybox/sky.dds' },
    './skybox/sky.json'
  ),
  duck: new pc.Asset('duck.glb', 'model', {
    url: './sketchfab_travelers_duck.glb', // ref. https://sketchfab.com/3d-models/travelers-duck-082b95b9d2a245ebaae2f2223c63bdee
  }),
};

const assetListLoader = new pc.AssetListLoader(
  Object.values(assets),
  app.assets
);

assetListLoader.load(() => {
  app.start();
  app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
  app.setCanvasResolution(pc.RESOLUTION_AUTO);
  app.scene.setSkybox(assets.cubemap.resources);
  app.scene.skyboxMip = 1;
  app.scene.skyboxIntensity = 1;

  const camera = new pc.Entity('CAMERA', app);
  camera.addComponent('camera', {
    fov: 45,
    nearClip: 0.1,
    farClip: 100000,
    clearColor: new pc.Color(0, 0, 0),
  });
  camera.setPosition(6, 3, 6);
  camera.setEulerAngles(-30, 45, 0);
  camera.setLocalScale(1, 1, 1);
  camera.addComponent('script')
  camera.script.create('mouseInput', {
    attributes: {
      orbitSensitivity: 0.3,
      distanceSensitivity: 0.18
    }
  })
  camera.script.create('orbitCamera', {
    attributes: {
      distanceMax: 0,
      distanceMin: 0,
      pitchAngleMax: 90,
      pitchAngleMin: -90,
      inertiaFactor: 0,
      frameOnStart: true,
    }
  })
  app.root.addChild(camera);

  const light = new pc.Entity('LIGHT', app);
  light.addComponent('light', {
    type: 'directional',
    color: pc.Color.WHITE,
    intensity: 0.3,
  });
  light.setPosition(10, 10, -10);
  app.root.addChild(light);

  const duckEntity = new pc.Entity();
  duckEntity.addComponent('model', {
    type: 'asset',
    asset: assets.duck,
  });
  app.root.addChild(duckEntity);
});
