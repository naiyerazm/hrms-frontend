export default function proxy() {
  return {
    "/api/**": {
      target: "http://localhost:8000",
      rewrite: (path) => path.replace(/^\/api/, ""),
    },
  };
}
