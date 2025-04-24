import {
  init as coreInit,
  RenderingEngine,
  Enums,
  StackViewport,
  registerImageLoader,
} from '@cornerstonejs/core';

import * as cornerstone from '@cornerstonejs/core';

import { init as dicomImageLoaderInit } from '@cornerstonejs/dicom-image-loader';

import {
  init as cornerstoneToolsInit,
  ToolGroupManager,
  WindowLevelTool,
  ZoomTool,
  StackScrollTool,
  PlanarRotateTool,
  PanTool,
  Enums as csToolsEnums,
  addTool,
  LengthTool,
  CircleROITool,
  BrushTool,
} from '@cornerstonejs/tools';
import loadDicomImagesFromZip from './decode';
import { loadImage } from './customImageLoader';

const defaultDiv = document.querySelector('#default');
const zoomDiv = document.querySelector('#zoom');
const rotateDiv = document.querySelector('#rotate');
const moveDiv = document.querySelector('#move');
const lengthDiv = document.querySelector('#ruler');
const highlightDiv = document.querySelector('#highlight');
const brightnessDiv = document.querySelector('#brightness');
const pencilDiv = document.querySelector('#pencil');

const content = document.getElementById('content');
const element = document.createElement('div');
element.style.width = '700px';
element.style.height = '500px';
content?.appendChild(element);

let renderingEngine: RenderingEngine;
let toolGroup: any;
const viewportId = 'CT_AXIAL_STACK';
const renderingEngineId = 'myRenderingEngine';
const toolGroupId = 'myToolGroup';

// const zipUrl = import.meta.env.VITE_DICOM_ZIP_URL;
// const imageId: string[] = await loadDicomImagesFromZip(zipUrl);

const imageIds = ['wadouri:https://storage.googleapis.com/digital-care-bucket/dicoms/e07955cf-d31d-4362-988a-6a42ffad20a9.dcm?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=digital-care-admin%40cedar-abacus-454021-a6.iam.gserviceaccount.com%2F20250423%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20250423T211946Z&X-Goog-Expires=259200&X-Goog-SignedHeaders=host&X-Goog-Signature=086d4c9d0e192519d61c98685ab650c8f78863c679c9dde750cad101bc5386b6961f1c26fa9348e0a17e171e00b1bc512b4eba86ce98fed788964561e1cb2bfb7a0501819b2d4c65e01f4959aee7a3c95a0f2a3d5a39bbbacbab3bcc7de3f9d746de0bb7c25d43615c58032a5af5f55ead3c2a9a0605089ce3f693c1749720c5d495cf31de96a8a48681d574c59952146e12641f29eb2d56947242e0f9678357e811bb8f70b35ecaa5ea784fbe2003afd4396c59441cce2dfa5b1e149f074f34c7fd896271761824abc7a8db66b2ad24c4326c9192a39822c01ce063f44a281391550ad26f7125248fdbe5370e716682655efc6d84116fbeca29400ecdaae333']

async function run() {
  coreInit();
  dicomImageLoaderInit();
  cornerstoneToolsInit();

  // imageIds.forEach((id) => {
  //   registerImageLoader('blob', loadImage);
  // });

  renderingEngine = new RenderingEngine(renderingEngineId);

  const viewportInput = {
    viewportId,
    element,
    type: Enums.ViewportType.STACK,
  };

  renderingEngine.enableElement(viewportInput);
  const viewport = renderingEngine.getViewport(viewportId) as StackViewport;

  // console.log('imageId', imageId);
  // await viewport.setStack(imageId, 0);
  await viewport.setStack(imageIds, 0);

  viewport.render();

  addTool(ZoomTool);
  addTool(WindowLevelTool);
  addTool(StackScrollTool);
  addTool(PlanarRotateTool);
  addTool(PanTool);
  addTool(LengthTool);
  addTool(CircleROITool);
  addTool(BrushTool);

  toolGroup = ToolGroupManager.createToolGroup(toolGroupId);

  toolGroup.addTool(ZoomTool.toolName);
  toolGroup.addTool(WindowLevelTool.toolName);
  toolGroup.addTool(StackScrollTool.toolName);
  toolGroup.addTool(PlanarRotateTool.toolName);
  toolGroup.addTool(PanTool.toolName);
  toolGroup.addTool(LengthTool.toolName);
  toolGroup.addTool(CircleROITool.toolName);
  toolGroup.addTool(BrushTool.toolName);

  toolGroup.addViewport(viewportId, renderingEngineId);

  setTool('default');
}

function setTool(mode: string) {
  toolGroup.setToolDisabled(ZoomTool.toolName);
  toolGroup.setToolDisabled(WindowLevelTool.toolName);
  toolGroup.setToolDisabled(StackScrollTool.toolName);
  toolGroup.setToolDisabled(PlanarRotateTool.toolName);
  toolGroup.setToolDisabled(PanTool.toolName);
  toolGroup.setToolDisabled(BrushTool.toolName);

  toolGroup.setToolPassive(LengthTool.toolName);
  toolGroup.setToolPassive(CircleROITool.toolName);

  if (mode === 'default') {
    defaultDiv?.classList.add('bg-green-400');
    zoomDiv?.classList.remove('bg-green-400');
    rotateDiv?.classList.remove('bg-green-400');
    moveDiv?.classList.remove('bg-green-400');
    lengthDiv?.classList.remove('bg-green-400');
    highlightDiv?.classList.remove('bg-green-400');
    brightnessDiv?.classList.remove('bg-green-400');
    pencilDiv?.classList.remove('bg-green-400');
    toolGroup.setToolActive(StackScrollTool.toolName, {
      bindings: [{ mouseButton: csToolsEnums.MouseBindings.Wheel }],
    });
    return;
  }

  if (mode === 'zoom') {
    defaultDiv?.classList.remove('bg-green-400');
    zoomDiv?.classList.add('bg-green-400');
    rotateDiv?.classList.remove('bg-green-400');
    moveDiv?.classList.remove('bg-green-400');
    lengthDiv?.classList.remove('bg-green-400');
    highlightDiv?.classList.remove('bg-green-400');
    brightnessDiv?.classList.remove('bg-green-400');
    pencilDiv?.classList.remove('bg-green-400');
    toolGroup.setToolActive(ZoomTool.toolName, {
      bindings: [{ mouseButton: csToolsEnums.MouseBindings.Wheel }],
    });
    return;
  }

  if (mode === 'rotate') {
    defaultDiv?.classList.remove('bg-green-400');
    zoomDiv?.classList.remove('bg-green-400');
    rotateDiv?.classList.add('bg-green-400');
    moveDiv?.classList.remove('bg-green-400');
    lengthDiv?.classList.remove('bg-green-400');
    highlightDiv?.classList.remove('bg-green-400');
    brightnessDiv?.classList.remove('bg-green-400');
    pencilDiv?.classList.remove('bg-green-400');
    toolGroup.setToolActive(PlanarRotateTool.toolName, {
      bindings: [{ mouseButton: csToolsEnums.MouseBindings.Wheel }],
    });
    return;
  }

  if (mode === 'move') {
    defaultDiv?.classList.remove('bg-green-400');
    zoomDiv?.classList.remove('bg-green-400');
    rotateDiv?.classList.remove('bg-green-400');
    moveDiv?.classList.add('bg-green-400');
    lengthDiv?.classList.remove('bg-green-400');
    highlightDiv?.classList.remove('bg-green-400');
    brightnessDiv?.classList.remove('bg-green-400');
    pencilDiv?.classList.remove('bg-green-400');
    toolGroup.setToolActive(PanTool.toolName, {
      bindings: [{ mouseButton: csToolsEnums.MouseBindings.Primary }],
    });
    return;
  }

  if (mode === 'length') {
    defaultDiv?.classList.remove('bg-green-400');
    zoomDiv?.classList.remove('bg-green-400');
    rotateDiv?.classList.remove('bg-green-400');
    moveDiv?.classList.remove('bg-green-400');
    lengthDiv?.classList.add('bg-green-400');
    highlightDiv?.classList.remove('bg-green-400');
    brightnessDiv?.classList.remove('bg-green-400');
    pencilDiv?.classList.remove('bg-green-400');
    toolGroup.setToolActive(LengthTool.toolName, {
      bindings: [{ mouseButton: csToolsEnums.MouseBindings.Primary }],
      modifierKey: csToolsEnums.KeyboardBindings.Ctrl,
    });
    return;
  }

  if (mode === 'highlight') {
    defaultDiv?.classList.remove('bg-green-400');
    zoomDiv?.classList.remove('bg-green-400');
    rotateDiv?.classList.remove('bg-green-400');
    moveDiv?.classList.remove('bg-green-400');
    lengthDiv?.classList.remove('bg-green-400');
    highlightDiv?.classList.add('bg-green-400');
    brightnessDiv?.classList.remove('bg-green-400');
    pencilDiv?.classList.remove('bg-green-400');
    toolGroup.setToolActive(CircleROITool.toolName, {
      bindings: [{ mouseButton: csToolsEnums.MouseBindings.Primary }],
      modifierKey: csToolsEnums.KeyboardBindings.Ctrl,
    });
    return;
  }

  if (mode === 'brightness') {
    defaultDiv?.classList.remove('bg-green-400');
    zoomDiv?.classList.remove('bg-green-400');
    rotateDiv?.classList.remove('bg-green-400');
    moveDiv?.classList.remove('bg-green-400');
    lengthDiv?.classList.remove('bg-green-400');
    highlightDiv?.classList.remove('bg-green-400');
    brightnessDiv?.classList.add('bg-green-400');
    pencilDiv?.classList.remove('bg-green-400');
    toolGroup.setToolActive(WindowLevelTool.toolName, {
      bindings: [{ mouseButton: csToolsEnums.MouseBindings.Primary }],
    });
    return;
  }

  if (mode === 'pencil') {
    defaultDiv?.classList.remove('bg-green-400');
    zoomDiv?.classList.remove('bg-green-400');
    rotateDiv?.classList.remove('bg-green-400');
    moveDiv?.classList.remove('bg-green-400');
    lengthDiv?.classList.remove('bg-green-400');
    highlightDiv?.classList.remove('bg-green-400');
    brightnessDiv?.classList.remove('bg-green-400');
    pencilDiv?.classList.add('bg-green-400');
    toolGroup.setToolActive(BrushTool.toolName, {
      bindings: [{ mouseButton: csToolsEnums.MouseBindings.Primary }],
    });
    return;
  }
}

defaultDiv?.addEventListener('click', () => setTool('default'));
zoomDiv?.addEventListener('click', () => setTool('zoom'));
rotateDiv?.addEventListener('click', () => setTool('rotate'));
moveDiv?.addEventListener('click', () => setTool('move'));
lengthDiv?.addEventListener('click', () => setTool('length'));
highlightDiv?.addEventListener('click', () => setTool('highlight'));
brightnessDiv?.addEventListener('click', () => setTool('brightness'));
pencilDiv?.addEventListener('click', () => setTool('pencil'));

run();
