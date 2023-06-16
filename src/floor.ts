import * as THREE from "three";

export class Floor extends THREE.Mesh {
  public constructor(width?: number, height?: number) {
    const geometry = new THREE.PlaneGeometry(width, height);
    const material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
    super(geometry, material);
  }
}
