// src/Icosahedron.jsx
import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three'; // Đảm bảo đã import THREE
import { useTexture } from '@react-three/drei';

// NHẮC LẠI: Đảm bảo đường dẫn này là tuyệt đối từ thư mục /public
const texturePaths = [
  '/images/Sphere1.jpg',
  '/images/Sphere2.jpg',
  '/images/Sphere3.jpg',
  '/images/Sphere4.jpg',
  '/images/Sphere5.jpg',
  '/images/Sphere6.jpg',
  '/images/Sphere7.jpg',
  '/images/Sphere8.jpg',
  '/images/Sphere9.jpg',
  '/images/Sphere10.jpg',
  '/images/Sphere11.jpg',
  '/images/Sphere12.jpg',
  '/images/Sphere13.jpg',
  '/images/Sphere14.jpg',
  '/images/Sphere15.jpg',
  '/images/Sphere16.jpg',
  '/images/Sphere17.jpg',
  '/images/Sphere18.jpg',
  '/images/Sphere19.jpg',
  '/images/Sphere20.jpg',
];

export function Icosahedron() {
  const groupRef = useRef();
  const innerMeshRef = useRef();

  const textures = useTexture(texturePaths);

  const materials = textures.map(texture => new THREE.MeshStandardMaterial({
    map: texture,
    side: THREE.DoubleSide,
    flatShading: true,
  }));

  // THAY THẾ TOÀN BỘ useEffect BẰNG KHỐI NÀY
  useEffect(() => {
    // === BƯỚC 1: CẤU HÌNH TEXTURE (LOGIC "COVER") ===
    // 1.0 = không zoom (vừa khít "cover")
    // 1.5 = zoom in 1.5x (ảnh lớn hơn, thấy ít chi tiết hơn)
    // 0.8 = zoom out 0.8x (ảnh nhỏ hơn, thấy nhiều chi tiết hơn)
    const zoomFactor = 1;



    if (textures && textures.length > 0 && textures[0].image) {
      const faceAspect = 1.0; 
      textures.forEach(tex => {
        const texAspect = tex.image.width / tex.image.height;
        tex.repeat.set(1, 1);
        tex.center.set(0.5, 0.5); 
        if (texAspect > faceAspect) {
          tex.repeat.y = faceAspect / texAspect;
        } else {
          tex.repeat.x = texAspect / faceAspect;
        }

        tex.repeat.x /= zoomFactor;
        tex.repeat.y /= zoomFactor;
        tex.needsUpdate = true;
      });
    }

    // === BƯỚC 2: SỬA GEOMETRY VÀ GÁN VẬT LIỆU ===
    if (innerMeshRef.current && materials.length > 0) {
      const oldGeometry = innerMeshRef.current.geometry;
      const newGeometry = oldGeometry.toNonIndexed(); // "Unweld" các mặt

      if (newGeometry) {
        const positions = newGeometry.attributes.position;
        const uvs = newGeometry.attributes.uv;
        const faceCount = positions.count / 3; // 20 mặt

        // ▼▼▼▼▼▼ SỬA LOGIC UV TẠI ĐÂY ▼▼▼▼▼▼
        // Lặp qua từng mặt (mỗi mặt có 3 đỉnh)
        for (let i = 0; i < faceCount; i++) {
          const i0 = i * 3 + 0;
          const i1 = i * 3 + 1;
          const i2 = i * 3 + 2;

          // Lấy tọa độ Y 3D của 3 đỉnh
          const y0 = positions.getY(i0);
          const y1 = positions.getY(i1);
          const y2 = positions.getY(i2);

          // Sắp xếp 3 đỉnh theo tọa độ Y (từ cao xuống thấp)
          const vertices = [
            { y: y0, i: i0 },
            { y: y1, i: i1 },
            { y: y2, i: i2 },
          ];
          vertices.sort((a, b) => b.y - a.y); // Sắp xếp giảm dần

          // Đỉnh cao nhất là 'top', 2 đỉnh còn lại là 'bot1' và 'bot2'
          const top = vertices[0];
          const bot1 = vertices[1];
          const bot2 = vertices[2];

          // Lấy tọa độ XZ (2D trên mặt đất) của 3 đỉnh
          const top_xz = new THREE.Vector2(positions.getX(top.i), positions.getZ(top.i));
          const bot1_xz = new THREE.Vector2(positions.getX(bot1.i), positions.getZ(bot1.i));
          const bot2_xz = new THREE.Vector2(positions.getX(bot2.i), positions.getZ(bot2.i));

          // Tìm trung điểm của 2 đỉnh dưới
          const center_xz = new THREE.Vector2().addVectors(bot1_xz, bot2_xz).multiplyScalar(0.5);
          // Tìm vector "đi xuống" (từ đỉnh trên -> trung điểm dưới)
          const vecDown = new THREE.Vector2().subVectors(center_xz, top_xz);
          // Tìm vector "sang phải" (xoay 90 độ vector "đi xuống")
          const vecRight = new THREE.Vector2(vecDown.y, -vecDown.x).normalize();
          
          // Kiểm tra xem bot1 hay bot2 nằm bên "phải"
          const vecToBot1 = new THREE.Vector2().subVectors(bot1_xz, center_xz);
          const dot = vecToBot1.dot(vecRight);

          // Gán UVs dựa trên logic
          uvs.setXY(top.i, 0.5, 1); // Đỉnh trên cùng luôn là (0.5, 1)
          if (dot > 0) {
            // bot1 nằm bên phải
            uvs.setXY(bot1.i, 1, 0); // Dưới-phải
            uvs.setXY(bot2.i, 0, 0); // Dưới-trái
          } else {
            // bot2 nằm bên phải
            uvs.setXY(bot1.i, 0, 0); // Dưới-trái
            uvs.setXY(bot2.i, 1, 0); // Dưới-phải
          }
        }
        uvs.needsUpdate = true;
        // ▲▲▲▲▲▲ KẾT THÚC SỬA LOGIC UV ▲▲▲▲▲▲

        // Gán lại các nhóm vật liệu
        newGeometry.clearGroups();
        for (let i = 0; i < faceCount; i++) {
          newGeometry.addGroup(i * 3, 3, i % materials.length);
        }

        // Gán geometry và vật liệu mới
        innerMeshRef.current.geometry = newGeometry;
        innerMeshRef.current.material = materials;

        // Xóa geometry cũ để tránh rò rỉ bộ nhớ
        oldGeometry.dispose();
      }
    }
  }, [materials, textures]); // Chạy effect này khi materials và textures sẵn sàng

  useFrame((state) => {
    // Logic xoay (giữ nguyên)
    if (groupRef.current) {
      const autoRotateY = state.clock.getElapsedTime() * 0.4;
      const hoverRotateY = (state.pointer.x * Math.PI) / 3;
      const hoverRotateX = -(state.pointer.y * Math.PI) / 3;
      
      groupRef.current.rotation.y += ((autoRotateY + hoverRotateY) - groupRef.current.rotation.y) * 0.05;
      groupRef.current.rotation.x += (hoverRotateX - groupRef.current.rotation.x) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={innerMeshRef} castShadow receiveShadow>
        <icosahedronGeometry args={[2, 0]} />

      </mesh>
    </group>
  );
}