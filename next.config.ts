import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/stock-movement",
        destination: "/stock-movements",
        permanent: true,
      },
      {
        source: "/stock-movement/new",
        destination: "/stock-movements/new",
        permanent: true,
      },
      {
        source: "/stock-movements/create",
        destination: "/stock-movements/new",
        permanent: true,
      },
      {
        source: "/stok-hareketleri",
        destination: "/stock-movements",
        permanent: true,
      },
      {
        source: "/stok-hareketi",
        destination: "/stock-movements",
        permanent: true,
      },
      {
        source: "/stok-hareketi-ekle",
        destination: "/stock-movements/new",
        permanent: true,
      },
      {
        source: "/stok-hareketleri/yeni",
        destination: "/stock-movements/new",
        permanent: true,
      },
      {
        source: "/products/create",
        destination: "/products/new",
        permanent: true,
      },
      {
        source: "/categories/create",
        destination: "/categories/new",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
