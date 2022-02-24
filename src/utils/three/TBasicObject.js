import { BoxBufferGeometry, Mesh, MeshStandardMaterial } from "three";

export const basicObjectList = [];

// 地面
const stage = new Mesh(
  // 几何对象
  new BoxBufferGeometry(10000, 10, 10000),
  // 网格标准材质
  new MeshStandardMaterial({ color: 0xffffff, metalness: 1 })
);
stage.name = "stage";
// 地面位置
stage.position.y = -5;
stage.position.x = 3000;
stage.position.z = -4000;
// 是否接收阴影
stage.receiveShadow = false;

basicObjectList.push(stage);
