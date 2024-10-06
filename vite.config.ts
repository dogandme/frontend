import path from "path";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      // svgr options: https://react-svgr.com/docs/options/
      include: "**/*.svg", // svg 파일을 react 컴포넌트로 변환
    }),
  ],
  /**
   * public 폴더는 빌드할 때 그대로 복사됩니다.
   * 이 폴더에는 이미지, 폰트, 기타 정적 파일이 포함됩니다.
   */
  publicDir: "public",
  resolve: {
    alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
  },
  /**
   * 빌드 시 env 파일을 객체 형태로 저장하여 빌드하도록 합니다.
   */
  define: {
    "process.env": process.env,
  },
});
