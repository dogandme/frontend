module.exports = {
  ci: {
    collect: {
      url: ["http://localhost:3000/"],
      startServerCommand: "npm run dev",
      staticDistDir: "./dist",
      isSinglePageApplication: true,
    },
    assert: {
      assertions: {
        "categories:performance": [
          "warn",
          { minScore: 0.8 },
          "error",
          { minScore: 0.6 },
        ],
        "categories:accessibility": [
          "warn",
          { minScore: 0.8 },
          "error",
          { minScore: 0.6 },
        ],
        "categories:best-practices": [
          "warn",
          { minScore: 0.8 },
          "error",
          { minScore: 0.6 },
        ],
        "categories:seo": [
          "warn",
          { minScore: 0.8 },
          "error",
          { minScore: 0.6 },
        ],
        "categories:pwa": [
          "warn",
          { minScore: 0.8 },
          "error",
          { minScore: 0.6 },
        ],
        "first-contentful-paint": [
          "warn",
          { maxNumericValue: 2000 },
          "error",
          { maxNumericValue: 4000 },
        ],
        "speed-index": [
          "warn",
          { maxNumericValue: 3000 },
          "error",
          { maxNumericValue: 5000 },
        ],
        "largest-contentful-paint": [
          "warn",
          { maxNumericValue: 2500 },
          "error",
          { maxNumericValue: 4000 },
        ],
        interactive: [
          "warn",
          { maxNumericValue: 3000 },
          "error",
          { maxNumericValue: 5000 },
        ],
        "total-blocking-time": [
          "warn",
          { maxNumericValue: 300 },
          "error",
          { maxNumericValue: 600 },
        ],
        "cumulative-layout-shift": [
          "warn",
          { maxNumericValue: 0.1 },
          "error",
          { maxNumericValue: 0.25 },
        ],
      },
    },
    upload: {
      // 실행 결과를 로컬 파일이 아닌 구글에서 제공하는 temporary-public-storage에 업로드
      target: "temporary-public-storage",
    },
  },
};
