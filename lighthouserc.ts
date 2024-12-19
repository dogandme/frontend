module.exports = {
  ci: {
    collect: {
      url: ["http://localhost:3000/"],
      startServerCommand: "npm run dev",
      staticDistDir: "./dist",
      isSinglePageApplication: true,
    },
    upload: {
      // 실행 결과를 로컬 파일이 아닌 구글에서 제공하는 temporary-public-storage에 업로드
      target: "temporary-public-storage",
    },
  },
};
